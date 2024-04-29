/* eslint-disable @typescript-eslint/no-namespace */

/**
* AI指挥中枢-相关事故案例列表-Model类库
*/
export namespace IpostFindknowledgeListSpace {

  export interface List {
    title: string;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    pageSize: number;
    currentPage: number;
    list: List[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}
/**
* AI指挥中枢-根据处置单位查询处置人员-Model类库
*/
export namespace IpostFindUserByOrgIdSpace {

  export class RequestParams {
    pageSize?: number; planId?: string; currentPage?: number; orgId?: string;
    constructor() {
      this.pageSize = 0; this.planId = ""; this.currentPage = 0; this.orgId = "";
    }
  }

  export interface List {
    orgname: string;
    id: number;
    sort: number;
    userName: string;
    userId: number;
    orgId: number;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    pageSize: number;
    currentPage: number;
    list: List[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}
/**
* AI指挥中枢-参与措施建议列表-Model类库
*/
export namespace IpostFindMeasuresAndSuggestionsListSpace {

  export interface List {
    title: string;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    pageSize: number;
    currentPage: number;
    list: List[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}
/**
* AI指挥中枢-相关应急知识列表-Model类库
*/
export namespace IpostFindEmeKnowledgeListSpace {

  export interface List {
    title: string;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    pageSize: number;
    currentPage: number;
    list: List[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}
/**
* AI指挥中枢-查询处置单位树-Model类库
*/
export namespace IpostFindOrgTreeSpace {

  export class RequestParams {
    planId?: string;
    constructor() {
      this.planId = "";
    }
  }

  export interface Children { }

  export interface Children {
    orgName: string;
    children: Children[];
    id: number;
  }

  export interface Data {
    orgName: string;
    children: Children[];
    id: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    desc: string;
  }
}
/**
* AI指挥中枢-结束事件预案响应-Model类库
*/
export namespace IpostFinishEventResponseCaseSpace {

  export class RequestParams {
    eventId?: string;
    constructor() {
      this.eventId = "";
    }
  }

  export interface Model {
    code: number;
    data: boolean;
    desc: string;
  }
}
/**
* AI指挥中枢-立即启动-Model类库
*/
export namespace IpostRunEventResponseCaseSpace {

  export class RequestParams {
    eventInfoId?: string; planFileUrl?: string; planName?: string; planId?: string; responseLevel?: string;
    constructor() {
      this.eventInfoId = ""; this.planFileUrl = ""; this.planName = ""; this.planId = ""; this.responseLevel = "";
    }
  }

  export interface Model {
    code: number;
    data: string;
    desc: string;
  }
}
/**
* AI指挥中枢-查询事件响应-Model类库
*/
export namespace IpostFindEventResponseByIdSpace {

  export class RequestParams {
    eventId?: number;
    constructor() {
      this.eventId = 0;
    }
  }

  export interface Data {
    responseStatusName: string;
    knowledgeNum: number;
    responseStatus: string;
    planOrgNum: number;
    rangeNum:number;
    measuresAndSuggestionsNum: number;
    emeKnowledgeNum: number;
    responseLevel: string;
    planUserNum: number;
    eventId: string;
    matchLevel: string;
    planFileUrl: string;
    planId: string;
    planName: string;
    responseList: any;
    strategyName: string;
    eventState: string;
    strategyInfoId: string;
    wartimeTitle: string;
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}

/**
  * 查询事件策略列表-Model类库
  */
export namespace IpostFindEventInfoStrategyListSpace {

export class RequestParams{
eventInfoId?:number;
constructor(){
  this.eventInfoId=0;
}
}

export interface Data {
strategyInfoId: number;
eventInfoId: number;
name: string;
eventTypeName: string;
selected: boolean;
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
* 切换事件策略-Model类库
*/
export namespace IpostChangeEventInfoStrategySpace {

export class RequestParams{
  eventInfoId?:number;strategyInfoId?:number;
  constructor(){
    this.eventInfoId=0;this.strategyInfoId=0;
  }
}

export interface Model {
code: string;
desc: string;
tips: string;
httpStatusCode: number;
data: boolean;
}
}



export namespace IpostModifySummaryReportSpace {

  export interface Data {
    "id": string,
    "name": string,
    "basicInfo": string,
    "surroundingResources": string,
    "responseHandle": string,
    "taskInfo": {
      "summary": string,
      "tasks": Array<Record<string, any>>
    },
    "directReason": string,
    "indirectReason": string,
    "features": string,
    "handleAdvice": string,
    "improveAdvice": string
  }
  export interface Model {
  code: string;
  desc: string;
  tips: string;
  httpStatusCode: number;
  data: Data;
  }
  }
