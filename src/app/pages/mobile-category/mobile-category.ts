import { CommonModule } from '@angular/common';
import { Component,ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-mobile-category',
  imports: [CommonModule],
  templateUrl: './mobile-category.html',
  styleUrl: './mobile-category.scss'
})
export class MobileCategory {
categories = [
 'MEN',
 'WOMEN',
 'TEES',
 'JOGGERS',
 'POLOS',
 'CO-ORD SETS',
 'SHIRTS',
 'HOODIES & JACKETS',
 'ACTIVEWEAR',
 'TRAVEL'
];

selectedCategory = 'MEN';

@ViewChild('scrollContainer') scrollContainer!: ElementRef;

items = [
 {category:'MEN', name:'T SHIRTS', image:'assets/tshirt.jpg'},
 {category:'MEN', name:'CO ORDS', image:'assets/coord.jpg'},
 {category:'MEN', name:'JOGGERS', image:'assets/jogger.jpg'},
 {category:'MEN', name:'POLOS', image:'assets/polo.jpg'},
 {category:'MEN', name:'SHORTS', image:'assets/shorts.jpg'},
 {category:'MEN', name:'SHIRTS', image:'assets/shirts.jpg'},

 {category:'WOMEN', name:'T SHIRTS', image:'assets/tshirt.jpg'},
 {category:'WOMEN', name:'CO ORDS', image:'assets/coord.jpg'},
 {category:'WOMEN', name:'JOGGERS', image:'assets/jogger.jpg'},
 {category:'WOMEN', name:'POLOS', image:'assets/polo.jpg'},
 {category:'WOMEN', name:'SHORTS', image:'assets/shorts.jpg'},
 {category:'WOMEN', name:'SHIRTS', image:'assets/shirts.jpg'}
];


getItems(cat:string){
 return this.items.filter(i=>i.category===cat);
}

seeAll(category:string){
  console.log("Open full category", category);

  // example navigation
  // this.router.navigate(['/products'], { queryParams:{category}});
}

openItem(item:any){
  console.log("Open full category", item);

  // example navigation
  // this.router.navigate(['/products'], { queryParams:{category}});
}
scrollToCategory(cat:string){

 this.selectedCategory = cat;

 const element = document.getElementById(cat);

 element?.scrollIntoView({
  behavior:'smooth',
  block:'start'
 });

}


onScroll(){

 const container = this.scrollContainer.nativeElement;

 for(let cat of this.categories){

   const el = document.getElementById(cat);

   if(!el) continue;

   const rect = el.getBoundingClientRect();

   if(rect.top >= 0 && rect.top < window.innerHeight/2){

     this.selectedCategory = cat;

     break;

   }

 }

}
}
