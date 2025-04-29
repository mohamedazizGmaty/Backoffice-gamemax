import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PacksService } from '../../services/packs.service';
import { Router } from '@angular/router';
import { PackFormModel } from '../../models/pack-form.model';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/env";

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
  selectedGamesId: string[] = [];
  selectedCategoryId: number=3;
  imageUrl: string | undefined;



  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private packService: PacksService,
    private router: Router,
    private http: HttpClient
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
         // Assurez-vous que 'categoryName' est la bonne propriété

        this.packService.createCategorie(  response.category ).subscribe({
          next: (newCategory) => {
            this.categories = [...this.categories, newCategory];
            this.selectedCategoryId = newCategory.categorieId;
            this.packForm.patchValue({
              packName: response.packName,
              description: response.description
            });

            this.isGenerating = false;
          },
          error: (err) => {
            this.errorMessage = 'Erreur lors de la création de la catégorie : ' + (err.error?.message || err.message);
            this.isGenerating = false;
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Échec de la génération : ' + (err.error?.message || err.message);
        this.isGenerating = false;
      }
    });

  }


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
    console.log(this.selectedCategoryId);


    this.isLoading = true;
    this.errorMessage = '';

    const packData = {
      packName: this.packForm.value.packName,
      description: this.packForm.value.description,
      availableDate: this.formatDateForAPI(this.packForm.value.availableDate),
      expirationDate: this.formatDateForAPI(this.packForm.value.expirationDate),

     //  selectedGames: ["1","2"] // tu peux le remettre si utilisé
    };

    const formData = new FormData();
    formData.append('pack', JSON.stringify(packData)); // IMPORTANT : clé = 'pack'
    formData.append('image', this.formModel.image);    // clé = 'image'
    console.log('Catégorie choisie :', this.selectedCategoryId);
    this.packService.savePack(formData, Number(this.selectedCategoryId)).subscribe({
      next: (savedPack) => {
        console.log('Inserted Pack:', savedPack);

        const selectedGameIds = this.games
          .filter(game => this.selectedGamesNames.includes(game.gameName))
          .map(game => game.gameId);
        console.log('Games assigned successfully.',selectedGameIds);

        this.packService.assignGamesToPack(selectedGameIds, savedPack.packId).subscribe({

          next: () => {
            this.isLoading = false;
           this.router.navigate(['/allPacks']);
          },
          error: (assignError) => {
            console.error('Error assigning games to pack:', assignError);
            this.isLoading = false;
            this.errorMessage = assignError.error?.message || 'Erreur lors de l\'assignation des jeux au pack';
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de la création du pack';
        console.error('Error saving pack:', err);
      }
    });

  }

  generateImage() {
    const prompt = 'A high-resolution, cinematic poster about a game pack about these folowing games : '+this.selectedGamesNames+' . Professional concept art style, 4K quality, poster layout with depth, contrast, and powerful composition.\n';
    const encodedPrompt = encodeURIComponent(prompt);

    this.http.post(`${environment.apiUrl}/generate-pack/image?prompt=${encodedPrompt}`, {
      responseType: 'blob'
    }).subscribe(blob => {
      //this.imageUrl = URL.createObjectURL(blob);
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

