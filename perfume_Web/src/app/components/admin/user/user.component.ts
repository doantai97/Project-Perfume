import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGING_PER_PAGE} from '../../../comom/constant/base.constant';
import {UserService} from '../../../service/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from '../../../model/user';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    users: User[];
    public entitySelected: User;
    paging: IPaging;
    userFormGroup: FormGroup;
    selectedUser: User;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;

    constructor(public userService: UserService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.users = [];
        this.initTable();
    }


    initTable() {
        this.userFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [],
            username: ['', [Validators.required, Validators.minLength(8),
                Validators.required, Validators.maxLength(30)
            ]
            ],
            isUpdate: [true],
            isShow: [false]
        });
    }

    search() {
        const parameters = {
            username: this.txtSearch
        };
        if (this.txtSearch == undefined || this.txtSearch == '') {
            this.loadAll()
        } else {
            this.userService.findByUserName(this.txtSearch).subscribe(res => {
                if (res.status === 200) {
                    this.users = [];
                    this.users.push(res.body)
                    console.log(this.users)
                    this.paging.total = 1;
                } else {
                    console.warn('can not find user');
                }
            });
        }
    }

    loadAll() {
        console.log('loadAll');
        const parameters = {
            page: this.paging.page,
            limit: this.paging.limit
        };
        this.userService.query(parameters).subscribe(res => {
            if (res.status === 200) {
                this.users = res.body.data;
                console.log(res.body.paging);
                console.log(this.users);
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


    addUser() {
        this.userFormGroup.setValue({
            id: null,
            username: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(user: User) {
        this.userFormGroup.setValue({
            id: user.id,
            username: user.username,
            isUpdate: true,
            isShow: true
        });
        console.log(this.userFormGroup.value);
    }

    remove(modal, user: User) {
        this.entitySelected = user;
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            }).result.then(
            result => {
                if (result === 'delete') {
                    console.log('delete');
                    if (user.id) {
                        this.userService.delete(user.id).subscribe(res => {
                            // control.removeAt(index);
                            if (res.status === 200) {
                                if (
                                    this.paging.offset +
                                    this.users.length -
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

    openViewCertPopup(modal, user) {
        this.selectedUser = user;
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
        return `Show ${paging.offset + 1} to ${(paging.offset + this.users.length)} of ${paging.total} entries`;
    };

}
