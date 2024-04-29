/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 重点工艺-列表-Model类库
      */
      export namespace IpostFindTechnologyPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;remark?:string;parameter?:string;safetyControl?:string;companyId?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.remark="";this.parameter="";this.safetyControl="";this.companyId=0;
          }
        }
      
      export interface List {
        id: number;
        name: string;
        remark: string;
        parameter: string;
        safetyControl: string;
        companyId: number;
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
            * 重点工艺-修改-Model类库
            */
      export namespace IpostModifyTechnologySpace {
      
        export class RequestParams{
          id?:number;name?:string;remark?:string;parameter?:string;safetyControl?:string;companyId?:number;
          constructor(){
            this.id=0;this.name="";this.remark="";this.parameter="";this.safetyControl="";this.companyId=0;
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
            * 重点工艺-添加-Model类库
            */
      export namespace IpostAddTechnologySpace {
      
        export class RequestParams{
          name?:string;remark?:string;parameter?:string;safetyControl?:string;companyId?:number;
          constructor(){
            this.name="";this.remark="";this.parameter="";this.safetyControl="";this.companyId=0;
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
            * 重点工艺-主键查询-Model类库
            */
      export namespace IpostFindTechnologyByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        name: string;
        remark: string;
        parameter: string;
        safetyControl: string;
        companyId: number;
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
            * 重点工艺-删除-Model类库
            */
      export namespace IpostDeleteTechnologySpace {
      
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