/* eslint-disable @typescript-eslint/no-namespace */

/**
* 监测主体报警研判信息统计-Model类库
*/
export namespace IgetFindRegionAlarmJudgeSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
    }
  }

  export interface Data {
    judgeNumber: number;
    autoJudgeNumber: number;
    manualJudgeNumber: number;
    judgeRejectNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 监测主体报警信息统计-Model类库
*/
export namespace IgetFindRegionAlarmInfoSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
    }
  }

  export interface AlarmInfoList {
    code: string;
    codeName: string;
    value: number;
  }

  export interface Data {
    alarmNumber: number;
    alarmInfoList: AlarmInfoList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 按报警等级-事件类型-主体类型分类统计事件-Model类库
*/
export namespace IgetListMonitorEventStatisticsesSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
    }
  }

  export interface Data {
    typeCode: string;
    typeName: string;
    eventNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 监测中心-统计趋势-Model类库
*/
export namespace IgetListTrendVOsSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
    }
  }

  export interface EventTypeVO {
    code: string;
    name: string;
    num: number;
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
* 监测主体报警处置信息统计-Model类库
*/
export namespace IgetFindRegionAlarmHandleSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
    }
  }

  export interface Data {
    handleNumber: number;
    autoHandleNumber: number;
    eventCenterHandleNumber: number;
    handlingNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 查询今日概况统计信息-Model类库
*/
export namespace IgetFindMonitorEventOverViewSpace {

  export class RequestParams {
    useFor?: number; accessNumber?: number; alarmNumber?: number; judgeNumber?: number; autoFinishNumber?: number; eventCenterFinishNumber?: number;
    constructor() {
      this.useFor = 0; this.accessNumber = 0; this.alarmNumber = 0; this.judgeNumber = 0; this.autoFinishNumber = 0; this.eventCenterFinishNumber = 0;
    }
  }

  export interface Data {
    accessNumber: number;
    accessAddNumber?: number;
    alarmNumber: number;
    alarmAddNumber?: number;
    judgeNumber: number;
    judgeAddNumber?: number;
    autoFinishNumber: number;
    autoFinishAddNumber?: number;
    eventCenterFinishNumber: number;
    eventCenterFinishAddNumber?: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 查询报警分布-Model类库
*/
export namespace IgetFindAlarmDistributionSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
    }
  }

  export interface Data {
    unJudgeNumber: number;
    handlingNumber: number;
    judgeRejectedNumber: number;
    alarmNumber: number;
    eventCenterFinishedNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 监测中心-按照时段统计-Model类库
*/
export namespace IgetListTimeTrendVOsSpace {

  export class RequestParams {
    useFor?: number; statisticsTypeCode?: string; startTime?: string; endTime?: string; regionId?: number;
    constructor() {
      this.useFor = 0; this.statisticsTypeCode = ""; this.startTime = ""; this.endTime = ""; this.regionId = 0;
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
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 获取资源投入信息-Model类库
*/
export namespace IgetFindMonitorResourceUseSpace {

  export class RequestParams {
    useFor?: number;
    constructor() {
      this.useFor = 0;
    }
  }

  export interface Data {
    judgmentPersonNumber: number;
    disposalDepartmentNumber: number;
    ownershipUnit: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}