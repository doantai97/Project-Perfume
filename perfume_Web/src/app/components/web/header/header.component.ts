import {Component, OnInit} from '@angular/core';
import {User} from '../../../model/user';
import {AuthenticationService} from '../../../service/authentication.service';
import {CONSTANT_PATH, getImg} from './../../../comom/constant/base.constant';
import {CartService} from '../../../service/cart.service';
import {CategoryService} from '../../../service/category.service';
import {Category} from '../../../model/category.model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../service/user.service';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import * as _ from 'lodash';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    CONSTANT_PATH = CONSTANT_PATH;
    userLogin: User;
    lengthCartItem = 0;
    categories: Array<Category>;
    changePasswordForm: FormGroup;

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

    constructor(public authenticationService: AuthenticationService, private cartService: CartService,
                private modalService: NgbModal,
                private categoryService: CategoryService,
                private userService: UserService,
                private fb: FormBuilder) {
        this.initForm();
        this.userFormGroup = this.initUserForm();
    }

    get isManager() {
        return this.authenticationService.isEmploy || this.authenticationService.isAdmin;
    }

    ngOnInit(): void {
        this.authenticationService.currentUser.subscribe(value => {
            if (value) {
                this.userLogin = value.user;
                this.findByUsername(this.userLogin.id, true);
                this.changePasswordForm.get('username').setValue(this.userLogin.username);
                this.cartService.findByUserLogin(this.userLogin.id).subscribe(res => {
                    console.log(res.body);
                });
            } else {
                this.userLogin = null;
            }
        });

        this.cartService.currentCart.subscribe(value => {
            if (value) {
                this.lengthCartItem = value.length;
            } else {
                this.lengthCartItem = 0;
            }
        });

        this.categoryService.filterAll().subscribe(res => {
            this.categories = res.body;
        });


    }

    initForm() {
        this.changePasswordForm = this.fb.group({
            username: [null, [Validators.required]],
            oldPassworld: ['', [Validators.required]],
            password: ['', [Validators.required]],
            confirmPassword: ['', [Validators.required]],
        });
    }

    logout() {
        this.authenticationService.logout();
    }

    changePassword(modal) {
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(result => {
            if (result === 'save') {
                this.userService.changePassword(this.changePasswordForm.value).subscribe(res => {
                    if (res.body.status === 200) {
                        alert('Success');
                    } else {
                        alert(res.body['msg']);
                    }
                    this.changePasswordForm.reset();
                });
            }
        });
    }

    changeInfo(modal) {
        this.modalService
            .open(modal, {
                ariaLabelledBy: 'modal-basic-title',
                size: 'lg',
                backdrop: 'static'
            })
            .result.then(result => {
            if (result === 'save') {
                this.isUpdate = true;
                this.save();
            } else {
                this.findByUsername(this.userLogin.id);
            }
        });
    }

    findByUsername(id: number, isLoadUser = false) {
        if (!id) {
            return;
        }
        this.userService.find(id).subscribe(res => {
            console.log('fff', res.body);
            if (res.body) {
                this.userEdit = res.body;
            }
            this.isUpdate = this.userEdit !== null;
            if (this.userEdit != null) {
                this.selectedItems = this.userEdit.roles;
                this.addValueInForm();
                this.imageDefault = getImg(this.userEdit.image);
                // this.isImageSaved = false;
                // this.cardImageBase64 = null;
                // this.removeImage();
                if (!isLoadUser) {
                    this.userLogin = this.userEdit;
                    // const tmp = this.authenticationService.currentUserValue;
                    // tmp.user = this.userEdit;
                    // this.authenticationService.nextValue(tmp);
                }
            } else {
                // this.router.navigate(['404']);
            }
        });
    }

    isSave() {
        return !this.userFormGroup.invalid
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
                    // this.findByUsername(tmp.id);
                    window.location.reload();
                } else {
                    alert('eror');
                }
            });
        }
    }

    getAvatar(url) {
        console.log(url);
        return getImg(url);
    }

    addValueInForm() {
        this.userFormGroup.setValue({
            id: this.userEdit.id,
            username: this.userEdit.username,
            firstname: this.userEdit.firstname,
            lastname: this.userEdit.lastname,
            email: this.userEdit.email,
            phone: this.userEdit.phone,
            address: this.userEdit.address,
            imageBase64: this.userEdit.image
        });
    }

    initUserForm() {
        return this.fb.group({
            id: [],
            username: [null, [Validators.required]],
            firstname: [null, [Validators.required]],
            lastname: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.email]],
            phone: [null, [Validators.required, Validators.pattern('0[0-9\s.-]{9,13}')]],
            address: [null, [Validators.required]],
            imageBase64: []
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
