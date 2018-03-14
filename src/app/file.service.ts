import { Injectable } from '@angular/core';
import { Face } from './face'
import { FACES } from './mock-faces'

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class FileService {

  private facesUrl: string = 'http://127.0.0.1:5000/image';

  constructor(private http: HttpClient) { }

  getFaces(inImage): Observable<Face[]> {
    // For testing:
    // of(FACES);

    return this.http.post(this.facesUrl, inImage)
      .map(res => res.result);
  }

}
