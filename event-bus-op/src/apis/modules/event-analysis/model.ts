/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 话题事件关系图谱-Model类库
 */
export namespace IpostTopicEventListSpace {
  export interface TopicEventList {
    eventCode: string;
    eventTitle: string;
    id: number;
  }

  export interface Data {
    topicEventList: TopicEventList[];
  }

  export interface Model {
    code: number;
    data: TopicEventList[];
    message: string;
  }
}
/**
 * 事件源监督-Model类库
 */
export namespace IpostEventSrcSpace {
  export class RequestParams {
    endTime?: string | number;
    startTime?: string | number;
    constructor() {
      this.endTime = "";
      this.startTime = "";
    }
  }

  export interface eventSrcCountList {
    eventCount: number;
    eventSrcName: string;
  }

  export interface Data {
    eventSrcCountList: eventSrcCountList[];
    outSysEventCount: number;
    outSysEventRate: string;
    repeatEventCount: number;
    repeatEventRate: string;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 话题排名-Model类库
 */
export namespace IpostTopicRankSpace {
  export interface Data {
    linkRate: string;
    topicName: string;
    topicNum: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
 * 事件关键字列表-Model类库
 */
export namespace IpostEventKeywordListSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
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
 * 话题趋势-Model类库
 */
export namespace IpostTopicTrendSpace {
  export interface TopicNameTop5List { }

  export interface TopicTop5List {
    topicName: string;
    topicNum: string;
  }

  export interface TopicTrendList {
    time: string;
    topicCountTop5List: TopicTop5List[];
  }

  export interface Data {
    topicNameTop5List: TopicNameTop5List[];
    topicTrendList: TopicTrendList[];
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 关键字事件列表-Model类库
 */
export namespace IpostKeywordEventListSpace {
  export class RequestParams {
    endTime?: string | number;
    keyword?: string;
    pageNum?: number;
    pageSize?: number;
    startTime?: string | number;
    constructor() {
      this.endTime = "";
      this.keyword = "";
      this.pageNum = 0;
      this.pageSize = 0;
      this.startTime = "";
    }
  }

  export interface ReceivePlatform { }

  export interface List {
    coordx: string;
    coordy: string;
    dispatchOverTime: string;
    endOverTime: string;
    eventAddress: string;
    eventStatus: number;
    eventTime: string;
    eventTypeName: string;
    handleOverTime: string;
    id: number;
    platformSrc: string;
    platformSrcName: string;
    receivePlatform: ReceivePlatform[];
    sendPlatform: string;
    title: string;
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
 * 预警监督-重复诉求事件对比-Model类库
 */
export namespace IgetRepeatEventSpace {
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

  export interface ActivityList {
    action: string;
    activityName: string;
    comment: string;
    roleName: string;
    startTime: string;
    timeLimit: string;
    timeUse: string;
  }

  export interface Proces {
    activityList: ActivityList[];
    processTime: string;
    processTimeLimit: string;
  }

  export interface CurrentEventInfo {
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
    id: number;
    overtimeFlag: number;
    platformSrc: string;
    platformSrcName: string;
    process: Proces;
    receivePlatform: string;
    reporterMobile: string;
    reporterName: string;
    sendPlatform: string;
    title: string;
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

  export interface ActivityList {
    action: string;
    activityName: string;
    comment: string;
    roleName: string;
    startTime: string;
    timeLimit: string;
    timeUse: string;
  }

  export interface Proces {
    activityList: ActivityList[];
    processTime: string;
    processTimeLimit: string;
  }

  export interface RepeatEventInfo {
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
    id: number;
    overtimeFlag: number;
    platformSrc: string;
    platformSrcName: string;
    process: Proces;
    receivePlatform: string;
    reporterMobile: string;
    reporterName: string;
    sendPlatform: string;
    title: string;
  }

  export interface Data {
    currentEventInfo: CurrentEventInfo;
    repeatEventInfo: RepeatEventInfo;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 预警监督-历史相似事件搜索-Model类库
 */
export namespace IpostSearchSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string | number;
    eventDesc?: string;
    eventName?: string;
    eventStatus?: number;
    eventType?: number;
    keyword?: string;
    orderByField?: number;
    overtimeFlag?: number;
    pageNum?: number;
    pageSize?: number;
    platformCode?: string;
    similarRatio?: string;
    startTime?: string | number;
    subjectOfTalk?: string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventDesc = "";
      this.eventName = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.keyword = "";
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.pageNum = 0;
      this.pageSize = 0;
      this.platformCode = "";
      this.similarRatio = "";
      this.startTime = "";
      this.subjectOfTalk = "";
    }
  }

  export interface List {
    coordx: string;
    coordy: string;
    eventAddress: string;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    id: number;
    platformSrc: string;
    platformSrcName: string;
    similarRatio: string;
    title: string;
    warningType: number;
  }

  // export interface Data {
  //   currentPage: number;
  //   hasNextPage: boolean;
  //   hasPreviousPage: boolean;
  //   isFirstPage: boolean;
  //   isLastPage: boolean;
  //   list: List[];
  //   pageSize: number;
  //   totalPage: number;
  //   totalRow: number;
  // }
  export interface Data {
    confidence: string;
    coordx: number;
    coordy: number;
    eventAddress: string;
    eventTime: string;
    eventTypeId: number;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeMaxId: number;
    eventTypeMiddleId: number;
    eventTypeName: string;
    id: number;
    platformSrc: string;
    platformSrcName: string;
    title: string;
    warningType: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
 * 预警监督-列表-Model类库
 */
export namespace IlistSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string | number;
    eventStatus?: number;
    eventType?: number;
    keyword?: string;
    orderByField?: number;
    overtimeFlag?: number;
    pageNum?: number;
    pageSize?: number;
    platformCode?: string;
    startTime?: string | number;
    warningEventName?: string;
    warningType?: number | string;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.keyword = "";
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.pageNum = 0;
      this.pageSize = 0;
      this.platformCode = "";
      this.startTime = "";
      this.warningEventName = "";
      this.warningType = 0;
    }
  }

  export interface List {
    coordx: string;
    coordy: string;
    eventAddress: string;
    eventTime: string;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeName: string;
    id: number;
    platformSrc: string;
    platformSrcName: string;
    similarRatio: string;
    title: string;
    warningType: number;
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
    total: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 预警监督-统计-Model类库
 */
export namespace IpostOverviewSpace {
  export class RequestParams {
    direction?: number;
    districtCode?: string;
    endTime?: string | number;
    eventStatus?: number;
    eventType?: number;
    keyword?: string;
    orderByField?: number;
    overtimeFlag?: number;
    platformCode?: string;
    startTime?: string | number;
    constructor() {
      this.direction = 0;
      this.districtCode = "";
      this.endTime = "";
      this.eventStatus = 0;
      this.eventType = 0;
      this.keyword = "";
      this.orderByField = 0;
      this.overtimeFlag = 0;
      this.platformCode = "";
      this.startTime = "";
    }
  }

  export interface Data {
    chainRatio: string;
    outtimeWarningCount: number;
    repeatWarningCount: number;
    warningCount: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
 * 预警监督-相似事件推荐(top10)-Model类库
 */
export namespace IpostRecommendSpace {
  export class RequestParams {
    endTime?: string;
    eventDesc?: string;
    eventTypeId?: any;
    startTime?: string;
    constructor() {
      this.endTime = "";
      this.eventDesc = "";
      this.eventTypeId = 0;
      this.startTime = "";
    }
  }

  export interface Data {
    confidence: string;
    coordx: number;
    coordy: number;
    eventAddress: string;
    eventTime: string;
    eventTypeId: number;
    eventTypeLName: string;
    eventTypeMName: string;
    eventTypeMaxId: number;
    eventTypeMiddleId: number;
    eventTypeName: string;
    id: number;
    platformSrc: string;
    platformSrcName: string;
    title: string;
    warningType: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
 * 视频点位
 */
export namespace IpostVideoMapPointSpace {

  export interface Data {
    id: string;
    name: string;
    channelId: string;
    channelName: string;
    gpsX: string;
    gpsY: string;
  }

  export interface MapPoint {
    coordinates: any[];
    properties: {
      id: string | number;
      event: string;
      emit: string;
      pointType: string;
      icon: string;
      iconSize: number,
      [proName:string]: any;
    }
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
