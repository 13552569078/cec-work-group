/* eslint-disable @typescript-eslint/no-namespace */
      
      /**
      * 指挥体系工作组模板-列表-Model类库
      */
      export namespace IgetFindCommandSysGroupTemplatesSpace {

        export class RequestParams{
          
          constructor(){
            
          }
        }
      
      export interface Data {
        id: number;
        commandSysName: string;
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
            * 事件类型树-Model类库
            */
      export namespace IgetEventTreeSpace {
      
        export class RequestParams{
          code?:string;
          constructor(){
            this.code="";
          }
        }
      
      export interface Children {}
      
      export interface Data {
        id: string;
        pid: string;
        checked: number;
        children: Children[];
        eventTypeCode: string;
        eventTypeName: string;
        eventTypeChs: string;
        eventTypeEn: string;
        parentCode: string;
        mark: string;
        sort: number;
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
            * 通信方式-下拉列表-Model类库
            */
      export namespace IpostFindCommandSysCommunicationMetadataSpace {
      
        export class RequestParams{
          type?:string;
          constructor(){
            this.type="";
          }
        }
      
      export interface Data {
        mode: string;
        modeName: string;
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
            * 根据父级行政区划编码查询子级行政区划编码-Model类库
            */
      export namespace IgetChildSpace {
      
        export class RequestParams{
          parentCode?:number;
          constructor(){
            this.parentCode=0;
          }
        }
      
      export interface Data {
        areaCode: number;
        areaName: string;
        shortName: string;
        longitude: string;
        latitude: string;
        level: number;
        sort: number;
        status: number;
        parentCode: number;
        province: number;
        city: number;
        county: number;
        town: number;
        village: number;
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
            * 通讯录人员-添加-Model类库
            */
      export namespace IpostAddCommandSysUserSpace {
      
        export class RequestParams{
          userName?:string;gender?:number;profilePicture?:string;orgId?:number;communicationAddParams?:[];
          constructor(){
            this.userName="";this.gender=0;this.profilePicture="";this.orgId=0;this.communicationAddParams=[];
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
            * 用户表-列表-Model类库
            */
      export namespace IpostFindCommandSysUserPageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;userName?:string;orgId?:number;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.userName="";this.orgId=0;
          }
        }
      
      export interface CommunicationMode {
        id: number;
        relationId: number;
        mode: string;
        modeName: string;
        value: string;
      }
      
      export interface List {
        id: string;
        userName: string;
        gender: number;
        orgName: string;
        orgId: string;
        communicationMode: CommunicationMode[];
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
            * 通讯录人员-修改-Model类库
            */
      export namespace IpostModifyCommandSysUserSpace {
      
        export class RequestParams{
          id?:number;userName?:string;gender?:number;profilePicture?:string;communicationModifyParams?:[];
          constructor(){
            this.id=0;this.userName="";this.gender=0;this.profilePicture="";this.communicationModifyParams=[];
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
            * 用户表-删除-Model类库
            */
      export namespace IpostDeleteCommandSysUserSpace {
      
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
            * 用户表-主键查询-Model类库
            */
      export namespace IpostFindCommandSysUserByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface CommunicationMode {
        id: number;
        relationId: number;
        mode: string;
        modeName: string;
        value: string;
      }
      
      export interface Data {
        id: string;
        userName: string;
        gender: number;
        profilePicture: string;
        orgName: string;
        orgId: string;
        communicationMode: CommunicationMode[];
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
            * 组织机构-删除-Model类库
            */
      export namespace IpostDeleteCommandSysOrgSpace {
      
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
            * 组织机构-顺序调整-Model类库
            */
      export namespace IpostCommandSysOrgSortSpace {
      
        export class RequestParams{
          orgs?:[];
          constructor(){
            this.orgs=[];
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
            * 机构人员池-同步机构人员-Model类库
            */
      export namespace IpostSyncOrgAndPersonSpace {
      
        export class RequestParams{
          orgIds?:[];syncPerson?:string;
          constructor(){
            this.orgIds=[];this.syncPerson="";
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
            * 组织机构-主键查询-Model类库
            */
      export namespace IpostFindCommandSysOrgByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface CommunicationMode {
        id: string;
        relationId: string;
        mode: string;
        modeName: string;
        value: string;
      }
      
      export interface Data {
        id: string;
        orgName: string;
        parentId: string;
        parentOrgName: string;
        areaCode: string;
        areaName: string;
        address: string;
        communicationMode: CommunicationMode[];
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
            * 组织机构-修改-Model类库
            */
      export namespace IpostModifyCommandSysOrgSpace {
      
        export class RequestParams{
          id?:number;orgName?:string;areaCode?:string;areaName?:string;address?:string;communicationModifyParams?:[];
          constructor(){
            this.id=0;this.orgName="";this.areaCode="";this.areaName="";this.address="";this.communicationModifyParams=[];
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
            * 组织机构-添加-Model类库
            */
      export namespace IpostAddCommandSysOrgSpace {
      
        export class RequestParams{
          orgName?:string;areaCode?:string;parentId?:number;areaName?:string;address?:string;communicationAddParams?:[];
          constructor(){
            this.orgName="";this.areaCode="";this.parentId=0;this.areaName="";this.address="";this.communicationAddParams=[];
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
            * 组织机构-查询树-Model类库
            */
      export namespace IgetFindCommandSysOrgTreeSpace {
      
        export class RequestParams{
          
          constructor(){
            
          }
        }
      
      export interface Children {}
      
      export interface Children {
        id: string;
        orgName: string;
        parentId: string;
        areaCode: string;
        areaName: string;
        sort: number;
        address: string;
        children: Children[];
      }
      
      export interface Data {
        id: string;
        orgName: string;
        parentId: string;
        areaCode: string;
        areaName: string;
        sort: number;
        address: string;
        children: Children[];
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
            * 工作组机构-修改-Model类库
            */
      export namespace IpostModifyCommandSysGroupOrgSpace {
      
        export class RequestParams{
          id?:number;poolRoleId?:number;
          constructor(){
            this.id=0;this.poolRoleId=0;
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
            * 工作组机构-删除-Model类库
            */
      export namespace IpostDeleteCommandSysGroupOrgSpace {
      
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
            * 工作组机构-主键查询-Model类库
            */
      export namespace IpostFindCommandSysGroupOrgByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface CommunicationMode {
        id: number;
        relationId: number;
        mode: string;
        modeName: string;
        value: string;
      }
      
      export interface Data {
        id: string;
        orgId: string;
        orgName: string;
        poolRoleId: string;
        poolRoleName: string;
        communicationMode: CommunicationMode[];
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
            * 工作组机构-添加-Model类库
            */
      export namespace IpostAddCommandSysGroupOrgSpace {
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: boolean;
      }
      }
            /**
            * 工作组机构-列表-Model类库
            */
      export namespace IpostFindCommandSysGroupOrgPageSpace {
      
      export interface List {
        id: string;
        orgId: string;
        orgName: string;
        poolRoleName: string;
        communication: string;
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
            * 工作组成员-删除-Model类库
            */
      export namespace IpostDeleteCommandSysGroupMemberSpace {
      
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
            * 工作组成员-添加-Model类库
            */
      export namespace IpostAddCommandSysGroupMemberSpace {
      
        export class RequestParams{
          groupId?:number;commandSysId?:number;userId?:number;name?:string;orgId?:number;orgName?:string;poolRoleId?:number;gender?:number;profilePicture?:string;addGroupOrg?:any;addUser?:any;communicationAddParams?:[];
          constructor(){
            this.groupId=0;this.commandSysId=0;this.userId=0;this.name="";this.orgId=0;this.orgName="";this.poolRoleId=0;this.gender=0;this.profilePicture="";this.addGroupOrg="";this.addUser="";this.communicationAddParams=[];
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
            * 工作组成员-主键查询-Model类库
            */
      export namespace IpostFindCommandSysGroupMemberByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface CommunicationMode {
        id: number;
        relationId: number;
        mode: string;
        modeName: string;
        value: string;
      }
      
      export interface Data {
        id: string;
        groupId: string;
        userId: string;
        name: string;
        orgId: string;
        orgName: string;
        poolRoleId: string;
        poolRoleName: string;
        communicationMode: CommunicationMode[];
        gender: number;
        profilePicture: string;
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
            * 工作组成员-批量添加-Model类库
            */
      export namespace IpostBatchAddCommandSysGroupMemberSpace {
      
      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: boolean;
      }
      }
            /**
            * 工作组成员-修改-Model类库
            */
      export namespace IpostModifyCommandSysGroupMemberSpace {
      
        export class RequestParams{
          id?:number;poolRoleId?:number;
          constructor(){
            this.id=0;this.poolRoleId=0;
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
            * 工作组成员-列表-Model类库
            */
      export namespace IpostFindCommandSysGroupMemberPageSpace {
      
      export interface List {
        id: string;
        groupId: string;
        userId: string;
        name: string;
        orgId: string;
        orgName: string;
        poolRoleId: string;
        poolRoleName: string;
        communication: string;
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
            * 工作组成员-添加人员提示true需要提示-Model类库
            */
      export namespace IpostAddCommandSysGroupMemberValidateSpace {
      
        export class RequestParams{
          groupId?:number;commandSysId?:number;userId?:number;name?:string;orgId?:number;orgName?:string;poolRoleId?:number;gender?:number;profilePicture?:string;addGroupOrg?:any;addUser?:any;communicationAddParams?:[];
          constructor(){
            this.groupId=0;this.commandSysId=0;this.userId=0;this.name="";this.orgId=0;this.orgName="";this.poolRoleId=0;this.gender=0;this.profilePicture="";this.addGroupOrg="";this.addUser="";this.communicationAddParams=[];
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
            * 指挥体系-启用、停用-Model类库
            */
      export namespace IpostModifyCommandSysSpace {
      
        export class RequestParams{
          ids?:[];usedState?:number;
          constructor(){
            this.ids=[];this.usedState=0;
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
            * 指挥体系-删除-Model类库
            */
      export namespace IpostDeleteCommandSysSpace {
      
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
            * 指挥体系表-列表-Model类库
            */
      export namespace IpostFindCommandSysPageSpace {
      
      export interface List {
        id: number;
        eventTypeCode: string;
        userCount: number;
        orgCount: number;
        usedState: number;
        eventTypeName: string;
        updatedAt: string;
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
            * 指挥体系表-创建副本-Model类库
            */
      export namespace IpostCommandSysCopySpace {
      
        export class RequestParams{
          eventTypeCode?:string;commandSysId?:number;
          constructor(){
            this.eventTypeCode="";this.commandSysId=0;
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
            * 指挥体系-添加-Model类库
            */
      export namespace IpostAddCommandSysSpace {
      
        export class RequestParams{
          eventTypeCode?:string;tempId?:number;
          constructor(){
            this.eventTypeCode="";this.tempId=0;
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
            * 角色管理-修改-Model类库
            */
      export namespace IpostModifyCommandSysUserPoolRoleSpace {
      
        export class RequestParams{
          id?:number;roleName?:string;roleLimitNum?:number;roleDesc?:string;eventType?:[];
          constructor(){
            this.id=0;this.roleName="";this.roleLimitNum=0;this.roleDesc="";this.eventType=[];
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
            * 角色管理-查询条件-事件类型-Model类库
            */
      export namespace IgetFindUsedEventTypeSpace {
      
        export class RequestParams{
          
          constructor(){
            
          }
        }
      
      export interface Data {
        eventTypeCode: string;
        eventTypeName: string;
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
            * 角色管理-分页列表-Model类库
            */
      export namespace IpostFindCommandSysUserPoolRolePageSpace {
      
        export class RequestParams{
          currentPage?:number;pageSize?:number;roleName?:string;eventType?:[];
          constructor(){
            this.currentPage=0;this.pageSize=0;this.roleName="";this.eventType=[];
          }
        }
      
      export interface EventTypeName {}
      
      export interface List {
        id: string;
        roleName: string;
        roleLimitNum: number;
        roleDesc: string;
        eventTypeName: EventTypeName[];
        updatedAt: string;
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
            * 角色管理-添加-Model类库
            */
      export namespace IpostAddCommandSysUserPoolRoleSpace {
      
        export class RequestParams{
          roleName?:string;roleLimitNum?:number;roleDesc?:string;eventType?:[];
          constructor(){
            this.roleName="";this.roleLimitNum=0;this.roleDesc="";this.eventType=[];
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
            * 角色管理-主键查询-Model类库
            */
      export namespace IpostFindCommandSysUserPoolRoleByIdSpace {
      
        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }
      
      export interface Event {
        eventTypeCode: string;
        eventTypeName: string;
      }
      
      export interface Data {
        id: string;
        roleName: string;
        roleLimitNum: number;
        roleDesc: string;
        events: Event[];
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
            * 角色管理-删除-Model类库
            */
      export namespace IpostDeleteCommandSysUserPoolRoleSpace {
      
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