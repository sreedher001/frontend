import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { AdminReturnDetailDto, Return } from '../return';
import { TimelineModule } from 'primeng/timeline';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-return-detail-component',
  imports: [CardModule,
    ButtonModule,
    TagModule,TimelineModule,DatePipe,
    ProgressSpinnerModule],
  templateUrl: './admin-return-detail-component.html',
  styleUrl: './admin-return-detail-component.scss'
})
export class AdminReturnDetailComponent {

  returnId!: number;
  returnDetail!: AdminReturnDetailDto;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private returnService: Return
  ) {}

  ngOnInit() {
    this.returnId = Number(this.route.snapshot.paramMap.get('returnId'));
    if(this.returnId != null){
      
    this.loadDetails();
    this.loading=false;
  }
  }

  loadDetails() {
    this.returnService.getReturnDetail(this.returnId)
      .subscribe(res => {
        this.returnDetail = res;
        this.loading = false;
      });
  }
}
