import {Component, OnInit} from '@angular/core';
import { GameServiceService } from '../../service/game-service.service';
import { Game } from '../../models/game';
import {Reviews} from "../../models/reviews";

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
  games: Game[] = [];
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
  filteredGames: Game[] = [];
  reviews: Reviews[] = [];
  isEditing: boolean = false;

  fullStars: number[] = [];
  hasHalfStar: boolean = false;
  emptyStars: number[] = [];


  constructor(private gameService: GameServiceService) {}

  ngOnInit(): void {
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
        this.filteredGames = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des jeux :', err);
      }
    });
  }

  searchGames(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();
    this.filteredGames = this.games.filter(game =>
      game.gameName.toLowerCase().includes(query)
    );
  }

  openGameModal(gameId: number): void {
    this.gameService.getGameById(gameId).subscribe({
      next: (game) => {
        this.selectedGame = game;


        // Récupération des reviews du jeu
        this.gameService.getGameReviews(gameId).subscribe({
          next: (reviews) => {
            this.reviews = reviews;
            this.updateAverageStars();

          },
          error: (err) => {
            console.error('Erreur lors de la récupération des reviews :', err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du jeu :', err);
      }
    });
  }

  deleteGame(gameId: number | undefined): void {
    if (!gameId) {
      console.error('Game ID is undefined');
      return;
    }

    this.gameService.deleteGame(gameId).subscribe({
      next: () => {
        console.log(`Game with ID ${gameId} deleted successfully.`);
        this.games = this.games.filter(game => game.gameId !== gameId);
      },
      error: (err) => {
        console.error('Error deleting game:', err);
      }
    });
  }

  deleteReview(reviewId: number | undefined): void {
    if (reviewId === undefined) {
      console.error('Review ID is undefined');
      return;
    }

    this.gameService.deleteReview(reviewId).subscribe({
      next: () => {
        console.log(`Review with ID ${reviewId} deleted successfully.`);
        this.reviews = this.reviews.filter(review => review.reviewId !== reviewId);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression du review :', err);
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = true;
  }

  toggleEditMode2(): void {
    this.isEditing = false;
  }

  updateGameAttributes(): void {
    const updatedGame: Game = {
      ...this.selectedGame, // Copie les propriétés actuelles, y compris imageUrls
      gameName: this.selectedGame.gameName,
      gameDescription: this.selectedGame.gameDescription,
      publisher: this.selectedGame.publisher,
      releaseDate: this.selectedGame.releaseDate,
      gameType: this.selectedGame.gameType,
      platform: this.selectedGame.platform
    };

    this.gameService.updateGame(updatedGame.gameId, updatedGame).subscribe(
      (response) => {
        console.log('Jeu mis à jour avec succès :', response);
        this.isEditing = false; // Quitte le mode édition
      },
      (error) => {
        console.error('Erreur lors de la mise à jour du jeu :', error);
      }
    );
  }

  calculateAverageRating(reviews: Reviews[]): number {
    if (reviews.length === 0) {
      return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }

  updateAverageStars(): void {
    const averageRating = this.calculateAverageRating(this.reviews);

    const fullStarsCount = Math.floor(averageRating);
    this.hasHalfStar = averageRating % 1 >= 0.5;
    const emptyStarsCount = 5 - fullStarsCount - (this.hasHalfStar ? 1 : 0);

    this.fullStars = Array(fullStarsCount).fill(0);
    this.emptyStars = Array(emptyStarsCount).fill(0);
  }





}
