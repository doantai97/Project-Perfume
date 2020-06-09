import {User} from './user';

export class Comment {
    id?: number;
    createdAt?: Date;
    createdBy?: string;
    type?: string;
    content?: string;
    postId?: number;
    subComments?: Array<Comment>;
    isComment?: boolean;
    parenComment?: Comment;
    subContent?: string;
    status?: number;
    showSubComment?: boolean;
    user?: User;
}
