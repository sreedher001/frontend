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
export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'products', component: Products },
            { path: 'product-details/:id', component: Productdetails },
            { path: 'admin/products/edit', component: EditVariant},
            { path: 'cart', component: Cart},
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
