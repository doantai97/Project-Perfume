import {Component, OnInit} from '@angular/core';
import {Coupon} from '../../../model/coupon.model';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGING_PER_PAGE} from '../../../comom/constant/base.constant';
import {CouponService} from '../../../service/coupon.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-coupon',
    templateUrl: './coupon.component.html',
    styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit {
    coupons: Coupon[];
    public entitySelected: Coupon;
    paging: IPaging;
    couponFormGroup: FormGroup;
    selectedCoupon: Coupon;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;
    validateCode = false;

    constructor(
        public couponService: CouponService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.coupons = [];
        this.initTable();
    }

    initTable() {
        this.couponFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [null],
            startDate: [null, [Validators.required]],
            endDate: [null, [Validators.required]],
            code: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]{3,15}$')]],
            total: [0, [Validators.required, Validators.min(1)]],
            percent: [0, [Validators.required, Validators.min(1), Validators.max(100)]],
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
        const parameters = {
            page: this.paging.page,
            limit: this.paging.limit
        };
        this.couponService.query(parameters).subscribe(res => {
            if (res.status === 200) {
                this.coupons = res.body.data.map(value => {
                    value.endDate = new Date(value.endDate);
                    value.startDate = new Date(value.startDate);
                    value.statusDate = this.statusDateCoupon(value);
                    return value;
                });
                console.log(res.body.paging);
                console.log(this.coupons);
                // this.paging = res.body.paging;
                // this.paging.limit = res.body.paging.limit;
                // this.paging.offset = res.body.paging.offset;
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

    isCodeValidate() {
        if (this.couponFormGroup.get('code').valid) {
            this.couponService.validateCode(this.couponFormGroup.get('code').value).subscribe(res => {
                if (res.status === 200) {
                    this.validateCode = false;
                } else if (res.status < 300) {
                    this.validateCode = true;
                } else {
                    alert('Lỗi hệ thống vui lòng liên hệ với nhà phát triển');
                }
            });
        } else {
            this.validateCode = false;
        }

    }

    // transition() {
    //   const parameters = {
    //     offset: this.paging.offset - 1,
    //     limit: this.paging.limit
    //   }`
    //   if (this.order.orderBy) {
    //     parameters['orderBy'] = this.order.orderBy;
    //     parameters['orderType'] = this.order.getOrderType();
    //   }
    //   if (this.txtSearch && this.txtSearch.trim().length > 0) {
    //     parameters['search'] = this.txtSearch;
    //   }
    //   this.router.navigate(['/object/mail-sender'], {
    //     queryParams: parameters
    //   });
    //   // this.loadAll();
    // }

    addCoupon() {
        this.couponFormGroup.setValue({
            id: null,
            startDate: null,
            endDate: null,
            code: '',
            total: 0,
            percent: 0,
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(coupon: Coupon) {
        this.couponFormGroup.setValue({
            id: coupon.id,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            code: coupon.code,
            total: coupon.total,
            percent: coupon.percent,
            isUpdate: true,
            isShow: true
        });
        console.log(this.couponFormGroup.value);
    }

    save(modal, coupon: Coupon) {
        this.entitySelected = coupon;
        console.log(this.couponFormGroup.value);
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(result => {
            if (result === 'save') {
                this.isAcction = true;
                console.log('save');
                if (coupon.id) {
                    this.couponService.update(coupon).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                } else {
                    this.couponService.create(coupon).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                }
            }
        });
    }

    remove(modal, coupon: Coupon) {
        this.entitySelected = coupon;
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(
            result => {
                if (result === 'delete') {
                    console.log('delete');
                    console.log(this.selectedCoupon);
                    if (coupon.id) {
                        this.couponService.delete(coupon.id).subscribe(res => {
                            // control.removeAt(index);
                            if (res.status === 200) {
                                if (
                                    this.paging.offset +
                                    this.coupons.length -
                                    this.paging.offset ===
                                    1 &&
                                    this.paging.page !== 1
                                ) {
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
            },
            reason => {
            }
        );
    }

    openViewCertPopup(modal, coupon) {
        this.selectedCoupon = coupon;
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(
            result => {
            },
            reason => {
            }
        );
    }

    changeLimit() {
        this.paging.page = 1;
        this.loadAll();
    }

    statusDateCoupon(coupon: Coupon): number {
        const now: Date = new Date();
        if (now.getTime() > coupon.endDate.getTime()) {
            //hêt hạn
            return -1;
        } else if (now.getTime() < coupon.startDate.getTime()) {
            //chưa bắt đầu
            return 1;
        }
        //đang hoạt động
        return 0;
    }

    pagingInfo = paging => {
        return `Show ${paging.offset + 1} to ${paging.offset +
        this.coupons.length} of ${paging.total} entries`;
    };
}
