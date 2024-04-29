/* eslint-disable @typescript-eslint/no-namespace */

/**
* 下发指令-Model类库
*/
export namespace IpostSendSpace {

  export class RequestParams {
    content?: string; mediaList?: any[]; sendUserId?: string; title?: string; userIds?: any[];
    constructor() {
      this.content = ""; this.mediaList = []; this.sendUserId = ''; this.title = ""; this.userIds = [];
    }
  }

  export interface Model {
    code: number;
    data: boolean;
    message: string;
  }
}
/**
* 指令反馈-Model类库
*/
export namespace IpostReplySpace {

  export interface Model {
    code: number;
    data: boolean;
    message: string;
  }
}
/**
* 指令详情-Model类库
*/
export namespace IgetCommandSpace {

  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface ReplyMediaList {
    mediaBase64: string;
    mediaName: string;
    mediaPath: string;
    mediaType: string;
    mediaUsage: string;
  }

  export interface SendMediaList {
    mediaBase64: string;
    mediaName: string;
    mediaPath: string;
    mediaType: string;
    mediaUsage: string;
  }

  export interface Data {
    commandStatus: number;
    commandStatusName: string;
    commandTime: string;
    content: string;
    receiveUserName: string;
    replyContent: string;
    replyMediaList: ReplyMediaList[];
    sendMediaList: SendMediaList[];
    title: string;
    eventCode: string;
    eventId: string;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 指令接收-Model类库
*/
export namespace IpostReceiveSpace {

  export class RequestParams {
    commandStatus?: number; endTime?: string; pageNum?: number; pageSize?: number; startTime?: string; userId?: number;
    constructor() {
      this.commandStatus = 0; this.endTime = ""; this.pageNum = 0; this.pageSize = 0; this.startTime = ""; this.userId = 0;
    }
  }

  export interface List {
    commandStatus: number;
    commandStatusName: string;
    commandTime: string;
    id: number;
    receiveUserName: string;
    sendUserName: string;
    title: string;
  }

  export interface Data {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    list: List[];
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
/**
* 指令历史-Model类库
*/
export namespace IpostHistorySpace {

  export class RequestParams {
    commandStatus?: number; endTime?: string; pageNum?: number; pageSize?: number; startTime?: string; userId?: string;
    constructor() {
      this.commandStatus = 0; this.endTime = ""; this.pageNum = 0; this.pageSize = 0; this.startTime = ""; this.userId = '';
    }
  }

  export interface List {
    commandStatus: number;
    commandStatusName: string;
    commandTime: string;
    id: number;
    receiveUserName: string;
    sendUserName: string;
    title: string;
  }

  export interface Data {
    currentPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
    list: List[];
    pageSize: number;
    totalPage: number;
    totalRow: number;
  }

  export interface Model {
    code: number;
    data: Data;
    message: string;
  }
}
