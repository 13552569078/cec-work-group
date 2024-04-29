/* eslint-disable @typescript-eslint/no-namespace */
/**
 * 事件监控-统计-Model类库
 */
export namespace IpostStatisticsSpace {
  export class RequestParams {
    districtCode?: string;
    endTime?: string;
    startTime?: string;
    constructor() {
      this.districtCode = "";
      this.endTime = "";
      this.startTime = "";
    }
  }

  export interface Data {
    dbNum: number;
    ycNum: number;
    csNum: number;
    jjNum: string;
    cqwbNum: string;
    dbmNum: number;
  }
  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 事件监控-事件分页列表-Model类库
 */
export namespace IpostPageSpace {
  export class RequestParams {
    address?: string;
    coordx?: string;
    coordy?: string;
    direction?: number;
    districtCode?: string;
    endTime?: string;
    eventCode?: string;
    eventCodeList?: [];
    eventOrigin?: number;
    eventStatus?: number;
    eventType?: number;
    eventUrgent?: number;
    flag?: number;
    orderByField?: number;
    outPlatformCode?: string;
    overtimeFlag?: number;
    pageNum?: number;
    pageSize?: number;
    platformCode?: string;
    sendPlatformCode?: string;
    startTime?: string;
    title?: string;
    constructor() {
      this.address = "";
      this.coordx = "";
      this.coordy = "";
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventCode = "";
      this.eventCodeList = [];
      this.eventOrigin = 0;
      this.eventStatus = 0;
      this.eventType = 0;
      this.eventUrgent = 0;
      this.flag = 0;
      this.orderByField = 0;
      this.outPlatformCode = "";
      this.overtimeFlag = 0;
      this.pageNum = 0;
      this.pageSize = 0;
      this.platformCode = "";
      this.sendPlatformCode = "";
      this.startTime = "";
      this.title = "";
    }
  }

  export interface List {
    cancelFlag: number;
    closeFlag: number;
    completeFlag: number;
    coordx: string;
    coordy: string;
    dispatchFlag: number;
    eventAddress: string;
    eventStatus: string;
    eventThirdState: string;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    eventUrgent: string;
    handleFlag: number;
    id: number;
    inflowType: number;
    inflowTypeName: string;
    overtimeStatus: string;
    receivePlatform: string;
    reportFlag: number;
    sendPlatform: string;
    sendPlatformName: string;
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
 * 事件监控-最新事件列表-Model类库
 */
export namespace IpostLatestListSpace {
  export class RequestParams {
    address?: string;
    direction?: number;
    districtCode?: string;
    endTime?: string;
    eventCode?: string;
    eventCodeList?: [];
    eventOrigin?: number;
    eventStatus?: number;
    eventType?: number;
    eventUrgent?: number;
    orderByField?: number;
    outPlatformCode?: string;
    overtimeFlag?: number;
    platformCode?: string;
    sendPlatformCode?: string;
    startTime?: string;
    title?: string;
    constructor() {
      this.address = "";
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventCode = "";
      this.eventCodeList = [];
      this.eventOrigin = 0;
      this.eventStatus = 0;
      this.eventType = 0;
      this.eventUrgent = 0;
      this.orderByField = 0;
      this.outPlatformCode = "";
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.sendPlatformCode = "";
      this.startTime = "";
      this.title = "";
    }
  }

  export interface Data {
    cancelFlag: number;
    closeFlag: number;
    completeFlag: number;
    coordx: string;
    coordy: string;
    dispatchFlag: number;
    eventAddress: string;
    eventStatus: string;
    eventThirdState: string;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    eventUrgent: string;
    handleFlag: number;
    id: number;
    inflowType: number;
    inflowTypeName: string;
    overtimeStatus: string;
    receivePlatform: string;
    reportFlag: number;
    sendPlatform: string;
    sendPlatformName: string;
    title: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
