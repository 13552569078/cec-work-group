/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 查询监测事件的监测点信息-Model类库
 */
export namespace IgetFindMonitorEventPointSpace {

  export class RequestParams{
    eventId?:number;
    constructor(){
      this.eventId=0;
    }
  }

  export interface MonitorEquipNameList {}

  export interface MonitorFactorValueVOList {
    strategyRuleFactorId: number;
    factorId: number;
    factorName: string;
    measureUnitCode: string;
    measureUnitName: string;
    factorDataTypeCode: string;
    factorDataTypeName: string;
    factorValue: string;
  }

  export interface MonitorFactorVOList {
    factorId: number;
    factorName: string;
    measureUnitCode: string;
    measureUnitName: string;
    monitorFactorValueVOList: MonitorFactorValueVOList[];
    show?: boolean;
  }

  export interface Data {
    eventTypeCode: string;
    eventTypeName: string;
    monitorPointName: string;
    monitorEquipNameList: MonitorEquipNameList[];
    targetName: string;
    monitorFactorVOList: MonitorFactorVOList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 查询监测点设备列表-Model类库
*/
export namespace IgetListMonitorEquipListMapVOsSpace {

  export class RequestParams {
    useFor?: number; monitorPointId?: string;
    constructor() {
      this.useFor = 0; this.monitorPointId = '';
    }
  }

  export interface Data {
    equipId: string;
    equipType: number;
    equipName: string;
    regionId: string;
    pointId: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询监测事件的监测数据(列表展示)-Model类库
*/
export namespace IgetListMonitorDataListSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; useFor?: number; eventId?: string; startTime?: string; endTime?: string; pointId?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.useFor = 0; this.eventId = ''; this.startTime = ""; this.endTime = ""; this.pointId = "";
    }
  }

  export interface FactorValueList {
    name: string;
    value: string;
  }

  export interface List {
    monitorTime: string;
    factorValueList: FactorValueList[];
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    list: List[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 获取当前报警数-Model类库
*/
export namespace IgetFindCurrentWarningNumberSpace {

  export class RequestParams {
    useFor?: number;
    constructor() {
      this.useFor = 0;
    }
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: number;
  }
}
/**
* 查询监测事件的监测数据(图形展示)-Model类库
*/
export namespace IgetListMonitorFactorDataListSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; useFor?: number; eventId?: string; startTime?: string; endTime?: string; pointId?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.useFor = 0; this.eventId = ''; this.startTime = ""; this.endTime = ""; this.pointId = "";
    }
  }

  export interface ThresholdList { }

  export interface MonitorFactorDataVOList {
    monitorTime: string;
    factorValue: number;
  }

  export interface Data {
    factorName: string;
    thresholdList: ThresholdList[];
    monitorFactorDataVOList: MonitorFactorDataVOList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询监测事件详情-Model类库
*/
export namespace IgetFindMonitorEventDetailSpace {

  export class RequestParams {
    eventId?: string;
    constructor() {
      this.eventId = '';
    }
  }

  export interface Data {
    eventId: string;
    eventTitle: string;
    regionName: string;
    eventTypeCode: string;
    eventTypeName: string;
    eventLevelCode: string;
    eventLevelName: string;
    streetAreaCode: string;
    streetAreaName: string;
    pointAddress: string;
    startTime: string;
    eventDesc: string;
    videoUrl: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 查询监测点打点信息-Model类库
*/
export namespace IgetListMonitorPointMapVOsSpace {

  export class RequestParams {
    useFor?: number; regionTypeCodeList?: string; eventTypeCodeList?: string; monitorRegionId?: string;
    constructor() {
      this.useFor = 0; this.regionTypeCodeList = ''; this.eventTypeCodeList = ''; this.monitorRegionId = '';
    }
  }

  export interface Data {
    regionId: string;
    pointId: string;
    pointName: string;
    longitude: string;
    latitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询监测点树-Model类库
*/
export namespace IgetListMonitorPointTreeVOsSpace {

  export interface VideoEquipTreeVOList {
    equipId: string;
    equipName: string;
    equipCode: string;
    label?: string;
    id?: number|string;
    videoUrl?: string;
  }

  export interface IotEquipTreeVOList {
    equipId: string;
    equipName: string;
    equipCode: string;
    label?: string;
    id?: number|string;
    videoUrl?: string;
  }

  export interface MonitorPointTreeVOList {
    pointId: string;
    pointName: string;
    label?: string;
    id?: number|string;
    children?: any[],
    videoEquipTreeVOList: VideoEquipTreeVOList[];
    iotEquipTreeVOList: IotEquipTreeVOList[];
  }

  export interface MonitorRegionTreeVOList {
    regionId: string;
    regionName: string;
    label?: string;
    id?: number|string;
    children?: any[],
    monitorPointTreeVOList: MonitorPointTreeVOList[];
  }

  export interface Data {
    regionTypeId: string;
    eventTypeCode: string;
    regionTypeName: string;
    label?: string;
    id?: number|string;
    children?: any[],
    monitorRegionTreeVOList: MonitorRegionTreeVOList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 监测布控-查询事件类型列表-Model类库
*/
export namespace IgetListEventTypeListVOsSpace {

  export class RequestParams {
    useFor?: number; regionTypeCode?: string[];
    constructor() {
      this.useFor = 0; this.regionTypeCode = [];
    }
  }

  export interface Data {
    eventTypeCode: string;
    eventTypeName: string;
    eventNumber: number;
    monitorPointNumber: number;
    videoEquipNumber: number;
    iotEquipNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 监测布控-查询监测主体类型列表-Model类库
*/
export namespace IgetListRegionTypeListVOsSpace {

  export class RequestParams {
    useFor?: number;
    constructor() {
      this.useFor = 0;
    }
  }

  export interface Data {
    id: string;
    regionTypeName: string;
    regionTypeCode: string;
    description: string;
    regionNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询报警信息列表-Model类库
*/
export namespace IgetFindWarningInfoListPageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; useFor?: number; eventTitle?: string; eventTypeCode?: string; regionId?: string; eventLevelCode?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.useFor = 0; this.eventTitle = ""; this.eventTypeCode = ""; this.regionId = ''; this.eventLevelCode = "";
    }
  }

  export interface List {
    eventId: string;
    eventTitle: string;
    startTime: string;
    eventTypeCode: string;
    eventTypeName: string;
    regionName: string;
    eventStateCode: string;
    eventStateName: string;
    eventLevelCode: string;
    eventLevelCodeName: string;
    streetName: string;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    list: List[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 查询监测主体打点信息-Model类库
*/
export namespace IgetListMonitorRegionMapVOsSpace {

  export class RequestParams {
    useFor?: number; regionTypeCodeList?: string; eventTypeCodeList?: string; monitorRegionId?: string;
    constructor() {
      this.useFor = 0; this.regionTypeCodeList = ''; this.eventTypeCodeList = ''; this.monitorRegionId = '';
    }
  }

  export interface Data {
    regionTypeCode: string;
    regionId: string;
    regionName: string;
    gisOutline: string;
    alarmNumber: number;
    center?: number[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询监测事件打点信息-Model类库
*/
export namespace IgetListMonitorEventMapsSpace {

  export class RequestParams {
    useFor?: number; regionTypeCodeList?: string[]; eventTypeCodeList?: string[]; monitorRegionId?: string;
    constructor() {
      this.useFor = 0; this.regionTypeCodeList = []; this.eventTypeCodeList = []; this.monitorRegionId = '';
    }
  }

  export interface Data {
    eventId: string;
    longitude: string;
    latitude: string;
    eventLevel: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询物联设备列表-Model类库
*/
export namespace IgetListMonitorIotEquipsSpace {

  export interface VideoEquipTreeVOList {
    equipId: string;
    equipName: string;
    equipCode: string;
  }

  export interface IotEquipTreeVOList {
    equipId: string;
    equipName: string;
    equipCode: string;
  }

  export interface MonitorPointTreeVOList {
    pointId: string;
    pointName: string;
    videoEquipTreeVOList: VideoEquipTreeVOList[];
    iotEquipTreeVOList: IotEquipTreeVOList[];
  }

  export interface MonitorRegionTreeVOList {
    regionId: string;
    regionName: string;
    monitorPointTreeVOList: MonitorPointTreeVOList[];
  }

  export interface Data {
    regionTypeId: string;
    eventTypeCode: string;
    regionTypeName: string;
    monitorRegionTreeVOList: MonitorRegionTreeVOList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 查询视频设备列表-Model类库
*/
export namespace IgetListMonitorVideosSpace {

  export interface VideoEquipTreeVOList {
    equipId: string;
    equipName: string;
    equipCode: string;
  }

  export interface IotEquipTreeVOList {
    equipId: string;
    equipName: string;
    equipCode: string;
  }

  export interface MonitorPointTreeVOList {
    pointId: string;
    pointName: string;
    videoEquipTreeVOList: VideoEquipTreeVOList[];
    iotEquipTreeVOList: IotEquipTreeVOList[];
  }

  export interface MonitorRegionTreeVOList {
    regionId: string;
    regionName: string;
    monitorPointTreeVOList: MonitorPointTreeVOList[];
  }

  export interface Data {
    regionTypeId: string;
    eventTypeCode: string;
    regionTypeName: string;
    monitorRegionTreeVOList: MonitorRegionTreeVOList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 当前topX报警列表-Model类库
*/
export namespace IgetListWarningInfoListVOsSpace {

  export class RequestParams {
    useFor?: number;
    constructor() {
      this.useFor = 0;
    }
  }

  export interface Data {
    eventId: string;
    eventTitle: string;
    startTime: string;
    eventTypeCode: string;
    eventTypeName: string;
    regionName: string;
    eventStateCode: string;
    eventStateName: string;
    eventLevelCode: string;
    eventLevelCodeName: string;
    streetName: string;
    eventShowCode:string;
    monitorRegionId:string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}

/**
 * 查询接入数据列表-Model类库
 */
export namespace IgetFindAccessDatePageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; monitorPointId?: string | string; eventId?: string;startTime?: string; endTime?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 10; this.monitorPointId = ''; this.eventId="";this.startTime = ""; this.endTime = "";
    }
  }

  export interface List {
    dataId: number;
    accessDataCode: string;
    dataValue: string;
    collectTime: string;
    accessTime: string;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    list: List[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}

/**
 * 查询监测数据列表-Model类库
 */
export namespace IgetFindMonitorDataPageSpace {

  export interface ColumnHeaderList {
    dataId: number;
    code: string;
    codeName: string;
    value: number;
    formulaCode: string;
    formulaCodeName: string;
  }

  export interface MonitorDataList {
    dataId: number;
    code: string;
    codeName: string;
    value: number;
    formulaCode: string;
    formulaCodeName: string;
  }

  export interface List {
    monitorPointId: number;
    monitorPointName: string;
    monitorTime: string;
    handleTime: string;
    columnHeaderList: ColumnHeaderList[];
    monitorDataList: MonitorDataList[];
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    list: List[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
