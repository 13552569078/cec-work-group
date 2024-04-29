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
    children: Children[];
    firstCh?: string;
    hasNext?: string;
    id: string;
    lat?: string;
    level?: number;
    lng?: string;
    name: string;
    pid?: string;
    pinYin?: string;
    shortName?: string;
  }

  export interface Model {
    code: string;
    data: Data[];
    desc: string;
    httpStatusCode: number;
    tips: string;
  }
}
