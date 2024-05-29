import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MailModels } from 'src/app/shared/models/message.model';
import { AnimateService } from 'src/app/shared/services/animate.service';
import { EventsService } from 'src/app/shared/services/events.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

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
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    mensaje: ['', [Validators.required]],
  });

  constructor(
    private readonly userService: UserService,
    private readonly toastrService: ToastrService,
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
    if (this.contactForm.invalid) {
      const controls = this.contactForm.controls;
      for (const name in controls) {
        if (controls[name].hasError('required')) {
          this.toastrService.error(`Campo ${name} requerido`);
          return;
        }
        if (controls[name].invalid) {
          this.toastrService.error(`Campo ${name} inválido, por favor verifica`);
          return;
        }
      }
      return;
    }
    let model: MailModels ={
      nombre: this.contactForm.controls['nombre'].value,
      correo: this.contactForm.controls['email'].value,
      telefono: this.contactForm.controls['telefono'].value,
      mensaje: this.contactForm.controls['mensaje'].value,
    }
    this.userService.SantegaMail(model).subscribe(( resp ) => {
      if ( resp !== '' ){
        this.toastrService.success(`Tu correo se envio correctamente`);
      } else {
        this.toastrService.error(`Error al enviar correo`);
      }
    })
  }
}
