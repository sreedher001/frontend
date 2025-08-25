export interface SizeInventoryDto{

     id:number;
     size:string;
     price:number;
     discountPercentage:number;
     sku:string;
     hsnCode:string;
     availableQuantity:number;
     reservedQuantity:number;
     lowStockThreshold:number;
     inventoryStatus:any;
     lastUpdated:any;
}