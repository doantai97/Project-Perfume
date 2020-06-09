import {Category} from './category.model';
import {Producer} from './producer.model';
import {Fragrant} from './fragrant.model';
import {Target} from './target.model';
import {Amount} from './amount.model';
import {Version} from './version.model';
import {OderBy} from './base-respone.model';


export class Product {
    id?: number;
    name?: string;
    code?: string;
    highlights?: Array<string>;
    MFG: any;
    EXP: any;
    image: string;
    description: any;
    category: Category;
    versions: Array<Version>;
    producer: Producer;
    amount: Amount;
    fragrant: Fragrant;
    targets: Array<Target>;
    imageBase64?: string;
    year?: number;
    totalSold?: number;
}

export class ProductSearch {
    id?: number;
    name?: string;
    code?: string;
    highlights?: Array<string>;
    categoryId?: number;
    producerId?: number;
    amountId?: number;
    fragrantId?: number;
    targetsId?: number;
    maxPrice?: number;
    minPrice?: number;
    categoryCode?: string;
    oderBy?: OderBy;
    year?: number;
    targetIds?: number[];
    search?: string;
}

