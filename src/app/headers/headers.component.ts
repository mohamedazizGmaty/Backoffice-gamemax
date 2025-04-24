// src/app/layout/header/headers.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../user/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})
export class HeadersComponent implements OnInit {
  currentUser: any;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      console.log('Current user in header:', user); // Pour le débogage
    });
    
    // Charge l'utilisateur au démarrage si déjà connecté
    if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}