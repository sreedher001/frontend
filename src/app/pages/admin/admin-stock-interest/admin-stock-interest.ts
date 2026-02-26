import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { AdminStockInterestService } from './admin-stock-interest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-stock-interest',
  imports: [CommonModule,
    TableModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule],
  templateUrl: './admin-stock-interest.html',
  styleUrl: './admin-stock-interest.scss'
})
export class AdminStockInterest implements OnInit {

  interests: AdminStockInterest[] = [];
  loading = true;
  totalWaiting = 0;

  constructor(private service: AdminStockInterestService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getStockInterest().subscribe({
      next: (data:any) => {
        this.interests = data;
        this.totalWaiting = data.reduce((sum:any, item:any) => sum + item.waitingCount, 0);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading stock interest', err);
        this.loading = false;
      }
    });
  }

  getSeverity(count: number): string {
    if (count >= 10) return 'danger';
    if (count >= 4) return 'warning';
    return 'info';
  }
  goToProduct(variantId: number): void {
    this.router.navigate(['/product-details', variantId]);
  }
}
