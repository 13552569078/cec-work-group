/**
           * 组织机构-查询树-Model类库
           */
export namespace IgetFindCommandSysOrgTreeSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface Children { }

  export interface Children {
    id: string;
    orgName: string;
    parentId: string;
    areaCode: string;
    areaName: string;
    sort: number;
    address: string;
    children: Children[];
  }

  export interface Data {
    id: string;
    orgName: string;
    parentId: string;
    areaCode: string;
    areaName: string;
    sort: number;
    address: string;
    children: Children[];
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
* 策略指挥体系组-树-Model类库
*/
export namespace IpostFindStrategyCommandGroupTreeSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; strategyInfoId?: number; commandId?: number; commandName?: string; groupName?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.strategyInfoId = 0; this.commandId = 0; this.commandName = ""; this.groupName = "";
    }
  }

  export interface Children { }

  export interface Data {
    children: Children[];
    id: number;
    strategyInfoId: number;
    commandId: number;
    commandName: string;
    parentGroupId: number;
    groupId: number;
    groupName: string;
    groupDesc: string;
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
            * 用户表-列表-Model类库
            */
export namespace IpostFindCommandSysUserPageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; userName?: string; orgId?: number | string;keyWord?:string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.userName = ""; this.orgId = 0;this.keyWord = ''
    }
  }

  export interface CommunicationMode {
    id: number;
    relationId: number;
    mode: string;
    modeName: string;
    value: string;
  }

  export interface List {
    id: string;
    userName: string;
    gender: number;
    orgName: string;
    orgId: string;
    communicationMode: CommunicationMode[];
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
* 策略指挥体系人员-列表-Model类库
*/
export namespace IpostFindStrategyCommandUserPageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; strategyInfoId?: string; commandId?: number; groupId?: string; orgId?: number; orgName?: string; userId?: number; userName?: string; mobile?: string; roleIds?: string; jobDescription?: string; assembleStatus?: string;keyWord?:string
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.strategyInfoId = ''; this.commandId = 0; this.groupId = ''; this.orgId = 0; this.orgName = ""; this.userId = 0; this.userName = ""; this.mobile = ""; this.roleIds = ""; this.jobDescription = ""; this.assembleStatus = "";this.keyWord = ''
    }
  }

  export interface List {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: number;
    orgName: string;
    userId: number;
    userName: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
    assembleStatus: string;
    isFocus: number;
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
     * 任务表-校验重复执行人)-Model类库
     */
export namespace IpostJudgeSpace {

  export class RequestParams {
    taskOrganInfoAddParams?: []; taskUserInfoAddParams?: [];
    constructor() {
      this.taskOrganInfoAddParams = []; this.taskUserInfoAddParams = [];
    }
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: string;
  }
}
/**
* 策略指挥体系机构-列表-Model类库
*/
export namespace IpostFindStrategyCommandOrgPageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; strategyInfoId?: string; commandId?: number; groupId?: string; orgId?: number; orgName?: string; mobile?: string; roleIds?: string; jobDescription?: string;keyWord?:string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.strategyInfoId = ''; this.commandId = 0; this.groupId = ''; this.orgId = 0; this.orgName = ""; this.mobile = ""; this.roleIds = ""; this.jobDescription = "";this.keyWord = ""
    }
  }

  export interface List {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: number;
    orgName: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
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