import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';
import { IAuthService } from 'src/app/shared/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login-main',
  templateUrl: './login-main.component.html',
  styleUrls: ['./login-main.component.scss']
})
export class LoginMainComponent implements OnInit {

  loading = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  userDoesNotExist = false;
  incorrectPassword = false;

  // shortcut for simpler html
  get f() {
    return this.loginForm.controls;
  }

  constructor(private authService: IAuthService, private router: Router) { }

  ngOnInit() {
  }

  showErrorMessage(control: AbstractControl): boolean {
    return (control.dirty || control.touched) && control.invalid;
  }

  onSubmit() {
    if (!this.loginForm.valid) { return; }

    this.userDoesNotExist = false;
    this.incorrectPassword = false;
    this.loading = true;

    this.authService.login(this.f.username.value, this.f.password.value)
      // .pipe(takeUntil(this.authService.isLogged())) // kill main subscription whenever this observable fires
      .subscribe(
        result => {
          if (result.success) {
            this.router.navigateByUrl('/board');
            return;
          } else {
            switch (result.errorType) {
              case IAuthService.USER_DOES_NOT_EXIST:
                this.userDoesNotExist = true;
                break;
              case IAuthService.INCORRECT_PASSWORD:
                this.incorrectPassword = true;
                break;
            }
            this.loading = false;
          }
        });
  }
}
