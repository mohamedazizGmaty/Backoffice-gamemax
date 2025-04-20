export class Game {
  gameId: number;
  gameName: string;
  gameType: string;
  gameDescription: string;
  publisher: string;
  releaseDate: Date;
  platform: string;
  imageUrls: string[];

  constructor(
    gameId: number,
    gameName: string,
    gameType: string,
    gameDescription: string,
    publisher: string,
    releaseDate: Date,
    platform: string,
    imageUrls: string[]
  ) {
    this.gameId = gameId;
    this.gameName = gameName;
    this.gameType = gameType;
    this.gameDescription = gameDescription;
    this.publisher = publisher;
    this.releaseDate = releaseDate;
    this.platform = platform;
    this.imageUrls = imageUrls;
  }
}
