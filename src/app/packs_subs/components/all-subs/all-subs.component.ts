import {Component, ChangeDetectorRef, NgZone, OnInit, OnDestroy} from '@angular/core';
import {Pack} from "../../models/pack.model";
import { PacksService } from '../../services/packs.service';
import {SubssService} from "../../services/subs.service";
import {environment} from "../../../enviroment/env";


@Component({
  selector: 'app-all-subs',
  templateUrl: './all-subs.component.html',
  styleUrls: ['./all-subs.component.css']
})
export class AllSubsComponent implements OnInit {

  packs: any[] = [];
  basicPacks: any[] = [];
  standardPacks: any[] = [];
  premiumPacks: any[] = [];
  isLoading = false;
  selectedPackId: number | null = null;
  showModal = false;
  selectedSubId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  isClosing = false;
  subs:any[] =[];
  baseUrl: string= environment.apiUrlImg;


  subscriptionStats: {
    counts: { BASIC: number, STANDARD: number, PREMIUM: number },
    revenue: { BASIC: number, STANDARD: number, PREMIUM: number, TOTAL: number }
  } | null = null;



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
    this.loadSubs();
  }
  unassignPack(packId: number,SubId:number): void{



    this.subService.unassignPack(packId, SubId).subscribe({
      next: (response) => {
       // console.log('Pack assigned successfully:', response);
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
       // console.log('Pack assigned successfully:', response);
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

    this.packService.getPacksbyPlan(2).subscribe({
      next: (packs) => {
   //     console.log('Pack assigned successfully:', packs);
        this.basicPacks = packs;
        this.isLoading = false;
       // console.log(this.basicPacks);
      },
      error: (err) => {
        console.error('Error loading basic packs:', err);
        this.isLoading = false;
      }
    });

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
      //  console.log(this.premiumPacks);
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
    this.loadAllPacks();
    this.updateGlowEffect();
  }

  getPositionStyle(index: number): string {
    switch (index) {
      case 0: return '38% 98%';
      case 1: return '46% 95%';
      case 2: return '44% 76%';
      case 3: return '54.95% 88%';
      default: return 'center center';
    }
  }
  getBgPosition(index: number): string {
    const positions = [
      '38% 98%',
      '46% 95%',
      '44% 76%',
      '54.95% 88%'
      // Add more positions if you have more cards
    ];
    return positions[index] || 'center'; // Fallback
  }


  loadSubs(): void {
    this.subService.getAllSubs().subscribe({
      next: (subs) => {
        this.subs = subs;
        this.calculateRevenueByType(); // 👈 ajoute cette ligne
        // console.log(this.subs);
      },
      error: (err) => {
        console.error('Error loading packs:', err);
      }
    });
  }


  calculateRevenueByType(): void {
    const counts = {
      BASIC: 0,
      STANDARD: 0,
      PREMIUM: 0
    };

    const prices = {
      BASIC: 10,       // replace with your actual price
      STANDARD: 20,
      PREMIUM: 30
    };

    for (const sub of this.subs) {
      const type = (sub.subscriptionType || '').toUpperCase().trim();
      if (type=="BASIC" && counts.hasOwnProperty("BASIC")) {
        counts["BASIC"]++;
         console.log(`[${type}] ${sub.subscriptionType}: ${sub.subscriptionType}`);
      }
      else if (type=="STANDARD" && counts.hasOwnProperty("STANDARD")) {
        counts["STANDARD"]++;
        console.log(`[${type}] ${sub.subscriptionType}: ${sub.subscriptionType}`);
      }
      else if (type=="PREMIUM" && counts.hasOwnProperty("PREMIUM")) {
        counts["PREMIUM"]++;
        console.log(`[${type}] ${sub.subscriptionType}: ${sub.subscriptionType}`);
      }
    }

    const revenue = {
      BASIC: counts.BASIC * prices.BASIC,
      STANDARD: counts.STANDARD * prices.STANDARD,
      PREMIUM: counts.PREMIUM * prices.PREMIUM,
      TOTAL: (
        counts.BASIC * prices.BASIC +
        counts.STANDARD * prices.STANDARD +
        counts.PREMIUM * prices.PREMIUM
      )
    };

    console.log('Subscription Counts:', counts);
    console.log('Revenue:', revenue);

    this.subscriptionStats = {
      counts,
      revenue
    };
  }


}
