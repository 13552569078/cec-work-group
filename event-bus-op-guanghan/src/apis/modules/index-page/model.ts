/* eslint-disable @typescript-eslint/no-namespace */

/**
* 平台统计-Model类库
*/
export namespace IpostPlatformSpace {

  export class RequestParams {
    direction?: number; districtCode?: string; endTime?: string; eventStatus?: number; eventType?: number; orderByField?: number; overtimeFlag?: number; platformCode?: string; startTime?: string;
    constructor() {
      this.direction = 0; this.districtCode = ""; this.endTime = ""; this.eventStatus = 0; this.eventType = 0; this.orderByField = 0; this.overtimeFlag = 0; this.platformCode = ""; this.startTime = "";
    }
  }

  export interface Data {
    completedNum: number;
    noneCompletNum: number;
    platformCode: string;
    platformName: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 首页-事件统计-Model类库
*/
export namespace IgetOverviewSpace {

  export class RequestParams {
    districtCode?: string | number; endTime?: string; eventStatus?: number; overtimeFlag?: string | number; platformCode?: string; startTime?: string;
    constructor() {
      this.districtCode = ""; this.endTime = ""; this.eventStatus = 0; this.overtimeFlag = ""; this.platformCode = ""; this.startTime = "";
    }
  }

  export interface Data {
    completeRate: string;
    completedNum: number;
    disposalNum: number;
    linkRage: string;
    overTimeNum: number;
    overTimeRate: string;
    preDispatchNum: number;
    totalNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    msg: string;
    success: boolean;
  }
}
/**
* 事件列表-Model类库
*/
export namespace IgetPageSpace {

  export class RequestParams {
    districtCode?: string | number; endTime?: string | number; eventStatus?: string | number; eventType?: string | number; eventUrgent?: number|string; overtimeFlag?: string | number; pageNum?: number; pageSize?: number; platformCode?: string | number; startTime?: string | number;
    constructor() {
      this.districtCode = ""; this.endTime = ""; this.eventStatus = 0; this.eventType = 0; this.eventUrgent = 0; this.overtimeFlag = ""; this.pageNum = 0; this.pageSize = 0; this.platformCode = ""; this.startTime = "";
    }
  }

  export interface List {
    coordx: string;
    coordy: string;
    eventAddress: string;
    eventStatus: number;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    id: number;
    overtimeFlag: number;
    platformSrc: string;
    platformSrcName: string;
    receivePlatform: string;
    sendPlatform: string;
    title: string;
    dispatchOverTime: string;
    handleOverTime: string;
    endOverTime: string;
  }

  export interface NavigatepageNum { }

  export interface Data {
    endRow: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    list: List[];
    navigateFirstPage: number;
    navigateLastPage: number;
    navigatePages: number;
    navigatepageNums: NavigatepageNum[];
    nextPage: number;
    pageNum: number;
    pageSize: number;
    pages: number;
    prePage: number;
    size: number;
    startRow: number;
    totalRow: number;
  }

  export interface Model {
    code: number;
    data: Data;
    msg: string;
    success: boolean;
  }
}
/**
* 地图打点-街道事件聚合-Model类库
*/
export namespace IlistSpace {

  export class RequestParams {
    district?: string | number; districtCode?: string | number; endTime?: string; eventStatus?: string; overtimeFlag?: string | number; platformCode?: string; startTime?: string; pageSize?: number; pageNum?: number;
    constructor() {
      this.district = ""; this.districtCode = ""; this.endTime = ""; this.eventStatus = ''; this.overtimeFlag = ""; this.platformCode = ""; this.startTime = ""; this.pageSize = 10; this.pageNum = 1;
    }
  }

  export interface Data {
    eventTotalNum: number;
    rate: string;
    subDistEventNum: number;
    subDistrictCode: string;
    subDistrictName: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 办理统计-Model类库
*/
export namespace IgetHandleSpace {

  export class RequestParams {
    districtCode?: string | number; endTime?: string | number; eventStatus?: string; overtimeFlag?: string | number; platformCode?: string; startTime?: string | number; orderByField?: number;
    constructor() {
      this.districtCode = ""; this.endTime = ""; this.eventStatus = ''; this.overtimeFlag = ""; this.platformCode = ""; this.startTime = ""; this.orderByField = 0;
    }
  }

  export interface Data {
    areaCode: string;
    areaId: string;
    areaName: string;
    coordx: number;
    coordy: number;
    eventNum: string;
    evenNum: string;
    platformName: string;
    completedRate: string;
    timeoutRate: string;
    eventRate: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 高频热词列表-Model类库
*/
export namespace IHotlistSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface Data {
    hotDegree: number;
    keyword: string;
    linkRate: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 地图打点-街道范围事件列表-Model类库
*/
export namespace IDotlistSpace {

  export class RequestParams {
    districtCode?: string | number; endTime?: string; eventStatus?: string; overtimeFlag?: string; platformCode?: string; startTime?: string;
    constructor() {
      this.districtCode = ""; this.endTime = ""; this.eventStatus = ''; this.overtimeFlag = ""; this.platformCode = ""; this.startTime = "";
    }
  }

  export interface Data {
    coordx: string;
    coordy: string;
    id: number;
    title: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 高频热词-Model类库
*/
export namespace IgetKeywordsSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface Data { }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 事件详情-Model类库
*/
export namespace IgetDetailSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface AfterMeida {
    mediaName: string;
    mediaPath: string;
    mediaType: string;
  }

  export interface BeforeMedia {
    mediaName: string;
    mediaPath: string;
    mediaType: string;
  }

  export interface Data {
    afterMeida: AfterMeida[];
    beforeMedia: BeforeMedia[];
    coordx: string;
    coordy: string;
    eventAddress: string;
    eventDesc: string;
    eventSourceName: string;
    eventStatus: number;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    eventUrgent: number;
    eventCode: string;
    id: number;
    overtimeFlag: number;
    platformSrc: string;
    platformSrcName: string;
    receivePlatform: string;
    reporterMobile: string;
    reporterName: string;
    sendPlatform: string;
    title: string;
    eventTypeId: string;
    eventThirdState: number | string;
  }

  export interface Model {
    code: number;
    data: Data;
    msg: string;
    success: boolean;
  }
}
/**
* 高频事件-Model类库
*/
export namespace IgetEventsSpace {

  export class RequestParams {
    districtCode?: string | number; endTime?: string; eventStatus?: string; overtimeFlag?: string; platformCode?: string; startTime?: string;
    constructor() {
      this.districtCode = ""; this.endTime = ""; this.eventStatus = ''; this.overtimeFlag = ""; this.platformCode = ""; this.startTime = "";
    }
  }

  export interface Data {
    eventName: string;
    eventRate: string;
    receiveNum: number;
    sendNum: number;
    totalNum: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 趋势分析-事件量分析-Model类库
*/
export namespace IgetEventNumAnalysisSpace {

  export class RequestParams {
    beginDate?: string; districtCode?: string | number; endDate?: string; eventType?: string | number; overtimeFlag?: number | string; platformCode?: string; timeDimension?: number;
    constructor() {
      this.beginDate = ""; this.districtCode = ""; this.endDate = ""; this.eventType = ""; this.overtimeFlag = 0; this.platformCode = ""; this.timeDimension = 0;
    }
  }

  export interface Data {
    receiveNum: number;
    sendNum: number;
    time: string;
    totalNum: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}
/**
* 趋势分析-环比分析-Model类库
*/
export namespace IgetQoqAnalysisSpace {

  export class RequestParams {
    beginDate?: string; districtCode?: string | number; endDate?: string; eventType?: string; overtimeFlag?: number | string; platformCode?: string; timeDimension?: number;
    constructor() {
      this.beginDate = ""; this.districtCode = ""; this.endDate = ""; this.eventType = ""; this.overtimeFlag = 0; this.platformCode = ""; this.timeDimension = 0;
    }
  }

  export interface Data {
    eventNum: number;
    eventType: string;
    linkRate: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    msg: string;
    success: boolean;
  }
}

/**
* 高频事件-Model类库
*/
export namespace IpostEventsSpace {

  export class RequestParams {
    direction?: number; districtCode?: string; endTime?: string; eventStatus?: number; eventType?: number; orderByField?: number; overtimeFlag?: number; platformCode?: string; startTime?: string;
    constructor() {
      this.direction = 0; this.districtCode = ""; this.endTime = ""; this.eventStatus = 0; this.eventType = 0; this.orderByField = 0; this.overtimeFlag = 0; this.platformCode = ""; this.startTime = "";
    }
  }

  export interface Data {
    eventNum: number;
    eventRate: string;
    eventTypeName: string;
    receiveNum: number;
    sendNum: number;
    eventTypeId?: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}

/* eslint-disable @typescript-eslint/no-namespace */

/**
* 高频热词列表-top10-Model类库
*/
export namespace IlistSpaceHot {

  export class RequestParams {
    endTime?: string; startTime?: string;
    constructor() {
      this.endTime = ""; this.startTime = "";
    }
  }

  export interface Data {
    hotDegree: number;
    keyword: string;
    linkRate: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 高频热词-Model类库
*/
export namespace IpostKeywordsSpace {

  export class RequestParams {
    endTime?: string; startTime?: string;
    constructor() {
      this.endTime = ""; this.startTime = "";
    }
  }

  export interface Data { }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 缓冲区查询-Model类库
*/
export namespace IBufferSearchSpace {

  export class RequestParams {
    coordx?: number; coordy?: number; radius?: number;startTime?: string;endTime?: string;
    constructor() {
      this.coordx = 0; this.coordy = 0; this.radius = 1; this.startTime = ''; this.endTime = '';
    }
  }
  export interface Data {
    coordx: number,
    coordy: number,
    eventState: string,
    id: string | number,
    title: string
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}

      /* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 实时事件列表-Model类库
      */
      export namespace IpostRealTimeSpace {

        export class RequestParams{
          address?:string;direction?:number;districtCode?:string;endTime?:string;eventCode?:string;eventCodeList?:[];eventOrigin?:number;eventStatus?:number;eventType?:number;eventUrgent?:number;orderByField?:number;outPlatformCode?:string;overtimeFlag?:number;pageNum?:number;pageSize?:number;platformCode?:string;sendPlatformCode?:string;startTime?:string;title?:string;
          constructor(){
            this.address="";this.direction=0;this.districtCode="";this.endTime="";this.eventCode="";this.eventCodeList=[];this.eventOrigin=0;this.eventStatus=0;this.eventType=0;this.eventUrgent=0;this.orderByField=0;this.outPlatformCode="";this.overtimeFlag=0;this.pageNum=0;this.pageSize=0;this.platformCode="";this.sendPlatformCode="";this.startTime="";this.title="";
          }
        }

      export interface Data {
        convergeState: number;
        convergeStateName: string;
        coordx: string;
        coordy: string;
        eventAddress: string;
        eventStatus: string;
        eventTime: string;
        eventTypeLName: string;
        eventTypeMName: string;
        eventTypeName: string;
        eventUrgent: string;
        id: number;
        platformSrc: string;
        platformSrcName: string;
        title: string;
      }

      export interface Model {
        code: number;
        data: Data[];
        message: string;
      }
      }

