/* eslint-disable @typescript-eslint/no-namespace */

export namespace IgetRectDataSpace {

  export class RequestParams {
    wgbm?: string; wglx?:string; wgmc?: string; sszjd?: string;
    constructor() {
      this.wgbm = '';
      this.wglx = '';
      this.wgmc = '';
      this.sszjd = '';
    }
  }

  export interface RectData {
    bjdw: string;
    wgbm: string;
    wglx: string;
    wgmc: string;
    sszjd: string;
  };

  export interface Model {
    code: number;
    data: RectData[];
    message: string;
  }
}

export namespace IgetRectManagerDataSpace {

  export class RequestParams {
    wgbm?: string; wglx?:string; pageSize?: number; pageNum?: number;
    constructor() {
      this.wgbm = '';
      this.wglx = '';
      this.pageSize = 10;
      this.pageNum = 1;
    }
  }

  export interface RectManagerInfo {
    dhhm: string;
    dwgcsf: string;
    xm: string;
    zw: string;
    zwgcsf: string;
  };

  export interface Data {
    list: RectManagerInfo[]
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}