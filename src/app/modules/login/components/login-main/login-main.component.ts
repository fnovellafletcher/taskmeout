import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators } from '@angular/forms';

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

  // shortcut for simpler html
  get f() {
    return this.loginForm.controls;
  }

  constructor() { }

  ngOnInit() {
  }

  showErrorMessage(control: AbstractControl): boolean {
    return (control.dirty || control.touched) && control.invalid;
  }

  onSubmit() {
    this.loading = true;
  }
}
