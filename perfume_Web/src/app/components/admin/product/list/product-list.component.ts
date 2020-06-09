import {Component, OnInit} from '@angular/core';
import {Product, ProductSearch} from '../../../../model/product.model';
import {IPaging, Paging} from '../../../../model/base-respone.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGING_PER_PAGE, getImg} from '../../../../comom/constant/base.constant';
import {ProductService} from '../../../../service/product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-view',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {


    products: Product[];
    public entitySelected: Product;
    paging: IPaging;
    productFormGroup: FormGroup;
    selectedProduct: Product;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;

    productSearch: ProductSearch = {};


    constructor(public productService: ProductService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder) {
    }

    getImage(img) {
        return getImg(img);
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.products = [];
        this.initTable();
    }


    initTable() {
        this.productFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [],
            name: [''],
            code: ['', [Validators.required, Validators.minLength(8),
                Validators.required, Validators.maxLength(30)
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

        this.productService.filter(this.paging, this.productSearch).subscribe(res => {
            if (res.status === 200) {
                this.products = res.body.data;
                console.log(res.body.paging);
                console.log(this.products);
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

    remove(modal, product: Product) {
        this.entitySelected = product;
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            }).result.then(
            result => {
                if (result === 'delete') {
                    if (product.id) {
                        this.productService.delete(product.id).subscribe(res => {
                            if (res.status === 200) {
                                if (
                                    this.paging.offset +
                                    this.products.length -
                                    this.paging.offset ===
                                    1 &&
                                    this.paging.page !== 1
                                ) {
                                    this.paging.page = this.paging.page - 1;
                                }
                            }
                            this.loadAll();
                        });
                    } else {
                    }
                }
            },
            reason => {
            }
        );
    }

    // transition() {
    //   const parameters = {
    //     offset: this.paging.offset - 1,
    //     limit: this.paging.limit
    //   }
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


    addProduct() {
        this.productFormGroup.setValue({
            id: null,
            code: '',
            name: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(product: Product) {
        this.productFormGroup.setValue({
            id: product.id,
            code: product.code,
            name: product.name,
            isUpdate: true,
            isShow: true
        });
        console.log(this.productFormGroup.value);
    }


    openViewCertPopup(modal, product) {
        this.selectedProduct = product;
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
        return `Show ${paging.offset + 1} to ${(paging.offset + this.products.length)} of ${paging.total} entries`;
    };

    changeFilter($event) {
        console.log($event);
        this.productSearch = $event;
        this.loadAll();
    }

}
