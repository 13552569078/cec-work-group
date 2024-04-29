import { BasicResourceItem } from '@/types';

const addressLabels = [
  { label: '行政区划', key: 'areaCodeName' },
  { label: '详细地址', key: 'address' },
  { label: '经纬度', key: ['longitude', 'latitude'] },
];

const commonLabels = [
  { label: '名称', key: 'resName' },
  ...addressLabels,
];

const commonLabels2 = [
  { label: '名称', key: 'resName' },
  { label: '主管单位', key: 'managerUnit' },
  { label: '事件类型', key: 'eventTypeCodeName' },
  { label: '联系人', key: 'personName' },
  { label: '联系人电话', key: 'personMobile' },
  ...addressLabels,
];

const PREFIX_RISK = 'risk_';
const PREFIX_RESOURCE = 'resource_';
const PREFIX_PROTECT = 'protect_';
const RISK_NAME = 'risk';
const RESOURCE_NAME = 'resource';
const PROTECT_NAME = 'protect';

const RESOURCE_TEAM = `${PREFIX_RESOURCE}team`; // 队伍资源
const RESOURCE_MATERIAL = `${PREFIX_RESOURCE}material`; // 储备库
const RESOURCE_EQUIP = `${PREFIX_RESOURCE}equip`; // 装备
const RESOURCE_EXPERT = `${PREFIX_RESOURCE}expert`; // 专家
const RESOURCE_CARRIER = `${PREFIX_RESOURCE}carrier`; // 运输车辆
const RESOURCE_ORG = `${PREFIX_RESOURCE}org`; // 机构
const RESOURCE_ENTERPRISE = `${PREFIX_RESOURCE}enterprise`; // 企业
const RISK_REFUGE = `${PREFIX_RISK}refuge`; // 避难场所
const RISK_GEOLOGY_DISASTER = `${PREFIX_RISK}geology_disaster`; // 地质隐患点
const RISK_WATER_DISASTER = `${PREFIX_RISK}water_disaster`; // 森林火灾隐患点
const RISK_CHEMICAL_COMPANY = `${PREFIX_RISK}chemical_company`; // 危化企业
const RISK_WATERLOGGED_PLACE = `${PREFIX_RISK}waterlogged_place`; // 易涝点
const RISK_HAZARD = `${PREFIX_RISK}hazard`; // 重大危险源
const RISK_RESERVOIR = `${PREFIX_RISK}reservoir`; // 水库
const PROTECT_TRAFFIC = `${PREFIX_PROTECT}traffic`; // 交通枢纽
const PROTECT_LARGE_MARKET = `${PREFIX_PROTECT}large_market`; // 人员密集场所
const PROTECT_SCHOOL = `${PREFIX_PROTECT}school`; // 学校
const PROTECT_MEDICAL_INSTITUTION = `${PREFIX_PROTECT}medical_institution`; // 医疗机构
const PROTECT_BASE_FACILITIES = `${PREFIX_PROTECT}base_facilities`; // 重大基础设施

const FOCUS_GOAL = 'focus_goal'; // 重点关注目标

const ALL_RESOURCES_DICT: Record<string, {label: string; unit: string; [x: string]: any; }> = {
  [RISK_CHEMICAL_COMPANY]: { label: '危化企业', unit: '个' },
  [PROTECT_SCHOOL]: { label: '学校', unit: '所' },
  [PROTECT_TRAFFIC]: { label: '交通枢纽', unit: '个' },
  [PROTECT_LARGE_MARKET]: { label: '人员密集场所', unit: '个' },
  [PROTECT_BASE_FACILITIES]: { label: '重大基础设施', unit: '个' },
  [RISK_GEOLOGY_DISASTER]: { label: '地质隐患点', unit: '个' },
  [RISK_RESERVOIR]: { label: '水库', unit: '个' },
  [RISK_WATER_DISASTER]: { label: '森火隐患点', unit: '个' },
  [RISK_WATERLOGGED_PLACE]: { label: '易涝点', unit: '个' },
  [RESOURCE_EQUIP]: { label: '应急物资', unit: '个' },
  [RESOURCE_EXPERT]: { label: '应急专家', unit: '人' },
  [RESOURCE_MATERIAL]: { label: '物资储备', unit: '个' },
  [RISK_REFUGE]: { label: '避难场所', unit: '个' },
  [RESOURCE_TEAM]: { label: '救援队伍', unit: '支' },
  [PROTECT_MEDICAL_INSTITUTION]: { label: '医疗机构', unit: '间' },
  [RESOURCE_CARRIER]: { label: '运输车辆', unit: '个' },
  [RESOURCE_ORG]: { label: '机构', unit: '个' },
  [RESOURCE_ENTERPRISE]: { label: '企业', unit: '个' },
  [RISK_HAZARD]: { label: '重大危险源', unit: '个' },
};

const riskTypeList: Array<{label: string; value: string; [x: string]: any; }> = [
  { ...ALL_RESOURCES_DICT[RISK_GEOLOGY_DISASTER], value: RISK_GEOLOGY_DISASTER },
  { ...ALL_RESOURCES_DICT[RISK_WATER_DISASTER], value: RISK_WATER_DISASTER },
  { ...ALL_RESOURCES_DICT[RISK_CHEMICAL_COMPANY], value: RISK_CHEMICAL_COMPANY },
  { ...ALL_RESOURCES_DICT[RISK_WATERLOGGED_PLACE], value: RISK_WATERLOGGED_PLACE },
  { ...ALL_RESOURCES_DICT[RISK_HAZARD], value: RISK_HAZARD },
];
const protectTypeList: Array<{label: string; value: string; [x: string]: any; }> = [
  { ...ALL_RESOURCES_DICT[PROTECT_TRAFFIC], value: PROTECT_TRAFFIC },
  { ...ALL_RESOURCES_DICT[PROTECT_LARGE_MARKET], value: PROTECT_LARGE_MARKET },
  { ...ALL_RESOURCES_DICT[PROTECT_SCHOOL], value: PROTECT_SCHOOL },
  { ...ALL_RESOURCES_DICT[PROTECT_MEDICAL_INSTITUTION], value: PROTECT_MEDICAL_INSTITUTION },
  { ...ALL_RESOURCES_DICT[PROTECT_BASE_FACILITIES], value: PROTECT_BASE_FACILITIES },
];
const resourceTypeList: Array<{label: string; value: string; [x: string]: any; }> = [
  { ...ALL_RESOURCES_DICT[RESOURCE_TEAM], value: RESOURCE_TEAM },
  { ...ALL_RESOURCES_DICT[RESOURCE_MATERIAL], value: RESOURCE_MATERIAL },
  { ...ALL_RESOURCES_DICT[RESOURCE_EQUIP], value: RESOURCE_EQUIP },
  { ...ALL_RESOURCES_DICT[RESOURCE_EXPERT], value: RESOURCE_EXPERT },
  { ...ALL_RESOURCES_DICT[RESOURCE_CARRIER], value: RESOURCE_CARRIER },
  { ...ALL_RESOURCES_DICT[RESOURCE_ORG], value: RESOURCE_ORG },
  { ...ALL_RESOURCES_DICT[RESOURCE_ENTERPRISE], value: RESOURCE_ENTERPRISE },
  { ...ALL_RESOURCES_DICT[RISK_REFUGE], value: RISK_REFUGE },
];

const ALL_RESOURCES_TREE = [
  {
    id: '$1',
    label: '应急资源',
    value: 'postFindEventSurroundingResources',
    sum: '',
    isLeaf: false,
    checked: false,
    children: [
      ...resourceTypeList
    ].map((c, idx) => ({
      id: `$1-${idx}`,
      sum: '',
      isLeaf: false,
      checked: false,
      children: null as null | BasicResourceItem[],
      ...c
    }))
  },
  {
    id: '$2',
    label: '风险隐患',
    value: 'postFindEventSurroundingRisk',
    sum: '',
    isLeaf: false,
    checked: false,
    children: [
      ...riskTypeList
    ].map((c, idx) => ({
      id: `$2-${idx}`,
      sum: '',
      isLeaf: false,
      checked: false,
      children: null as null | BasicResourceItem[],
      ...c
    }))
  },
  {
    id: '$3',
    label: '防护目标',
    value: 'postFindEventSurroundingProtectionTarget',
    sum: '',
    isLeaf: false,
    checked: false,
    children: [
      ...protectTypeList
    ].map((c, idx) => ({
      id: `$3-${idx}`,
      sum: '',
      isLeaf: false,
      checked: false,
      children: null as null | BasicResourceItem[],
      ...c
    }))
  }
];

export type ResourceTree = typeof ALL_RESOURCES_TREE;
export type ResourceTreeItem = typeof ALL_RESOURCES_TREE[number];

export {
  RISK_NAME,
  RESOURCE_NAME,
  PROTECT_NAME,
  PREFIX_RISK,
  PREFIX_PROTECT,
  PREFIX_RESOURCE,
  ALL_RESOURCES_TREE,
  RESOURCE_TEAM,
  RESOURCE_MATERIAL,
  RESOURCE_EQUIP,
  RESOURCE_EXPERT,
  RESOURCE_CARRIER,
  RESOURCE_ORG,
  RESOURCE_ENTERPRISE,
  RISK_REFUGE,
  RISK_GEOLOGY_DISASTER,
  RISK_WATER_DISASTER,
  RISK_CHEMICAL_COMPANY,
  RISK_WATERLOGGED_PLACE,
  RISK_HAZARD,
  RISK_RESERVOIR,
  PROTECT_TRAFFIC,
  PROTECT_LARGE_MARKET,
  PROTECT_SCHOOL,
  PROTECT_MEDICAL_INSTITUTION,
  PROTECT_BASE_FACILITIES,
  FOCUS_GOAL,
  ALL_RESOURCES_DICT,
  riskTypeList,
  protectTypeList,
  resourceTypeList,
};

const DATA_RESOURCE_SUPPORT = [RESOURCE_MATERIAL, RESOURCE_EQUIP, RISK_REFUGE];
const DATA_RESOURCE_EMERGENCY = [RESOURCE_EXPERT, RESOURCE_TEAM];
const DATA_RESOURCE_GOAL = [RISK_WATER_DISASTER, RISK_CHEMICAL_COMPANY, RISK_WATERLOGGED_PLACE, RISK_HAZARD, PROTECT_TRAFFIC, PROTECT_LARGE_MARKET, PROTECT_SCHOOL, PROTECT_MEDICAL_INSTITUTION, PROTECT_BASE_FACILITIES];

export { DATA_RESOURCE_SUPPORT, DATA_RESOURCE_EMERGENCY, DATA_RESOURCE_GOAL };

export const RESOURCE_TYPES: Record<string, any> = {
  // 队伍资源
  [RESOURCE_TEAM]: {
    showLabels: [
      ...commonLabels,
      { label: '队伍类型', key: 'teamTypeName' },
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
      { label: '总人数', key: 'totalUserNum' },
      { label: '主要设备', key: 'deviceRemark' },
      { label: '主管单位', key: 'orgId' },
    ],
  },
  // 储备库
  [RESOURCE_MATERIAL]: {
    showLabels: [
      ...commonLabels,
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
      { label: '主要物资数', key: 'deviceNum' },
      { label: '主管单位', key: 'orgId' },
    ],
    // 物资表格
    showTableCols: [
      { title: '序号', slotName: 'tableIndex', width: '4em', align: 'center' },
      { title: '物资名称', prop: 'resName', align: 'left', showTooltip: true },
      { title: '物资类别', prop: 'measureUseName', align: 'center', width: 'calc(var(--xxs) * 30)', showTooltip: true },
      { title: '物资规格', prop: 'specs', align: 'center', width: 'calc(var(--xxs) * 30)', showTooltip: true },
      { title: '库存数量', prop: 'measureNum', align: 'center', width: 'calc(var(--xxs) * 25)', showTooltip: true },
      { title: '计量单位', prop: 'measureUnit', align: 'center', width: 'calc(var(--xxs) * 20)', showTooltip: true },
    ],
  },
  // 装备
  [RESOURCE_EQUIP]: {
    showLabels: [
      ...commonLabels,
      { label: '装备用途', key: 'measureUseName' },
      { label: '装备数量', key: 'measureNum' },
      { label: '计量单位', key: 'measureUnit' },
      { label: '装备状态', key: 'statusName' },
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
      { label: '装备库', key: 'reserveIdName' },
      { label: '救援队伍', key: 'teamIdName' },
    ],
  },
  // 专家
  [RESOURCE_EXPERT]: {
    showLabels: [
      ...commonLabels,
      { label: '专家类别', key: 'resTypeName' },
      { label: '联系电话', key: 'mobile' },
      { label: '所在单位', key: 'unitName' },
      { label: '职务职称', key: 'position' },
      { label: '最高学历', key: 'education' },
      { label: '所学专业', key: 'professional' },
      { label: '性别', key: 'genderName' },
    ],
  },
  // 运输车辆
  [RESOURCE_CARRIER]: {
    showLabels: [
      ...commonLabels,
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
    ],
  },
  // 机构
  [RESOURCE_ORG]: {
    showLabels: [
      ...commonLabels,
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
    ],
  },
  // 企业
  [RESOURCE_ENTERPRISE]: {
    showLabels: [
      ...commonLabels,
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
      { label: '企业类型', key: 'enterpriseTypeName' },
    ],
  },
  // 避难场所
  [RISK_REFUGE]: {
    showLabels: [
      ...commonLabels,
      { label: '联系人', key: 'personName' },
      { label: '联系人电话', key: 'personMobile' },
      { label: '避难场所类型', key: 'placeTypeName' },
      { label: '主管单位', key: 'managerUnit' },
      { label: '占地总面积', key: 'coveredArea' },
      { label: '室内面积', key: 'carpetArea' },
      { label: '容纳人数', key: 'capacity' },
    ],
  },
  // 地质隐患点
  [RISK_GEOLOGY_DISASTER]: {
    showLabels: [
      ...commonLabels2,
    ],
  },
  // 森林火灾隐患点
  [RISK_WATER_DISASTER]: {
    showLabels: [
      ...commonLabels2,
    ],
  },
  // 危化企业
  [RISK_CHEMICAL_COMPANY]: {
    showLabels: [
      ...commonLabels2,
      { label: '生产状态', key: 'productionStatus' },
      { label: '企业员工人数', key: 'employee' },
      { label: '单班最大在岗人数', key: 'ondutyEmployee' },
      { label: '固定资产净值（万元)', key: 'fixedAssets' },
      { label: '主要危化品', key: 'chemicals' },
    ],
  },
  // 易涝点
  [RISK_WATERLOGGED_PLACE]: {
    showLabels: [
      ...commonLabels2,
      { label: '积水原因', key: 'waterCauses' },
      { label: '整改措施', key: 'correctiveMeasures' },
      { label: '建设内容', key: 'constructionContent' },
    ],
  },
  // 重大危险源
  [RISK_HAZARD]: {
    showLabels: [
      ...commonLabels2,
      { label: '重大危险源类型', key: 'hazardLevelName' },
      { label: '描述', key: 'descr' },
    ],
  },
  // 水库
  [RISK_RESERVOIR]: {
    showLabels: [
      { label: '名称', key: 'resName' },
      ...addressLabels,
      { label: '乡镇防汛行政责任人', key: 'personName' },
      { label: '联系方式', key: 'personMobile' },
      { label: '职务', key: 'duties' },
      { label: '所在河流', key: 'szhl' },
      { label: '管理单位名称', key: 'placeType' },
      { label: '流域面积（km2）', key: 'lymjKm2' },
      { label: '防洪标准（年一遇）设计/校核/现状', key: 'fhbzNyysjxhxz' },
      { label: '总库容（万m3）', key: 'zkrWm3' },
      { label: '校核洪水位（m）', key: 'xhhswM' },
      { label: '正常蓄水位（m）', key: 'zcxswM' },
      { label: '汛期限制水位（m）', key: 'xqxzswM' },
      { label: '调洪库容（万m3）', key: 'thkrWm3' },
      { label: '设计洪水位（m）', key: 'sjhswM' },
      { label: '死水位（m）', key: 'sswM' },
      { label: '校核洪水位时最大下泄流量（m3/s）', key: 'xhhswszdxxllM3s' },
      { label: '死库容（万m3）', key: 'skrWm3' },
      { label: '溢洪道最大泄量（m3/s）', key: 'yhdzdxlM3s' },
      { label: '放水洞最大泄量（m3/s）', key: 'fsdzdxlM3s' },
      { label: '保护范围内城镇、村庄、学校等数量及人口、耕地', key: 'bhfwnczczxxdsljrkgd' },
      { label: '汛期调度运用计划', key: 'xqtdyyjh' },
    ],
  },
  // 交通枢纽
  [PROTECT_TRAFFIC]: {
    showLabels: [
      ...commonLabels2,
      { label: '占地总面积(平方米)', key: 'coveredArea' },
      { label: '建筑面积(平方米)', key: 'buildingArea' },
      { label: '最大瞬时承载量(人次)', key: 'maxCapacity' },
    ]
  },
  // 人员密集场所
  [PROTECT_LARGE_MARKET]: {
    showLabels: [
      ...commonLabels2,
      { label: '占地总面积(平方米)', key: 'coveredArea' },
      { label: '建筑面积(平方米)', key: 'buildingArea' },
      { label: '最大瞬时承载量(人次)', key: 'maxCapacity' },
      { label: '日最大承载量(人次)', key: 'dayMaxCapacity' },
    ]
  },
  // 学校
  [PROTECT_SCHOOL]: {
    showLabels: [
      ...commonLabels2,
      { label: '占地总面积(平方米)', key: 'coveredArea' },
      { label: '建筑面积(平方米)', key: 'buildingArea' },
      { label: '教职工数', key: 'teacherNum' },
      { label: '在校人数', key: 'studentNum' },
      { label: '运动场地面积(平方米)', key: 'sportsArea' },
    ]
  },
  // 医疗机构
  [PROTECT_MEDICAL_INSTITUTION]: {
    showLabels: [
      ...commonLabels2,
      { label: '占地总面积(平方米)', key: 'coveredArea' },
      { label: '建筑面积(平方米)', key: 'buildingArea' },
      { label: '在岗职工人数', key: 'employee' },
      { label: '年度入院人数', key: 'annualNum' },
      { label: '实有住院床位数', key: 'bedNum' },
      { label: '急救指挥车数', key: 'ambulanceNum' },
    ]
  },
  // 重大基础设施
  [PROTECT_BASE_FACILITIES]: {
    showLabels: [
      ...commonLabels2,
      { label: '重大基础设施的类型', key: 'facilityTypeName' },
      { label: '描述', key: 'descr' },
    ]
  },
};
