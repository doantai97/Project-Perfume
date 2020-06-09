import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AdminLayoutComponent} from './admin-layout';
import {CategoryComponent} from './category/category.component';
import {ProductListComponent} from './product/list/product-list.component';
import {ProductDetailComponent} from './product/detail/product-detail.component';
import {ProducerComponent} from './producer/producer.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {FragrantComponent} from './fragrant/fragrant.component';
import {AmountComponent} from './amount/amount.component';
import {CommentComponent} from './comment/comment.component';
import {CouponComponent} from './coupon/coupon.component';
import {UserComponent} from './user/user.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';
import {AuthManagerGuard} from '../../comom/auth/authManager.guard';
import {AuthAdminGuard} from '../../comom/auth/authAdmin.guard';
import {NewsComponent} from './news/news.component';
import {NewsDetailComponent} from './news/news-detail/news-detail.component';
import {DisplayStaticComponent} from './display-static/display-static.component';
import {ImageComponent} from './image/image.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: 'display-static',
                component: DisplayStaticComponent,
                canActivate: [AuthAdminGuard],
            },
            {
                path: 'album',
                component: ImageComponent,
            },
            {
                path: 'category',
                component: CategoryComponent,
            },
            {
                path: 'product',
                component: ProductListComponent,
            },
            {
                path: 'user',
                component: UserComponent,
                canActivate: [AuthAdminGuard],
            },
            {
                path: 'news',
                component: NewsComponent,
            },
            {
                path: 'news/add',
                component: NewsDetailComponent,
            },
            {
                path: 'news/edit/:id',
                component: NewsDetailComponent,
            },
            {
                path: 'user/add',
                component: UserDetailComponent,
                canActivate: [AuthAdminGuard],
            },
            {
                path: 'user/edit/:id',
                component: UserDetailComponent,
                canActivate: [AuthAdminGuard],
            },
            {
                path: 'product/add',
                component: ProductDetailComponent,
            },
            {
                path: 'product/edit/:id',
                component: ProductDetailComponent,
            },
            {
                path: 'producer',
                component: ProducerComponent,
            },
            {
                path: 'fragrant',
                component: FragrantComponent,
            },
            {
                path: 'amount',
                component: AmountComponent,
            },
            {
                path: 'coupon',
                component: CouponComponent,
                canActivate: [AuthAdminGuard],
            },
            {
                path: 'checkout/:status',
                component: CheckoutComponent,
            },
            {
                path: 'comment/:type/:postId',
                component: CommentComponent,
            },
            {
                path: 'base',
                loadChildren: () =>
                    import('./base/base.module').then((m) => m.BaseModule),
            },
            {
                path: 'buttons',
                loadChildren: () =>
                    import('./buttons/buttons.module').then((m) => m.ButtonsModule),
            },
            {
                path: 'charts',
                loadChildren: () =>
                    import('./chartjs/chartjs.module').then((m) => m.ChartJSModule),
            },
            {
                path: 'dashboard',
                loadChildren: () =>
                    import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
            },
            {
                path: 'icons',
                loadChildren: () =>
                    import('./icons/icons.module').then((m) => m.IconsModule),
            },
            {
                path: 'notifications',
                loadChildren: () =>
                    import('./notifications/notifications.module').then(
                        (m) => m.NotificationsModule
                    ),
            },
            {
                path: 'theme',
                loadChildren: () =>
                    import('./theme/theme.module').then((m) => m.ThemeModule),
            },
            {
                path: 'widgets',
                loadChildren: () =>
                    import('./widgets/widgets.module').then((m) => m.WidgetsModule),
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
