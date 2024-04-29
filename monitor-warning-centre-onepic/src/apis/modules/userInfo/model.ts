/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 用户退出-Model类库
      */
       export namespace IpostLogoutSsoSpace {

        export interface Model {
          code: string;
          data: boolean;
          desc: string;
          httpStatusCode: number;
          tips: string;
        }
        }
              /**
              * 校验token-Model类库
              */
        export namespace IpostCheckTokenSsoSpace {
        
        export interface Data {
          msg: string;
          valid: number;
        }
        
        export interface Model {
          code: string;
          data: Data;
          desc: string;
          httpStatusCode: number;
          tips: string;
        }
        }
              /**
              * 用户登录-Model类库
              */
        // export namespace IpostLoginSsoSpace {
        
        //   export class RequestParams{
        //     account?:string;clientType?:string;password?:string;tenantId?:number;
        //     constructor(){
        //       this.account="";this.clientType="";this.password="";this.tenantId=0;
        //     }
        //   }
        
        // export interface Data {
        //   authorization: string;
        //   userId: number;
        // }
        
        // export interface Model {
        //   code: string;
        //   data: Data;
        //   desc: string;
        //   httpStatusCode: number;
        //   tips: string;
        // }
        // }
              /**
              * 获取当前登录用户的信息-Model类库
              */
        export namespace IpostGetUserInfoSsoSpace {
        
        export interface SourceId {}
        
        export interface Operation {
          hasScope: number;
          operationCode: string;
          operationName: string;
          scopeBy: number;
          scopeType: number;
          sourceIds: SourceId[];
        }
        
        export interface Function {
          functionCode: string;
          functionName: string;
          hasScope: number;
          operations: Operation[];
          scopeBy: number;
        }
        
        export interface OrgList {
          areaCode: string;
          areaName: string;
          isMain: number;
          orgId: number;
          orgName: string;
        }
        
        export interface Data {
          account: string;
          functions: Function[];
          orgList: OrgList[];
          tenantId: number;
          tenantName: string;
          userId: number;
          userName: string;
        }
        
        export interface Model {
          code: string;
          data: Data;
          desc: string;
          httpStatusCode: number;
          tips: string;
        }
        }