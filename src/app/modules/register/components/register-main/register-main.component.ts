import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegisterService } from '../../services/register.service';
import { IAuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-register-main',
  templateUrl: './register-main.component.html',
  styleUrls: ['./register-main.component.scss']
})
export class RegisterMainComponent implements OnInit, OnDestroy {
  loading = false;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  registerFailed = false;

  // shortcut for simpler html
  get f() {
    return this.registerForm.controls;
  }

  sub: Subscription;

  constructor(private registerService: IRegisterService,
    private authService: IAuthService,
    private router: Router) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) { this.sub.unsubscribe(); }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }

  showErrorMessage(control: AbstractControl): boolean {
    return (control.dirty || control.touched) && control.invalid;
  }

  onSubmit() {
    if (!this.registerForm.valid) { return; }

    this.loading = true;
    this.registerFailed = false;

    this.sub = this.registerService.register(this.f.username.value, this.f.password.value)
      .pipe(flatMap(result => this.authService.login(this.f.username.value, this.f.password.value)))
      .subscribe(loginResult => {
        if (!loginResult.success) {
          // Something off happened. Send user to login where they can get more info on the error
          this.router.navigateByUrl('/login');
        } else {
          this.router.navigateByUrl('/board');
        }
      });
  }
}
