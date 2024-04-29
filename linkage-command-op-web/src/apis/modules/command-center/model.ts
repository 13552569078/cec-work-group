/* eslint-disable @typescript-eslint/no-namespace */

/**
      * 策略指挥体系-快速创建会议校验-Model类库
      */
export namespace IpostCreateMeetingVerificationSpace {

  export class RequestParams{
    orgIds?:[];personIds?:[];
    constructor(){
      this.orgIds=[];this.personIds=[];
    }
  }

export interface CommunicationMode {
	id: number;
	relationId: number;
	mode: string;
	value: string;
}

export interface PoolRole {
	poolRoleId: number;
	poolRoleName: string;
	poolRoleDesc: string;
}

export interface UserDetailDTOList {
	id: number;
	strategyInfoId: number;
	commandId: number;
	groupId: number;
	orgId: number;
	orgName: string;
	userId: string;
	userName: string;
	mobile: string;
	roleIds: string;
	jobDescription: string;
	assembleStatus: number;
	isFocus: number;
	communicationMode: CommunicationMode[];
	poolRoles: PoolRole[];
	gender: string;
}

export interface Data {
  notInformationNum: number;
  totalNum: number;
	userDetailDTOList: UserDetailDTOList[];
	description: string;
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
      * 策略指挥体系组-待集结人数-Model类库
      */
 export namespace IpostStrategyCommandToBeAssembledSumSpace {

  export class RequestParams{
    strategyInfoId?:number;
    constructor(){
      this.strategyInfoId=0;
    }
  }

export interface CommunicationMode {
	id: number;
	relationId: number;
	mode: string;
	value: string;
}

export interface PoolRole {
	poolRoleId: number;
	poolRoleName: string;
	poolRoleDesc: string;
}

export interface UserDetailDTOList {
	id: number;
	strategyInfoId: number;
	commandId: number;
	groupId: number;
	orgId: number;
	orgName: string;
	userId: number;
	userName: string;
	mobile: string;
	roleIds: string;
	jobDescription: string;
	assembleStatus: number;
	isFocus: number;
	communicationMode: CommunicationMode[];
	poolRoles: PoolRole[];
	gender: number;
}

export interface Data {
	noAssembleUserCount: number;
	userDetailDTOList: UserDetailDTOList[];
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
      * 策略指挥体系组-统计数-Model类库
      */
  export namespace IpostStrategyCommandGroupAmountSpace {

    export class RequestParams{
      strategyInfoId?:number;commandId?:number;
      constructor(){
        this.strategyInfoId=0;this.commandId=0;
      }
    }

  export interface Data {
    orgCount: number|string;
    userCount: number|string;
    assembleUserCount: number|string;
    assembleOrgCount: number|string;
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
      * 策略指挥体系-快速创建任务和集结校验-Model类库
      */
export namespace IpostCreateTaskAndAssembleVerificationSpace {

  export interface OrgDetailDTOList {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: number;
    orgName: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
  }

  export interface CommunicationMode {
    id: number;
    relationId: number;
    mode: string;
    value: string;
  }

  export interface PoolRole {
    poolRoleId: number;
    poolRoleName: string;
    poolRoleDesc: string;
  }

  export interface UserDetailDTOList {
    id: number;
    strategyInfoId: number;
    commandId: number;
    groupId: number;
    orgId: number;
    orgName: string;
    userId: number;
    userName: string;
    mobile: string;
    roleIds: string;
    jobDescription: string;
    assembleStatus: number;
    isFocus: number;
    communicationMode: CommunicationMode[];
    poolRoles: PoolRole[];
    gender: number;
  }

  export interface Data {
    notSysNum: number;
    totalNum: number;
    orgDetailDTOList: OrgDetailDTOList[];
    userDetailDTOList: UserDetailDTOList[];
    description: string;
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
      * 策略指挥体系-快速创建通知校验-Model类库
      */
export namespace IpostCreateNoticeVerificationSpace {

  export class RequestParams{
    orgIds?:[];personIds?:[];
    constructor(){
      this.orgIds=[];this.personIds=[];
    }
  }

export interface CommunicationMode {
	id: number;
	relationId: number;
	mode: string;
	value: string;
}

export interface PoolRole {
	poolRoleId: number;
	poolRoleName: string;
	poolRoleDesc: string;
}

export interface UserDetailDTOList {
	id: number;
	strategyInfoId: number;
	commandId: number;
	groupId: number;
	orgId: number;
	orgName: string;
	userId: number;
	userName: string;
	mobile: string;
	roleIds: string;
	jobDescription: string;
	assembleStatus: number;
	isFocus: number;
	communicationMode: CommunicationMode[];
	poolRoles: PoolRole[];
	gender: number;
}

export interface Data {
  notInformationNum: number;
  totalNum: number;
	userDetailDTOList: UserDetailDTOList[];
	description: string;
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
      * 策略指挥体系人员-删除-Model类库
      */
       export namespace IpostDeleteStrategyCommandUserSpace {

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
            * 策略指挥体系人员-添加-Model类库
            */
      export namespace IpostAddStrategyCommandUserSpace {

        export class RequestParams{
          commandId?:number;groupId?:number;orgId?:number;orgName?:string;userId?:number;userName?:string;mobile?:string;communicationMode?:[];roleIds?:[];gender?:number;profilePicture?:string;addGroupOrg?:any;addUser?:any;jobDescription?:string;assembleStatus?:number;
          constructor(){
            this.commandId=0;this.groupId=0;this.orgId=0;this.orgName="";this.userId=0;this.userName="";this.mobile="";this.communicationMode=[];this.roleIds=[];this.gender=0;this.profilePicture="";this.addGroupOrg="";this.addUser="";this.jobDescription="";this.assembleStatus=0;
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
            * 策略指挥体系人员-是否关注-Model类库
            */
      export namespace IpostModifyStrategyCommandUserIsFocusSpace {

        export class RequestParams{
          id?:number;isFocus?:number;
          constructor(){
            this.id=0;this.isFocus=0;
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
            * 策略指挥体系人员-修改岗位职责-Model类库
            */
      export namespace IpostModifyStrategyCommandUserRoleSpace {

        export class RequestParams{
          id?:number;roleIds?:string;
          constructor(){
            this.id=0;this.roleIds="";
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
            * 策略指挥体系人员-添加true需要提示-Model类库
            */
      export namespace IpostAddStrategyCommandUserValidateSpace {

        export class RequestParams{
          commandId?:number;groupId?:number;orgId?:number;orgName?:string;userId?:number;userName?:string;mobile?:string;communicationMode?:[];roleIds?:[];gender?:number;profilePicture?:string;addGroupOrg?:any;addUser?:any;jobDescription?:string;assembleStatus?:number;
          constructor(){
            this.commandId=0;this.groupId=0;this.orgId=0;this.orgName="";this.userId=0;this.userName="";this.mobile="";this.communicationMode=[];this.roleIds=[];this.gender=0;this.profilePicture="";this.addGroupOrg="";this.addUser="";this.jobDescription="";this.assembleStatus=0;
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
            * 策略指挥体系人员-批量添加-Model类库
            */
      export namespace IpostBatchAddStrategyCommandUserSpace {

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: boolean;
      }
      }
            /**
            * 策略指挥体系人员-列表-Model类库
            */
      export namespace IpostFindStrategyCommandUserPageSpace {

      export interface CommunicationMode {
        id: number;
        relationId: number;
        mode: string;
        value: string;
      }

      export interface PoolRole {
        poolRoleId: number;
        poolRoleName: string;
        poolRoleDesc: string;
      }

      export interface List {
        id: number;
        strategyInfoId: number;
        commandId: number;
        groupId: number;
        orgId: number;
        orgName: string;
        userId: number;
        userName: string;
        mobile: string;
        roleIds: string;
        jobDescription: string;
        assembleStatus: number;
        isFocus: number;
        communicationMode: CommunicationMode[];
        poolRoles: PoolRole[];
        type?: string;
        disabled?: boolean;
        temporaryPersonnel?: number;
        memberType: number;
        expertId: string;
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
            * 策略指挥体系人员-主键查询-Model类库
            */
      export namespace IpostFindStrategyCommandUserByIdSpace {

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
          value: string;
        }
        export interface PoolRoles {
          poolRoleId: string;
          poolRoleDesc: string;
          poolRoleName: string;
        }

      export interface Data {
        id: number;
        strategyInfoId: number;
        commandId: number;
        groupId: number;
        orgId: number;
        orgName: string;
        userId: number;
        userName: string;
        mobile: string;
        roleIds: string;
        jobDescription: string;
        assembleStatus: number;
        isFocus: number;
        profilePicture:string;
        tempUser:number;
        gender:string;
        temporaryPersonnel:number;
        poolRoles:PoolRoles[]
        communicationMode: CommunicationMode[]
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
            * 策略指挥体系人员-修改-Model类库
            */
      export namespace IpostModifyStrategyCommandUserSpace {

        export class RequestParams{
          id?:number;strategyInfoId?:number;commandId?:number;groupId?:number;orgId?:number;orgName?:string;userId?:number;userName?:string;mobile?:string;roleIds?:string;jobDescription?:string;assembleStatus?:number;
          constructor(){
            this.id=0;this.strategyInfoId=0;this.commandId=0;this.groupId=0;this.orgId=0;this.orgName="";this.userId=0;this.userName="";this.mobile="";this.roleIds="";this.jobDescription="";this.assembleStatus=0;
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
            * 策略指挥体系机构-修改岗位职责-Model类库
            */
      export namespace IpostModifyStrategyCommandOrgRoleSpace {

        export class RequestParams{
          id?:number;roleIds?:string;
          constructor(){
            this.id=0;this.roleIds="";
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
            * 策略指挥体系机构-修改-Model类库
            */
      export namespace IpostModifyStrategyCommandOrgSpace {

        export class RequestParams{
          id?:number;strategyInfoId?:number;commandId?:number;groupId?:number;orgId?:number;orgName?:string;mobile?:string;roleIds?:string;jobDescription?:string;
          constructor(){
            this.id=0;this.strategyInfoId=0;this.commandId=0;this.groupId=0;this.orgId=0;this.orgName="";this.mobile="";this.roleIds="";this.jobDescription="";
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
            * 策略指挥体系机构-列表-Model类库
            */
      export namespace IpostFindStrategyCommandOrgPageSpace {

      export interface CommunicationMode {
        id: number;
        relationId: number;
        mode: string;
        value: string;
      }

      export interface PoolRole {
        poolRoleId: number;
        poolRoleName: string;
        poolRoleDesc: string;
      }

      export interface List {
        id: number;
        strategyInfoId: number;
        commandId: number;
        groupId: number;
        orgId: number;
        orgName: string;
        mobile: string;
        roleIds: string;
        jobDescription: string;
        communicationMode: CommunicationMode[];
        poolRoles: PoolRole[];
        disposalNum: number;
        siteNum: number;
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
            * 策略指挥体系机构-主键查询-Model类库
            */
      export namespace IpostFindStrategyCommandOrgByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        strategyInfoId: number;
        commandId: number;
        groupId: number;
        orgId: number;
        orgName: string;
        mobile: string;
        roleIds: string;
        jobDescription: string;
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
            * 策略指挥体系机构-添加-Model类库
            */
      export namespace IpostAddStrategyCommandOrgSpace {

        export class RequestParams{
          strategyInfoId?:number;commandId?:number;groupId?:number;orgs?:[];
          constructor(){
            this.strategyInfoId=0;this.commandId=0;this.groupId=0;this.orgs=[];
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
            * 策略指挥体系机构-删除-Model类库
            */
      export namespace IpostDeleteStrategyCommandOrgSpace {

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
            * 策略指挥体系组-删除-Model类库
            */
      export namespace IpostDeleteStrategyCommandGroupSpace {

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
            * 策略指挥体系组-添加-Model类库
            */
      export namespace IpostAddStrategyCommandGroupSpace {

        export class RequestParams{
          commandId?:number;parentGroupId?:number;groupName?:string;groupDesc?:string;id:string;
          constructor(){
            this.commandId=0;this.parentGroupId=0;this.groupName="";this.groupDesc="";this.id="";
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
            * 策略指挥体系组-更新原指挥体系-Model类库
            */
      export namespace IpostUpdateOriginalCommanderSpace {

        export class RequestParams{
          commandId?:number;newCommandName?:string;
          constructor(){
            this.commandId=0;this.newCommandName="";
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
            * 策略指挥体系组-保存为新的指挥体系-Model类库
            */
      export namespace IpostSaveNewCommanderSpace {

        export class RequestParams{
          commandId?:number;newCommandName?:string;
          constructor(){
            this.commandId=0;this.newCommandName="";
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
            * 策略指挥体系组-修改职责说明-Model类库
            */
      export namespace IpostModifyJobDescriptionCommandGroupSpace {

        export class RequestParams{
          id?:number;groupDesc?:string;
          constructor(){
            this.id=0;this.groupDesc="";
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
            * 策略指挥体系组-重命名-Model类库
            */
      export namespace IpostModifyStrategyCommandGroupSpace {

        export class RequestParams{
          id?:number;parentGroupId?:number;groupName?:string;groupDesc?:string;
          constructor(){
            this.id=0;this.parentGroupId=0;this.groupName="";this.groupDesc="";
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
            * 策略指挥体系组-升级或者降级-Model类库
            */
      export namespace IpostUpGradeOrDemoteCommandGroupSpace {

        export class RequestParams{
          id?:number;parentGroupId?:number;
          constructor(){
            this.id=0;this.parentGroupId=0;
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
            * 策略指挥体系组-主键查询-Model类库
            */
      export namespace IpostFindStrategyCommandGroupByIdSpace {

        export class RequestParams{
          id?:number;
          constructor(){
            this.id=0;
          }
        }

      export interface Data {
        id: number;
        strategyInfoId: number;
        commandId: number;
        commandName: string;
        parentGroupId: number;
        groupId: number;
        groupName: string;
        groupDesc: string;
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
            * 策略指挥体系组-事件id查询指挥体系树-Model类库
            */
      export namespace IpostFindCommandGroupTreeByEventIdSpace {

        export class RequestParams{
          eventId?:number;
          constructor(){
            this.eventId=0;
          }
        }

      export interface Children {}

      export interface Data {
        children: Children[];
        id: number;
        strategyInfoId: number;
        commandId: number;
        commandName: string;
        parentGroupId: number;
        groupId: number;
        groupName: string;
        groupDesc: string;
        userCount: number;
        orgCount: number;
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
            * 策略指挥体系组-列表-Model类库
            */
      export namespace IpostFindStrategyCommandGroupPageSpace {

        export class RequestParams{
          currentPage?:number;pageSize?:number;strategyInfoId?:number;commandId?:number;commandName?:string;groupName?:string;
          constructor(){
            this.currentPage=0;this.pageSize=0;this.strategyInfoId=0;this.commandId=0;this.commandName="";this.groupName="";
          }
        }

      export interface Data {
        id: number;
        strategyInfoId: number;
        commandId: number;
        commandName: string;
        parentGroupId: number;
        groupId: number;
        groupName: string;
        groupDesc: string;
      }

      export interface Model {
        code: string;
        desc: string;
        tips: string;
        httpStatusCode: number;
        data: Data[];
      }
      }


// -------------------------------
/**
* 策略指挥体系组-树-Model类库
*/
export namespace IpostFindStrategyCommandGroupTreeSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;strategyInfoId?:string;commandId?:number;commandName?:string;groupName?:string;
    constructor(){
      this.currentPage=0;this.pageSize=0;this.strategyInfoId='';this.commandId=0;this.commandName="";this.groupName="";
    }
  }

export interface Children {}

export interface Data {
  children: Children[];
  id: number;
  strategyInfoId: number;
  commandId: number;
  commandName: string;
  parentGroupId: number;
  groupId: number;
  groupName: string;
  groupDesc: string;
  userCount: number;
  orgCount: number;
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
* 策略指挥体系人员-批量删除-Model类库
*/
export namespace IpostBatchDeleteStrategyCommandUserSpace {

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
* 策略指挥体系人员-批量添加-Model类库
*/
export namespace IpostBatchAddStrategyCommandUserSpace {

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
    poolRoleId: string;
    poolRoleIds: string[];
    poolRoles: {
      poolRoleDesc: string;
      poolRoleId: string;
      poolRoleName: string;
    }[];
    roleDesc: string;
    communication: string;
    jobDescription: string;
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
    * 策略指挥体系机构-批量删除-Model类库
    */
export namespace IpostBatchDeleteStrategyCommandOrgSpace {

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
 * 指挥中心集结点表-列表-Model类库
 */
export namespace IpostFindCommandCenterAssemblePointListSpace {

  export class RequestParams{
    eventInfoId?:number;
    constructor(){
      this.eventInfoId=0;
    }
  }

  export interface Data {
    id: number|string;
    eventInfoId: number;
    longitude: string;
    latitude: string;
    assembleAddress: string;
    assembleTitle: string;
    orgCount: number;
    userCount: number;
    assembleUserCount: number;
    assembleOrgCount: number;
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
 * 指挥中心集结表-添加-Model类库
 */
export namespace IpostAddCommandCenterAssembleSpace {

  export class RequestParams{
    eventInfoId?:string;assemblePointId?:number|string;longitude?:string;latitude?:string;assembleAddress?:string;assembleTitle?:string;personIds?:any[];orgIds?:any[];assembleRequire?:string;limitNum?:number;deadlineDate?:number|string;deadlineType?:string;fixed?:number;appointAt?:string;
    constructor(){
      this.eventInfoId='';this.assemblePointId='';this.longitude="";this.latitude="";this.assembleAddress="";this.assembleTitle="";this.personIds=[];this.orgIds=[];this.assembleRequire="";this.limitNum=0;this.deadlineDate="";this.deadlineType="";this.fixed=0;this.appointAt="";
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

