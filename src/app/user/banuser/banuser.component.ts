import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

interface BanRequestDto {
  reason: string;
  duration: 'TEMPORARY_7_DAYS' | 'TEMPORARY_30_DAYS' | 'PERMANENT'; // Modifié ici
  comment?: string;
}

interface BanResult {
  success: boolean;
  userId: number;
  reason: string;
  banEndDate?: string;
  emailSent: boolean;

}

@Component({
  selector: 'app-banuser',
  templateUrl: './banuser.component.html',
  styleUrls: ['./banuser.component.css']
})
export class BanuserComponent implements OnInit {
  username!: string;
  userId!: number;
  banData: BanRequestDto = {
    reason: '',
    duration: 'TEMPORARY_7_DAYS' // Valeur par défaut modifiée
  };
  reasons: string[] = [];
  durations: { value: 'TEMPORARY_7_DAYS' | 'TEMPORARY_30_DAYS' | 'PERMANENT', label: string }[] = [];
  isLoading = false;
  banResult?: BanResult;

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
      this.reasons = this.userService.getBanReasons();
      this.durations = this.userService.getBanDurations();
    } else {
      this.router.navigate(['/']);
    }
  }

  submitBan(): void {
    if (!this.userId || !this.banData.reason || !this.banData.duration) return;

    this.isLoading = true;
    this.userService.banUser(this.userId, this.banData).subscribe({
      next: (result) => {
        this.banResult = result;
        this.isLoading = false;
        // Rediriger vers userdetails avec le username
        this.router.navigate(['/userdetails', this.username]);
      },
      error: (err) => {
        console.error('Erreur lors du bannissement:', err);
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  resetForm(): void {
    this.banResult = undefined;
    this.banData = {
      reason: '',
      duration: 'TEMPORARY_7_DAYS'
    };
  }
}