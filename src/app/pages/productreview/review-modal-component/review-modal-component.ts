import { Component, Inject } from '@angular/core';
import { PendingReview } from '../pending-review.model';
import { ReviewService } from '../review-service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClass } from "primeng/styleclass";
import { ResolveImagePipe } from '@/shared/resolve-image.pipe';

@Component({
  selector: 'app-review-modal-component',
  imports: [RatingModule, FormsModule, ButtonModule, TextareaModule, InputTextModule, ResolveImagePipe],
  templateUrl: './review-modal-component.html',
  styleUrl: './review-modal-component.scss'
})
export class ReviewModalComponent {
data!:PendingReview;
  rating = 0;
  comment = '';

  constructor(
    private reviewService: ReviewService,
    public config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) {
    this.data = this.config.data as PendingReview;
  }

  submit() {
    this.reviewService.submitReview({
      orderId: this.data.orderId,
      variantId: this.data.variantId,
      rating: this.rating,
      reviewText: this.comment
    }).subscribe(() => this.ref.close(true));
  }
}
