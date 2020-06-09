import {Component, OnInit} from '@angular/core';
import {Checkout} from '../../../model/checkout.model';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGING_PER_PAGE} from '../../../comom/constant/base.constant';
import {CheckoutService} from '../../../service/checkout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {xoaDau} from '../../../comom/utils/base.utils';
import {CHECKOUT_STATUS, PAYMENT_METHOD} from '../../../comom/constant/checkout.constant';
import {__param} from 'tslib';
import {AddressService} from '../../../service/address.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {User} from '../../../model/user';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

    checkouts: Checkout[] = [];
    paging: IPaging = new Paging();
    checkoutFormGroup: FormGroup;
    selectedCheckout: Checkout;
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;
    isCustomUri = true;
    checkoutStatus: number;
    nodeDelete;
    userLogin: User;

    constructor(public checkoutService: CheckoutService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private addressService: AddressService,
                public authenticationService: AuthenticationService,
                private fb: FormBuilder) {
        this.authenticationService.currentUser.subscribe(value => {
            if (value) {
                this.userLogin = value.user;
                this.loadAll();
            } else {
                this.userLogin = null;
            }
        });
    }

    getStatus(statusName: string) {
        let rs = null;
        const keys = Object.keys(CHECKOUT_STATUS);
        keys.some(value => {
            if (value.toLowerCase() === statusName) {
                rs = CHECKOUT_STATUS[value];
                return true;
            }
        });
        console.log(rs);
        return rs;
    }


    ngOnInit(): void {
        this.initTable();
    }


    initTable() {
        this.checkoutFormGroup = this.initForm();
    }

    initForm() {
        return this.fb.group({
            id: [],
            name: ['', [
                Validators.required,
                Validators.minLength(5),
                Validators.maxLength(100)]
            ],
            code: ['', [Validators.required, Validators.minLength(8),
                Validators.required, Validators.maxLength(100)
            ]
            ],
            isUpdate: [true],
            isShow: [false]
        });
    }

    search() {
        this.paging.page = 1;
        this.loadAll();
    }

    loadAll() {
        console.log('loadAll');
        // const parameters = {
        //     page: this.paging.page,
        //     limit: this.paging.limit
        // };
        const checkout: Checkout = {};
        checkout.user = {id: this.userLogin.id};
        this.checkoutService.filter(this.paging, checkout).subscribe(res => {
            if (res.status === 200) {
                this.checkouts = res.body.data;

                this.checkouts.forEach(value => {
                    this.addressService.findAllByWard(value.wardId).subscribe(resAddress => {
                        value.address1 = resAddress.body;
                    });
                });

                console.log(res.body.paging);
                console.log(this.checkouts);
                this.paging.offset = res.body.paging.offset;
                this.paging.total = res.body.paging.total;
            } else {
                console.warn('can not load mail sender');
            }
        });
    }

    loadPage(page: number) {
        if (page !== this.paging.previousPage) {
            this.paging.previousPage = page;
            this.loadAll();
        }
    }

    focusoutName() {
        if (this.isCustomUri) {
            const name: string = this.checkoutFormGroup.get('name').value;
            this.checkoutFormGroup.get('code').setValue(xoaDau(name));
        }
    }

    paymentMethod(checkout: Checkout) {
        let rs = 'Không xác định';
        Object.keys(PAYMENT_METHOD).some(value => {
            if (PAYMENT_METHOD[value].value === checkout.paymentMethod) {
                rs = PAYMENT_METHOD[value].label;
                return true;
            }
        });
        return rs;
    }

    addressTrue(checkout: Checkout) {
        let rs = '';
        if (checkout.address1) {
            rs += `${checkout.address1.ward.prefix} ${checkout.address1.ward.name}, `;
            rs += `${checkout.address1.district.prefix} ${checkout.address1.district.name}, `;
            rs += `${checkout.address1.province.name}`;
        }
        return rs;
    }

    remove(modal, checkout: Checkout) {
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            backdrop: 'static'
        }).result.then((result) => {
            if (result === 'delete') {
                console.log('delete');
                console.log(this.selectedCheckout);
                if (checkout.id) {
                    const tmp: Checkout = {
                        id: checkout.id,
                        status: CHECKOUT_STATUS.DELETED,
                        note: this.nodeDelete
                    };
                    this.checkoutService.update(tmp).subscribe(res => {
                        // control.removeAt(index);
                        if (res.status === 200) {
                            if ((this.paging.offset + this.checkouts.length) - this.paging.offset === 1 && this.paging.page !== 1) {
                                this.paging.page = this.paging.page - 1;
                                this.loadAll();
                            } else {
                                this.loadAll();
                            }
                        }
                    });
                } else {
                }
            }
        }, (reason) => {
        });
    }

    openViewCertPopup(modal, checkout) {
        this.selectedCheckout = checkout;
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            backdrop: 'static'
        }).result.then((result) => {
        }, (reason) => {
        });
    }

    changeLimit() {
        this.paging.page = 1;
        this.loadAll();
    }

    pagingInfo = (paging) => {
        return `Show ${paging.offset + 1} to ${(paging.offset + this.checkouts.length)} of ${paging.total} entries`;
    };


}
