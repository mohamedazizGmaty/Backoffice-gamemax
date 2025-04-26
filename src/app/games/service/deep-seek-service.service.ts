import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {map, catchError} from 'rxjs/operators';

interface DeepSeekResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DeepSeekService {
  private apiUrl = 'https://api.deepseek.com/v1/chat/completions';
  private apiKey = 'sk-ea124c0171ed48b09a8c83e12c795f7c';

  private systemPrompt = `
    You are a video game expert AI. When given the name of a video game, respond with a detailed and compact paragraph of no more than 700 characters. Include the game's description, story summary with main characters, publisher, release date, and platforms. If the game name does not exist or the request is not about a video game, return an error message: "Error: Invalid game name or unrelated request."
    `;

  constructor(private http: HttpClient) {
  }

  generateGameDescription(gameName: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const body = {
      model: 'deepseek-chat',
      messages: [
        {role: 'system', content: this.systemPrompt},
        {
          role: 'user', content: `Generates a description for: ${gameName}`
        }
      ],
      temperature: 0.3
    };

    return this.http.post<DeepSeekResponse>(this.apiUrl, body, {headers}).pipe(
      map(response => response.choices[0]?.message?.content || "Description non disponible"),
      catchError(() => of("Erreur lors de la connexion à l'API"))
    );
  }

  checkGamePrice(gameName: string, price: number): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });

    const priceAnalysisPrompt = `
    You are a video game price analyst. For the game "${gameName}" priced at $${price}, provide:
- Price rating (Low/Medium/High) vs current market
- Average prices on platforms (Steam, Epic Games, etc.)
- Advice: increase or lower the price
Respond in a single paragraph with bullet points, max 600 characters.
  `;

    const body = {
      model: 'deepseek-chat',
      messages: [
        {role: 'system', content: priceAnalysisPrompt},
        {role: 'user', content: `Analyze the price of ${gameName} à ${price}€`}
      ],
      temperature: 0.2
    };

    return this.http.post<DeepSeekResponse>(this.apiUrl, body, {headers}).pipe(
      map(response => response.choices[0]?.message?.content || "Analyse de prix indisponible"),
      catchError(() => of("Erreur lors de l'analyse des prix"))
    );
  }
}
