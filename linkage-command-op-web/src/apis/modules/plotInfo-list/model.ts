/* eslint-disable @typescript-eslint/no-namespace */

/**
      * 标绘记录-列表查询-Model类库
      */
export namespace IpostFindLogListPlottingSpace {

        export interface PeopleNameList {}

        export interface Data {
          id: number;
          resourceId: string;
          markId: string;
          layerId: string;
          markName: string;
          layerName: string;
          personName: string;
          orgName: string;
          operationType: string;
          operationTypeName: string;
          objType: number;
          oldLayerName: string;
          oldMarkOther: string;
          newMarkOther: string;
          personNum: number;
          peopleNames: string;
          peopleNameList: PeopleNameList[];
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
              * 标绘记录表-列表-Model类库
              */
export namespace IpostFindCertPlottingLogPagePlottingSpace {

          export class RequestParams {
            currentPage?:number;pageSize?:number;resourceId?:string;markId?:string;markName?:string;layerId?: string | number;layerName?:string;personName?:string;orgName?:string;operationType?:string;objType?:number;oldLayerName?:string;oldMarkOther?:string;newMarkOther?:string;personNum?:number;peopleNames?:string;deleted?:number;
            constructor() {
              this.currentPage = 0; this.pageSize = 0; this.resourceId = ""; this.markId = ""; this.markName = ""; this.layerId = ""; this.layerName = ""; this.personName = ""; this.orgName = ""; this.operationType = ""; this.objType = 0; this.oldLayerName = ""; this.oldMarkOther = ""; this.newMarkOther = ""; this.personNum = 0; this.peopleNames = ""; this.deleted = 0;
            }
          }

        export interface List {
          id: number;
          resourceId: string;
          markId: string;
          markName: string;
          layerId: string;
          layerName: string;
          personName: string;
          orgName: string;
          operationType: string;
          objType: number;
          oldLayerName: string;
          oldMarkOther: string;
          newMarkOther: string;
          personNum: number;
          peopleNames: string;
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
              * 标注信息表-添加-Model类库
              */
export namespace IpostAddCertPlottingMarkPlottingSpace {

          export class RequestParams {
            resourceId?:string;layerId?: string | number;markName?:string;markDesc?:string;areaCode?:number;address?:string;longitude?:string;latitude?:string;mapMarkId?:string;markOther?:string;deleted?:number;userId?:string;
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
              * 标注信息表-修改-Model类库
              */
export namespace IpostModifyCertPlottingMarkPlottingSpace {

          export class RequestParams {
            id?:number;resourceId?:string;layerId?:string|number;markName?:string;markDesc?:string;areaCode?:number;address?:string;longitude?:string;latitude?:string;mapMarkId?:string;markOther?:string;deleted?:number;userId?:string;
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
              * 标注信息表-列表-Model类库
              */
export namespace IpostFindCertPlottingMarkPagePlottingSpace {

          export class RequestParams {
            currentPage?:number;pageSize?:number;resourceId?:string;layerId?: string | number;markName?:string;markDesc?:string;areaCode?:number;address?:string;longitude?:string;latitude?:string;mapMarkId?:string;markOther?:string;deleted?:number;userId?:string;
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
