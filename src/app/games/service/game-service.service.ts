import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Game} from "../models/game";
import {Reviews} from "../models/reviews";
import {Article} from "../models/article";
import {Coupon} from "../models/coupon";
import {environment} from "../../enviroment/env";

@Injectable({
  providedIn: 'root'
})
export class GameServiceService {

  private readonly BASE_URL_ARTICLE = `${environment.apiUrl}/articles`;
  private readonly BASE_URL_REVIEW = `${environment.apiUrl}/games/reviews`;
  private readonly BASE_URL_GAME = `${environment.apiUrl}/games`;
  private readonly BASE_URL_COUPON = `${environment.apiUrl}/coupons`;

  // private readonly BASE_URL_GAME = 'http://localhost:8080/api/games';
  // private readonly BASE_URL_REVIEW = 'http://localhost:8080/api/games/reviews';
  // private readonly BASE_URL_ARTICLE = 'http://localhost:8080/api/articles';
  // private readonly BASE_URL_COUPON = 'http://localhost:8080/api/coupons';

  constructor(private http: HttpClient) {
  }

  addGame(gameData: FormData): Observable<any> {
    return this.http.post(`${this.BASE_URL_GAME}`, gameData);
  }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.BASE_URL_GAME}`);
  }

  getGameById(gameId: number): Observable<Game> {
    return this.http.get<Game>(`${this.BASE_URL_GAME}/${gameId}`);
  }

  deleteGame(gameId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL_GAME}/${gameId}`);
  }

  getGameReviews(gameId: number): Observable<Reviews[]> {
    return this.http.get<Reviews[]>(`${this.BASE_URL_REVIEW}/${gameId}`);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL_REVIEW}/${reviewId}`);
  }

  updateGame(gameId: number, gameData: Game): Observable<Game> {
    return this.http.put<Game>(`${this.BASE_URL_GAME}/${gameId}`, gameData);
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.BASE_URL_ARTICLE}`);
  }

  addArticle(articleData: any): Observable<any> {
    return this.http.post(`${this.BASE_URL_ARTICLE}`, articleData);
  }

  getArticleById(articleId: number): Observable<Article> {
    return this.http.get<Article>(`${this.BASE_URL_ARTICLE}/${articleId}`);
  }

  updateArticlePrice(articleId: number, newPrice: number): Observable<Article> {
    const url = `${this.BASE_URL_ARTICLE}/${articleId}/${newPrice}`;
    return this.http.put<Article>(url, {});
  }

  deleteArticle(articleId: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL_ARTICLE}/${articleId}`);
  }

  getCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(`${this.BASE_URL_COUPON}`);
  }

  addCoupon(couponData: { couponCode: string; discount: number }): Observable<Coupon> {
    return this.http.post<Coupon>(`${this.BASE_URL_COUPON}`, couponData);
  }

}
