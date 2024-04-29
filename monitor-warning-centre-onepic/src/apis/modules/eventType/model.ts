/* eslint-disable @typescript-eslint/no-namespace */
/**
* 查询事件类型列表（下拉框）-Model类库
*/
export namespace IgetListEventTypeListVOsEventTypeSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface Data {
    eventTypeCode: string;
    eventTypeName: string;
  }

  export interface Model {
    code: number;
    desc: string;
    tips: string;
    data: Data[];
  }
}
