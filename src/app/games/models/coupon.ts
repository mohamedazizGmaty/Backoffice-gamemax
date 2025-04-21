export class Coupon {
  couponId: number;
  couponCode: string;
  discount: number;
  used: number;
  available: number;

  constructor(couponId: number, couponCode: string, discount: number, used: number, available: number) {
    this.couponId = couponId;
    this.couponCode = couponCode;
    this.discount = discount;
    this.used = used;
    this.available = available;
  }
}
