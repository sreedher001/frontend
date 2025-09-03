import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { ColorPickerModule } from 'primeng/colorpicker';
import { KnobModule } from 'primeng/knob';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TreeSelectModule } from 'primeng/treeselect';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TextareaModule } from 'primeng/textarea';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CountryService } from '../service/country.service';
import { NodeService } from '../service/node.service';
import { MessageService, TreeNode } from 'primeng/api';
import { Country } from '../service/customer.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../products/product.service';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { StyleClass } from "primeng/styleclass";
import { FileUploadModule } from 'primeng/fileupload';
import { ColorService } from '../service/color.service';
import { TableModule } from 'primeng/table';
import { GalleriaModule } from 'primeng/galleria';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    SelectButtonModule,
    InputGroupModule,
    FluidModule,
    IconFieldModule,
    InputIconModule,
    FloatLabelModule,
    AutoCompleteModule,
    InputNumberModule,
    SliderModule,
    RatingModule,
    ColorPickerModule,
    KnobModule,
    SelectModule,
    DatePickerModule,
    TooltipModule,
    ToggleButtonModule,
    ToggleSwitchModule,
    TreeSelectModule,
    TableModule,
    MultiSelectModule,
    ListboxModule,
    InputGroupAddonModule,
    TextareaModule, FileUploadModule, GalleriaModule,
    Tooltip,DialogModule
],
  templateUrl: './edit-variant.html',
  providers: [ NodeService]
})
export class EditVariant implements OnInit {

  autoValue: any[] | undefined;

  autoFilteredValue: any[] = [];

  radioValue: any = null;

  checkboxValue: any[] = [];

  switchValue: boolean = false;



statuses: string[] = ['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK'];

  
  colorService = inject(ColorService)

  nodeService = inject(NodeService);
productResponse !: ProductResponse;
  product: any={};
  loading: Boolean = true;
uploadedFiles: any[] = [];
images:any[]=[];
deletedImageIds: number[] = [];
filteredStatuses: any[] = [];
displayConfirmation:boolean=false;
maxFilesize:any;
constructor(private route: ActivatedRoute, private productService: ProductService,
    private messageService: MessageService) { }
  ngOnInit() {
    // this.product=this.getEmptyProduct();
     
    this.maxFilesize=1000000;
   // const variantId = 3;
   this.route.queryParams.subscribe(params => {
      const variantId = params['variantId'];
      if (variantId) {
        this.loadProductByVariantId(variantId);
      }
    });

    this.getColor();

    //this.nodeService.getFiles().then((data) => (this.treeSelectNodes = data));
  }
  getColor() {
     this.colorService.getColors().then((colors) => {
      this.autoValue = colors;
    });}

    filterStatuses(event: any) {
  const query = event.query.toLowerCase();
  this.filteredStatuses = this.statuses.filter(status =>
    status.toLowerCase().includes(query)
  );
}

  


  loadProductByVariantId(variantId: number): void {
    this.productService.getProductByVariantId(variantId).subscribe({
      next: (response) => {
        this.product = response;
        this.images = (this.product.variant.productImage || []).map((img:any) => ({
          
          itemImageSrc: img.imageUrl,
          thumbnailImageSrc: img.imageUrl,
          id:img.id,
          alt: this.product.name,
        }));
        
        this.messageService.add({
          key: 'global',
          severity: 'info',
          summary: 'Hurey!',
          detail: `Product/variant fetched successfully`

        });
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'OOPS!',
          detail: 'Could not fetch the details.'
        });
        this.loading = false;
      }
    });
  }

  removeImage(imageId: number) {
  this.product.variant.productImage = this.product.variant.productImage
    .filter((img:any) => img.id !== imageId);
}

removeSize(sizeId: number) {
  this.product.variant.sizes = this.product.variant.sizes
    .filter((s:any) => s.id !== sizeId);
}
  filterCountry(event: AutoCompleteCompleteEvent) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < (this.autoValue as any[]).length; i++) {
      const country = (this.autoValue as any[])[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }

    this.autoFilteredValue = filtered;
  }


  onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ key: 'global',severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
    onFileSelect(event: any) {
         for (const file of event.files) {
      
      if(! (file.size > this.maxFilesize)){
       
      this.uploadedFiles.push(file);
       this.messageService.add({ key: 'global', severity: 'info', summary: 'Success!', detail: file.name+' selected',sticky:true });
      }else{
        this.messageService.add({ key: 'global', severity: 'warn', summary: 'Too Large!', detail: file.name+' not selected',sticky:true });
      }
    }
    }
    responsiveOptions = [
    { breakpoint: '1024px', numVisible: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 }
  ];

 deleteImage(item: any) {
  // Find the real index in your images[] array
  const idx = this.images.findIndex(img => img.itemImageSrc === item.itemImageSrc);

  if (idx !== -1) {
    this.images.splice(idx, 1); // Remove correct image
  }

  // Store id for backend
  if (item.id) {
    this.deletedImageIds.push(item.id);
  }

  console.log("deleted IDs:", this.deletedImageIds);
}

addSize() {
  const newSize = {
    id: null, // temp ID until backend assigns
    size: '',
    price: null,
    discountPercentage: 0,
    sku: '',
    hsnCode: '',
    availableQuantity: 0,
    lowStockThreshold: 0,
    inventoryStatus: 'IN_STOCK'
  };
  this.product.variant.sizes.push(newSize);
}


updateVariant() {
  const variantId = this.product.variant.id;

  // --- Build metadata (excluding images) ---
  const metadata = {
    id: this.product.variant.id,
    color: this.product.variant.color,
    imagesToRemove: this.deletedImageIds, // deleted images
    sizes: this.product.variant.sizes
  };

  // --- Create FormData for multipart ---
  const formData = new FormData();
  formData.append('metadata', JSON.stringify(metadata));

  // --- Append new uploaded files if any ---
  this.uploadedFiles.forEach((file: File) => {
    formData.append('file', file, file.name);
  });

  // --- Call API via service ---
  this.productService.updateVariant(variantId, formData).subscribe({
    next: (res:any) => {
      this.messageService.add({
        key: 'global',
        severity: 'success',
        summary: 'Saved!',
        detail: res.message || 'Variant updated successfully'
      });
    },
    error: (err:any) => {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message || 'Update failed'
      });
    }
  });
}
openConfirmation() {
        this.displayConfirmation = true;
    }

    closeConfirmation() {
        this.displayConfirmation = false;
    }
}
