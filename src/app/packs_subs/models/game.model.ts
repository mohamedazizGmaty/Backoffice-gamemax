export class Game {
  gameId: number;

  constructor(data: { gameId: number }) {
    this.gameId = data.gameId;
  }
}
