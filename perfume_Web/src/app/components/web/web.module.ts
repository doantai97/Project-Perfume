import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeWebComponent} from './home/home-web.component';
import {WebRoutingModule} from './web-routing.module';
import {Ng5SliderModule} from 'ng5-slider';
import {NgbCarousel, NgbCarouselModule, NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {WebComponent} from './web.component';
import {HeaderComponent} from './header/header.component';
import {AboutComponent} from './about/about.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {FooterComponent} from './footer/footer.component';
import {ListProductComponent} from './list-product/list-product.component';
import {DetailProductComponent} from './detail-product/detail-product.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {LoginComponent} from './login/login.component';
import {AlertComponent} from '../alert/alert.component';
import {FilterComponent} from './list-product/filter/filter.component';
import {BlogComponent} from './blog/blog.component';
import {RegisterComponent} from './register/register.component';
import {ContactComponent} from './contact/contact.component';
import {BlogSingleComponent} from './blog-single/blog-single.component';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {PermissionComponentComponent} from './permission-component/permission-component.component';
import {PermissionComponent} from './permission/permission.component';
import {ShowCommentComponent} from './comment/show-comment.component';
import {ItemProductComponent} from './list-product/item-product/item-product.component';
import {SafeHtmlPipe} from '../../comom/constant/safe-html.pipe';
import { CarouselMultipleComponent } from './carousel-multiple/carousel-multiple.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        WebRoutingModule,
        ReactiveFormsModule,
        Ng5SliderModule,
        NgbModule,
        NgbPaginationModule,
        NgbCarouselModule,
        CollapseModule,
    ],
    declarations: [
        WebComponent,
        HeaderComponent,
        AboutComponent,
        NotFoundComponent,
        FooterComponent,
        ListProductComponent,
        DetailProductComponent,
        CartComponent,
        CheckoutComponent,
        LoginComponent,
        AlertComponent,
        FilterComponent,
        BlogComponent,
        RegisterComponent,
        ContactComponent,
        BlogSingleComponent,
        PermissionComponentComponent,
        PermissionComponent,
        HomeWebComponent,
        ShowCommentComponent,
        ItemProductComponent,
        SafeHtmlPipe,
        CarouselMultipleComponent,
        ConfirmAccountComponent
    ],
    exports: [FilterComponent],
    bootstrap: []
})
export class WebModule {
}
