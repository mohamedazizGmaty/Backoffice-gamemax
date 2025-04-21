import {Game} from "./game.model";

export class Subscription {
  userId: number;
  startingDate: Date;
  expirationDate: Date;
  subscriptionType: string;
  constructor(data: {

    userId: number;
    startingDate: Date;
    expirationDate: Date;
    subscriptionType: string;
  }) {
    this.userId = data.userId;
    this.startingDate = data.startingDate;
    this.expirationDate = data.expirationDate;
    this.subscriptionType = data.subscriptionType;

  }

}
