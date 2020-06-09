import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../../service/product.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Product} from '../../../../model/product.model';
import {Category} from '../../../../model/category.model';
import {Version} from '../../../../model/version.model';
import {Producer} from '../../../../model/producer.model';
import {Target} from '../../../../model/target.model';
import * as _ from 'lodash';
import {CategoryService} from '../../../../service/category.service';
import {TargetService} from '../../../../service/target.service';
import {ProducerService} from '../../../../service/producer.service';
import {xoaDau} from './../../../../comom/utils/base.utils';
import {Amount} from 'src/app/model/amount.model';
import {Fragrant} from 'src/app/model/fragrant.model';
import {AmountService} from 'src/app/service/amount.service';
import {FragrantService} from 'src/app/service/fragrant.service';
import {CKEDITOR_CONFIG, COMMENT_TYPE, getImg} from '../../../../comom/constant/base.constant';
import {SERVER_URL} from '../../../../app.constants';

@Component({
    selector: 'app-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    productId;
    isUpdate: boolean;
    productFormGroup: FormGroup;
    product: Product;
    years: number[] = [];

    imageDefault = 'assets/images/upload-file.png';
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;

    categories: Array<Category>;
    producers: Array<Producer>;
    targets: Array<Target>;
    amounts: Array<Amount>;
    fragrants: Array<Fragrant>;
    versions: Array<Version> = [];
    isHot = false;
    isNew = false;
    isCustomUri = true;
    versionFromGroup: FormGroup;
    versionUpdateGroup: FormGroup;


    constructor(
        private route: ActivatedRoute,
        public producerService: ProducerService,
        public categoryService: CategoryService,
        public amountService: AmountService,
        public fragrantService: FragrantService,
        public targetService: TargetService,
        public productService: ProductService,
        protected router: Router,
        protected activatedRoute: ActivatedRoute,
        private modalService: NgbModal,
        private fb: FormBuilder
    ) {
        for (let i = 2020; i >= 1990; --i) {
            this.years.push(i);
        }
        this.activatedRoute.paramMap.subscribe(param => {
            this.productId = this.route.snapshot.paramMap.get('id');
            this.isUpdate = this.productId !== null;
            this.loadAll();
        });
        this.productFormGroup = this.initForm();
        this.versionFromGroup = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            total: [0, [Validators.required, Validators.min(1)]],
            price: [0, [Validators.required, Validators.min(1)]],
            isUpdate: [false]
        });
        this.versionUpdateGroup = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            total: [0, [Validators.required, Validators.min(1)]],
            price: [0, [Validators.required, Validators.min(1)]],
            isUpdate: [false]
        });
        if (!this.isUpdate && !this.isImageSaved) {
            this.imageError = 'Chưa chọn ảnh';
        }
        // this.Editor.config.toolbar = CKEDITOR_CONFIG.toolbar;
        // this.Editor.config.toolbarGroups = CKEDITOR_CONFIG.toolbarGroups;
    }


    ngOnInit(): void {
    }

    loadAll() {
        if (this.isUpdate) {
            this.productService.find(this.productId).subscribe(res => {
                this.product = res.body;
                this.versions = this.product.versions.map(value => {
                    value.isUpdate = false;
                    return value;
                });
                if (this.product.highlights) {
                    this.isHot = this.product.highlights.some(value => {
                        if (value === 'HOT') {
                            return true;
                        }
                    });

                    this.isNew = this.product.highlights.some(value => {
                        if (value === 'NEW') {
                            return true;
                        }
                    });
                }


                if (this.product.image != null) {
                    this.imageDefault = getImg(this.product.image);
                }
                this.productFormGroup.setValue({
                    id: this.product.id,
                    name: this.product.name,
                    code: this.product.code,
                    highlights: this.product.highlights,
                    MFG: this.product.MFG,
                    EXP: this.product.EXP,
                    image: this.product.image,
                    description: this.product.description,
                    versions: this.product.versions,
                    category: this.product.category,
                    producer: null,
                    amount: null,
                    fragrant: null,
                    targets: null,
                    imageBase64: null,
                    year: this.product.year
                });
                this.loadProperties();
            });
        } else {
            this.loadProperties();
        }
    }

    loadProperties() {
        this.producerService.filterAll().subscribe(res => {
            this.producers = res.body;
            if (this.producers.length > 0) {
                let tmp = null;
                if (!this.isUpdate) {
                    tmp = this.producers[0];
                } else {
                    tmp = this.findById(this.product.producer.id, this.producers);
                }
                this.productFormGroup.get('producer').setValue(tmp);
            }
        });

        this.categoryService.filterAll().subscribe(res => {
            this.categories = res.body;
            if (this.categories.length > 0) {
                let tmp = null;
                if (!this.isUpdate) {
                    tmp = this.categories[0];
                } else {
                    tmp = this.findById(this.product.category.id, this.categories);
                }
                this.productFormGroup.get('category').setValue(tmp);
            }
        });
        this.targetService.filterAll().subscribe(res => {
            this.targets = res.body;
            if (this.targets.length > 0 && this.isUpdate && this.product.targets) {
                const tmp = [];
                this.product.targets.forEach(value => {
                    tmp.push(this.findById(value.id, this.targets));
                });
                this.productFormGroup.get('targets').setValue(tmp);
            }
        });

        this.fragrantService.filterAll().subscribe(res => {
            this.fragrants = res.body;
            if (this.fragrants.length > 0) {
                let tmp = null;
                if (!this.isUpdate) {
                    tmp = this.fragrants[0];
                } else {
                    tmp = this.findById(this.product.fragrant.id, this.fragrants);
                }
                this.productFormGroup.get('fragrant').setValue(tmp);
            }
        });
        this.amountService.filterAll().subscribe(res => {
            this.amounts = res.body;
            if (this.amounts.length > 0) {
                let tmp = null;
                if (!this.isUpdate) {
                    tmp = this.amounts[0];
                } else {
                    tmp = this.findById(this.product.amount.id, this.amounts);
                }
                this.productFormGroup.get('amount').setValue(tmp);
            }
        });
    }

    findById(id: number, data: Array<any>) {
        const rs = data.find(value => {
            return value.id === id;
        });
        console.log('=========');
        console.log(rs);
        return rs;
    }

    initForm() {
        return this.fb.group({
            id: [],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            highlights: ['', []],
            MFG: [null],
            EXP: [null],
            image: [null],
            description: [null, [Validators.required]],
            category: [null, [Validators.required]],
            versions: [null, []],
            producer: [null, [Validators.required]],
            amount: [null, [Validators.required]],
            fragrant: [null, [Validators.required]],
            targets: [null, [Validators.required]],
            imageBase64: [],
            year: [2020, [Validators.required]],
        });
    }

    fileChangeEvent(fileInput: any) {
        this.imageError = null;
        if (fileInput.target.files && fileInput.target.files[0]) {
            // Size Filter Bytes
            const max_size = 20971520;
            const allowed_types = ['image/png', 'image/jpeg'];
            const max_height = 1000;
            const max_width = 1000;

            if (fileInput.target.files[0].size > max_size) {
                this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';

                return false;
            }

            if (!_.includes(allowed_types, fileInput.target.files[0].type)) {
                this.imageError = 'Only Images are allowed ( JPG | PNG )';
                return false;
            }
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = rs => {
                    const img_height = rs.currentTarget['height'];
                    const img_width = rs.currentTarget['width'];

                    console.log(img_height, img_width);

                    if (img_height > max_height && img_width > max_width) {
                        this.imageError =
                            'Maximum dimentions allowed ' +
                            max_height +
                            '*' +
                            max_width +
                            'px';
                        return false;
                    } else {
                        const imgBase64Path = e.target.result;
                        this.cardImageBase64 = imgBase64Path;
                        this.isImageSaved = true;
                        // console.log(this.cardImageBase64);
                        // this.previewImagePath = imgBase64Path;
                    }
                };
            };
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    removeImage() {
        this.cardImageBase64 = null;
        this.isImageSaved = false;
    }

    save() {
        console.log('click');
        const tmp: Product = this.productFormGroup.value;
        tmp.versions = this.versions;
        tmp.highlights = [];
        console.log({
            new: this.isNew,
            hot: this.isHot
        });
        if (this.isNew) {
            tmp.highlights.push('NEW');
        }
        if (this.isHot) {
            tmp.highlights.push('HOT');
        }
        if (this.isImageSaved) {
            tmp.imageBase64 = this.cardImageBase64;
        }
        console.log(tmp);
        if (this.isUpdate) {
            this.productService.update(tmp).subscribe(res => {
                if (res.status === 200) {
                    window.location.reload();
                } else {
                    alert('eror');
                    console.log('error');
                }
            });
        } else {
            this.productService.findByCode(tmp.code).subscribe(resCode => {
                if (resCode.body.status === 200) {
                    alert('Đã tồn tại đường dẫn cho sản phẩm khác ');
                } else {
                    this.productService.create(tmp).subscribe(res => {
                        if (res.status === 200) {
                            console.log(res.body);
                            //chuyển hướng
                            // this.loadAll();
                            this.router.navigate(['/admin/product']);
                        } else {
                            alert('eror');
                            console.log('error');
                        }
                    });
                }
            });
        }
    }

    editVersion(version: Version) {
        version.name = this.versionUpdateGroup.get('name').value;
        version.total = this.versionUpdateGroup.get('total').value;
        version.price = this.versionUpdateGroup.get('price').value;
        version.isUpdate = false;
    }

    setUpEditVersion(version: Version) {
        this.versions.forEach(value => {
            if (value !== version) {
                value.isUpdate = false;
            }
        });
        version.isUpdate = true;
        this.versionUpdateGroup.get('name').setValue(version.name);
        this.versionUpdateGroup.get('total').setValue(version.total);
        this.versionUpdateGroup.get('price').setValue(version.price);

    }

    addVersion() {
        this.versions.push(this.versionFromGroup.value);
    }

    removeVersion(index) {
        // console.log(index);
        this.versions.splice(index, 1);
    }

    changeHot($event) {
        this.isHot = $event.target.checked;
    }

    changeNew($event) {
        this.isNew = $event.target.checked;
    }

    changeCustomUri($event) {
        this.isCustomUri = $event.target.checked;
    }

    focusoutName() {
        if (this.isCustomUri) {
            const name: string = this.productFormGroup.get('name').value;
            this.productFormGroup.get('code').setValue(xoaDau(name));
        }
    }

    isSave() {
        const tmp =
            !this.productFormGroup.invalid &&
            (this.isUpdate ? true : this.isImageSaved) &&
            this.versions.length > 0;
        return tmp;
    }

    test() {
        console.log(this.productFormGroup.value);
    }
}
