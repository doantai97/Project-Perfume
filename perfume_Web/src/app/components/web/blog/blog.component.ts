import {Component, OnInit} from '@angular/core';
import {Paging} from '../../../model/base-respone.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {NewsService} from '../../../service/news.service';
import {News} from '../../../model/news.model';
import {SERVER_API_IMAGE, SERVER_API_URL} from '../../../app.constants';

@Component({
    selector: 'app-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

    paging: Paging = new Paging();
    listNews: News[] = [];

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private newsService: NewsService) {
        this.activatedRoute.queryParamMap.subscribe(param => {
            console.log('HDz');
            console.log(param.get('page'));
            let page = Number.parseInt(param.get('page'));
            page = page ? page : 1;
            this.paging.page = (page && page > 0) ? page : 1;
            this.loadAll();
        });
    }

    ngOnInit(): void {
    }

    loadAll() {
        this.newsService.filter(this.paging, {}).subscribe(res => {
            this.listNews = res.body.data;
            this.paging.total = res.body.paging.total;
            this.paging.offset = res.body.paging.offset;
        });
    }


    loadPage(page) {
        console.log(page);
        this.router.navigate([''], {
            queryParams: {page: page}
        });
    }


    getBackgroundImage(urlImg) {
        // return 'http://localhost:6699/api/storage/news/queqw.jpeg';
        return `${SERVER_API_IMAGE}${urlImg}`;
    }

}
