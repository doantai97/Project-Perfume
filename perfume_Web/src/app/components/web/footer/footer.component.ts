import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../service/authentication.service';
import {CartService} from '../../../service/cart.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../../../service/category.service';
import {UserService} from '../../../service/user.service';
import {FormBuilder} from '@angular/forms';
import {Category} from '../../../model/category.model';
import {CONSTANT_PATH, getImg} from './../../../comom/constant/base.constant';
import {Product, ProductSearch} from '../../../model/product.model';
import {ProductService} from '../../../service/product.service';
import {IPaging} from '../../../model/base-respone.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    categories: Array<Category>;
    CONSTANT_PATH = CONSTANT_PATH;
    products: Array<Product>;

    isShow = true;


    constructor(public authenticationService: AuthenticationService, private cartService: CartService,
                private modalService: NgbModal,
                private categoryService: CategoryService,
                private userService: UserService,
                private productService: ProductService,
                private fb: FormBuilder,
                private router: Router) {

        this.router.events.subscribe(value => {
            if (this.router.url.indexOf('login') >= 0) {
                this.isShow = false;
            } else {
                this.isShow = true;
            }
        });

    }

    ngOnInit(): void {

        this.categoryService.filterAll().subscribe(res => {
            this.categories = res.body;
        });
        const productSearch: ProductSearch = {
            oderBy: {name: 'random', type: null}
        };
        const paging: IPaging = {
            page: 1,
            total: 0,
            offset: 0,
            limit: 6
        };
        this.productService.filter(paging, productSearch).subscribe(res => {
            this.products = res.body.data;
        });

    }

    goToTop() {
        window.scroll(0, 0);
    }

    getImage(url) {
        return getImg(url);
    }

    redirectTo(uri:string){
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate([uri]));
    }

}
