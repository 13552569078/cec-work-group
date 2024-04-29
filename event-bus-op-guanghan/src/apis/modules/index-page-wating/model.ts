/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 紧急事件占比-Model类库
 */
export namespace IpostUrgentRateSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string;
    eventStatus?: number;
    eventType?: number;
    orderByField?: number;
    overtimeFlag?: number;
    platformCode?: string;
    startTime?: string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface Data {
    emergencyNum: number;
    emergencyRate: string;
    totalNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 事件列表-分页-Model类库
 */
export namespace IpostPageSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: number|string;
    endTime?: number|string;
    eventStatus?: number|string;
    eventType?: number|string;
    eventUrgent?: number|string;
    orderByField?: number;
    overtimeFlag?: number|string;
    pageNum?: number;
    pageSize?: number;
    platformCode?: number|string;
    startTime?: number|string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.eventUrgent = 0;
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.pageNum = 0;
      this.pageSize = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface ReceivePlatform {}

  export interface List {
    coordx: string;
    coordy: string;
    dispatchOverTime: string;
    endOverTime: string;
    eventAddress: string;
    eventStatus: number;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    handleOverTime: string;
    id: number;
    platformSrc: string;
    platformSrcName: string;
    receivePlatform: ReceivePlatform[];
    sendPlatform: string;
    title: string;
  }

  export interface NavigatepageNum {}

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
    total: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 调度用时-Model类库
 */
export namespace IpostTimeAnalysisSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string;
    eventStatus?: number;
    eventType?: number;
    orderByField?: number;
    overtimeFlag?: number;
    platformCode?: string;
    startTime?: string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface Data {
    averageTime: string;
    averageTimeLinkRate: string;
    maxTime: string;
    over24hourNum: number;
    over30minNum: number;
    within30minNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 事件来源-Model类库
 */
export namespace IpostPlatformSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string;
    eventStatus?: number;
    eventType?: number;
    orderByField?: number;
    overtimeFlag?: number;
    platformCode?: string;
    startTime?: string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface Data {
    platformCode: string;
    platformName: string;
    timeinNum: number;
    timeoutNum: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
 * 紧急事件-简列-Model类库
 */
export namespace IpostUrgentListSpace {
  export class RequestParams {
    direction?: number|string;
    districtCode?: number|string;
    endTime?: number|string;
    eventStatus?: number|string;
    eventType?: number|string;
    orderByField?: number|string;
    overtimeFlag?: number|string;
    platformCode?: number|string;
    startTime?: number|string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface Data {
    eventTime: string;
    id: number;
    overtimeFlag: number;
    title: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
 * 事件统计-Model类库
 */
export namespace IpostOverviewSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string;
    eventStatus?: number;
    eventType?: number;
    orderByField?: number;
    overtimeFlag?: number;
    platformCode?: string;
    startTime?: string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface Data {
    nonTimeoutNum: number;
    preDispatchNum: number;
    timeoutNum: number;
    timeoutRate: string;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
 /* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 待调度-高频事件-Model类库
      */
      export namespace IpostHotEventSpace {

        export class RequestParams{
          direction?:number;districtCode?:string;endTime?:string;eventStatus?:number;eventType?:number;orderByField?:number;overtimeFlag?:number;platformCode?:string;startTime?:string;
          constructor(){
            this.direction=0;this.districtCode="";this.endTime="";this.eventStatus=0;this.eventType=0;this.orderByField=0;this.overtimeFlag=0;this.platformCode="";this.startTime="";
          }
        }

      export interface SendList {
        eventNum: number;
        eventTypeName: string;
      }

      export interface TimeoutList {
        eventNum: number;
        eventTypeName: string;
      }

      export interface Data {
        sendList: SendList[];
        timeoutList: TimeoutList[];
      }

      export interface Model {
        code: number;
        data: Data;
        message: string;
      }
      }
