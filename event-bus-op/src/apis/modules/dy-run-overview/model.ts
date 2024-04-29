/* eslint-disable @typescript-eslint/no-namespace */

/**
* 运行总览-接入事件统计-Model类库
*/
export namespace IpostStatSpace {

  export interface Data {
    accessEventNum: number;
    accessQoq: string;
    endNum: number;
    notEndNum: number;
    overTimeEndNum: number;
    overTimeNotEndNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}

/**
* 运行总览-平台流入统计-Model类库
*/
export namespace IlistSpace {

  export class RequestParams {
    districtCode?: string; endTime?: string; startTime?: string; statType?: number;
    constructor() {
      this.districtCode = ""; this.endTime = ""; this.startTime = ""; this.statType = 0;
    }
  }

  export interface Data {
    num: number;
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
* 运行总览-自处置事件统计-Model类库
*/
export namespace IpostStatSpace2 {

  export interface Data {
    endNum: number;
    endRate: string;
    overTimeNum: number;
    overTimeRate: string;
    selfHandleEventNum: number;
    selfHandleQoq: string;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}


/**
* 运行总览-流入事件统计-Model类库
*/
export namespace IpostStatSpace3 {

  export interface Data {
    endRate: string;
    totalInflowEventNum: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}

/**
* 运行总览-流入事件近六个月事件数量-Model类库
*/
export namespace IlistSpace2 {

  export interface Data {
    month: number;
    num: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}


/**
* 运行总览-运行统计-趋势分析-Model类库
*/
export namespace IpostAnalysisSpace {

  export class RequestParams {
    dimension?: number; dimensionValue?: string; district?: number; endTime?: string; pageNum?: number; pageSize?: number; platform?: string; startTime?: string;
    constructor() {
      this.dimension = 0; this.dimensionValue = ""; this.district = 0; this.endTime = ""; this.pageNum = 0; this.pageSize = 0; this.platform = ""; this.startTime = "";
    }
  }

  export interface Data {
    month: number;
    num: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}

/**
* 运行总览-运行统计-事件类型top10-Model类库
*/
export namespace IpostTop10Space {

  export class RequestParams {
    dimension?: number; dimensionValue?: string; district?: number; endTime?: string; pageNum?: number; pageSize?: number; platform?: string; startTime?: string;
    constructor() {
      this.dimension = 0; this.dimensionValue = ""; this.district = 0; this.endTime = ""; this.pageNum = 0; this.pageSize = 0; this.platform = ""; this.startTime = "";
    }
  }

  export interface Data {
    eventTypeName: string;
    num: number;
    qoq: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}

/**
* 运行总览-运行统计-流入类型-Model类库
*/
export namespace IpostRegionSpace {

  export class RequestParams {
    dimension?: number; dimensionValue?: string; district?: number; endTime?: string; pageNum?: number; pageSize?: number; platform?: string; startTime?: string;
    constructor() {
      this.dimension = 0; this.dimensionValue = ""; this.district = 0; this.endTime = ""; this.pageNum = 0; this.pageSize = 0; this.platform = ""; this.startTime = "";
    }
  }

  export interface Data {
    num: number;
    regionName: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}

/**
* 运行总览-运行总览-事件列表-Model类库
*/
export namespace IlistSpace3 {

  export class RequestParams {
    dimension?: number;
    dimensionValue?: string;
    district?: number;
    endTime?:string;
    pageNum?: number;
    pageSize?: number;
    platform?: string;
    startTime?: string;
    constructor() {
      this.dimension = 0;
      this.dimensionValue = "";
      this.district = 0;
      this.endTime = "";
      this.pageNum = 0;
      this.pageSize = 0;
      this.platform = "";
      this.startTime = "";
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
