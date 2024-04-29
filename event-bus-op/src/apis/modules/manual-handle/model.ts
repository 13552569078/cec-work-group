/**
* 手动流转-事件列表
*/
export namespace IgetListSpace {

  export class RequestParams {
    eventState?: number | string;
    platformSrc?: string;
    createBeginTime?: string;
    createEndTime?: string;
    district?: number | string;
    pageNum?: number;
    pageSize?: number;
    constructor() {
      this.eventState = 0; this.pageNum = 1;
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
