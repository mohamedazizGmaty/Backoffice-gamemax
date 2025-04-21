export interface PackForm {
  packName: string;
  description: string;
  availableDate: string;
  expirationDate: string;
}

export class PackFormModel implements PackForm {
  constructor(
    public packName: string = '',
    public description: string = '',
    public availableDate: string = new Date().toISOString(),
    public expirationDate: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default: 30 days from now
  ) {}


}
