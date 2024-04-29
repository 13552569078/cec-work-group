/* eslint-disable @typescript-eslint/no-namespace */

/**
* 监测主体-修改-Model类库
*/
export namespace IpostUpdateSpace {

  export class RequestParams {
    id?: number; regionName?: string; regionTypeCode?: string; principalName?: string; principalMobile?: string; responsibleName?: string; responsibleMobile?: string; address?: string; longitude?: string; latitude?: string; streetAreaCode?: string; belongOrgId?: number; belongName?: string; belongMobile?: string; chargeOrgId?: number; chargeName?: string; chargeMobile?: string; description?: string; photoFileIds?: [];
    constructor() {
      this.id = 0; this.regionName = ''; this.regionTypeCode = ''; this.principalName = ''; this.principalMobile = ''; this.responsibleName = ''; this.responsibleMobile = ''; this.address = ''; this.longitude = ''; this.latitude = ''; this.streetAreaCode = ''; this.belongOrgId = 0; this.belongName = ''; this.belongMobile = ''; this.chargeOrgId = 0; this.chargeName = ''; this.chargeMobile = ''; this.description = ''; this.photoFileIds = [];
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
* 监测主体-明细-Model类库
*/
export namespace IgetMonitorRegionSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface PhotoFile {
    id: number;
    originalName: string;
    url: string;
  }

  export interface Data {
    id: number;
    regionName: string;
    regionTypeCode: string;
    regionTypeName: string;
    principalName: string;
    principalMobile: string;
    responsibleName: string;
    responsibleMobile: string;
    address: string;
    longitude: string;
    latitude: string;
    streetAreaCode: string;
    streetAreaName: string;
    belongOrgId: number|string;
    belongOrgName: string;
    belongName: string;
    belongMobile: string;
    chargeOrgId: number|string;
    chargeOrgName: string;
    chargeName: string;
    chargeMobile: string;
    description: string;
    photoFile?: PhotoFile[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 监测主体-新增-Model类库
*/
export namespace IaddSpace {

  export class RequestParams {
    id?: number; regionName?: string; regionTypeCode?: string; principalName?: string; principalMobile?: string; responsibleName?: string; responsibleMobile?: string; address?: string; longitude?: string; latitude?: string; streetAreaCode?: string; belongOrgId?: number; belongName?: string; belongMobile?: string; chargeOrgId?: number; chargeName?: string; chargeMobile?: string; description?: string; photoFileIds?: [];
    constructor() {
      this.id = 0; this.regionName = ''; this.regionTypeCode = ''; this.principalName = ''; this.principalMobile = ''; this.responsibleName = ''; this.responsibleMobile = ''; this.address = ''; this.longitude = ''; this.latitude = ''; this.streetAreaCode = ''; this.belongOrgId = 0; this.belongName = ''; this.belongMobile = ''; this.chargeOrgId = 0; this.chargeName = ''; this.chargeMobile = ''; this.description = ''; this.photoFileIds = [];
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
* 监测主体下拉框列表-Model类库
*/
export namespace IgetRegionSimpleListSpace {

  export class RequestParams {
    regionName?: string;
    constructor() {
      this.regionName = '';
    }
  }

  export interface Data {
    id: number;
    regionName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 监测主体-分页查询-Model类库
*/
export namespace IpostPageSpace {

  export class RequestParams {
    currentPage?: number; pageSize?: number; regionName?: string; regionTypeCode?: string; streetAreaCode?: string;
    constructor() {
      this.currentPage = 0; this.pageSize = 0; this.regionName = ''; this.regionTypeCode = ''; this.streetAreaCode = '';
    }
  }

  export interface List {
    id: number;
    regionName: string;
    regionTypeCode: string;
    regionTypeName: string;
    principalName: string;
    principalMobile: string;
    address: string;
    streetAreaCode: string;
    streetAreaName: string;
    belongOrgId: number;
    belongOrgName: string;
    chargeOrgId: number;
    chargeOrgName: string;
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
/**
* 监测主体-删除-Model类库
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
* 监测点-监测主体列表-Model类库
*/
export namespace IgetRegionListSpace {

  export class RequestParams {

    constructor() {

    }
  }

  export interface RegionList {
    id: number;
    regionName: string;
  }

  export interface Data {
    id: number;
    regionTypeName: string;
    regionTypeCode: string;
    regionList: RegionList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data[];
  }
}
/**
* 监测主体-主体轮廓-Model类库
*/
export namespace IgetOutlineSpace {

  export class RequestParams {
    regionId?: number;
    constructor() {
      this.regionId = 0;
    }
  }

  export interface GisOutlineList { }

  export interface Data {
    regionId: number;
    gisOutlineList: GisOutlineList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
/**
* 监测主体-更新轮廓信息-Model类库
*/
export namespace IpostUpdateGisOutlineSpace {

  export class RequestParams {
    regionId?: number; gisOutlineList?: [];
    constructor() {
      this.regionId = 0; this.gisOutlineList = [];
    }
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: number;
  }
}
