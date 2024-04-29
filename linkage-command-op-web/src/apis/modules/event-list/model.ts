/* eslint-disable @typescript-eslint/no-namespace */
            /**
            * 事件中心-查询事件详情-Model类库
            */
      export namespace IpostFindEventDetailByIdSpace {

      export interface Data {
        id: string;
        name: string;
        eventTypeCode: string;
        eventLevelCode: string;
        happenTime: string;
        desc: string;
        drill: number;
        personDeadNum: string;
        personInjuredNum: string;
        personSeriousInjuredNum: string;
        personPoisonedNum: string;
        personTrappedNum: string;
        personTransferNum: string;
        personMissingNum: string;
        personAffectedNum: string;

        ecoLossDirect: number;
        ecoLossIndirect: number;
        ecoLossHouseCollapse: number;
        ecoLossAffectedFarmland: number;
        ecoLossAffectedPasture: number;
        ecoLossDisasterForest: number;
        ecoLossHouseDamaged: number;
        ecoLossStatTime: string;
        infrastructureBridgeBreakDuration: number;
        infrastructureWaterBreakDuration: number;
        infrastructureCommunicationBreakDuration: number;
        peopleTransferNumUnit: number;
        peopleInfluenceNumUnit: number;
        lossDirectUnit: number;
        lossIndirectUnit: number;
        lossHouseCollapseUnit: number;
        lossHouseDamageUnit: number;
        lossFarmlandAreaUnit: number;
        lossGrasslandAreaUnit: number;
        lossForestAreaUnit: number;
        breakTimeRoadBridgeUnit: number;
        breakTimeWaterElectricityUnit: number;
        breakTimeCommunicationUnit: number;
        otherReceiveReason: string;
        otherTakenMeasure: string;
        otherResourceRequest: string;
        reportInfoSource: string;
        reportTime: string;
        longitude: string;
        latitude: string;
        mainAddress: string;
        mainAreaCode: string;
        mainAreaName: string;
        otherAddressText: string;
        eventState: string;
        eventStateName: string;
        eventTypeName: string;
        eventLevelName: string;
        responseLevel: string;
        responseLevelName: string;
        responseStatus: string;
        responseStatusName: string;
        strategyInfoId: string;
        strategyInfoName: string;
        finishTime: string;
        responseStartTime: string;
        responseEndTime: string;
        detailedAttachmentInfo: Array<{
          name: string;
          id: string;
          url: string;
          createdAt: string;
        }>;
        addressList: Array<{
          longitude: string;
          latitude: string;
          address: string;
          isMain: boolean;
        }>;
      }

      export interface Model {
        code: number;
        data: Data;
        desc: string;
      }
      }
            /**
            * 事件中心-事件列表-Model类库
            */
      export namespace IpostFindEventListSpace {

      export interface Data {
        totalRow: number;
        totalPage: number;
        list: List[]
      }

      export interface List {
        id: string;
        name: string;
        longitude: string;
        latitude: string;
        mainAddress: string;
        eventTypeCode: string;
        eventTypeName: string;
        eventLevelCode: string;
        eventLevelName: string;
        createdAt: string;
        happenTime: string;
        finishTime: string;
        eventState: string;
        eventStateName: string;
      }

      export interface Model {
        code: number;
        data: Data;
        desc: string;
      }
      }
            /**
            * 事件中心-事件数量统计-Model类库
            */
      export namespace IpostStatEventNumSpace {

        export class RequestParams{
          areaCode?:string;distance?:number;latitude?:string;type?:string;longitude?:string;
          constructor(){
            this.areaCode="";this.distance=0;this.latitude="";this.type="";this.longitude="";
          }
        }

      export interface Data {
        eventTypeCode: string;
        num: number;
        eventTypeName: string;
        ratio: string;
      }

      export interface Model {
        code: number;
        data: Data[];
        desc: string;
      }
      }

      export namespace IpostCreateEvent {

        export interface Model {
          code: number;
          data: number;
          desc: string;
        }
        }
      export namespace EventInfo {
        export interface Data {
          totalNum : number;
		      handlingNum: number;
		      finishedNum: number;
        }
        export interface Model {
            code: number;
            data: Data;
            desc: string;
        }
        }

        export namespace IgetFindReservePlanNumber {
          export interface Item {
            code: string,
            name: string,
            val: number
          }
          export interface Model {
              code: number;
              data: Item[];
              desc: string;
          }
        }
