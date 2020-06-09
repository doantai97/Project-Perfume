import {Component, OnInit} from '@angular/core';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Producer} from '../../../model/producer.model';
import {PAGING_PER_PAGE} from './../../../comom/constant/base.constant';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {ProducerService} from '../../../service/producer.service';

@Component({
    selector: 'app-producer',
    templateUrl: './producer.component.html',
    styleUrls: ['./producer.component.scss']
})
export class ProducerComponent implements OnInit {
    producers: Producer[];
    public entitySelected: Producer;
    paging: IPaging;
    producerFormGroup: FormGroup;
    selectedProducer: Producer;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;

    constructor(
        public producerService: ProducerService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.producers = [];
        this.initTable();
    }

    initTable() {
        this.producerFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [],
            name: [
                '',
                [Validators.required, Validators.minLength(5), Validators.maxLength(20)]
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
        this.producerService.query(parameters).subscribe(res => {
            if (res.status === 200) {
                this.producers = res.body.data;
                console.log(res.body.paging);
                console.log(this.producers);
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

    addProducer() {
        this.producerFormGroup.setValue({
            id: null,
            description: '',
            name: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(producer: Producer) {
        this.producerFormGroup.setValue({
            id: producer.id,
            description: producer.description,
            name: producer.name,
            isUpdate: true,
            isShow: true
        });
        console.log(this.producerFormGroup.value);
    }

    save(modal, producer: Producer) {
        this.entitySelected = producer;
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
                if (producer.id) {
                    this.producerService.update(producer).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                } else {
                    this.producerService.create(producer).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                }
            }
        });
    }

    remove(modal, producer: Producer) {
        this.entitySelected = producer;
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
                    console.log(this.selectedProducer);
                    if (producer.id) {
                        this.producerService.delete(producer.id).subscribe(res => {
                            // control.removeAt(index);
                            if (res.status === 200) {
                                if (
                                    this.paging.offset +
                                    this.producers.length -
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

    openViewCertPopup(modal, producer) {
        this.selectedProducer = producer;
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
        this.producers.length} of ${paging.total} entries`;
    };
}
