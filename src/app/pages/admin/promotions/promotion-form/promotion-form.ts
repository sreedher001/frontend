import { Component, OnInit } from '@angular/core';
import { Promotion } from '../promotion.modal';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { PromotionService } from '../promotion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {  DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion-form',
  imports: [InputTextModule,CommonModule, ButtonModule,InputNumberModule,AutoCompleteModule, DatePickerModule,SelectModule,ReactiveFormsModule, CheckboxModule],
  templateUrl: './promotion-form.html',
  styleUrl: './promotion-form.scss'
})
export class PromotionForm implements OnInit {

  promotionForm!: FormGroup;
  promotionId: number | null = null;
  isEdit = false;

  /* -------------------- DROPDOWNS -------------------- */

  promotionTypes = [
    { label: 'Auto Promotion', value: 'AUTO' },
    { label: 'Coupon Promotion', value: 'COUPON' }
  ];

  promotionGroups = [
    { label: 'Cart Discount', value: 'CART' },
    { label: 'Shipping Discount', value: 'SHIPPING' },
    { label: 'category Discount', value: 'CATEGORY' }
  ];

  conditionTypes = [
    { label: 'Cart Total', value: 'CART_TOTAL' },
    { label: 'Quantity', value: 'QUANTITY' },
    { label: 'First Order', value: 'USER_FIRST_ORDER' },
    { label: 'Category', value: 'CATEGORY' }
  ];

  operators = [
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: '=', value: '=' }
  ];

  actionTypes = [
    { label: 'Percent Discount', value: 'PERCENT_DISCOUNT' },
    { label: 'Flat Discount', value: 'FLAT_DISCOUNT' },
    { label: 'Free Shipping', value: 'FREE_SHIPPING' }
  ];

  discountTypes = [
    { label: 'Percentage', value: 'PERCENTAGE' },
    { label: 'Flat Amount', value: 'FLAT' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: PromotionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /* -------------------- INIT -------------------- */

  ngOnInit(): void {

    this.promotionForm = this.fb.group({

      name: ['', Validators.required],
      description: [''],

      type: ['AUTO'],
      couponCode: [''],

      group: [],

      active: [true],
      stackable: [false],
      priority: [1],
      usageLimit: [],

      startDate: [null, Validators.required],
      endDate: [null, Validators.required],

      conditions: this.fb.array([]),

      action: this.fb.group({
        actionType: [],
        discountType: [],
        value: [0],
        maxDiscount: []
      })
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.promotionId = Number(id);
      this.isEdit = true;
      this.loadPromotion();
    }
  }

   get conditions(): FormArray {
    return this.promotionForm.get('conditions') as FormArray;
  }

  addCondition() {
    this.conditions.push(
      this.fb.group({
        conditionType: ['CART_TOTAL'],
        operator: ['>'],
        value: ['']
      })
    );
  }

  removeCondition(index: number) {
    this.conditions.removeAt(index);
  }

  /* -------------------- LOAD PROMO -------------------- */

  loadPromotion() {

    this.service.getPromotions().subscribe(res => {

      const promo = res.find(p => p.id === this.promotionId);

      if (!promo) return;

      this.promotionForm.patchValue({
        ...promo,
        startDate: new Date(promo.startDate),
        endDate: new Date(promo.endDate)
      });

      if (promo.conditions) {

        promo.conditions.forEach((c: any) => {
          this.conditions.push(this.fb.group(c));
        });

      }

      if (promo.action) {
        this.promotionForm.get('action')?.patchValue(promo.action);
      }
      if (promo.promotionGroup) {
        this.promotionForm.get('group')?.setValue(promo.promotionGroup);
      }

    });

  }

  savePromotion() {

    if (this.promotionForm.invalid) return;

    const v = this.promotionForm.value;

    const payload = {
      ...v,
      startDate: new Date(v.startDate).toISOString(),
      endDate: new Date(v.endDate).toISOString()
    };

    const req = this.isEdit
      ? this.service.updatePromotion(this.promotionId!, payload)
      : this.service.createPromotion(payload);

      console.log('Saving/updating promotion with payload:', payload);
    req.subscribe(() => {
      this.router.navigate(['/admin/promotions']);
    });

  }

  cancel() {
    this.router.navigate(['/admin/promotions']);
  }


getPromotionPreview(): string {

  const f = this.promotionForm?.value;

  if (!f || !f.action || !f.action.actionType) {
    return '';
  }

  let text = '';

  /* ---------------------------
     COUPON / AUTO
  ---------------------------- */

  if (f.type === 'COUPON' && f.couponCode) {
    text += `Use coupon "${f.couponCode}" to `;
  } else {
    text += `Get `;
  }

  /* ---------------------------
     ACTION
  ---------------------------- */

  let actionText = '';

  switch (f.action.actionType) {

    case 'PERCENT_DISCOUNT':

      actionText = `${f.action.value || 0}% discount`;

      if (f.action.maxDiscount) {
        actionText += ` (up to ₹${f.action.maxDiscount})`;
      }

      break;

    case 'FLAT_DISCOUNT':

      actionText = `₹${f.action.value || 0} off`;
      break;

    case 'FREE_SHIPPING':

      actionText = `free shipping`;
      break;

    case 'BUY_X_GET_Y':

      const buy = f.action.buyQty || 0;
      const get = f.action.getQty || 0;

      actionText = `Buy ${buy} get ${get} free`;
      break;

    default:
      actionText = `special offer`;
  }

  text += actionText;

  /* ---------------------------
     CONDITIONS
  ---------------------------- */

  if (Array.isArray(f.conditions) && f.conditions.length > 0) {

    const conditions = f.conditions.map((c: any) => {

      if (!c) return '';

      switch (c.conditionType) {

        case 'CART_TOTAL':
          return `cart value ${this.operatorToText(c.operator)} ₹${c.value}`;

        case 'QUANTITY':
          return `quantity ${this.operatorToText(c.operator)} ${c.value}`;

        case 'CATEGORY':
          return `category items ${this.operatorToText(c.operator)} ${c.value}`;

        case 'PRODUCT':
          return `product ${this.operatorToText(c.operator)} ${c.value}`;

        case 'USER_FIRST_ORDER':
          return `for first order`;

        default:
          return '';
      }

    }).filter(Boolean);

    if (conditions.length > 0) {
      text += ` when ${conditions.join(' and ')}`;
    }
  }

  /* ---------------------------
     DATE RANGE
  ---------------------------- */

  if (f.startDate && f.endDate) {

    const start = new Date(f.startDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });

    const end = new Date(f.endDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });

    text += `. Valid from ${start} to ${end}`;
  }

  /* ---------------------------
     STACKABLE
  ---------------------------- */

  if (f.stackable === true) {
    text += `. Can be combined with other offers`;
  } else if (f.stackable === false) {
    text += `. Cannot be combined with other offers`;
  }

  return this.capitalize(text) + '.';
}

operatorToText(op: string): string {

  switch (op) {

    case '>': return 'greater than';
    case '<': return 'less than';
    case '=': return 'equal to';
    case '>=': return 'at least';
    case '<=': return 'at most';

    default: return op || '';
  }

}

capitalize(text: string): string {

  if (!text) return '';

  return text.charAt(0).toUpperCase() + text.slice(1);

}

}