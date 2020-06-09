import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder} from '@angular/forms';
import {NewsService} from '../../../service/news.service';
import {News} from '../../../model/news.model';
import {Paging} from '../../../model/base-respone.model';
import {SERVER_API_IMAGE} from '../../../app.constants';
import {Comment} from '../../../model/comment.model';
import {CommentService} from '../../../service/comment.service';
import {COMMENT_TYPE} from '../../../comom/constant/base.constant';

@Component({
    selector: 'app-blog-single',
    templateUrl: './blog-single.component.html',
    styleUrls: ['./blog-single.component.scss']
})
export class BlogSingleComponent implements OnInit {

    news: News;
    COMMENT_TYPE = COMMENT_TYPE;
    listNews: News[] = [];
    comments: Comment[] = [];

    pagingComment: Paging = new Paging();

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private newsService: NewsService,
                private commentService: CommentService
    ) {
        this.activatedRoute.paramMap.subscribe(param => {
            const url = param.get('url');
            if (url) {
                this.loadNews(url);
            } else {
                this.router.navigate(['/blog']);
            }

        });
    }

    ngOnInit(): void {
        this.loadList();
    }

    loadList() {
        const paging: Paging = new Paging();
        paging.limit = 6;
        this.newsService.filter(paging, {}).subscribe(res => {
            this.listNews = res.body.data;
        });
    }

    loadComment() {
        const param: Comment = {
            postId: this.news.id,
            type: COMMENT_TYPE.NEWS
        };
        this.commentService.filter(this.pagingComment, param).subscribe(res => {
            this.comments = res.body.data;
            this.pagingComment.page = res.body.paging.page;
            this.pagingComment.offset = res.body.paging.offset;
        });
    }


    loadNews(url) {
        this.newsService.filterAll({url: url}).subscribe(res => {
            if (res.body.length > 0) {
                this.news = res.body[0];
                console.log(this.news);
            } else {
                this.router.navigate(['/blog']);
            }
        });
    }

    getBackgroundImage(urlImg) {
        return `${SERVER_API_IMAGE}${urlImg}`;
    }

    redirectTo(uri:string){
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
        this.router.navigate([uri]));
    }

}
