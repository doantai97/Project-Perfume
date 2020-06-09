import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from '@angular/router';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {CONSTANT_PATH} from '../../../comom/constant/base.constant';
import {Product, ProductSearch} from '../../../model/product.model';
import {ProductService} from '../../../service/product.service';
import {SERVER_API_URL, SERVER_URL} from '../../../app.constants';
import {CartService} from 'src/app/service/cart.service';
import {AuthenticationService} from 'src/app/service/authentication.service';
import {Category} from '../../../model/category.model';
import {CategoryService} from '../../../service/category.service';

@Component({
    selector: 'app-list-product',
    templateUrl: './list-product.component.html',
    styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {
    paging: IPaging;
    CONSTANT_PATH = CONSTANT_PATH;
    categoryCode;
    products: Array<Product>;
    SERVER_URL = SERVER_URL;
    quantity = 1;
    filterProduct: ProductSearch = {};
    category: Category;

    constructor(
        private activatedRoute: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private categoryService: CategoryService
    ) {
        // this.categoryCode = this.activatedRoute.snapshot.paramMap.get('category');


        this.activatedRoute.paramMap.subscribe(param => {
            this.categoryCode = param.get('category');
            this.paging = new Paging();
            this.paging.limit = 12;
            this.categoryService.filterAll({
                code: this.categoryCode
            }).subscribe(res => {
                console.log(res.body);
                if (res.status === 200 && res.body.length > 0) {
                    this.category = res.body[0];
                } else {
                    this.router.navigate(['/404']);
                }

            });
            this.loadAll();
        });
    }

    ngOnInit(): void {

    }

    loadAll() {
        this.filterProduct.categoryCode = this.categoryCode;
        console.log(this.filterProduct);
        // this.filterProduct = {};
        this.productService.filter(this.paging, this.filterProduct).subscribe(res => {
            this.products = res.body.data;
            this.paging.total = res.body.paging.total;
            // this.paging.offset = res.body.paging.offset;
        });
    }

    loadPage(page: number) {
        if (page !== this.paging.previousPage) {
            this.paging.previousPage = page;
            this.loadAll();
        }
    }

    filter($event) {
        this.filterProduct = $event;
        this.loadAll();
    }


}
