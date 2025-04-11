export interface PackForm {
  packName: string;
  description: string;
  availableDate: string;  // ISO format: "YYYY-MM-DDTHH:mm:ssZ"
  expirationDate: string; // ISO format: "YYYY-MM-DDTHH:mm:ssZ"
}

// Optional: Create a class version with defaults and validation
export class PackFormModel implements PackForm {
  constructor(
    public packName: string = '',
    public description: string = '',
    public availableDate: string = new Date().toISOString(),
    public expirationDate: string = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // Default: 30 days from now
  ) {}

  // Convert to API-ready JSON
  toJSON(): PackForm {
    return {
      packName: this.packName,
      description: this.description,
      availableDate: this.availableDate,
      expirationDate: this.expirationDate
    };
  }
}
