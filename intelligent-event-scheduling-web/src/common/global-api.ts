import { Indexable } from 'fx-front-utils';

// webpack 对于 import.meta.env 的解析参考：https://www.npmjs.com/package/@open-wc/webpack-import-meta-loader
function getConfig(configName: string): string {
  if (typeof process.env !== 'undefined') {
    return process.env[configName]!;
  }
  return '';
}

const GlobalAPI = {
  config: {
    BASE_URL: getConfig('BASE_URL'),
    API_PREFIX_CENTRE_CONFIG: getConfig('API_PREFIX_CENTRE_CONFIG'),
    FILE_SERVICE: getConfig('FILE_SERVICE'),
    FILE_VIEW: getConfig('FILE_VIEW'),
    HONGLING_BASE_URL: getConfig('HONGLING_BASE_URL'),
    SWAN_TENANT_ID_SETTINGS_PORTAL: getConfig('SWAN_TENANT_ID_SETTINGS_PORTAL'),
    SWAN_SYSTEM_ID_SETTINGS_PORTAL: getConfig('SWAN_SYSTEM_ID_SETTINGS_PORTAL'),
    API_PREFIX_SWAN_UCENTER: getConfig('API_PREFIX_SWAN_UCENTER'),
    PORTAL_URL: getConfig('PORTAL_URL'),
    SWAN_TENANT_ID_SWAN_EVENT_HANDLE: getConfig('SWAN_TENANT_ID_SWAN_EVENT_HANDLE'),
    SWAN_SYSTEM_ID_SWAN_EVENT_HANDLE: getConfig('SWAN_SYSTEM_ID_SWAN_EVENT_HANDLE'),
    API_PREFIX_EVENT_HANDLE_STRATEGY: getConfig('API_PREFIX_EVENT_HANDLE_STRATEGY'),
    API_PREFIX_USER_CENTER: getConfig('API_PREFIX_USER_CENTER'),
    CLIENT_ID_EVENT_HANDLE: getConfig('CLIENT_ID_EVENT_HANDLE'),
    CALLBACK_URL_CENTRE_CONFIG: getConfig('CALLBACK_URL_CENTRE_CONFIG'),
    LOGIN_URL_USER_CENTER: getConfig('LOGIN_URL_USER_CENTER'),
    PROD_PREFIX: getConfig('PROD_PREFIX'),
  },
  areaCode: '3207',
  userInfo: {
    name: '',
    mobile: '',
  },
  yskInfo: {
    token: '',
  }
};
export { GlobalAPI };
