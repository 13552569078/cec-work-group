/* eslint-disable @typescript-eslint/no-namespace */

/**
* 监测点-删除-Model类库
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
* 监测点-明细-Model类库
*/
export namespace IgetMonitorPointSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface EquipList { }

  export interface Data {
    id: number;
    regionId: number;
    regionName: string;
    pointName: string;
    eventTypeCode: string;
    eventTypeName: string;
    address: string;
    longitude: string;
    latitude: string;
    description: string;
    monitorUnitId: number;
    warningUnitId: number;
    equipList: EquipList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 监测点-修改-Model类库
*/
export namespace IgetUpdateSpace {

  export class RequestParams {
    id?: number; regionId?: number; pointName?: string; eventTypeCode?: string; address?: string; longitude?: string; latitude?: string; description?: string; monitorUnitId?: number; warningUnitId?: number; equipIdList?: [];
    constructor() {
      this.id = 0; this.regionId = 0; this.pointName = ''; this.eventTypeCode = ''; this.address = ''; this.longitude = ''; this.latitude = ''; this.description = ''; this.monitorUnitId = 0; this.warningUnitId = 0; this.equipIdList = [];
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
* 监测点-新增-Model类库
*/
export namespace IaddSpace {

  export class RequestParams {
    id?: number; regionId?: number; pointName?: string; eventTypeCode?: string; address?: string; longitude?: string; latitude?: string; description?: string; monitorUnitId?: number; warningUnitId?: number; equipIdList?: [];
    constructor() {
      this.id = 0; this.regionId = 0; this.pointName = ''; this.eventTypeCode = ''; this.address = ''; this.longitude = ''; this.latitude = ''; this.description = ''; this.monitorUnitId = 0; this.warningUnitId = 0; this.equipIdList = [];
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
* 监测点-分页查询-Model类库
*/
export namespace IgetPageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; regionId?: number; regionTypeCode?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.regionId = 0; this.regionTypeCode = '';
    }
  }

  export interface EquipList { }

  export interface List {
    id: number;
    regionId: number;
    regionName: string;
    pointName: string;
    eventTypeCode: string;
    eventTypeName: string;
    monitorUnit: string;
    warningUnit: string;
    equipList: EquipList[];
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
    data: Data;
  }
}