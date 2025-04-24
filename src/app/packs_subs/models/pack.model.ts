export class Pack {
  packId: number;
    packName: string;
    description: string;
    availableDate: string; // or Date
    expirationDate: string; // or Date

    constructor(data: {
      packId: number;
      packName: string;
      description: string;
      availableDate: string;
      expirationDate: string;
    }) {
      this.packId = data.packId;
      this.packName = data.packName;
      this.description = data.description;
      this.availableDate = data.availableDate;
      this.expirationDate = data.expirationDate;
    }
  }
