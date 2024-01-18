import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/app/environments/environment";
import { LocalStorageService } from "./local-storage.service";
import { Observable } from "rxjs";
import { DebtModel } from "../models/debt.model";

@Injectable({
    providedIn: 'root'
})
export class DebtService {

    private apiUrl: string = environment.api;
    private findTypeDebtsRoute: string = 'api/Producto_de_Credito/GetAll';

    constructor(
        private readonly http: HttpClient,
        private readonly localStorageService: LocalStorageService,
    ) {}

    getTypeDebts(): Observable<DebtModel[]> {

        return this.http.get<DebtModel[]>(
            `${ this.apiUrl }/${ this.findTypeDebtsRoute }`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
                }
            }
        );
    }
}