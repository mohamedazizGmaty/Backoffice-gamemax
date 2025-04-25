import { Game } from './game.model';
import { PackImage } from './PackImage.model';

export class Pack {
  packId: number;
  packName: string;
  description: string;
  availableDate: Date;
  expirationDate: Date;
  image: PackImage;  // Store the image as an object
  packGames?: Game[];

  constructor(data: {
    packId: number;
    packName: string;
    description: string;
    availableDate: Date;
    expirationDate: Date;
    image: { id: number; imageUrl: string };
    packGames?: Game[];
  }) {
    this.packId = data.packId;
    this.packName = data.packName;
    this.description = data.description;
    this.availableDate = data.availableDate;
    this.expirationDate = data.expirationDate;
    this.image = new PackImage(data.image); // Initialize PackImage with the received data
    this.packGames = data.packGames || [];
  }
}
