/* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 事项要素分析-统一事项类目统计-Model类库
      */
      export namespace IgetBusEventTypeAnalysisSpace {

        export class RequestParams{

          constructor(){

          }
        }

      export interface Data {
        firstTypeNum: number;
        secondTypeNum: number;
        thirdTypeNum: number;
      }

      export interface Model {
        code: number;
        data: Data;
        message: string;
      }
      }
            /**
            * 事项要素分析-统一事项类目卡片-Model类库
            */
      export namespace IgetBusEventTypeCardSpace {

        export class RequestParams{

          constructor(){

          }
        }

      export interface Data {
        firstTypeId: string;
        firstTypeName: string;
        thirdTypeNum: number;
      }

      export interface Model {
        code: number;
        data: Data[];
        message: string;
      }
      }
            /**
            * 事项要素分析-流入事项类目统计-Model类库
            */
      export namespace IgetOtherEventTypeAnalysisSpace {

        export class RequestParams{

          constructor(){

          }
        }

      export interface Data {
        firstTypeNum: number;
        otherSystemNum: number;
        secondTypeNum: number;
        thirdTypeNum: number;
      }

      export interface Model {
        code: number;
        data: Data;
        message: string;
      }
      }
            /**
            * 事项要素分析-跨部门事项运行监控-Model类库
            */
      export namespace IpostAcrossEventSpySpace {

        export class RequestParams{
          areaId?:string;timeType?:string;
          constructor(){
            this.areaId="";this.timeType="";
          }
        }

      export interface Data {
        eventNum: number;
        receiveEventTypeName: string;
        receiveSystemName: string;
        sendEventTypeName: string;
        sendSystemName: string;
      }

      export interface Model {
        code: number;
        data: Data[];
        message: string;
      }
      }
            /**
            * 事项要素分析-事项类型统计-Model类库
            */
      export namespace IgetEventTypeAnalysisSpace {

        export class RequestParams{

          constructor(){

          }
        }

      export interface Data {
        acrossEventTypeNum: number;
        busEventThirdTypeNum: number;
        otherEventThirdTypeNum: number;
      }

      export interface Model {
        code: number;
        data: Data;
        message: string;
      }
      }
            /**
            * 事项要素分析-流入事项系统列表-Model类库
            */
      export namespace IgetOtherEventSystemListSpace {

        export class RequestParams{

          constructor(){

          }
        }

      export interface Data {
        firstTypeNum: number;
        secondTypeNum: number;
        systemCode: string;
        systemName: string;
        thirdTypeNum: number;
      }

      export interface Model {
        code: number;
        data: Data[];
        message: string;
      }
      }

            /**
      * 事件状态统计-Model类库
      */
export namespace IgetEventStatusAnalysisSpace {

  export class RequestParams{

    constructor(){

    }
  }

export interface Data {
	dealingNum: number;
	dispatchNum: number;
	endNum: number;
	eventNum: number;
}

export interface Model {
	code: number;
	data: Data;
	message: string;
}
}

      /**
      * 事项要素分析-跨部门事项运行监控(分页)-Model类库
      */
      export namespace IpostAcrossEventSpyPageSpace {

        export class RequestParams{
          district?:string;endTime?:string;pageNum?:number;pageSize?:number;startTime?:string;
          constructor(){
            this.district='';this.endTime="";this.pageNum=0;this.pageSize=0;this.startTime="";
          }
        }

        export interface List {
          sendSystemName: string;
          receiveSystemName: string;
          sendEventTypeName: string;
          receiveEventTypeName: string;
          eventNum: string;
        }
        export interface Data {
          total: number;
          pageNum: number;
          pageSize: number;
          list: List[];
        }

      export interface Model {
        code: number;
        data: Data;
        message: string;
      }
      }
