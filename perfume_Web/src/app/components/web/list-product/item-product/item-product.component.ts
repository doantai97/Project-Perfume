import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../../model/product.model';
import {AuthenticationService} from '../../../../service/authentication.service';
import {CartService} from '../../../../service/cart.service';
import {Version} from '../../../../model/version.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../service/product.service';
import {CommentService} from '../../../../service/comment.service';
import {SERVER_API_IMAGE} from '../../../../app.constants';
import {CONSTANT_PATH, formatCurency} from '../../../../comom/constant/base.constant';

@Component({
    selector: 'app-item-product',
    templateUrl: './item-product.component.html',
    styleUrls: ['./item-product.component.scss']
})
export class ItemProductComponent implements OnInit {
    quantity = 1;
    versionSelect: Version;
    SERVER_API_IMAGE = SERVER_API_IMAGE;
    CONSTANT_PATH = CONSTANT_PATH;
    isNew = false;
    isHot = false;

    formatMoney(money) {
        return formatCurency(money);
    }

    constructor(private activatedRoute: ActivatedRoute,
                private productService: ProductService,
                private cartService: CartService,
                private authenticationService: AuthenticationService,
                private commentService: CommentService,
                private router: Router) {
    }

    @Input()
    product: Product;

    ngOnInit(): void {
        this.product?.versions?.some(value => {
            if (value.total > 0) {
                this.versionSelect = value;
                return true;
            }
        });

        if (this.product?.highlights) {
            this.isHot = this.product.highlights.some(value => {
                if (value === 'HOT') {
                    return true;
                }
            });

            this.isNew = this.product.highlights.some(value => {
                if (value === 'NEW') {
                    return true;
                }
            });
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

}
