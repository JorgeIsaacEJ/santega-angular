import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
  ) {}

  canActivate(): boolean {
    const user = this.authService.getUser();

    if ( !user ) {
      
      this.router.navigate(['/auth/iniciar-sesion']);
      return false;
    } else {

      return true;
    }
  }
}