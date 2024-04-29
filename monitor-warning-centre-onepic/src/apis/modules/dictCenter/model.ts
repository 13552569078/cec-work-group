/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 查询事件类型列表（下拉框）-Model类库
 */
export namespace IgetListEventTypeListVOsSpace {

  export class RequestParams{

    constructor(){

    }
  }

  export interface Data {
    eventTypeCode: string;
    eventTypeName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 研判-事件等级下拉框接口-Model类库
 */
export namespace IgetListEventLevelVOsSpace {

  export class RequestParams{
    useFor?:number;eventTypeCode?:string;
    constructor(){
      this.useFor=0;this.eventTypeCode="";
    }
  }

  export interface Data {
    code: string;
    name: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
 * 查询字典列表-Model类库
 */
export namespace IgetListDictCustomVOsSpace {

  export class RequestParams{
    typeCodeList?:string;
    constructor(){
      this.typeCodeList="";
    }
  }

  export interface Data {
    typeCode: string;
    dictCode: string;
    dictName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
