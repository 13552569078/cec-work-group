import { Indexable } from 'fx-front-utils';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const g = require('./global-api-params.ts');

// webpack 对于 import.meta.env 的解析参考：https://www.npmjs.com/package/@open-wc/webpack-import-meta-loader
function getConfig(configName: string) {
  if (typeof process.env !== 'undefined') {
    return process.env[configName];
  }
  return '';
}

const getGlobalApiConfig = () => {
  const obj: Indexable<any> = {};
  g.globalAPIParamsList.forEach((paramKey: string) => {
    obj[paramKey] = getConfig(paramKey);
  });
  return obj;
};

const GlobalAPI: Indexable<any> = {
  config: getGlobalApiConfig(),
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
