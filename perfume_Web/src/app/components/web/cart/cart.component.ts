import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CartService} from '../../../service/cart.service';
import {CouponService} from '../../../service/coupon.service';
import {Cart} from '../../../model/cart.model';
import {ProductService} from '../../../service/product.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {User} from '../../../model/user';
import {SERVER_API_IMAGE, SERVER_API_URL, SERVER_URL} from '../../../app.constants';
import {District, Province, Ward} from '../../../model/address.model';
import {AddressService} from '../../../service/address.service';
import validate = WebAssembly.validate;
import {CheckoutService} from '../../../service/checkout.service';
import {PAYMENT_METHOD} from '../../../comom/constant/checkout.constant';
import {Checkout} from '../../../model/checkout.model';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    checkoutForm: FormGroup;
    cartItems: Cart[] = [];
    userLogin: User;
    SERVER_URL = SERVER_URL;
    PAYMENT_METHOD = PAYMENT_METHOD;
    wards: Ward[] = [];
    districts: District[] = [];
    provinces: Province[] = [];
    coupon;
    percent = 0;
    invalidCoupon = false;
    objectKeys = Object.keys;

    constructor(
        private fb: FormBuilder, private cartService: CartService, private productService: ProductService,
        private authenticationService: AuthenticationService,
        private addressService: AddressService,
        private checkoutService: CheckoutService,
        private couponService: CouponService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this.userLogin = this.authenticationService.currentUserValue.user;
        console.log(this.userLogin);
        this.checkoutForm = this.fb.group({
            firstname: [this.userLogin?.firstname, [Validators.required]],
            lastname: [this.userLogin?.lastname, [Validators.required]],
            address: [this.userLogin?.address, [Validators.required]],
            email: [this.userLogin?.email, [Validators.required]],
            phone: [this.userLogin?.phone, [Validators.required]],
            coupon: [null],
            provinceId: [null, [Validators.required]],
            districtId: [null, [Validators.required]],
            wardId: [null, [Validators.required]],
            paymentMethod: [null, [Validators.required]],
        });
        console.log(this.checkoutForm.value);
        this.loadAll();
        this.loadProvinces();
    }

    loadProvinces() {
        this.addressService.findProvince().subscribe(res => {
            this.provinces = res.body;
        });
    }

    loadDistricts() {
        this.checkoutForm.get('districtId').setValue(null);
        this.checkoutForm.get('wardId').setValue(null);
        if (this.checkoutForm.get('provinceId').value) {
            this.addressService.findDistrict(this.checkoutForm.get('provinceId').value).subscribe(res => {
                this.districts = res.body;
            });
        }
    }

    loadWards() {
        this.checkoutForm.get('wardId').setValue(null);
        if (this.checkoutForm.get('districtId').value) {
            this.addressService.findWard(this.checkoutForm.get('districtId').value).subscribe(res => {
                this.wards = res.body;
            });
        }
    }


    loadAll() {
        this.cartService.filterAll({userId: this.userLogin.id}).subscribe(res => {
            this.cartItems = res.body;
            this.cartService.setCartItem(this.cartItems);
            this.cartService.setCartItem(this.cartItems);
            this.cartItems.forEach(value => {
                this.productService.filterAll({
                    versionId: value.version.id
                }).subscribe(resProduct => {
                    value.version.product = resProduct.body[0];
                });
            });

        });
    }

    removeCartItem(id) {
        this.cartService.delete(id).subscribe(res => {
            this.loadAll();
        });
    }

    getUrlBackground(image) {
        const rs = `${SERVER_API_IMAGE}${image}`;
        return rs;
    }

    get subtotal() {
        let rs = 0;
        this.cartItems.forEach(item => {
            rs += item.version.price * item.quantity;
        });
        return rs;
    }

    get total() {
        const rs = this.subtotal * (100 - this.percent) / 100;
        return rs;
    }

    addCheckout() {
        console.log(this.checkoutForm.value);
        const codeCoupon = this.checkoutForm.get('coupon').value;
        const checkout: Checkout = this.checkoutForm.value;
        checkout.total = this.subtotal;
        checkout.finalprice = this.total;
        if (codeCoupon) {
            checkout.coupon = {
                code: codeCoupon
            };
        } else {
            checkout.coupon = null;
        }
        console.log(checkout);
        this.checkoutService.create(checkout).subscribe(res => {
            console.log(res.body);
            if (res.body.status === 200) {
                alert('Thành công! Vui lòng check mail ');
                this.cartService.setCartItem([]);
                this.router.navigate(['/checkout']);
            } else {
                alert(res.body.msg);
            }

        });
    }

    checkCoupon() {
        const code = this.checkoutForm.value.coupon;
        this.couponService.filterAll({code}).subscribe(res => {
            if (res.body.length > 0) {
                this.percent = res.body[0].percent;
                this.invalidCoupon = false;
            } else {
                this.percent = 0;
                this.invalidCoupon = true;
            }
        });
    }
}
