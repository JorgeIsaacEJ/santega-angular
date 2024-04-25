import { Injectable } from '@angular/core';

import { environment } from "src/app/environments/environment";
import { Tokenresponse } from '../models/paycash.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaycashService {
  private apiUrl: string = environment.api;
  private keypaycash: string = environment.keypaycash;

  constructor(private http:HttpClient) { }

  //Otiene token
  getToken():Observable<Tokenresponse>{
    return this.http.get<Tokenresponse>(`${this.apiUrl}v1/authre?key=` + this.keypaycash);
  }

  //Otiene referencia
  getReference(reference: string):Observable<Tokenresponse>{
    return this.http.get<Tokenresponse>(`${this.apiUrl}v1/search?Reference=` + reference);
  }
}
