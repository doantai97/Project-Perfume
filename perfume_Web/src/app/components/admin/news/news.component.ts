import {Component, OnInit} from '@angular/core';
import {News} from '../../../model/news.model';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PAGING_PER_PAGE} from '../../../comom/constant/base.constant';
import {NewsService} from '../../../service/news.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

    newss: News[];
    paging: IPaging;
    newsFormGroup: FormGroup;
    selectedNews: News;
    mapMailServer = {};
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    isAcction = true;
    contentShow: string;

    constructor(
        public newsService: NewsService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.paging = new Paging();
        this.newss = [];
        this.initTable();
    }

    initTable() {
        this.newsFormGroup = this.initForm();
        this.loadAll();
    }

    initForm() {
        return this.fb.group({
            id: [],
            title: ['', [Validators.required]],
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
        console.log('loadAll');
        const parameters = {
            page: this.paging.page,
            limit: this.paging.limit
        };
        this.newsService.query(parameters).subscribe(res => {
            if (res.status === 200) {
                this.newss = res.body.data;
                console.log(res.body.paging);
                console.log(this.newss);
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


    addNews() {
        this.newsFormGroup.setValue({
            id: null,
            title: '',
            content: '',
            isUpdate: false,
            isShow: true
        });
    }

    showEdit(news: News) {
        this.newsFormGroup.setValue({
            id: news.id,
            title: news.title,
            content: news.content,
            isUpdate: true,
            isShow: true
        });
        console.log(this.newsFormGroup.value);
    }

    save(modal, news: News) {
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
                if (news.id) {
                    this.newsService.update(news).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                } else {
                    this.newsService.create(news).subscribe(res => {
                        console.log(res.body);
                        this.loadAll();
                    });
                }
            }
        });
    }

    remove(modal, news: News) {
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
                    console.log(this.selectedNews);
                    if (news.id) {
                        this.newsService.delete(news.id).subscribe(res => {
                            // control.removeAt(index);
                            if (res.status === 200) {
                                if (
                                    this.paging.offset +
                                    this.newss.length -
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

    openViewCertPopup(modal, news) {
        this.selectedNews = news;
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


    showContent(modal, news: News) {
        this.contentShow = news.content;
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(result => {
            if (result === 'save') {
            }
        });
    }


    pagingInfo = paging => {
        return `Show ${paging.offset + 1} to ${paging.offset +
        this.newss.length} of ${paging.total} entries`;
    };

}
