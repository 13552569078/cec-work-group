/* eslint-disable @typescript-eslint/no-namespace */

export namespace IpostTaskTypeTreeSpace {
  export interface List {
    id: string;
    taskTypeName: string;
    state: number;
    systemTask: number;
    sort: number;
    createdUserName: string;
    isCreateUser: number
    children: List[]
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: List[];
  }
}

/**
* 任务表-添加-Model类库
*/
export namespace IpostAddTaskInfoSpace {

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: string;
  }
}

/**
 * 任务表-根据关联事件及状态查询任务列表
 */
export namespace IpostFindListByEventIdSpace {
  export class RequestParams {
    eventId?: string; taskState?: number[]
    constructor() {
      this.eventId = ''; this.taskState = []
    }
  }

  export interface TaskRemind {
    reminderTime: string;
    reminderType: string[];
    canDel?: number
  }

  export interface CorrelatedEvent {
    eventName: string;
    eventCode: string;
  }

  export interface TaskLabel {
    label: string;
    addUserName: string;
    addUserId: number;
    canDel: number;
  }

  export interface TaskRemind {
    reminderTime: string;
    reminderType: string[];
  }

  export interface CorrelatedEvent {
    eventName: string;
    eventCode: string;
  }

  export interface TaskLabel {
    label: string;
    addUserName: string;
    addUserId: number;
    canDel: number;
  }

  export interface TaskRemind { }

  export interface TaskLabel { }

  export interface SubTaskDTO {
    id: string
  }

  export interface TaskUserInfoDetailDTO { }

  export interface TaskAttachmentDetailDTO {
    reminderTime: string
  }

  export interface SubTaskDTO {
    id: string;
    parentId: number;
    taskLevel: number;
    taskState: number;
    taskTitle: string;
    taskTypeId: number;
    taskTypeName: string;
    endAt: string;
    finishAt: string;
    timeout: number;
    urgencyDegree: number;
    taskRemind: TaskRemind[];
    taskDesc: string;
    taskLabel: TaskLabel[];
    taskFallback: number;
    recycle: number;
    createdUserPhone: string;
    parentTaskName: string;
    subTaskDTOS: SubTaskDTO[];
    taskUserInfoDetailDTOS: TaskUserInfoDetailDTO[];
    taskAttachmentDetailDTOS: TaskAttachmentDetailDTO[];
    createdAt: string;
    updatedAt: string;
    createdUserName: string;
    updatedUserName: string;
    creator: number;

  }

  export interface TaskUserInfoDetailDTO {
    id: number;
    taskInfoId: number;
    userName: string;
    userId: string;
    taskState: number;
    finishTime: string;
  }

  export interface TaskAttachmentDetailDTO {
    id: number;
    taskInfoId: number;
    taskAttachmentName: string;
    taskFileName: string;
    taskAttachmentUrl: string;
    createdUserName: string;
    canDel: number;
    fileId: string
  }

  export interface SubTaskDTO {
    id: string;
    parentId: number;
    taskLevel: number;
    taskState: number;
    taskTitle: string;
    taskTypeId: number;
    taskTypeName: string;
    endAt: string;
    finishAt: string;
    timeout: number;
    urgencyDegree: number;
    taskRemind: TaskRemind[];
    taskDesc: string;
    correlatedEvents: CorrelatedEvent;
    taskLabel: TaskLabel[];
    taskFallback: number;
    recycle: number;
    createdUserPhone: string;
    parentTaskName: string;
    subTaskDTOS: SubTaskDTO[];
    taskUserInfoDetailDTOS: TaskUserInfoDetailDTO[];
    taskAttachmentDetailDTOS: TaskAttachmentDetailDTO[];
    createdAt: string;
    updatedAt: string;
    createdUserName: string;
    updatedUserName: string;
  }

  export interface TaskUserInfoDetailDTO {
    id: number;
    taskInfoId: number;
    userName: string;
    userId: string;
    taskState: number;
    finishTime: string;
    timeout: number
  }

  export interface TaskAttachmentDetailDTO {
    id: number;
    taskInfoId: number;
    taskAttachmentName: string;
    taskFileName: string;
    taskAttachmentUrl: string;
    createdUserName: string;
  }

  export interface Data {
    id?: string;
    parentId?: string;
    taskLevel: number;
    taskState: number;
    taskTitle: string;
    taskTypeId: number;
    taskTypeName: string;
    endAt: string;
    finishAt: string;
    timeout: number;
    urgencyDegree: number;
    taskRemind: TaskRemind[];
    taskDesc: string;
    correlatedEvents: CorrelatedEvent;
    taskLabel: TaskLabel[];
    taskFallback: number;
    recycle: number;
    createdUserPhone: string;
    parentTaskName: string;
    subTaskDTOS: SubTaskDTO[];
    taskUserInfoDetailDTOList: TaskUserInfoDetailDTO[];
    taskAttachmentDetailDTOS: TaskAttachmentDetailDTO[];
    createdAt: string;
    updatedAt: string;
    createdUserName: string;
    updatedUserName: string;
    creator: number;
    taskTypeConfigDetailDTO: any;
    parentEndAt: string
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: {
      list: Data[]
    };
  }
}


/**
 * 任务表-主键查询-Model类库
 */
export namespace IpostFindTaskInfoByIdSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface TaskRemind {
    reminderTime: string;
    reminderType: string[];
    canDel?: number
  }

  export interface CorrelatedEvent {
    eventName: string;
    eventCode: string;
  }

  export interface TaskLabel {
    label: string;
    addUserName: string;
    addUserId: number;
    canDel: number;
  }

  export interface TaskRemind {
    reminderTime: string;
    reminderType: string[];
  }

  export interface CorrelatedEvent {
    eventName: string;
    eventCode: string;
  }

  export interface TaskLabel {
    label: string;
    addUserName: string;
    addUserId: number;
    canDel: number;
  }

  export interface TaskRemind { }

  export interface TaskLabel { }

  export interface SubTaskDTO {
    id: string
  }

  export interface TaskUserInfoDetailDTO { }

  export interface TaskAttachmentDetailDTO {
    reminderTime: string
  }

  export interface SubTaskDTO {
    id: string;
    parentId: number;
    taskLevel: number;
    taskState: number;
    taskTitle: string;
    taskTypeId: number;
    taskTypeName: string;
    endAt: string;
    finishAt: string;
    timeout: number;
    urgencyDegree: number;
    taskRemind: TaskRemind[];
    taskDesc: string;
    taskLabel: TaskLabel[];
    taskFallback: number;
    recycle: number;
    createdUserPhone: string;
    parentTaskName: string;
    subTaskDTOS: SubTaskDTO[];
    taskUserInfoDetailDTOS: TaskUserInfoDetailDTO[];
    taskAttachmentDetailDTOS: TaskAttachmentDetailDTO[];
    createdAt: string;
    updatedAt: string;
    createdUserName: string;
    updatedUserName: string;
    creator: number;

  }

  export interface TaskUserInfoDetailDTO {
    id: number;
    taskInfoId: number;
    userName: string;
    userId: string;
    taskState: number;
    finishTime: string;
  }

  export interface TaskAttachmentDetailDTO {
    id: number;
    taskInfoId: number;
    taskAttachmentName: string;
    taskFileName: string;
    taskAttachmentUrl: string;
    createdUserName: string;
    canDel: number;
    createdAt: string;
    fileId: string
  }

  export interface SubTaskDTO {
    id: string;
    parentId: number;
    taskLevel: number;
    taskState: number;
    taskTitle: string;
    taskTypeId: number;
    taskTypeName: string;
    endAt: string;
    finishAt: string;
    timeout: number;
    urgencyDegree: number;
    taskRemind: TaskRemind[];
    taskDesc: string;
    correlatedEvents: CorrelatedEvent;
    taskLabel: TaskLabel[];
    taskFallback: number;
    recycle: number;
    createdUserPhone: string;
    parentTaskName: string;
    subTaskDTOS: SubTaskDTO[];
    taskUserInfoDetailDTOS: TaskUserInfoDetailDTO[];
    taskAttachmentDetailDTOS: TaskAttachmentDetailDTO[];
    createdAt: string;
    updatedAt: string;
    createdUserName: string;
    updatedUserName: string;
  }

  export interface TaskUserInfoDetailDTO {
    id: number;
    taskInfoId: number;
    userName: string;
    userId: string;
    taskState: number;
    finishTime: string;
    timeout: number
  }

  export interface TaskAttachmentDetailDTO {
    id: number;
    taskInfoId: number;
    taskAttachmentName: string;
    taskFileName: string;
    taskAttachmentUrl: string;
    createdUserName: string;
  }

  export interface Data {
    id: string;
    parentId: string;
    taskLevel: number;
    taskState: number;
    taskTitle: string;
    taskTypeId: number;
    taskTypeName: string;
    endAt: string;
    finishAt: string;
    timeout: number;
    urgencyDegree: number;
    taskRemind: TaskRemind[];
    taskDesc: string;
    correlatedEvents: CorrelatedEvent;
    taskLabel: TaskLabel[];
    taskFallback: number;
    recycle: number;
    createdUserPhone: string;
    parentTaskName: string;
    subTaskDTOS: SubTaskDTO[];
    taskUserInfoDetailDTOS: TaskUserInfoDetailDTO[];
    taskAttachmentDetailDTOS: TaskAttachmentDetailDTO[];
    createdAt: string;
    updatedAt: string;
    createdUserName: string;
    updatedUserName: string;
    creator: number;
    taskTypeConfigDetailDTO: any;
    parentEndAt: string
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
 * 任务动态及回复表-列表-Model类库
 */
export namespace IpostFindTaskDynamicReplyPageSpace {

  export class RequestParams {
    dynamicType?: string;sort?: number; currentPage?: number; pageSize?: number; taskInfoId?: string; certTaskDynamicReplyConfigId?: number; userId?: string; userMobile?: string; userName?: string; msgType?: string; attachment?: number; attachmentUrl?: string; content?: string;
    constructor() {
      this.dynamicType = ''; this.sort = 0; this.currentPage = 0; this.pageSize = 0; this.taskInfoId = ''; this.certTaskDynamicReplyConfigId = 0; this.userId = ""; this.userMobile = ""; this.userName = ""; this.msgType = ''; this.attachment = 0; this.attachmentUrl = ""; this.content = "";
    }
  }

  export interface List {
    id: number;
    taskInfoId: number;
    certTaskDynamicReplyConfigId: number;
    userId: string;
    userMobile: string;
    userName: string;
    msgType: number;
    attachment: number;
    attachmentUrl: string;
    content: string;
    achmentName?: string;
    createdAt?: string;
    attachmentName: string;
    fileId: string
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


export namespace IpostFindTaskDynamicReplyPageByEventIdSpace {
  export class RequestParams {
    eventId: string; pageSize?: string; currentPage?: number;dynamicType?: string;
    constructor() {
      this.eventId = ''; this.pageSize = ''; this.currentPage = 0;this.dynamicType = '';
    }
  }
  export interface List {
    id: string,
    taskInfoId: string,
    certTaskDynamicReplyConfigId: string,
    userId: string,
    userMobile: string,
    userName: string,
    msgType: string,
    attachment: string,
    attachmentUrl: string,
    attachmentName: string,
    content: string,
    fileId: string,
    createdAt: string,
    taskTitle: string
  }
  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: {
      list: List[],
      pageSize: number
      totalPage: number
      totalRow: number,
      currentPage: number,
      hasNextPage: Boolean,
      hasPreviousPage: Boolean,
      isFirstPage: Boolean,
      isLastPage: Boolean
    };
  }
}

/**
 * 任务类型表-根据模块名称查询任务类型-Model类库
 */
export namespace IgetFindTaskTypeByNameSpace {

  export class RequestParams {
    taskTypeName?: string;
    constructor() {
      this.taskTypeName = "";
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
 * 任务类型配置表-主键查询-Model类库
 */
export namespace IpostFindTaskTypeConfigByIdSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface AllJudgment {
    manualCompletion: number;
    automaticAllDetermination: number;
    automaticSingleDetermination: number;
  }

  export interface UserJudgment {
    manualCompletion: number;
    automaticDetermination: number;
  }
  export interface OrganJudgment {
    wholeCompletion: number;
    customCompletion: number;
    customNumber: string
  }

  export interface JudgmentConfig {
    allJudgment: AllJudgment;
    userJudgment: UserJudgment;
    organJudgment: OrganJudgment;
  }

  export interface ExtendedInformationConfig {
    degreeUrgency: number;
    taskReminder: number;
    taskTag: number;
    taskAttachment: number;
  }

  export interface AssociatedEvent {
    eventName: string;
    eventCode: string;
  }

  export interface Data {
    id?: number;
    taskTypeName?: string;
    taskTypeId?: number;
    state: number;
    extendedInformationConfig?: ExtendedInformationConfig;
    taskFallback: number;
    isAssociatedEvent: number;
    externalChain: number;
    sort?: number;
    sysUserNotifyType?: string[];
    tempUserNotify?: number;
    isRepeat: number,
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}
