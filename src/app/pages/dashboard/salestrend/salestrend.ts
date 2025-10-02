import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../dashboard.service';
import { FormsModule } from '@angular/forms';
import { Fluid } from "primeng/fluid";

@Component({
  selector: 'app-salestrend',
  imports: [ChartModule, CommonModule, AutoCompleteModule, FormsModule],
  templateUrl: './salestrend.html',
  styleUrl: './salestrend.scss'
})
export class Salestrend implements OnInit{

   viewModes = ['Daily', 'Monthly', 'Yearly'];
  filteredViews: string[] = [];

  selectedView: string = 'Daily';

  chartData: any;
  chartOptions: any;
  summary = {
    total: 0,
    growth: 0,
    bestPeriod: '',
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.fetchSalesData();
  }

  filterViewModes(event: any) {
    const query = event.query.toLowerCase();
    this.filteredViews = this.viewModes.filter(mode =>
      mode.toLowerCase().includes(query)
    );
  }

  fetchSalesData() {
  const view = this.selectedView.toUpperCase();

  this.dashboardService.getSalesTrend(view).subscribe((data: any) => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');
    const accentColor = documentStyle.getPropertyValue('--p-primary-500') || '#4f46e5';

    this.chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Sales',
          data: data.values,
          fill: true,
          borderColor: accentColor,
          backgroundColor: this.hexToRgba(accentColor, 0.2),
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: accentColor,
          pointBorderColor: '#fff',
          borderWidth: 2
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#ffffff',
          titleColor: '#000000',
          bodyColor: '#000000',
          borderColor: surfaceBorder,
          borderWidth: 1
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          },
          title: {
            display: true,
            text: this.selectedView,
            color: textColor
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1000,
            color: textColorSecondary,
            callback: function (value: number) {
              return '₹' + value.toLocaleString();
            }
          },
          grid: {
            color: surfaceBorder
          },
          title: {
            display: true,
            text: 'Sales (₹)',
            color: textColor
          },
          suggestedMax: this.getSuggestedMax(data.values)
        }
      }
    };

    this.summary = {
      total: data.values.reduce((a: any, b: any) => a + b, 0),
      growth: data.growth,
      bestPeriod: data.bestPeriod
    };
  });
}

  getSuggestedMax(data: number[]): number {
  const max = Math.max(...data);
  return Math.ceil(max * 1.2 / 1000) * 1000; // Round up to nearest 1000
}

hexToRgba(hex: string, alpha: number): string {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

}
