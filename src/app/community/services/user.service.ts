import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { formatDate } from '@angular/common';

interface UserSummary {
  isBanned: any;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  accountCreationDate: string;
  profilePictureUrl?: string;
}

interface UserDetails {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  isBanned: boolean;
  role: string;
  profilePictureUrl?: string;
  age: number;
  birthday: Date;
  accountCreationDate: Date;
}

interface BanRequestDto {
  reason: string;
  duration: 'TEMPORARY_7_DAYS' | 'TEMPORARY_30_DAYS' | 'PERMANENT'; // Modifié ici
  comment?: string;
}

interface BanResult {
  success: boolean;
  userId: number;
  reason: string;
  banEndDate?: string;
  emailSent: boolean;
}

interface UnbanRequest {
  unbanReason?: string;
}

interface UnbanResponse {
  success: boolean;
  message: string;
  userId: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/user';
  private apiUrl = 'http://localhost:8080/api/admin';


  constructor(private http: HttpClient) {}

  // Ajouter cette méthode pour vérifier le statut admin
isAdmin(userId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseUrl}/${userId}/is-admin`);
}

  getUsers(): Observable<UserSummary[]> {
    return this.http.get<UserSummary[]>(`${this.baseUrl}/summary`);
  }

  getUserByUsername(username: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.baseUrl}/usernames/${username}`);
  }
  getUsernameById(userId: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/${userId}/username`);
  }

  banUser(userId: number, banData: BanRequestDto): Observable<BanResult> {
    return this.http.post<BanResult>(`${this.baseUrl}/${userId}/ban`, banData);
  }

  getBanReasons(): string[] {
    return [
      "Comportement toxique ou langage offensant",
      "Usurpation d'identité ou fausse information",
      "Exploitation de bugs ou failles du jeu", 
      "Spam ou messages répétitifs"
    ];
  }

  getBanDurations(): {value: 'TEMPORARY_7_DAYS' | 'TEMPORARY_30_DAYS' | 'PERMANENT', label: string}[] {
    return [
      { value: 'TEMPORARY_7_DAYS', label: '7 jours' },
      { value: 'TEMPORARY_30_DAYS', label: '30 jours' },
      { value: 'PERMANENT', label: 'Permanent' }
    ];
  }

  unbanUser(userId: number, unbanReason?: string): Observable<UnbanResponse> {
    const params: any = {};
    if (unbanReason) {
      params.unbanReason = unbanReason;
    }
    return this.http.post<UnbanResponse>(`${this.apiUrl}/unban/${userId}`, {}, { params });
  }
  
  getBanHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ban-history/${userId}`);
  }
  countUsernames(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/usernames/count`);
  }
  countNewUsersLastWeek(): Observable<number> {
   
    return this.http.get<number>(`${this.baseUrl}/count/new-last-week`);
  }
  getUsersWithStatus(): Observable<{active: number, banned: number}> {
    return this.http.get<UserSummary[]>(`${this.baseUrl}/summary`).pipe(
      map(users => {
        return {
          active: users.filter(u => !u.isBanned).length,
          banned: users.filter(u => u.isBanned).length
        };
      })
    );
  }
  getNewCustomersGrowthPercentage(): Observable<number> {
  
    return this.http.get<number>(`${this.baseUrl}/new-customers/growth-percentage`);
  }

  getNewUserCount(period: string): Observable<number> {
    // >>> CORRECTION : Utilisez this.baseUrl pour l'appel <<<
    return this.http.get<number>(`${this.baseUrl}/count/new?period=${period}`);
  }

  getNewUsersChartData(startDate: Date, endDate: Date, unit: 'DAYS' | 'WEEKS' | 'MONTHS' = 'WEEKS'): Observable<{ [date: string]: number }> {
    const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US'); // Format date for backend
    const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');   // Format date for backend

   return this.http.get<{ [date: string]: number }>(`${this.apiUrl}/stats/new-by-period`, {
     params: {
       startDate: formattedStartDate,
       endDate: formattedEndDate,
       unit: unit
     }
   });
 }
}