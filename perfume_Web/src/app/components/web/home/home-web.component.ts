import {Component, OnInit} from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {Product, ProductSearch} from '../../../model/product.model';
import {ProductService} from '../../../service/product.service';
import {CONSTANT_PATH, HIGHLIGHT} from '../../../comom/constant/base.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {SERVER_URL} from '../../../app.constants';
import {CartService} from '../../../service/cart.service';
import {AuthenticationService} from '../../../service/authentication.service';

@Component({
    selector: 'app-home',
    templateUrl: './home-web.component.html',
    styleUrls: ['./home-web.component.scss'],
})
export class HomeWebComponent implements OnInit {
    images = [1055, 194, 368].map((n) => `https://picsum.photos/id/${n}/900/500`);
    productViews: Array<ProductView> = [];
    CONSTANT_PATH = CONSTANT_PATH;
    productHots: Product[] = [];
    productNews: Product[] = [];
    productTopSold: Product[] = [];
    SERVER_URL = SERVER_URL;

    constructor(config: NgbCarouselConfig,
                public productService: ProductService,
                private route: ActivatedRoute,
                private cartService: CartService,
                private authenticationService: AuthenticationService,
                private router: Router,
    ) {
        config.interval = 10000;
        config.wrap = false;
        config.keyboard = false;
        config.pauseOnHover = false;
    }

    ngOnInit(): void {
        this.productViews = [];
        this.productViews.push({
            title: 'test',
            products: []
        });

        this.loadAll();
    }

    loadAll() {
        this.loadProductNew();
        this.loadProductHot();
        this.loadProductTopSold();
    }

    loadProductNew() {
        this.productService.filter({
            limit: 8,
            page: 1
        }, {highlights: [HIGHLIGHT.NEW]}).subscribe(res => {
            this.productNews = res.body.data;
        });
    }

    loadProductTopSold() {
        this.productService.filter({
            limit: 8,
            page: 1
        }, {
            oderBy: {
                name: 'countCheckoutItem',
                type: 'desc'
            }
        }).subscribe(res => {
            this.productTopSold = res.body.data;
        });
    }

    loadProductHot() {
        this.productService.filter({
            limit: 8,
            page: 1
        }, {highlights: [HIGHLIGHT.HOT]}).subscribe(res => {
            this.productHots = res.body.data;
        });
    }

    addCartItem(idVersion, buyNow = false) {
        if (idVersion) {
            if (this.authenticationService.currentUserValue) {
                const user = this.authenticationService.currentUserValue.user;
                this.cartService
                    .create({
                        user: user,
                        version: {
                            id: idVersion
                        }
                    })
                    .subscribe(res => {
                        this.cartService.findByUserLogin(user.id).subscribe(res1 => {

                        });
                        if (buyNow) {
                            this.router.navigate(['/cart']);
                        }
                    });
            } else {
                alert(' bạn chưa đăng nhập vui lòng đăng nhập ');
            }
        } else {
            alert(' Hết Hàng ');
        }
    }

}


interface ProductView {
    title: string;
    products: Array<Product>;
}
