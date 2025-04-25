import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router'; // Ajout de l'import

@Component({
  selector: 'app-list-users',
  templateUrl: './listusers.component.html',
  styleUrls: ['./listusers.component.css']
})
export class ListUsersComponent implements OnInit {
  users: any[] = [];
  isLoading = true;
  searchText: string = '';

  constructor(
    private userService: UserService,
    private router: Router // Injection du Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  navigateToUserDetails(username: string): void { // Changé pour utiliser username
    this.router.navigate(['/userdetails', username]);
  }

  get filteredUsers(): any[] {
    if (!this.searchText) {
      return this.users;
    }
    const lowerSearch = this.searchText.toLowerCase();
    return this.users.filter(user =>
      user.username?.toLowerCase().includes(lowerSearch) ||
      user.fullName?.toLowerCase().includes(lowerSearch) ||
      user.email?.toLowerCase().includes(lowerSearch)
    );
  }
}