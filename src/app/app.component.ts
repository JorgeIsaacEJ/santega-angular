import { Component, OnInit } from '@angular/core';
import { ThemeService } from './shared/services/theme.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'santega-angular';

  constructor(
    private readonly themeService: ThemeService,
    private readonly authService: AuthService,
  ) {

    themeService.getTheme();
    authService.getAuthorization().subscribe();
  }
}
