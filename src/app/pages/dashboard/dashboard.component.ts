import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as md5 from 'md5';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { NuveiParams } from 'src/app/shared/interfaces/nuvei-params.interface';
import { Credito, UserCurrentDebtsResponse } from 'src/app/shared/models/user-current-debts-reponse.model';
import { RegistroDePago, UserHistoryPaymentsResponse } from 'src/app/shared/models/user-history-payments-response.model';
import { UserModel } from 'src/app/shared/models/user.model';
import { AnimateService } from 'src/app/shared/services/animate.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
declare let SafeCharge: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('paymentModal') paymentModal!: ElementRef;
  @ViewChild('nuveiFrame') nuveiFrame!: ElementRef;

  public user: UserModel;
  public currentDebts?: Credito[];
  public debts?: Credito[];
  public payments: RegistroDePago[] = [];

  private nuveiKeys: NuveiParams = environment.nuvei;
  public nuveiFrameLoaded: boolean = false;
  
  constructor(
    private readonly animateService: AnimateService,
    private readonly toastrService: ToastrService,
    private readonly localStorageService: LocalStorageService,
    private readonly paymentService: PaymentService,
    private readonly router: Router,
  ) {
    this.user = JSON.parse( localStorageService.getData('user') );
  }

  ngOnInit(): void {
    
    window.scrollTo({ top: 0 });
    this.getCurrentDebts();
    this.getDebts();
  }

  getCurrentDebts(): void {
    
    this.paymentService.getCurrentDebtsByUser( this.user.Folio )
      .subscribe(( value: UserCurrentDebtsResponse ) => {

        if ( value ) {

          this.currentDebts = value.Creditos;
          return;
        }
    });
  }

  getDebts() {
    this.paymentService.getDebtsByUser( this.user.Folio )
      .subscribe(( value: UserCurrentDebtsResponse ) => {

        if ( value ) {

          this.debts = value.Creditos;
          this.debts.map(( debt: Credito ) => {

            this.getHistoryPayments( this.user.Folio, debt.Folio );
            return;
          })
          return;
        }
    });
  }

  getHistoryPayments( userFolio: number, creditFolio: number ): void {

    this.paymentService.getHistoryPaymentsByUser( userFolio, creditFolio )
      .subscribe(( value: UserHistoryPaymentsResponse ) => {

        if ( value && value.Registro_de_Pagos.length > 0) {

          this.payments.push( ...value.Registro_de_Pagos );
          return;
        }
    })
  }

  async makePayment( currentDebt: Credito ) {

    this.nuveiFrameLoaded = false;
    const modal: HTMLElement = this.paymentModal.nativeElement;
    modal.classList.add('payment-modal-active');

    const queries = {
      merchant_id: this.nuveiKeys.merchantId,
      merchant_site_id: this.nuveiKeys.siteId,
      total_amount: currentDebt.Pago_Periodico,
      currency: 'MXN',
      user_token_id: this.user.Folio,
      item_name_1: currentDebt.Contrato,
      item_amount_1: currentDebt.Pago_Periodico,
      item_quantity_1: 1,
      time_stamp: this.createTimeStamp(),
      version: '4.0.0',
      notify_url: 'https://google.com',
    }

    const checkSum = await this.createChecksum( queries );
    const urlToPay: string = `${ this.nuveiKeys.paymentURL }?${ this.createQueryString({
      ...queries,
      checksum: checkSum
    })}`;

    this.nuveiFrame.nativeElement.src = urlToPay;
  }

  protected iframeLoaded(): void {
    const loaderDiv = document.querySelector('.nuvei-loader');
    loaderDiv?.classList.add('fadeOutAnimation');
    setTimeout(() => {
        
      this.nuveiFrameLoaded = true;
    }, 301 );
  }

  protected createTimeStamp(): string {

    const dateToTimeStamp = new Date;
    let timeStamp = [
      dateToTimeStamp.getFullYear(),
      dateToTimeStamp.getDate(),
      dateToTimeStamp.getMonth()+1,
    ].join('/')+'.'+ [ dateToTimeStamp.getHours(),
      dateToTimeStamp.getMinutes(),
      dateToTimeStamp.getSeconds()
    ].join(':').replace('/', '-');

    
    return timeStamp.replaceAll('/', '-');
  }

  protected createQueryString( data: any ): string {
    
    return Object.keys( data ).map(key => {

      let val = data[key];
      if ( val !== null && typeof val === 'object' ) val = this.createQueryString(val);
      return `${key}=${encodeURIComponent(`${val}`.replace(/\s/g, '_'))}`
    }).join('&');
  }

  protected async createChecksum( data: any ): Promise<string> {

    const queryString = ( data: any ) => {

      return Object.keys( data ).map(key => {

        let val = data[key];
        if ( val !== null && typeof val === 'object' ) val = queryString(val);
        return val;
      }).join('');
    }

    const checkSumString = this.nuveiKeys.secretKey + queryString( data );
    return await this.generateSha256( checkSumString );
  }

  async generateSha256( value: string ): Promise<string> {

    const msgBuffer = new TextEncoder().encode( value );  
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array( hashBuffer ));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  closePaymentModal(): void {
    const modal: HTMLElement = this.paymentModal.nativeElement;
    modal.classList.add('fadeOutAnimation');

    setTimeout(() => {
      modal.classList.remove('fadeOutAnimation');
      modal.classList.remove('payment-modal-active');
        
      this.nuveiFrame.nativeElement.src = '';
      this.nuveiFrameLoaded = false;
    }, 301 );
  }

  @HostListener(
    'click', ['$event']
  ) onClick( e: any ): void {

    if ( e.target.getAttribute('anim') === 'ripple' ) {
      this.animateService.rippleEffect( e, e.target );
    }

    if ( e.target.parentNode.getAttribute('anim') === 'ripple' ) {
      this.animateService.rippleEffect( e, e.target.parentNode );
    }
  }

  @HostListener(
    'document:keydown.escape', ['$event']
  ) onKeydownHandler( e: any ) {

    const modal: HTMLElement = this.paymentModal.nativeElement;
    if ( modal.classList.contains('payment-modal-active') ) {
      
      this.closePaymentModal();
    }
  }
}
