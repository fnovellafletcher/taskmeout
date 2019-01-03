import { Component, OnInit } from '@angular/core';
import { IAuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { $ } from 'protractor';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean;

  get username() {
    return this.loggedIn ? this.authService.getUsername() : '';
  }

  constructor(private authService: IAuthService) { }

  ngOnInit() {
    this.authService.isLogged()
      .subscribe(isLogged => {
        this.loggedIn = isLogged;
      });
  }

  logout($event: Event) {
    $event.stopPropagation();
    this.authService.logout();
  }
}
