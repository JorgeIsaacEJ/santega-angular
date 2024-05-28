import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AnimateService } from 'src/app/shared/services/animate.service';
import { EventsService } from 'src/app/shared/services/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('aboutUs') aboutUs!: ElementRef;
  @ViewChild('services') services!: ElementRef;
  @ViewChild('contact') contact!: ElementRef;

  public contactForm: FormGroup = this.fb.group({
    nombre: ['', [ Validators.required ]],
    email: ['', [ Validators.required, Validators.email ]],
    tel: [''],
    mensaje: ['', [ Validators.required ]],
  });

  constructor(
    private readonly animateService: AnimateService,
    private readonly eventsService: EventsService,
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {

    this.eventsService.sectionSelected$.subscribe(( section ) => {
      ( section !== '' ) &&
        this.goToSection( section );
    })
  }

  ngAfterViewInit(): void {

    this.route.queryParams.subscribe(({ s }) => {

      ( s ) &&
        this.goToSection( s );
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

  goToSection( section: string ): void {

    const element: HTMLElement =
      ( section === 'aboutUs' )
        ? this.aboutUs.nativeElement :
      ( section === 'services' )
        ? this.services.nativeElement :
      ( section === 'contact' ) &&
        this.contact.nativeElement;

    window.scrollTo({
      top: element.offsetTop - 50,
      behavior: 'smooth'
    });
  }

  submit(): void {

    // this.authService.login(
    //   this.loginForm.getRawValue()
    // ).subscribe(( value: any ) => {

    //   if ( value && value.Error !== '' ) {

    //     this.toastrService.info( value.Error );
    //     return;
    //   }

    //   this.getUserData( value.UserId );
    // });
  }
}
