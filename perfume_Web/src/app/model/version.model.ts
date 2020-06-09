import {Product} from './product.model';

export class Version {
    id?: number;
    name?: string;
    price?: number;
    total?: number;
    product?: Product;
    isUpdate?: boolean;
    totalSold?: number;
}
