import {Component, Input, OnInit} from '@angular/core';
import {Comment} from '../../../model/comment.model';
import {CommentService} from '../../../service/comment.service';
import {AuthenticationService} from '../../../service/authentication.service';
import {COMMENT_TYPE} from '../../../comom/constant/base.constant';
import {Paging} from '../../../model/base-respone.model';
import {SERVER_API_IMAGE} from '../../../app.constants';

@Component({
    selector: 'app-show-comment',
    templateUrl: './show-comment.component.html',
    styleUrls: ['./show-comment.component.scss']
})
export class ShowCommentComponent implements OnInit {

    contentComment: string;
    paging: Paging = new Paging();

    comments: Comment[] = [];

    @Input()
    postId: number;

    @Input()
    type: string;

    constructor(private commentService: CommentService, private authenticationService: AuthenticationService) {

    }

    ngOnInit(): void {
        this.loadComment();
    }


    showInputComment(comment: Comment) {
        comment.isComment = true;
        comment.subContent = '';
    }

    sendComment(parenComment?: Comment) {
        console.log(parenComment);
        if (parenComment && parenComment.subContent && parenComment.subContent.trim() === '') {
            alert('Chưa nhập bình luận');
            return;
        }
        if (!parenComment && this.contentComment.trim() === '') {
            alert('Chưa nhập bình luận');
            return;
        }
        if (this.authenticationService.currentUserValue) {
            const comment: Comment = {
                type: this.type,
                postId: this.postId,
                content: this.contentComment
            };
            if (parenComment) {
                comment.parenComment = parenComment;
                comment.content = parenComment.subContent;
            }
            this.commentService.create(comment).subscribe(res => {
                if (res.status === 200) {
                    console.log(res.body);
                    this.loadComment();
                }
            });

        } else {
            alert('Bạn chưa đăng nhập. vui lòng đăng nhập để gửi bình luận');
        }
    }

    loadComment() {
        const comment: Comment = {
            type: this.type,
            postId: this.postId,
            parenComment: {
                id: null
            }
        };
        this.commentService.filter(this.paging, comment).subscribe(res => {
            this.comments = res.body.data.map(value => {
                value.isComment = false;
                value.createdAt = new Date(value.createdAt);
                return value;
            });
            this.paging.total = res.body.paging.total;
            this.paging.offset = res.body.paging.offset;
        });
    }

    loadPage(page) {
        this.paging.page = page;
        this.loadComment();
    }

    getBackgroundImage(urlImg) {
        return `${SERVER_API_IMAGE}${urlImg}`;
    }
}
