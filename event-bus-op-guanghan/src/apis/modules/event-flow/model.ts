/* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 事件流转-平台和事件汇聚统计-Model类库
      */
      export namespace IpostPlatformAndEventStatisticsSpace {

        export interface Data {
          eventNum: number;
          platformNum: number;
        }

        export interface Model {
          code: number;
          data: Data;
          message: string;
        }
        }
              /**
              * 事件流转-平台统计-Model类库
              */
        export namespace IpostPlatformStatisticsSpace {

        export interface Data {
          eventNum: number;
          platformCode: string;
          platformName: string;
        }

        export interface Model {
          code: number;
          data: Data[];
          message: string;
        }
        }
              /**
              * 事件流转-平台总览-Model类库
              */
        export namespace IpostPlatformOverviewSpace {

          export class RequestParams{
            district?:number;endTime?:string;platformCode?:string;startTime?:string;
            constructor(){
              this.district=0;this.endTime="";this.platformCode="";this.startTime="";
            }
          }

        export interface Data {
          endNum: number;
          flowoutNum: number;
          handleNum: number;
          overtimeNum: number;
        }

        export interface Model {
          code: number;
          data: Data;
          message: string;
        }
        }
              /**
              * 事件流转-平台处置分析-Model类库
              */
        export namespace IpostPlatformHandleAnalysisSpace {

          export class RequestParams{
            district?:number;endTime?:string;platformCode?:string;startTime?:string;
            constructor(){
              this.district=0;this.endTime="";this.platformCode="";this.startTime="";
            }
          }

        export interface FlowInList {
          endNum: number;
          flowinNum: number;
          overtimeNum: number;
          platformName: string;
        }

        export interface FlowOutList {
          flowoutNum: number;
          platformName: string;
        }

        export interface Data {
          flowInList: FlowInList[];
          flowOutList: FlowOutList[];
          flowinEndNum: number;
          flowinNum: number;
          flowinOvertimeNum: number;
          selfEndNum: number;
          selfHandleNum: number;
          selfOvertimeNum: number;
        }

        export interface Model {
          code: number;
          data: Data;
          message: string;
        }
        }
