/* eslint-disable @typescript-eslint/no-namespace */

      /**
      * 星级饭店-添加-Model类库
      */
      export namespace IpostAddDisasterStarHotelSpace {

        export class RequestParams{
          resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;starLevel?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.starLevel="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 星级饭店-主键查询-Model类库
            */
      export namespace IpostFindDisasterStarHotelByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        resName: string;
        areaCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        starLevel: string;
        socialCreditCode: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 星级饭店-列表-Model类库
            */
      export namespace IpostFindDisasterStarHotelPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;starLevel?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.starLevel="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
          }
        }

      export interface List {
        id: number;
        resName: string;
        areaCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        starLevel: string;
        socialCreditCode: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
        manageUnit?: string
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
            * 星级饭店-删除-Model类库
            */
      export namespace IpostDeleteDisasterStarHotelSpace {

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
            * 星级饭店-修改-Model类库
            */
      export namespace IpostModifyDisasterStarHotelSpace {

        export class RequestParams{
          id?:number;resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;starLevel?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.id=0;this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.starLevel="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 公共文化场所-添加-Model类库
            */
      export namespace IpostAddDisasterPublicPlaceSpace {

        export class RequestParams{
          resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 公共文化场所-列表-Model类库
            */
      export namespace IpostFindDisasterPublicPlacePageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
          }
        }

      export interface List {
        id: number;
        resName: string;
        areaCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        socialCreditCode: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 公共文化场所-修改-Model类库
            */
      export namespace IpostModifyDisasterPublicPlaceSpace {

        export class RequestParams{
          id?:number;resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.id=0;this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 公共文化场所-删除-Model类库
            */
      export namespace IpostDeleteDisasterPublicPlaceSpace {

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
            * 大型商场-列表-Model类库
            */
      export namespace IpostFindDisasterLargeMarketPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coveredArea?:string;buildingArea?:string;maxCapacity?:string;dayMaxCapacity?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coveredArea="";this.buildingArea="";this.maxCapacity="";this.dayMaxCapacity="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
          }
        }

      export interface List {
        id: number;
        resName: string;
        areaCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        coveredArea: string;
        buildingArea: string;
        maxCapacity: string;
        dayMaxCapacity: string;
        socialCreditCode: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 大型商场-添加-Model类库
            */
      export namespace IpostAddDisasterLargeMarketSpace {

        export class RequestParams{
          resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coveredArea?:string;buildingArea?:string;maxCapacity?:string;dayMaxCapacity?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coveredArea="";this.buildingArea="";this.maxCapacity="";this.dayMaxCapacity="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 公共文化场所-主键查询-Model类库
            */
      export namespace IpostFindDisasterPublicPlaceByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        resName: string;
        areaCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        socialCreditCode: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 大型商场-修改-Model类库
            */
      export namespace IpostModifyDisasterLargeMarketSpace {

        export class RequestParams{
          id?:number;resName?:string;areaCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coveredArea?:string;buildingArea?:string;maxCapacity?:string;dayMaxCapacity?:string;socialCreditCode?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.id=0;this.resName="";this.areaCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coveredArea="";this.buildingArea="";this.maxCapacity="";this.dayMaxCapacity="";this.socialCreditCode="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 大型商场-删除-Model类库
            */
      export namespace IpostDeleteDisasterLargeMarketSpace {

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
            * 社会福利机构-主键查询-Model类库
            */
      export namespace IpostFindDisasterSocialWelfareByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        resName: string;
        areaCode: string;
        socialCreditCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 社会福利机构-删除-Model类库
            */
      export namespace IpostDeleteDisasterSocialWelfareSpace {

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
            * 大型商场-主键查询-Model类库
            */
      export namespace IpostFindDisasterLargeMarketByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        resName: string;
        areaCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        coveredArea: string;
        buildingArea: string;
        maxCapacity: string;
        dayMaxCapacity: string;
        socialCreditCode: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 体育场馆-修改-Model类库
            */
      export namespace IpostModifyDisasterSocialStadiumSpace {

        export class RequestParams{
          id?:number;resName?:string;areaCode?:string;socialCreditCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.id=0;this.resName="";this.areaCode="";this.socialCreditCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 社会福利机构-列表-Model类库
            */
      export namespace IpostFindDisasterSocialWelfarePageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;resName?:string;areaCode?:string;socialCreditCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.resName="";this.areaCode="";this.socialCreditCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
          }
        }

      export interface List {
        id: number;
        resName: string;
        areaCode: string;
        socialCreditCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 社会福利机构-修改-Model类库
            */
      export namespace IpostModifyDisasterSocialWelfareSpace {

        export class RequestParams{
          id?:number;resName?:string;areaCode?:string;socialCreditCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.id=0;this.resName="";this.areaCode="";this.socialCreditCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 社会福利机构-添加-Model类库
            */
      export namespace IpostAddDisasterSocialWelfareSpace {

        export class RequestParams{
          resName?:string;areaCode?:string;socialCreditCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.resName="";this.areaCode="";this.socialCreditCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 体育场馆-列表-Model类库
            */
      export namespace IpostFindDisasterSocialStadiumPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;resName?:string;areaCode?:string;socialCreditCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.resName="";this.areaCode="";this.socialCreditCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
          }
        }

      export interface List {
        id: number;
        resName: string;
        areaCode: string;
        socialCreditCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 体育场馆-主键查询-Model类库
            */
      export namespace IpostFindDisasterSocialStadiumByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        resName: string;
        areaCode: string;
        socialCreditCode: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
        coverArea: string;
        floorSpace: string;
        maxMomentCapacity: number;
        maxDayCapacity: number;
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
            * 体育场馆-添加-Model类库
            */
      export namespace IpostAddDisasterSocialStadiumSpace {

        export class RequestParams{
          resName?:string;areaCode?:string;socialCreditCode?:string;address?:string;longitude?:string;latitude?:string;personName?:string;personMobile?:string;coverArea?:string;floorSpace?:string;maxMomentCapacity?:number;maxDayCapacity?:number;
          constructor(){
            this.resName="";this.areaCode="";this.socialCreditCode="";this.address="";this.longitude="";this.latitude="";this.personName="";this.personMobile="";this.coverArea="";this.floorSpace="";this.maxMomentCapacity=0;this.maxDayCapacity=0;
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
            * 乡镇减灾能力-添加-Model类库
            */
      export namespace IpostAddDisasterTownshipReductionSpace {

        export class RequestParams{
          name?:string;address?:string;areaCode?:string;totalHouseholds?:number;permanentPopulation?:number;disasterType?:number;otherTypeDesc?:string;workPersonNum?:number;disasterNum?:number;hasRiskAssessment?:number;hasDisasterMap?:number;disasterReceiveMethod?:number;disasterReceiveOtherDesc?:string;disasterSendMethod?:number;disasterSendOtherDesc?:string;disasterReportMethod?:number;disasterReportOtherDesc?:string;planNum?:number;runResponseNum?:number;trainingDrillsNum?:number;trainingDrillsPersonNum?:number;fundsGuaranteeMethod?:number;fundsGuaranteeOtherDesc?:string;disasterFundsInput?:string;materialsReserveMethod?:number;materialsNum?:number;equipNum?:number;powerEquipNum?:number;communicationDeviceNum?:number;waterSupplyEquipNum?:number;medicalEquipNum?:number;equipAmount?:string;shelterNum?:number;shelterCapacity?:number;personName?:string;reportDate?:string;
          constructor(){
            this.name="";this.address="";this.areaCode="";this.totalHouseholds=0;this.permanentPopulation=0;this.disasterType=0;this.otherTypeDesc="";this.workPersonNum=0;this.disasterNum=0;this.hasRiskAssessment=0;this.hasDisasterMap=0;this.disasterReceiveMethod=0;this.disasterReceiveOtherDesc="";this.disasterSendMethod=0;this.disasterSendOtherDesc="";this.disasterReportMethod=0;this.disasterReportOtherDesc="";this.planNum=0;this.runResponseNum=0;this.trainingDrillsNum=0;this.trainingDrillsPersonNum=0;this.fundsGuaranteeMethod=0;this.fundsGuaranteeOtherDesc="";this.disasterFundsInput="";this.materialsReserveMethod=0;this.materialsNum=0;this.equipNum=0;this.powerEquipNum=0;this.communicationDeviceNum=0;this.waterSupplyEquipNum=0;this.medicalEquipNum=0;this.equipAmount="";this.shelterNum=0;this.shelterCapacity=0;this.personName="";this.reportDate="";
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
            * 体育场馆-删除-Model类库
            */
      export namespace IpostDeleteDisasterSocialStadiumSpace {

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
            * 乡镇减灾能力-删除-Model类库
            */
      export namespace IpostDeleteDisasterTownshipReductionSpace {

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
            * 社区（行政村）减灾能力-列表-Model类库
            */
      export namespace IpostFindDisasterCommunityReductionPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;address?:string;areaCode?:string;totalHouseholds?:number;disabilityPersonNum?:number;permanentPopulation?:string;youngPersonNum?:number;oldPersonNum?:number;healthStationNum?:number;nationalDemonstrationCommunity?:number;provincialDemonstrationCommunity?:number;hasDangerPoints?:number;hasVulnerableGroups?:number;hasDisasterMap?:number;hasPlan?:number;disasterFundsInput?:string;disasterNum?:number;volunteerNum?:number;reserveDutyNum?:number;shelterNum?:number;shelterCapacity?:number;materialsReserveMethod?:number;materialsReserveOtherDesc?:string;equipAmount?:string;disasterReceiveMethod?:number;disasterReceiveOtherDesc?:string;disasterSendMethod?:number;disasterSendOtherDesc?:string;disasterReportMethod?:number;disasterReportOtherDesc?:string;trainingDrillsNum?:number;trainingDrillsPersonNum?:number;trainingDrillsActivityNum?:number;trainingDrillsResidentNum?:number;personName?:string;reportDate?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.address="";this.areaCode="";this.totalHouseholds=0;this.disabilityPersonNum=0;this.permanentPopulation="";this.youngPersonNum=0;this.oldPersonNum=0;this.healthStationNum=0;this.nationalDemonstrationCommunity=0;this.provincialDemonstrationCommunity=0;this.hasDangerPoints=0;this.hasVulnerableGroups=0;this.hasDisasterMap=0;this.hasPlan=0;this.disasterFundsInput="";this.disasterNum=0;this.volunteerNum=0;this.reserveDutyNum=0;this.shelterNum=0;this.shelterCapacity=0;this.materialsReserveMethod=0;this.materialsReserveOtherDesc="";this.equipAmount="";this.disasterReceiveMethod=0;this.disasterReceiveOtherDesc="";this.disasterSendMethod=0;this.disasterSendOtherDesc="";this.disasterReportMethod=0;this.disasterReportOtherDesc="";this.trainingDrillsNum=0;this.trainingDrillsPersonNum=0;this.trainingDrillsActivityNum=0;this.trainingDrillsResidentNum=0;this.personName="";this.reportDate="";
          }
        }

      export interface List {
        id: number;
        name: string;
        address: string;
        areaCode: string;
        totalHouseholds: number;
        disabilityPersonNum: number;
        permanentPopulation: string;
        youngPersonNum: number;
        oldPersonNum: number;
        healthStationNum: number;
        nationalDemonstrationCommunity: number;
        provincialDemonstrationCommunity: number;
        hasDangerPoints: number;
        hasVulnerableGroups: number;
        hasDisasterMap: number;
        hasPlan: number;
        disasterFundsInput: string;
        disasterNum: number;
        volunteerNum: number;
        reserveDutyNum: number;
        shelterNum: number;
        shelterCapacity: number;
        materialsReserveMethod: string;
        materialsReserveOtherDesc: string;
        equipAmount: string;
        disasterReceiveMethod: string;
        disasterReceiveOtherDesc: string;
        disasterSendMethod: number;
        disasterSendOtherDesc: string;
        disasterReportMethod: string;
        disasterReportOtherDesc: string;
        trainingDrillsNum: number;
        trainingDrillsPersonNum: number;
        trainingDrillsActivityNum: number;
        trainingDrillsResidentNum: number;
        personName: string;
        reportDate: string;
        materialsReserveMethodName?: string;
        disasterReportMethodName?: string;
        disasterReceiveMethodName?: string
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
            * 乡镇减灾能力-修改-Model类库
            */
      export namespace IpostModifyDisasterTownshipReductionSpace {

        export class RequestParams{
          id?:number;name?:string;address?:string;areaCode?:string;totalHouseholds?:number;permanentPopulation?:number;disasterType?:number;otherTypeDesc?:string;workPersonNum?:number;disasterNum?:number;hasRiskAssessment?:number;hasDisasterMap?:number;disasterReceiveMethod?:number;disasterReceiveOtherDesc?:string;disasterSendMethod?:number;disasterSendOtherDesc?:string;disasterReportMethod?:number;disasterReportOtherDesc?:string;planNum?:number;runResponseNum?:number;trainingDrillsNum?:number;trainingDrillsPersonNum?:number;fundsGuaranteeMethod?:number;fundsGuaranteeOtherDesc?:string;disasterFundsInput?:string;materialsReserveMethod?:number;materialsNum?:number;equipNum?:number;powerEquipNum?:number;communicationDeviceNum?:number;waterSupplyEquipNum?:number;medicalEquipNum?:number;equipAmount?:string;shelterNum?:number;shelterCapacity?:number;personName?:string;reportDate?:string;
          constructor(){
            this.id=0;this.name="";this.address="";this.areaCode="";this.totalHouseholds=0;this.permanentPopulation=0;this.disasterType=0;this.otherTypeDesc="";this.workPersonNum=0;this.disasterNum=0;this.hasRiskAssessment=0;this.hasDisasterMap=0;this.disasterReceiveMethod=0;this.disasterReceiveOtherDesc="";this.disasterSendMethod=0;this.disasterSendOtherDesc="";this.disasterReportMethod=0;this.disasterReportOtherDesc="";this.planNum=0;this.runResponseNum=0;this.trainingDrillsNum=0;this.trainingDrillsPersonNum=0;this.fundsGuaranteeMethod=0;this.fundsGuaranteeOtherDesc="";this.disasterFundsInput="";this.materialsReserveMethod=0;this.materialsNum=0;this.equipNum=0;this.powerEquipNum=0;this.communicationDeviceNum=0;this.waterSupplyEquipNum=0;this.medicalEquipNum=0;this.equipAmount="";this.shelterNum=0;this.shelterCapacity=0;this.personName="";this.reportDate="";
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
            * 社区（行政村）减灾能力-修改-Model类库
            */
      export namespace IpostModifyDisasterCommunityReductionSpace {

        export class RequestParams{
          id?:number;name?:string;address?:string;areaCode?:string;totalHouseholds?:number;disabilityPersonNum?:number;permanentPopulation?:string;youngPersonNum?:number;oldPersonNum?:number;healthStationNum?:number;nationalDemonstrationCommunity?:number;provincialDemonstrationCommunity?:number;hasDangerPoints?:number;hasVulnerableGroups?:number;hasDisasterMap?:number;hasPlan?:number;disasterFundsInput?:string;disasterNum?:number;volunteerNum?:number;reserveDutyNum?:number;shelterNum?:number;shelterCapacity?:number;materialsReserveMethod?:number;materialsReserveOtherDesc?:string;equipAmount?:string;disasterReceiveMethod?:number;disasterReceiveOtherDesc?:string;disasterSendMethod?:number;disasterSendOtherDesc?:string;disasterReportMethod?:number;disasterReportOtherDesc?:string;trainingDrillsNum?:number;trainingDrillsPersonNum?:number;trainingDrillsActivityNum?:number;trainingDrillsResidentNum?:number;personName?:string;reportDate?:string;
          constructor(){
            this.id=0;this.name="";this.address="";this.areaCode="";this.totalHouseholds=0;this.disabilityPersonNum=0;this.permanentPopulation="";this.youngPersonNum=0;this.oldPersonNum=0;this.healthStationNum=0;this.nationalDemonstrationCommunity=0;this.provincialDemonstrationCommunity=0;this.hasDangerPoints=0;this.hasVulnerableGroups=0;this.hasDisasterMap=0;this.hasPlan=0;this.disasterFundsInput="";this.disasterNum=0;this.volunteerNum=0;this.reserveDutyNum=0;this.shelterNum=0;this.shelterCapacity=0;this.materialsReserveMethod=0;this.materialsReserveOtherDesc="";this.equipAmount="";this.disasterReceiveMethod=0;this.disasterReceiveOtherDesc="";this.disasterSendMethod=0;this.disasterSendOtherDesc="";this.disasterReportMethod=0;this.disasterReportOtherDesc="";this.trainingDrillsNum=0;this.trainingDrillsPersonNum=0;this.trainingDrillsActivityNum=0;this.trainingDrillsResidentNum=0;this.personName="";this.reportDate="";
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
            * 社区（行政村）减灾能力-添加-Model类库
            */
      export namespace IpostAddDisasterCommunityReductionSpace {

        export class RequestParams{
          name?:string;address?:string;areaCode?:string;totalHouseholds?:number;disabilityPersonNum?:number;permanentPopulation?:string;youngPersonNum?:number;oldPersonNum?:number;healthStationNum?:number;nationalDemonstrationCommunity?:number;provincialDemonstrationCommunity?:number;hasDangerPoints?:number;hasVulnerableGroups?:number;hasDisasterMap?:number;hasPlan?:number;disasterFundsInput?:string;disasterNum?:number;volunteerNum?:number;reserveDutyNum?:number;shelterNum?:number;shelterCapacity?:number;materialsReserveMethod?:number;materialsReserveOtherDesc?:string;equipAmount?:string;disasterReceiveMethod?:number;disasterReceiveOtherDesc?:string;disasterSendMethod?:number;disasterSendOtherDesc?:string;disasterReportMethod?:number;disasterReportOtherDesc?:string;trainingDrillsNum?:number;trainingDrillsPersonNum?:number;trainingDrillsActivityNum?:number;trainingDrillsResidentNum?:number;personName?:string;reportDate?:string;
          constructor(){
            this.name="";this.address="";this.areaCode="";this.totalHouseholds=0;this.disabilityPersonNum=0;this.permanentPopulation="";this.youngPersonNum=0;this.oldPersonNum=0;this.healthStationNum=0;this.nationalDemonstrationCommunity=0;this.provincialDemonstrationCommunity=0;this.hasDangerPoints=0;this.hasVulnerableGroups=0;this.hasDisasterMap=0;this.hasPlan=0;this.disasterFundsInput="";this.disasterNum=0;this.volunteerNum=0;this.reserveDutyNum=0;this.shelterNum=0;this.shelterCapacity=0;this.materialsReserveMethod=0;this.materialsReserveOtherDesc="";this.equipAmount="";this.disasterReceiveMethod=0;this.disasterReceiveOtherDesc="";this.disasterSendMethod=0;this.disasterSendOtherDesc="";this.disasterReportMethod=0;this.disasterReportOtherDesc="";this.trainingDrillsNum=0;this.trainingDrillsPersonNum=0;this.trainingDrillsActivityNum=0;this.trainingDrillsResidentNum=0;this.personName="";this.reportDate="";
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
            * 乡镇减灾能力-主键查询-Model类库
            */
      export namespace IpostFindDisasterTownshipReductionByIdSpace {

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
        areaCode: string;
        totalHouseholds: number;
        permanentPopulation: number;
        // disasterType: string;
        otherTypeDesc: string;
        workPersonNum: number;
        disasterNum: number;
        hasRiskAssessment: number;
        hasDisasterMap: number;
        // disasterReceiveMethod: string;
        disasterReceiveOtherDesc: string;
        // disasterSendMethod: string;
        disasterSendOtherDesc: string;
        // disasterReportMethod: string;
        disasterReportOtherDesc: string;
        planNum: number;
        runResponseNum: number;
        trainingDrillsNum: number;
        trainingDrillsPersonNum: number;
        fundsGuaranteeMethod: number;
        fundsGuaranteeOtherDesc: string;
        disasterFundsInput: string;
        // materialsReserveMethod: string;
        materialsNum: number;
        equipNum: number;
        powerEquipNum: number;
        communicationDeviceNum: number;
        waterSupplyEquipNum: number;
        medicalEquipNum: number;
        equipAmount: string;
        shelterNum: number;
        shelterCapacity: number;
        personName: string;
        reportDate: string;
        disasterType: string[] | string,
        disasterReceiveMethod: string[] | string,
        disasterSendMethod: string[] | string,
        materialsReserveMethod: string[] | string,
        disasterReportMethod: string[] | string,
        longitude: string,
        latitude: string,
        lnglat: string[]
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
            * 社区（行政村）减灾能力-删除-Model类库
            */
      export namespace IpostDeleteDisasterCommunityReductionSpace {

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
            * 乡镇减灾能力-列表-Model类库
            */
      export namespace IpostFindDisasterTownshipReductionPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;address?:string;areaCode?:string;totalHouseholds?:number;permanentPopulation?:number;disasterType?:number;otherTypeDesc?:string;workPersonNum?:number;disasterNum?:number;hasRiskAssessment?:number;hasDisasterMap?:number;disasterReceiveMethod?:number;disasterReceiveOtherDesc?:string;disasterSendMethod?:number;disasterSendOtherDesc?:string;disasterReportMethod?:number;disasterReportOtherDesc?:string;planNum?:number;runResponseNum?:number;trainingDrillsNum?:number;trainingDrillsPersonNum?:number;fundsGuaranteeMethod?:number;fundsGuaranteeOtherDesc?:string;disasterFundsInput?:string;materialsReserveMethod?:number;materialsNum?:number;equipNum?:number;powerEquipNum?:number;communicationDeviceNum?:number;waterSupplyEquipNum?:number;medicalEquipNum?:number;equipAmount?:string;shelterNum?:number;shelterCapacity?:number;personName?:string;reportDate?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.address="";this.areaCode="";this.totalHouseholds=0;this.permanentPopulation=0;this.disasterType=0;this.otherTypeDesc="";this.workPersonNum=0;this.disasterNum=0;this.hasRiskAssessment=0;this.hasDisasterMap=0;this.disasterReceiveMethod=0;this.disasterReceiveOtherDesc="";this.disasterSendMethod=0;this.disasterSendOtherDesc="";this.disasterReportMethod=0;this.disasterReportOtherDesc="";this.planNum=0;this.runResponseNum=0;this.trainingDrillsNum=0;this.trainingDrillsPersonNum=0;this.fundsGuaranteeMethod=0;this.fundsGuaranteeOtherDesc="";this.disasterFundsInput="";this.materialsReserveMethod=0;this.materialsNum=0;this.equipNum=0;this.powerEquipNum=0;this.communicationDeviceNum=0;this.waterSupplyEquipNum=0;this.medicalEquipNum=0;this.equipAmount="";this.shelterNum=0;this.shelterCapacity=0;this.personName="";this.reportDate="";
          }
        }

      export interface List {
        id: number;
        name: string;
        address: string;
        areaCode: string;
        totalHouseholds: number;
        permanentPopulation: number;
        disasterType: string;
        otherTypeDesc: string;
        workPersonNum: number;
        disasterNum: number;
        hasRiskAssessment: number;
        hasDisasterMap: number;
        disasterReceiveMethod: string;
        disasterReceiveOtherDesc: string;
        disasterSendMethod: number;
        disasterSendOtherDesc: string;
        disasterReportMethod: string;
        disasterReportOtherDesc: string;
        planNum: number;
        runResponseNum: number;
        trainingDrillsNum: number;
        trainingDrillsPersonNum: number;
        fundsGuaranteeMethod: number;
        fundsGuaranteeOtherDesc: string;
        disasterFundsInput: string;
        materialsReserveMethod: string;
        materialsReserveMethodName?: string;
        materialsNum: number;
        equipNum: number;
        powerEquipNum: number;
        communicationDeviceNum: number;
        waterSupplyEquipNum: number;
        medicalEquipNum: number;
        equipAmount: string;
        shelterNum: number;
        shelterCapacity: number;
        personName: string;
        reportDate: string;
        disasterReportMethodName?: string;
        disasterReceiveMethodName?: string;
        disasterTypeName?: string
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
            * 社区（行政村）减灾能力-主键查询-Model类库
            */
      export namespace IpostFindDisasterCommunityReductionByIdSpace {

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
        areaCode: string;
        totalHouseholds: number;
        disabilityPersonNum: number;
        permanentPopulation: string;
        youngPersonNum: number;
        oldPersonNum: number;
        healthStationNum: number;
        nationalDemonstrationCommunity: number;
        provincialDemonstrationCommunity: number;
        hasDangerPoints: number;
        hasVulnerableGroups: number;
        hasDisasterMap: number;
        hasPlan: number;
        disasterFundsInput: string;
        disasterNum: number;
        volunteerNum: number;
        reserveDutyNum: number;
        shelterNum: number;
        shelterCapacity: number;
        // materialsReserveMethod: number;
        materialsReserveOtherDesc: string;
        equipAmount: string;
        // disasterReceiveMethod: number;
        disasterReceiveOtherDesc: string;
        // disasterSendMethod: number;
        disasterSendOtherDesc: string;
        // disasterReportMethod: number;
        disasterReportOtherDesc: string;
        trainingDrillsNum: number;
        trainingDrillsPersonNum: number;
        trainingDrillsActivityNum: number;
        trainingDrillsResidentNum: number;
        personName: string;
        reportDate: string;
        disasterType: string[] | string,
        disasterReceiveMethod: string[] | string,
        disasterSendMethod: string[] | string,
        materialsReserveMethod: string[] | string,
        disasterReportMethod: string[] | string,
        commAreaCode: string;
        longitude: string,
        latitude: string,
        lnglat: string[]
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
            * 河流信息-主键查询-Model类库
            */
      export namespace IpostFindDisasterRiverByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        name: string;
        riverCode: string;
        areaCode: string;
        riverLength: string;
        riverArea: string;
        parentName: string;
        parentRiverCode: string;
        waterSystem: string;
        followAddress: string;
        riverType: string;
        riverFunction: string;
        transboundaryType: string;
        riverSourceDesc: string;
        riverSourceLongitude: string;
        riverSourceLatitude: string;
        riverMouthDesc: string;
        riverMouthLongitude: string;
        riverMouthLatitude: string;
        deathNum: string
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
            * 河流信息-修改-Model类库
            */
      export namespace IpostModifyDisasterRiverSpace {

        export class RequestParams{
          id?:number;name?:string;riverCode?:string;areaCode?:string;riverLength?:string;riverArea?:string;parentName?:string;parentRiverCode?:string;waterSystem?:string;followAddress?:string;riverType?:string;riverFunction?:string;transboundaryType?:string;riverSourceDesc?:string;riverSourceLongitude?:string;riverSourceLatitude?:string;riverMouthDesc?:string;riverMouthLongitude?:string;riverMouthLatitude?:string;
          constructor(){
            this.id=0;this.name="";this.riverCode="";this.areaCode="";this.riverLength="";this.riverArea="";this.parentName="";this.parentRiverCode="";this.waterSystem="";this.followAddress="";this.riverType="";this.riverFunction="";this.transboundaryType="";this.riverSourceDesc="";this.riverSourceLongitude="";this.riverSourceLatitude="";this.riverMouthDesc="";this.riverMouthLongitude="";this.riverMouthLatitude="";
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
            * 闸站-添加-Model类库
            */
      export namespace IpostAddDisasterGateStationSpace {

        export class RequestParams{
          riverId?:number;resName?:string;gateType?:number;areaCode?:string;finishDate?:string;waterFlow?:string;projectScale?:string;manageUnit?:string;superManageUnit?:string;
          constructor(){
            this.riverId=0;this.resName="";this.gateType=0;this.areaCode="";this.finishDate="";this.waterFlow="";this.projectScale="";this.manageUnit="";this.superManageUnit="";
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
            * 河流信息-删除-Model类库
            */
      export namespace IpostDeleteDisasterRiverSpace {

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
            * 河流信息-添加-Model类库
            */
      export namespace IpostAddDisasterRiverSpace {

        export class RequestParams{
          name?:string;riverCode?:string;areaCode?:string;riverLength?:string;riverArea?:string;parentName?:string;parentRiverCode?:string;waterSystem?:string;followAddress?:string;riverType?:string;riverFunction?:string;transboundaryType?:string;riverSourceDesc?:string;riverSourceLongitude?:string;riverSourceLatitude?:string;riverMouthDesc?:string;riverMouthLongitude?:string;riverMouthLatitude?:string;
          constructor(){
            this.name="";this.riverCode="";this.areaCode="";this.riverLength="";this.riverArea="";this.parentName="";this.parentRiverCode="";this.waterSystem="";this.followAddress="";this.riverType="";this.riverFunction="";this.transboundaryType="";this.riverSourceDesc="";this.riverSourceLongitude="";this.riverSourceLatitude="";this.riverMouthDesc="";this.riverMouthLongitude="";this.riverMouthLatitude="";
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
            * 河流信息-列表-Model类库
            */
      export namespace IpostFindDisasterRiverPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;name?:string;riverCode?:string;areaCode?:string;riverLength?:string;riverArea?:string;parentName?:string;parentRiverCode?:string;waterSystem?:string;followAddress?:string;riverType?:string;riverFunction?:string;transboundaryType?:string;riverSourceDesc?:string;riverSourceLongitude?:string;riverSourceLatitude?:string;riverMouthDesc?:string;riverMouthLongitude?:string;riverMouthLatitude?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.name="";this.riverCode="";this.areaCode="";this.riverLength="";this.riverArea="";this.parentName="";this.parentRiverCode="";this.waterSystem="";this.followAddress="";this.riverType="";this.riverFunction="";this.transboundaryType="";this.riverSourceDesc="";this.riverSourceLongitude="";this.riverSourceLatitude="";this.riverMouthDesc="";this.riverMouthLongitude="";this.riverMouthLatitude="";
          }
        }

      export interface List {
        id: number;
        name: string;
        riverCode: string;
        areaCode: string;
        areaCodeName?: string;
        transboundaryTypeName?: string;
        riverLength: string;
        riverArea: string;
        parentName: string;
        parentRiverCode: string;
        waterSystem: string;
        followAddress: string;
        riverType: string;
        riverFunction: string;
        transboundaryType: string;
        riverSourceDesc: string;
        riverSourceLongitude: string;
        riverSourceLatitude: string;
        riverMouthDesc: string;
        riverMouthLongitude: string;
        riverMouthLatitude: string;
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
            * 闸站-删除-Model类库
            */
      export namespace IpostDeleteDisasterGateStationSpace {

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
            * 闸站-主键查询-Model类库
            */
      export namespace IpostFindDisasterGateStationByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        riverId: number;
        resName: string;
        gateType: number;
        areaCode: string;
        finishDate: string;
        waterFlow: string;
        projectScale: string;
        manageUnit: string;
        superManageUnit: string;
        longitude: string;
        latitude: string;
        lnglat?: string[]
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
            * 闸站-修改-Model类库
            */
      export namespace IpostModifyDisasterGateStationSpace {

        export class RequestParams{
          id?:number;riverId?:number;resName?:string;gateType?:number;areaCode?:string;finishDate?:string;waterFlow?:string;projectScale?:string;manageUnit?:string;superManageUnit?:string;
          constructor(){
            this.id=0;this.riverId=0;this.resName="";this.gateType=0;this.areaCode="";this.finishDate="";this.waterFlow="";this.projectScale="";this.manageUnit="";this.superManageUnit="";
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
            * 闸站-列表-Model类库
            */
      export namespace IpostFindDisasterGateStationPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;riverId?:number;resName?:string;gateType?:number;areaCode?:string;finishDate?:string;waterFlow?:string;projectScale?:string;manageUnit?:string;superManageUnit?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.riverId=0;this.resName="";this.gateType=0;this.areaCode="";this.finishDate="";this.waterFlow="";this.projectScale="";this.manageUnit="";this.superManageUnit="";
          }
        }

      export interface List {
        id: number;
        riverId: number;
        resName: string;
        gateType: number;
        areaCode: string;
        finishDate: string;
        waterFlow: string;
        projectScale: string;
        manageUnit: string;
        superManageUnit: string;
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
            * 历史灾情表-列表-Model类库
            */
      export namespace IpostFindDisasterHistoryPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;title?:string;areaCode?:string;disasterType?:number;startDate?:string;endDate?:string;disasterNum?:number;deathNum?:number;transferNum?:number;economicLoss?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.title="";this.areaCode="";this.disasterType=0;this.startDate="";this.endDate="";this.disasterNum=0;this.deathNum=0;this.transferNum=0;this.economicLoss="";
          }
        }

      export interface List {
        id: number;
        title: string;
        areaCode: string;
        disasterType: number;
        startDate: string;
        endDate: string;
        disasterNum: number;
        deathNum: number;
        transferNum: number;
        economicLoss: string;
        disasterTypeName?: string;
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
            * 历史灾情表-添加-Model类库
            */
      export namespace IpostAddDisasterHistorySpace {

        export class RequestParams{
          title?:string;areaCode?:string;disasterType?:number;startDate?:string;endDate?:string;disasterNum?:number;deathNum?:number;transferNum?:number;economicLoss?:string;
          constructor(){
            this.title="";this.areaCode="";this.disasterType=0;this.startDate="";this.endDate="";this.disasterNum=0;this.deathNum=0;this.transferNum=0;this.economicLoss="";
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
            * 历史灾情表-删除-Model类库
            */
      export namespace IpostDeleteDisasterHistorySpace {

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
            * 历史灾情表-主键查询-Model类库
            */
      export namespace IpostFindDisasterHistoryByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        title: string;
        areaCode: string;
        disasterType: string;
        startDate: string;
        endDate: string;
        disasterNum: number;
        deathNum: number;
        transferNum: number;
        economicLoss: string;
        disasterYear: string;
        hasDisaster: string;
        isMajorDisaster: string;
        disasterSmallType: string
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
            * 历史灾情表-修改-Model类库
            */
      export namespace IpostModifyDisasterHistorySpace {

        export class RequestParams{
          id?:number;title?:string;areaCode?:string;disasterType?:number;startDate?:string;endDate?:string;disasterNum?:number;deathNum?:number;transferNum?:number;economicLoss?:string;
          constructor(){
            this.id=0;this.title="";this.areaCode="";this.disasterType=0;this.startDate="";this.endDate="";this.disasterNum=0;this.deathNum=0;this.transferNum=0;this.economicLoss="";
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


      export namespace IpostFindDisasterChemicalIndustrialParkPageSpace {

      export interface List {
        id: number;
        resName: string;
        areaCodeName: string;
        establishDate: string;
        address: string;
        longitude: string;
        latitude: string;
        personName: string;
        personMobile: string;
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

      export namespace IpostFindDisasterChemicalIndustrialParkByIdSpace {

      export interface Data {
        "id": string
        "resName": string
        "address": string
        "areaCode": string
        "longitude": string
        "latitude": string
        "establishDate": string
        "hasParkRecognition": number
        "parkOtherDesc":  string
        "enterprisesNum": number
        "hazardousEnterprisesNum":  number
        "productionHazardousEnterprisesNum":  number
        "operateHazardousEnterprisesNum":  number
        "sourceNum":  number
        "substationNum":  number
        "plantNum":  number
        "supplyWater":  string
        "waterLoad":  string
        "treatmentSewage":  string
        "sewageMaximum":  string
        "responseEmergency":  string
        "hasEmergencyPlatform":  number
        "hasHazardousTeam":  number
        "hasManagementCorridor":  number
        "personName":  string
        "personMobile":  string
        "fillDate":  string
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }

export namespace IpostFindDisasterSocietyReductionPageSpace {

export interface List {
id: number;
resName: string;
areaCodeName: string;
companyCode: string;
address: string;
longitude: string;
latitude: string;
personName: string;
personMobile: string;
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

export namespace IpostFindDisasterSocietyReductionByIdSpace {

export interface Data {
  "id": string
  "resName": string
  "address": string
  "companyCode": string
  "areaCode": string
  "institutionType": number
  "institutionOtherDesc": string
  "orgLevel": number
  "registerDate": string
  "registerAddress": string
  "officeType": number
  "officeOtherDesc": string
  "officeName": string
  "chargeOfficeName": string
  "fullNum": number
  "volunteerNum": number
  "technologyNum": number
  "teachersNum": number
  "officeArea": string
  "businessDirection": string
  "technicalExpertise": string
  "technicalOtherDesc": string
  "lastPopularizationNum": number
  "lastPopularizationPeopleNum": number
  "lastPopularizationAudiencesNum": number
  "lastRevenue": string
  "governmentSubsidies": string
  "socialDonations": string
  "lastExpenditure": string
  "otherExpenditure": string
  "personName": string
  "personMobile": string
  "fillDate": string
  "longitude": string
"latitude": string
}

export interface Model {
  code: string;
  desc: string;
  tips: string;
  httpStatusCode: number;
  data: Data;
}
}

export namespace IpostFindDisasterIndicatorStatisticsPageSpace {

  export interface List {
    id: number;
    yearly: string;
    grossRegionalProduct: string;
    grossRegionalProductPerCapita: string;
    residentsPerCapitaDisposable: string;
    cultivatedLandArea: string;
    grainProduction: string;
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
export namespace IpostFindDisasterIndicatorStatisticsByIdSpace {

  export interface Data {
    "id": string
		"yearly": number
		"grossRegionalProduct": string
		"primaryIndustryAdded": string
		"secondaryIndustryAdded": string
		"tertiaryIndustryAdded":string
		"grossRegionalProductPerCapita": string
		"wholeSocietyInvestmentTotal": string
		"localFiscalGeneralBudgetRevenue": string
		"localFiscalGeneralBudgetExpenditure": string
		"residentsPerCapitaDisposable": string
		"urbanResidentsPerCapitaDisposable": string
		"ruralResidentsPerCapitaDisposable": string
		"consumerGoodsTotal": string
		"civilianCarsOwnedNumber": string
		"telephonePenetrationRate": string
		"cultivatedLandArea": string
		"grainProduction": string
		"wheatSownArea": string
		"cornSownArea": string
		"riceSownArea": string
		"wheatProduction": string
		"cornProduction": string
		"riceProduction": string
		"wheatYieldPerUnitArea": string
		"cornYieldPerUnitArea": string
		"riceYieldPerUnitArea": string
		"livestockNumber": string
		"aquaticProductOutput": string
		"majorAgriculturalMachineryOwnership": string
		"agricultureForestryAnimalHusbandryFisheryValue": string
		"personName": string
		"fillDate": string
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostFindDisasterTownsIndicatorStatisticsPageSpace {

  export interface List {
    id: number;
    yearly: string;
    areaCodeName: string;
    cropsSownAreaTotal: string;
    wheatSownArea: string;
    cornSownArea: string;
    riceSownArea: string;
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
export namespace IpostFindDisasterTownsIndicatorStatisticsByIdSpace {

  export interface Data {
    "id": string
		"yearly": number
		"areaCode": string
    "areaCodeName": string
		"cropsSownAreaTotal":string
		"wheatSownArea": string
		"cornSownArea": string
		"riceSownArea": string
		"administrativeArea": string
		"personName": string
		"fillDate": string
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostFindDisasterGovernmentManagementPageSpace {

  export interface List {
    id: number;
    resName: string;
    areaCodeName: string;
    unitLevel: string;
    disasterManagementField: string;
    publicInstitutionsNumber: string;
    disasterManagementPersonnelTotal: string;
    address: string
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
export namespace IpostFindDisasterGovernmentManagementByIdSpace {

  export interface Data {
    "id": string
		"resName": string
		"institutionCode": string
		"address": string
		"unitLevel": number
		"publicInstitutionsNumber": number
		"disasterManagementField": string
		"disasterManagementPersonnelTotal": number
		"officiallyEmployedExpertsTotal": number
		"disasterPreventionReductionPlansNumber": number
		"planName": string
		"planFormulationTime": string
		"disasterRelatedPlansNumber": number
		"expenditureYear": number
		"educationExpenditure": string
		"scienceTechnologyExpenditure": string
		"agricultureForestryWaterExpenditure": string
		"naturalMarineMeteorologyExpenditure": string
		"grainOilMaterialReservesExpenditure": string
		"disasterPreventionEmergencyExpenditures": string
		"emergencyManagementServices": string
		"naturalDisasterPreventionControlExpenditure": string
		"naturalDisasterReliefRecoveryReconstructionExpenditure": string
		"personName": string
		"fillDate": string
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostFindDisasterGovernmentManagementPlanPageSpace {

  export interface List {
    "id": string
			"disasterGovernmentManagementId": string
			"resName": string
			"planDate": string
  }


  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: List[];
  }
}
