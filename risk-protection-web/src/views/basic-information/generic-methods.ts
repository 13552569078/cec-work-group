import { apiBasicInformationObj } from '@/apis/modules/basic-information';

const DICT = {
  RIVER_PROJECT_SCALE: [
    {
      code: "1",
      name: "小(1)型",
    },
    {
      code: "2",
      name: "小(2)型",
    },
    {
      code: "3",
      name: "中型",
    },
  ],
  SLUICE_TYPE: [
    {
      code: 1,
      name: "节制闸",
    },
    {
      code: 2,
      name: "引(进)水闸",
    },
  ],
  RIVER_REGION: [
    {
      code: "1",
      name: "全国",
    },
    {
      code: "130000",
      name: "河北省",
    },
    {
      code: "131100",
      name: "衡水市",
    },
    {
      code: "131127",
      name: "景县",
    },
  ],
  RIVER_CROSS_TYPE: [
    {
      code: "1",
      name: "县内",
    },
    {
      code: "2",
      name: "跨县",
    },
    {
      code: "3",
      name: "跨地市",
    },
    {
      code: "4",
      name: "跨省",
    },
  ],
  DISASTER_TYPE: [
    {
      code: "1",
      name: "地震灾害",
    },
    {
      code: "2",
      name: "台风灾害",
    },
    {
      code: "3",
      name: "风雹灾害",
    },
    {
      code: "4",
      name: "低温冷冻灾害",
    },
    {
      code: "5",
      name: "雪灾",
    },
    {
      code: "6",
      name: "森林火灾",
    },
    {
      code: "7",
      name: "干旱灾害",
    },
    {
      code: "8",
      name: "洪涝灾害",
    },
    {
      code: "9",
      name: "沙尘暴灾害",
    },
    {
      code: "10",
      name: "地质灾害",
    },
    {
      code: "11",
      name: "海洋灾害",
    },
    {
      code: "99",
      name: "其他",
    },
  ],
  DISASTER_SMALL_TYPE: [
    { code: 1, name: '地质灾害_崩塌' },
    { code: 2, name: '地质灾害_滑坡' },
    { code: 3, name: '地质灾害_泥石流' },
    { code: 4, name: '地质灾害_其他' },
    { code: 5, name: '海洋灾害_风暴潮' },
    { code: 6, name: '海洋灾害_海冰' },
    { code: 7, name: '海洋灾害_海浪' }
  ],
  COMMUNICSATION_METHOD: [
    {
      code: "1",
      name: "短信",
    },
    {
      code: "2",
      name: "电子广告牌",
    },
    {
      code: "3",
      name: "微信",
    },
    {
      code: "4",
      name: "广播",
    },
    {
      code: "5",
      name: "电话",
    },
  ],
  REPORTING_METHO: [
    {
      code: "4",
      name: "其他",
    },
    {
      code: "2",
      name: "微信",
    },
    {
      code: "3",
      name: "网络系统",
    },
    {
      code: "1",
      name: "电话",
    },
  ],
  RESERVE_METHOD: [
    {
      code: "1",
      name: "实物储备",
    },
    {
      code: "2",
      name: "协议储备",
    },
    {
      code: "3",
      name: "无储备",
    },
    {
      code: "4",
      name: "其他",
    },
  ],
  OPTION: [
    {
      code: 1,
      name: "是",
    }, {
      code: 2,
      name: "否",
    },
  ],
  GUARANTEE_METHOD: [
    {
      code: 1,
      name: "纳入财政预算",
    },
    {
      code: 2,
      name: "一定额度内，随支随报",
    },
    {
      code: 3,
      name: "无",
    },
    {
      code: 4,
      name: "其他",
    }
  ],
  STAR_RATED: [
    {
      code: "1",
      name: "一星级",
    },
    {
      code: "2",
      name: "二星级",
    },
    {
      code: "3",
      name: "三星级",
    },
    {
      code: "4",
      name: "四星级",
    },
    {
      code: "5",
      name: "五星级",
    }
  ],
  PARK_CERT: [
    {
      code: 1,
      name: "已认定",
    },
    {
      code: 2,
      name: "未认定",
    },
  ],
  ORG_LEVEL: [
    {
      code: 1,
      name: "中央级",
    },
    {
      code: 2,
      name: "省级",
    },
    {
      code: 3,
      name: "市级",
    },
    {
      code: 4,
      name: "县级",
    },
    {
      code: 5,
      name: "其他",
    },
  ],
  ORG_TYPE: [
    {
      code: 1,
      name: "社会团体",
    },
    {
      code: 2,
      name: "企业",
    },
    {
      code: 3,
      name: "民办非企业",
    },
    {
      code: 4,
      name: "基金会",
    },
    {
      code: 5,
      name: "慈善组织",
    },
    {
      code: 6,
      name: "其他法人",
    },
  ],
  REG_AUTH_TYPE: [
    {
      code: 1,
      name: "民政部",
    },
    {
      code: 2,
      name: "省/自治区/直辖市民政厅（局）",
    },
    {
      code: 3,
      name: "地市级民政局",
    },
    {
      code: 4,
      name: "县/区级民政局",
    },
    {
      code: 5,
      name: "其他",
    },
  ],
  MAIN_BUSINESS: [
    {
      code: "1",
      name: "科普宣传",
    },
    {
      code: "2",
      name: "应急救援（抢险）",
    },
    {
      code: "3",
      name: "救灾赈灾",
    },
    {
      code: "4",
      name: "物资生产、运输等保障活动",
    },
    {
      code: "5",
      name: "其他",
    },
  ],
  MAIN_RESCUE_SPEC: [
    {
      code: "1",
      name: "城市搜救",
    },
    {
      code: "2",
      name: "高空绳索救援",
    },
    {
      code: "3",
      name: "山地救援",
    },
    {
      code: "4",
      name: "水上搜救",
    },
    {
      code: "5",
      name: "潜水救援",
    },
    {
      code: "6",
      name: "医疗救助",
    },
    {
      code: "7",
      name: "后勤保障",
    },
    {
      code: "8",
      name: "其他",
    },
  ],
  AGENCY_LEVEL: [
    {
      code: 1,
      name: "省级（省级各行业部门）",
    },
    {
      code: 2,
      name: "市级（市级各行业部门）",
    },
    {
      code: 3,
      name: "县级（县级各行业部门）",
    },
  ],
  DISASTER_MGMT_DOMAIN: [
    {
      code: "1",
      name: "地震灾害",
    },
    {
      code: "2",
      name: "地质灾害",
    },
    {
      code: "3",
      name: "气象灾害",
    },
    {
      code: "4",
      name: "水旱灾害",
    },
    {
      code: "5",
      name: "海洋灾害",
    },
    {
      code: "6",
      name: "森林草原火灾",
    },
    {
      code: "7",
      name: "其他灾害",
    },
    {
      code: "8",
      name: "综合减灾",
    },
  ],
};

const exportMethods = async(code: string) => {
  await apiBasicInformationObj[`getExport${code}` as 'getExportDisasterPublicPlace']();
};

export {
  DICT,
  exportMethods,
};
