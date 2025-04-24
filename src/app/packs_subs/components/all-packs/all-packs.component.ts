import { Component } from '@angular/core';
import { PacksService } from '../../services/packs.service';
import { Pack } from '../../models/pack.model';


@Component({
  selector: 'app-all-packs',
  templateUrl: './all-packs.component.html',
  styleUrls: ['./all-packs.component.css']
})
export class AllPacksComponent {



    packs: Pack[] = [];
  selectedPack: Pack | null = null;
  isLoading = false;
  deleteLoading = false;

    constructor(private packService: PacksService) {}

    ngOnInit(): void {
      this.packService.getAllPacks().subscribe({
        next: (response: Pack[]) => {
          console.log('Received response:', response);
          this.packs = response;
        },
        error: (err) => {
          console.error('Error fetching packs:', err);
        },
      });
    }

  loadPacks(): void {
    this.isLoading = true;
    this.packService.getAllPacks().subscribe({
      next: (packs) => {
        this.packs = packs;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading packs:', err);
        this.isLoading = false;
      }
    });
  }

    // Dans votre composant TypeScript
daysAvailable(pack: Pack): number {
  const availableDate = new Date(pack.availableDate);
  const expirationDate = new Date(pack.expirationDate);
  const diffTime = expirationDate.getTime() - availableDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

daysUntilExpiration(pack: Pack): number {
  const today = new Date();
  const expirationDate = new Date(pack.expirationDate);
  const diffTime = expirationDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

availabilityProgress(pack: Pack): number {
  const totalDays = this.daysAvailable(pack);
  const remainingDays = this.daysUntilExpiration(pack);

  if (totalDays <= 0 || remainingDays <= 0) return 0;
  return (remainingDays / totalDays) * 100;
}


  openPackModal(pack: Pack): void {
    this.selectedPack = pack;
    // Show the modal
    const modal = document.getElementById('projectsCardViewModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    this.selectedPack = null;
    const modal = document.getElementById('projectsCardViewModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

// all-packs.component.ts
  deletePack(): void {
    if (!this.selectedPack || !this.selectedPack.packId) {
      console.error('No pack selected or pack ID is missing');
      return;
    }

    const confirmation = confirm(`Are you sure you want to delete "${this.selectedPack.packName}"?`);

    if (confirmation) {
      this.deleteLoading = true;

      this.packService.deletePack(this.selectedPack.packId).subscribe({
        next: () => {
          this.deleteLoading = false;
          this.closeModal();

          this.packs = this.packs.filter(p => p.packId !== this.selectedPack?.packId);

          console.log('Pack deleted successfully');
        },
        error: (err) => {
          this.deleteLoading = false;
          console.error('Failed to delete pack:', err);

          // Show error message to user
          alert(`Failed to delete pack: ${err.error?.message || 'Unknown error'}`);
        }
      });
    }
  }

  // Calculate progress based on dates
  calculateProgress(pack: Pack): number {
    const start = new Date(pack.availableDate).getTime();
    const end = new Date(pack.expirationDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;

    return Math.round(((now - start) / (end - start)) * 100);
  }
}
