import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pack } from '../models/pack.model';
import {Subscription} from "../models/subscription";


@Injectable({
  providedIn: 'root'
})
export class SubssService {

  private apiUrl = 'http://localhost:8080/api/packs/';
 private apiUrlSub= 'http://localhost:8080/api/subscriptions'





  constructor(private http: HttpClient) {}

  getAllSubs(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.apiUrlSub}/allSubscriptions`).pipe(
      map(subs => subs.map(sub => new Subscription(sub)))
    );
  }

  assignPack(packId: number,SubId:number): Observable<any> {
    if (!packId) {
      throw new Error('Pack ID is required');
    }

    return this.http.post(`${this.apiUrl}/assignPack/${SubId}/${packId}`,packId);
  }
  unassignPack(packId: number,SubId:number): Observable<any> {
    if (!packId) {
      throw new Error('Pack ID is required');
    }

    return this.http.post(`${this.apiUrl}/unassignPack/${SubId}/${packId}`,packId);
  }



}
