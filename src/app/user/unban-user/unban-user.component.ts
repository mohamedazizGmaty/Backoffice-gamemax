import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-unbanuser',
  templateUrl: './unban-user.component.html',
  styleUrls: ['./unban-user.component.css']
})
export class UnbanuserComponent implements OnInit {
  userId!: number;
  isLoading = false;
  unbanSuccess = false;
  unbanReason: string = '';
  resultMessage: string = '';
  username!: string;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userId = +id;
    } else {
      this.router.navigate(['/']);
    }
  }

  submitUnban(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.userService.unbanUser(this.userId, this.unbanReason).subscribe({
      next: (result) => {
        this.unbanSuccess = true;
        this.resultMessage = result.message;
        this.isLoading = false;
        
        // Rafraîchir les données utilisateur après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/user', this.userId]);
        }, 2000);
      },
      error: (err) => {
        console.error('Erreur lors du débannissement:', err);
        this.isLoading = false;
        this.resultMessage = 'Une erreur est survenue lors du débannissement';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/userdetails', this.username]);;
  }
}