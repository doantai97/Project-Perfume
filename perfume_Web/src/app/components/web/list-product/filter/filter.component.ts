import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Options, LabelType} from 'ng5-slider';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CategoryService} from '../../../../service/category.service';
import {ProducerService} from '../../../../service/producer.service';
import {Category} from '../../../../model/category.model';
import {Producer} from '../../../../model/producer.model';
import {ProductSearch} from '../../../../model/product.model';
import {OderBy} from '../../../../model/base-respone.model';
import {AmountService} from '../../../../service/amount.service';
import {FragrantService} from '../../../../service/fragrant.service';
import {Fragrant} from '../../../../model/fragrant.model';
import {Amount} from '../../../../model/amount.model';
import {Target} from '../../../../model/target.model';
import {TargetService} from '../../../../service/target.service';
import {formatCurency} from '../../../../comom/constant/base.constant';

const FILTER_CONST = {
    minPrice: 0,
    maxPrice: 5000000,
};


@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

    @Input()
    test;

    oderBys: OderByView[] = [
        {
            name: 'Tất cả',
            value: null
        },
        {
            name: 'Giá tăng dần',
            value: {
                name: 'price',
                type: 'asc'
            }
        },
        {
            name: 'Giá giảm dần',
            value: {
                name: 'price',
                type: 'desc'
            }
        },
        {
            name: 'Bán chạy',
            value: {
                name: 'countCheckoutItem',
                type: 'desc'
            }
        }
    ];
    @Output()
    filter: EventEmitter<ProductSearch> = new EventEmitter<ProductSearch>();

    output: ProductSearch = {};

    filterFormGroup: FormGroup = this.fb.group({
        category: [null],
        producer: [null],
        amount: [null],
        fragrant: [null],
        target: [null],
        oderBy: [this.oderBys[0]]
    });
    minPrice = FILTER_CONST.minPrice;
    maxPrice = FILTER_CONST.maxPrice;
    options: Options = {
        floor: FILTER_CONST.minPrice,
        ceil: FILTER_CONST.maxPrice,
        translate: (value: number, label: LabelType): string => {
            switch (label) {
                case LabelType.Low:
                    return formatCurency(value);
                case LabelType.High:
                    return formatCurency(value);
                default:
                    return formatCurency(value);
            }
        }
    };
    targets: Target[] = [];
    categories: Category[] = [];
    producers: Producer[] = [];
    fragrants: Fragrant[] = [];
    amounts: Amount[] = [];

    constructor(private fb: FormBuilder,
                private categoryService: CategoryService,
                private producerService: ProducerService,
                private amountService: AmountService,
                private fragrantService: FragrantService,
                private targetService: TargetService
    ) {
    }

    ngOnInit(): void {
        console.log(this.test);
        this.loadAll();
    }

    loadAll() {
        this.categoryService.filterAll().subscribe(res => {
            this.categories = res.body;
        });
        this.producerService.filterAll().subscribe(res => {
            this.producers = res.body;
        });
        this.amountService.filterAll().subscribe(res => {
            this.amounts = res.body;
        });
        this.fragrantService.filterAll().subscribe(res => {
            this.fragrants = res.body;
        });
        this.targetService.filterAll().subscribe(res => {
            this.targets = res.body;
        });

    }


    filterAction() {
        this.output.maxPrice = this.maxPrice;
        this.output.minPrice = this.minPrice;
        this.output.oderBy = this.filterFormGroup.get('oderBy').value?.value;

        this.output.producerId = this.filterFormGroup.get('producer')?.value?.id;
        this.output.fragrantId = this.filterFormGroup.get('fragrant')?.value?.id;
        this.output.amountId = this.filterFormGroup.get('amount')?.value?.id;

        if (this.filterFormGroup.get('target')?.value) {
            this.output.targetIds = [];
            this.output.targetIds.push(this.filterFormGroup.get('target').value.id);
        } else {
            this.output.targetIds = null;
        }


        console.log(this.filterFormGroup.value);
        console.log(this.output);
        this.filter.emit(this.output);
    }

    clearFilter() {
        Object.keys(this.filterFormGroupValue).forEach(key => {
            if (key === 'oderBy') {
                this.filterFormGroup.get(key).setValue(this.oderBys[0]);
            } else {
                this.filterFormGroup.get(key).setValue(null);
            }
        });
        this.clearFilterPrice();
        this.filter.emit({});
    }

    get filterFormGroupValue() {
        return this.filterFormGroup.value;
    }

    get isFilterPrice() {
        return this.maxPrice !== FILTER_CONST.maxPrice || this.minPrice !== FILTER_CONST.minPrice;
    }

    formatMoney(money) {
        return formatCurency(money);
    }

    clearFilterPrice() {
        this.maxPrice = FILTER_CONST.maxPrice;
        this.minPrice = FILTER_CONST.minPrice;
    }

    cleanFilterForm(key) {
        this.filterFormGroup.get(key).setValue(null);
    }

}


export class OderByView {
    name: string;
    value: OderBy;
}
