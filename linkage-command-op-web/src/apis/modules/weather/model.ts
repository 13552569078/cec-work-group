/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 获取最新天气信息-Model类库
      */
      export namespace IgetLatestSpace {

        export class RequestParams{
          areaCode?:string;
          constructor(){
            this.areaCode="";
          }
        }
      
      export interface Data {
        areaCode: string;
        temp: string;
        tempTime: string;
        icon: string;
        weatherDesc: string;
        windDir: string;
        windScale: string;
        precip: string;
        humidity: string;
        pressure: string;
        cloud: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }