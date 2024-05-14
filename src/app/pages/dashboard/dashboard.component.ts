import { AfterContentChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { NuveiParams } from 'src/app/shared/interfaces/nuvei-params.interface';
import { NuveiQueryParamsResponse } from 'src/app/shared/interfaces/nuvei-query-params-response.interface';
import { DebtModel, PagosReferencia } from 'src/app/shared/models/debt.model';
import { Reference } from 'src/app/shared/models/paycash.model';
import { RegistroDePagoPost } from 'src/app/shared/models/payment.model';
import { Credito, UserCurrentDebtsResponse } from 'src/app/shared/models/user-current-debts-reponse.model';
import { RegistroDePago, UserHistoryPaymentsResponse } from 'src/app/shared/models/user-history-payments-response.model';
import { UserModel } from 'src/app/shared/models/user.model';
import { AnimateService } from 'src/app/shared/services/animate.service';
import { DebtService } from 'src/app/shared/services/debt.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PaymentService } from 'src/app/shared/services/payment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('paymentModal') paymentModal!: ElementRef;
  @ViewChild('paymentModalStatus') paymentModalStatus!: ElementRef;
  @ViewChild('paymentReference') paymentReference!: ElementRef;

  public user: UserModel;

  public debtTypes?: DebtModel[];
  public debtTypeSelected?: DebtModel | null;
  public reference?: string = "";

  public currentDebts?: Credito[];
  public debts?: Credito[];
  public payments: RegistroDePago[] = [];
  public paymentsSelected: RegistroDePago[] = [];
  public contractsOftypeDebtsSelected?: Credito[] = [];
  public Pagos: PagosReferencia[] = [];

  private nuveiKeys: NuveiParams = environment.nuvei;
  public nuveiResponse?: Partial<NuveiQueryParamsResponse> | null;

  public referenceError: string = "";

  constructor(
    private readonly animateService: AnimateService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly localStorageService: LocalStorageService,
    private readonly paymentService: PaymentService,
    private readonly debtService: DebtService,
  ) {
    this.user = JSON.parse( localStorageService.getData('user') );
  }

  ngOnInit(): void {

    this.route.queryParams
      .subscribe(( queries: Partial<NuveiQueryParamsResponse> ) => {
        console.log( queries )
        if ( Object.keys( queries ).length !== 0 ) {

          this.showPaymentModalStatus( queries );
          return;
        } else {

          this.getTypeDebts();
          this.getCurrentDebts();
          this.getDebts();
        }
    });

    window.scrollTo({ top: 0 });
  }

  getTypeDebts(): void {

    this.debtService.getTypeDebts()
      .subscribe(( value ) => {

        if ( value ) {

          this.debtTypes = value;
          return;
        }
    })
  }

  getCurrentDebts(): void {

    this.paymentService.getCurrentDebtsByUser( this.user.Folio )
      .subscribe(( value: UserCurrentDebtsResponse ) => {

        if ( value ) {

          this.currentDebts = value.Creditos;
          for (let item of this.currentDebts) {
            this.Pagos.push({ Referencia_Bancaria: item.Referencia_Bancaria, Pago_Periodico: item.Pago_Periodico });
          }
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
          this.debtTypes?.map(( debt ) => {

            if ( this.userHasDebtType( debt.Folio ) ) {
              this.showPaymentHistory( debt );
            }
          });
          return;
        }
    })
  }

  async makePayment( currentDebt: Credito ) {
    const modal: HTMLElement = this.paymentModal.nativeElement;
    const objeto = this.Pagos.find(item => item.Referencia_Bancaria === currentDebt.Referencia_Bancaria);
    const Pago_Periodico = objeto?.Pago_Periodico

    // Valida que Pago_Periodico > 0
    if (!Pago_Periodico || typeof Pago_Periodico !== 'number' || Pago_Periodico <= 0) {
      this.toastrService.error(`Cantidad inválida`);
      return;
    }

    modal.classList.add('payment-modal-active');

    const queries = {
      merchant_id: this.nuveiKeys.merchantId,
      merchant_site_id: this.nuveiKeys.siteId,
      total_amount: Pago_Periodico,
      currency: 'MXN',
      user_token_id: this.user.Folio,
      item_name_1: currentDebt.Producto_de_Credito_Producto_de_Credito.Descripcion.replaceAll(' ', '_'),
      item_amount_1: Pago_Periodico, //Cambiar por valor de input Amount
      item_quantity_1: 1,
      time_stamp: this.createTimeStamp(),
      version: '4.0.0',
      payment_method_mode: 'filter',
      payment_method: 'cc_card',
      email: 'test@gmail.com',
      notify_url: 'https://google.com',
    }

    const checkSum = await this.createChecksum( queries );
    const urlToPay: string = `${ this.nuveiKeys.paymentURL }?${ this.createQueryString({
      ...queries,
      checksum: checkSum
    })}`;
    this.localStorageService.saveData('debt-select-to-pay', String(JSON.stringify(currentDebt)));
    this.localStorageService.saveData('debt-folio-payed', String( currentDebt.Folio ));
    window.open( urlToPay, '_self' );
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

  protected createOnlyDateStamp(date: Date): string {
    return date.toISOString().replace('T', ' ').replace('Z', '');
  }

  protected createOnlyTimeStamp(date: Date): string {
    return this.createOnlyDateStamp(date).split(' ')[1];
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
    }, 301 );
  }

  showPaymentModalStatus( queries: Partial<NuveiQueryParamsResponse> ): void {

    const { payment_status } = queries;
    if ( payment_status === 'denied' ) {

      this.toastrService.info(`El pago del credito "${ queries.productId!.replaceAll('_', ' ')}" por la cantidad de $${ queries.totalAmount }${ queries.currency } no ha sido aceptado!`);
      return;
    }

    this.nuveiResponse = ( Object.keys( queries ).length !== 0 )
      ? queries
      : null;

    if ( payment_status === 'success' ) {

      this.toastrService.success(`El pago del credito ${ queries.productId!.replaceAll('_', ' ')} por la cantidad de $${ queries.totalAmount }${ queries.currency } ha sido exitoso!`);
      this.generatePaymentRecord( queries );
    }
  }

  generatePaymentRecord(queries: Partial<NuveiQueryParamsResponse>): void {
    const debtFolio = this.localStorageService.getData('debt-folio-payed');
    const SelectedCreditoToPay: Credito = JSON.parse(this.localStorageService.getData('debt-select-to-pay'));
    const SpartaneID: number = parseInt(this.localStorageService.getData('spartane_user'));
    let totalAmount: number = queries.totalAmount!;
    const now = new Date();
    let registroDePago: RegistroDePagoPost = {
      Folio: 0, //Nuevo registro
      Fecha_de_Registro: this.createOnlyDateStamp(now), //Fecha actual
      Hora_de_Registro: this.createOnlyTimeStamp(now), //Hora actual
      Usuario_que_Registra: SpartaneID, //Id de usuario de deudor (spartan_user)
      Deudor: SelectedCreditoToPay.Deudor, //Folio del deudor (credito)
      Credito: SelectedCreditoToPay.Folio, //Folio del crédito (credito)
      No__Cuenta: SelectedCreditoToPay.Cuenta, //Número de cuenta (credito)
      No__Contrato: SelectedCreditoToPay.Contrato, //Número de contrato (credito)
      Producto_de_Credito: SelectedCreditoToPay.Producto_de_Credito, //Producto de credito (credito)
      Fecha_de_Prestamo: null,
      Monto_Otorgado: null,
      Saldo_Actual: null,
      Plazo_Contratado: null,
      Plazo_Remanente: null,
      Dias_de_Atraso: null,
      Dia_de_Corte: null,
      Dias_para_Pago: null,
      Medio_de_Pago: 2800, //Pago en línea
      No__de_Referencia: queries.TransactionID!, //Referencia que regresa Nuvei
      Total_a_Pagar: null,
      Total_Pagado: totalAmount, //Monto Pagado
      Pago_a_Capital: null,
      Pago_a_IVA_de_Capital: null,
      Pago_a_Comison_de_Admon__de_Cuenta: null,
      Pago_a_IVA_de_Comision: null,
      Pago_a_Interes: null,
      Pago_a_IVA_de_Interes: null,
      Pago_a_Moratorios: null,
      Pago_a_IVA_Mora: null,
      Saldo: null,
      Fecha_de_Registro_Sistema: null,
      Gastos_Administrativos: null,
      IVA_Gastos_Administrativos: null,
      Seguro_Vida: null,
      Seguro_Danos: null,
      GPS: null,
      Archivo: null,
      Consecutivo_Pago: null
    };
    if (!debtFolio) return;

    //this.paymentService.makePayment({ Credito: String( debtFolio! ), Total_a_Pagar: String( totalAmount )})
    this.paymentService.RegistroDePagoPost(registroDePago).subscribe((value) => {
      if (!value) return;

      this.localStorageService.removeData('debt-folio-payed');
      this.debtTypes = undefined;
      this.currentDebts = undefined;
      this.debts = undefined;
      this.payments = [];
      this.paymentsSelected = [];

      this.getTypeDebts();
      this.getCurrentDebts();
      this.getDebts();
    });
  }

  closePaymentModalStatus(): void {
    const modal: HTMLElement = this.paymentModalStatus.nativeElement;
    modal.classList.add('fadeOutAnimation');

    setTimeout(() => {
      modal.classList.remove('fadeOutAnimation');
      modal.classList.remove('payment-modal-active');

      this.nuveiResponse = null;
      this.payments = [];
      this.paymentsSelected = [];
      this.router.navigate(['/panel']);
    }, 301 );
  }

  showPaymentHistory( debt: DebtModel, event: any = undefined ): void {

    const hasTypeOfDebt = this.payments.find(( x ) => ( x.Producto_de_Credito_Producto_de_Credito.Folio === debt.Folio ));
    if ( !hasTypeOfDebt ) {

      this.toastrService.info('No cuentas con este tipo de credito!');
      return;
    }

    this.contractsOftypeDebtsSelected = this.debts?.filter(( x: Credito ) =>
      ( x.Producto_de_Credito_Producto_de_Credito.Folio === debt.Folio )
    );

    if ( !event ) {

      this.debtTypeSelected = debt;
      this.paymentsSelected = this.payments.filter(( x: RegistroDePago ) => (
        x.Producto_de_Credito_Producto_de_Credito.Folio === debt.Folio
      ));
      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Fecha_de_Registro', -1),
      );

      const liList = document.querySelectorAll('.payment-history-options-item');
      liList.forEach(( li ) => {
        if ( li.classList.contains('payment-history-option-item-active' ) ) {

          li.classList.remove('payment-history-option-item-active');
        }
      });

      liList[0].classList.add('payment-history-option-item-active');

      return;
    }

    const liList = document.querySelectorAll('.payment-history-options-item');
    liList.forEach(( li ) => {
      if ( li.classList.contains('payment-history-option-item-active' ) ) {

        li.classList.remove('payment-history-option-item-active');
      }
    });

    if ( debt.Folio === this.debtTypeSelected?.Folio ) {

      const paymentList = document.querySelector('.paymet-history');
      paymentList?.classList.add('slideOutFromTopAnimation');
      setTimeout(() => {

        paymentList?.classList.remove('slideOutFromTopAnimation');
        this.debtTypeSelected = null;
        this.paymentsSelected = [];
        return;
      }, 300);
    }

    this.debtTypeSelected = debt;
    this.paymentsSelected = this.payments.filter(( x: RegistroDePago ) => (
      x.Producto_de_Credito_Producto_de_Credito.Folio === debt.Folio
    ));
    this.paymentsSelected = this.paymentsSelected.sort(
      this.dynamicSort('Fecha_de_Registro', -1),
    );

    const li: HTMLElement = event.target;
    li.classList.add('payment-history-option-item-active');
  }

  userHasDebtType( debtFolio: number ): boolean {

    const x = this.payments.find(( payment: RegistroDePago ) => (
      payment.Producto_de_Credito_Producto_de_Credito.Folio === debtFolio
    ));

    if ( x )  {
      const debt: any = x.Producto_de_Credito_Producto_de_Credito;
      this.debtTypes = this.debtTypes!.filter(( debt: DebtModel ) => (
        debt.Folio !== debtFolio
      ));
      this.debtTypes.unshift( debt );
      return true;
    }
    return false;
  }

  contractToggleCheck( event: any ): void {
    const contractOfDebt = event.target.value;

    if ( event.target.checked ) {

      this.paymentsSelected = [
        ...this.paymentsSelected,
        ...this.payments.filter(( x: RegistroDePago ) => (
          x.No__Contrato === contractOfDebt && x.Producto_de_Credito_Producto_de_Credito.Descripcion
        )),
      ];

      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Fecha_de_Registro', -1),
      );
    } else {

      this.paymentsSelected = this.paymentsSelected
        .filter(( x: RegistroDePago ) => ( x.No__Contrato !== contractOfDebt ));
      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Fecha_de_Registro', -1),
      );
    }

    return;
  }

  filterPayments( event: any ): void {

    const value = event.target.value;
    if ( value === 'desc' )
      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Fecha_de_Registro', -1),
      );

    if ( value === 'asc' )
      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Fecha_de_Registro', 1),
      );

    if ( value === 'highest')
      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Total_Pagado', -1),
      );

    if ( value === 'lowest' )
      this.paymentsSelected = this.paymentsSelected.sort(
        this.dynamicSort('Total_Pagado', 1),
      );

    return;
  }

  dynamicSort( property: string, order: number ) {

    return function ( a: any, b: any ) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * order;
    }
  }

  isCurrentMonth( dateTime: string ): boolean {
    const parts = dateTime.split(/[- :]/);

    const formatNumber = ( n: number | string ) => {
      n = String(n)
      if (n.length == 1)
        n = '0' + n
      return n
    }

    const month = parts[1];
    const year = parts[0];

    const currentdate = new Date();
    const cur_month = formatNumber( String( currentdate.getMonth() + 1 ));
    const cur_year = String( currentdate.getFullYear() );

    if (cur_month === month && year === cur_year)
      return true;

    return false;
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

    const paymentModal: HTMLElement = this.paymentModal.nativeElement;
    if ( paymentModal && paymentModal.classList.contains('payment-modal-active') ) {

      this.closePaymentModal();
    }

    const paymentModalStatus: HTMLElement = this.paymentModalStatus.nativeElement;
    if ( paymentModalStatus && paymentModalStatus.classList.contains('payment-modal-active') ) {

      this.closePaymentModalStatus();
    }
  }

  showReferencemodal(currentDebt: Credito): void{
    const referenceModal: HTMLElement = this.paymentReference.nativeElement;
    referenceModal.classList.remove('payment-modal-hide');
    referenceModal.classList.add('payment-modal-active');

    let jsn = JSON.stringify(currentDebt);
    referenceModal.setAttribute("debt", jsn);
  }

  closeReferenceModal(): void {
    this.referenceError = "";
    const modal: HTMLElement = this.paymentReference.nativeElement;
    modal.classList.add('fadeOutAnimation');

    setTimeout(() => {
      modal.classList.remove('fadeOutAnimation');
      modal.classList.remove('payment-modal-active');
      modal.classList.add('payment-modal-hide');
    }, 301 );
  }

  public getReference(reference: Reference): void {
    const referenceModal: HTMLElement = this.paymentReference.nativeElement;
    if (referenceModal.getAttribute("debt")) {
      let currentDebt: Credito = JSON.parse(referenceModal.getAttribute("debt")!);
      let isValidReference = this.validateReference(reference, currentDebt);
      if (isValidReference === true) {
        this.makePayment(currentDebt);
        this.closeReferenceModal();
      }
      else {
        this.referenceError = isValidReference;
      }
    }

  }

  // Valida ErrorCode, Amount y ExpirationDate
  validateReference(reference: Reference, debt: Credito) {
    if (reference.paging.results[0].ErrorCode != '0') return reference.paging.results[0].ErrorMessage;

    let amount = reference.paging.results[0].Amount;
    if (amount != debt.Pago_Periodico) return "La referencia no corresponde al monto";

    let dateReference = new Date(reference.paging.results[0].ExpirationDate);
    let today = new Date();
    if (dateReference.getTime() < today.getTime()) return "Referencia vencida";

    return true;
  }

  ChangePago(referencia: string, monto: any){
    const montoInt: number = parseFloat(monto.target.value.replace('$','').replace(',',''));
    const objeto = this.Pagos.find(item => item.Referencia_Bancaria === referencia);
    if (objeto) {
      objeto.Pago_Periodico = montoInt;
    }
  }

}
