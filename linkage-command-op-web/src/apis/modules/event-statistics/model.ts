/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 事件统计-概览-Model类库
 */
export namespace IgetEventOverviewSpace {
  export class RequestParams {
    constructor() {}
  }

  export interface Data {
    startDate: string;
    dayNum: number;
    totalNum: number;
    monthAddNum: number;
    handleNum: number;
    completionRateNum: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}
/**
 * 事件统计-高发事件-Model类库
 */
export namespace IpostStatEventNumByTypeSpace {
  export class RequestParams {
    eventTypeCodeList?:[];currentStartTime?:string; currentEndTime?:string;
    constructor() {
      this.eventTypeCodeList = []; this.currentStartTime = ""; this.currentEndTime = "";
    }
  }
  export interface Data {
    eventTypeName: string;
    eventTypeCode: string;
    level1: number;
    level2: number;
    level3: number;
    level4: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}
/**
 * 事件统计-趋势分析-Model类库
 */
export namespace IpostStatEventNumByDateSpace {
  export class RequestParams {
    eventTypeCodeList?:[];currentStartTime?:string; currentEndTime?:string;
    constructor() {
      this.eventTypeCodeList = []; this.currentStartTime = ""; this.currentEndTime = "";
    }
  }

  export interface Trend {
    label: string;
    num: number;
  }

  export interface Data {
    eventLevelName: string;
    trend: Trend[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}

export namespace IpostTopEventTypesSpace {
  export interface Data {
    eventTypeName: string;
    eventTypeCode: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}
