import {Component, OnInit} from '@angular/core';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Fragrant} from '../../../model/fragrant.model';
import {PAGING_PER_PAGE} from './../../../comom/constant/base.constant';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {FragrantService} from '../../../service/fragrant.service';

@Component({
    selector: 'app-fragrant',
    templateUrl: './fragrant.component.html',
    styleUrls: ['./fragrant.component.scss']
})
export class FragrantComponent implements OnInit {
    fragrants: Fragrant[];
    public entitySelected: Fragrant;
    paging: IPaging;
    fragrantFormGroup: FormGroup;
    selectedFragrant: Fragrant;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;

    constructor(
        public fragrantService: FragrantService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.fragrants = [];
        this.initTable();
    }

    initTable() {
        this.fragrantFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [],
            name: [
                '',
                [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
            ],
            description: ['', [Validators.required]],
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
        this.fragrantService.query(parameters).subscribe(res => {
            if (res.status === 200) {
                this.fragrants = res.body.data;
                console.log(res.body.paging);
                console.log(this.fragrants);
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

    addFragrant() {
        this.fragrantFormGroup.setValue({
            id: null,
            description: '',
            name: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(fragrant: Fragrant) {
        this.fragrantFormGroup.setValue({
            id: fragrant.id,
            description: fragrant.description,
            name: fragrant.name,
            isUpdate: true,
            isShow: true
        });
        console.log(this.fragrantFormGroup.value);
    }

    save(modal, fragrant: Fragrant) {
        this.entitySelected = fragrant;
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
                if (fragrant.id) {
                    this.fragrantService.update(fragrant).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                } else {
                    this.fragrantService.create(fragrant).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                }
            }
        });
    }

    remove(modal, fragrant: Fragrant) {
        this.entitySelected = fragrant;
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
                    console.log(this.selectedFragrant);
                    if (fragrant.id) {
                        this.fragrantService.delete(fragrant.id).subscribe(res => {
                            // control.removeAt(index);
                            if (res.status === 200) {
                                if (
                                    this.paging.offset +
                                    this.fragrants.length -
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

    openViewCertPopup(modal, fragrant) {
        this.selectedFragrant = fragrant;
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

    pagingInfo = paging => {
        return `Show ${paging.offset + 1} to ${paging.offset +
        this.fragrants.length} of ${paging.total} entries`;
    };
}
