import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {GameServiceService} from "../../service/game-service.service";
import { Router } from '@angular/router';
import Dropzone from 'dropzone';
import {DeepSeekService} from "../../service/deep-seek-service.service";

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.css']
})
export class AddGameComponent implements OnInit, AfterViewInit {
  gameForm!: FormGroup;
  dropzoneFiles: File[] = [];
  dropzone: any;
  isLoadingDescription: boolean = false;
  isgameNameInserted: boolean = false;


  constructor(private fb: FormBuilder, private gameService: GameServiceService, private router: Router, private deepSeekService: DeepSeekService) {}

  ngOnInit(): void {
    this.gameForm = this.fb.group({
      gameName: ['', [Validators.required, Validators.minLength(3)]],
      gameDescription: ['', [Validators.required, Validators.minLength(10)]],
      publisher: ['', Validators.required],
      releaseDate: ['', Validators.required],
      gameType: ['', Validators.required],
      platform: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // Initialisation de Dropzone uniquement une fois l'élément présent dans le DOM
    this.dropzone = new Dropzone('#dropzone-multiple', {
      url: '/', // URL fictive car nous n'envoyons pas réellement de fichiers ici
      autoProcessQueue: false,
      addRemoveLinks: true,
      acceptedFiles: 'image/*',
      maxFiles: 10, // Limiter à 5 fichiers, vous pouvez ajuster selon vos besoins
    });

    // Événements Dropzone
    this.dropzone.on('addedfile', (file: File) => {
      this.dropzoneFiles.push(file); // Ajoute le fichier à la liste des fichiers
    });

    this.dropzone.on('removedfile', (file: File) => {
      this.dropzoneFiles = this.dropzoneFiles.filter(f => f !== file); // Supprime le fichier de la liste
    });
  }

  onSubmit(): void {
    if (this.gameForm.valid) {
      const formData = new FormData();
      const gameData = {
        gameName: this.gameForm.value.gameName,
        gameType: this.gameForm.value.gameType,
        gameDescription: this.gameForm.value.gameDescription,
        publisher: this.gameForm.value.publisher,
        releaseDate: this.gameForm.value.releaseDate,
        platform: this.gameForm.value.platform,
      };


      formData.append('game', new Blob([JSON.stringify(gameData)], { type: 'application/json' }));

      // Ajout des fichiers images (via Dropzone)
      this.dropzoneFiles.forEach(file => {
        formData.append('images', file);
      });

      // Envoi des données via le service
      this.gameService.addGame(formData).subscribe({
        next: (response) => {
          console.log('Game added successfully:', response);
          this.gameForm.reset();
          this.dropzoneFiles = []; // Réinitialise les fichiers Dropzone
          this.dropzone.removeAllFiles(); // Supprime tous les fichiers dans Dropzone
          this.router.navigate(['/games']);
        },
        error: (err) => {
          console.error('Error adding game:', err);
          alert('An error occurred while adding the game.');
        }
      });
    } else {
      console.log('Formulaire invalide');
    }
  }

  onGenerateDescription(): void {
    const gameName = this.gameForm.get('gameName')?.value;
    if (gameName) {
      this.isgameNameInserted = true;
      this.isLoadingDescription = true;
      this.deepSeekService.generateGameDescription(gameName).subscribe({
        next: (description: string) => {
          this.gameForm.patchValue({ gameDescription: description });
          this.isLoadingDescription = false;
        },
        error: (err) => {
          console.error('Erreur lors de la génération de la description :', err);
          this.isLoadingDescription = false;
        }
      });
    } else {
      this.isgameNameInserted = true;
      console.error('Le nom du jeu est vide.');
    }
  }




}
