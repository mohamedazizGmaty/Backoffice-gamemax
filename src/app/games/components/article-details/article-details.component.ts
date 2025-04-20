import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameServiceService } from '../../service/game-service.service';
import { Article } from '../../models/article';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent implements OnInit {

  articleId!: number;
  article!: Article;
  priceUpdated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));

    this.gameService.getArticleById(this.articleId).subscribe({
      next: (data) => {
        this.article = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement de l\'article', err);
      }
    });
  }

  enablePriceUpdate(): void {
    this.priceUpdated = true;
  }

  disablePriceUpdate(): void {
    this.priceUpdated = false;
  }

  updatePrice(): void {
    const newPrice = (document.getElementById('price') as HTMLInputElement).value;
    if (newPrice) {
      this.gameService.updateArticlePrice(this.articleId, parseFloat(newPrice)).subscribe({
        next: () => {
          this.gameService.getArticleById(this.articleId).subscribe({
            next: (updatedArticle) => {
              this.article = updatedArticle;
              this.priceUpdated = false;
              console.log('Prix mis à jour et article rechargé avec succès');
            },
            error: (err) => {
              console.error('Erreur lors du rechargement de l\'article', err);
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du prix', err);
        }
      });
    }
  }

  deleteArticle(): void {
    this.gameService.deleteArticle(this.articleId).subscribe({
      next: () => {
        console.log('Article supprimé avec succès');
        this.router.navigate(['/marketplace']);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de l\'article', err);
      }
    });
  }

}
