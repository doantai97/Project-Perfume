// These constants are injected via webpack environment variables.
// You can add more variables in webpack.common.js or in profile specific webpack.<dev|prod>.js files.
// If you change the values in the webpack config files, you need to re run webpack to update the application
import {environment} from './../environments/environment';

export const SERVER_API_URL = environment.SERVER_URL + '/api';
export const SERVER_API_IMAGE = environment.SERVER_URL + '/api/storage/';
export const SERVER_URL = environment.SERVER_URL;
export const USER_LOGIN = 'USER_LOGIN';
export const CART_ITEM = 'CART_ITEM';
export const DEFAULTPASSWORD = '123456';

