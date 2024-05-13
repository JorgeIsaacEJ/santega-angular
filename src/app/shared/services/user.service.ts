import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environments/environment";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "./local-storage.service";
import { LoginModel } from "../models/login.model";
import { DetalleMedioContactoDeudor } from '../models/user.model'

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl: string = environment.api;
    private findOneRoute: string = '/api/Deudor/ListaSelAll?startRowIndex=0&maximumRows=1&where=Deudor.RFC=';
    private medioContactoDeudor: string = '/api/Detalle_Medio_Contacto_Deudor/post';
    private findUserById: string  = '/api/Spartan_User/ListaSelAll?startRowIndex=0&maximumRows=1&where=Spartan_User.Id_User='
    constructor(
        private readonly http: HttpClient,
        private readonly localStorageService: LocalStorageService,
    ) {}

    findOne( id: string ) {

        return this.http.get(
            `${ this.apiUrl }/${ this.findUserById }${ id }`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
                }
            }
        ).pipe(
            map(( value: any ) => {
                this.localStorageService.saveData('spartane_user', String(id));
                return value;
            })
        );
    }

    findOneByRFC( RFC: string ) {

        return this.http.get(
            `${ this.apiUrl }/${ this.findOneRoute }'${ RFC }'`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
                }
            }
        ).pipe(
            map(( value: any ) => {
                this.localStorageService.saveData('user', JSON.stringify( value.Deudors[0] ));

                return value;
            })
        );
    }

    setDetalleMedioContactoDeudor( detalleMedioDeContactoDeudor: DetalleMedioContactoDeudor ) {

        return this.http.post<string>(`${ this.apiUrl }/${ this.medioContactoDeudor }`, detalleMedioDeContactoDeudor, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
            }
        });
    }
}