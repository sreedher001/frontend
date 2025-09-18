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
import { SeasonService } from '../service/season.service';
import { FitService } from '../service/fit.service';
import { PatternService } from '../service/pattern.service';
import { OccasionService } from '../service/occation.service';
import { Addproductservice } from '../admin/addproduct/addproductservice';

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

  autoFitValue: any[] | undefined;
  autoPatternValue: any[] | undefined;
  autoSeasonValue: any[] | undefined;
  autoOccasionValue: any[] | undefined;
autoFilteredSeasonValue: any[] = [];
  autoFilteredOccasionValue: any[] = [];
  autoFilteredStyleCategoryValue: any[] = [];

  autoFilteredFitValue: any[] = [];
  autoFilteredPatternValue: any[] = [];

statuses: string[] = ['IN_STOCK', 'OUT_OF_STOCK', 'LOW_STOCK'];

  
  colorService = inject(ColorService)
    fitService = inject(FitService);
    patternService = inject(PatternService);
    seasonService = inject(SeasonService);
    occasionService = inject(OccasionService);

  nodeService = inject(NodeService);
productResponse !: ProductResponse;
  product: any={};
  loading: Boolean = true;
uploadedFiles: any[] = [];
images:any[]=[];
deletedImageIds: number[] = [];
filteredStatuses: any[] = [];
displayConfirmation:boolean=false;
styleCategory:any[] =[];
maxFilesize:any;
rawStyleCategory: string='';
isStyleCategoryLoaded = false;
isProductLoaded = false;

constructor(private route: ActivatedRoute, private productService: ProductService,private addProductService: Addproductservice,
    private messageService: MessageService) { }
  ngOnInit() {
      this.getStyleCategory();
      this.getColor();
    this.getFit();
    this.getSeason();
    this.getPattern();
    this.getOccasion();
    this.maxFilesize=1000000;
   // const variantId = 3;
   this.route.queryParams.subscribe(params => {
      const variantId = params['variantId'];
      if (variantId) {
        this.loadProductByVariantId(variantId);
      }
    });

    
    

    //this.nodeService.getFiles().then((data) => (this.treeSelectNodes = data));
  }

  getStyleCategory() {
    this.addProductService.getStyleCategory().subscribe({
      next: (res: any) => {
        this.styleCategory = res;
this.isStyleCategoryLoaded = true;
console.log("styeCat res",res);
console.log("styeCat res--this.styleCategory",this.styleCategory);
         this.tryMapStyleCategory();
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'unable to get style Category'
        });
      }
    });
  }

  getColor() {
     this.colorService.getColors().then((colors) => {
      this.autoValue = colors;
    });}

    getFit() {
    this.fitService.getFits().then((fits) => {
      this.autoFitValue = fits;
    });
  }
  getPattern() {
    this.patternService.getPatterns().then((patterns) => {
      this.autoPatternValue = patterns;
    });
  }
   getSeason() {
    this.seasonService.getSeasons().then((season) => {
      this.autoSeasonValue = season;
      this.autoFilteredSeasonValue = season;
    });
  }
  getOccasion() {
    this.occasionService.getOccasions().then((occasions) => {
      this.autoOccasionValue= occasions;
      this.autoFilteredOccasionValue=occasions;
    });
  }

    filterStatuses(event: any) {
  const query = event.query.toLowerCase();
  this.filteredStatuses = this.statuses.filter(status =>
    status.toLowerCase().includes(query)
  );
}

tryMapStyleCategory() {
  if (!this.isProductLoaded || !this.isStyleCategoryLoaded) {
    return; // wait until both are ready
  }

  const raw = this.rawStyleCategory?.trim().toLowerCase();
  console.log("rae",raw);
  if (!raw) return;

  const matched = this.styleCategory.find(item =>
    item.styleCategory?.trim().toLowerCase() === raw
  );
  console.log("matched",matched);

  if (matched) {
    this.product.variant.styleCategory = matched;
      console.log("====if matched",this.product.variant.styleCategory);
  } else {
    // fallback so at least something is shown
    const custom = { id: 0, styleCategory: this.rawStyleCategory };
  this.product.variant.styleCategory = custom;
  this.styleCategory.push(custom);
  }

  // Reset flags so remapping doesn't happen again unnecessarily
  this.isProductLoaded = false;
  this.isStyleCategoryLoaded = false;
}

  loadProductByVariantId(variantId: number): void {
    this.productService.getProductByVariantId(variantId).subscribe({
      next: (response:any) => {
        this.product = response;

        const sc = this.product.variant.styleCategory;
      this.rawStyleCategory = typeof sc === 'string' ? sc : sc?.styleCategory;
      //season
        const seasonStr = this.product.variant.season; 
if (typeof seasonStr === 'string') {
  const selectedSeasons = seasonStr.split(',').map(s => s.trim());

  this.product.variant.season = this.autoFilteredSeasonValue.filter(opt =>
    selectedSeasons.includes(opt.name)
  );
}

//occasion
const occasionStr = this.product.variant.occasion; 
if (typeof occasionStr === 'string') {
  const selectedOccasions = occasionStr.split(',').map(s => s.trim());

  this.product.variant.occasion = this.autoFilteredOccasionValue.filter(opt =>
    selectedOccasions.includes(opt.name)
  );
}

        this.isProductLoaded = true;
        
        this.tryMapStyleCategory();
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

  filterStyleCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.styleCategory as any[]).length; i++) {
      const item = (this.styleCategory as any[])[i];
      if (item.styleCategory.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredStyleCategoryValue = filtered;
  }

  filterFitItem(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.autoFitValue as any[]).length; i++) {
      const item = (this.autoFitValue as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredFitValue = filtered;
  }
  filterPatternItem(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.autoPatternValue as any[]).length; i++) {
      const item = (this.autoPatternValue as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredPatternValue = filtered;
  }

  filterSeasonItem(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.autoSeasonValue as any[]).length; i++) {
      const item = (this.autoSeasonValue as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredSeasonValue = filtered;
  }

  filterOccationItem(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.autoOccasionValue as any[]).length; i++) {
      const item = (this.autoOccasionValue as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredOccasionValue = filtered;
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
    description:this.product.variant.variantDescription,
    fit:this.product.variant.fit.name,
    pattern:this.product.variant.pattern.name,
    rating:this.product.variant.rating,
    season:this.product.variant.season.map((s:any) => s.name).join(','),
    styleCategory:this.product.variant.styleCategory.styleCategory,
    variantName:this.product.variant.variantName,
    occasion:this.product.variant.occasion.map((s:any) => s.name).join(','),
    isFeatured:this.product.variant.isFeatured,
    imagesToRemove: this.deletedImageIds, 
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
      this.displayConfirmation = false;
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
