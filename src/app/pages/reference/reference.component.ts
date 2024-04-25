import { Component } from '@angular/core';
import { Reference, Tokenresponse } from 'src/app/shared/models/paycash.model';
import { PaycashService } from 'src/app/shared/services/paycash.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent {
  token: Tokenresponse[] = [];  
  reference: Reference[] = [];

  constructor(private readonly paycashservice: PaycashService){

  }

  ngOnInit(): void{

  }

  getReference(reference: string){
    //Genera token
    this.paycashservice.getToken().subscribe((data: Tokenresponse[])=>{
      this.token = data;
      //Valida la referencia
      let Tokenresponse = Object.values(this.token)[0].Authorization.toString();
      this.paycashservice.getReference(reference, Tokenresponse).subscribe((data: Reference[])=>{
        this.reference = data;
        //Valida si la referencia existe
        if(Object.values(this.reference)[0].paging.results.ErrorCode == '00'){
          alert('La referencia existe');
        }else{
          alert('La referencia no existe');
        }
      })
    })
  }
}
