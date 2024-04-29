/**
 * 事件集结统计-Model类库
 */
export namespace IpostEventAssembleStatSpace {

  export class RequestParams{
    eventInfoId?:number;
    constructor(){
      this.eventInfoId=0;
    }
  }

  export interface Data {
    assemblePointNum: number;
    assembleNum: number;
    assembling: number;
    assembled: number;
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
 * 指挥中心集结点表-添加-Model类库
 */
export namespace IpostAddCommandCenterAssemblePointSpace {

  export class RequestParams{
    eventInfoId:string;longitude?:string;latitude?:string;assembleAddress?:string;assembleTitle?:string;
    constructor(){
      this.eventInfoId="";this.longitude="";this.latitude="";this.assembleAddress="";this.assembleTitle="";
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
 * 指挥中心集结点表-修改-Model类库
 */
export namespace IpostModifyCommandCenterAssemblePointSpace {

  export class RequestParams{
    id?:number;assembleTitle?:string;
    constructor(){
      this.id=0;this.assembleTitle="";
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
 * 指挥中心集结点表-删除-Model类库
 */
export namespace IpostDeleteCommandCenterAssemblePointSpace {

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
 * 指挥中心集结点表-列表-Model类库
 */
export namespace IpostFindCommandCenterAssemblePointListSpace {

  export class RequestParams{
    eventInfoId?:number;
    constructor(){
      this.eventInfoId=0;
    }
  }


  export interface CommunicationMode {
    id: number;
    relationId: string;
    mode: string;
    value: string;
  }

  export interface PoolRole {
    poolRoleId: number;
    poolRoleName: string;
    poolRoleDesc: string;
  }

  export interface AssemblingUser {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: string;
    orgName: string;
    userId: string;
    userName: string;
    profilePicture: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
    assembleStatus: number;
    isFocus: number;
    communicationMode: CommunicationMode[];
    poolRoles: PoolRole[];
    gender: string;
    createdUserName: string;
    online: number;
    rowIndex?: number;
    temporaryPersonnel?:number|string;
  }

  export interface CommunicationMode {
    id: number;
    relationId: string;
    mode: string;
    value: string;
  }

  export interface PoolRole {
    poolRoleId: number;
    poolRoleName: string;
    poolRoleDesc: string;
  }

  export interface AssembledUser {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: string;
    orgName: string;
    userId: string;
    userName: string;
    profilePicture: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
    assembleStatus: number;
    isFocus: number;
    communicationMode: CommunicationMode[];
    poolRoles: PoolRole[];
    gender: string;
    createdUserName: string;
    online: number;
    rowIndex?: number;
    temporaryPersonnel?:number|string;
  }

  export interface Data {
    id: string;
    eventInfoId: number;
    longitude: string;
    latitude: string;
    assembleAddress: string;
    assembleTitle: string;
    orgCount: number;
    userCount: number;
    assembleUserCount: number;
    assembleOrgCount: number;
    expand?: boolean;
    instructList?: [];
    assemblingUsers: AssemblingUser[];
    assembledUsers: AssembledUser[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}


export namespace IpostEventAssembleUserStatDetailSpace {

  export class RequestParams{
    eventInfoId?:number;
    constructor(){
      this.eventInfoId=0;
    }
  }


  export interface CommunicationMode {
    id: number;
    relationId: string;
    mode: string;
    value: string;
  }

  export interface PoolRole {
    poolRoleId: number;
    poolRoleName: string;
    poolRoleDesc: string;
  }

  export interface AssemblingUser {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: string;
    orgName: string;
    userId: string;
    userName: string;
    profilePicture: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
    assembleStatus: number;
    isFocus: number;
    communicationMode: CommunicationMode[];
    poolRoles: PoolRole[];
    gender: string;
    createdUserName: string;
    online: number;
    rowIndex?: number;
    temporaryPersonnel?:number|string;
  }

  export interface CommunicationMode {
    id: number;
    relationId: string;
    mode: string;
    value: string;
  }

  export interface PoolRole {
    poolRoleId: number;
    poolRoleName: string;
    poolRoleDesc: string;
  }

  export interface AssembledUser {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: string;
    orgName: string;
    userId: string;
    userName: string;
    profilePicture: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
    assembleStatus: number;
    isFocus: number;
    communicationMode: CommunicationMode[];
    poolRoles: PoolRole[];
    gender: string;
    createdUserName: string;
    online: number;
    rowIndex?: number;
    temporaryPersonnel?:number|string;
  }

  export interface Data {
    assemblingUsers: AssemblingUser[];
    assembledUsers: AssembledUser[];
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
 * 指挥中心集结指令表-列表-Model类库
 */
export namespace IpostFindCommandCenterAssemblePageSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;eventInfoId?:number|string;assemblePointId?:number|string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.eventInfoId="";this.assemblePointId=0;
    }
  }

  export interface PersonId {}

  export interface OrgId {}

  export interface OrgPsersonParam {
    orgName: string;
    orgId: number;
    userId: number;
    userName: string;
    assembleStatus: number;
    effective?: number;
  }

  export interface List {
    id: number;
    eventInfoId: number;
    personOrOrg: string;
    assembleRequire: string;
    deadlineNum: number;
    deadlineType: string;
    fixed: number;
    appointAt: string;
    personIds: PersonId[];
    orgIds: OrgId[];
    orgPsersonParams: OrgPsersonParam[];
    assembleTitle: string;
    assembleAddress: string;
    assembleTimeLimit: string;
    pubdate: string;
    orgNum: number;
    userNum: number;
    status: number;
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
 * 指挥中心集结表-撤销指令-Model类库
 */
export namespace IpostCancelCommandCenterAssembleSpace {

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
 * 指挥中心集结表-判断是否已经有集结点-Model类库
 */
export namespace IpostWhetherAssemblePointSpace {

  export class RequestParams{
    eventInfoId?:number;
    constructor(){
      this.eventInfoId=0;
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
 * 指挥中心集结表-添加-Model类库
 */
export namespace IpostAddCommandCenterAssembleSpace {

  export class RequestParams{
    eventInfoId?:number;assemblePointId?:number|string;longitude?:string;latitude?:string;assembleAddress?:string;assembleTitle?:string;personIds?:any[];orgIds?:any[];assembleRequire?:string;limitNum?:number;deadlineDate?:number|string;deadlineType?:string;fixed?:number;appointAt?:string;
    constructor(){
      this.eventInfoId=0;this.assemblePointId='';this.longitude="";this.latitude="";this.assembleAddress="";this.assembleTitle="";this.personIds=[];this.orgIds=[];this.assembleRequire="";this.limitNum=0;this.deadlineDate="";this.deadlineType="";this.fixed=0;this.appointAt="";
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
 * 集结人员督办-Model类库
 */
export namespace IpostAssembleSuperviseSpace {

  export class RequestParams{
    eventInfoId?:number|string;messageTitle?:string;messageContent?:string;receivers?:any[];receiveOrgs?:[];receiveGroups?:[];attaches?:[];sendWay?:string[];
    constructor(){
      this.eventInfoId='';this.messageTitle="";this.messageContent="";this.receivers=[];this.receiveOrgs=[];this.receiveGroups=[];this.attaches=[];this.sendWay=[];
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
 * 用户位置-一张图现场用户详情-Model类库
 */
export namespace IpostGetEventPersonDetailSpace {
  export class RequestParams {
    userId?: string;
    eventId?: string;
    constructor() {
      this.userId = "";
      this.eventId = "";
    }
  }
  export interface PersonProps {
    userId?: string;
    userName?:string;
    orgId:string;
    mobile?: string;
  }

  export interface Group {}

  export interface JobDesc {
    groupName: string;
    jobDesc: string;
  }

  export interface Assemble {
    groupName: string;
    assembleStatus: number;
    assembleTarget: string;
  }

  export interface Role {}

  export interface Role {
    groupName: string;
    role: Role[];
  }

  export interface Communication {
    mode: string;
    value: string;
  }

  export interface Data {
    orgName: string;
    position: string;
    positionUpdateTime: string;
    groups: Group[];
    jobDescs: JobDesc[];
    assembles: Assemble[];
    roles: Role[];
    communications: Communication[];
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}
