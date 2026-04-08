import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Products } from './app/pages/products/products';
import { Productdetails } from '@/pages/productdetails/productdetails';
import { Cart } from '@/pages/cart/cart';
import { EditVariant } from '@/pages/edit-variant/edit-variant';
import { Addproduct } from '@/pages/admin/addproduct/addproduct';
import { Signup } from '@/pages/auth/signup/signup';
import { Manageproducts } from '@/pages/admin/manageproducts/manageproducts';
import { Addvariant } from '@/pages/admin/addvariant/addvariant';
import { Checkout } from '@/pages/checkout/checkout';
import { Orderhistory } from '@/pages/orderhistory/orderhistory';
import { Wishlist } from '@/pages/wishlist/wishlist';
import { Adminorder } from '@/pages/admin/adminorder/adminorder';
import { Adminorderdetails } from '@/pages/admin/adminorderdetails/adminorderdetails';
import { Salestrend } from '@/pages/dashboard/salestrend/salestrend';
import { AuthGuard } from 'src/app/security/authguard';
import { LoginGuard } from '@/security/login.guard';
import { Invoice } from '@/pages/admin/invoice/invoice';
import { Invoicelist } from '@/pages/admin/invoicelist/invoicelist';
import { Searchresult } from '@/pages/searchresult/searchresult';
import { Home } from '@/pages/home/home';
import { Orderstatus } from '@/pages/orderstatus/orderstatus';
import { Shiporder } from '@/pages/admin/shiporder/shiporder';
import { Profile } from '@/pages/profile/profile';
import { BannerComponent } from '@/pages/banner/banner';
import { AdminReviewsComponent } from '@/pages/admin/admin-reviews-component/admin-reviews-component';
import { AdminReturns } from '@/pages/admin/admin-returns/admin-returns';
import { AdminReturnDetailComponent } from '@/pages/admin/admin-returns/admin-return-detail-component/admin-return-detail-component';
import { Termsandconditions } from '@/pages/termsandconditions/termsandconditions';
import { ExpenseAnalytics } from '@/pages/admin/expense-analytics/expense-analytics';
import { AdminStockInterest } from '@/pages/admin/admin-stock-interest/admin-stock-interest';
import { MobileCategory } from '@/pages/mobile-category/mobile-category';
import { Promotions } from '@/pages/admin/promotions/promotions';
import { PromotionForm } from '@/pages/admin/promotions/promotion-form/promotion-form';
import { ShippingRules } from '@/pages/admin/shipping-rules/shipping-rules';
import { ShippingRuleFormComponent } from '@/pages/admin/shipping-rules/shipping-rule-form-component/shipping-rule-form-component';
import { ReelComponent } from '@/pages/admin/reel-component/reel-component';
import { Otpauth } from '@/pages/auth/otpauth/otpauth';
import { LoginComponent } from '@/pages/auth/login';
import { OrderSuccessComponent } from '@/pages/order-success-component/order-success-component';
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: 'admin/dashboard', component: Dashboard, canActivate: [AuthGuard] },
            { path: '', component: Products },
            { path: 'products', component: Products },
            { path: 'product-details/:id', component: Productdetails },
            { path: 'admin/products/edit', component: EditVariant, canActivate: [AuthGuard] },
            { path: 'admin/products/add', component: Addproduct, canActivate: [AuthGuard] },
            { path: 'admin/products/addvariant', component: Addvariant, canActivate: [AuthGuard] },
            { path: 'admin/products/manageproducts', component: Manageproducts, canActivate: [AuthGuard] },
            { path: 'cart', component: Cart },
            { path: 'order/order-history', component: Orderhistory },
            { path: 'wishlist', component: Wishlist },
            { path: 'myprofile', component: Profile },
            { path: 'admin/banner', component: BannerComponent },
            { path: 'search', component: Searchresult },
            { path: 'admin/orders', component: Adminorder, canActivate: [AuthGuard] },
            { path: 'admin/invoice', component: Invoice, canActivate: [AuthGuard] },
            { path: 'admin/invoice-list', component: Invoicelist, canActivate: [AuthGuard] },
            { path: 'admin/order-details/:id', component: Adminorderdetails },
            { path: 'admin/expense', component: ExpenseAnalytics },
            { path: 'admin/stock-interest', component: AdminStockInterest },
            { path: 'track/:orderNumber', component: Orderstatus },
            { path: 'admin/sales/trend', component: Salestrend, canActivate: [AuthGuard] },
            { path: 'admin/order/ship/:id', component: Shiporder, canActivate: [AuthGuard] },
            { path: 'checkout', component: Checkout },
            { path: 'auth/signup', component: Signup },
            { path: 'home', component: Home },
            { path: 'admin/reviews', component: AdminReviewsComponent },
            { path: 'admin/returns-view', component: AdminReturns },
            { path: 'order-status', component: Orderstatus },
            { path: 'category', component: MobileCategory },
            { path: 'terms-and-conditions', component: Termsandconditions },
            { path: 'admin/returns/:returnId', component: AdminReturnDetailComponent },
            { path: 'admin/promotions', component: Promotions },
            { path: 'admin/promotions/new', component: PromotionForm },
            { path: 'admin/promotions/edit/:id', component: PromotionForm },
            { path: 'admin/shipping-rules', component: ShippingRules },
            { path: 'admin/shipping-rules/create', component: ShippingRuleFormComponent },
            { path: 'admin/shipping-rules/edit/:id', component: ShippingRuleFormComponent },
            { path: 'admin/reels', component: ReelComponent },
            { path: 'auth/login', component: Otpauth },
            { path: 'auth/signin', component: LoginComponent },
            { path: 'order-placed', component: OrderSuccessComponent},
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            // { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
