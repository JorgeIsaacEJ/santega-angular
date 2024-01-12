import { Component, HostListener } from '@angular/core';
import { AnimateService } from '../shared/services/animate.service';

@Component({
  selector: 'app-pages',
  template: `
    <div class="pages">
      <app-header></app-header>
      <router-outlet></router-outlet>
      <app-footer></app-footer>

      <div anim="ripple" class="arrow-to-top" (click)="goToTop();">
        <img 
          src="assets/arrow-to-top.png"
          alt="arrow-to-top.png"
        />
      </div>
    </div>
  `,
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent {

  constructor(
    private readonly animateService: AnimateService,
  ) {}

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

  goToTop(): void {

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
