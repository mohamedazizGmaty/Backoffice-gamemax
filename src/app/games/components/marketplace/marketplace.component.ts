import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../../service/game-service.service';
import { Article } from '../../models/article';
import {environment} from "../../../enviroment/env";

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit{

  articles: Article[] = [];
  filteredArticles: Article[] = [];
  baseUrl: string = environment.apiUrlImg;

  constructor(private gameService: GameServiceService) {}

  ngOnInit(): void {
    this.gameService.getArticles().subscribe({
      next: (data: Article[]) => {
        this.articles = data;
        this.filteredArticles = data;
        console.log('Articles récupérés avec succès :', this.articles);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des articles :', err);
      }
    });
  }

  searchArticles(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.toLowerCase();
    this.filteredArticles = this.articles.filter(article =>
      article.game.gameName.toLowerCase().includes(query)
    );
  }

}
