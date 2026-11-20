import {Component, OnInit} from '@angular/core';

import {STORAGE_KEYS} from '../core/constants';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  informes: { titulo: string; url: string; }[];

  constructor(private sanitizer: DomSanitizer) {
    const informes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.informes || [];
    this.informes = informes.map(i => ({...i, url: this.sanitizer.bypassSecurityTrustResourceUrl(i.url)}));
  }

  ngOnInit(): void {
  }
}
