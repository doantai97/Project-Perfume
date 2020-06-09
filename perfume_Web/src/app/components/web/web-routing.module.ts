import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeWebComponent} from './home/home-web.component';
import {AboutComponent} from './about/about.component';
import {AuthGuard} from '../../comom/auth/auth.guard';
import {CartComponent} from './cart/cart.component';
import {LoginComponent} from './login/login.component';
import {ListProductComponent} from './list-product/list-product.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {WebComponent} from './web.component';
import {DetailProductComponent} from './detail-product/detail-product.component';
import {CONSTANT_PATH} from './../../comom/constant/base.constant';
import {CheckoutComponent} from './checkout/checkout.component';
import {RegisterComponent} from '../web/register/register.component';
import {BlogComponent} from './blog/blog.component';
import {ContactComponent} from './contact/contact.component';
import {PermissionComponent} from './permission/permission.component';
import {Paging} from '../../model/base-respone.model';
import {BlogSingleComponent} from './blog-single/blog-single.component';
import {ConfirmAccountComponent} from './confirm-account/confirm-account.component';

const routes: Routes = [

    {
        path: '',
        component: WebComponent,
        children: [
            {
                path: CONSTANT_PATH.HOME,
                component: HomeWebComponent,

            },

            {
                path: '',
                redirectTo: CONSTANT_PATH.HOME,
                pathMatch: 'full'
            },
            {
                path: 'confirm-account',
                component: ConfirmAccountComponent,
            },
            {
                path: CONSTANT_PATH.ABOUT,
                component: AboutComponent,
            },
            {
                path: CONSTANT_PATH.CART,
                component: CartComponent,
                canActivate: [AuthGuard]
            },
            {
                path: CONSTANT_PATH.CHECKOUT,
                component: CheckoutComponent,
                canActivate: [AuthGuard]
            },
            {
                path: CONSTANT_PATH.LOGIN,
                component: LoginComponent
            },
            {
                path: CONSTANT_PATH.REGISTER,
                component: RegisterComponent
            },
            {
                path: CONSTANT_PATH.BLOG,
                component: BlogComponent,
            },
            {
                path: CONSTANT_PATH.BLOG + '/:url',
                component: BlogSingleComponent,
            },
            {
                path: CONSTANT_PATH.CONTACT,
                component: ContactComponent
            },
            {
                path: CONSTANT_PATH.LIST_PRODUCT + '/:category',
                component: ListProductComponent
            },
            {
                path: CONSTANT_PATH.DETAIL_PRODUCT + '/:code',
                component: DetailProductComponent
            },
            {
                path: '404',
                component: NotFoundComponent
            },
            {
                path: '403',
                component: PermissionComponent
            },
            {
                path: '**',
                redirectTo: '404',
                pathMatch: 'full'
            },
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WebRoutingModule {
}
