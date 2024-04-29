/* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 监测主体-明细-Model类库
      */
       export namespace IgetMonitorRegionSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface PhotoFile {
          id: string;
          originalName: string;
          url: string;
      }

      export interface Data {
          id: number;
          regionName: string;
          regionTypeCode: string;
          regionTypeName: string;
          principalName: string;
          principalMobile: string;
          responsibleName: string;
          responsibleMobile: string;
          address: string;
          longitude: string;
          latitude: string;
          streetAreaCode: string;
          streetAreaName: string;
          belongOrgId: number;
          belongOrgName: string;
          belongName: string;
          belongMobile: string;
          chargeOrgId: number;
          chargeOrgName: string;
          chargeName: string;
          chargeMobile: string;
          description: string;
          photoFile: PhotoFile[];
      }

      export interface Model {
          code: string;
          desc: string;
          tips: string;
          data: Data;
      }
      }

/**
 * 查询监测事件的监测点信息-Model类库
 */
export namespace IgetFindMonitorEventPointSpace {

  export interface EventTypeCodeList {}

  export interface EventTypeNameList {}

  export interface MonitorEquipNameList {}

  export interface StrategyRuleFactorVO {
    strategyRuleFactorId: number;
    factorId: number;
    factorName: string;
    measureUnitCode: string;
    measureUnitName: string;
    factorDataTypeCode: string;
    factorDataTypeName: string;
    factorValue: string;
  }

  export interface MonitorFactorVOList {
    ruleId: number;
    ruleName: string;
    ruleLevel: string;
    ruleLevelName: string;
    ruleLogicRelationship: number;
    ruleDesc: string;
    show?: boolean;
    strategyRuleFactorVOS: StrategyRuleFactorVO[];
  }

  export interface Data {
    eventTypeCodeList: EventTypeCodeList[];
    eventTypeNameList: EventTypeNameList[];
    monitorPointName: string;
    monitorEquipNameList: MonitorEquipNameList[];
    targetName: string;
    monitorFactorVOList: MonitorFactorVOList[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    data: Data;
  }
}
