/* eslint-disable @typescript-eslint/no-namespace */

/**
* 字典
*/
export namespace IgetDictListSpace {

  export class RequestParams {
    dictType?: string;
    pageSize?: number;
    constructor() {
      this.dictType = "";
      this.pageSize = 100;
    }
  }

  export interface Data {
    list: [{
      dictLabel: string,
      dictValue: string
    }]
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}

/**
* 行政区划
*/
export namespace IgetAreaListSpace {

  export interface Data {
    name: string;
    id: number;
    areaCode: string;
    children: Data[]
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}

/**
* 事件类型
*/
export namespace IgetEventTypeListSpace {

  export class RequestParams {
    platform?: string|number;
    constructor() {
      this.platform = "";
    }
  }

  export interface Data {
    eventTypeName: string;
    id: number;
    level: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}


