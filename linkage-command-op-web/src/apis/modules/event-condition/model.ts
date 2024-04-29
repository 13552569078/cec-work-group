/* eslint-disable @typescript-eslint/no-namespace */

/**
* 事件中心-事件动态-Model类库
*/
export namespace IpostFindEventDynamicsByIdSpace {

  export class RequestParams {
    eventId?: string;
    constructor() {
      this.eventId = "";
    }
  }

  export interface Data {
    eventid: number;
    processstate: string;
    id: number;
    title: string;
    processtime: string;
    content: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    desc: string;
  }
}
/**
* 事件中心-查询事件详情-Model类库
*/
export namespace IpostFindEventDetailByIdSpace {

  export class RequestParams {
    eventId?: string;
    constructor() {
      this.eventId = "";
    }
  }

  export interface VideoList { }

  export interface Indicies {
    code: string;
    conditionIndex: number;
    defineUnit: string;
    displayCard: string;
    eventId: string;
    name: string;
    sort: number;
    unit: string
    value: string
  }
  export interface Data extends Record<string, any> {
    coordinates?: number[];
    eventLevel?: string;
    eventState?: string;
    videoList?: VideoList[];
    eventName?: string;
    name: string;
    responseLevelName: string;
    eventTypeName?: string;
    eventTypeCode: string;
    strategyInfoId: string;
    id?: string;
    mainAddress?: string;
    happenTime?: string;
    desc?: string;
    latitude: string;
    longitude: string;
    areaCode: string;
    areaName?: string;
    properties?: Record<string, any>;
    name: string;
    eventLevelName?: string;
    eventLevelCode: string;
    detailedAttachmentInfo?: any
    indicies: Indicies[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}
/**
* 事件中心-事件列表-Model类库
*/
export namespace IpostFindEventListSpace {

  export class RequestParams {
    areaCode?: string; eventTypeCode?: string; distance?: number; latitude?: string; eventName?: string; pageSize?: number; startTime?: string; page?: number; endTime?: string; eventLevelCode?: string; longitude?: string;
    constructor() {
      this.areaCode = ""; this.eventTypeCode = ""; this.distance = 0; this.latitude = ""; this.eventName = ""; this.pageSize = 0; this.startTime = ""; this.page = 0; this.endTime = ""; this.eventLevelCode = ""; this.longitude = "";
    }
  }

  export interface List {
    eventState: string;
    latitude: string;
    eventName: string;
    eventTypeName: string;
    id: number;
    mainAddress: string;
    happenTime: string;
    longitude: string;
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
export namespace IpostEventTypeTree {

  export interface Data {
    name: string;
    id: number;
    children: Data[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}
  /**
 * 动态列表-一张图-Model类库
 */
export namespace IpostListForDataViewSpace {

  export interface User {
    name: string;
    deport: string;
  }

  export interface List {
    id: number;
    eventId: number;
    title: string;
    processState: string;
    users: User[];
    content: string;
    happenedTime: string;
  }

  export interface Data {
    totalRow: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    list: List[];
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
* 修改事件-Model类库
*/
export namespace IpostModifyEventInfoSpace {

  export class RequestParams {
    id?: number; name?: string; eventTypeCode?: string; eventLevelCode?: string; happenTime?: string; desc?: string; drill?: number; personDeadNum?: number; personInjuredNum?: number; personSeriousInjuredNum?: number; personPoisonedNum?: number; personTrappedNum?: number; personTransferNum?: number; personMissingNum?: number; personAffectedNum?: number; ecoLossDirect?: number; ecoLossIndirect?: number; ecoLossHouseCollapse?: number; ecoLossAffectedFarmland?: number; ecoLossAffectedPasture?: number; ecoLossDisasterForest?: number; ecoLossHouseDamaged?: number; ecoLossStatTime?: string; infrastructureBridgeBreakDuration?: number; infrastructureWaterBreakDuration?: number; infrastructureCommunicationBreakDuration?: number; otherReceiveReason?: string; otherTakenMeasure?: string; otherResourceRequest?: string; reportInfoSource?: string; reportTime?: string; addressList?: []; mainAreaCode?: string; eventState?: string; detailedAttachmentInfo?: [];
    constructor() {
      this.id = 0; this.name = ""; this.eventTypeCode = ""; this.eventLevelCode = ""; this.happenTime = ""; this.desc = ""; this.drill = 0; this.personDeadNum = 0; this.personInjuredNum = 0; this.personSeriousInjuredNum = 0; this.personPoisonedNum = 0; this.personTrappedNum = 0; this.personTransferNum = 0; this.personMissingNum = 0; this.personAffectedNum = 0; this.ecoLossDirect = 0; this.ecoLossIndirect = 0; this.ecoLossHouseCollapse = 0; this.ecoLossAffectedFarmland = 0; this.ecoLossAffectedPasture = 0; this.ecoLossDisasterForest = 0; this.ecoLossHouseDamaged = 0; this.ecoLossStatTime = ""; this.infrastructureBridgeBreakDuration = 0; this.infrastructureWaterBreakDuration = 0; this.infrastructureCommunicationBreakDuration = 0; this.otherReceiveReason = ""; this.otherTakenMeasure = ""; this.otherResourceRequest = ""; this.reportInfoSource = ""; this.reportTime = ""; this.addressList = []; this.mainAreaCode = ""; this.eventState = ""; this.detailedAttachmentInfo = [];
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
