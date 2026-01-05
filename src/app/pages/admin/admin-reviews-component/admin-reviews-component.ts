import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminReviewService } from './admin-review-service';
import { Table, TableLazyLoadEvent, TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';


export interface AdminProductReview {
  reviewId: number;

  rating: number;
  reviewText: string;

  approved: boolean;
  verifiedPurchase: boolean;
  createdAt: string;

  userId: number;
  username: string;
  userEmail: string;

  productId: number;
  productName: string;
variantName:string;
  variantId: number;
  color: string;
  size: string;
  orderId:number;
  orderNumber:any;
}

@Component({
  selector: 'app-admin-reviews-component',
  imports: [TableModule,InputTextModule,TagModule,CardModule,RatingModule,
    FormsModule,DatePipe,ButtonModule,RatingModule,DialogModule],
  templateUrl: './admin-reviews-component.html',
  styleUrl: './admin-reviews-component.scss'
})
export class AdminReviewsComponent implements OnInit{
@ViewChild('dt') dt!: Table;
  reviews: AdminProductReview[] = [];
  totalRecords = 0;
  loading = false;
expandedRows = {};
  pageSize = 10;
  page = 0;
allLoaded = false;

  constructor(private reviewService: AdminReviewService,private router: Router,private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadReviews();
  }
loadMore() {
  this.loadReviews();
}
  loadReviews() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    // const page = (event.first ?? 0) / (event.rows ?? this.pageSize);
    // const size = event.rows ?? this.pageSize;
    const sortField = 'createdAt';
    const sortOrder =  'desc';

    this.reviewService
      .getReviews(this.page, this.pageSize, sortField, sortOrder)
      .subscribe(res => {
        //this.reviews = res.content;
       const newData  = res.content.map((r: any) => ({
        ...r,
        createdAt: new Date(r.createdAt)
      }));
      this.reviews = [...this.reviews, ...newData];
        this.totalRecords = res.totalElements;
        if (this.reviews.length >= this.totalRecords) {
        this.allLoaded = true;
      }
       this.page++;
        this.loading = false;
      });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  goToVariant(variantId: number) {
  this.router.navigate(['/product-details', variantId]);
}
goToOrder(orderId: number) {
  this.router.navigate(['/admin/order-details/', orderId]);
}


onGlobalFilter(event: Event) {
  const value = (event.target as HTMLInputElement).value;
  this.dt.filterGlobal(value, 'contains');
}

expandAll() {
  const expanded: { [key: string]: boolean } = {};

  this.reviews.forEach(review => {
    expanded[review.orderId] = true; // MUST MATCH dataKey
  });

  this.expandedRows = expanded;
}

collapseAll() {
  this.expandedRows = {}; // clears all expanded rows
}
onRowExpand(event: TableRowExpandEvent) {
        this.messageService.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        this.messageService.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
    }
}
