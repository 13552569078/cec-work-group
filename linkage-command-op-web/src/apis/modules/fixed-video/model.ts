export namespace IpostFindEventFixedDeviceListSpace {

  export interface Data {
    distcode: string;
    videoCode: string;
    distance: number;
    address: string;
    videoUrl: string;
    videoName: string;
    id: number;
    videoState: string;
    areaCode: string;
  }

  export interface Model {
    code: number;
    data: {
      totalRow: number;
      list: Data[]
    };
    desc: string;
  }
}

export namespace IpostFindVideoPreviewUrlSpace {

  export interface Data {
    distcode: string;
    videoCode: string;
    distance: number;
    address: string;
    videoUrl: string;
    videoName: string;
    id: number;
    videoState: string;
    areaCode: string;
  }

  export interface Model {
    code: number;
    data: Data;
    desc: string;
  }
}

export namespace IpostFindEventFixedDeviceTreeSpace {

  export interface Data {
    dist: string;
    videoCode: string;
    address: string;
    videoUrl: string;
    name: string;
    id: number;
    parentId: string;
    isDevice: boolean;
    videoState: string;
    areaCode: string;
    longitude: string;
    latitude: string;
    count: number;
    children: Array<Data>
  }

  export interface Model {
    code: number;
    data: {
      total: number;
      tree: Data[]
    };
    desc: string;
  }
}

