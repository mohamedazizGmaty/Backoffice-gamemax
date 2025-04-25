import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Reclamation {
  id_rec: number;
  title: string;
  description: string;
  typeRec: string;
  dateCreation: string;
  status: string;
  client: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecService {
  private apiUrl = 'http://localhost:8080/api/reclamation';
  private adminId = 1; // Hardcoded admin ID - replace with actual admin ID in your system

  constructor(private http: HttpClient) {}

  getAllRecs(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/myRecs/${this.adminId}`);
  }

  updateStatus(recId: number, status: string): Observable<Reclamation> {
    return this.http.patch<Reclamation>(
      `${this.apiUrl}/updateStatus/${this.adminId}/${recId}?status=${status}`,
      {}
    );
  }

  filterRecs(filters: {
    client?: string;
    type?: string;
    status?: string;
    date?: string;
  }): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.apiUrl}/filter`, {
      params: filters
    });
  }

  deleteRec(recId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/removeRec/${recId}`);
  }
}