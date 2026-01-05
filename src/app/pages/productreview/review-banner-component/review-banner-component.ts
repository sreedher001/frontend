import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { PendingReview } from '../pending-review.model';
import { ReviewService } from '../review-service';
import { ReviewModalComponent } from '../review-modal-component/review-modal-component';
import { DialogService } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from "primeng/toast";

@Component({
  selector: 'app-review-banner-component',
  imports: [ButtonModule, ToastModule],
  templateUrl: './review-banner-component.html',
  styleUrl: './review-banner-component.scss',
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out')
      ])
    ])
  ],
  providers:[DialogService]
})
export class ReviewBannerComponent implements OnInit {


  pending: PendingReview[] = [];

  constructor(
    private reviewService: ReviewService,
    private dialog: DialogService,private messageService: MessageService
  ) {}

  ngOnInit() {
    this.reviewService.getPendingReviews()
      .subscribe(res => this.pending = res.slice(0, 1));
  }

  openReview(review: PendingReview) {
  const ref = this.dialog.open(ReviewModalComponent, {
    data: review,
    header: 'Rate your purchase',
    width: '90%',
    styleClass: 'review-dialog'
  });

  ref.onClose.subscribe((success) => {
    if (success) {
      this.messageService.add({
        key:'global',
        severity: 'secondary',
        summary: 'Thank you!',
        detail: 'Your review has been submitted successfully'
      });

      // remove banner after success
      this.pending = [];
    }
  });
}

}
