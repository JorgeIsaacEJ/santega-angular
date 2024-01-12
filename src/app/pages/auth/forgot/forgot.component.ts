import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ForgotComponent implements OnInit {

  constructor() {}

  ngOnInit(): void {
    
    window.scrollTo({ top: 0 });
  }
}
