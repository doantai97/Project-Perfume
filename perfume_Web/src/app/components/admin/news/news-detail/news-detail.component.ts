import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {News} from '../../../../model/news.model';
import {NewsService} from '../../../../service/news.service';
import {User} from '../../../../model/user';
import {xoaDau} from '../../../../comom/utils/base.utils';
import * as _ from 'lodash';
import {SERVER_URL, DEFAULTPASSWORD, SERVER_API_IMAGE} from '../../../../app.constants';

@Component({
    selector: 'app-news-detail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {
    newsId;
    isUpdate = false;
    news: News;
    newsFormGroup: FormGroup;
    isCustomUri = true;

    //image
    imageDefault = 'http://placehold.it/380x500';
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;

    constructor(protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private newsService: NewsService,
    ) {
        this.activatedRoute.paramMap.subscribe(param => {
            this.newsId = param.get('id');
            this.isUpdate = this.newsId !== null;
            this.loadAll();
        });
    }

    ngOnInit(): void {
        this.newsFormGroup = this.initForm();
    }

    initForm() {
        return this.fb.group({
            id: [],
            url: ['', [Validators.required]],
            title: ['', [Validators.required]],
            content: ['', [Validators.required]],
            description: ['', [Validators.required, Validators.maxLength(1024)]]
        });
    }

    loadAll() {
        if (this.isUpdate) {
            this.newsService.find(this.newsId).subscribe(res => {
                this.news = res.body;
                if (this.news.image) {
                    this.imageDefault = SERVER_API_IMAGE + this.news.image;
                }
                this.addValue(this.news);
                console.log(this.news);
            });
        }
    }

    addValue(news: News) {
        this.newsFormGroup.setValue({
            id: news.id,
            url: news.url,
            title: news.title,
            content: news.content,
            description: news.description
        });
    }

    save() {
        const tmp: News = this.newsFormGroup.value;
        tmp.image = this.cardImageBase64;
        console.log(tmp);
        if (this.isUpdate) {
            this.newsService.update(tmp).subscribe(res => {
                if (res.status === 200) {
                    window.location.reload();
                } else {
                    alert('eror');
                }
            });
        } else {
            this.newsService.create(tmp).subscribe(res => {
                if (res.body.status === 200) {
                    console.log(res.body);
                    //chuyển hướng
                    this.router.navigate(['/admin/news']);
                } else {
                    alert(res.body.msg);
                    console.log('error');
                }
            });
        }
    }

    changeCustomUri($event) {
        this.isCustomUri = $event.target.checked;
    }

    focusoutName() {
        if (this.isCustomUri) {
            const name: string = this.newsFormGroup.get('title').value;
            this.newsFormGroup.get('url').setValue(xoaDau(name));
        }
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
}
