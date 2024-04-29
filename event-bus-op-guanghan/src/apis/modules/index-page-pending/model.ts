/* eslint-disable @typescript-eslint/no-namespace */

/**
* 处置中-高频事件接收量统计-Model类库
*/
export namespace IpostReceiveStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
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
* 处置中-紧急事件列表-Model类库
*/
export namespace IlistSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    eventTime: string;
    id: number;
    overTimeFlag: number;
    title: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 处置中-高频事件处置超时统计-Model类库
*/
export namespace IpostOverTimeStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
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
* 处置中-跨部门协同处置事件占比-Model类库
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
* 处置中-紧急事件占比-Model类库
*/
export namespace IpostEmergencyRateSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
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
* 处置中-紧急事件去向统计-Model类库
*/
export namespace IpostEmergencyAssignedDestStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: string;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = '';
    }
  }

  export interface Data {
    emergencyNum: number;
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
* 处置中-协同事件去向统计-Model类库
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
* 处置中-交办去向统计-Model类库
*/
export namespace IpostAssignedDestStatSpace {

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
* 处置中-事件列表-Model类库
*/
export namespace IpostHandlingListPageSpace {

  export class RequestParams {
    district?:  string|number; endTime?:  string|number; eventTypeId?:  string|number; overtimeFlag?: string|number; pageNum?: number; pageSize?: number; platform?:  string|number; startTime?:  string|number; status?:  string|number;eventStatus?:  string|number;
    constructor() {
      this.district = 0; this.endTime = ""; this.eventTypeId = 0; this.overtimeFlag = 0; this.pageNum = 0; this.pageSize = 0; this.platform = ""; this.startTime = ""; this.status = 0;this.eventStatus = 0;
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
* 处置中-异常事件列表-Model类库
*/
export namespace IpostAbnormalListPageSpace {

  export class RequestParams {
    district?: number|string; endTime?: number|string; pageNum?: number; pageSize?: number; platform?: number|string; startTime?: number|string; status?: number|string; type?: number|string;
    constructor() {
      this.district = 0; this.endTime = ""; this.pageNum = 0; this.pageSize = 0; this.platform = ""; this.startTime = ""; this.status = 0; this.type = 0;
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
* 处置中-事件统计-Model类库
*/
export namespace IpostStatSpace {

  export class RequestParams {
    district?: number; endTime?: string; platform?: string; startTime?: string; status?: number;
    constructor() {
      this.district = 0; this.endTime = ""; this.platform = ""; this.startTime = ""; this.status = 0;
    }
  }

  export interface Data {
    handleNotOverTimeNum: number;
    handleOverTimeNum: number;
    handleOverTimeRate: string;
    handlingNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 处置中-协同对象统计-Model类库
*/
export namespace IpostHandlingStatSpace {

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
