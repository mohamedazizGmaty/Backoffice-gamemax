import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { jsPDF } from 'jspdf';
import { HttpClient } from '@angular/common/http';

import { TranslateService } from '@ngx-translate/core'; // Importation du service de traduction
import { AuthenticationService} from "../../user/services/auth.service";
import { UserService } from '../../user/services/user.service';
import {environment} from "../../enviroment/env";


@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit {
  posts: any[] = [];


  comments: { [postId: number]: any[] } = {}; // commentaires par postId
  selectedPostId: number | null = null;  // Id du post sélectionné pour les commentaires
  expandedComments: { [postId: number]: boolean } = {};  // Gestion de l'état des commentaires

  showAllReactions: boolean = false;
  postReactions: { [postId: number]: any } = {};  // Pour stocker les réactions de chaque post

  newCommentContent: string = '';

  replyingToComment: number | null = null;
  replyContent: string = '';
  baseUrl: string= environment.apiUrlImg;


  searchTerm: string = '';
filteredPosts: any[] = [];


@ViewChild('imageInput') imageInputRef!: ElementRef;

  showCalendar = false;
  showLocation = false;
  showTag = false;

  assetToAttach: any = null;
  selectedFile : any = null;

  // 👉 Tu ajoutes ici :
  postData = {
    postType: '',
    platform: '',
    gameTitle: '',
    price: 0,
    selectedDate: '',
    selectedTime: '',
    location: '',
    imageUrl: ''
  };

  userMessage: string = '';
botReply: string = '';

isAdmin: boolean = false; // À définir selon les droits de l'utilisateur



sendToChatbot() {
  this.http.post<any>(`${environment.apiUrl}/community/chat`, { message: this.userMessage })
    .subscribe(
      res => {
        this.botReply = res.reply;

        // Si tu veux que la réponse remplisse le champ du post automatiquement :
        this.postData.gameTitle = this.botReply; // ou content, selon ce que tu veux
      },
      error => {
        console.error('Erreur chatbot :', error);
      }
    );
}


  // Ouvre la boîte de dialogue pour choisir une image
  triggerImageUpload() {
    this.imageInputRef.nativeElement.click();
  }

  // Traitement quand l'image est sélectionnée
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const formData = new FormData();
      formData.append('file', file);

      this.postService.uploadAsset(formData).subscribe(
        (response: any) => {
          console.log('✅ Image uploadée avec succès', response);

          // Supposons que ton backend retourne l'URL de l'image :
          const imageUrl = response.url;

          this.assetToAttach = {
            asset_url: imageUrl,
            type: 'image',
            creationDate: new Date().toISOString().split('T')[0]
          };

          this.postData.imageUrl = imageUrl;
        },
        Error=> {
          console.error('❌ Erreur lors de l\'upload d\'image');
        }
      );
    }
  }


  newPost: any = {
    communityId: 1,  // Exemple de communityId, adapte selon tes besoins
    title: '',       // Le titre du post (à remplir par l'utilisateur)
    content: '',     // Le contenu du post (à remplir par l'utilisateur)
    authorId: 1,     // Exemple d'ID d'auteur, adapte selon tes besoins
    publisherId: 1,  // L'ID du publisher, il devrait correspondre à l'utilisateur connecté
    creationDate: new Date().toISOString(),  // Date actuelle, adaptative à l'instant où le post est créé
    visibility: 'Public'  // Valeur par défaut
  };

  userData: any;
  postId: number = 1;    // L'id du post, tu peux le récupérer de n'importe où


  // Méthode pour incrémenter les réactions

  constructor(private postService: PostService, private router :Router, private http : HttpClient, public authService:AuthenticationService,
    private translate: TranslateService, private userService : UserService) {
       // Définir la langue par défaut
       translate.setDefaultLang('fr');
       translate.use('fr');  // Utiliser le français par défaut
    }

    // Choisir la langue par défaut (ici le français)

// Fonction pour changer la langue
switchLanguage(language: string) {
  this.translate.use(language);
}

  ngOnInit(): void {
    this.loadPosts();
    console.log(this.comments)
    this.filteredPosts = this.posts; // au départ on affiche tous les posts

    console.log(this.filteredPosts);
    const userId = 1; // ou n’importe quel id pour test statique
    this.postService.getUserbyId(userId).subscribe(user => {
      this.userData = user;
      console.log(this.userData);
    });

    // this.authService.currentUser.subscribe(user => {
    //   if (user) {
    //     this.userService.isAdmin(user.userId).subscribe(isAdmin => {
    //       this.isAdmin = isAdmin;
    //     });
    //   }
    // });

    this.getComments(this.postId);  // Appel de la méthode pour récupérer les commentaires

    this.checkAdminStatus(); // Ajoutez cette ligne
  }
  checkAdminStatus(): void {
    // Implémentez la logique pour vérifier si l'utilisateur est admin
    // Exemple simple (à adapter selon votre système d'authentification):
    // this.isAdmin = this.authService.isAdmin();
  }
  blockComment(postId: number, commentId: number): void {
    if (confirm('Voulez-vous vraiment bloquer ce commentaire ?')) {
      this.postService.blockComment(commentId).subscribe({
        next: () => {
          // Trouver et mettre à jour le commentaire localement
          const comment = this.comments[postId].find(c => c.id === commentId);
          if (comment) {
            comment.blocked = true;
          }
        },
        error: (err) => {
          console.error('Erreur lors du blocage', err);
          alert('Erreur lors du blocage du commentaire');
        }
      });
    }
  }

  hasComments(postId: number): boolean {
    return this.comments[postId] && this.comments[postId].length > 0;
  }

  // Charger les posts depuis le service
  // Méthode loadPosts améliorée
// Initialisez les réactions dans loadPosts()
loadPosts(): void {
  this.postService.getPosts().subscribe({
    next: (posts) => {

      this.posts = posts.map(post => ({
        ...post,
        reactions: {
          counts: {
            LIKE: post.reactions?.counts?.LIKE || 0,
            LOVE: post.reactions?.counts?.LOVE || 0,
            HAHA: post.reactions?.counts?.HAHA || 0,
            WOW: post.reactions?.counts?.WOW || 0,
            SAD: post.reactions?.counts?.SAD || 0,
            ANGRY: post.reactions?.counts?.ANGRY || 0
          },
          total: post.reactions?.total || 0
        }
      }));

      this.filteredPosts = [...this.posts];
      console.log(this.posts);
    }
  });
}

// Nouvelle méthode pour gérer les réactions
toggleReaction(post: any, type: string): void {
  const userId = this.authService.currentUserValue?.userId;
  if (!userId) return;

  this.postService.toggleReaction(post.postId, type, userId).subscribe({
    next: () => {
      const current = post.reactions.counts[type] || 0;
      post.reactions.counts[type] = current + (this.hasReacted(post, type) ? -1 : 1);
      post.reactions.total += this.hasReacted(post, type) ? -1 : 1;
    }
  });
}

hasReacted(post: any, type: string): boolean {
  return post.reactions.counts[type] > 0;
}

// Modifier loadComments
loadComments(postId: number) {
  this.postService.getNestedComments(postId).subscribe(comments => {
    this.comments[postId] = this.transformComments(comments);
  });
}

// Ajouter une méthode de transformation
private transformComments(comments: any[]): any[] {
  return comments.map(comment => ({
    ...comment,
    replies: comment.replies ? this.transformComments(comment.replies) : []
  }));
}

// Modifier addComment
addComment(postId: number): void {
  const userId = this.authService.currentUserValue?.userId;
  if (!userId) return;

  const content = this.newCommentContent.trim();
  if (!content) return;

  this.postService.addComment(postId, userId, content).subscribe({
    next: () => {
      this.loadComments(postId); // Recharger les commentaires
      this.newCommentContent = '';
    }
  });
}

// Modifier addReply
addReply(postId: number, parentCommentId: number): void {
  const content = this.replyContent.trim();
  if (!content) return;

  this.postService.addCommentReply({
    postId,
    parentCommentId,
    content,

  }).subscribe({
    next: () => {
      this.loadComments(postId);
      this.replyContent = '';
      this.replyingToComment = null;
    }
  });
}

  loadReactions(postId: number): void {
    this.postService.getReactionsByPost(postId).subscribe(data => {
      console.log(`Réactions pour le post ${postId}:`, data);
      // Mettez à jour la structure des réactions avec les données reçues
      this.postReactions[postId] = data.reduce((acc: any, reaction: any) => {
        acc[reaction.reactionType] = (acc[reaction.reactionType] || 0) + 1;
        return acc;
      }, {});
    });
  }



  getFirstThreeComments(postId: number): any[] {
    return this.comments[postId]?.slice(0, 2) || [];
  }

// Ouvre un modal pour afficher les commentaires
openCommentsModal(postId: number): void {
  this.selectedPostId = postId;
}

// Ferme le modal des commentaires
closeCommentsModal(): void {
  this.selectedPostId = null;
}




  // Afficher ou masquer les commentaires complets
  toggleComments(postId: number): void {
    this.expandedComments[postId] = !this.expandedComments[postId];
  }

  // Obtenir tous les commentaires ou les 3 premiers
  getVisibleComments(postId: number): any[] {
    const allComments = this.comments[postId] || [];
    return this.expandedComments[postId] ? allComments : allComments.slice(0, 2);
  }

  // Vérifier si les commentaires sont étendus pour un post
  isExpanded(postId: number): boolean {
    return this.expandedComments[postId];
  }


  // Méthode addComment améliorée



  replyToComment(comment: any) {
    // Toggle reply section visibility
    this.replyingToComment = this.replyingToComment === comment.commentId ? null : comment.commentId;
  }

   // Ajoutez ces nouvelles méthodes


  getReactionEmoji(reactionType: string): string {
    const emojiMap: { [key: string]: string } = {
      LIKE: '👍',
      LOVE: '❤️',
      HAHA: '😂',
      WOW: '😮',
      SAD: '😢',
      ANGRY: '😡'
    };
    return emojiMap[reactionType] || '';
  }

  submitReply(parentId: number) {
    // Ensure there is reply content
    if (!this.replyContent.trim()) return;

    const userId= this.authService.currentUserValue?.userId || 0;

    // Call backend API to submit the reply
    this.postService.addReply(parentId, userId, this.replyContent).subscribe(response => {
      console.log('Reply added successfully', response);

      // Clear the reply input after success
      this.replyContent = '';
      this.replyingToComment = null;

      // Optionally, refresh the list of comments or add the new reply locally
    }, error => {
      console.error('Error while adding reply', error);
    });
  }



// Création du post final
submitPost() {
  const content = `
🎮 Jeu : ${this.postData.gameTitle}
🕹️ Plateforme : ${this.postData.platform}
💰 Prix : ${this.postData.price} DT
📅 Date : ${this.postData.selectedDate} ${this.postData.selectedTime || ''}
📍 Localisation : ${this.postData.location}

📸 Image : ${this.postData.imageUrl ? 'Oui' : 'Non'}
  `;

  const newPost = {
    communityId: 1,
    title: this.postData.gameTitle || 'Annonce jeu',
    content: content.trim(),
    authorId: 1,
    publisherId: 1,
    creationDate: new Date().toISOString(),
    visibility: 'Public'
  };

 // 1. On commence par créer le post
this.postService.createPost(newPost).subscribe({
  next: (createdPost: any) => {
    console.log('✅ Post créé :', createdPost);

    // 2. Si une image a été sélectionnée, on l'upload maintenant
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.postService.uploadAsset(formData).subscribe({
        next: (url: string) => {
          console.log('✅ URL reçue :', url);

          // 3. Créer l'objet asset à rattacher au post
          const assetToAttach = {
            assetUrl: url,
            creationDate: new Date().toISOString(),
            type: 'image',
            postId: createdPost.postId
          };

          // 4. Envoyer l'asset au backend
          this.postService.addAssetToPost(createdPost.postId, assetToAttach).subscribe({
            next: (updatedPost: any) => {
              console.log('📎 Image liée au post !', updatedPost);
            },
            error: (err) => {
              console.error('❌ Erreur en liant l\'asset', err);
            }
          });
        },
        error: (err) => {
          console.error('❌ Erreur lors de l\'upload d\'image', err);
        }
      });
    }
  },
  error: (err) => {
    console.error('❌ Erreur création post', err);
  }
});



}



  deletePost(postId: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(postId).subscribe(
        () => {
          console.log(`Post ${postId} deleted`);
          // Tu peux maintenant recharger la liste des posts
          this.loadPosts(); // à condition que tu aies cette méthode
        },
        (error) => {
          console.error('Error deleting post:', error);
        }
      );
    }
  }
  downloadPostImageAsPNG(postId: number) {
    // Trouve l'asset associé au post
    const asset = this.posts.find(post => post.postId === postId)?.assets[0];

    if (asset && asset.asset_url) {
      const link = document.createElement('a');
      link.href = asset.asset_url;
      link.download = `post-${postId}.png`;  // Nom du fichier téléchargé avec l'extension .png
      link.click();  // Lance le téléchargement
    }
  }


downloadPostAsPDF(post: any) {
  const doc = new jsPDF();

  // Ajouter un titre
  doc.text("Post Title: " + post.title, 10, 10);
  doc.text("Content: " + post.content, 10, 20);

  // Ajouter les images du post
  post.assets.forEach((asset: any, index: number) => {
    if (asset.type === 'image') {
      console.log(asset);
      doc.addImage( this.baseUrl + post.assets[0].asset_url, 'JPEG', 10, 30 + (index * 60), 180, 80); // Ajuste la taille et la position
    }
  }
  );

  // Télécharger le PDF
  doc.save('post-' + post.postId + '.pdf');
}

getPostUrl(postId: number): string {
  return 'http://localhost:4200/posts/' + postId; // Lien vers le post dans ton app
}




filterPosts() {
  const term = this.searchTerm.toLowerCase();

  this.filteredPosts = this.posts.filter(post =>
    post.content.toLowerCase().includes(term) ||
    post.publisher.firstName.toLowerCase().includes(term) ||
    post.publisher.lastName.toLowerCase().includes(term)
  );
}

replyInputsVisibility: { [key: string]: boolean } = {};
replyContents: { [key: string]: string } = {};


// 👉 Méthode pour afficher/cacher le champ de réponse
toggleReplyInput(postId: number, commentId: number): void {
  const key = `${postId}-${commentId}`;
  this.replyInputsVisibility[key] = !this.replyInputsVisibility[key];
}

// 👉 Méthode pour vérifier si le champ de réponse est visible
isReplyInputVisible(postId: number, commentId: number): boolean {
  const key = `${postId}-${commentId}`;
  return !!this.replyInputsVisibility[key];
}
// ✅ Ajoute une réponse à un commentaire spécifique pour un post donné
// Méthode submitReply corrigée


getComments(postId: number) {
  this.postService.getComments(postId).subscribe(comments => {
    this.comments = comments;  // Stocke les commentaires dans le tableau
  });
}



// api pour translate




}
