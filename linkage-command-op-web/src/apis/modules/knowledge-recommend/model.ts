/* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 事件下知识文件统计-Model类库
      */
      export namespace IpostKnowledgeFolderFileEventTotalSpace {

        export class RequestParams{
          eventTypeName?:string;
          constructor(){
            this.eventTypeName="";
          }
        }

      export interface Data {
        lawsAndRegulationsNum: number;
        historyCaseNum: number;
        knowledgeNum: number;
        handlePreplanNum: number;
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
            * 事件下知识文档-列表-Model类库
            */
      export namespace IpostFindKnowledgeEventPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;fileType?:string;eventTypeName?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.fileType="";this.eventTypeName="";
          }
        }

      export interface List {
        id: number;
        filePageImg: string;
        knowledgeFileId: number;
        fileType: string;
        fileName: string;
        fileDescription: string;
        fileTags: string;
        filePolicy: string;
        fileContentType: string;
        readNum: number;
        url: string;
        createdAt: string;
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

      export namespace IpostMSDSPageSpace {

        export interface List {
          id: string;
          chName1: string; // 化学品中文名称
          chName2:string; //俗名
          enName1: string; //化学品英文名称
          enName2: string; // 英文别称
          casNo: string; // CAS编号
          regNo: string; //编码
          freightType: string; //freightType
          chemicalType: string; //chemicalType
          healthHazardType: string; //健康危害类别
          pureOrMix: number;
          dangerPic: string;
        }

        export interface Data {
          totalRow: number;
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

        export namespace IgetMSDSDetailByIdSpace {

          export interface Data {
            [x: string]: any;
            id: string;
            chName1: string; // 化学品中文名称
            chName2:string; //俗名
            enName1: string; //化学品英文名称
            enName2: string; // 英文别称
            bookNo: string;
            casNo: string; // CAS编号
            enterprise: string;
            address: string;
            effectDate: string;
            dangerPic: string;
            pureOrMix: number;
            regNo: string; //编码
            freightType: string; //freightType
            chemicalType: string; //chemicalType
            healthHazardType: string; //健康危害类别
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
            * 事件下知识文档-知识图谱-Model类库
            */
 export namespace IpostFindKnowledgeEventTreeSpace {

  export class RequestParams{
    fileName?:string;eventName?:string;eventTypeName?:string;fileType?:string;
    constructor(){
      this.fileName="";this.eventName="";this.eventTypeName="";this.fileType="";
    }
  }

export interface Children {
  name: string;
  id: number;
  filePageImg: string;
  knowledgeFileId: number;
  fileType: string;
  fileName: string;
  fileDescription: string;
  fileTags: string;
  filePolicy: string;
  fileContentType: string;
  readNum: number;
  url: string;
  level: number;
}

export interface Children {
  name: string;
  children: Children[];
}

export interface Data {
  name: string;
  children: Children[];
}

export interface Model {
  code: string;
  desc: string;
  tips: string;
  httpStatusCode: number;
  data: Data;
}
}
