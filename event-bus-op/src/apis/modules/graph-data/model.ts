/* eslint-disable @typescript-eslint/no-namespace */

export namespace IgetLineDataSpace {

  export class RequestParams {
    originatorSysCode?: string; receiveSysCode?:string; pageSize?: string|number; pageNum?:  string|number;
    constructor() {
      this.originatorSysCode = '';
      this.receiveSysCode = '';
      this.pageSize = 10;
      this.pageNum = 1;
    }
  }
  export interface List {
    originalId: string|number;
    originalName: string;
    originalSysCode: string;
    originalSysText: string;
    originalValue: string;
    receiveId: string|number;
    receiveName: string;
    receiveSysCode: string;
    receiveSysText: string;
    receiveValue: string;
  };
  
  export interface Data {
    total: number;
    list: List[]
  };

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}

export namespace IgetEventTypeConfigListDataSpace {

  export class RequestParams {
    originalValue?: string; originatorSysCode?:string;
    constructor() {
      this.originalValue = '';
      this.originatorSysCode = '';
    }
  }

  export interface childrenList {
    id: string|number;
    sysFlag: string;
    originalSysCode: string;
    originalName: string;
    originalValue: string;
  };
   

  export interface Data {
    childrenList:childrenList[];
    id: string|number;
    originalName: string;
    originalSysCode: string;
    originalSysText: string;
    originalValue: string;
    parentId: string;
    replaceName: string;
    replaceValue: string;
    sysFlag: string;
    sysFlagText: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}