import { XMap } from '@hongtu-next/core';
import { computed, ref } from 'vue';

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
export const ACTION_TYPE_DES_MAP = {
  [ACTION_ADD]: '新增',
  [ACTION_EDIT]: '编辑',
  [ACTION_DETAIL]: '查看'
};
export const TINYMCE_KEY = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';
export const TINY_SRC = process.env.NODE_ENV === 'production' ? `${window.location.origin}/linkage-command-event-handle-web/tinymce/tinymce.min.js` : '/tinymce/tinymce.min.js';

const mapTypes = ref(['vec', 'cva']);
const tiandituToken = 'b8ed92ff9b64aebcb0110acca15e478f';
const mapStyle = ref({
  version: 8,
  sources: {},
  layers: [],
  glyphs: '/supermap/{fontstack}/{range}.pbf',
  sprite: ''
});
const layerUrls = computed(() => {
  const { protocol } = window.location;
  return mapTypes.value.map(
    (type: string) => `${protocol}//t{s}.tianditu.gov.cn/${type}_w/wmts?tk=${tiandituToken}`
  );
});
const iconStyle = [
  {
    name: 'addressIcon',
    type: 'link:png',
    url: __webpack_public_path__ + 'map/new-loc.png',
    anchor: [28, 0],
    size: [42, 42]
  },
  {
    name: 'locIcon',
    type: 'link:svg',
    url: __webpack_public_path__ + 'map/event-loc.svg',
    anchor: [16.5, 56],
    size: [33, 56]
  },
  {
    name: 'newLocIcon',
    type: 'link:png',
    url: __webpack_public_path__ + 'map/new-loc.png',
    anchor: [28, 56],
    size: [56, 56]
  },
  {
    name: 'poiIcon',
    type: 'link:svg',
    url: __webpack_public_path__ + 'map/search-marker.svg',
    anchor: [9, 11],
    size: [18, 22]
  },
  {
    name: 'assemblyIcon',
    type: 'link:svg',
    url: __webpack_public_path__ + 'map/assembly-loc.svg',
    anchor: [20, 40],
    size: [40, 40]
  },
  {
    name: 'assemblyMemberIcon',
    type: 'link:png',
    url: __webpack_public_path__ + 'map/assembly-user-icon.png',
    anchor: [15, 40],
    size: [30, 40]
  }
];
const mapCreatedHandler = (map: XMap) => {
  map.resize();
};

export const MAPBOX_CONFIG = {
  mapTypes,
  token: tiandituToken,
  mapStyle,
  layerUrls,
  iconStyle,
  mapCreatedHandler
};

export const DETAIL_PAGE_URLS = [
  'monitoring-config/details',
  'point/detail',
  'monitoring-config/second-trigger-detail',
];
