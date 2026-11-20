import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss']
})
export class HistorialComponent implements OnInit {

  @Input() historial: any;

  constructor(public modal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  submit(): void {

  }

  keysFrom(obj: any): string[] {
    return typeof obj === 'object' ? Object.keys(obj) : null;
  }
}
