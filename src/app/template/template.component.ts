import {Component, Inject, OnInit, Renderer2} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DOCUMENT} from '@angular/common';

import {SessionService} from '../core/session.service';
import {ApiService} from '../core/data/api.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  // tslint:disable:variable-name
  _mode = 'push';
  _position = 'left';
  _dock = false;
  _animate = true;
  _keyClose = false;
  _autoCollapseHeight = null;
  _autoCollapseWidth = null;
  sideBarOpen = true;

  spinnerTemplate: string;

  constructor(
    public route: ActivatedRoute,
    public session: SessionService,
    public api: ApiService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    this.spinnerTemplate = `
    <div class="lds-default">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`;
  }

  async ngOnInit(): Promise<void> {
  }

  sideBarToggler(): void {
    this.sideBarOpen = !this.sideBarOpen;
  }

  onActivate($event: any, scrollContainer: HTMLElement): void {
    scrollContainer.scrollTop = 0;
  }

  logout(): void {
  }
}
