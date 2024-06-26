/* eslint-disable @typescript-eslint/no-namespace */

/**
      * 图层-显隐修改-Model类库
      */
export namespace IpostUpdateShowPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: number;
        }
        }
/**
              * 图层-删除-Model类库
              */
export namespace IpostDeleteCertPlottingLayerPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: boolean;
        }
        }
/**
              * 图层-修改名称-Model类库
              */
export namespace IpostModifyCertPlottingLayerPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: boolean;
        }
        }
/**
              * 图层-同步视野-Model类库
              */
export namespace IpostSyncViewPlottingSpace {

          export class RequestParams {
            resourceId?:string;id?:string;layerId?:string;longitude?:string;latitude?:string;level?:number;userId?:string;
            constructor() {
              this.resourceId = ""; this.id = ""; this.layerId = ""; this.longitude = ""; this.latitude = ""; this.level = 0; this.userId = "";
            }
          }

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: number;
        }
        }
/**
              * 图层-顺序修改-Model类库
              */
export namespace IpostUpdateSortPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: number;
        }
        }
/**
              * 图层-添加-Model类库
              */
export namespace IpostAddCertPlottingLayerPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: string;
        }
        }
/**
              * 图层-查询图层详情-Model类库
              */
export namespace IpostFindCertPlottingLayerByIdPlottingSpace {

        export interface MarkVoList {
            id: number;
            resourceId: string;
            layerId: string;
            layerName: string;
            markName: string;
            markDesc: string;
            areaCode: number;
            areaCodeName: string;
            address: string;
            longitude: string;
            latitude: string;
            mapMarkId: string;
            markOther: string;
            userName: string;
            orgName: string;
            hasPermission: number;
            userId: string;
        }

        export interface Data {
            id: number;
            resourceId: string;
            layerName: string;
            layerType: string;
            markVoList: MarkVoList[];
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
              * 图层-图层列表-Model类库
              */
export namespace IpostLayerListPlottingSpace {

        export interface MarkVoList {
            id: number;
            resourceId: string;
            layerId: string;
            layerName: string;
            markName: string;
            markDesc: string;
            areaCode: number;
            areaCodeName: string;
            address: string;
            longitude: string;
            latitude: string;
            mapMarkId: string;
            markOther: string;
            userName: string;
            orgName: string;
            hasPermission: number;
            userId: string;
        }

        export interface Data {
            id: number;
            resourceId: string;
            personId: string;
            personName: string;
            orgId: string;
            orgName: string;
            layerId: string;
            layerName: string;
            sort: number;
            hasEdit: number;
            hasShow: number;
            hasMySelf: number;
            markVoList: MarkVoList[];
            peopleNum: number;
            lastDateTime: string;
            createMan: string;
            hasPainting: number;
            hasDelete: number;
            createdUserId: number;
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
              * 标注信息表-主键查询-Model类库
              */
export namespace IpostFindCertPlottingMarkByIdPlottingSpace {

        export interface Data {
            id: number;
            resourceId: string;
            layerId: string;
            markName: string;
            markDesc: string;
            areaCode: number;
            address: string;
            longitude: string;
            latitude: string;
            mapMarkId: string;
            markOther: string;
            deleted: number;
            userId: string;
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
              * 标注信息表-列表-Model类库
              */
export namespace IpostFindCertPlottingMarkPagePlottingSpace {

          export class RequestParams {
            currentPage?:number;pageSize?:number;resourceId?:string;layerId?:string;markName?:string;markDesc?:string;areaCode?:number;address?:string;longitude?:string;latitude?:string;mapMarkId?:string;markOther?:string;deleted?:number;userId?:string;
            constructor() {
              this.currentPage = 0; this.pageSize = 0; this.resourceId = ""; this.layerId = ""; this.markName = ""; this.markDesc = ""; this.areaCode = 0; this.address = ""; this.longitude = ""; this.latitude = ""; this.mapMarkId = ""; this.markOther = ""; this.deleted = 0; this.userId = "";
            }
          }

        export interface List {
            id: number;
            resourceId: string;
            layerId: string;
            markName: string;
            markDesc: string;
            areaCode: number;
            address: string;
            longitude: string;
            latitude: string;
            mapMarkId: string;
            markOther: string;
            deleted: number;
            userId: string;
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
              * 标注信息表-添加-Model类库
              */
export namespace IpostAddCertPlottingMarkPlottingSpace {

          export class RequestParams {
            resourceId?:string;layerId?:string;markName?:string;markDesc?:string;areaCode?:number;address?:string;longitude?:string;latitude?:string;mapMarkId?:string;markOther?:string;deleted?:number;userId?:string;
            constructor() {
              this.resourceId = ""; this.layerId = ""; this.markName = ""; this.markDesc = ""; this.areaCode = 0; this.address = ""; this.longitude = ""; this.latitude = ""; this.mapMarkId = ""; this.markOther = ""; this.deleted = 0; this.userId = "";
            }
          }

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: string;
        }
        }
/**
              * 标注信息表-删除-Model类库
              */
export namespace IpostDeleteCertPlottingMarkPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: boolean;
        }
        }
/**
              * 标注信息表-修改-Model类库
              */
export namespace IpostModifyCertPlottingMarkPlottingSpace {

          export class RequestParams {
            id?:number;resourceId?:string;layerId?:string;markName?:string;markDesc?:string;areaCode?:number;address?:string;longitude?:string;latitude?:string;mapMarkId?:string;markOther?:string;deleted?:number;userId?:string;
            constructor() {
              this.id = 0; this.resourceId = ""; this.layerId = ""; this.markName = ""; this.markDesc = ""; this.areaCode = 0; this.address = ""; this.longitude = ""; this.latitude = ""; this.mapMarkId = ""; this.markOther = ""; this.deleted = 0; this.userId = "";
            }
          }

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: string;
        }
        }
/**
              * 地图标绘图标-删除-Model类库
              */
export namespace IpostDeleteCertPlottingIconPlottingSpace {

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: boolean;
        }
        }
/**
              * 地图标绘图标-修改-Model类库
              */
export namespace IpostModifyCertPlottingIconPlottingSpace {

          export class RequestParams {
            id?:number;code?:string;description?:string;name?:string;url?:string;type?:string;sort?:number;parentId?:string;open?:number;deleted?:number;
            constructor() {
              this.id = 0; this.code = ""; this.description = ""; this.name = ""; this.url = ""; this.type = ""; this.sort = 0; this.parentId = ""; this.open = 0; this.deleted = 0;
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
              * 地图标绘图标-添加-Model类库
              */
export namespace IpostAddCertPlottingIconPlottingSpace {

          export class RequestParams {
            code?:string;description?:string;name?:string;url?:string;type?:string;sort?:number;parentId?:string;open?:number;deleted?:number;
            constructor() {
              this.code = ""; this.description = ""; this.name = ""; this.url = ""; this.type = ""; this.sort = 0; this.parentId = ""; this.open = 0; this.deleted = 0;
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
              * 地图标绘图标-列表-Model类库
              */
export namespace IpostFindCertPlottingIconPagePlottingSpace {

          export class RequestParams {
            currentPage?:number;pageSize?:number;code?:string;description?:string;name?:string;url?:string;type?:string;sort?:number;parentId?:string;open?:number;deleted?:number;
            constructor() {
              this.currentPage = 0; this.pageSize = 0; this.code = ""; this.description = ""; this.name = ""; this.url = ""; this.type = ""; this.sort = 0; this.parentId = ""; this.open = 0; this.deleted = 0;
            }
          }

        export interface List {
            id: number;
            code: string;
            description: string;
            name: string;
            url: string;
            type: string;
            sort: number;
            parentId: string;
            open: number;
            deleted: number;
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
              * 地图标绘图标-主键查询-Model类库
              */
export namespace IpostFindCertPlottingIconByIdPlottingSpace {

        export interface Data {
            id: number;
            code: string;
            description: string;
            name: string;
            url: string;
            type: string;
            sort: number;
            parentId: string;
            open: number;
            deleted: number;
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
              * 地图标绘图标-树-Model类库
              */
export namespace IpostTreePlottingSpace {

        export interface Children {}

        export interface Data {
            id: string;
            pid: string;
            checked: number;
            children: Children[];
            code: string;
            name: string;
            url: string;
            type: string;
            sort: number;
            open: number;
        }

        export interface Model {
            code: string;
            desc: string;
            tips: string;
            httpStatusCode: number;
            data: Data;
        }
        }
