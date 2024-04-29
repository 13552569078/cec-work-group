/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 图层-修改名称-Model类库
 */
export namespace IpostModifyCertPlottingLayerPlottingSpace {
  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: boolean;
  }
}
/**
 * 图层-查询图层详情-Model类库
 */
export namespace IpostFindCertPlottingLayerByIdPlottingSpace {
  export interface MarkVoList {
    id?: number;
    layerId?: string | number;
    markOther?: string;
    userId?: string;
  }

  export interface Data {
    id?: number;
    layerId?: string | number;
    userId?: string;
    resourceId?: string;
    layerName?: string;
    layerType?: string;
    markVoList?: MarkVoList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}
/**
 * 图层-同步视野-Model类库
 */
export namespace IpostSyncViewPlottingSpace {
  export class RequestParams {
    resourceId?: string;
    id?: string;
    layerId?: string | number;
    longitude?: string;
    latitude?: string;
    level?: number;
    userId?: string;
    zoom?: number;
    bearing?: number;
    pitch?: number;
    center?: Center;
    constructor() {
      this.resourceId = "";
      this.id = "";
      this.layerId = "";
      this.longitude = "";
      this.latitude = "";
      this.level = 0;
      this.userId = "";
      this.zoom = 0;
      this.bearing = 0;
      this.pitch = 0;
      this.center = {
        lng: "",
        lat: "",
      };
    }
  }
  export interface Center {
    lng?: string | number;
    lat?: string | number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: number;
  }
}
/**
 * 图层-图层列表-Model类库
 */
export namespace IpostLayerListPlottingSpace {
  export interface MarkVoList {
    id?: number;
    layerId?: string | number;
    markOther?: string;
    userId?: string;
  }

  export interface Data {
    id?: number;
    resourceId?: string;
    personId?: string;
    personName?: string;
    orgId?: string;
    orgName?: string;
    layerId?: string | number;
    layerName?: string;
    sort?: number;
    hasEdit?: number;
    hasShow?: number;
    hasMySelf?: number;
    markVoList?: MarkVoList[];
    peopleNum?: number;
    lastDateTime?: string;
    createMan?: string;
    hasPainting?: number;
    hasDelete?: number;
    createdUserId?: number;
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
 * 图层-顺序修改-Model类库
 */
export namespace IpostUpdateSortPlottingSpace {
  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: number;
  }
}

/**
 * 图层-图层列表-Model类库
 */
export namespace IpostLayerListSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;layerName?:string;layerType?:string;listType?:number|string;resourceId?:number|string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.layerName="";this.layerType="";this.listType=0;this.resourceId=0;
    }
  }

  export interface MarkVoList {
    id: number;
    resourceId: string;
    layerId: string;
    layerName: string;
    markName: string;
    markDesc: string;
    areaCode: number;
    areaCodeName: string;
    address: string;
    longitude: string;
    latitude: string;
    mapMarkId: string;
    markOther: string;
    userName: string;
    orgName: string;
    hasPermission: number;
    userId: string;
    top: number;
    updatedAt: string;
  }

  export interface List {
    id: number;
    resourceId: string;
    personId: string;
    personName: string;
    orgId: string;
    orgName: string;
    layerId: string;
    layerName: string;
    sort: number;
    hasEdit: number;
    hasShow: number;
    hasMySelf: number;
    markVoList: MarkVoList[];
    peopleNum: number;
    lastDateTime: string;
    createMan: string;
    hasPainting: number;
    hasDelete: number;
    myCreated: number;
    newInvited: number;
    layerType?: string;
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
    httpStatusCode: number;
    data: Data;
  }
}

/**
 * 图层-删除-Model类库
 */
export namespace IpostDeleteCertPlottingLayerPlottingSpace {
  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: boolean;
  }
}

/**
 * 图层-删除-Model类库
 */
export namespace IpostDeleteCertPlottingLayerSpace {

  export class RequestParams{
    ids?:[];
    constructor(){
      this.ids=[];
    }
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: boolean;
  }
}
/**
 * 图层-显隐修改-Model类库
 */
export namespace IpostUpdateShowPlottingSpace {
  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: number;
  }
}
/**
 * 图层-添加-Model类库
 */
export namespace IpostAddCertPlottingLayerPlottingSpace {
  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: string;
  }
}

/**
 * 图层-图层列表-Model类库
 */
export namespace IpostLayerListOnePicSpace {


  export interface MarkVoList {
    id: number;
    resourceId: string;
    layerId: string;
    layerName: string;
    markName: string;
    markDesc: string;
    areaCode: number;
    areaCodeName: string;
    address: string;
    longitude: string;
    latitude: string;
    mapMarkId: string;
    markOther: string;
    userName: string;
    orgName: string;
    hasPermission: number;
    userId: string;
    top: number;
    updatedAt: string;
  }

  export interface List {
    id: number;
    resourceId: string;
    personId: string;
    personName: string;
    orgId: string;
    orgName: string;
    layerId: string;
    layerName: string;
    sort: number;
    hasEdit: number;
    hasShow: number;
    hasMySelf: number;
    markVoList: MarkVoList[];
    peopleNum: number;
    lastDateTime: string;
    createMan: string;
    hasPainting: number;
    hasDelete: number;
    myCreated: number;
    newInvited: number;
    layerType?: string;
  }


  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: List[];
  }
}
