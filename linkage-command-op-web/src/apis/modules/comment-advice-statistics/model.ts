/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 专家建议表-删除-Model类库
      */
      export namespace IpostDeleteExpertAdviceSpace {

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
            * 专家建议表-主键查询-Model类库
            */
      export namespace IpostFindExpertAdviceByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        expertName: string;
        adviceTime: string;
        orgName: string;
        adviceContent: string;
        adviceFileName: string;
        adviceFile: string;
        eventId: number;
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
            * 专家建议表-列表-Model类库
            */
      export namespace IpostFindExpertAdvicePageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;expertName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFile?:string;eventId?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.expertName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFile="";this.eventId=0;
          }
        }
      
      export interface List {
        id: number;
        expertName: string;
        adviceTime: string;
        orgName: string;
        adviceContent: string;
        adviceFile: string;
        eventId: number;
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
            * 专家建议表-添加-Model类库
            */
      export namespace IpostAddExpertAdviceSpace {
      
        export class RequestParams{
          expertName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFileName?:string;adviceFile?:string;eventId?:number;
          constructor(){
            this.expertName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFileName="";this.adviceFile="";this.eventId=0;
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
            * 领导批示表-删除-Model类库
            */
      export namespace IpostDeleteLeaderInstructionSpace {
      
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
            * 部门建议表-删除-Model类库
            */
      export namespace IpostDeleteDepartmentAdviceSpace {
      
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
            * 专家建议表-修改-Model类库
            */
      export namespace IpostModifyExpertAdviceSpace {
      
        export class RequestParams{
          id?:number;expertName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFile?:string;eventId?:number;
          constructor(){
            this.id=0;this.expertName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFile="";this.eventId=0;
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
            * 领导批示表-添加-Model类库
            */
      export namespace IpostAddLeaderInstructionSpace {
      
        export class RequestParams{
          leaderName?:string;orgName?:string;instructionTime?:string;instructionContent?:string;instructionFileName?:string;instructionFile?:string;eventId?:number;
          constructor(){
            this.leaderName="";this.orgName="";this.instructionTime="";this.instructionContent="";this.instructionFileName="";this.instructionFile="";this.eventId=0;
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
            * 领导批示表-修改-Model类库
            */
      export namespace IpostModifyLeaderInstructionSpace {
      
        export class RequestParams{
          id?:number;leaderName?:string;orgName?:string;instructionTime?:string;instructionContent?:string;instructionFile?:string;eventId?:number;
          constructor(){
            this.id=0;this.leaderName="";this.orgName="";this.instructionTime="";this.instructionContent="";this.instructionFile="";this.eventId=0;
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
            * 领导批示表-列表-Model类库
            */
      export namespace IpostFindLeaderInstructionPageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;leaderName?:string;orgName?:string;instructionTime?:string;instructionContent?:string;instructionFile?:string;eventId?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.leaderName="";this.orgName="";this.instructionTime="";this.instructionContent="";this.instructionFile="";this.eventId=0;
          }
        }
      
      export interface List {
        id: number;
        leaderName: string;
        orgName: string;
        instructionTime: string;
        instructionContent: string;
        instructionFile: string;
        eventId: number;
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
            * 部门建议表-修改-Model类库
            */
      export namespace IpostModifyDepartmentAdviceSpace {
      
        export class RequestParams{
          id?:number;departmentName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFile?:string;eventId?:number;
          constructor(){
            this.id=0;this.departmentName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFile="";this.eventId=0;
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
            * 部门建议表-添加-Model类库
            */
      export namespace IpostAddDepartmentAdviceSpace {
      
        export class RequestParams{
          departmentName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFileName?:string;adviceFile?:string;eventId?:number;
          constructor(){
            this.departmentName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFileName="";this.adviceFile="";this.eventId=0;
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
            * 部门建议表-列表-Model类库
            */
      export namespace IpostFindDepartmentAdvicePageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;departmentName?:string;adviceTime?:string;orgName?:string;adviceContent?:string;adviceFile?:string;eventId?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.departmentName="";this.adviceTime="";this.orgName="";this.adviceContent="";this.adviceFile="";this.eventId=0;
          }
        }
      
      export interface List {
        id: number;
        departmentName: string;
        adviceTime: string;
        orgName: string;
        adviceContent: string;
        adviceFile: string;
        eventId: number;
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
            * 领导批示表-主键查询-Model类库
            */
      export namespace IpostFindLeaderInstructionByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        leaderName: string;
        orgName: string;
        instructionTime: string;
        instructionContent: string;
        instructionFileName: string;
        instructionFile: string;
        eventId: number;
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
            * 部门建议表-主键查询-Model类库
            */
      export namespace IpostFindDepartmentAdviceByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        departmentName: string;
        adviceTime: string;
        orgName: string;
        adviceContent: string;
        adviceFileName: string;
        adviceFile: string;
        eventId: number;
      }
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data;
      }
      }