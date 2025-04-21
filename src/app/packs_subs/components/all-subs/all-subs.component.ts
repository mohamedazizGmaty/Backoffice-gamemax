import { Component,  ChangeDetectorRef, NgZone } from '@angular/core';
import {Pack} from "../../models/pack.model";
import { PacksService } from '../../services/packs.service';
import {SubssService} from "../../services/subs.service";


@Component({
  selector: 'app-all-subs',
  templateUrl: './all-subs.component.html',
  styleUrls: ['./all-subs.component.css']
})
export class AllSubsComponent {

  packs: Pack[] = [];
  basicPacks: any[] = [];
  standardPacks: any[] = [];
  premiumPacks: any[] = [];  isLoading = false;
  selectedPackId: number | null = null;
  showModal = false;
  selectedSubId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isClosing = false;



  constructor(
    private packService: PacksService,
    private subService: SubssService,

    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}


  packId = 1; // Example, can also be passed dynamically

  openModal(subId: number) {
    this.selectedSubId = subId;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedSubId = null;
  }
  ngOnInit(): void {
    this.loadAllPacks();
    this.loadPacks();
  }
  unassignPack(packId: number,SubId:number): void{



    this.subService.unassignPack(packId, SubId).subscribe({
      next: (response) => {
        console.log('Pack assigned successfully:', response);
      },
      error: (error) => {
        console.error('Error assigning pack:', error);
        // Optionally show error message
      }
    });
  }

  assignPack(packId: number,SubId:number): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!packId) {
      this.errorMessage = 'Please select a pack before proceeding!';
      return;
    }
    this.subService.assignPack(packId, SubId).subscribe({
      next: (response) => {
        console.log('Pack assigned successfully:', response);
        this.successMessage = "Pack assigned successfully";

        this.isClosing = true;

        setTimeout(() => {
          const okButton = document.querySelector('button[data-bs-dismiss="modal"]') as HTMLElement;

          if (okButton) {
            okButton.click(); // This will trigger both the dismiss and your assignPack logic
          } else {
            this.onModalClose();
            this.isClosing = false;

          }        }, 3000);
      },
      error: (error) => {
        console.error('Error assigning pack:', error);
        // Optionally show error message
      }
    });
  }

  loadAllPacks(): void {
    this.isLoading = true;

    // Load Basic Packs (e.g., planId = 1)
    this.packService.getPacksbyPlan(2).subscribe({
      next: (packs) => {
        this.basicPacks = packs;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading basic packs:', err);
        this.isLoading = false;
      }
    });

    // Load Standard Packs (e.g., planId = 2)
    this.packService.getPacksbyPlan(1).subscribe({
      next: (packs) => {
        this.standardPacks = packs;
      },
      error: (err) => {
        console.error('Error loading standard packs:', err);
      }
    });

    // Load Premium Packs (e.g., planId = 3)
    this.packService.getPacksbyPlan(3).subscribe({
      next: (packs) => {
        this.premiumPacks = packs;
      },
      error: (err) => {
        console.error('Error loading premium packs:', err);
      }
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

  onModalClose() {
    this.selectedPackId =null;
    this.successMessage='';
    this.errorMessage = '';
    this.updateGlowEffect();
  }

  addGlowEffect(packId: number) {
    // Remove glow from all cards
    document.querySelectorAll('.card-item').forEach(card => {
      card.classList.remove('glow-active');
    });

    // Add glow to the selected card
    const selectedCard = document.querySelector(`.card-item[data-pack-id="${packId}"]`);
    if (selectedCard) {
      selectedCard.classList.add('glow-active');

    }
  }
  updateGlowEffect() {
    // Remove glow from all cards
    document.querySelectorAll('.card-item').forEach(card => {
      card.classList.remove('glow-active');
    });

    // Add glow only if a pack is selected
    if (this.selectedPackId !== null) {
      const selectedCard = document.querySelector(`.card-item[data-pack-id="${this.selectedPackId}"]`);
      if (selectedCard) {
        selectedCard.classList.add('glow-active');
      }
    }
  }
  selectPack(packId: number) {
    this.selectedPackId = this.selectedPackId === packId ? null : packId;

    this.updateGlowEffect();
  }
}
