import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
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
  games: any[] = [];
  isEditing = false;
  tempDescription: string | undefined = '';
  tempExpirationDate: Date = new Date(); // Initialize with current date
  successMessage: string | null = null; // Message de succès
  errorMessage: string | null = null; // Message d'erreur

  constructor(
    private packService: PacksService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadPacks();
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

  private loadGames(): void {
    this.packService.getGames().subscribe({
      next: (data) => this.games = data,
      error: (err) => console.error('Error loading games', err)
    });
  }

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

  deletePack(): void {
    if (!this.selectedPack || !this.selectedPack.packId) {
      console.error('No pack selected or pack ID is missing');
      return;
    }

    const confirmation = confirm(`Are you sure you want to delete "${this.selectedPack.packName}"?`);

    if (confirmation) {
      this.deleteLoading = true;
      this.errorMessage = null; // Réinitialiser l'erreur précédente

      this.packService.deletePack(this.selectedPack.packId).subscribe({
        next: () => {
          // Prolonger le délai de loading
          setTimeout(() => {
            this.deleteLoading = false;
            this.closeModal();

            // Filtrer le pack supprimé de la liste
            this.packs = this.packs.filter(p => p.packId !== this.selectedPack?.packId);

            // Recharger les packs après un délai pour simuler un délai de traitement
            this.ngZone.run(() => {
              this.loadPacks();
            });

            // Afficher un message de succès
            this.successMessage = `Le pack a été supprimé avec succès.`;

            // Cacher le message de succès après 5 secondes
            setTimeout(() => {
              this.successMessage = null;
            }, 5000); // 5000 ms = 5 secondes

            console.log('Pack deleted successfully');
          }, 3000); // 3000 ms = 3 secondes de délai
        },
        error: (err) => {
          this.deleteLoading = false;
          console.error('Failed to delete pack:', err);

          // Afficher un message d'erreur
          this.errorMessage = `Erreur lors de la suppression du pack: ${err.error?.message || 'Erreur inconnue'}`;

          // Cacher le message d'erreur après 5 secondes
          setTimeout(() => {
            this.errorMessage = null;
          }, 5000); // 5000 ms = 5 secondes

          alert(`Failed to delete pack: ${err.error?.message || 'Unknown error'}`);
        }
      });
    }
  }

  calculateProgress(pack: Pack): number {
    const start = new Date(pack.availableDate).getTime();
    const end = new Date(pack.expirationDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;

    return Math.round(((now - start) / (end - start)) * 100);
  }
  onCheckboxChange(event: any, gameId: number): void {
    // const selectedGames = this.packForm.get('selectedGames')?.value || [];
    // if (event.target.checked) {
    //   this.packForm.get('selectedGames')?.setValue([...selectedGames, gameId]);
    // } else {
    //   this.packForm.get('selectedGames')?.setValue(
    //     selectedGames.filter((id: number) => id !== gameId)
    //   );
    // }
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing && this.selectedPack) {
      // Enter edit mode - save current values
      this.tempDescription = this.selectedPack.description || '';
      this.tempExpirationDate = new Date(this.selectedPack.expirationDate);
    } else if (this.selectedPack) {
      // Exit edit mode - update values
      this.selectedPack.description = this.tempDescription || '';
      this.selectedPack.expirationDate = new Date(this.tempExpirationDate);
      this.saveChanges();
    }
  }

  saveChanges() {
    if (!this.selectedPack) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.packService.updatePack(this.selectedPack).subscribe({

      next: (updatedPack) => {
        this.isLoading = false;
        this.successMessage = 'Pack updated successfully!';

        // Update the pack in the local array
        const index = this.packs.findIndex(p => p.packId === updatedPack.packId);
        if (index !== -1) {
          this.packs[index] = updatedPack;
        }

        // Hide success message after 5 seconds
        setTimeout(() => this.successMessage = null, 5000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to update pack';
        console.error('Update error:', err);

        // Hide error message after 5 seconds
        setTimeout(() => this.errorMessage = null, 5000);
      }
    });
  }
}
