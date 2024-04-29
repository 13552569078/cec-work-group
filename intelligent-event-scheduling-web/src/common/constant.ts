/**
 * 用户授权缓存key
 */
const token = new URLSearchParams(window.location.search).get('token');
let AUTH_TOKEN: string;
if (token) {
  sessionStorage.setItem('TOKEN', token);
  AUTH_TOKEN = token as string;
} else {
  AUTH_TOKEN = sessionStorage.getItem('TOKEN') as string || '';
}
export { AUTH_TOKEN };

// 缓存前缀
export const DOMAIN = 'event.reception';
export const THEME_STYLE_NAME = 'newTheme';
export const THEME_ORIGIN_DATA = 'newThemeData';

export const ROOT_TREE_LEVEL = 1;
export const TOP_TREE_LEVEL = 3;

export const MAX_PAGE_SIZE = 9999999;

export const ACTION_ADD = 'add';
export const ACTION_EDIT = 'edit';
export const ACTION_DETAIL = 'detail';
export const TINYMCE_KEY = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
