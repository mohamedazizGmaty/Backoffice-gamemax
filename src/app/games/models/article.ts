import {Game} from "./game";

export class Article {
  articleId: number;
  creationDate: Date;
  price: number;
  numberOfSold: number;
  gameId: number;
  game: Game;

  constructor(
    articleId: number,
    creationDate: Date,
    price: number,
    numberOfSold: number,
    gameId: number,
    game: Game
  ) {
    this.articleId = articleId;
    this.creationDate = creationDate;
    this.price = price;
    this.numberOfSold = numberOfSold;
    this.gameId = gameId;
    this.game = game;
  }
}
