import {BaseModel} from './base.model';

export class News extends BaseModel {
    title?: string;
    content?: string;
    url?: string;
    description?: string;
    image?: string;
}
