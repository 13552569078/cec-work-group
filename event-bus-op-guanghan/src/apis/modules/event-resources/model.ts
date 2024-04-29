/* eslint-disable @typescript-eslint/no-namespace */

/**
* 资源半径查询-Model类库
*/
export namespace IpostResourceRadiusQuerySpace {

  export interface Data {
    coordx: number;
    coordy: number;
    id: number;
    name: string;
    type: number,
    typeName: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
      * 半径统计-事件、资源、视频数量统计-Model类库
      */
export namespace IpostDotRadiusStatByCoordinateSpace {

  export class RequestParams {
    coordx?: string; coordy?: string; endTime?: string; radius?: number; startTime?: string;
    constructor() {
      this.coordx = ""; this.coordy = ""; this.endTime = ""; this.radius = 0; this.startTime = "";
    }
  }

  export interface EventStat {
    completedNum: number;
    disposalNum: number;
    preDispatchNum: number;
  }

  export interface ResourceStat {
    businessHubNum: number;
    hospitalNum: number;
    hotelNum: number;
    schoolNum: number;
    threeSmallPlacesNum: number;
    transportHubNum: number;
  }

  export interface VideoStat {
    monitorVideoNum: number;
  }

  export interface Data {
    eventStat: EventStat;
    resourceStat: ResourceStat;
    videoStat: VideoStat;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 视频列表-地图打点-Model类库
*/
export namespace IlistSpace {

  export class RequestParams {
    name?: string; pageNum?: number; pageSize?: number; typeList?: [];
    constructor() {
      this.name = ""; this.pageNum = 0; this.pageSize = 0; this.typeList = [];
    }
  }

  export interface Data {
    address: string;
    contactName: string;
    contactPhone: string;
    id: number;
    latitude: string;
    longitude: string;
    gpsX: string;
    gpsY: string;
    name: string;
    resourceDesc: string;
    type: number;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 视频列表-分页-Model类库
*/
export namespace IlistPageSpace {

  export class RequestParams {
    name?: string; type?: string; pageNum?: number; pageSize?:number;
    constructor() {
      this.name = ""; this.type = ""; this.pageNum = 1; this.pageSize = 10; 
    }
  }

  export interface List {
    address: string;
    contactName: string;
    contactPhone: string;
    desc: string;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    type?: number | string;
  }

  export interface Data {
    currentPage: number;
    pageSize: number;
    totalPage: number;
    totalRow: number;
    list: List[]
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 资源列表-Model类库
*/
export namespace IResourcelistSpace {

  export class RequestParams {
    name?: string; type?: string;
    constructor() {
      this.name = ""; this.type = "";
    }
  }

  export interface Data {
    address: string;
    contactName: string;
    contactPhone: string;
    desc: string;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    type?: number | string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 资源列表-Model类库
*/
export namespace IResourcelistPageSpace {

  export class RequestParams {
    name?: string; type?: string; pageNum?: number; pageSize?: number;
    constructor() {
      this.name = ""; this.type = ""; this.pageNum = 1; this.pageSize = 10;
    }
  }

  export interface List {
    address: string;
    contactName: string;
    contactPhone: string;
    desc: string;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    type?: number | string;
  }

  export interface Data {
    currentPage: number;
    pageSize: number;
    totalPage: number;
    totalRow: number;
    list: List[]
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 资源详情-Model类库
*/
export namespace IpostResourceDetailSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface Data {
    address: string;
    contactName: string;
    contactPhone: string;
    desc: string;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
    resourceDesc: string;
    type: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 视频半径查询-Model类库
*/
export namespace IpostVideoRadiusQuerySpace {

  export interface Data {
    coordx: number;
    coordy: number;
    id: number;
    name: string;
  }

  export interface Model {
    code: number;
    data: Data[];
    message: string;
  }
}
/**
* 视频详情-Model类库
*/
export namespace IpostVideoDetailSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface Data {
    address: string;
    cameraType: string;
    channelCode: string;
    channelId: string;
    channelName: string;
    channelType: string;
    deviceCode: string;
    gpsX: string;
    gpsY: string;
    id: number;
    name: string;
    resourceCode: string;
    resourceName: string;
    status: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}