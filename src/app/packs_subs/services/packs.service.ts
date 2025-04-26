import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pack } from '../models/pack.model';
import { Game } from '../models/game.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacksService {

  private apiUrl = 'http://26.3.30.155:8080/api/packs';
  private apiUrl_games = 'http://26.3.30.155:8080/api/packs';
  private apiUrl_Categories = 'http://26.3.30.155:8080/api/packs/getAllCategories';

  private apiUrl_Ai = 'http://26.3.30.155:8094/api/generate-pack';

  private pack: any;





  constructor(private http: HttpClient) {}

  getAllPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl}/allPacks`);
  }

  getPacksbyPlan(planId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/by-plan/${planId}`).pipe(
      map(packs => packs)
    );
  }

  savePack(formData: FormData,categorie :number): Observable<any> {
    return this.http.post(`${this.apiUrl}/savePack?categorieId=${categorie}`, formData);
  }

  updatePack(packData: Pack): Observable<Pack> {
    console.log(packData.packId);
    return this.http.put<Pack>(`${this.apiUrl}/updatePack/${packData.packId}`, packData);
  }
  deletePack(packId: number): Observable<any> {
    if (!packId) {
      throw new Error('Pack ID is required');
    }
    return this.http.delete(`${this.apiUrl}/deletePack/${packId}`);
  }

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl_games}/games`).pipe(
      catchError(error => {
        console.error('Error fetching games:', error);
        return throwError(() => new Error('Failed to load games'));
      })
    );
  }

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl_Categories).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return throwError(() => new Error('Failed to load categories'));
      })
    );
  }


  assignGamesToPack(gameIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/savePack`, gameIds);
  }

  generatePackInfo(games: string[]): Observable<any> {
    return this.http.post(this.apiUrl_Ai, { games });
  }
}
