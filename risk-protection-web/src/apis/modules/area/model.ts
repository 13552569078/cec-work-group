/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 社区（行政村）列表-Model类库
      */
      export namespace IpostFindCommunityByAreaCodeSpace {

        export class RequestParams{
          areaCode?:string;
          constructor(){
            this.areaCode="";
          }
        }
      
      export interface Data {
        name: string;
        areaCode: string;
        parentAreaCode: string;
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
            * 行政区划列表-Model类库
            */
      export namespace IlistSpace {
      
        export class RequestParams{
          
          constructor(){
            
          }
        }
      
      export interface Data {
        code: string;
        name: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }