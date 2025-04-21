import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pack } from '../models/pack.model';

@Injectable({
  providedIn: 'root'
})
export class PacksService {

  private apiUrl = 'http://localhost:8080/api/packs/allPacks';
  private apiUrl_ = 'http://localhost:8080/api/packs';
  private apiUrl_games = 'http://localhost:8080/api/packs/games';
  private pack: any;





  constructor(private http: HttpClient) {}

  getAllPacks(): Observable<Pack[]> {
    return this.http.get<Pack[]>(this.apiUrl).pipe(
      map(packs => packs.map(pack => new Pack(pack)))
    );
  }

  getPacksbyPlan(planId: number): Observable<Pack[]> {
    return this.http.get<Pack[]>(`${this.apiUrl_}/by-plan/${planId}`).pipe(
      map(packs => packs.map(pack => new Pack(pack)))
    );
  }

  savePack(packData: {
    packName: any;
    description: any;
    availableDate: string;
    expirationDate: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl_}/savePack`, packData);
  }

  updatePack(packData: Pack): Observable<Pack> {
    console.log(packData.packId);
    return this.http.put<Pack>(`${this.apiUrl_}/updatePack/${packData.packId}`, packData);
  }
  deletePack(packId: number): Observable<any> {
    if (!packId) {
      throw new Error('Pack ID is required');
    }
    return this.http.delete(`${this.apiUrl_}/deletePack/${packId}`);
  }

  getGames(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl_games);
  }


  assignGamesToPack(gameIds: number[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/savePack`, gameIds);
  }
}
