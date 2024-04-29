import { Indexable } from 'fx-front-utils';

// webpack 对于 import.meta.env 的解析参考：https://www.npmjs.com/package/@open-wc/webpack-import-meta-loader
function getConfig(configName: string) {
  if (typeof process.env !== 'undefined') {
    return process.env[configName];
  }
  return '';
}

const GlobalAPI: Indexable<any> = {
  config: {
    PROD_PREFIX: getConfig('PROD_PREFIX'),
    TITLE_ONEPIC_MONITOR_WARNING: getConfig('TITLE_ONEPIC_MONITOR_WARNING'),
    BASE_URL: getConfig('BASE_URL'),
    HONGLING_BASE_URL: getConfig('HONGLING_BASE_URL'),
    API_PREFIX_CENTRE_CONFIG: getConfig('API_PREFIX_CENTRE_CONFIG'),
    API_PREFIX_WEATHER: getConfig('API_PREFIX_WEATHER'),
    FILE_SERVICE: getConfig('FILE_SERVICE'),
    FILE_VIEW: getConfig('FILE_VIEW'),
    MAP_SERVICE: getConfig('MAP_SERVICE'),
    TITLE_ONEPIC_MONITOR: getConfig('TITLE_ONEPIC_MONITOR'),
    TITLE_ONEPIC_WARNING: getConfig('TITLE_ONEPIC_WARNING'),
    MAP_CONFIG_MONITOR_WARNING_ONEPIC: getConfig('MAP_CONFIG_MONITOR_WARNING_ONEPIC'),
    PORTAL_URL: getConfig('PORTAL_URL'),
  },
  areaCode: '320900',
  userInfo: {
    name: '',
    mobile: '',
  },
  yskInfo: {
    token: '',
  }
};
export { GlobalAPI };
