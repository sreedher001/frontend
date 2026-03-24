import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippingruleService } from '../shippingrule.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-shipping-rule-form-component',
  imports: [CommonModule,
  ReactiveFormsModule,InputTextModule,
  InputNumberModule,
  CheckboxModule,
  ButtonModule,
  CardModule],
  templateUrl: './shipping-rule-form-component.html',
  styleUrl: './shipping-rule-form-component.scss'
})
export class ShippingRuleFormComponent implements OnInit {

  id?: number;
form!: FormGroup;
 

  constructor(
    private fb: FormBuilder,
    private service: ShippingruleService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {

    this.form = this.fb.group({
      name: ['', Validators.required],
      minCartValue: [0],
      maxCartValue: [],
      shippingFee: [0],
      freeShipping: [false],
      priority: [1],
      active: [true]
    });

   this.form.get('freeShipping')?.valueChanges.subscribe(v => {
  const fee = this.form.get('shippingFee');

  if (v) {
    fee?.setValue(0);
    fee?.disable();
  } else {
    fee?.enable();
  }
});

// trigger once for edit mode
if (this.form.get('freeShipping')?.value) {
  this.form.get('shippingFee')?.disable();
}

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if(this.id){
      this.service.getById(this.id).subscribe(res => {
        this.form.patchValue(res);
      });
    }

  }

  submit(){

    if(this.id){

      this.service.update(this.id, this.form.value)
        .subscribe(() => this.router.navigate(['/admin/shipping-rules']));

    }else{

      this.service.create(this.form.value)
        .subscribe(() => this.router.navigate(['/admin/shipping-rules']));

    }

  }
}