/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 重点监管化学品-修改-Model类库
      */
      export namespace IpostModifyControlledChemicalsSpace {

        export class RequestParams{
          id?:number;name?:string;characteristic?:string;deal?:string;distance?:string;fireMeasure?:string;companyId?:number;
          constructor(){
            this.id=0;this.name="";this.characteristic="";this.deal="";this.distance="";this.fireMeasure="";this.companyId=0;
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
            * 重点监管化学品-列表-Model类库
            */
      export namespace IpostFindControlledChemicalsPageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;characteristic?:string;deal?:string;distance?:string;fireMeasure?:string;companyId?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.characteristic="";this.deal="";this.distance="";this.fireMeasure="";this.companyId=0;
          }
        }
      
      export interface List {
        id: number;
        name: string;
        characteristic: string;
        deal: string;
        distance: string;
        fireMeasure: string;
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
            * 重点监管化学品-删除-Model类库
            */
      export namespace IpostDeleteControlledChemicalsSpace {
      
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
            * 重点监管化学品-添加-Model类库
            */
      export namespace IpostAddControlledChemicalsSpace {
      
        export class RequestParams{
          name?:string;characteristic?:string;deal?:string;distance?:string;fireMeasure?:string;companyId?:number;
          constructor(){
            this.name="";this.characteristic="";this.deal="";this.distance="";this.fireMeasure="";this.companyId=0;
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
            * 重点监管化学品-主键查询-Model类库
            */
      export namespace IpostFindControlledChemicalsByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        name: string;
        characteristic: string;
        deal: string;
        distance: string;
        fireMeasure: string;
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