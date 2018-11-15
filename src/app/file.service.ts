import { Injectable } from '@angular/core';
import { Face } from './face'
import { FACES } from './mock-faces'

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FileService {

  private facesUrl: string = 'http://dev.timx.me:5000/image'; //'http://127.0.0.1:5000/image'，  'http://.timx.me:5000/image';
  // private facesUrl: string = 'http://127.0.0.1:5000/image';


  constructor(private http: HttpClient) { }

  getFaces(inImage): Observable<Array<Face>> {
    // For testing:
    // of(FACES);

    return this.http.post<Array<Face>>(this.facesUrl, inImage);
  }

}
