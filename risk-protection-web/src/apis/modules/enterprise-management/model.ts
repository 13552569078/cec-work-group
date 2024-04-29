/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 企业信息-主键查询-Model类库
      */
      export namespace IpostFindCompanyByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Data {
        id: number;
        companyName: string;
        companyCode: string;
        areaCode: string;
        areaName: string;
        legalPerson: string;
        legalIdCardNo: string;
        legalPersonPhone: string;
        regCapitalAmount: string;
        companyPhone: string;
        postCode: string;
        address: string;
        businessScope: string;
        regAddress: string;
        longitude: string;
        latitude: string;
        regTime: string;
        establishTime: string;
        assets: number;
        securityLevel: string;
        securityLevelName: string;
        securityLicense: string;
        securityLicenseValidity: string;
        employeesNum: number;
        category: string;
        categoryName: string;
        principalPerson: string;
        principalPersonPhone: string;
        ajCategory: string;
        ajCategoryName: string;
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
            * 企业信息-添加-Model类库
            */
      export namespace IpostAddCompanySpace {
      
        export class RequestParams{
          companyName?:string;companyCode?:string;areaCode?:string;legalPerson?:string;legalIdCardNo?:string;legalPersonPhone?:string;regCapitalAmount?:string;companyPhone?:string;postCode?:string;address?:string;businessScope?:string;regAddress?:string;longitude?:string;latitude?:string;regTime?:string;establishTime?:string;assets?:number;securityLevel?:string;securityLicense?:string;securityLicenseValidity?:string;employeesNum?:number;category?:string;principalPerson?:string;principalPersonPhone?:string;ajCategory?:string;
          constructor(){
            this.companyName="";this.companyCode="";this.areaCode="";this.legalPerson="";this.legalIdCardNo="";this.legalPersonPhone="";this.regCapitalAmount="";this.companyPhone="";this.postCode="";this.address="";this.businessScope="";this.regAddress="";this.longitude="";this.latitude="";this.regTime="";this.establishTime="";this.assets=0;this.securityLevel="";this.securityLicense="";this.securityLicenseValidity="";this.employeesNum=0;this.category="";this.principalPerson="";this.principalPersonPhone="";this.ajCategory="";
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
            * 企业信息-修改-Model类库
            */
      export namespace IpostModifyCompanySpace {
      
        export class RequestParams{
          id?:number;companyName?:string;companyCode?:string;areaCode?:string;legalPerson?:string;legalIdCardNo?:string;legalPersonPhone?:string;regCapitalAmount?:string;companyPhone?:string;postCode?:string;address?:string;businessScope?:string;regAddress?:string;longitude?:string;latitude?:string;regTime?:string;establishTime?:string;assets?:number;securityLevel?:string;securityLicense?:string;securityLicenseValidity?:string;employeesNum?:number;category?:string;principalPerson?:string;principalPersonPhone?:string;ajCategory?:string;
          constructor(){
            this.id=0;this.companyName="";this.companyCode="";this.areaCode="";this.legalPerson="";this.legalIdCardNo="";this.legalPersonPhone="";this.regCapitalAmount="";this.companyPhone="";this.postCode="";this.address="";this.businessScope="";this.regAddress="";this.longitude="";this.latitude="";this.regTime="";this.establishTime="";this.assets=0;this.securityLevel="";this.securityLicense="";this.securityLicenseValidity="";this.employeesNum=0;this.category="";this.principalPerson="";this.principalPersonPhone="";this.ajCategory="";
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
            * 企业信息-列表-Model类库
            */
      export namespace IpostFindCompanyPageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;companyName?:string;companyCode?:string;areaCode?:string;legalPerson?:string;legalIdCardNo?:string;legalPersonPhone?:string;regCapitalAmount?:string;companyPhone?:string;postCode?:string;address?:string;businessScope?:string;regAddress?:string;longitude?:string;latitude?:string;regTime?:string;assets?:number;securityLevel?:string;securityLicense?:string;securityLicenseValidity?:string;employeesNum?:number;category?:string;principalPerson?:string;principalPersonPhone?:string;ajCategory?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.companyName="";this.companyCode="";this.areaCode="";this.legalPerson="";this.legalIdCardNo="";this.legalPersonPhone="";this.regCapitalAmount="";this.companyPhone="";this.postCode="";this.address="";this.businessScope="";this.regAddress="";this.longitude="";this.latitude="";this.regTime="";this.assets=0;this.securityLevel="";this.securityLicense="";this.securityLicenseValidity="";this.employeesNum=0;this.category="";this.principalPerson="";this.principalPersonPhone="";this.ajCategory="";
          }
        }
      
      export interface List {
        id: number;
        companyName: string;
        companyCode: string;
        areaCode: string;
        areaName: string;
        legalPerson: string;
        legalIdCardNo: string;
        legalPersonPhone: string;
        regCapitalAmount: string;
        companyPhone: string;
        postCode: string;
        address: string;
        businessScope: string;
        regAddress: string;
        longitude: string;
        latitude: string;
        regTime: string;
        establishTime: string;
        assets: number;
        securityLevel: string;
        securityLevelName: string;
        securityLicense: string;
        securityLicenseValidity: string;
        employeesNum: number;
        category: string;
        categoryName: string;
        principalPerson: string;
        principalPersonPhone: string;
        ajCategory: string;
        ajCategoryName: string;
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
            * 企业信息-删除-Model类库
            */
      export namespace IpostDeleteCompanySpace {
      
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