/* eslint-disable @typescript-eslint/no-namespace */

/**
      * 第一版有:历史会议列表:已完成的会议-Model类库
      */
export namespace IpostFindHistoryListMeetingSpace {

  export class RequestParams {
    loginUserId?: string; keyWorld?: string; roleType?: string; status?: number[]; startDate?: string[]
    constructor() {
      this.loginUserId = ''; this.keyWorld = ''; this.roleType = ''; this.status = []; this.startDate = []
    }
  }

  export interface AcceptUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface RejectUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface UnAnswerUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface Data {
    id: string;
    title: string;
    status: number;
    confirmCode: number;
    attribute: number;
    startTime: string;
    endTime: string;
    isHead: number;
    acceptNum: number;
    acceptUsers: AcceptUser[];
    rejectNum: number;
    rejectUsers: RejectUser[];
    unAnswerNum: number;
    unAnswerUsers: UnAnswerUser[];
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
            * 第一版有:会议列表:进行中和未开始的会议-Model类库
            */
export namespace IpostFindListMeetingSpace {

  export class RequestParams {
    loginUserId?: string; keyWorld?: string; roleType?: string; status?: number[];
    constructor() {
      this.loginUserId = ''; this.keyWorld = ''; this.roleType = ''; this.status = []
    }
  }

  export interface AcceptUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface RejectUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface UnAnswerUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface Data {
    id: string;
    title: string;
    status: number;
    confirmCode: number;
    attribute: number;
    startTime: string;
    endTime: string;
    isHead: number;
    acceptNum: number;
    acceptUsers: AcceptUser[];
    rejectNum: number;
    rejectUsers: RejectUser[];
    unAnswerNum: number;
    unAnswerUsers: UnAnswerUser[];
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
            * 第一版有:添加会议-Model类库
            */
export namespace IpostAddMeetingMeetingSpace {

  export class RequestParams {
    loginUserId?: string; attribute?: number; title?: string; description?: string; startTime?: string; endTime?: string; password?: string; meetingType?: number; remindBefore?: number; remindTypeList?: []; eventOutCode?: string; users?: []; attachmentParams?: []; monitorParams?: [];
    constructor() {
      this.loginUserId = ''; this.attribute = 0; this.title = ''; this.description = ''; this.startTime = ''; this.endTime = ''; this.password = ''; this.meetingType = 0; this.remindBefore = 0; this.remindTypeList = []; this.eventOutCode = ''; this.users = []; this.attachmentParams = []; this.monitorParams = []
    }
  }

  export interface Model {
    code: string;
    data: { id: string, outRoomCode: string };
    desc: string;
    tips: string;
    httpStatusCode: number;
  }
}
/**
  * 拒绝或接收邀请-Model类库
  */
export namespace IpostAcceptOrRejectSpace {

  export class RequestParams {
    loginUserId?: string; meetingId?: string; status?: number; feedbackBody?: string;
    constructor() {
      this.loginUserId = ""; this.meetingId = ""; this.status = 0; this.feedbackBody = "";
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
     * 会议详情-Model类库
     */
export namespace IgetDetailSpace {

  export class RequestParams {
    id?: string;
    loginUserId?: string;
    constructor() {
      this.id = "";
      this.loginUserId = ""
    }
  }

  export interface AllUser {
    name: string;
    status: number;
    usersData?: string;
    loginUserId?: string;
    userId: string;
    userName: string;
    head: number;
    orgName: string;
    account: string;
    mute: boolean;
    deaf: boolean;
    vmute: boolean;
    isBook?: string;
    mobile?: string;
    type?: string;
    profilePicture?: string;
    feedbackTime?: string;
    feedbackBody?: string;

  }

  export interface NoticeTypeList { }

  export interface RemindTypeList { }

  export interface AttachmentZip {
    meetingId?: string;
    attachmentId?: string;
    attachmentName?: string;
    attachmentUrl?: string;
    attachmentType?: string;
    attachmenDesc?: string;
  }

  export interface Attachment {
    attachmentDesc: string;
    attachmentId: string;
    dirUrl: string;
    originalName: string;
    pathUrl: string;
    size: number;
    type: string;
    url: string;
  }

  export interface Summary {
    meetingId: string;
    attachmentId: string;
    attachmentName: string;
    attachmentUrl: string;
    attachmentType: string;
    attachmenDesc: string;
  }

  export interface MeetingLog {
    meetingId: string;
    attachmentId: string;
    attachmentName: string;
    attachmentUrl: string;
    attachmentType: string;
    attachmenDesc: string;
  }

  export interface AcceptUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface RejectUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface UnAnswerUser {
    name: string;
    status: number;
    profilePicture: string;
  }

  export interface Monitor {
    monitorId: string;
    type: number;
    outUrl: string;
    description: string;
  }
  export interface ReceiptList {
    name?: string,
    status?: string,
    head?: string,
    profilePicture?: string,
    feedbackTime?: string,
    feedbackBody?: string
  }

  export interface Data {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    meetingTimeLength: number;
    status: number;
    statusName: string;
    allUsers: AllUser[];
    attribute: number;
    attributeName: string;
    noticeTypeList: NoticeTypeList[];
    remindBefore: number;
    remindTypeList: RemindTypeList[];
    description: string;
    attachmentZip: AttachmentZip;
    attachments: Attachment[];
    summary: Summary;
    meetingLog: MeetingLog;
    acceptNum: number;
    acceptUsers: AcceptUser[];
    rejectNum: number;
    rejectUsers: RejectUser[];
    unAnswerNum: number;
    unAnswerUsers: UnAnswerUser[];
    monitors: Monitor[];
    receiptList: ReceiptList[];
    hasSummary: string | number;
    remindBeforeName?: string;
    whiteBoardId: string;
    whiteBoardName: string;
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
* 更新会议-Model类库
*/
export namespace IpostModifyMeetingSpace {

  export class RequestParams {
    loginUserId?: string; id?: string; attribute?: number; title?: string; description?: string; startTime?: string; endTime?: string; password?: string; meetingType?: number; remindBefore?: number; remindTypeList?: []; users?: []; attachmentParams?: []; monitorParams?: [];
    constructor() {
      this.loginUserId = ""; this.id = ""; this.attribute = 0; this.title = ""; this.description = ""; this.startTime = ""; this.endTime = ""; this.password = ""; this.meetingType = 0; this.remindBefore = 0; this.remindTypeList = []; this.users = []; this.attachmentParams = []; this.monitorParams = [];
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
