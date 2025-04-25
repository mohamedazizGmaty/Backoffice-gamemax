// pack-form.model.ts
export interface PackForm {
  packName: string;
  description: string;
  availableDate: string;
  expirationDate: string;
  selectedGames: string[];
  image: File | null;
}

export class PackFormModel implements PackForm {
  constructor(
    public packName: string = '',
    public description: string = '',
    public availableDate: string = new Date().toISOString().split('T')[0],
    public expirationDate: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    public selectedGames: string[] = [],
    public image: File | null = null
  ) {}
}
