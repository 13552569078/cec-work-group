/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 监控信息-列表-Model类库
      */
      export namespace IpostFindMonitorInfoPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;subjectId?:string;subjectName?:string;status?:string;longitude?:string;latitude?:string;gbCode?:string;resCode?:string;updateTime?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.subjectId="";this.subjectName="";this.status="";this.longitude="";this.latitude="";this.gbCode="";this.resCode="";this.updateTime="";
          }
        }
      
      export interface List {
        id: number;
        name: string;
        subjectId: string;
        subjectName: string;
        status: string;
        longitude: string;
        latitude: string;
        gbCode: string;
        resCode: string;
        updateTime: string;
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