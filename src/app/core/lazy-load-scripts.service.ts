import { Injectable, Inject } from '@angular/core';
import {ReplaySubject, Observable, Subject} from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LazyLoadScriptService {

  // tslint:disable-next-line:variable-name
  _loadedLibraries: { [url: string]: ReplaySubject<any> } = {};

  libraries: Subject<{ [p: string]: ReplaySubject<any> }>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.libraries = new Subject<{[p: string]: ReplaySubject<any>}>();
  }

  loadScript(key: string, url: string): Observable<any> {
    if (this._loadedLibraries[key]) {
      return this._loadedLibraries[key].asObservable();
    }

    this._loadedLibraries[key] = new ReplaySubject();
    this.libraries.next(this._loadedLibraries);


    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = () => {
      this._loadedLibraries[key].next();
      this._loadedLibraries[key].complete();
    };

    this.document.body.appendChild(script);

    return this._loadedLibraries[key].asObservable();
  }
}
