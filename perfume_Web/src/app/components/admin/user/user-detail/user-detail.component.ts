import {Component, OnInit} from '@angular/core';
import * as _ from 'lodash';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {UserService} from '../../../../service/user.service';
import {AuthenticationService} from '../../../../service/authentication.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../../model/user';
import {SERVER_URL, DEFAULTPASSWORD} from '../../../../app.constants';
import {getUrlScheme} from '@angular/compiler';
import {getImg} from '../../../../comom/constant/base.constant';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

    //img
    imageDefault = 'http://placehold.it/380x500';
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;

    //mutil select
    dropdownList = [];
    selectedItems = [];
    dropdownSettings: IDropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: true
    };


    userFormGroup: FormGroup;
    userEdit: User = null;
    isUpdate = false;


    constructor(private userService: UserService,
                private authenticationService: AuthenticationService,
                protected router: Router,
                protected activatedRoute: ActivatedRoute,
                private modalService: NgbModal,
                private fb: FormBuilder,
                private route: ActivatedRoute,
    ) {
        this.userFormGroup = this.initForm();
        this.activatedRoute.paramMap.subscribe(param => {
            const username = this.route.snapshot.paramMap.get('id');
            this.isUpdate = username !== null;
            this.findByUsername(username);
            this.loadAll();
        });
    }

    findByUsername(username: string) {
        const userFiltet: User = {
            username: username
        };
        if (!username) {
            return;
        }
        this.userService.filterAll(userFiltet).subscribe(res => {
            if (res.body.length > 0) {
                this.userEdit = res.body[0];
            }
            this.isUpdate = this.userEdit !== null;
            if (this.userEdit != null) {
                this.selectedItems = this.userEdit.roles;
                this.addValueInForm();
                this.imageDefault = getImg(this.userEdit.image);
            } else {
                // this.router.navigate(['404']);
            }
        });
    }

    addValueInForm() {
        this.userFormGroup.setValue({
            id: this.userEdit.id,
            username: this.userEdit.username,
            firstname: this.userEdit.firstname,
            lastname: this.userEdit.lastname,
            password: this.userEdit.password,
            email: this.userEdit.email,
            phone: this.userEdit.phone,
            address: this.userEdit.address,
            imageBase64: this.userEdit.image
        });
    }




    initForm() {
        return this.fb.group({
            id: [],
            username: [null, [Validators.required]],
            firstname: [null, [Validators.required]],
            lastname: [null, [Validators.required]],
            password: [],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required,  Validators.pattern('0[0-9\s.-]{9,13}')]],
            address: [null, [Validators.required]],
            imageBase64: []
        });
    }

    isSave() {
        const tmp =
            !this.userFormGroup.invalid &&
            (this.isUpdate ? true : this.isImageSaved) && this.selectedItems.length > 0;
        return tmp;
    }

    reset() {
        if (this.userEdit !== null) {
            this.selectedItems = this.userEdit.roles;
            this.addValueInForm();
            this.imageDefault = getImg(this.userEdit.image);
        }
        else {
            this.userFormGroup.setValue({
                id: '',
                username: '',
                firstname: '',
                lastname: '',
                password: '',
                email: '',
                phone: '',
                address: '',
                imageBase64: null,
            });
            this.selectedItems = [];
        }
    }

    save() {
        const tmp: User = this.userFormGroup.value;
        tmp.roles = this.selectedItems;
        if (this.isImageSaved) {
            tmp.image = this.cardImageBase64;
        }
        console.log(tmp);
        if (this.isUpdate) {
            this.userService.update(tmp).subscribe(res => {
                if (res.status === 200) {
                    this.router.navigate(['/admin/user']);
                } else {
                    alert('eror');
                }
            });
        } else {
            this.userService.filterAll({username: tmp.username}).subscribe(resCode => {
                if (resCode.body['status'] === 200) {
                    alert('Đã tồn tại username ');
                } else {
                    tmp.password = DEFAULTPASSWORD;
                    console.log(tmp);
                    this.userService.create(tmp).subscribe(res => {
                        if (res.body.status === 200) {
                            console.log(res.body);
                            //chuyển hướng
                            this.router.navigate(['/admin/user']);
                        } else {
                            alert(res.body.msg);
                            console.log('error');
                        }
                    });
                }
            });
        }
    }

    ngOnInit(): void {

    }

    loadAll() {
        this.authenticationService.getAllRole().subscribe(res => {
            this.dropdownList = res.body;
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

    onItemSelect($event) {
        console.log(this.selectedItems);
    }

    onSelectAll($event) {
        this.selectedItems = $event;
        console.log(this.selectedItems);
    }

}
