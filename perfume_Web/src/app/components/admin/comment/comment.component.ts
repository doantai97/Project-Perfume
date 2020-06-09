import {Component, OnInit} from '@angular/core';
import {CheckoutService} from '../../../service/checkout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AddressService} from '../../../service/address.service';
import {FormBuilder} from '@angular/forms';
import {CommentService} from '../../../service/comment.service';
import {Comment} from '../../../model/comment.model';
import {IPaging, Paging} from '../../../model/base-respone.model';
import {COMMENT_TYPE, PAGING_PER_PAGE} from '../../../comom/constant/base.constant';
import {ProductService} from '../../../service/product.service';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

    typeComment: string;
    postId: number;
    comments: Comment[] = [];
    paging: IPaging = new Paging();
    txtSearch: string;
    limits = PAGING_PER_PAGE;
    statusComment = true;

    post: any = {};

    constructor(public commentService: CommentService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private addressService: AddressService,
                private productService: ProductService,
                private fb: FormBuilder
    ) {
        this.activatedRoute.paramMap.subscribe(param => {
            this.typeComment = param.get('type');
            this.postId = Number.parseInt(param.get('postId'));
            if (this.typeComment === COMMENT_TYPE.PRODUCT) {
                this.loadProduct();
            } else if (this.typeComment === COMMENT_TYPE.NEWS) {

            } else {
                router.navigate(['/404']);
            }

            this.loadAll();
        });

    }

    loadProduct() {
        this.productService.find(this.postId).subscribe(res => {
            console.log(res.body);
            this.post = res.body;
        });
    }

    loadAll() {
        const filter: Comment = {
            postId: this.postId,
            type: this.typeComment,
            status: this.statusComment ? 1 : 0
        };
        this.commentService.filter(this.paging, filter).subscribe(res => {
            this.comments = res.body.data.map(value => {
                value.createdAt = new Date(value.createdAt);
                value.showSubComment = false;
                return value;
            });
            this.paging.total = res.body.paging.total;
            this.paging.offset = res.body.paging.offset;
            if (this.paging.page !== res.body.paging.page) {
                this.paging.page = res.body.paging.page;
            }

        });
    }

    ngOnInit(): void {
    }

    loadPage(page: number) {
        if (page !== this.paging.previousPage) {
            this.paging.previousPage = page;
            this.loadAll();
        }
    }

    changeStatus() {
        this.statusComment = !this.statusComment;
        this.paging.page = 1;
        this.loadAll();
    }

    changeStatusComment(comment: Comment) {
        const tmp: Comment = {
            status: comment.status === 1 ? 0 : 1,
            id: comment.id
        };
        this.commentService.update(tmp).subscribe(res => {
            this.loadAll();
        });
    }

    search() {
        console.log('search');
    }

    showSubComment(comment: Comment) {
        comment.showSubComment = !comment.showSubComment;
        console.log(comment);
    }

    pagingInfo = paging => {
        return `Show ${paging.offset + 1} to ${paging.offset +
        this.comments.length} of ${paging.total} entries`;
    };

    changeLimit() {
        this.paging.page = 1;
        this.loadAll();
    }

}
