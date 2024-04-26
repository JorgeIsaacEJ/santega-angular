import { Component, EventEmitter, Output } from '@angular/core';
import { Reference, Tokenresponse } from 'src/app/shared/models/paycash.model';
import { PaycashService } from 'src/app/shared/services/paycash.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent {
  token!: Tokenresponse;  
  reference!: Reference;
  @Output() getReferenceResult = new EventEmitter<Reference>();

  constructor(private readonly paycashservice: PaycashService){

  }

  ngOnInit(): void{

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
}
