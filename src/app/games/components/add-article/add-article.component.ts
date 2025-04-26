import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../../service/game-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Game } from '../../models/game';
import {DeepSeekService} from "../../service/deep-seek-service.service";
import {environment} from "../../../enviroment/env";

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {

  games: Game[] = [];
  baseUrl: string = environment.apiUrlImg;

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
  isCheckingPrice: boolean = false;
  priceAnalysis: string = '';

  priceRating: string = '';
  platformAverages: string = '';
  advice: string = '';

  constructor(private fb: FormBuilder, private gameService: GameServiceService, private router: Router, private deepSeekService: DeepSeekService) {}

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

  checkGamePrice(): void {
    const gameName = this.selectedGame.gameName;
    const price = this.articleFrom.get('price')?.value;

    if (gameName && price) {
      this.isCheckingPrice = true;
      this.deepSeekService.checkGamePrice(gameName, price).subscribe({
        next: (analysis: string) => {
          this.priceAnalysis = analysis;
          const parsedAnalysis = this.parsePriceAnalysis(analysis);

          // Stocker les sections parsées
          this.priceRating = parsedAnalysis.priceRating;
          this.platformAverages = parsedAnalysis.platformAverages;
          this.advice = parsedAnalysis.advice;

          console.log(this.priceRating);
          console.log(this.platformAverages);
          console.log(this.advice);
          console.log(this.priceAnalysis);

          this.isCheckingPrice = false;
        },
        error: (err) => {
          console.error('Erreur lors de l\'analyse du prix :', err);
          this.priceAnalysis = 'Erreur lors de l\'analyse du prix.';
          this.isCheckingPrice = false;
        }
      });
    } else {
      console.error('Nom du jeu ou prix manquant.');
    }
  }

  parsePriceAnalysis(analysis: string): { priceRating: string; platformAverages: string; advice: string } {
    const priceRatingMatch = analysis.match(/- \*\*Price Rating\*\*: (.+?)\n/s);
    const platformAveragesMatch = analysis.match(/- \*\*Average Prices\*\*:\s+([\s\S]+?)- \*\*Advice\*\*:/s);
    const adviceMatch = analysis.match(/- \*\*Advice\*\*: (.+)$/s);

    return {
      priceRating: priceRatingMatch ? priceRatingMatch[1].trim() : '',
      platformAverages: platformAveragesMatch ? platformAveragesMatch[1].trim() : '',
      advice: adviceMatch ? adviceMatch[1].trim() : ''
    };
  }

}
