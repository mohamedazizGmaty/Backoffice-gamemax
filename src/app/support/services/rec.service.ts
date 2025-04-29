import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../enviroment/env";


export interface Attachment {
  id: number;
  fileName: string;
  fileType: string;
}
export interface Reclamation {
  id_rec: number;
  description: string;
  typeRec: string;
  dateCreation: string;
  status: string;
  clientId: number;
   attachments?: Attachment[];
}

/**
 * Interface for defining filter criteria for reclamations.
 * Property names should align with backend @RequestParam names.
 */
export interface ReclamationFilter {
  clientId?: string; // Corresponds to backend `clientId` (expects Long as string)
  typeRec?: string;  // Corresponds to backend `typeRec` (expects enum name string)
  status?: string;   // Corresponds to backend `status` (expects enum name string)
  date?: string;     // Corresponds to backend `date` (expects 'yyyy-MM-dd' string)
}

// --- Service ---

@Injectable({
  providedIn: 'root'
})
export class RecService {
  // Base URL of your Spring Boot backend reclamation API endpoint
  private apiUrl = `${environment.apiUrl}/reclamation`;


  constructor(private http: HttpClient) {}


  getAllRecs(): Observable<Reclamation[]> {
    const url = `${this.apiUrl}/allRecs`;
    console.log('RecService: Calling GET', url); // Logging
    return this.http.get<Reclamation[]>(url);
  }


  getFilteredReclamations(filters?: ReclamationFilter): Observable<Reclamation[]> {
    let params = new HttpParams();
    if (filters) {
      // Build HttpParams, ensuring keys match backend @RequestParam names
      if (filters.clientId) {
        params = params.set('clientId', filters.clientId);
      }
      if (filters.typeRec) {
        params = params.set('typeRec', filters.typeRec);
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.date) {
        params = params.set('date', filters.date);
      }
    }
    const url = `${this.apiUrl}/filter`;
    console.log('RecService: Calling GET', url, 'with params:', params.toString()); // Logging
    return this.http.get<Reclamation[]>(url, { params });
  }


  updateStatus(recId: number, status: string): Observable<Reclamation> {
    const url = `${this.apiUrl}/updateStatus/${recId}`;
    // Status is sent as a query parameter for this specific PATCH endpoint
    const options = {
      params: new HttpParams().set('status', status)
    };
    console.log('RecService: Calling PATCH', url, 'with params:', options.params.toString()); // Logging
    // PATCH request often has an empty body ({}) when data is in params/URL
    return this.http.patch<Reclamation>(url, {}, options);
  }

  previewAttachment(attachmentId: number): Observable<Blob> {
    // Construct the specific URL for the attachment preview endpoint
    const url = `${this.apiUrl}/attachments/preview/${attachmentId}`;
    console.log('RecService: Calling GET', url, 'for attachment preview');

    // Make the GET request, explicitly setting the responseType to 'blob'
    // This tells HttpClient to expect binary data and wrap it in a Blob object.
    return this.http.get(url, { responseType: 'blob' });
  }


  deleteRec(recId: number): Observable<void> {
    const url = `${this.apiUrl}/removeRec/${recId}`;
    console.log('RecService: Calling DELETE', url); // Logging
    return this.http.delete<void>(url);
  }



}

