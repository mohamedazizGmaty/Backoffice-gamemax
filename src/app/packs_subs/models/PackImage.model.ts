export class PackImage {
  id: number;
  imageUrl: string;

  constructor(data: { id: number; imageUrl: string }) {
    this.id = data.id;
    this.imageUrl = data.imageUrl;
  }
}
