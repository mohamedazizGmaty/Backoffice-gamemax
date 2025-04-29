import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {SubssService} from "../../services/subs.service";
import {Pack} from "../../models/pack.model";
import {Subscription} from "../../models/subscription";

import {PacksService} from "../../services/packs.service";



@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit {

  subs: any[] = [];
  constructor(
    private packService: PacksService,
    private subService: SubssService,

  ) {}
  ngOnInit(): void {
    this.loadPacks();
    this.loadUsers()


  }
  combinedList :any []= [];



  calculateProgress(startDate: Date, endDate: Date): number {
    const now = new Date();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const current = now.getTime();

    if (current >= end) return 100; // Subscription ended
    if (current <= start) return 0; // Not started yet



    const totalDuration = end - start;
    const elapsed = current - start;
    return Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));
  }

  calculateDashArray(progress: number): string {
    const circumference = 2 * Math.PI * 54;
    const progressLength = (progress / 100) * circumference;
    return `${progressLength} ${circumference}`;
  }

  getProgressColor(progress: number): string {
    if (progress >= 90) return '#FF3E3E'; // Red when nearly expired
    if (progress >= 50) return '#FFAB00'; // Yellow when halfway
    return '#3874FF'; // Blue for normal progress
  }

  getProgressStatus(progress: number): string {
    if (progress === 0) return 'Not Started';
    if (progress >= 100) return 'Completed';
    return `${progress}%`;
  }
  loadPacks(): void {
    this.subService.getAllSubs().subscribe({
      next: (subs) => {
        //console.log(subs);
        this.subs = subs;
        this.generateStats(subs);
      },
      error: (err) => {
        //console.error('Error loading packs:', err);
      }
    });
  }
  loadUsers(): void {
    this.subService.getAllUsers().subscribe({
      next: (users) => {
        console.log(users);

          this.combinedList = this.subs.map(sub => {
            const user = users.find(u => u.userId === sub.userId);
            return {
              user,
              subscription: sub
            };
          });
        console.log(  this.combinedList);



      },
      error: (err) => {
        console.error('Error loading packs:', err);
      }
    });
  }

  subscriptionStats: { [type: string]: number } = {};
  totalSubscriptions: number = 0;
  uniqueUserCount: number = 0;

  generateStats(subs: any[]): void {
    const typeCounts: { [type: string]: number } = {};
    const userIds = new Set<number>();

    subs.forEach(sub => {
      const type = sub.subscriptionType.toUpperCase();
      typeCounts[type] = (typeCounts[type] || 0) + 1;
     // console.log(typeCounts[type]);
      userIds.add(sub.userId);
    });

    this.subscriptionStats = typeCounts;
    this.totalSubscriptions = subs.length;
    this.uniqueUserCount = userIds.size;
  }
  getBadgeClass(count: number): string {
    if (count >= 10) return 'badge-phoenix-danger';
    if (count >= 5) return 'badge-phoenix-warning';
    return 'badge-phoenix-info';
  }

  getTrend(count: number): string {
    if (count >= 10) return '+20.00%';
    if (count >= 5) return '+10.00%';
    return '+5.00%';
  }


}
