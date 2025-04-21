import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacksService } from '../../services/packs.service';
import { Router } from '@angular/router';
import { PackForm } from '../../models/pack-form.model';

@Component({
  selector: 'app-add-pack',
  templateUrl: './add-pack.component.html',
  styleUrls: ['./add-pack.component.css']
})
export class AddPackComponent implements OnInit {

  packForm: FormGroup = this.fb.group({
    packName: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    availableDate: [this.getFormattedDate(new Date()), Validators.required],
    expirationDate: ['', Validators.required],
    selectedGames: [[]]
  });
  isLoading = false;
  errorMessage = '';
  games: any[] = [];
  todayDate: string;

  constructor(
    private fb: FormBuilder,
    private packService: PacksService,
    private router: Router,
  ) {
    this.todayDate = this.getFormattedDate(new Date());
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadGames();
  }

  private initializeForm(): void {
    this.packForm = this.fb.group({
      packName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      availableDate: [this.todayDate, Validators.required],
      expirationDate: ['', Validators.required],
      selectedGames: [[]]
    });
  }

  private loadGames(): void {
    this.packService.getGames().subscribe({
      next: (data) => this.games = data,
      error: (err) => console.error('Error loading games', err)
    });
  }



  onSubmit(): void {
    if (this.packForm.invalid) {
      this.markFormGroupTouched(this.packForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData: PackForm = {
      packName: this.packForm.value.packName,
      description: this.packForm.value.description,
      availableDate: this.formatDateForAPI(this.packForm.value.availableDate),
      expirationDate: this.formatDateForAPI(this.packForm.value.expirationDate),
     // gameIds: this.packForm.value.selectedGames
    };

    this.packService.savePack(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/allPacks']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la création du pack';
        console.error('Error saving pack:', err);
      }
    });
  }

  private getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private formatDateForAPI(date: string): string {
    return new Date(date).toISOString();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
