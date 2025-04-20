import {User} from "./user";

export class Reviews {
  reviewId?: number;
  reviewText: string;
  rating: number;
  reviewDate: Date;
  userId: number;
  user: User

  constructor(reviewText: string, rating: number, reviewId?: number, user?: User, userId?: number) {
    this.reviewId = reviewId;
    this.reviewText = reviewText;
    this.rating = rating;
    this.reviewDate = new Date();
    this.userId = userId || 0;
    this.user = user || new User(0, '', '', '', '', '', false, '', '');
  }
}
