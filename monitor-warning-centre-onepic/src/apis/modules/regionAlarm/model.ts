/* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 当前监测主体报警topX列表-Model类库
      */
       export namespace IgetListCurrentWarningInfoListVOsSpace {

        export class RequestParams{
          regionId?:number;
          constructor(){
          this.regionId=0;
          }
        }

      export interface Data {
        eventId: number;
        eventTitle: string;
        startTime: string;
        eventTypeCode: string;
        eventTypeName: string;
        regionName: string;
        eventStateCode: string;
        eventStateName: string;
        eventLevelCode: string;
        eventLevelCodeName: string;
        streetName: string;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data[];
      }
      }
            /**
            * 查询当前主体报警列表(分页)-Model类库
            */
      export namespace IgetFindCurrentWarningInfoListPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;eventTitle?:string;eventTypeCode?:string;regionId?:number;eventLevelCode?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.eventTitle="";this.eventTypeCode="";this.regionId=0;this.eventLevelCode="";
          }
        }

      export interface List {
        eventId: number;
        eventTitle: string;
        startTime: string;
        eventTypeCode: string;
        eventTypeName: string;
        regionName: string;
        eventStateCode: string;
        eventStateName: string;
        eventLevelCode: string;
        eventLevelCodeName: string;
        streetName: string;
      }

      export interface Data {
        totalRow: number;
        totalPage: number;
        currentPage: number;
        pageSize: number;
        isFirstPage: boolean;
        isLastPage: boolean;
        hasPreviousPage: boolean;
        list: List[];
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 监测主体报警研判信息统计-Model类库
            */
      export namespace IgetFindRegionAlarmJudgeSpace {

        export class RequestParams{
          statisticsTypeCode?:string;startTime?:string;endTime?:string;regionId?:number;
          constructor(){
            this.statisticsTypeCode="";this.startTime="";this.endTime="";this.regionId=0;
          }
        }

      export interface Data {
        judgeNumber: number;
        autoJudgeNumber: number;
        manualJudgeNumber: number;
        judgeRejectNumber: number;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 统计监测点详情-Model类库
            */
      export namespace IgetFindRegionMonitorPointDetailSpace {

        export class RequestParams{
          monitorPointId?:number;
          constructor(){
          this.monitorPointId=0;
          }
        }

      export interface FactorListVOList {
        factorId: number;
        factorName: string;
        formulaCode: string;
        formulaCodeName: string;
        formulaExpression: string;
        formulaUrl: string;
      }

      export interface MonitorEquipListVoList {
        id: number;
        equipName: string;
        equipType: number;
        equipCode: string;
      }

      export interface Data {
        monitorPointId: number;
        monitorPointName: string;
        regionId: number;
        regionName: string;
        eventTypeCode: string;
        eventTypeCodeName: string;
        monitorFrequency: number;
        monitorFrequencyUnit: string;
        monitorFrequencyUnitName: string;
        monitorPointAddress: string;
        monitorPointLongitude: string;
        monitorPointLatitude: string;
        monitorPointDescription: string;
        factorListVOList: FactorListVOList[];
        monitorEquipListVoList: MonitorEquipListVoList[];
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 查询监测事件打点信息-Model类库
            */
      export namespace IgetListMonitorEventMapsSpace {

        export class RequestParams{
          regionTypeCodeList?:[];eventTypeCodeList?:[];monitorRegionId?:number;
          constructor(){
            this.regionTypeCodeList=[];this.eventTypeCodeList=[];this.monitorRegionId=0;
          }
        }

      export interface Data {
        eventId: number;
        longitude: string;
        latitude: string;
        eventLevel: string;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data[];
      }
      }
            /**
            * 查询设备树(按设备类型)-Model类库
            */
      export namespace IgetListRegionEquipTreesSpace {

      export interface VideoEquipList {
        equipId: number;
        equipType: number;
        equipName: string;
        regionId: number;
        pointId: number;
        id?:string|number,
        label?: string;
        type?:string;
      }

      export interface IotEquipList {
        equipId: number;
        equipType: number;
        equipName: string;
        regionId: number;
        pointId: number;
        id?:string|number,
        label?: string;
        type?:string;
      }

      export interface Data {
        videoEquipList: VideoEquipList[];
        iotEquipList: IotEquipList[];
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 监测主体报警信息统计-Model类库
            */
      export namespace IgetFindRegionAlarmInfoSpace {

        export class RequestParams{
          statisticsTypeCode?:string;startTime?:string;endTime?:string;regionId?:number;
          constructor(){
            this.statisticsTypeCode="";this.startTime="";this.endTime="";this.regionId=0;
          }
        }

      export interface AlarmInfoList {
        code: string;
        codeName: string;
        value: number;
      }

      export interface Data {
        alarmNumber: number;
        alarmInfoList: AlarmInfoList[];
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 监测主体报警处置信息统计-Model类库
            */
      export namespace IgetFindRegionAlarmHandleSpace {

        export class RequestParams{
          statisticsTypeCode?:string;startTime?:string;endTime?:string;regionId?:number;
          constructor(){
            this.statisticsTypeCode="";this.startTime="";this.endTime="";this.regionId=0;
          }
        }

      export interface Data {
        handleNumber: number;
        autoHandleNumber: number;
        eventCenterHandleNumber: number;
        handlingNumber: number;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 查询监测主体的监测布控-Model类库
            */
      export namespace IgetFindRegionMonitorControlSpace {

        export class RequestParams{
          regionId?:number;
          constructor(){
            this.regionId=0;
          }
        }

      export interface Data {
        monitorPointNumber: number;
        monitorVideoEquipNumber: number;
        monitorIotEquipNumber: number;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data;
      }
      }
            /**
            * 查询设备树(按监测类型分类)-Model类库
            */
      export namespace IgetListRegionEventTypeEquipTreesSpace {

      export interface VideoEquipTreeVOList {
        equipId: number;
        equipName: string;
        equipCode: string;
        label?: string;
        id?: string|number;
        type?: string;
        pointId?: string|number;
      }

      export interface IotEquipTreeVOList {
        equipId: number;
        equipName: string;
        equipCode: string;
        label?: string;
        id?: string|number;
        type?: string;
        pointId?: string|number;
      }

      export interface MonitorPointEquipTreeVOList {
        pointId: number;
        pointName: string;
        label?: string;
        id?: string|number;
        videoEquipTreeVOList: VideoEquipTreeVOList[];
        iotEquipTreeVOList: IotEquipTreeVOList[];
        children?: any[];
      }

      export interface Data {
        eventTypeCode: string;
        eventTypeName: string;
        monitorPointEquipTreeVOList: MonitorPointEquipTreeVOList[];
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data[];
      }
      }
            /**
            * 统计监测主体下的接入数据-Model类库
            */
      export namespace IgetFindRegionAccessDataSpace {

        export class RequestParams{
          statisticsTypeCode?:string;startTime?:string;endTime?:string;regionId?:number;
          constructor(){
            this.statisticsTypeCode="";this.startTime="";this.endTime="";this.regionId=0;
          }
        }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: number;
      }
      }
            /**
            * 当前监测主体报警数-Model类库
            */
      export namespace IgetFindCurrentWarningNumberSpace {

        export class RequestParams{
          regionId?:number;
          constructor(){
            this.regionId=0;
          }
        }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: number;
      }
      }
            /**
            * 查询当前报警统计信息-Model类库
            */
      export namespace IgetFindCurrentRegionAlarmInfoSpace {

        export class RequestParams{
          statisticsTypeCode?:string;startTime?:string;endTime?:string;regionId?:number;
          constructor(){
            this.statisticsTypeCode="";this.startTime="";this.endTime="";this.regionId=0;
          }
        }

      export interface Data {
        code: string;
        codeName: string;
        value: number;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        data: Data[];
      }
      }
