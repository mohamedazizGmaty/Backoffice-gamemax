import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostpasswordService } from '../services/lostpassword.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.css']
})
export class LostPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private lostpasswordService: LostpasswordService
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.lostpasswordService.requestPasswordReset(this.f['email'].value).subscribe({
      next: () => {
        this.successMessage = 'Un email de réinitialisation a été envoyé.';
        this.router.navigate(['/resetpassword'], { queryParams: { email: this.f['email'].value } });
      },
      error: (error) => {
        this.errorMessage = error.status === 404 
          ? 'Aucun compte associé à cet email.' 
          : 'Une erreur est survenue. Veuillez réessayer.';
      }
    });
  }
}