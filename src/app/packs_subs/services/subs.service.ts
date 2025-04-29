import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pack } from '../models/pack.model';
import {Subscription} from "../models/subscription";
import {environment} from "../../enviroment/env";


@Injectable({
  providedIn: 'root'
})
export class SubssService {

  private apiUrl = `${environment.apiUrl}/packs/`;
 private apiUrlSub= `${environment.apiUrl}/subscriptions`;





  constructor(private http: HttpClient) {}

  getAllSubs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlSub}/allSubscriptions`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlSub}/users`);
  }

  assignPack(packId: number,SubId:number): Observable<any> {
    if (!packId) {
      throw new Error('Pack ID is required');
    }

    return this.http.post(`${this.apiUrl}assignPack/${SubId}/${packId}`,packId);
  }

  unassignPack(packId: number,SubId:number): Observable<any> {
    if (!packId) {
      throw new Error('Pack ID is required');
    }

    return this.http.post(`${this.apiUrl}unassignPack/${SubId}/${packId}`,packId);
  }



}
