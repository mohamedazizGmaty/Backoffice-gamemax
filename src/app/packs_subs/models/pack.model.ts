import { Game } from './game.model';

export class Pack {
  packId: number;
  packName: string;
  description: string;
  availableDate: string; // or Date
  expirationDate: Date; // or Date
  packGames?: Game[];

  constructor(data: {
    packId: number;
    packName: string;
    description: string;
    availableDate: string;
    expirationDate: Date;
    packGames?: Game[];
  }) {
    this.packId = data.packId;
    this.packName = data.packName;
    this.description = data.description;
    this.availableDate = data.availableDate;
    this.expirationDate = data.expirationDate;
    this.packGames = data.packGames || [];
  }
}
