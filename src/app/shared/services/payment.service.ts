import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { environment } from "src/app/environments/environment";
import { LocalStorageService } from "./local-storage.service";
import { PaymentServiceRoutes } from "../interfaces/payment-service-routes.interface";
import { UserFolioResponse } from "../models/user-folio-response.model";
import { Credito, UserCurrentDebtsResponse } from "../models/user-current-debts-reponse.model";
import { UserHistoryPaymentsResponse } from "../models/user-history-payments-response.model";
import { MakePaymentModel } from "../models/make-payment.model";

@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private apiUrl: string = environment.api;
    private routes: PaymentServiceRoutes = {
        makePayment: 'api/Registro_de_Pago/PostOnlinePayment',
        folioOfDeudor: 'api/Deudor/ListaSelAll?startRowIndex=0&maximumRows=1&where=Deudor.Usuario_que_Registra',
        debtsByDeudor: 'api/Credito/ListaSelAll?startRowIndex=0&maximumRows=100&where=Credito.Deudor',
        historyPayments: 'api/Registro_de_Pago/ListaSelAll?startRowIndex=0&maximumRows=100&where=Registro_de_Pago.Deudor',
    }
    private months: string[] = [
        'January','February','March',
        'April','May','June','July',
        'August','September','October',
        'November','December'
    ];
                

    constructor(
        private readonly http: HttpClient,
        private readonly localStorageService: LocalStorageService,
    ) {}

    makePayment( payment: MakePaymentModel ): Observable<string> {

        return this.http.post<string>(`${ this.apiUrl }/${ this.routes.makePayment }`, payment, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
            }
        });
    }

    getUserFolio( id: string ): Observable<UserFolioResponse> {

        return this.http.get<UserFolioResponse>(`${ this.apiUrl }/${ this.routes.folioOfDeudor }=${ id }`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
            }
        });
    }

    getCurrentDebtsByUser( userFolio: number ): Observable<UserCurrentDebtsResponse> {

        return this.http.get<UserCurrentDebtsResponse>(`${ this.apiUrl }/${ this.routes.debtsByDeudor }=${ userFolio } and Credito.Estatus <> 5`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
            }
        }).pipe(
            map(( value ) => {

                value.Creditos.map(( debt: Credito ) => {

                    const date = new Date();
                    debt.Fecha_limite_de_Pago = new Date(
                        debt.Dia_de_Corte + '-' + this.months[date.getMonth()] + '-' + date.getFullYear()
                    );
                    debt.Fecha_de_Pago = this.restDays(
                        debt.Dia_de_Corte + '-' + this.months[date.getMonth()] + '-' + date.getFullYear(),
                        5,
                    );
                    
                    return debt;
                });
                return value;
            })
        );
    }

    getDebtsByUser( userFolio: number ): Observable<UserCurrentDebtsResponse> {

        return this.http.get<UserCurrentDebtsResponse>(`${ this.apiUrl }/${ this.routes.debtsByDeudor }=${ userFolio }`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
            }
        });
    }

    getHistoryPaymentsByUser(
        userFolio: number, 
        creditFolio: number 
    ): Observable<UserHistoryPaymentsResponse> {

        return this.http.get<UserHistoryPaymentsResponse>(`${ this.apiUrl }/${ this.routes.historyPayments }=${ userFolio } and Registro_de_Pago.Credito=${ creditFolio }`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ this.localStorageService.getData('access_token') }`
            }
        });
    }

    private restDays( date: string, days: number ): Date {

        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() - days);
        return newDate;
    }
}