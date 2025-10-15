import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { Adminorder } from "../admin/adminorder/adminorder";
import { Salestrend } from "./salestrend/salestrend";

@Component({
    selector: 'app-dashboard',
    imports: [Adminorder, Salestrend],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- <app-stats-widget class="contents" /> -->
            <div class="col-span-12 xl:col-span-6">
                <!-- <app-recent-sales-widget /> -->
                 <app-salestrend/>
                 
                <!-- <app-best-selling-widget /> -->
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-adminorder/>
                <!-- <app-notifications-widget /> -->
            </div>
        </div>
    `
})
export class Dashboard {}
