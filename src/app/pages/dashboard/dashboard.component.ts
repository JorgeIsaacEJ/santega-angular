import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AnimateService } from 'src/app/shared/services/animate.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
declare let SafeCharge: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('paymentModal') paymentModal!: ElementRef;
  public user: any;
  
  constructor(
    private readonly animateService: AnimateService,
    private readonly toastrService: ToastrService,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.user = JSON.parse( localStorageService.getData('user') );
  }

  ngOnInit(): void {
    
    window.scrollTo({ top: 0 });
    
    // var sfc = SafeCharge({
    //   env: 'dev',
    //   merchantId: '7503723445257421239',
    //   merchantSiteId: '248868',
    //   merchantSecretKey: 'o30IbzHnpBxOactKPNdNum7ITpJvCbIVCKbJNKpbnWttwVgPckqaU2HmCNyq9jlD',
    // });

    // console.log( sfc )
    // sfc.createPayment({
    //   "userTokenId": "230811147",
    //   "clientUniqueId": "695701003", // optional
    //   "cardHolderName": 'Test',
    //   "paymentOption": 'card',
    //   "billingAddress": {
    //     "email": "someone@somedomain.com",
    //     "country": "GB"
    //   }
    // }, function(res: any) {
    //   console.log(res);
    // })
  }

  makePayment(): void {

    const modal: HTMLElement = this.paymentModal.nativeElement;
    modal.classList.add('payment-modal-active');
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
      modal.classList.add('fadeOutAnimation');

      setTimeout(() => {
        modal.classList.remove('fadeOutAnimation');
        modal.classList.remove('payment-modal-active');
      }, 301 );
    }
  }
}
