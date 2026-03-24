import { Component, OnInit } from '@angular/core';
import { ShippingRule } from './shipping-rule.model';
import { ShippingruleService } from './shippingrule.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-shipping-rules',
  imports: [TableModule,ButtonModule,TagModule],
  templateUrl: './shipping-rules.html',
  styleUrl: './shipping-rules.scss'
})
export class ShippingRules implements OnInit {

  rules: ShippingRule[] = [];

  constructor(
    private service: ShippingruleService,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.rules = res;
    });
  }

  create() {
    this.router.navigate(['/admin/shipping-rules/create']);
  }

  edit(id: number) {
    this.router.navigate(['/admin/shipping-rules/edit', id]);
  }

  delete(id: number) {
    if(confirm('Delete this rule?')){
      this.service.delete(id).subscribe(() => this.load());
    }
  }
}
