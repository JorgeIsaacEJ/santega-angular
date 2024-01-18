import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environments/environment";
import { ToastrService } from "ngx-toastr";
import { LocalStorageService } from "./local-storage.service";
import { LoginModel } from "../models/login.model";
import { RegisterModel } from "../models/register.model";
import * as md5 from 'md5';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl: string = environment.api;
    private oauthRoute: string = 'oauth/token';
    private loginRoute: string = 'api/Spartan_SecurityAccount/Login';
    private registerRoute: string = 'api/Spartan_User/PostDeudor';

    constructor(
        private readonly http: HttpClient,
        private readonly toastrService: ToastrService,
        private readonly localStorageService: LocalStorageService,
    ) {}

    getAuthorization(): Observable<string> {

        const body = new HttpParams()
            .set('username', 'demo')
            .set('password', 'demo')
            .set('grant_type', 'password');
        
        return this.http.post<Observable<string>>(`${ this.apiUrl }/${ this.oauthRoute }`, 
            body.toString(),
            {
                headers: new HttpHeaders()
                  .set('Content-Type', 'application/x-www-form-urlencoded')
            }
        ).pipe(
            map(( response: any ) => {

                console.log( response )
                if ( !response.access_token ) {

                    this.toastrService.info('No se ha podido validar su identificación, vuelve a intentarlo');
                    return;
                }

                this.localStorageService.saveData( 'access_token', response.access_token );
                return response.access_token; 
            }),
        );
    }

    login( form: LoginModel ) {

        return this.http.post(
            `${ this.apiUrl }/${ this.loginRoute }`, form, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
                }
            }
        );
    }

    register( form: RegisterModel ) {

        form = {
            ...form,
            Password: md5( form.Password ),
        }

        console.log({ form })

        return this.http.post(
            `${ this.apiUrl }/${ this.registerRoute }`, form, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
                }
            }
        );
    }

    getUser() {
        const user = this.localStorageService.getData('user');

        if ( !user ) return null;
        return user;
    }
}