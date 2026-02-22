import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ExpenseAnalyticsService } from './expense-analytics-service';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-expense-analytics',
  imports: [ ChartModule,
     DatePickerModule,FormsModule,FloatLabelModule,TableModule,TagModule,
    CardModule,
    ButtonModule],
  templateUrl: './expense-analytics.html',
  styleUrl: './expense-analytics.scss'
})
export class ExpenseAnalytics implements OnInit {

  startDate: Date = new Date();
endDate:Date = new Date();
maxDate: Date = new Date();

expenses: any[] = [];
totalExpenses = 0;
pageSize = 10;
loading = false;
  dateRange: Date[] = [];

  summary: any;

  categoryChart: any;
  paymentChart: any;
  monthlyChart: any;

  constructor(private service: ExpenseAnalyticsService) {}
ngOnInit(): void {
  const today = new Date();
  this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    this.loadData(this.startDate, this.endDate);
  }

  loadData(startDate: Date, endDate: Date) {
    this.loading=true;
  


  const start = this.formatLocalDate(startDate);
  const end = this.formatLocalDate(endDate);
    this.service.getSummary(start, end)
    
      .subscribe((res:any) => this.summary = res);

    this.service.getCategory(start, end)
      .subscribe((res:any) => {
        this.categoryChart = {
          labels: res.map((r:any) => r.category),
          datasets: [{
            data: res.map((r:any) => r.totalAmount)
          }]
        };
      });

    this.service.getPayment(start, end)
      .subscribe((res:any) => {
        this.paymentChart = {
          labels: res.map((r:any) => r.paymentMethod),
          datasets: [{
            data: res.map((r:any) => r.totalAmount)
          }]
        };
      });

    this.service.getMonthly(start, end)
      .subscribe((res:any) => {
        this.monthlyChart = {
          labels: res.map((r:any) => r.month + '/' + r.year),
          datasets: [{
            label: 'Monthly Expense',
            data: res.map((r:any) => r.totalAmount),
            fill: false,
            tension: 0.4
          }]
        };
      });
  }

  formatLocalDate(date: Date): string {
  return new Intl.DateTimeFormat('en-CA').format(date);
}
}
