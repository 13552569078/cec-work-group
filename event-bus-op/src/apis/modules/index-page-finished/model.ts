/* eslint-disable @typescript-eslint/no-namespace */

/**
* 已办结-办理平台统计-Model类库
*/
export namespace IpostPlatformStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
    }
  }

  export interface Data {
    notOverTimeNum: number;
    overTimeNum: number;
    platform: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 已办结-事件统计-Model类库
*/
export namespace IpostEndStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    completedNum: number;
    completedRate: string;
    timeoutNum: number;
    timeoutRate: string;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 已办结-处置用时统计-Model类库
*/
export namespace IpostHandleTimeSpace {

  export class RequestParams {
    district?: string|number; endTime?: number|string; platform?: string; startTime?: number|string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    handleTimeAvg: string;
    platform: string;
    qoqRate: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 已办结-高频事件处置超时统计-Model类库
*/
export namespace IpostOverTimeStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    eventTypeCode: string;
    eventTypeName: string;
    overTimeNum: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 已办结-事件列表-Model类库
*/
export namespace IpostEndListPageSpace {

  export class RequestParams {
    district?:  string|number; endTime?:  string|number; eventTypeId?:  string|number; overtimeFlag?: number|string; pageNum?: number; pageSize?: number; platform?:  string|number; startTime?:  string|number; status?:  string|number;
    constructor() {
      this.district = 0; this.endTime = ""; this.eventTypeId = 0; this.overtimeFlag = 0; this.pageNum = 0; this.pageSize = 0; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface List {
    address: string;
    coordx: number;
    coordy: number;
    destPlatform: string;
    dispatchOverTime: string;
    endOverTime: string;
    eventId: number;
    eventTime: string;
    handleOverTime: string;
    sourcePlatform: string;
    title: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
  }

  export interface Data {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    list: List[];
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 已办结-协同事件去向统计-Model类库
*/
export namespace IpostCollaborativeDestStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
    }
  }

  export interface Data {
    eventNum: number;
    platform: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 已办结-跨部门协同处置事件占比-Model类库
*/
export namespace IpostCollDisposalRateSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
    }
  }

  export interface Data {
    collDisposalNum: number;
    rate: string;
    totalNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 已办结-协同对象统计-Model类库
*/
export namespace IpostCollaborativeObjectStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    eventNum: number;
    platform: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 已办结-高频事件接收量统计-Model类库
*/
export namespace IpostReceiveStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    eventNum: number;
    eventTypeCode: string;
    eventTypeName: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 已办结-处置效率统计-Model类库
*/
export namespace IpostHandleEfficientSpace {

  export class RequestParams {
    district?: number|string; endTime?: number|string; platform?: string; startTime?: number|string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    handleEfficAvg: string;
    platform: string;
    qoqRate: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
