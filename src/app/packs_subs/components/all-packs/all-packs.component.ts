import { Component, OnInit, OnDestroy } from '@angular/core';
import { PacksService } from '../../services/packs.service';
import { Pack } from '../../models/pack.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-all-packs',
  templateUrl: './all-packs.component.html',
  styleUrls: ['./all-packs.component.css']
})
export class AllPacksComponent implements OnInit, OnDestroy {
  // Pack data
  packs: Pack[] = [];
  filteredPacks: Pack[] = [];
  selectedPack: Pack | null = null;

  // Loading states
  isLoading = false;
  deleteLoading = false;
  games: any[] = [];


  // Edit state
  isEditing = false;
  tempDescription: string = '';
  tempExpirationDate: Date = new Date();

  // Messages
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Search functionality
  searchTerm: string = '';
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private packService: PacksService
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadGames();
    this.loadPacks();
  }
  private loadGames(): void {
    this.errorMessage = '';

    this.packService.getGames().subscribe({
      next: (games) => {
        this.games = games;
        console.log('Successfully loaded games:', this.games);
      },
      error: (err) => {
        console.error('Game loading error:', err);
        this.errorMessage = err.message || 'Could not load games. Please try again later.';
      }
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ======================
  // SEARCH FUNCTIONALITY
  // ======================
  private setupSearch(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.filterPacks(searchTerm);
    });
  }
  onSearchChange(): void {
    if (!this.searchTerm) {
      this.filteredPacks = [...this.packs];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPacks = this.packs.filter(pack =>
      pack.packName?.toLowerCase().includes(term)
    );
  }
  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  private filterPacks(searchTerm: string): void {
    if (!searchTerm?.trim()) {
      this.filteredPacks = [...this.packs];
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    this.filteredPacks = this.packs.filter(pack =>
      (pack.packName?.toLowerCase().includes(term)) ||
      (pack.description?.toLowerCase().includes(term)) ||
      (pack.packId?.toString().includes(term))
    );
  }

  // ======================
  // DATA LOADING
  // ======================
  loadPacks(): void {
    this.isLoading = true;
    this.packService.getAllPacks().subscribe({
      next: (packs: Pack[]) => {
        this.packs = packs;
        this.filteredPacks = [...this.packs]; // Initialize with all packs
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading packs:', err);
        this.isLoading = false;
      }
    });
  }

  // ======================
  // PACK OPERATIONS
  // ======================
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
  }

  deletePack(): void {
    if (!this.selectedPack?.packId) {
      this.showError('No pack selected or pack ID is missing');
      return;
    }

    const confirmation = confirm(`Are you sure you want to delete "${this.selectedPack.packName}"?`);
    if (!confirmation) return;

    this.deleteLoading = true;
    this.errorMessage = null;

    this.packService.deletePack(this.selectedPack.packId).subscribe({
      next: () => {
        this.packs = this.packs.filter(p => p.packId !== this.selectedPack?.packId);
        this.filteredPacks = this.filteredPacks.filter(p => p.packId !== this.selectedPack?.packId);
        this.deleteLoading = false;
        this.closeModal();
        this.showSuccess('Pack deleted successfully');
      },
      error: (err) => {
        this.deleteLoading = false;
        console.error('Failed to delete pack:', err);
        this.showError(err.error?.message || 'Failed to delete pack');
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.selectedPack) {
      this.saveChanges();
    }
  }

  saveChanges(): void {
    if (!this.selectedPack) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    // Update the pack data before sending
    const updatedPack = {
      ...this.selectedPack,
      description: this.tempDescription,
      expirationDate: this.tempExpirationDate
    };

    this.packService.updatePack(updatedPack).subscribe({
      next: (savedPack) => {
        this.updateLocalPacks(savedPack);
        this.isLoading = false;
        this.showSuccess('Pack updated successfully!');
        this.isEditing = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showError(err.error?.message || 'Failed to update pack');
      }
    });
  }

  private updateLocalPacks(updatedPack: Pack): void {
    const updateArray = (arr: Pack[]) => {
      const index = arr.findIndex(p => p.packId === updatedPack.packId);
      if (index !== -1) {
        arr[index] = updatedPack;
      }
    };

    updateArray(this.packs);
    updateArray(this.filteredPacks);
    this.selectedPack = updatedPack;
  }

  // ======================
  // UTILITY FUNCTIONS
  // ======================
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
    return totalDays > 0 ? (remainingDays / totalDays) * 100 : 0;
  }

  calculateProgress(pack: Pack): number {
    const start = new Date(pack.availableDate).getTime();
    const end = new Date(pack.expirationDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/default-pack-image.jpg';
    imgElement.alt = 'Default pack image';
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    setTimeout(() => this.successMessage = null, 5000);
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = null, 5000);
  }

  getGameName(gameId: number): string {
    const game = this.games.find(g => g.gameId === gameId);
    console.log(this.games)
    return game ? game.gameName : 'Unknown Game';
  }
}
