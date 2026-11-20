import { Injectable } from '@angular/core';
import { Zona } from 'src/app/core/entities/zona';

@Injectable({
  providedIn: 'root'
})
export class ZonasService {

  current: Zona;

  constructor() { }
}
