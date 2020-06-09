import {Component, OnInit} from '@angular/core';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGING_PER_PAGE} from '../../../comom/constant/base.constant';
import {DisplayStaticService} from '../../../service/display-static.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-display-static',
    templateUrl: './display-static.component.html',
    styleUrls: ['./display-static.component.scss']
})
export class DisplayStaticComponent implements OnInit {

    displayStatics: any[];
    public entitySelected: any;
    paging: IPaging;
    displayStaticFormGroup: FormGroup;
    selectedDisplayStatic: any;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;

    constructor(
        public displayStaticService: DisplayStaticService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.displayStatics = [];
        this.initTable();
    }

    initTable() {
        this.displayStaticFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [],
            type: [
                ''
            ],
            content: ['', [Validators.required]],
            isUpdate: [true],
            isShow: [false]
        });
    }

    search() {
        this.paging.page = 1;
        this.loadAll();
    }

    loadAll() {
        this.displayStaticService.query().subscribe(res => {
            if (res.status === 200) {
                this.displayStatics = res.body;
            } else {
                console.warn('can not load all');
            }
        });
    }

    addDisplayStatic() {
        this.displayStaticFormGroup.setValue({
            id: null,
            content: '',
            type: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(displayStatic: any) {
        this.displayStaticFormGroup.setValue({
            id: displayStatic.id,
            content: displayStatic.content,
            type: displayStatic.type,
            isUpdate: true,
            isShow: true
        });
        console.log(this.displayStaticFormGroup.value);
    }

    save(modal, displayStatic: any) {
        this.entitySelected = displayStatic;
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
                if (displayStatic.id) {
                    this.displayStaticService.update(displayStatic).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                } else {
                    // this.displayStaticService.create(displayStatic).subscribe(res => {
                    //     console.log(res.body);
                    //     this.loadAll();
                    // });
                }
            }
        });
    }

    openViewCertPopup(modal, displayStatic) {
        this.selectedDisplayStatic = displayStatic;
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


}
