/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 查询事件类型列表（下拉框）-Model类库
 */
export namespace IgetListEventTypeListVOsSpace {

  export class RequestParams{

    constructor(){

    }
  }

  export interface Data {
    eventTypeCode: string;
    eventTypeName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 查询字典列表-Model类库
 */
export namespace IgetListDictCustomVOsSpace {

  export class RequestParams{
    typeCodeList?:string;
    constructor(){
      this.typeCodeList="";
    }
  }

  export interface Data {
    typeCode: string;
    dictCode: string;
    dictName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 监测主体下拉框列表-Model类库
 */
export namespace IgetRegionSimpleListSpace {

  export class RequestParams{
    regionName?:string;
    constructor(){
      this.regionName="";
    }
  }

  export interface Data {
    id: number;
    regionName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 研判-统计趋势-Model类库
 */
export namespace IgetListRegionTrendVOsSpace {

  export class RequestParams{
    useFor?:number;startTime?:string;endTime?:string;monitorRegionId?:number|string;
    constructor(){
      this.useFor=0;this.startTime="";this.endTime="";this.monitorRegionId=0;
    }
  }

  export interface EventTypeVO {
    code: string;
    name: string;
    num: number;
    child?: EventTypeVO[]
  }

  export interface Data {
    date: string;
    eventTypeVOs: EventTypeVO[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 待人工研判报警信息-按报警类型分-Model类库
 */
export namespace IgetListManualUnJudgeEventTypeVOsSpace {

  export class RequestParams{
    useFor?:number;
    constructor(){
      this.useFor=0;
    }
  }

  export interface Data {
    code: string;
    name: string;
    num: number;
    label?: string;
    value?: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 近期研判结果统计-按研判方式-Model类库
 */
export namespace IgetListTimeJudgeTypeVOsSpace {

  export interface Data {
    code: string;
    name: string;
    num: number;
    label?: string;
    value?: number;
    color?: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 研判保存接口-Model类库
 */
export namespace IpostAddJudgeInfoSpace {

  export class RequestParams{
    eventId?:number|string;originalEventLevelCode?:string;originalEventTypeCode?:string;eventLevelCode?:string;eventTypeCode?:string;judgeDesc?:string;autoFinish?:any;judgeStateCode?:string;
    constructor(){
      this.eventId=0;this.originalEventLevelCode="";this.originalEventTypeCode="";this.eventLevelCode="";this.eventTypeCode="";this.judgeDesc="";this.autoFinish="";this.judgeStateCode="";
    }
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: boolean;
  }
}
/**
 * 待人工研判报警信息-按监测主体类型分-Model类库
 */
export namespace IgetListManualUnJudgeObjectTypeVOsSpace {

  export class RequestParams{
    useFor?:number;
    constructor(){
      this.useFor=0;
    }
  }

  export interface Data {
    code: string;
    name: string;
    num: number;
    label?: string;
    value?: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 研判结果-今日研判-Model类库
 */
export namespace IgetFindTodayJudgeVOSpace {

  export class RequestParams{
    useFor?:number;
    constructor(){
      this.useFor=0;
    }
  }

  export interface Data {
    totalNum: number;
    judgeNum: number;
    judgeRejectNum: number;
    judgeRate: number;
    judgeRejectRate: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
 * 待人工研判报警总数-Model类库
 */
export namespace IgetFindManualUnJudgeEventNumSpace {

  export class RequestParams{
    useFor?:number;
    constructor(){
      this.useFor=0;
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
 * 近期研判结果统计-按研判结果-Model类库
 */
export namespace IgetListTimeJudgeResultVOsSpace {

  export interface Data {
    code: string;
    name: string;
    num: number;
    label?: string;
    value?: number;
    color?: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 研判-当日概览-Model类库
 */
export namespace IgetFindJudgeOverviewVOSpace {

  export class RequestParams{
    useFor?:number;
    constructor(){
      this.useFor=0;
    }
  }

  export interface EventCountVO {
    code: string;
    name: string;
    num: number;
    label?: string;
    value?: number;
    color?: string;
  }

  export interface Data {
    totalNum: number;
    judgeRejectNum: number;
    judgeRejectRate: number;
    eventCountVOs: EventCountVO[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
 * 研判-按照时段统计-Model类库
 */
export namespace IgetListRegionTimeTrendVOsSpace {

  export class RequestParams{
    useFor?:number;startTime?:string;endTime?:string;monitorRegionId?:number|string;
    constructor(){
      this.useFor=0;this.startTime="";this.endTime="";this.monitorRegionId=0;
    }
  }

  export interface EventTypeVO {
    code: string;
    name: string;
    num: number;
  }

  export interface Data {
    code: string;
    num: number;
    eventTypeVOs: EventTypeVO[];
    label?: string;
    value?: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 待研判列表(分页)-Model类库
 */
export namespace IgetFindManualUnJudgeEventPageSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;useFor?:number;eventTypeCode?:string;eventLevelCode?:string;monitorRegionId?:number|string;startTime?:string;endTime?:string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.useFor=0;this.eventTypeCode="";this.eventLevelCode="";this.monitorRegionId=0;this.startTime="";this.endTime="";
    }
  }

  export interface List {
    eventId: number;
    unionEventId: string;
    eventTypeCode: string;
    eventTitle: string;
    eventTypeCodeName: string;
    eventLevelCode: string;
    eventLevelCodeName: string;
    monitorRegionId: number;
    regionName: string;
    streetAreaCode: string;
    streetAreaCodeName: string;
    eventTime: string;
    longitude: string;
    latitude: string;
    createdAt: string;
    updatedAt: string;
    eventShowCode: string;
    eventShowName: string;
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
