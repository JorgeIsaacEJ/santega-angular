import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AnimateService } from 'src/app/shared/services/animate.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user?: any;

  constructor(
    private readonly animateService: AnimateService,
    private readonly eventsService: EventsService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly localStorageService: LocalStorageService,
  ) {
    this.user = localStorageService.getData('user') ? JSON.parse( localStorageService.getData('user') ) : null;
  }

  ngOnInit(): void {
    
    this.router.events.subscribe((val) => {

      if ( val instanceof NavigationEnd ) {

        this.user = this.localStorageService.getData('user') ? JSON.parse( this.localStorageService.getData('user') ) : null;
      }
  });
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

  setSection( section: string ): void {

    this.eventsService.setSectionSelected( section );
    this.router.navigate(['/inicio'], {
      queryParams: {
        s: section
      }
    })
  }

  logout(): void {
    this.localStorageService.removeData('user');
    this.localStorageService.removeData('spartane_user');
    this.router.navigate(['auth/iniciar-sesion']);
  }
}
