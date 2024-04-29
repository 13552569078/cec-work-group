/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 用户登录-Model类库
 */
export namespace IpostLoginSsoSpace {

  export class RequestParams{
    account?:string;clientType?:string;password?:string;passwordEncryptType?:number;tenantId?:number;
    constructor(){
      this.account="";this.clientType="";this.password="";this.passwordEncryptType=0;this.tenantId=0;
    }
  }

  export interface Data {
    authorization: string;
    expires: number;
    userId: number;
  }

  export interface Model {
    code: string;
    data: Data;
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
/**
 * 校验token-Model类库
 */
export namespace IpostCheckTokenSsoSpace {

  export interface Data {
    msg: string;
    valid: number;
  }

  export interface Model {
    code: string;
    data: Data;
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
/**
 * 用户列表-Model类库
 */
export namespace IpostFindUserUserSpace {

  export class RequestParams{
    account?:string;currentPage?:object|number;mobile?:string;orgId?:number;orgIds?:[];pageSize?:number;userIds?:[];userName?:string;userType?:number;
    constructor(){
      this.account="";this.currentPage={};this.mobile="";this.orgId=0;this.orgIds=[];this.pageSize=0;this.userIds=[];this.userName="";this.userType=0;
    }
  }

  export interface CurrentPage {}

  export interface HasNextPage {}

  export interface HasPreviousPage {}

  export interface IsFirstPage {}

  export interface IsLastPage {}

  export interface List {
    account: string;
    id: number|string;
    mobile: string;
    orgName: string;
    state: number;
    stateName: string;
    userName: string;
    userType: number;
    userTypeName: string;
    active?: boolean;
  }

  export interface PageSize {}

  export interface TotalPage {}

  export interface TotalRow {}

  export interface Data {
    currentPage: CurrentPage;
    hasNextPage: HasNextPage;
    hasPreviousPage: HasPreviousPage;
    isFirstPage: IsFirstPage;
    isLastPage: IsLastPage;
    list: List[];
    pageSize: PageSize;
    totalPage: TotalPage;
    totalRow: TotalRow;
  }

  export interface Model {
    code: string;
    data: Data;
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
/**
 * 组织机构树-Model类库
 */
export namespace IpostOrgTreeOrgSpace {

  export interface Children {}

  export interface Data {
    administrativeLevel: number;
    areaCode: string;
    areaName: string;
    children: Children[];
    id: number;
    orgName: string;
    parentId: number;
    sort: number;
    userType: number;
  }

  export interface Model {
    code: string;
    data: Data[];
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
/**
 * 用户退出-Model类库
 */
export namespace IpostLogoutSsoSpace {

  export interface Model {
    code: string;
    data: boolean;
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
/**
 * 获取当前登录用户的信息-Model类库
 */
export namespace IpostGetUserInfoSsoSpace {

  export interface SourceId {}

  export interface Operation {
    hasScope: number;
    operationCode: string;
    operationName: string;
    scopeBy: number;
    scopeType: number;
    sourceIds: SourceId[];
  }

  export interface Function {
    functionCode: string;
    functionName: string;
    hasScope: number;
    operations: Operation[];
    scopeBy: number;
  }

  export interface OrgList {
    administrativeLevel: number;
    areaCode: string;
    areaName: string;
    areaShortName: string;
    isMain: number;
    orgId: number;
    orgName: string;
  }

  export interface Data {
    account: string;
    functions: Function[];
    mobile: string;
    orgList: OrgList[];
    tenantId: number;
    tenantName: string;
    userId: number;
    userName: string;
    userType: number;
  }

  export interface Model {
    code: string;
    data: Data;
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
/**
 * 行政区划树-Model类库
 */
export namespace IpostAreaTreeAreaSpace {

  export interface Children {}

  export interface Data {
    administrativeLevel: number;
    areaCode: string;
    areaName: string;
    children: Children[];
    id: number;
    parentId: number;
    sort: number;
  }

  export interface Model {
    code: string;
    data: Data[];
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
