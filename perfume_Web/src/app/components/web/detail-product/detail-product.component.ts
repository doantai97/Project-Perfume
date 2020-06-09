import {Component, OnInit} from '@angular/core';
import {COMMENT_TYPE, CONSTANT_PATH, getImg} from '../../../comom/constant/base.constant';
import {ActivatedRoute, Router} from '@angular/router';
import {Product} from '../../../model/product.model';
import {ProductService} from '../../../service/product.service';
import {Version} from '../../../model/version.model';
import {SERVER_URL} from '../../../app.constants';
import {CartService} from '../../../service/cart.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {CommentService} from '../../../service/comment.service';
import {Comment} from '../../../model/comment.model';

@Component({
    selector: 'app-detail-product',
    templateUrl: './detail-product.component.html',
    styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit {

    CONSTANT_PATH = CONSTANT_PATH;
    product: Product;
    versionSelect: Version;
    quantity = 1;
    SERVER_URL = SERVER_URL;
    contentComment: string;
    COMMENT_TYPE = COMMENT_TYPE;

    comments: Comment[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private authenticationService: AuthenticationService,
        private commentService: CommentService,
        private router: Router
    ) {
        this.activatedRoute.paramMap.subscribe(param => {
            const code = param.get('code');
            this.productService.filterAll({code: code}).subscribe(res => {
                if (res.status === 200 && res.body.length > 0) {
                    this.product = res.body[0];
                    this.versionSelect = this.product.versions[0];
                } else {
                    this.product = null;
                    this.router.navigate(['404']);
                }
            });
        });
    }

    ngOnInit(): void {

    }

    downQuantity() {
        if (this.quantity <= 1) {
            this.quantity = 1;
        } else {
            this.quantity--;
        }
    }

    upQuantity() {
        this.quantity++;
    }

    changeQuantity() {
        if (this.quantity <= 1) {
            this.quantity = 1;
        }
    }


    addCartItem(buyNow = false) {
        if (this.authenticationService.currentUserValue) {
            const user = this.authenticationService.currentUserValue.user;
            this.cartService
                .create({
                    user: user,
                    version: {
                        id: this.versionSelect.id,
                    },
                    quantity: this.quantity
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
    }

    getImg(img) {
        return getImg(img);
    }


}
