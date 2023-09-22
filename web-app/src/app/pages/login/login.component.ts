import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  signIn() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService
        .signIn(username ?? '', password ?? '')
        .pipe(
          catchError(() => {
            alert('Credenciais inválidas. Confira os dados e tente novamente.');
            return [];
          }),
          tap(() => this.router.navigate(['/home']))
        )
        .subscribe();
    }
  }
}
