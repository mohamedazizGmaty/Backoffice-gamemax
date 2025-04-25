import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PacksService } from '../../services/packs.service';
import { Router } from '@angular/router';
import { PackFormModel } from '../../models/pack-form.model';

@Component({
  selector: 'app-add-pack',
  templateUrl: './add-pack.component.html',
  styleUrls: ['./add-pack.component.css']
})
export class AddPackComponent implements OnInit {
  packForm!: FormGroup;
  isLoading = false;
  isGenerating = false;
  errorMessage = '';
  games: any[] = [];
  categories: any[] = [];
  todayDate: string;
  formModel = new PackFormModel();
  selectedGamesNames: string[] = [];
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private packService: PacksService,
    private router: Router,
  ) {
    this.todayDate = this.formModel.availableDate;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadGames();
    this.loadCategories()
  }

  private initializeForm(): void {
    this.packForm = this.fb.group({
      packName: [this.formModel.packName, [Validators.required, Validators.maxLength(100)]],
      description: [this.formModel.description, [Validators.required, Validators.maxLength(500)]],
      availableDate: [this.formModel.availableDate, [Validators.required]],
      expirationDate: [this.formModel.expirationDate, [Validators.required]],
    //  selectedGames: [this.formModel.selectedGames, [Validators.required]],
      image: [this.formModel.image,[Validators.required]],
    });
  }

  private loadGames(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.packService.getGames().subscribe({
      next: (games) => {
        this.games = games;
        console.log('Successfully loaded games:', this.games);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Game loading error:', err);
        this.errorMessage = err.message || 'Could not load games. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  private loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.packService.getCategory().subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Successfully loaded games:', this.categories);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('categories loading error:', err);
        this.errorMessage = err.message || 'Could not load categories. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  updateSelectedGames(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newlySelectedOptions = Array.from(selectElement.selectedOptions)
      .map(option => option.value)
      .filter(value => !this.selectedGamesNames.includes(value));

    this.selectedGamesNames = [...this.selectedGamesNames, ...newlySelectedOptions];

    // Update the select element to reflect current selections
    setTimeout(() => {
      const selectEl = document.querySelector('select') as HTMLSelectElement;
      if (selectEl) {
        Array.from(selectEl.options).forEach(option => {
          option.selected = this.selectedGamesNames.includes(option.value);
        });
      }
    });
    console.log(this.selectedGamesNames);
  }

  // Remove a game from selection
  removeGame(gameName: string): void {
    this.selectedGamesNames = this.selectedGamesNames.filter(name => name !== gameName);
    // Update the select element to reflect the change
    setTimeout(() => {
      const selectElement = document.querySelector('select') as HTMLSelectElement;
      Array.from(selectElement.options).forEach(option => {
        option.selected = this.selectedGamesNames.includes(option.value);
      });
    });

  }

  onGameSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.formModel.selectedGames = Array.from(selectElement.selectedOptions)
      .map(option => option.value);

    this.packForm.get('selectedGames')?.setValue(this.formModel.selectedGames);
    this.selectedGamesNames = this.games
      .filter(game => this.formModel.selectedGames.includes(game.id))
      .map(game => game.name);
  }

  generatePackInfo(): void {

    if (this.selectedGamesNames.length === 0) {
      this.errorMessage = 'Veuillez sélectionner au moins un jeu';
      return;
    }

    this.isGenerating = true;
    this.errorMessage = '';

    this.packService.generatePackInfo(this.selectedGamesNames).subscribe({
      next: (response) => {
        this.packForm.patchValue({
          packName: response.packName,
          description: response.description
        });
        this.isGenerating = false;
      },
      error: (err) => {
        this.errorMessage = 'Échec de la génération: ' + (err.error?.message || err.message);
        this.isGenerating = false;
      }
    });
  }
  //
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.selectedFiles = Array.from(input.files);
  //     this.formModel.image = this.selectedFiles[0];
  //   }
  // }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatDateForAPI(date: string): string {
    return new Date(date).toISOString();
  }

  // onSubmit(): void {
  //   if (this.packForm.invalid) {
  //     this.markFormGroupTouched(this.packForm);
  //     this.errorMessage = 'Veuillez remplir tous les champs requis correctement';
  //     return;
  //   }
  //
  //   if (!this.formModel.image) {
  //     this.errorMessage = 'Veuillez sélectionner une image pour le pack';
  //     return;
  //   }
  //
  //
  //
  //   this.isLoading = true;
  //   this.errorMessage = '';
  //
  //   const formData = new FormData();
  //   formData.append('packName', this.formModel.packName);
  //   formData.append('description', this.formModel.description);
  //   formData.append('availableDate', this.formatDateForAPI(this.formModel.availableDate));
  //   formData.append('expirationDate', this.formatDateForAPI(this.formModel.expirationDate));
  //
  //   if (this.formModel.image) {
  //     formData.append('image', this.formModel.image);
  //   }
  //
  //   // this.formModel.selectedGames.forEach((gameId: string, index: number) => {
  //   //   formData.append(`gameIds[${index}]`, gameId);
  //   // });
  //
  //   this.packService.savePack(formData,3).subscribe({
  //     next: () => {
  //       this.isLoading = false;
  //       this.router.navigate(['/allPacks']);
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la création du pack';
  //       console.error('Error saving pack:', err);
  //     }
  //   });
  // }


  onSubmit(): void {
    if (this.packForm.invalid) {
      this.markFormGroupTouched(this.packForm);
      this.errorMessage = 'Veuillez remplir tous les champs requis correctement';
      return;
    }

    if (!this.formModel.image) {
      this.errorMessage = 'Veuillez sélectionner une image pour le pack';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const packData = {
      packName: this.packForm.value.packName,
      description: this.packForm.value.description,
      availableDate: this.formatDateForAPI(this.packForm.value.availableDate),
      expirationDate: this.formatDateForAPI(this.packForm.value.expirationDate),
      // selectedGames: this.formModel.selectedGames // tu peux le remettre si utilisé
    };

    const formData = new FormData();
    formData.append('pack', JSON.stringify(packData)); // IMPORTANT : clé = 'pack'
    formData.append('image', this.formModel.image);    // clé = 'image'

    this.packService.savePack(formData, 3).subscribe({
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


  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.formModel.image = file;
    this.packForm.patchValue({ image: file });
    this.packForm.get('image')?.updateValueAndValidity();
    console.log('Form Valid after file selection:', this.packForm);
    console.log('Image Control Valid after file selection:', this.packForm.get('image')?.valid);
    console.log('Image Control Errors after file selection:', this.packForm.get('image')?.errors);
  }


}

