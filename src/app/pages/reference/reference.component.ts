import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Reference, Tokenresponse } from 'src/app/shared/models/paycash.model';
import { PaycashService } from 'src/app/shared/services/paycash.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent {
  form!:FormGroup;
  token!: Tokenresponse;
  reference!: Reference;
  @Output() getReferenceResult = new EventEmitter<Reference>();

  constructor(private readonly paycashservice: PaycashService){

  }

  ngOnInit(): void{
    this.form = new FormGroup({
      freferencenumber: new FormControl('', [Validators.required, Validators.minLength(4)]),
      freference: new FormControl()
    });
  }

  submit(){
    this.form.controls['freference'].setValue({
      referencenumber: this.form.controls['freferencenumber'].value
    });
  }

  get f(){
    return this.form.controls;
  }

  getReference(reference: string){
    //Genera token
    this.paycashservice.getToken().subscribe((data: Tokenresponse)=>{
      this.token = data;
      //Valida la referencia
      let Tokenresponse = this.token.Authorization;
      this.paycashservice.getReference(reference, Tokenresponse).subscribe((reference: Reference)=>{
        this.reference = reference;
        this.getReferenceResult.emit(this.reference);
      })
    })
  }

  validateReference(ref: AbstractControl): boolean{
    if (ref.touched && (ref.invalid || ref.errors && ref.errors['required'])) {
      return false;
    }
    else{
      return true;
    }
  }
}
