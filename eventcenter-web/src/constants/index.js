/*
 * 所有常量入口
 *
 * @Author:
 * @Date:      2023-11-06
 */
export const PAGE_SIZE = 10

// 登录页面名字
export const PAGE_PATH_LOGIN = '/login'

// 404页面名字
export const PAGE_PATH_404 = '/404'

// 接口返回成功码
export const SUCCESS_CODE = 0

export const PLATFORM_CODE = 'COUNTY'

export const HANDLE_STATE_LIST = [
  { dictValue: '', dictDesc: '全部', dictSvg: 'svg-warn' },
  { dictValue: '1', dictDesc: '待流转', dictSvg: 'svg-warn' },
  { dictValue: '8', dictDesc: '流转异常', dictSvg: 'svg-error' },
  { dictValue: '5', dictDesc: '处置异常', dictSvg: 'svg-error' }
]

export const HANDLE_WORK_STATE_LIST = [
  { dictValue: '', dictDesc: '全部', dictSvg: 'svg-warn' },
  { dictValue: '1', dictDesc: '待审核', dictSvg: 'svg-warn' },
  { dictValue: '2', dictDesc: '待调度', dictSvg: 'svg-warn' },
  { dictValue: '3', dictDesc: '待处理', dictSvg: 'svg-warn' },
  { dictValue: '4', dictDesc: '待结案', dictSvg: 'svg-warn' }
]

// 权责状态
export const EVENTTYPEDUTYSTATE = [
  { dictValue: 0, dictDesc: '未设置' },
  { dictValue: 1, dictDesc: '未启用' },
  { dictValue: 2, dictDesc: '已启用' }
]

// 职能部门启停状态
export const DUTYDEPTSTATE = [
  { dictValue: 0, dictDesc: '停用' },
  { dictValue: 1, dictDesc: '启用' }
]

export const EMPTY_STRING = '--'

export default {
  PAGE_SIZE,
  PAGE_PATH_LOGIN,
  PAGE_PATH_404,
  SUCCESS_CODE,
  HANDLE_STATE_LIST,
  HANDLE_WORK_STATE_LIST,
  EVENTTYPEDUTYSTATE,
  EMPTY_STRING,
  DUTYDEPTSTATE
}

export const PROVINCE_SHORT_MAPPING_DATA = new Map(
  [
    ['北京市', { id: 1, name: '北京市', shortName: '京' }],
    ['天津市', { id: 2, name: '天津市', shortName: '津' }],
    ['河北省', { id: 3, name: '河北省', shortName: '河' }],
    ['山西省', { id: 4, name: '山西省', shortName: '晋' }],
    ['内蒙古自治区', { id: 5, name: '内蒙古自治区', shortName: '蒙' }],
    ['辽宁省', { id: 6, name: '辽宁省', shortName: '辽' }],
    ['吉林省', { id: 7, name: '吉林省', shortName: '吉' }],
    ['黑龙江省', { id: 8, name: '黑龙江省', shortName: '黑' }],
    ['上海市', { id: 9, name: '上海市', shortName: '沪' }],
    ['江苏省', { id: 10, name: '江苏省', shortName: '苏' }],
    ['浙江省', { id: 11, name: '浙江省', shortName: '浙' }],
    ['安徽省', { id: 12, name: '安徽省', shortName: '皖' }],
    ['福建省', { id: 13, name: '福建省', shortName: '闽' }],
    ['江西省', { id: 14, name: '江西省', shortName: '赣' }],
    ['山东省', { id: 15, name: '山东省', shortName: '鲁' }],
    ['河南省', { id: 16, name: '河南省', shortName: '豫' }],
    ['湖北省', { id: 17, name: '湖北省', shortName: '鄂' }],
    ['湖南省', { id: 18, name: '湖南省', shortName: '湘' }],
    ['广东省', { id: 19, name: '广东省', shortName: '粤' }],
    ['广西壮族自治区', { id: 20, name: '广西壮族自治区', shortName: '桂' }],
    ['海南省', { id: 21, name: '海南省', shortName: '琼' }],
    ['重庆市', { id: 22, name: '重庆市', shortName: '渝' }],
    ['四川省', { id: 23, name: '四川省', shortName: '川' }],
    ['贵州省', { id: 24, name: '贵州省', shortName: '贵' }],
    ['云南省', { id: 25, name: '云南省', shortName: '云' }],
    ['西藏自治区', { id: 26, name: '西藏自治区', shortName: '藏' }],
    ['陕西省', { id: 27, name: '陕西省', shortName: '陕' }],
    ['甘肃省', { id: 28, name: '甘肃省', shortName: '甘' }],
    ['青海省', { id: 29, name: '青海省', shortName: '青' }],
    ['宁夏回族自治区', { id: 30, name: '宁夏回族自治区', shortName: '宁' }],
    ['新疆维吾尔自治区', { id: 31, name: '新疆维吾尔自治区', shortName: '新' }],
    ['香港特别行政区', { id: 32, name: '香港特别行政区', shortName: '港' }],
    ['澳门特别行政区', { id: 33, name: '澳门特别行政区', shortName: '澳' }],
    ['台湾省', { id: 33, name: '台湾省', shortName: '台' }]
  ]
)

export const KEYWORD_TYPE_OPTIONS = [
  {
    dictDesc: '全部结果',
    dictValue: '0'
  },
  {
    dictDesc: '事件标题',
    dictValue: '1'
  },
  {
    dictDesc: '事件类型',
    dictValue: '2'
  },
  {
    dictDesc: '事件描述',
    dictValue: '3'
  },
  {
    dictDesc: '上报人',
    dictValue: '4'
  },
  {
    dictDesc: '详细地址',
    dictValue: '5'
  }
]
