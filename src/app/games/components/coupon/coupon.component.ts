import {Component, OnInit} from '@angular/core';
import {Coupon} from "../../models/coupon";
import {GameServiceService} from "../../service/game-service.service";

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.css']
})
export class CouponComponent implements OnInit{

  coupons: Coupon[] = [];
  generatedCode: string = '';

  constructor(private gameService: GameServiceService) {}

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons(): void {
    this.gameService.getCoupons().subscribe((data: Coupon[]) => {
      this.coupons = data;
    });
  }

  generateCouponCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segmentLength = 5;
    const segments = 3;
    let code = '';

    for (let i = 0; i < segments; i++) {
      let segment = '';
      for (let j = 0; j < segmentLength; j++) {
        segment += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      code += segment + (i < segments - 1 ? '-' : '');
    }

    return code;
  }

  onGenerateClick(): void {
    this.generatedCode = this.generateCouponCode();
  }

  onCreateCoupon(gameInput: HTMLInputElement, discountSelect: HTMLSelectElement): void {
    const couponCode = gameInput.value;
    const discount = discountSelect.value;

    if (!couponCode || !discount) {
      console.error('Coupon code or discount is missing.');
      return;
    }

    const couponData = {
      couponCode: couponCode,
      discount: parseInt(discount, 10)
    };

    this.gameService.addCoupon(couponData).subscribe({
      next: (newCoupon) => {
        this.getCoupons();
        gameInput.value = '';
        discountSelect.value = '';
      },
      error: (err) => {
        console.error('Error creating coupon:', err);
      }
    });
  }

}
