/* eslint-disable @typescript-eslint/no-namespace */

/**
* 监测主体类型-列表-Model类库
*/
export namespace IlistSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface Data {
    id: number;
    regionTypeName: string;
    regionTypeCode: string;
    description: string;
    regionNumber: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 监测主体类型-删除-Model类库
*/
export namespace IdeleteMSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: number;
  }
}
/**
* 监测主体类型-修改-Model类库
*/
export namespace IpostUpdateSpace {

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: number;
  }
}
/**
* 监测主体类型-新增-Model类库
*/
export namespace IaddSpace {

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: number;
  }
}