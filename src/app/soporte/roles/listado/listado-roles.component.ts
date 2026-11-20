import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {ApiService} from '../../../core/data/api.service';
import {Rol} from '../../../core/entities/rol';
import {environment} from '../../../../environments/environment';
import {RolesService} from '../roles.service';

@Component({
  selector: 'app-listado-roles',
  templateUrl: './listado-roles.component.html',
  styleUrls: ['./listado-roles.component.scss']
})
export class ListadoRolesComponent implements OnInit {

  roles: Rol[];

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private rolesService: RolesService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async modificar(element: Rol): Promise<void> {
    this.rolesService.current = element;
    this.route.snapshot.data.rol = element;
    await this.router.navigate(
      ['permisos-ejecucion'],
      {queryParams: {_id: element._id}, relativeTo: this.route}
    );
  }

  async cargarTodos(): Promise<void> {
    try {
      const {data} = await this.api.roles.buscar();
      this.roles = data;
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }

}
