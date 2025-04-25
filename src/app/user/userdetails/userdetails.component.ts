import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-details',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: any;
  isLoading = true;
  banHistory: any[] = [];
  showBanHistory = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router , 
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.router.events.subscribe(event => {
      if (this.router.getCurrentNavigation()?.extras?.state?.['refresh']) {
        this.loadUserDetails();
      }
    });
  }

  loadUserDetails(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.userService.getUserByUsername(username).subscribe({
        next: (data) => {
          this.user = data;
          if (this.user.isBanned || this.user.banHistory?.length) {
            this.loadBanHistory();
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load user', err);
          this.isLoading = false;
        }
      });
    });
  }

  loadBanHistory(): void {
    if (this.user?.userId) {
      this.userService.getBanHistory(this.user.userId).subscribe({
        next: (history) => {
          this.banHistory = history;
        },
        error: (err) => {
          console.error('Failed to load ban history', err);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatJoinDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
    
    if (diffMonths < 1) return 'Less than a month ago';
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }

  resetPassword(): void {
    console.log('Reset password for:', this.user.username);
  }

  toggleBanHistory(): void {
    this.showBanHistory = !this.showBanHistory;
    if (this.showBanHistory && !this.banHistory.length) {
      this.loadBanHistory();
    }
  }
}