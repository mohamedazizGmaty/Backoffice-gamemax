import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LostpasswordService } from '../services/lostpassword.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  email: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private lostPasswordService: LostpasswordService
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validator: this.mustMatch('password', 'confirmPassword') 
    });
  }

  ngOnInit(): void {
    this.lostPasswordService.validateResetEmail(this.email).subscribe({
      next: () => {},
      error: () => {
        this.errorMessage = 'Lien invalide ou expiré';
        setTimeout(() => this.router.navigate(['/lost-password']), 2000);
      }
    });
  }

  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.resetForm.invalid) {
      return;
    }

    this.lostPasswordService.resetPassword(this.email, this.f['password'].value).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe réinitialisé avec succès';
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      },
      error: () => {
        this.errorMessage = 'Mot de passe réinitialisé avec succès';
        setTimeout(() => this.router.navigate(['/signin']), 2000);
      }
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}