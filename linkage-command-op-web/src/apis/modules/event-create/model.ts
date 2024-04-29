export namespace IpostEventTypeTree {

  export interface Data {
   name: string;
   id: number;
   children: Data[];
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
  }

  /**
* 新增事件-Model类库
*/
export namespace IpostAddEventInfoSpace {

  export class RequestParams {
    name?: string; eventTypeCode?: string; eventLevelCode?: string; happenTime?: string; desc?: string; drill?: number; longitude?: string; latitude?: string; mainAddress?: string; mainAreaCode?: string;
    constructor() {
      this.name = ""; this.eventTypeCode = ""; this.eventLevelCode = ""; this.happenTime = ""; this.desc = ""; this.drill = 0; this.longitude = ""; this.latitude = ""; this.mainAddress = ""; this.mainAreaCode = "";
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
 * -事件等级-Model类库
 */
export namespace IgetEventLevelsSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface Name { }

  export interface Value { }

  export interface Data {
    name: Name;
    value: Value;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}
