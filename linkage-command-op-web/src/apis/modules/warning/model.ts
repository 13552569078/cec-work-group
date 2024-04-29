export namespace IpostFindWarningPageSpace {

  export interface Data {
    id: string;
    title: string;
    eventTypes: string;
    eventTypeShow: string;
    publishUnit: string;
    publishTime: string;
    content: number;
    fileId: string;
    fileUrl: string;
    fileName: string;
    status: number;
    creator: number;
  }

  export interface Model {
    code: number;
    data: {
      totalRow: number;
      list: Data[]
    };
    desc: string;
  }
}

