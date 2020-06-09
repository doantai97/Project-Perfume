import {Component, OnInit} from '@angular/core';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category} from '../../../model/category.model';
import {PAGING_PER_PAGE} from './../../../comom/constant/base.constant';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoryService} from '../../../service/category.service';
import {xoaDau} from '../../../comom/utils/base.utils';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

    categories: Category[];
    public entitySelected: Category;
    paging: IPaging;
    categoryFormGroup: FormGroup;
    selectedCategory: Category;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;
    isCustomUri = true;

    constructor(public categoryService: CategoryService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.categories = [];
        this.initTable();
    }


    initTable() {
        this.categoryFormGroup = this.initForm();
        this.loadAll();
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
        const parameters = {
            page: this.paging.page,
            limit: this.paging.limit
        };
        this.categoryService.query(parameters).subscribe(res => {
            if (res.status === 200) {
                this.categories = res.body.data;
                console.log(res.body.paging);
                console.log(this.categories);
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

    focusoutName() {
        if (this.isCustomUri) {
            const name: string = this.categoryFormGroup.get('name').value;
            this.categoryFormGroup.get('code').setValue(xoaDau(name));
        }
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


    addCategory() {
        this.categoryFormGroup.setValue({
            id: null,
            code: '',
            name: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(category: Category) {
        this.categoryFormGroup.setValue({
            id: category.id,
            code: category.code,
            name: category.name,
            isUpdate: true,
            isShow: true
        });
        console.log(this.categoryFormGroup.value);
    }

    save(modal, category: Category) {
        this.entitySelected = category;
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            backdrop: 'static'
        }).result.then((result) => {
            if (result === 'save') {
                this.isAcction = true;
                console.log('save');
                if (category.id) {
                    this.categoryService.update(category).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                } else {
                    this.categoryService.create(category).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                }
            }

        });
    }

    remove(modal, category: Category) {
        this.entitySelected = category;
        this.modalService.open(modal, {
            ariaLabelledBy: 'modal-basic-title',
            size: 'lg',
            backdrop: 'static'
        }).result.then((result) => {
            if (result === 'delete') {
                console.log('delete');
                console.log(this.selectedCategory);
                if (category.id) {
                    this.categoryService.delete(category.id).subscribe(res => {
                        // control.removeAt(index);
                        if (res.status === 200) {
                            if ((this.paging.offset + this.categories.length) - this.paging.offset === 1 && this.paging.page !== 1) {
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

    openViewCertPopup(modal, category) {
        this.selectedCategory = category;
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
        return `Show ${paging.offset + 1} to ${(paging.offset + this.categories.length)} of ${paging.total} entries`;
    }

}
