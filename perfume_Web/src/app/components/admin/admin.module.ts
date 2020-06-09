import {NgModule} from '@angular/core';
import {
    CommonModule,
    HashLocationStrategy,
    LocationStrategy
} from '@angular/common';
import {
    AppAsideModule,
    AppBreadcrumbModule,
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule
} from '@coreui/angular';
import {
    PerfectScrollbarConfigInterface,
    PerfectScrollbarModule
} from 'ngx-perfect-scrollbar';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {AdminLayoutComponent} from './admin-layout';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {PaginationModule} from "ngx-bootstrap/pagination";
import {ChartsModule} from 'ng2-charts';
import {AdminRoutingModule} from './admin-routing.module';
import {CategoryComponent} from './category/category.component';
import {
    NgbButtonsModule,
    NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductDetailComponent} from './product/detail/product-detail.component';
import {ProductListComponent} from './product/list/product-list.component';
import {ProducerComponent} from './producer/producer.component';
import {AmountComponent} from './amount/amount.component';
import {FragrantComponent} from './fragrant/fragrant.component';
import {CheckoutComponent} from './checkout/checkout.component';

import {CKEditorModule} from '../../../ckeditor/ckeditor.module';
import {CouponComponent} from './coupon/coupon.component';
import {CommentComponent} from './comment/comment.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {UserComponent} from './user/user.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';
import {NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';
import {NewsComponent} from './news/news.component';
import {NewsDetailComponent} from './news/news-detail/news-detail.component';
import { DisplayStaticComponent } from './display-static/display-static.component';
import { ImageComponent } from './image/image.component';
import { AdminFilterProductComponent } from './product/admin-filter-product/admin-filter-product.component';
import {Ng5SliderModule} from 'ng5-slider';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
};

@NgModule({
    imports: [
        ReactiveFormsModule,
        CommonModule,
        AdminRoutingModule,
        AppAsideModule,
        AppBreadcrumbModule.forRoot(),
        AppFooterModule,
        AppHeaderModule,
        AppSidebarModule,
        PerfectScrollbarModule,
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        ChartsModule,
        PaginationModule.forRoot(),
        NgbPaginationModule,
        FormsModule,
        CollapseModule,
        NgbButtonsModule,
        CKEditorModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        NgMultiSelectDropDownModule.forRoot(),
        Ng5SliderModule,
    ],
    declarations: [
        AdminLayoutComponent,
        CategoryComponent,
        ProductDetailComponent,
        ProductListComponent,
        ProducerComponent,
        AmountComponent,
        FragrantComponent,
        CheckoutComponent,
        CouponComponent,
        CommentComponent,
        UserComponent,
        UserDetailComponent,
        NewsComponent,
        NewsDetailComponent,
        DisplayStaticComponent,
        ImageComponent,
        AdminFilterProductComponent
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: HashLocationStrategy
        }
    ],
    bootstrap: [AdminLayoutComponent],
    exports: []
})
export class AdminModule {
}
