import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import {environment} from "../../enviroment/env";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private apiUrl = `${environment.apiUrl}/community/posts`;
  private baseUrl = `${environment.apiUrl}/community/comments`; // URL de base de votre APa
  private reactionUrl=`${environment.apiUrl}/community/reactions`;
  private apiUrl2 = `${environment.apiUrl}/user/TDO/`



  constructor(private http: HttpClient) { }
  createPost(post: any, imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(post)], {
      type: 'application/json'
    }));

    if (imageFile) {
      formData.append('file', imageFile);
    }

    return this.http.post(this.apiUrl, formData);
  }

  blockComment(commentId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${commentId}/block`, {});
  }
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Méthode pour récupérer les commentaires d'un post
  getUserbyId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}/${userId}`);
  }

// Remplacer la méthode getComments existante par :
getCommentsByPost(postId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/post/${postId}`);
}

// Ajouter une méthode pour les réponses imbriquées
getNestedComments(postId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/post/${postId}?nested=true`);
}


 // Méthode pour ajouter une réaction

// post.service.ts
getReactions(postId: number): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/post/${postId}`);
}


// post.service.ts
getReactionSummary(postId: number): Observable<any> {
  return this.http.get<any>(`${this.reactionUrl}/${postId}/summary`);
}

toggleReaction(postId: number, reactionType: string, userId: number): Observable<any> {
  return this.http.post(`${this.reactionUrl}/${postId}?type=${reactionType}`, null, {
    headers: new HttpHeaders().set('X-User-Id', userId.toString())
  });
}

getReactionsByPost(postId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${postId}`);
}



addComment(
  postId: number,
  userId: number,
  content: string,
  parentCommentId?: number
): Observable<any> {
  const url = `${this.baseUrl}`; // URL de base sans /add/...
  let params = new HttpParams()
    .set('postId', postId.toString())
    .set('userId', userId.toString())
    .set('content', content);

  // Ajouter parentCommentId seulement si fourni
  if (parentCommentId) {
    params = params.set('parentCommentId', parentCommentId.toString());
  }

  return this.http.post(url, null, { params });
}

  // Méthode pour ajouter une réponse à un commentaire
  addReply(parentId: number, userId: number, content: string): Observable<any> {
    const url = `${this.baseUrl}/reply/${parentId}`;
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('content', content);

    return this.http.post(url, null, { params });
  }




  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),

    });
  }

 // Méthode pour obtenir l'URL d'un post
 getPostUrl(postId: number): string {
  return `${this.baseUrl}${postId}`;
}

uploadAsset(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
}
addAssetToPost(postId: number, asset: any): Observable<any> {
   console.log("👀 Envoi de l'asset :", asset);
  return this.http.post(`${this.apiUrl}/${postId}/assets`, asset);
}

 // 👉 Fonction pour ajouter une réponse à un commentaire
 addCommentReply(data: { postId: number, parentCommentId: number, content: string }): Observable<any> {
  return this.http.post<any>(`${this.baseUrl}/reply`, data);
}


getComments(postId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/${postId}`);
}

}
