import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Comite } from 'src/app/core/entities/comite';
import { UsuarioAsignado } from 'src/app/core/entities/comite.interface';

@Component({
  selector: 'app-asignar-comite',
  templateUrl: './asignar-comite.component.html',
  styleUrls: ['./asignar-comite.component.scss']
})
export class AsignarComiteComponent implements OnInit {
  @Input() comite: Comite[];
  @Input() selectedUser: UsuarioAsignado;
  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
    const count_list = JSON.parse(localStorage.getItem("count_comite"));
    this.comite.forEach(user => {
      if(count_list[user.cedula]){
        user.counter = count_list[user.cedula];
      }else{
        user.counter = 0;
      }
    });
  }

  selectUser(user){
    this.selectedUser = user;
  }

  saveUserSelected(){
    this.modal.close({selectUser:  this.selectedUser});
  }

}
