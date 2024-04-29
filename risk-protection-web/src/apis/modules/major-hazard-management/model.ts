/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 重大危险源-主键查询-Model类库
      */
      export namespace IpostFindMajorHazardByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        name: string;
        address: string;
        longitude: string;
        latitude: string;
        remark: string;
        companyId: string;
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
            * 重大危险源-修改-Model类库
            */
      export namespace IpostModifyMajorHazardSpace {
      
        export class RequestParams{
          id?:number;name?:string;address?:string;longitude?:string;latitude?:string;remark?:string;companyId?:string;
          constructor(){
            this.id=0;this.name="";this.address="";this.longitude="";this.latitude="";this.remark="";this.companyId='';
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
            * 重大危险源-删除-Model类库
            */
      export namespace IpostDeleteMajorHazardSpace {
      
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
            * 重大危险源-添加-Model类库
            */
      export namespace IpostAddMajorHazardSpace {
      
        export class RequestParams{
          name?:string;address?:string;longitude?:string;latitude?:string;remark?:string;companyId?:string;
          constructor(){
            this.name="";this.address="";this.longitude="";this.latitude="";this.remark="";this.companyId='';
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
            * 重大危险源-列表-Model类库
            */
      export namespace IpostFindMajorHazardPageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;address?:string;longitude?:string;latitude?:string;remark?:string;companyId?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.address="";this.longitude="";this.latitude="";this.remark="";this.companyId='';
          }
        }
      
      export interface List {
        id: number;
        name: string;
        address: string;
        longitude: string;
        latitude: string;
        remark: string;
        companyId: string;
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