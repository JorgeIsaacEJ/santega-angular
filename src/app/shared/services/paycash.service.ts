import { Injectable } from '@angular/core';

import { environment } from "src/app/environments/environment";
import { Reference, Tokenresponse } from '../models/paycash.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaycashService {
  private apiUrl: string = environment.apipaycash;
  private keypaycash: string = environment.keypaycash;

  constructor(private http:HttpClient) { }

  //Otiene token
  getToken():Observable<any>{
    return this.http.get<Tokenresponse>(`/proxy/v1/authre?key=` + this.keypaycash);
  }

  //Otiene referencia
  getReference(reference: string, token: string):Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', token);
    headers = headers.append('Content-Type', 'application/json');
    return this.http.get<Reference>(`/proxy/v1/search?Reference=` + reference, {headers});
  }
}
