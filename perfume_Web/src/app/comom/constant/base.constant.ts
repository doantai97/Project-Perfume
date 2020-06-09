import {Category} from '../../model/category.model';
import {SERVER_API_IMAGE} from '../../app.constants';

export const getImg = (img) => {
    return `${SERVER_API_IMAGE}${img}`;
};

export const formatCurency = (value) => {
    return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + '₫';
};
export const PAGING_PER_PAGE = [
    {label: 5, value: 5},
    {label: 10, value: 10},
    {label: 20, value: 20},
    {label: 50, value: 50},
    {label: 100, value: 100}];

export const CATEGORIES_DEFAUT: Array<Category> = [
    {
        id: 1,
        code: 'hot',
        name: 'Hàng Hot'
    },
    {
        id: 2,
        code: 'ban-chay',
        name: 'Bán Chạy'
    }
];

export const CONSTANT_PATH = {
    LIST_PRODUCT: 'products',
    DETAIL_PRODUCT: 'product',
    CHECKOUT: 'checkout',
    CART: 'cart',
    BLOG: 'blog',
    ABOUT: 'about',
    LOGIN: 'login',
    REGISTER: 'register',
    CONTACT: 'contact',
    HOME: 'home'
};

export const ROLE = {
    USER: 'USER',
    EMPLOYEE: 'EMPLOYEE',
    ADMIN: 'ADMIN'
};


export const HIGHLIGHT = {
    HOT: 'HOT',
    NEW: 'NEW'
};

export class ResponData {
    status: number;
    msg: string;
    data: any;
}

export const COMMENT_TYPE = {
    PRODUCT: 'product',
    NEWS: 'news'
};

export const CKEDITOR_CONFIG = {
    toolbar: [
        {
            name: 'document',
            groups: ['mode', 'document', 'doctools'],
            items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates']
        },
        {
            name: 'clipboard',
            groups: ['clipboard', 'undo'],
            items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']
        },
        {name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt']},
        {name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField']},
        '/',
        {
            name: 'basicstyles',
            groups: ['basicstyles', 'cleanup'],
            items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat']
        },
        {
            name: 'paragraph',
            groups: ['list', 'indent', 'blocks', 'align', 'bidi'],
            items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language']
        },
        {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
        {name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe']},
        '/',
        {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
        {name: 'colors', items: ['TextColor', 'BGColor']},
        {name: 'tools', items: ['Maximize', 'ShowBlocks']},
        {name: 'others', items: ['-']},
        {name: 'about', items: ['About']}
    ],
    toolbarGroups: [
        {name: 'document', groups: ['mode', 'document', 'doctools']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker']},
        {name: 'forms'},
        '/',
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi']},
        {name: 'links'},
        {name: 'insert'},
        '/',
        {name: 'styles'},
        {name: 'colors'},
        {name: 'tools'},
        {name: 'others'},
        {name: 'about'}
    ]
};

