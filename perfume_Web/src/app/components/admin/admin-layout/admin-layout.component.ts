import {Component, ElementRef} from '@angular/core';
import {INavData} from '@coreui/angular';
import {AuthenticationService} from '../../../service/authentication.service';
import {getImg} from '../../../comom/constant/base.constant';
import {User} from '../../../model/user';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../../../service/user.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-dashboard',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent {
    public sidebarMinimized = false;
    public navItems = navItemsEmploy;
    userLogin: User;
    userFormGroup: FormGroup;

    //img
    imageDefault = 'http://placehold.it/380x500';
    imageError: string;
    isImageSaved: boolean;
    cardImageBase64: string;


    constructor(
        private elRef: ElementRef,
        public authenticationService: AuthenticationService,
        private modalService: NgbModal,
        protected router: Router,
        private fb: FormBuilder,
        private userService: UserService,
    ) {
        const tmp = this.elRef.nativeElement.querySelector('link[tag="web"]');
        console.log(tmp);

        this.authenticationService.currentUser.subscribe(value => {
            if (value) {
                this.userService.find(value.user.id).subscribe(res => {
                    this.userLogin = res.body;
                    this.userFormGroup = this.initUserForm();
                    this.imageDefault = this.getAvatar();
                });

                if (this.authenticationService.isAdmin) {
                    const tmp: INavData[] = [
                        ...navItemsAdmin,
                        ...navItemsEmploy,
                    ];
                    this.navItems = tmp;
                } else {
                    this.navItems = navItemsEmploy;
                }
            } else {
                this.userLogin = null;
            }
        });
    }

    initUserForm() {
        return this.fb.group({
            id: [this.userLogin.id],
            username: [this.userLogin.username, [Validators.required]],
            firstname: [this.userLogin.firstname, [Validators.required]],
            lastname: [this.userLogin.lastname, [Validators.required]],
            email: [this.userLogin.email, [Validators.required, Validators.email]],
            phone: [this.userLogin.phone, [Validators.required, Validators.pattern('0[0-9\s.-]{9,13}')]],
            address: [this.userLogin.address, [Validators.required]],
            imageBase64: []
        });
    }


    toggleMinimize(e) {
        this.sidebarMinimized = e;
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/home']);
    }

    getAvatar() {
        if (this.userLogin != null) {
            return getImg(this.userLogin.image);
        }
        return 'assets/img/avatars/6.jpg';

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
                this.save();
            }
        });
    }

    removeImage() {
        this.cardImageBase64 = null;
        this.isImageSaved = false;
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

    isSave() {
        return !this.userFormGroup.invalid
    }

    save() {
        const tmp: User = this.userFormGroup.value;
        if (this.isImageSaved) {
            tmp.image = this.cardImageBase64;
        }
        console.log(tmp);
        this.userService.update(tmp).subscribe(res => {
            if (res.status === 200) {
                window.location.reload();
            } else {
                alert('eror');
            }
        });

    }

}

export const navItemsAdmin: INavData[] = [
    {
        title: true,
        name: 'Admin',
    },
    {
        name: 'Tài khoản',
        url: '/admin/user',
        icon: 'icon-user',
    },
    {
        name: 'Mã Giảm Giá',
        url: '/admin/coupon',
        icon: 'cui-code',
    },
    {
        name: 'Trang tĩnh',
        url: '/admin/display-static',
        icon: 'icon-book-open',
    },
];
export const navItemsEmploy: INavData[] = [
    {
        name: 'Dashboard',
        url: '/admin/dashboard',
        icon: 'icon-speedometer',
        badge: {
            variant: 'info',
            text: 'NEW',
        },
    },
    {
        title: true,
        name: 'Nhân viên',
    },
    {
        name: 'Bài viết',
        url: '/admin/news',
        icon: 'icon-book-open',
    },
    {
        name: 'Thể loại',
        url: '/admin/category',
        icon: 'cui-layers',
    },
    {
        name: 'Nhà sản xuất',
        url: '/admin/producer',
        icon: 'icon-people',
    },
    {
        name: 'Sản phẩm',
        url: '/admin/product',
        icon: 'icon-drop',
    },
    {
        name: 'Nồng độ',
        url: '/admin/amount',
        icon: 'icon-options',
    },
    {
        name: 'Mùi hương',
        url: '/admin/fragrant',
        icon: 'cui-rss',
    },
    // {
    //     name: 'Album',
    //     url: '/admin/album',
    //     icon: 'icon-book-open',
    // },
    {
        title: true,
        name: 'Đơn Hàng',
    },
    {
        name: 'Tất cả',
        url: '/admin/checkout/all',
        icon: 'icon-support',
    },
    {
        name: 'Đơn Mới',
        url: '/admin/checkout/active',
        icon: 'cui-user-follow',
    },
    {
        name: 'Đang Vận Chuyển',
        url: '/admin/checkout/delivery',
        icon: 'cui-share',
    },
    {
        name: 'Hoàn Thành',
        url: '/admin/checkout/done',
        icon: 'cui-circle-check',
    },
    {
        name: 'Hủy',
        url: '/admin/checkout/deleted',
        icon: 'cui-circle-x',
    },
    // {
    //     title: true,
    //     name: 'Theme',
    // },
    // {
    //     name: 'Colors',
    //     url: '/admin/theme/colors',
    //     icon: 'icon-drop',
    // },
    // {
    //     name: 'Typography',
    //     url: '/admin/theme/typography',
    //     icon: 'icon-pencil',
    // },
    // {
    //     title: true,
    //     name: 'Components',
    // },
    // {
    //     name: 'Base',
    //     url: '/admin/base',
    //     icon: 'icon-puzzle',
    //     children: [
    //         {
    //             name: 'Cards',
    //             url: '/admin/base/cards',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Carousels',
    //             url: '/admin/base/carousels',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Collapses',
    //             url: '/admin/base/collapses',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Forms',
    //             url: '/admin/base/forms',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Navbars',
    //             url: '/admin/base/navbars',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Pagination',
    //             url: '/admin/base/paginations',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Popovers',
    //             url: '/admin/base/popovers',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Progress',
    //             url: '/admin/base/progress',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Switches',
    //             url: '/admin/base/switches',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Tables',
    //             url: '/admin/base/tables',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Tabs',
    //             url: '/admin/base/tabs',
    //             icon: 'icon-puzzle',
    //         },
    //         {
    //             name: 'Tooltips',
    //             url: '/admin/base/tooltips',
    //             icon: 'icon-puzzle',
    //         },
    //     ],
    // },
    // {
    //     name: 'Buttons',
    //     url: '/admin/buttons',
    //     icon: 'icon-cursor',
    //     children: [
    //         {
    //             name: 'Buttons',
    //             url: '/admin/buttons/buttons',
    //             icon: 'icon-cursor',
    //         },
    //         {
    //             name: 'Dropdowns',
    //             url: '/admin/buttons/dropdowns',
    //             icon: 'icon-cursor',
    //         },
    //         {
    //             name: 'Brand Buttons',
    //             url: '/admin/buttons/brand-buttons',
    //             icon: 'icon-cursor',
    //         },
    //     ],
    // },
    // {
    //     name: 'Charts',
    //     url: '/admin/charts',
    //     icon: 'icon-pie-chart',
    // },
    // {
    //     name: 'Icons',
    //     url: '/admin/icons',
    //     icon: 'icon-star',
    //     children: [
    //         {
    //             name: 'CoreUI Icons',
    //             url: '/admin/icons/coreui-icons',
    //             icon: 'icon-star',
    //             badge: {
    //                 variant: 'success',
    //                 text: 'NEW',
    //             },
    //         },
    //         {
    //             name: 'Flags',
    //             url: '/admin/icons/flags',
    //             icon: 'icon-star',
    //         },
    //         {
    //             name: 'Font Awesome',
    //             url: '/admin/icons/font-awesome',
    //             icon: 'icon-star',
    //             badge: {
    //                 variant: 'secondary',
    //                 text: '4.7',
    //             },
    //         },
    //         {
    //             name: 'Simple Line Icons',
    //             url: '/admin/icons/simple-line-icons',
    //             icon: 'icon-star',
    //         },
    //     ],
    // },
    // {
    //     name: 'Notifications',
    //     url: '/admin/notifications',
    //     icon: 'icon-bell',
    //     children: [
    //         {
    //             name: 'Alerts',
    //             url: '/admin/notifications/alerts',
    //             icon: 'icon-bell',
    //         },
    //         {
    //             name: 'Badges',
    //             url: '/admin/notifications/badges',
    //             icon: 'icon-bell',
    //         },
    //         {
    //             name: 'Modals',
    //             url: '/admin/notifications/modals',
    //             icon: 'icon-bell',
    //         },
    //     ],
    // },
    // {
    //     name: 'Widgets',
    //     url: '/admin/widgets',
    //     icon: 'icon-calculator',
    //     badge: {
    //         variant: 'info',
    //         text: 'NEW',
    //     },
    // },
    // {
    //     divider: true,
    // },
    // {
    //     title: true,
    //     name: 'Extras',
    // },
    // {
    //     name: 'Pages',
    //     url: '/pages',
    //     icon: 'icon-star',
    //     children: [
    //         {
    //             name: 'Login',
    //             url: '/login',
    //             icon: 'icon-star',
    //         },
    //         {
    //             name: 'Register',
    //             url: '/register',
    //             icon: 'icon-star',
    //         },
    //         {
    //             name: 'Error 404',
    //             url: '/404',
    //             icon: 'icon-star',
    //         },
    //         {
    //             name: 'Error 500',
    //             url: '/500',
    //             icon: 'icon-star',
    //         },
    //     ],
    // },
    // {
    //     name: 'Disabled',
    //     url: '/dashboard',
    //     icon: 'icon-ban',
    //     badge: {
    //         variant: 'secondary',
    //         text: 'NEW',
    //     },
    //     attributes: {disabled: true},
    // },
    // {
    //     name: 'Download CoreUI',
    //     url: 'http://coreui.io/angular/',
    //     icon: 'icon-cloud-download',
    //     class: 'mt-auto',
    //     variant: 'success',
    //     attributes: {target: '_blank', rel: 'noopener'},
    // },
    // {
    //     name: 'Try CoreUI PRO',
    //     url: 'http://coreui.io/pro/angular/',
    //     icon: 'icon-layers',
    //     variant: 'danger',
    //     attributes: {target: '_blank', rel: 'noopener'},
    // },
];
