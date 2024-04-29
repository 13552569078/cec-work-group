

export namespace IpostFindFocusGoalsPageByTypeSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostSupportResourcePageSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostStatResourcePageSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostListEventPersonsSpace {
  export class RequestParams {
    eventId?: string;
    userName?: string;
    status?: string;
    rangeType?: string;
    circleCenter?: any;
    radius?: number;
    constructor() {
      this.eventId = "";
      this.userName = "";
      this.status = "";
      this.rangeType = "";
      this.circleCenter = "";
      this.radius = 0;
    }
  }

  export interface Data {
    userId: string;
    userName: string;
    orgId: string;
    orgName: string;
    longitude: string;
    latitude: string;
    userStatus: number;
    createAt: string;
    checked: boolean;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}

export namespace IpostFindCommandCenterAssemblePointListSpace {
  export interface Data {
    id: number;
    eventInfoId: number;
    longitude: string;
    latitude: string;
    assembleAddress: string;
    assembleTitle: string;
    orgCount: number;
    userCount: number;
    assembleUserCount: number;
    assembleOrgCount: number;
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
* 事件中心-周边资源统计-Model类库
*/
export namespace IpostStatEventSurroundingResourcesSpace {
  export interface Data {
    resoureType: string;
    sum: number;
    checked?: boolean;
    label?: string;
    icon?: string
  }

  export interface Model {
    code: number;
    data: Data[];
    desc: string;
  }
}


export namespace IpostStatEventSurroundingItemsSpace {
  export interface Data {
    resoureType: string;
    sum: number;
    checked?: boolean;
    label?: string;
    icon?: string
  }

  export interface Model {
    code: number;
    data: Data[];
    desc: string;
  }
}

/**
* 事件中心-周边重大防护目标统计-Model类库
*/
export namespace IpostStatEventSurroundingProtectionTargetSpace {
  export interface Data {
    resoureType: string;
    sum: number;
    checked?: boolean;
    label?: string;
    icon?: string
  }

  export interface Model {
    code: number;
    data: Data[];
    desc: string;
  }
}
export namespace IpostStatEventSurroundingRiskSpace {
  export interface Data {
    resoureType: string;
    sum: number;
    checked?: boolean;
    label?: string;
    icon?: string
  }

  export interface Model {
    code: number;
    data: Data[];
    desc: string;
  }
}

/**
* 事件中心-周边资源列表-Model类库
*/
export namespace IpostFindEventSurroundingResourcesSpace {
  export interface PageData {
    resName: string;
    areaCode: string;
    address: string;
    resType: string;
    latitude: string;
    dist: number;
    id: string;
    linkman: string;
    tags: string;
    resourceType: string;
    longitude: string;
    personMobile: string;
    personName: string;
  }

  export interface Model {
    code: number;
    data: PageData[];
    desc: string;
  }
}
/**
      * 事件中心-周边重点防护目标列表-Model类库
      */
export namespace IpostFindEventSurroundingProtectionTargetSpace {

  export interface PageData {
    resName: string;
    areaCode: string;
    address: string;
    resType: string;
    latitude: string;
    dist: number;
    id: string;
    linkman: string;
    tags: string;
    resourceType: string;
    longitude: string;
    personMobile: string;
    personName: string;
  }

  export interface Model {
    code: number;
    data: PageData[];
    desc: string;
  }
}

/**
     * 事件中心-周边风险隐患点列表-Model类库
     */
export namespace IpostFindEventSurroundingRiskSpace {
  export interface PageData {
    resName: string;
    areaCode: string;
    address: string;
    resType: string;
    latitude: string;
    dist: number;
    id: string;
    linkman: string;
    tags: string;
    resourceType: string;
    longitude: string;
    personMobile: string;
    personName: string;
  }
  export interface Model {
    code: number;
    data: PageData[];
    desc: string;
  }
}






