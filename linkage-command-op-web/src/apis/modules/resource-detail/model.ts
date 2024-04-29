/**
 * 资源主表-列表-Model类库
 */
export namespace IpostFindEquipByReserveIdSpace {

  export class RequestParams{
    reserveId?:number;
    constructor(){
      this.reserveId=0;
    }
  }

  export interface Attr {
    code: string;
    value: string;
    valueName: string;
  }

  export interface Data {
    id: number;
    typeCode: string;
    name: string;
    administrative: string;
    contacts: string;
    telephone: string;
    address: string;
    longitude: string;
    latitude: string;
    attrs: Attr[];
    [key: string]: any;
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
 * 应急资源-物资装备-列表-Model类库
 */
export namespace IpostFindResourceEquipListSpace {
  export class RequestParams {
    teamId?: number;
    reserveId?: number;
    constructor() {
      this.teamId = 0;
      this.reserveId = 0;
    }
  }

  export interface Data {
    id: number;
    resName: string;
    areaCode: string;
    areaName: string;
    measureNum: number;
    measureUnit: string;
    reserveId: number;
    teamId: number;
    address: string;
    latitude: string;
    longitude: string;
    status: number;
    personName: string;
    personMobile: string;
    measureUse: number;
    measureUseName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}
