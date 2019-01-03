import { Component, OnInit, OnDestroy } from '@angular/core';
import { IAuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-board-main',
  templateUrl: './board-main.component.html',
  styleUrls: ['./board-main.component.scss']
})
export class BoardMainComponent implements OnInit, OnDestroy {

  authSub: Subscription;

  constructor(private authService: IAuthService, private router: Router) { }

  ngOnInit() {
    // send to /login if user is not authenticated
    this.authSub = this.authService.isLogged().subscribe(isLogged => {
      if (!isLogged) {
        this.router.navigateByUrl('/login');
      }
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
