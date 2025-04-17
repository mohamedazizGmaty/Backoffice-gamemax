import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostpasswordService } from '../services/lostpassword.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  forgotPasswordForm: FormGroup;
  submitted = false;
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private lostPasswordService: LostpasswordService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.setupVideo();
  }

  private setupVideo() {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch((error: any) => {
        console.warn('Auto-play prevented:', error);
        // Fallback pour les navigateurs stricts
        video.setAttribute('playsinline', '');
        video.muted = true;
        setTimeout(() => video.play(), 500);
      });
    }
  }

  get f() { 
    return this.forgotPasswordForm.controls; 
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    this.lostPasswordService.requestPasswordReset(this.f['email'].value).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Un email de réinitialisation a été envoyé. Veuillez vérifier votre boîte mail.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status === 404) {
          this.errorMessage = 'Aucun compte associé à cet email.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
      }
    });
  }
}