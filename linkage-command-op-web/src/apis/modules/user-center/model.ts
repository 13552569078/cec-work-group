/* eslint-disable @typescript-eslint/no-namespace */

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
 * 行政区划树-Model类库
 */
 export namespace IpostAreaTreeAreaSpace {

  export interface Children {}

  export interface Data {
    children?: Children[];
    firstCh?: string;
    hasNext?: string;
    id?: string;
    lat?: string;
    level?: number;
    lng?: string;
    name?: string;
    pid?: string;
    pinYin?: string;
    shortName?: string;
    areaCode: string
    areaName?: string
    latitude?: string
    longitude?: string
    hasNextLevel?: boolean
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
 * 部门树-Model类库
 */
export namespace IgetAreaTreeSpace {

  export class RequestParams{

    constructor(){

    }
  }

  export interface Data {
    code: string;
    name: string;
    latitude: string|number;
    longitude: string|number;
    children?: Data[];
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
* 部门树-Model类库
*/
export namespace IgetFindOrgTreeSpace {

export class RequestParams{

  constructor(){

  }
}

export interface Data {
id: string;
orgName: string;
parentId: string;
isSign: boolean;
children: Data[];
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
* 查询部门下人员-Model类库
*/
export namespace IgetFindUserListByOrgIdSpace {

  export class RequestParams{
    orgId?:string;
    constructor(){
      this.orgId="";
    }
  }

export interface Data {
  name: string;
  userId: string;
  mobile: string;
  orgName: string;
  orgId: string;
  tenantId: string;
  account: string;
  gender: string;
  sourceEmpId: string;
  userName: string;
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
* 查询多个部门下人员-Model类库
*/
export namespace IgetFindUserListByOrgIdsSpace {

  export class RequestParams{
    orgIds?:string;
    constructor(){
      this.orgIds="";
    }
  }

export interface Data {
  userName: string;
  userId: string;
  mobile: string;
  orgName: string;
  orgId: string;
  tenantId: string;
  account: string;
  gender: string;
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
 * 资源类型属性-列表-Model类库
 */
export namespace IpostFindResourceTypeAttrPageSpace {

  export class RequestParams{
    offset?:number;currentPage?:number;pageSize?:number;typeCode?:string;code?:string;name?:string;type?:number;notNull?:number;length?:number;precision?:number;demo?:string;system?:number;display?:number;sort?:number;
    constructor(){
      this.offset=0;this.currentPage=0;this.pageSize=0;this.typeCode="";this.code="";this.name="";this.type=0;this.notNull=0;this.length=0;this.precision=0;this.demo="";this.system=0;this.display=0;this.sort=0;
    }
  }

  export interface List {
    id: number|string;
    typeCode: string;
    code: string;
    name: string;
    type: number;
    notNull: number;
    length: number;
    precision: number;
    demo: string;
    system: number;
    display: number;
    sort: number;
    isConst?: boolean;
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
