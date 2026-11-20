import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  @Input() description: string;
  @Input() level: AlertLevel;
  @Input() type: AlertTypes = AlertTypes.ONLY_TEXT;
  @Input() buttons: AlertButtons = AlertButtons.NONE;
  @Input()title: string;

  constructor(public active: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}

export enum AlertLevel {
  PRIMARY_LEVEL,
  INFO_LEVEL,
  SUCCES_LEVEL,
  WARNING_LEVEL,
  DANGER_LEVEL
}

export enum AlertTypes {
  CONFIRM ,
  INFO ,
  ONLY_TEXT ,
}

export enum AlertButtons {
  NONE ,
  INFO ,
  CONFIRM,
}
