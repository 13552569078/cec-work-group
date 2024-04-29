/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 组织机构-用户信息-Model类库
 */
export namespace IpostUsersSpace {
  export interface List {
    aid: string;
    ancestors: string;
    avatar: string;
    certType: string;
    createTime: string;
    email: string;
    fxEmpid: string;
    id: string | number;
    idcard: string;
    jobNum: string;
    name: string;
    nameSpell: string;
    nickName: string;
    orgId: string;
    orgName: string;
    phone: string;
    pid: string;
    remark: string;
    sex: number;
    status: number;
    userType: string;
    username: string;
  }

  export interface Model {
    code: number;
    data: {
      list: List[];
    };
    message: string;
  }
}
/**
 * 组织机构树-Model类库
 */
export namespace IgetTreeSpace {
  export class RequestParams {
    constructor() {}
  }

  export interface Children {}

  export interface Children {
    children: Children[];
    id: number;
    name: string;
    orgCode: string;
    orgType: string;
    pid: number;
  }

  export interface Data {
    children: Children[];
    id: number;
    name: string;
    orgCode: string;
    orgType: string;
    pid: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
