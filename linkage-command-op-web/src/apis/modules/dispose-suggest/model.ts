/* eslint-disable @typescript-eslint/no-namespace */

/**
 * findEventSurroundingItems-Model类库
 */
export namespace IpostFindEventSurroundingItemsSpace {

  export class RequestParams{
    resourceType?:string[];keyWord?:string;longitude?:string;latitude?:string;distance?:string;sortType?:number;
    constructor(){
      this.resourceType=[];this.keyWord="";this.longitude="";this.latitude="";this.distance='';this.sortType=0;
    }
  }

  export interface Data {
    id: number;
    resName: string;
    resourceType: string;
    areaCode: string;
    address: string;
    longitude: string;
    latitude: string;
    dist: number;
    personName: string;
    personMobile: string;
    no?: number;
    name?: string;
    type?: string;
    distance?: number;
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
 * 事件辅助决策-列表-Model类库
 */
export namespace IpostFindEventPolicyDecisionPageSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;eventInfoId?:string;name?:string;pdfFileId?:string;pdfFileUrl?:string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.eventInfoId='';this.name="";this.pdfFileId="";this.pdfFileUrl="";
    }
  }

  export interface List {
    id: number;
    eventInfoId: number;
    name: string;
    pdfFileId: string;
    pdfFileUrl: string;
    curPdfUrl?: string;
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
 * 专家建议表-列表-Model类库
 */
export namespace IpostFindExpertAdvicePageSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;expertName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFile?:string;eventId?:string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.expertName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFile="";this.eventId='';
    }
  }

  export interface List {
    id: number;
    expertName: string;
    adviceTime: string;
    orgName: string;
    adviceContent: string;
    adviceFile: string;
    eventId: number;
    adviceFileName: string;
    rowIndex?: number;
    userName?: string;
    adivseContent?: string;
    adivseTime?: string;
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
 * 事件辅助决策-删除-Model类库
 */
export namespace IpostDeleteEventPolicyDecisionSpace {

  export class RequestParams{
    id?:number;
    constructor(){
      this.id=0;
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
 * adviceStat-Model类库
 */
export namespace IgetAdviceStatSpace {

  export class RequestParams{
    eventId?:number;
    constructor(){
      this.eventId=0;
    }
  }

  export interface Data {
    decisionNum: number;
    expertAdviceNum: number;
    departmentAdviceNum: number;
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
 * 事件辅助决策-添加-Model类库
 */
export namespace IpostAddEventPolicyDecisionSpace {

  export class RequestParams{
    eventInfoId?:number;desc?:string;msdsParams?:[];risk?:[];protect?:[];resource?:[];image?:string;expertAdvise?:[];orgAdvise?:[];
    constructor(){
      this.eventInfoId=0;this.desc="";this.msdsParams=[];this.risk=[];this.protect=[];this.resource=[];this.image="";this.expertAdvise=[];this.orgAdvise=[];
    }
  }

  export interface Data {}

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}


/**
 * 部门建议表-列表-Model类库
 */
export namespace IpostFindDepartmentAdvicePageSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;departmentName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFile?:string;eventId?:string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.departmentName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFile="";this.eventId='';
    }
  }

  export interface List {
    id: number;
    departmentName: string;
    adviceTime: string;
    orgName: string;
    adviceContent: string;
    adviceFile: string;
    eventId: number;
    adviceFileName: string;
    rowIndex?: number;
    userName?: string;
    adivseContent?: string;
    adivseTime?: string;
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
 * bufferSize-Model类库
 */
export namespace IgetBufferSizeSpace {

  export class RequestParams{

    constructor(){

    }
  }

  export interface Data {}

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}
