/**
* 手动流转-事件列表
*/
export namespace IgetListSpace {

  export class RequestParams {
    startTime?: string | number;
    endTime?: string | number;
    district?: string | number;
    pageNum?: number;
    pageSize?: number;
    constructor() {
      this.startTime = ''; this.endTime = ''; this.district = ''; this.pageNum = 1; this.pageSize = 10;
    }
  }

  export interface List {
    title: string;
    eventTypeName: string;
    eventTypeMNAME: string;
    eventTypeLName: string;
    eventAddress: string;
    coordx: string;
    coordy: string;
    id: string;
    eventTime: string;
    dispatchOverTime: string;
    handleOverTime: string;
    endOverTime: string;
    eventState: string|number;
    eventStatus: number;
    eventTypeMName: string;
    overtimeFlag: number;
    platformSrc: string;
    platformSrcName: string;
    receivePlatform: string;
    sendPlatform: string;
  }

  export interface Data {
    list: List[],
    total: number
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}

/**
* 手动流转-事件列表
*/
export namespace IpostEventCountStatSpace {

  export class RequestParams {
    startTime?: string | number;
    endTime?: string | number;
    district?: string | number;
    pageNum?: number;
    pageSize?: number;
    constructor() {
      this.startTime = ''; this.endTime = ''; this.district = ''; this.pageNum = 1; this.pageSize = 10;
    }
  }

  export interface Data {
    handlingCount: number,
    exceptionCount: number
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}

