import {User} from './user';
import {Version} from './version.model';
import {Address} from './address.model';

export class Checkout {
    id?: number;
    user?: User;
    firstname?: string;
    lastname?: string;
    phone?: string;
    email?: string;
    address?: string;
    address1?: Address;
    paymentMethod?: number;
    provinceId?: number;
    districtId?: number;
    wardId?: number;
    note?;
    status?;
    checkoutItems?: Array<any>;
    coupon?: any;
    total?: number;
    finalprice?: number;
    description?: string;
    isCoupon?: boolean;
    search?: string;

    createdAt?: Date;
    createdBy?: number;
    updatedAt?: Date;
    lastModifiedBy?: string;
}
