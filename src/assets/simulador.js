
let simulador = (moment) => {
  const conf = JSON.parse(localStorage.getItem('config'))?.simulador;
  const listadoTasas = JSON.parse(localStorage.getItem('listadoTasas'));
  const motor = JSON.parse(localStorage.getItem('motor'));

  if (!moment) new Error('error: momment library is missing, please include it');

  /*const env = {
    siif_smmlv: 1160000,
    siif_centralesRiesgo: 3160,
    siif_cargosFijos: [50, 51, 52, 53, 54, 56, 57, 58],
    tasaI: tasas.tasaI,
    tasaG: tasas.tasaG,
    tasaE: tasas.tasaE,
    p4m: 0.4,
  }*/

  _costoDesembolso = (miembro) => {
    return miembro.desembolso.tipoDesembolso.id === 2 ?
      miembro.desembolso.banco.costoDesembolso :
      miembro.desembolso.tipoDesembolso.costoDesembolso;
  }

  const _canalDesembolso = (solicitud) => {
    return solicitud.miembros.reduce((sum, m) => {
      if (m.tipoMiembro.id <= 3 || m.tipoMiembro.id === 6) {
        sum += _costoDesembolso(m);
      }

      return sum;
    }, 0);
  }

  const _clientesContrato = (miembros) => {
    return miembros.filter(m => m.tipoMiembro.id <= 3 || m.tipoMiembro.id === 6).length;
  }

  _tipoDeNegocio = (obj) => {

    /*
    TIPODENEGOCIO
    1    individual
    2    individual renovacion
    3    grupal
    4    grupal renovacion
    5    experto
    6    experto rtenovacion
    7   individual con garantia
    8   renovacion individual con garantia
    */

    let nm = 0;//num miembros
    let nl = 0;
    let ne = 0;
    for (let m of obj.miembros) {
      switch (m.tipoMiembro.id) {
        case 1:
          nl++;
          break;
        case 2:
          nm++;
          break;
        case 3:
          ne++;
          break;
        case 6:
          nl++;
          break;
      }
    }

    //tradicional
    if (typeof obj.renovacion == 'undefined' || (typeof obj.renovacion != 'undefined' && obj.renovacion.tipoRenovacion != "AA" && obj.renovacion.tipoRenovacion != "AAA")) {
      if (nm > 0) {//si hay miembros es grupal
        return 3;
      }
      else {
        if (nl > 0) {//hay un lider y no hay miembros, es individual
          if (obj.miembros.length == 1) {
            if (obj.usuarioRegistra.fng) {//FNG
              return 9;
            }
            else {
              return 7;
            }
          }
          else {
            return 1;
          }
        }
        else {//experto
          return 5;
        }
      }
    }
    else {//renovacion
      //console.log("renovacion premium");
      if (nm > 0) {//si hay miembros es grupal
        return 4;
      }
      else {
        if (nl > 0) {//hay un lider y no hay miembros, es individual
          if (obj.miembros.length == 1) {
            if (obj.usuarioRegistra.fng) {//FNG
              return 10;
            }
            else {
              return 8;
            }
          }
          else {
            return 2;
          }
        }
        else {//experto
          return 6;
        }
      }
    }
  }

  _planDeInteres = (obj, env, montoPrestado, municipio, usuario, aplicaFNG) => {

    let esRenovacion = typeof obj.renovacion !== "undefined" ? 1 : 0;
    let esFNG = aplicaFNG;
    let esPlus = typeof obj.tipoSolicitud.plus == 'undefined' ? 0 : 1;


    if (typeof obj.renovacion !== "undefined" && (obj.renovacion.tipoRenovacion === 'AA' || obj.renovacion.tipoRenovacion === 'AAA')) {
      esRenovacion = 1;
    }

    //iterrar en el listado
    //idClasificacion:2,desdeSMMLV: 0,hastaSMMLV: 6,tipoSolicitud: 2,renovacion: false,

    if (montoPrestado <= (conf.siif_smmlv * 50)) {

      for (let p of listadoTasas) {
        //console.log("tipoSolicitud",obj.tipoSolicitud.id);
        if (obj.tipoSolicitud.id == p.tipoSolicitud) {
          //console.log("Es el tipo de solicitud",p.tipoSolicitud);
          if (municipio.marcacionCredito.idClasificacion == p.idClasificacion) {
            //console.log("es tipo ",p.idClasificacion);
            if (esRenovacion === p.renovacion) {
              //console.log("Es renovacion",esRenovacion,p.renovacion);
              if (esFNG === p.fng) {
                //console.log("Es fng",esFNG,p.fng);
                if (esPlus === p.plus) {
                  //console.log("Es plus",esPlus,p.plus);

                  if (montoPrestado > (conf.siif_smmlv * 6)) {
                    //console.log("Mayor que 6smmlv");
                  }
                  else {
                    //console.log("Menor que 6smmlv");
                  }

                  if (montoPrestado > (p.desdeSMMLV * conf.siif_smmlv) && montoPrestado <= (p.hastaSMMLV * conf.siif_smmlv)) {
                    //console.log("En el rango ",montoPrestado,">",(p.desdeSMMLV*conf.siif_smmlv)," && ",montoPrestado,"<=",(p.hastaSMMLV*env.siif_smmlv));
                    //console.log(p.rta);
                    return p.rta;
                  }
                }
              }
            }
          }
        }
      }
    }
    else {
      return { NUMERODELPLANDEINTERES: "", tasa: "N/A", TIPODENEGOCIO: 0, tipo: 'Monto prestado(' + new Intl.NumberFormat('de-DE').format(montoPrestado) + ') supera los 50 SMMLV' };
    }
    return { NUMERODELPLANDEINTERES: 0, tasa: "N/A", TIPODENEGOCIO: 0, tipo: 'Tasa no existe' };

  }



  const sumCuotas = ({ miembros }) => {
    return miembros?.reduce((sum, m) =>
      [4, 5].includes(m.tipoMiembro.id) ?
        sum :
        sum + m.solicitudEconomica.valoresDetalles.monto,
      0);
  }

  const lider = (miembros) => {
    const n = miembros.length;
    for (let i = 0; i < n; i++) {
      if (miembros[i].tipoMiembro.id === 1 || miembros[i].tipoMiembro.id === 3 || miembros[i].tipoMiembro.id === 6) {
        return miembros[i];
      }
    }
    return null;
  }


  const getMesFNG = (plazo, listadoComisiones, producto) => {

    let mes = null;
    for (let c of listadoComisiones) {
      if (producto === c.nombreProducto) {
        mes = c.comisionTasas.find((m) => {
          return m.meses == plazo;
        });
      }
    }
    return mes;

  }

  const getTasaFNG = (mes) => {

    if (mes) {
      let pfga = mes.comision / 100;
      let ivafga = pfga * 0.19;
      return { pfga: pfga, ivafga: ivafga, mes: mes };
    } else {
      //sin tasa
      return { pfga: 0, ivafga: 0, mes: null };
    }

  }

  const cuotaGrupal = (data, fechaCredito) => {
    try {
      const listadoComisiones = JSON.parse(localStorage.getItem('listadoComisiones'));
      let cuotaTotal = sumCuotas(data);
      if (cuotaTotal > 0) {
        //sumar el saldo de recogida renovacion
        if (data.renovacion) {
          let suma = cuotaTotal + data.renovacion.saldo;
          console.log("Es renovacion, sumar saldo recogida, ", cuotaTotal, "+", data.renovacion.saldo, "=", suma);
          cuotaTotal = suma;
        }

        const dataLider = lider(data.miembros);
        const canalDesembolso = _canalDesembolso(data);
        const clientesContrato = _clientesContrato(data.miembros);

        let munSim = dataLider.datosComerciales.ciudad;

        //si tiene direccion comercial
        if (dataLider.datosComerciales.negocioEnVivienda == true || dataLider.datosComerciales.ambulanteConUbicacionFIja == true || dataLider.datosComerciales.ambulante == true) {
          //console.log("Negocio en vivienda");
          munSim = dataLider.datosContactoCliente.ciudad;
        }





        console.log("Municipio de simulacion", munSim);

        if (munSim.divipolam.length > 0 && typeof munSim.marcacionCredito !== "undefined") {

          let objr = {
            montoSolicitado: cuotaTotal,
            montoPrestado: 0,
            cuota: 0,
            pagos: [],
            cargosFijos: []
          }
          const fecha = moment(fechaCredito).format("YYYY-MM-DD");
          let fechaf;
          const fechaInicial = moment(fecha);
          const dia = moment(fecha).format("D");
          moment(fechaInicial).endOf("month").format("YYYY-MM-DD");

          let diaPago = typeof dataLider.solicitudEconomica.valoresDetalles.fechaPago !== 'undefined' ? dataLider.solicitudEconomica.valoresDetalles.fechaPago.dia.toString().padStart(2, '0') : dia.toString();
          if (Number(dia) > Number(diaPago)) {
            var fecha1 = moment(fecha).add(2, "month");
            fechaf = moment(fecha1).format("YYYY-MM-" + diaPago);
          }
          else {
            fechaf = moment(fecha).add(1, "month").format("YYYY-MM-" + diaPago);
          }

          const interesPrimCuota = Days360(fecha, fechaf);


          objr["diaDesembolso"] = dia;
          objr["diaDePago"] = diaPago;
          objr["fechaDesembolso"] = fecha;
          objr["fechaPago"] = fechaf;


          const iva = cuotaTotal <= (conf.siif_smmlv * 4) ? 7.5 / 100 : 4.5 / 100;
          const plazo = dataLider.solicitudEconomica.valoresDetalles.plazoMeses.meses;
          const com = iva * (Math.min(plazo, 12) / 12);
          const c4m = (conf.p4m / 100);
          let ivaCom = (com * (19 / 100));
          //const pfga = (6.6/100);
          //const ivafga = (1.254/100);
          const svd = (((0.12 / 100) * plazo) * clientesContrato);
          let seguros = sumSeguros(data);
          const segurosVoluntariosT = (plazo * seguros);
          //const centralesRiesgoT = conf.tasas.siif_centralesRiesgo * (grupal===false?clientesContrato:);
          const centralesRiesgoT = conf.siif_centralesRiesgo * data.miembros.length;


          //canales premium
          let cfcp = {}
          let totcf = 0;
          for (let m of data.miembros) {

            //tiene el objeto canalesPremium y no es un codeudor
            if (m?.desembolso?.canalesPremium && [1, 2, 3, 6].includes(m.tipoMiembro.id)) {
              for (let cp of m.desembolso.canalesPremium) {

                if (typeof cfcp[cp.cf] == "undefined") {
                  cfcp[cp.cf] = {
                    valor: 0,
                    canal: cp.canal
                  };
                }

                if (cp.aprobado === true) {//solo si fue aprobado
                  cfcp[cp.cf].valor += cp.valor * plazo;
                  totcf += cp.valor * plazo;
                }
              }
            }
          }

          let ivacf = 0;
          if (totcf > 0) {
            ivacf = totcf * 0.19;
            console.log("Iva canales premium", ivacf);
          }

          let sup0t = (cuotaTotal + segurosVoluntariosT + centralesRiesgoT + canalDesembolso + totcf + ivacf);


          //obtener tasa fng
          let mesFNG319 = getMesFNG(plazo, listadoComisiones, "EMP319");
          let mesFNG023 = getMesFNG(plazo, listadoComisiones, "EMP023");

          //simular con las dos comisiones
          let com319 = getTasaFNG(mesFNG319);
          let com023 = getTasaFNG(mesFNG023);

          let tasaFNGt = { pfga: 0, ivafga: 0, mes: null };

          let inf0t319 = (1 - com - svd - ivaCom - c4m - com319.pfga - com319.ivafga);
          let inf0t023 = (1 - com - svd - ivaCom - c4m - com023.pfga - com023.ivafga);

          let montoPrestadot319 = (sup0t / inf0t319).toFixed(2);
          let montoPrestadot023 = (sup0t / inf0t023).toFixed(2);

          if (montoPrestadot319 >= conf.montoMinimoCredito && montoPrestadot319 <= conf.siif_smmlv * 6) {
            console.log("Comision 319");
            tasaFNGt = com319;
          } else if (montoPrestadot023 > conf.siif_smmlv * 6 && montoPrestadot023 <= conf.siif_smmlv * 25) {
            tasaFNGt = com023;
            console.log("Comision 023");
          }


          const comisionSeleccionada = data?.tipoSolicitud?.plus
            || data?.renovacion?.tipoRenovacion === 'A'
            || data?.renovacion?.tipoRenovacion === 'B'
            ? motor.tipoGarantia.find((item) => item.id === 2)
            : motor.tipoGarantia.find((item) => item.id === 1);
          let pfga = comisionSeleccionada.comision / 100;
          let ivafga = pfga * 0.19;


          let debeAplicarFNG = false

          let resultado = dataLider.estudioPreselecta.resultado.split(" - ");

          let score = resultado[1];


          if (score >= 600 && score < 750 && typeof data.tipoSolicitud.plus == 'undefined') {
            debeAplicarFNG = true;
          }
          for (let miembro of data.miembros) {
            if (data.renovacion) {
              if (
                (data.renovacion.simulacion.simulacion.banderaFNG ||
                  data.renovacion.simulacion.simulacion.tasaFNG) &&
                data.tipoSolicitud.id === 4 &&
                typeof data.tipoSolicitud.plus == 'undefined'
              ) {
                objr['banderaFNG'] = true;

                if (tasaFNGt.mes != null) {
                  objr['tasaFNG'] = tasaFNGt.mes;
                  ivafga = tasaFNGt.ivafga;
                  pfga = tasaFNGt.pfga;
                  objr['garantia'] = data.configuracion.garantia.data;
                } else {
                  return {
                    error: 'No se puede encontrar tasa para el mes seleccionado',
                    simulacion: null,
                  };
                }

              } else {
                if (
                  data.tipoSolicitud.id === 4 &&
                  score >= 600 &&
                  score <= 750 &&
                  typeof data.tipoSolicitud.plus == 'undefined'
                ) {
                  //console.log('Es FNG');
                  objr['banderaFNG'] = true;

                  if (tasaFNGt.mes != null) {
                    objr['tasaFNG'] = tasaFNGt.mes;
                    ivafga = tasaFNGt.ivafga;
                    pfga = tasaFNGt.pfga;
                    objr['garantia'] = data.configuracion.garantia.data;
                  } else {
                    return {
                      error: 'No se puede encontrar tasa para el mes seleccionado',
                      simulacion: null,
                    };
                  }
                } else {
                  //console.log('NO aplica FNG, no es credito garantia');
                }
              }
            }




            let sup0 = (cuotaTotal + segurosVoluntariosT + centralesRiesgoT + canalDesembolso + totcf + ivacf);
            let inf0 = (1 - com - svd - ivaCom - c4m);
            let tipoDeNegocio = _tipoDeNegocio(data);

            let montoPrestadot1 = (sup0t / inf0).toFixed(2);
            let mipyme = com * montoPrestadot1;

            if (data.tipoSolicitud.plus) {
              if (
                montoPrestadot1 >= conf.siif_smmlv * 10 &&
                montoPrestadot1 <= conf.siif_smmlv * 25
              ) {
                //console.log(' DENTRO DE montoPrestadot1');
                inf0 = 1 - com - svd - ivaCom - c4m - pfga - ivafga;
                montoPrestadot1 = (sup0t / inf0).toFixed(2);
                mipyme = com * montoPrestadot1;
              } else if (
                montoPrestadot1 >= conf.siif_smmlv * 25 &&
                montoPrestadot1 <= conf.siif_smmlv * 50
              ) {
                ivaCom = 0;
                mipyme = 0;
                inf0 = 1 - svd - ivaCom - c4m - pfga - ivafga;
              }
            } else {

              if ([7, 8, 9, 10].includes(tipoDeNegocio)) {
                inf0 = 1 - com - svd - ivaCom - c4m - pfga - ivafga;
                montoPrestadot1 = (sup0t / inf0).toFixed(2);
                mipyme = com * montoPrestadot1;

              }
            }

            let montoPrestado = (sup0 / inf0).toFixed(2);
            objr.montoPrestado = montoPrestado;


            objr["canalesPremium"] = totcf;
            objr["IVAcanalesPremium"] = ivacf;
            objr["planDeInteres"] = _planDeInteres(data, conf, montoPrestado, munSim, data.usuarioRegistra, typeof objr.tasaFNG != "undefined" ? 1 : 0);

            const seguroVidaDeudores = (objr.montoPrestado * svd);

            //creditos fga
            if ([7, 8, 9, 10].includes(tipoDeNegocio)) {
              console.log('Comisión fga normal');
              objr["ivafga"] = ivafga;
              objr["valivafga"] = (ivafga * montoPrestado).toFixed(2);
              objr["pfga"] = pfga;
              objr["fga"] = (pfga * montoPrestado).toFixed(2);
              console.log("fga - ", objr["fga"]);
            }


            objr["mipyme"] = (mipyme).toFixed(2);
            objr["plazo"] = plazo;
            objr["iva"] = (ivaCom * montoPrestado).toFixed(2);
            objr["centralesRiesgo"] = (centralesRiesgoT).toFixed(2);
            objr["seguroVidaDeudores"] = (seguroVidaDeudores).toFixed(2);
            objr["segurosVoluntarios"] = (segurosVoluntariosT).toFixed(2);
            objr["canalDesembolso"] = (canalDesembolso).toFixed(2);
            objr["v4x1000"] = (c4m * montoPrestado).toFixed(2);
            objr["p4x1000"] = conf.p4m;

            objr.cargosFijos.push({
              codigo: 50,
              monto: seguroVidaDeudores.toFixed(2),
              descripcion: "SEGURO DE VIDA DEUDORES"
            });
            objr.cargosFijos.push({
              codigo: 51,
              monto: segurosVoluntariosT.toFixed(2),
              descripcion: "SEGUROS VOLUNTARIOS"
            });
            objr.cargosFijos.push({
              codigo: 52,
              monto: mipyme.toFixed(2),
              descripcion: "COMISION MIPYME"
            });
            let centrales = centralesRiesgoT;
            objr.cargosFijos.push({
              codigo: 53,
              monto: centrales.toFixed(2),
              descripcion: "CONSULTA CENTRALES"
            });
            objr.cargosFijos.push({
              codigo: 55,
              monto: objr["v4x1000"],
              descripcion: "GMF"
            });
            objr.cargosFijos.push({
              codigo: 56,
              monto: canalDesembolso.toFixed(2),
              descripcion: "COMISION DE RETIRO"
            });
            objr.cargosFijos.push({
              codigo: 57,
              monto: objr.iva,
              descripcion: "IVA COMISION MIPYME"
            });

            //si hay renovacion se agrega el cargo fijo nuevo
            // if (data.renovacion) {
            //   objr.cargosFijos.push({
            //     codigo: 59,
            //     monto: data.renovacion.saldo.toString(),
            //     descripcion: "SALDO RECOGIDA RENOVACION"
            //   });
            // }

            if ([9, 10].includes(tipoDeNegocio)) {

              console.log("Agrega CF FNG");
              objr.cargosFijos.push({
                codigo: 70,
                monto: objr.fga,
                descripcion: "comisión garantía"
              });
              objr.cargosFijos.push({
                codigo: 71,
                monto: objr.valivafga,
                descripcion: "IVA garantía"
              });
            }
            if ([7, 8].includes(tipoDeNegocio)) {
              objr.cargosFijos.push({
                codigo: 60,
                monto: objr.fga,
                descripcion: "comisión garantía"
              });
              objr.cargosFijos.push({
                codigo: 61,
                monto: objr.valivafga,
                descripcion: "IVA garantía"
              });
            }

            if (data.usuarioRegistra.plus) {
              if (data.tipoSolicitud.id == 4) {
                objr.cargosFijos.push({
                  codigo: 60,
                  monto: objr.fgaplus,
                  descripcion: "comisión garantía",
                });
                objr.cargosFijos.push({
                  codigo: 61,
                  monto: objr.valivafga,
                  descripcion: "IVA garantía",
                });
              }
            } else {
              if (data.tipoSolicitud.id == 4) {
                objr.cargosFijos.push({
                  codigo: 60,
                  monto: objr.fga,
                  descripcion: "comisión garantía",
                });
                objr.cargosFijos.push({
                  codigo: 61,
                  monto: objr.valivafga,
                  descripcion: "IVA garantía",
                });
              }
            }

            //cargos fijos de canales premium
            Object.keys(cfcp).map(cf => {


              objr.cargosFijos.push({
                codigo: Number(cf),
                monto: cfcp[cf].valor.toFixed(2),
                descripcion: cfcp[cf].canal
              });


            })

            //agrega cf 73 iva recuado premium bancolombia
            if (totcf > 0) {

              objr.cargosFijos.push({
                codigo: 73,
                monto: ivacf.toFixed(2),
                descripcion: "IVA Recaudo Premium Bancolombia"
              });

            }

            ////////////////ajuste decimales
            //sumar todos los cargos fijos
            let sumcf = 0;
            for (let cf of objr.cargosFijos) {
              ////console.log("Suma",cf.descripcion,cf.monto);
              sumcf += Number(cf.monto);
            }
            sumcf = sumcf;
            ////console.log("Suma de cargos fijos",sumcf);
            ////console.log("Solicitado",cuotaTotal);
            let ajuste = Number(objr.montoPrestado) - Number(sumcf);
            let difajuste = cuotaTotal - ajuste;

            if (difajuste < 1) {
              objr['ajusteDecimales'] = difajuste;

              ////console.log("Total diferencia",objr.montoPrestado,"-",sumcf,"==",difajuste);
              objr.montoPrestado = Number(objr.montoPrestado) + difajuste
              ////console.log("montoPrestado",objr.montoPrestado);
              ajuste = objr.montoPrestado - sumcf
              ////console.log("Recalculo",objr.montoPrestado,"-",sumcf,"==",round(cuotaTotal-ajuste,2));
            }


            //let tasa = tasaCredito(data, env);
            objr["tasa"] = objr["planDeInteres"].tasa;
            let montoAjustado = montoPrestado * ((1 + (objr.tasa / 100)) ** ((interesPrimCuota - 30) / 30));
            let sup = ((objr.tasa / 100) * ((1 + (objr.tasa / 100)) ** plazo));
            let inf = ((1 + (objr.tasa / 100)) ** plazo) - 1;
            let cuotar = (montoAjustado * (sup / inf)).toFixed(2);
            objr.cuota = cuotar;
            let saldoInicialr = montoPrestado;
            for (let i = 0; i < plazo; i++) {
              let c1 = (1 + (objr.tasa / 100));
              let c2 = (interesPrimCuota / 30);
              let c3 = (c1 ** c2) - 1;
              let interes = (saldoInicialr * c3).toFixed(2);
              if (i > 0) {
                interes = (saldoInicialr * (objr.tasa / 100)).toFixed(2);
              }
              let abonoCap = (cuotar - interes).toFixed(2);
              let saldoFinal = (saldoInicialr - abonoCap);
              objr.pagos.push({
                saldoInicial: saldoInicialr,
                abonoCapital: abonoCap,
                intereses: interes,
                cuota: cuotar,
                saldoFinal: Number(saldoFinal.toFixed(2))
              });
              saldoInicialr = (saldoFinal).toFixed(2);
            }
            let listam = [];
            let sumMontosFinanciados = 0;
            for (let miembro of data.miembros) {
              if (miembro.tipoMiembro.id <= 3 || miembro.tipoMiembro.id == 6) {
                let montoSolicitado = cuotaTotal;
                let seguro = getSeguro(miembro);
                let cd = _costoDesembolso(miembro);
                let financiacion = (montoSolicitado + (seguro * plazo)) + cd;
                sumMontosFinanciados += financiacion;
              }
            }
            for (let miembro of data.miembros) {
              if (miembro.tipoMiembro.id <= 3 || miembro.tipoMiembro.id == 6) {
                let montoSolicitado = cuotaTotal;
                let seguro = getSeguro(miembro);
                let cd = _costoDesembolso(miembro);
                let financiacion = (montoSolicitado + (seguro * plazo)) + cd;
                var porcp = financiacion / sumMontosFinanciados;

                listam.push({
                  financiacion: financiacion.toFixed(2),
                  porcentajeParticipacion: porcp.toFixed(2),
                  identificacion: miembro.datosIdentificacionCliente.numeroIdentificacion,
                  nombre: miembro.datosPersonalesCliente.nombre1 + " " + miembro.datosPersonalesCliente.nombre2 + " " + miembro.datosPersonalesCliente.apellido1 + " " + miembro.datosPersonalesCliente.apellido2,
                  cuotaMensual: (cuotar * porcp).toFixed(2)
                });
              }
            }
            objr["cuotasMiembros"] = listam;
            console.log(objr)
            return { error: null, simulacion: objr };
          }
        }
        else {
          return { error: 'El municipio es requerido para la simulación', simulacion: null };
        }


      } else {
        return { error: "La suma de cuotas es 0", simulacion: null };
      }

    } catch (e) {
      console.log(e);
      return { error: e, simulacion: null };
    }
  }

  const simuladorMotor = (data, fechaCredito) => {
    try {
      const listadoComisiones = JSON.parse(localStorage.getItem('listadoComisiones'));

      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> simuladorMotor <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      console.log("Simulacion ", data.idSolicitud);
      console.log("----------- motor ---------------");
      console.log(motor);
      console.log(data.motor);
      console.log(conf);

      const cuotaTotal = sumCuotas(data);
      if (cuotaTotal > 0) {

        const dataLider = lider(data.miembros);
        const canalDesembolso = _canalDesembolso(data);
        const clientesContrato = _clientesContrato(data.miembros);


        let munSim = dataLider.datosComerciales.ciudad;

        //si tiene direccion comercial
        if (dataLider.datosComerciales.negocioEnVivienda == true || dataLider.datosComerciales.ambulanteConUbicacionFIja == true || dataLider.datosComerciales.ambulante == true) {
          //console.log("Negocio en vivienda");
          munSim = dataLider.datosContactoCliente.ciudad;
        }

        ////////////////////////////// motor ////////////////////////////////////////////////////////////////
        console.log("----------------- gener objeto simulacion con la opcion seleccionada -------------------------");
        console.log(data.motor.seleccionActual);
        let sep = data.motor.seleccionActual.split("-");
        let dataMotor = {};
        if (sep.length == 4) {


          let tipoSolicitud = motor.tipoSolicitud.find(t => t.id == Number(sep[0]));
          console.log(tipoSolicitud);
          if (typeof tipoSolicitud == "object") {

            dataMotor["tipoSolicitud"] = tipoSolicitud;
            // data.tipoSolicitud = tipoSolicitud;
            //si tiene garantía y existe en la conf
            if (Number(sep[1]) > 0) {
              let garantia = motor.tipoGarantia.find(t => t.id == Number(sep[1]));
              dataMotor["garantia"] = garantia;
            }

            //el limite
            dataMotor["limite"] = {
              inferior: Number(sep[2]) * conf.siif_smmlv,
              superior: Number(sep[3]) * conf.siif_smmlv
            }
          }
          else {
            return { error: 'El tipo de solicitud de la oferta seleccionada no existe', simulacion: null };
          }
        }
        else {
          return { error: 'La oferta de crédito seleccionada no es válida', simulacion: null };
        }


        console.log("------------------------------------- Data Motor");
        console.log(dataMotor);




        /*if(typeof munSim.marcacionCredito == "undefined"){
            //console.log("El municipio no tiene marcacionCredito, se le asigna");
            let munm = Municipios.data.filter(m=>{
            return m.divipolam==munSim.divipolam;
            })
            if(munm.length==1){
            munSim=munm[0];
            }
        }*/

        console.log("Municipio de simulacion", munSim);

        if (munSim.divipolam.length > 0 && typeof munSim.marcacionCredito !== "undefined") {

          let objr = {
            montoSolicitado: cuotaTotal,
            montoPrestado: 0,
            cuota: 0,
            pagos: [],
            cargosFijos: [],
            dataMotor: dataMotor
          }
          const fecha = moment(fechaCredito).format("YYYY-MM-DD");
          let fechaf;
          const fechaInicial = moment(fecha);
          const dia = moment(fecha).format("D");
          moment(fechaInicial).endOf("month").format("YYYY-MM-DD");


          let diaPago = typeof dataLider.solicitudEconomica.valoresDetalles.fechaPago !== 'undefined' ? dataLider.solicitudEconomica.valoresDetalles.fechaPago.dia.toString().padStart(2, '0') : dia.toString();
          if (Number(dia) > Number(diaPago)) {
            var fecha1 = moment(fecha).add(2, "month");
            fechaf = moment(fecha1).format("YYYY-MM-" + diaPago);
          }
          else {
            fechaf = moment(fecha).add(1, "month").format("YYYY-MM-" + diaPago);
          }


          const interesPrimCuota = Days360(fecha, fechaf);

          objr["diaDesembolso"] = dia;
          objr["diaDePago"] = diaPago;
          objr["fechaDesembolso"] = fecha;
          objr["fechaPago"] = fechaf;


          const iva = cuotaTotal <= (conf.siif_smmlv * 4) ? 7.5 / 100 : 4.5 / 100;
          const plazo = dataLider.solicitudEconomica.valoresDetalles.plazoMeses.meses;
          const com = iva * (Math.min(plazo, 12) / 12);
          const c4m = (conf.p4m / 100);
          let ivaCom = (com * (19 / 100));
          const svd = (((0.12 / 100) * plazo) * clientesContrato);
          let seguros = sumSeguros(data);
          const segurosVoluntariosT = (plazo * seguros);
          //const centralesRiesgoT = env.siif_centralesRiesgo * (grupal===false?clientesContrato:);
          const centralesRiesgoT = conf.siif_centralesRiesgo * data.miembros.length;


          //canales premium
          let cfcp = {}
          let totcf = 0;
          for (let m of data.miembros) {

            //tiene el objeto canalesPremium y no es un codeudor
            if (m?.desembolso?.canalesPremium && [1, 2, 3, 6].includes(m.tipoMiembro.id)) {
              for (let cp of m.desembolso.canalesPremium) {

                if (typeof cfcp[cp.cf] == "undefined") {
                  cfcp[cp.cf] = {
                    valor: 0,
                    canal: cp.canal
                  };
                }

                if (cp.aprobado === true) {//solo si fue aprobado
                  cfcp[cp.cf].valor += cp.valor * plazo;
                  totcf += cp.valor * plazo;
                }
              }
            }
          }

          let ivacf = 0;
          if (totcf > 0) {
            ivacf = totcf * 0.19;
            console.log("Iva canales premium", ivacf);
          }


          let sup0t = (cuotaTotal + segurosVoluntariosT + centralesRiesgoT + canalDesembolso + totcf + ivacf);



          let pfga = 0;
          let ivafga = 0;

          let tasaFNGt = { pfga: 0, ivafga: 0, mes: null };

          const esCreditoSoat = !!(
            data?.tipoSolicitud?.soat ||
            data?.miembros?.some((m) => m?.soat || m?.tipoMiembro?.soat === true)
          );



          if (dataMotor.garantia) {//si hay garantia

            if (dataMotor.garantia.id == 3) {//solo fng

              //obtener tasa fng
              let mesFNG319 = getMesFNG(plazo, listadoComisiones, "EMP319");
              let mesFNG023 = getMesFNG(plazo, listadoComisiones, "EMP023");

              //simular con las dos comisiones
              let com319 = getTasaFNG(mesFNG319);
              let com023 = getTasaFNG(mesFNG023);

              let inf0t319 = (1 - com - svd - ivaCom - c4m - com319.pfga - com319.ivafga);
              let inf0t023 = (1 - com - svd - ivaCom - c4m - com023.pfga - com023.ivafga);

              let montoPrestadot319 = (sup0t / inf0t319).toFixed(2)
              let montoPrestadot023 = (sup0t / inf0t023).toFixed(2);

              if (esCreditoSoat) {
                if (montoPrestadot319 <= conf.siif_smmlv * 6) {
                  tasaFNGt = com319;
                }
              } else {

                if (montoPrestadot319 >= conf.montoMinimoCredito && montoPrestadot319 <= conf.siif_smmlv * 6) {
                  tasaFNGt = com319;
                } else if (montoPrestadot023 > conf.siif_smmlv * 6 && montoPrestadot023 <= conf.siif_smmlv * 25) {
                  tasaFNGt = com023;
                }
              }
            }
            else {
              if (dataMotor.garantia.comision) {
                console.log("Trae garantia FGA");
                pfga = (dataMotor.garantia.comision / 100);
                ivafga = pfga * 0.19;
              }
            }
          }

          //poner bandera
          if (data.renovacion) {
            if ((data.renovacion.simulacion.simulacion.banderaFNG || data.renovacion.simulacion.simulacion.tasaFNG) && data.tipoSolicitud.id === 4 && dataMotor.garantia.id == 3) {
              objr['banderaFNG'] = true;
              //tasaFNGt = getTasaFNG(plazo, montoPrestadot, listadoComisiones, env);
              if (tasaFNGt.mes != null) {

                objr['tasaFNG'] = tasaFNGt.mes;
                ivafga = tasaFNGt.ivafga;
                pfga = tasaFNGt.pfga;
                objr['garantia'] = data.configuracion.garantia.data;

              } else {
                return {
                  error: 'No se puede encontrar tasa para el mes seleccionado',
                  simulacion: null,
                };
              }
            }
          }
          else {

            if (dataMotor?.garantia?.id && dataMotor.garantia.id == 3) {
              objr['banderaFNG'] = true;
              //tasaFNGt = getTasaFNG(plazo,montoPrestadot,listadoComisiones,env,);

              if (tasaFNGt.mes != null) {
                objr['tasaFNG'] = tasaFNGt.mes;
                ivafga = tasaFNGt.ivafga;
                pfga = tasaFNGt.pfga;
                objr['garantia'] = data.configuracion.garantia.data;
              } else {
                return {
                  error: 'No se puede encontrar tasa para el mes seleccionado',
                  simulacion: null,
                };
              }
            }
          }



          let sup0 = (cuotaTotal + segurosVoluntariosT + centralesRiesgoT + canalDesembolso + totcf + ivacf);
          let inf0 = (1 - com - svd - ivaCom - c4m);
          let tipoDeNegocio = _tipoDeNegocio(data);

          let montoPrestadot1 = (sup0t / inf0).toFixed(2);
          let mipyme = com * montoPrestadot1;

          if (data.tipoSolicitud.plus) {
            if (
              data.motor.seleccionActual === "4-2-25-50"
            ) {

              ivaCom = 0;
              mipyme = 0;
              inf0 = 1 - svd - ivaCom - c4m - pfga - ivafga;

            } else if (montoPrestadot1 >= conf.siif_smmlv * 10 &&
              montoPrestadot1 <= conf.siif_smmlv * 25) {
              //console.log(' DENTRO DE montoPrestadot1');
              inf0 = 1 - com - svd - ivaCom - c4m - pfga - ivafga;
              montoPrestadot1 = (sup0t / inf0).toFixed(2);
              mipyme = com * montoPrestadot1;
            }
          } else {

            if ([7, 8, 9, 10].includes(tipoDeNegocio)) {
              inf0 = 1 - com - svd - ivaCom - c4m - pfga - ivafga;
              montoPrestadot1 = (sup0t / inf0).toFixed(2);
              mipyme = com * montoPrestadot1;

            }
          }

          let montoPrestado = (sup0 / inf0).toFixed(2);
          objr.montoPrestado = montoPrestado;

          objr["canalesPremium"] = totcf;
          objr["IVAcanalesPremium"] = ivacf;


          //el tipo de credito
          //objr["planDeInteres"]=this.planDeInteres(data,env,montoPrestado,objr);
          //objr['planDeInteres'] = planDeInteres(data, env, montoPrestado,munSim,usuario);
          objr['planDeInteres'] = _planDeInteres(data, conf, montoPrestado, munSim, data.usuarioRegistra, typeof objr.tasaFNG != "undefined" ? 1 : 0);

          const seguroVidaDeudores = (objr.montoPrestado * svd);

          //creditos fga
          if ([7, 8, 9, 10].includes(tipoDeNegocio)) {
            objr["ivafga"] = ivafga;
            objr["valivafga"] = (ivafga * montoPrestado).toFixed(2);
            objr["pfga"] = pfga;
            objr["fga"] = (pfga * montoPrestado).toFixed(2);
            objr["valorGarantia"] = (pfga * montoPrestado).toFixed(2)

          }

          /*if(data.garantia){
              ////console.log("La solicitud tiene garantia");
              objr["garantia"]=data.garantia;
          }*/

          //console.log("mipyme",mipyme);

          objr["mipyme"] = (mipyme).toFixed(2);
          //console.log("mipymeRound",objr["mipyme"]);
          objr["plazo"] = plazo;
          objr["iva"] = (ivaCom * montoPrestado).toFixed(2);
          objr["centralesRiesgo"] = (centralesRiesgoT).toFixed(2);
          objr["seguroVidaDeudores"] = (seguroVidaDeudores).toFixed(2);
          objr["segurosVoluntarios"] = (segurosVoluntariosT).toFixed(2);
          objr["canalDesembolso"] = (canalDesembolso).toFixed(2);
          objr["v4x1000"] = (c4m * montoPrestado).toFixed(2)
          objr["p4x1000"] = conf.p4m;
          objr["montoSolicitado"] = cuotaTotal;
          objr["v4x1000"] = (c4m * montoPrestado).toFixed(2);

          objr.cargosFijos.push({
            codigo: 50,
            monto: objr.seguroVidaDeudores,
            descripcion: "SEGURO DE VIDA DEUDORES"
          });


          //agrega los cargos fijos por grupo
          const sumgrupos = sumSeguros(data, plazo);
          console.log("sumgrupos");
          console.log(sumgrupos);

          Object.keys(sumgrupos).map(s => {
            objr.cargosFijos.push({
              codigo: sumgrupos[s].cf,
              monto: sumgrupos[s].suma,
              descripcion: sumgrupos[s].nombre
            });
          })

          /*objr.cargosFijos.push({
              codigo: 51,
              monto : objr.segurosVoluntarios,
              descripcion: "SEGUROS VOLUNTARIOS"
          });*/


          objr.cargosFijos.push({
            codigo: 52,
            monto: objr.mipyme,
            descripcion: "COMISION MIPYME"
          });

          objr.cargosFijos.push({
            codigo: 53,
            monto: objr.centralesRiesgo,
            descripcion: "CONSULTA CENTRALES"
          });
          objr.cargosFijos.push({
            codigo: 55,
            monto: objr["v4x1000"],
            descripcion: "GMF"
          });
          objr.cargosFijos.push({
            codigo: 56,
            monto: objr.canalDesembolso,
            descripcion: "COMISION DE RETIRO"
          });
          const ivamp = (ivaCom * montoPrestado).toFixed(2);
          objr.ivamipyme = ivamp;

          objr.cargosFijos.push({
            codigo: 57,
            monto: objr.ivamipyme,
            descripcion: "IVA COMISION MIPYME"
          });


          objr.cargosFijos.push({
            codigo: 54,
            monto: 0,
            descripcion: "CF GASTOS POR COBRANZA POR FAC"
          });
          objr.cargosFijos.push({
            codigo: 58,
            monto: 0,
            descripcion: "IVA GASTOS DE COBRANZA"
          });


          //si hay renovacion se agrega el cargo fijo nuevo
          if ([9, 10].includes(tipoDeNegocio)) {

            console.log("Agrega CF FNG");

            objr.cargosFijos.push({
              codigo: 70,
              monto: objr.fga,
              descripcion: "comisión garantía FNG"
            });
            objr.cargosFijos.push({
              codigo: 71,
              monto: objr.valivafga,
              descripcion: "IVA garantía FNG"
            });
          }
          if ([7, 8].includes(tipoDeNegocio)) {
            objr.cargosFijos.push({
              codigo: 60,
              monto: objr.fga,
              descripcion: "comisión garantía"
            });
            objr.cargosFijos.push({
              codigo: 61,
              monto: objr.valivafga,
              descripcion: "IVA garantía"
            });
          }

          //DS.FNG////

          //cargos fijos de canales premium
          Object.keys(cfcp).map(cf => {


            objr.cargosFijos.push({
              codigo: Number(cf),
              monto: (cfcp[cf].valor).toFixed(2),
              descripcion: cfcp[cf].canal
            });


          })

          //agrega cf 73 iva recuado premium bancolombia
          if (totcf > 0) {

            objr.cargosFijos.push({
              codigo: 73,
              monto: ivacf,
              descripcion: "IVA Recaudo Premium Bancolombia"
            });

          }



          if (data.renovacion) {
            objr.cargosFijos.push({
              codigo: 59,
              monto: (data.renovacion.saldo).toFixed(2),
              descripcion: "SALDO RECOGIDA RENOVACION"
            });
          }

          //console.log("Plan de interes",objr["planDeInteres"]);

          //let tasa = this.tasaCredito(data,env);            
          //let tasa = tasaCredito(data, env);
          objr["tasa"] = objr["planDeInteres"].tasa;

          let saldoInicialr = montoPrestado;


          let montoAjustado = saldoInicialr * ((1 + (objr.tasa / 100)) ** ((interesPrimCuota - 30) / 30));
          let sup = ((objr.tasa / 100) * ((1 + (objr.tasa / 100)) ** plazo));
          let inf = ((1 + (objr.tasa / 100)) ** plazo) - 1;
          let cuotar = (montoAjustado * (sup / inf)).toFixed(2);
          objr.cuota = cuotar;
          for (let i = 0; i < plazo; i++) {
            let c1 = (1 + (objr.tasa / 100));
            let c2 = (interesPrimCuota / 30);
            let c3 = (c1 ** c2) - 1;
            let interes = (saldoInicialr * c3).toFixed(2);
            if (i > 0) {
              interes = (saldoInicialr * (objr.tasa / 100)).toFixed(2);
            }
            let abonoCap = (cuotar - interes).toFixed(2);
            let saldoFinal = (saldoInicialr - abonoCap);
            objr.pagos.push({
              saldoInicial: saldoInicialr,
              abonoCapital: abonoCap,
              intereses: interes,
              cuota: cuotar,
              saldoFinal: Number(saldoFinal.toFixed(2))
            });
            saldoInicialr = (saldoFinal).toFixed(2);
          }

          let listam = [];
          let sumMontosFinanciados = 0;
          for (let miembro of data.miembros) {
            if (miembro.tipoMiembro.id <= 3 || miembro.tipoMiembro.id == 6) {
              let montoSolicitado = miembro.solicitudEconomica.valoresDetalles.monto;
              let seguro = getSeguro(miembro);
              let cd = _costoDesembolso(miembro);
              let financiacion = (montoSolicitado + (seguro * plazo)) + cd;
              sumMontosFinanciados += financiacion;
            }
          }
          for (let miembro of data.miembros) {
            if (miembro.tipoMiembro.id <= 3 || miembro.tipoMiembro.id == 6) {
              let montoSolicitado = miembro.solicitudEconomica.valoresDetalles.monto;
              let seguro = getSeguro(miembro);
              let cd = _costoDesembolso(miembro);
              let financiacion = (montoSolicitado + (seguro * plazo)) + cd;
              var porcp = financiacion / sumMontosFinanciados;

              listam.push({
                financiacion: financiacion.toFixed(2),
                porcentajeParticipacion: porcp.toFixed(2),
                identificacion: miembro.datosIdentificacionCliente.numeroIdentificacion,
                nombre: miembro.datosPersonalesCliente.nombre1 + " " + miembro.datosPersonalesCliente.nombre2 + " " + miembro.datosPersonalesCliente.apellido1 + " " + miembro.datosPersonalesCliente.apellido2,
                cuotaMensual: (cuotar * porcp).toFixed(2)
              });
            }
          }
          objr["cuotasMiembros"] = listam;
          console.log(objr)
          return { error: null, simulacion: objr };
        }
        else {
          return { error: 'El municipio es requerido para la simulación', simulacion: null };
        }
      }
      else {
        return { error: "La suma de cuotas es 0", simulacion: null };
      }
    }
    catch (e) {
      console.log(e);
      return { error: e, simulacion: null };
    }
  }
  const Days360 = (StartDate, EndDate) => {

    var StartDayd = moment(StartDate);
    var EndDated = moment(EndDate);
    return EndDated.diff(StartDayd, 'days');

  }

  const IsLastDayOfFebruary = (date) => {
    return moment(date).format('M') === 2 && moment(date).format('D') === moment(date, 'YYYY-MM').daysInMonth();
  }

  const getSeguro = (miembro) => {

    const m = miembro.seguro.length;
    let sum = 0;
    for (let j = 0; j < m; j++) {
      if (!!miembro.seguro[j].aprobado) {
        sum += miembro.seguro[j].valorMensual;
      }
    }
    return sum;
  }

  const sumSeguros = (data) => {

    const n = data.miembros.length;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      let m = data.miembros[i].seguro.length;
      for (let j = 0; j < m; j++) {
        if (!!data.miembros[i].seguro[j].aprobado) {
          sum += data.miembros[i].seguro[j].valorMensual;
        }
      }
    }
    return sum;
  }

  const cuotaMax = (miembro) => {
    // variables requeridas dentro de encuestaSocieconomica de un miembro
    const keysRequired = ['ingresosDelCliente', 'montoVentas', 'gastosDelCliente', 'gastosMicroEmpresa', 'costoDeVentas'];
    const { encuestaSocioEconomica } = miembro;
    const { ingresosDelCliente, montoVentas, gastosDelCliente, gastosMicroEmpresa, costoDeVentas } = encuestaSocioEconomica;

    // validamos que todos los objetos necesarios para obtener los valores se encuentren
    keysRequired.forEach(k => {
      if (!encuestaSocioEconomica[k]) new Error(`SIM-CMAX-1: la variable ${k}`)
    });

    const sumGastosDelCliente = Object.keys(gastosDelCliente).reduce((sum, k) => sum + gastosDelCliente[k], 0);
    const sumGastosMicroEmpresa = Object.keys(gastosMicroEmpresa).reduce((sum, k) => sum + gastosMicroEmpresa[k], 0);

    // @UTILIDAD = ((ingresosDelCliente.monto+montoVentas.ventasMensualPromedio)-(gastosDelCliente+gastosMicroEmpresa+costoDeVentas))*65%
    const utilidad = ((ingresosDelCliente.monto + montoVentas.ventasMensualPromedio) - (sumGastosDelCliente + sumGastosMicroEmpresa + costoDeVentas));

    // CUOTA MAX = @UTILIDAD * 0.65
    return utilidad * 0.65;
  }

  const cuotaMaxCodeudorAsalariado = (miembro) => {
    // variables requeridas dentro de encuestaSocieconomica de un miembro
    const keysRequired = ['ingresosDelCliente', 'gastosDelCliente'];
    const { encuestaSocioEconomica } = miembro.datosCoodeudorAsalariado;
    const { ingresosDelCliente, gastosDelCliente } = encuestaSocioEconomica;

    // validamos que todos los objetos necesarios para obtener los valores se encuentren
    keysRequired.forEach(k => {
      if (!encuestaSocioEconomica[k]) new Error(`SIM-CMAX-1: la variable ${k}`)
    });

    const sumGastosDelCliente = Object.keys(gastosDelCliente).reduce((sum, k) => sum + gastosDelCliente[k], 0);

    // @UTILIDAD = ((ingresosDelCliente.sueldo + ingresosDelCliente.monto)-(gastosDelCliente))*65%
    const utilidad = ((ingresosDelCliente.sueldo + ingresosDelCliente.monto) - (sumGastosDelCliente));

    // CUOTA MAX = @UTILIDAD * 0.65
    return utilidad * 0.65;
  }
  return {
    clientesContrato: _clientesContrato,
    sumCuotas,
    lider,
    cuotaGrupal,
    cuotaMax,
    cuotaMaxCodeudorAsalariado,
    getTasaFNG,
    simuladorMotor
  }
}

