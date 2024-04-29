/* eslint-disable @typescript-eslint/no-namespace */
/**
     * 视频列表
     */
export namespace IgetVideoTypeSpace {

  export class RequestParams {
    name?: string;
    adcode?: string;
    pageNo: string;
    pageSize: string;
    constructor() {
      this.name = "";
      this.adcode = "";
      this.pageNo = "";
      this.pageSize = "";
    }
  }

  export interface List {
    id: string;
    name: string;
    orgnizationName: string;
    district: string;
    address: string;
    deviceName: string;
    location: any
  }

  export interface Data {
    pageNo: number;
    pageSize: number;
    total: number;
    items: List[];
  }

  export interface Model {
    code: string;
    msg: string;
    data: Data;
  }
}

/**
* 详情
*/
export namespace IgetVideoDetailTypeSpace {

  export class RequestParams {
    deviceId?: string;
    protocol:number;
    encode:number;
    external:true;
    constructor() {
      this.deviceId = "";
      this.protocol = 0;
      this.encode = 0;
      this.external = true;
    }
  }

  export interface Data {
    creator: string;
    streamId: string;
    ssrc: string;
    channelType: string;
    source: string;
    deviceId: string;
    url: string;
    edgeId: string;
    protocol: string;
    streamType: string;
    encodeType: string;
    tenantId: string;
    status: string;
  }

  export interface Model {
    code: string;
    msg: string;
    data: Data;
  }
}

