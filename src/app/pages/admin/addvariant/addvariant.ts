import { Component, inject, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
import { MessageService, TreeNode } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductResponse } from '@/models/product-response.model';
import { Product } from '@/models/product.model';
import { ProductVariantResponseDto } from '@/models/productVariantResponseDto';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { GalleriaModule } from 'primeng/galleria';
import { Tooltip, TooltipModule } from "primeng/tooltip";
import { DialogModule } from 'primeng/dialog';
import { ProductService } from '@/pages/products/product.service';
import { ColorService } from '@/pages/service/color.service';
import { Addproductservice } from '../addproduct/addproductservice';
import { FitService } from '@/pages/service/fit.service';
import { PatternService } from '@/pages/service/pattern.service';
import { SeasonService } from '@/pages/service/season.service';
import { OccasionService } from '@/pages/service/occation.service';

@Component({
  selector: 'app-addvariant',
  imports: [CommonModule,
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
    Tooltip, DialogModule],
  templateUrl: './addvariant.html',
  styleUrl: './addvariant.scss'
})
export class Addvariant implements OnInit {

  showeErrorSuggestion: boolean = false;
  showeErrorSuggestionSize: boolean = false;
  showeErrorSuggestionFile: boolean = false;
  uploadedFiles: File[] = [];
  displayConfirmation: boolean = false;
  autoValue: any[] | undefined;
  styleCategory:any[] | undefined;
  category:any[] | undefined;
  productName:any[] | undefined;
  subCategory:any[] | undefined;
  genderCategory:any[] | undefined;
  autoFilteredValue: any[] = [];
  autoFilteredCategoryValue: any[] = [];
  autoFilteredProductName: any[] = [];  
  autoFilteredGenderCategoryValue: any[] = [];
  autoFilteredSubCategoryValue: any[] = [];
  autoFilteredStyleCategoryValue:any[]=[];
  autoFilteredFitValue: any[] = [];
  autoFilteredPatternValue: any[] = [];
  autoFilteredSeasonValue: any[] = [];

  autoFitValue: any[] | undefined;
  autoPatternValue: any[] | undefined;
  autoSeasonValue: any[] | undefined;
  autoOccasionValue: any[] | undefined;

  autoFilteredOccasionValue: any[] = [];
  loading: boolean = true;
  hasGenderCategory:boolean=false;
  hasSubCategory:boolean=false;
  maxFilesize:any;
  productresponse!:ProductResponse;
  productFound:boolean =false;
  product: any = {
    name: '',
    description: '',
    category: '',
    subCategory: '',
    genderCategory: ''
  }
  variant:any={
    color: '',
    isFeatured: false,
    styleCategory:'',
    fit:'',
    pattern:'',
    season:'',
    occasion:'',
    rating:3,
    variantName:'',
    variantDescription:'',
    sizes: [] // start with empty table
  };
productParentId:any;
  constructor(private route: Router, private productService: ProductService, private addProductService: Addproductservice,
    private messageService: MessageService) { }
  ngOnInit(): void {
    this.maxFilesize=1000000;
    this.loading = true;
    this.getColor();
    this.getProductNames();
    this.getcategory();
    this.getStyleCategory();
    this.getFit();
    this.getSeason();
    this.getPattern();
    this.getOccasion();
    this.loading = false;
  }
  hasInvalidSizes(): boolean {
    if (this.variant.sizes === null || this.variant.sizes.length === 0) return false;
    return this.variant.sizes.some((size: any) =>
      !size.size ||
      size.price == null || size.price === '' ||
      size.quantity == null || size.quantity === '' ||
      size.discountPercentage == null || size.discountPercentage === ''
    );
  }

checkParentProduct() {
  const errors: string[] = [];

  // Validate name (string or object with productName)
  if (!this.product.name || (typeof this.product.name === 'object' && !this.product.name.productName)) {
    errors.push('Product Name');
  }

  // Validate category (object with .category or string)
  if (!this.product.category || (typeof this.product.category === 'object' && !this.product.category.category)) {
    errors.push('Category');
  }

  // Validate genderCategory (object with .genderCategory or string)
  if (!this.product.genderCategory || (typeof this.product.genderCategory === 'object' && !this.product.genderCategory.genderCategory)) {
    errors.push('Gender Category');
  }

  // Validate subCategory (object with .subCategory or string)
  if (!this.product.subCategory || (typeof this.product.subCategory === 'object' && !this.product.subCategory.subCategory)) {
    errors.push('Sub Category');
  }

  // If any errors, show a toast
  if (errors.length > 0) {
    this.messageService.add({
      key: 'global',
      severity: 'warn',
      summary: 'Incomplete Selection',
      detail: `Please select: ${errors.join(', ')}`
    });
    return;
  }

  // If all fields valid, call backend API
  const params = {
    name: typeof this.product.name === 'string' ? this.product.name : this.product.name.productName,
    category: typeof this.product.category === 'string' ? this.product.category : this.product.category.category,
    genderCategory: typeof this.product.genderCategory === 'string' ? this.product.genderCategory : this.product.genderCategory.genderCategory,
    subCategory: typeof this.product.subCategory === 'string' ? this.product.subCategory : this.product.subCategory.subCategory
  };

  this.productService.checkParentProduct(params).subscribe({
    next: (res: any) => {
      if (res?.productId) {
        this.productFound=true;
        this.productParentId=res?.productId;
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Parent Product Found',
          detail: 'You can proceed with adding the variant.'
        });

        this.product.productId = res.productId;
      } else {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Not Found',
          detail: 'No parent product found for the selected combination.Consider creating new Product',
          sticky:true
        });
      }
    },
    error: (err:any) => {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'API Error',
        detail: err.error?.message || 'Failed to check parent product.'
      });
    }
  });
}

  onSubmit(form: NgForm) {
    console.log("Button Clicked")
    if (form.invalid || this.variant.sizes.length === 0 || this.hasInvalidSizes() || this.uploadedFiles === null || this.uploadedFiles.length === 0) {
      this.messageService.add({
        key: 'global',
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields including valid sizes.'
      });
      if (form.invalid) {
        this.showeErrorSuggestion = true;
      }
      if (this.hasInvalidSizes()) {
        this.showeErrorSuggestionSize = true;
      }
      if (this.uploadedFiles === null || this.uploadedFiles.length === 0) {
        this.showeErrorSuggestionFile = true;
      }

      return;
    }

    this.openConfirmation();
  }


  fitService = inject(FitService);
  patternService = inject(PatternService);
  seasonService = inject(SeasonService);
  occasionService = inject(OccasionService);
  colorService = inject(ColorService);
  closeConfirmation() {
    this.displayConfirmation = false;
  }
  openConfirmation() {
    this.displayConfirmation = true;
  }

  

  removeSize(size: any) {
    this.variant.sizes = this.variant.sizes.filter((s: any) => s !== size);
  }
  addSize() {
    const newSize = {
      id: null, // temp ID until backend assigns
      size: '',
      price: 0,
      quantity: 0,
      discountPercentage: 0,
      sku: '',
      hsnCode: '',
      inventoryStatus: 'IN_STOCK'
    };
    this.variant.sizes.push(newSize);
  }

  
  getProductNames() {
    this.addProductService.getAllProductName().subscribe({
      next:(res:any)=>{
this.productName = res;
console.log("this.productName",this.productName);
      }
      
    });
   
  }
getStyleCategory() {
    this.addProductService.getStyleCategory().subscribe({
      next: (res: any) => {
        this.styleCategory = res;
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
    });
  }
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

  getcategory() {
    this.addProductService.getCategory().subscribe({
      next: (res: any) => {
        this.category = res;
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'unable to get Category'
        });
      }
    });

  }
 onCategorySelect(event: any) {
  
  const selectedCategory = event.value; // `event` is the selected category object
  const categoryId = selectedCategory.id; 
  if (categoryId) {
    this.getGenderCategory(categoryId);
  }
}

onGenderCategorySelect(event: any) {
  
  const selectedGenderCategory = event.value; // `event` is the selected category object
  const genderCategoryId = selectedGenderCategory.id; 
  if (genderCategoryId) {
    this.getSubCategory(genderCategoryId);
  }
}
  getSubCategory(genderCategoryId:number) {
    this.addProductService.getSubCategory(genderCategoryId).subscribe({
      next: (res: any) => {
        this.subCategory = res;
        this.hasSubCategory = true;
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'unable to get Category'
        });
      }
    });

  }

  getGenderCategory(id:number) {
    this.addProductService.getGenderCategory(id).subscribe({
      next: (res: any) => {
        this.genderCategory = res;
        this.hasGenderCategory=true;
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'unable to get gender Category '
        });
      }
    });

  }
 

  filterItem(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.autoValue as any[]).length; i++) {
      const item = (this.autoValue as any[])[i];
      if (item.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredValue = filtered;
  }
  filterProductName(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.productName as any[]).length; i++) {
      const item = (this.productName as any[])[i];
      if (item?.productName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredProductName = filtered;
  }

  filterCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.category as any[]).length; i++) {
      const item = (this.category as any[])[i];
      if (item.category.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredCategoryValue = filtered;
  }
  filterSubCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.subCategory as any[]).length; i++) {
      const item = (this.subCategory as any[])[i];
      if (item.subCategory.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredSubCategoryValue = filtered;
  }
  filterGenderCategory(event: AutoCompleteCompleteEvent) {
    const query = event.query;
    const filtered: any[] = [];

    for (let i = 0; i < (this.genderCategory as any[]).length; i++) {
      const item = (this.genderCategory as any[])[i];
      if (item.genderCategory.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.autoFilteredGenderCategoryValue = filtered;
  }

  
  onUpload(event: any) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ key: 'global', severity: 'info', summary: 'Success', detail: 'File Uploaded' });
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
    console.log("==", this.uploadedFiles)
   
  }
  onFileRemove(event: any) {
    const fileToRemove = event.file;
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== fileToRemove);
    console.log("==", this.uploadedFiles)
    this.messageService.add({ key: 'global', severity: 'info', summary: 'Success', detail: 'File removed' });
  }
  onClearFiles() {
    this.uploadedFiles = [];
    this.messageService.add({ key: 'global', severity: 'info', summary: 'Success', detail: 'Removed all files' });
    console.log("==", this.uploadedFiles)
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


  saveProduct() {
    this.displayConfirmation = false;

    // Build request JSON
    const metadata = {
      
      color: this.variant.color.name,
       styleCategory:this.variant.styleCategory.styleCategory,
      fit:this.variant.fit.name,
      pattern:this.variant.pattern.name,
      season:this.variant.season.map((s:any) => s.name).join(','),
      occasion:this.variant.occasion.map((s:any) => s.name).join(','),
      rating:this.variant.rating,
      isFeatured: this.variant.isFeatured,
      variantName:this.variant.variantName,
      variantDescription:this.variant.variantDescription,
      sizes: this.variant.sizes,

      fabricType: this.variant.fabricType,
  materialComposition: this.variant.materialComposition,
  liningMaterial: this.variant.liningMaterial,
  transparencyLevel: this.variant.transparencyLevel,
  stretchability: this.variant.stretchability,
  workType: this.variant.workType,
  careInstructions: this.variant.careInstructions,
  madeBy: this.variant.madeBy,
  sizeRecommendation: this.variant.sizeRecommendation,
  modelInfo: this.variant.modelInfo
    };

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(metadata));
    this.uploadedFiles.forEach(file => formData.append('file', file, file.name));

    console.log('FormData Metadata:', metadata);
    console.log('Files:', this.uploadedFiles);

    this.productService.addVariant(this.productParentId,formData).subscribe({
      next: (res: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Success!',
          sticky: false,
          detail: res.message || 'New variant has been added successfully'
        });
        this.route.navigate(['/admin/products/manageproducts']);
      },
      error: (err: any) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Error',
          sticky: true,
          detail: err.error?.message || 'Failed to add new variant'
        });
      }
    });
  }
}
