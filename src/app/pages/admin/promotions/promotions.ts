import { Component, OnInit, ViewChild } from '@angular/core';
import { Promotion } from './promotion.modal';
import { PromotionService } from './promotion.service';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-promotions',
  imports: [TableModule,ButtonModule,InputTextModule,TagModule,PaginatorModule,DatePipe],
  templateUrl: './promotions.html',
  styleUrl: './promotions.scss'
})
export class Promotions implements OnInit {

  promotions: Promotion[] = []
  loading:boolean=true

  @ViewChild('dt') dt!:Table

  constructor(
    private promoService:PromotionService,
    private router:Router
  ){}

  ngOnInit():void{
    this.loadPromotions()
  }

  loadPromotions(){
    this.promoService.getPromotions().subscribe(res=>{
      this.promotions=res
      this.loading=false
    })
  }

  createPromotion(){
    this.router.navigate(['/admin/promotions/new'])
  }

  editPromotion(promo:Promotion){
    this.router.navigate(['/admin/promotions/edit',promo.id])
  }

  deletePromotion(promo:Promotion){

    if(confirm("Delete this promotion?")){

      this.promoService.deletePromotion(promo.id).subscribe(()=>{
        this.loadPromotions()
      })

    }

  }

}