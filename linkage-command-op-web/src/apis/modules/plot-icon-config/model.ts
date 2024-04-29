/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 地图标绘图标-修改-Model类库
      */
      export namespace IpostModifyCertPlottingIconSpace {

        export class RequestParams{
          id?:number;code?:string;description?:string;name?:string;url?:string;type?:string;sort?:number;parentId?:number;open?:number;deleted?:number;rootId?:number;layerType?:string;
          constructor(){
            this.id=0;this.code="";this.description="";this.name="";this.url="";this.type="";this.sort=0;this.parentId=0;this.open=0;this.deleted=0;this.rootId=0;this.layerType="";
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
            * 地图标绘图标-分类树-Model类库
            */
      export namespace IpostCatalogTreeSpace {
      
        export class RequestParams{
          rootId?:number;
          constructor(){
            this.rootId=0;
          }
        }
      
      export interface Children {}
      
      export interface Data {
        id: number;
        pid: number;
        checked: number;
        children: Children[];
        code: string;
        name: string;
        url: string;
        type: string;
        sort: number;
        open: number;
        rootId: number;
        layerType: string;
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
      export namespace IpostDeleteCertPlottingIconSpace {
      
        export class RequestParams{
          ids?:[];
          constructor(){
            this.ids=[];
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
            * 地图标绘图标-专题列表-Model类库
            */
      export namespace IpostTopicsSpace {
      
        export class RequestParams{
          
          constructor(){
            
          }
        }
      
      export interface Data {
        id: number;
        createdAt: string;
        updatedAt: string;
        createdUserId: string;
        ownerId: string;
        updatedUserId: string;
        deleted: number;
        tenantId: string;
        code: string;
        description: string;
        name: string;
        url: string;
        type: string;
        sort: number;
        parentId: number;
        open: number;
        layerType: string;
        rootId: number;
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
            * 地图标绘图标-主键查询-Model类库
            */
      export namespace IpostFindCertPlottingIconByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        code: string;
        description: string;
        name: string;
        url: string;
        type: string;
        sort: number;
        parentId: number;
        open: number;
        deleted: number;
        rootId: number;
        layerType: string;
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
            * 地图标绘图标-分页列表-Model类库
            */
      export namespace IpostFindCertPlottingIconPageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;code?:string;description?:string;name?:string;url?:string;type?:string;sort?:number;parentId?:string;open?:number;deleted?:number;rootId?:number;layerType?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.code="";this.description="";this.name="";this.url="";this.type="";this.sort=0;this.parentId="";this.open=0;this.deleted=0;this.rootId=0;this.layerType="";
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
        parentId: number;
        open: number;
        deleted: number;
        rootId: number;
        layerType: string;
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
            * 地图标绘图标-批量修改状态-Model类库
            */
      export namespace IpostUpdateStatusSpace {
      
        export class RequestParams{
          status?:string;
          constructor(){
            this.status="";
          }
        }
      
      export interface Data {}
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }
            /**
            * 地图标绘图标-添加-Model类库
            */
      export namespace IpostAddCertPlottingIconSpace {
      
        export class RequestParams{
          code?:string;description?:string;name?:string;url?:string;type?:string;sort?:number;parentId?:number;open?:number;deleted?:number;rootId?:number;layerType?:string;
          constructor(){
            this.code="";this.description="";this.name="";this.url="";this.type="";this.sort=0;this.parentId=0;this.open=0;this.deleted=0;this.rootId=0;this.layerType="";
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
      export namespace IpostTreeSpace {
      
        export class RequestParams{
          rootId?:number;
          constructor(){
            this.rootId=0;
          }
        }
      
      export interface Children {}
      
      export interface Data {
        id: number;
        pid: number;
        checked: number;
        children: Children[];
        code: string;
        name: string;
        url: string;
        type: string;
        sort: number;
        open: number;
        rootId: number;
        layerType: string;
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
            * 地图标绘图标-查询指定分类下的图标-Model类库
            */
      export namespace IpostFindCertPlottingIconListInCatagorySpace {
      
        export class RequestParams{
          catagoryId?:number;
          constructor(){
            this.catagoryId=0;
          }
        }
      
      export interface Data {
        id: number;
        code: string;
        description: string;
        name: string;
        url: string;
        type: string;
        sort: number;
        parentId: number;
        parentName: string;
        open: number;
        deleted: number;
        rootId: number;
        layerType: string;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }