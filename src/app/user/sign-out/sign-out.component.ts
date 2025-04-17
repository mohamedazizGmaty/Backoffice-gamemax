import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.css']
})
export class SignOutComponent {
  constructor(private router: Router) {}

  goToSignIn() {
    this.router.navigate(['/sign-in']);
  }
}