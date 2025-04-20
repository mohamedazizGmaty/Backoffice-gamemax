import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../../service/game-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Game } from '../../models/game';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {

  games: Game[] = [];
  choosenGame: boolean = false;
  selectedGame: Game = {
  gameId: 0,
  gameName: '',
  gameType: '',
  gameDescription: '',
  publisher: '',
  releaseDate: new Date(),
  platform: '',
  imageUrls: []
};
  articleFrom!: FormGroup;

  constructor(private fb: FormBuilder, private gameService: GameServiceService, private router: Router) {}

  ngOnInit(): void {
    this.articleFrom = this.fb.group({
      gameSelect: ['', Validators.required],
      price: ['', Validators.required],
    });

    this.selectedGame = new Game(
      1,
      'Nom du jeu',
      'Type',
      'Description',
      'Éditeur',
      new Date(),
      'Plateforme',
      ['/assets/images/default1.jpg', '/assets/images/default2.jpg']
    );
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe({
      next: (data) => {
        this.games = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des jeux :', err);
      }
    });
  }

  selectGame(game: Game): void {
    this.choosenGame = true;
    this.selectedGame = game;
    this.articleFrom.get('gameSelect')?.setValue(game.gameId);
  }

  onSubmit(): void {
    if (this.articleFrom.valid) {
      const articleData = {
        gameId: this.articleFrom.value.gameSelect,
        price: this.articleFrom.value.price,
        creationDate: new Date(),
      };

      this.gameService.addArticle(articleData).subscribe({
        next: (response) => {
          console.log('Article ajouté avec succès :', response);
          this.articleFrom.reset();
          this.router.navigate(['/marketplace']);
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout de l\'article :', err);
          alert('Une erreur est survenue lors de l\'ajout de l\'article.');
        }
      });
    } else {
      console.log('Formulaire invalide');
    }
  }

}
