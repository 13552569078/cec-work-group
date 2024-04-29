/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 预案管理-添加-Model类库
 */
export namespace IpostAddReservePlanSpace {
  export class RequestParams {
    planName?: string;
    sued?: string;
    eventTypeCode?: [];
    planType?: string;
    planLevel?: string;
    publishTime?: string;
    expirationTime?: string;
    planFileId?: string;
    planFileUrl?: string;
    areaCode?: string;
    digitized?: number;
    constructor() {
      this.planName = "";
      this.sued = "";
      this.eventTypeCode = [];
      this.planType = "";
      this.planLevel = "";
      this.publishTime = "";
      this.expirationTime = "";
      this.planFileId = "";
      this.planFileUrl = "";
      this.areaCode = "";
      this.digitized = 0;
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
 * 预案管理-预案类型下拉选择-Model类库
 */
export namespace IpostPlanTypeSpace {
  export class RequestParams {
    constructor() {}
  }

  export interface Data {
    code: string;
    name: string;
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
 * 预案管理-列表-Model类库
 */
export namespace IpostFindReservePlanPageSpace {
  export class RequestParams {
    currentPage?: number;
    pageSize?: number;
    planName?: string;
    sued?: string;
    eventTypeCode?: string;
    planType?: string;
    planLevel?: string;
    publishTime?: string;
    expirationTime?: string;
    planFileId?: string;
    planFileUrl?: string;
    areaCode?: string;
    digitized?: number;
    constructor() {
      this.currentPage = 0;
      this.pageSize = 0;
      this.planName = "";
      this.sued = "";
      this.eventTypeCode = "";
      this.planType = "";
      this.planLevel = "";
      this.publishTime = "";
      this.expirationTime = "";
      this.planFileId = "";
      this.planFileUrl = "";
      this.areaCode = "";
      this.digitized = 0;
    }
  }

  export interface List {
    id: number;
    planName: string;
    sued: string;
    eventTypeCode: string;
    eventTypeCodeName: string;
    planType: string;
    planTypeName: string;
    planLevel: string;
    planLevelName: string;
    publishTime: string;
    expirationTime: string;
    planFileId: string;
    planFileUrl: string;
    areaCode: string;
    areaCodeName: string;
    digitized: number;
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
 * 预案管理-修改-Model类库
 */
export namespace IpostModifyReservePlanSpace {
  export class RequestParams {
    id?: number;
    planName?: string;
    sued?: string;
    eventTypeCode?: [];
    planType?: string;
    planLevel?: string;
    publishTime?: string;
    expirationTime?: string;
    planFileId?: string;
    planFileUrl?: string;
    areaCode?: string;
    digitized?: number;
    constructor() {
      this.id = 0;
      this.planName = "";
      this.sued = "";
      this.eventTypeCode = [];
      this.planType = "";
      this.planLevel = "";
      this.publishTime = "";
      this.expirationTime = "";
      this.planFileId = "";
      this.planFileUrl = "";
      this.areaCode = "";
      this.digitized = 0;
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
 * 预案管理-主键查询-Model类库
 */
export namespace IpostFindReservePlanByIdSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface Data {
    id: number;
    planName: string;
    sued: string;
    eventTypeCode: string;
    planType: string;
    planLevel: string;
    publishTime: string;
    expirationTime: string;
    planFileId: string;
    planFileUrl: string;
    areaCode: string;
    digitized: number;
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
 * 预案管理-删除-Model类库
 */
export namespace IpostDeleteReservePlanSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
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
 * 预案管理-预案等级下拉选择-Model类库
 */
export namespace IpostPlanLevelSpace {
  export class RequestParams {
    constructor() {}
  }

  export interface Data {
    code: string;
    name: string;
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
 * 预案管理目录-删除-Model类库
 */
export namespace IpostDeleteReservePlanCatalogSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
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
 * 预案管理目录-添加-Model类库
 */
export namespace IpostAddReservePlanCatalogSpace {
  export class RequestParams {
    planId?: number;
    parentId?: number;
    catalogName?: string;
    page?: number;
    constructor() {
      this.planId = 0;
      this.parentId = 0;
      this.catalogName = "";
      this.page = 0;
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
 * 预案管理目录-列表-Model类库
 */
export namespace IpostFindReservePlanCatalogPageSpace {
  export class RequestParams {
    currentPage?: number;
    pageSize?: number;
    planType?: string;
    planLevel?: string;
    planName?: string;
    constructor() {
      this.currentPage = 0;
      this.pageSize = 0;
      this.planType = '';
      this.planLevel = '';
      this.planName = '';
    }
  }

  export interface List {
    id: number;
    planId: number;
    parentId: number;
    catalogName: string;
    page: number;
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
 * 预案文件-主键查询-Model类库
 */
export namespace IpostFindPlanFileByIdSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface Data {
    id: number;
    planId: number;
    fileName: string;
    fileSuffix: string;
    fileType: string;
    storageFilePath: string;
    storageFileName: string;
    sort: number;
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
 * 预案管理目录-主键查询-Model类库
 */
export namespace IpostFindReservePlanCatalogByIdSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
    }
  }

  export interface Data {
    id: number;
    planId: number;
    parentId: number|string;
    catalogName: string;
    page: number;
    parentName: string;
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
 * 预案管理目录-修改-Model类库
 */
export namespace IpostModifyReservePlanCatalogSpace {
  export class RequestParams {
    id?: number;
    planId?: number;
    parentId?: number;
    catalogName?: string;
    page?: number;
    constructor() {
      this.id = 0;
      this.planId = 0;
      this.parentId = 0;
      this.catalogName = "";
      this.page = 0;
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
 * 预案文件-修改-Model类库
 */
export namespace IpostModifyPlanFileSpace {
  export class RequestParams {
    id?: number;
    planId?: number;
    fileName?: string;
    fileSuffix?: string;
    fileType?: string;
    storageFilePath?: string;
    storageFileName?: string;
    sort?: number;
    constructor() {
      this.id = 0;
      this.planId = 0;
      this.fileName = "";
      this.fileSuffix = "";
      this.fileType = "";
      this.storageFilePath = "";
      this.storageFileName = "";
      this.sort = 0;
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
 * 预案文件-删除-Model类库
 */
export namespace IpostDeletePlanFileSpace {
  export class RequestParams {
    id?: number;
    constructor() {
      this.id = 0;
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
 * 预案文件-列表-Model类库
 */
export namespace IpostFindPlanFilePageSpace {
  export class RequestParams {
    currentPage?: number;
    pageSize?: number;
    planId?: number;
    fileName?: string;
    fileSuffix?: string;
    fileType?: string;
    storageFilePath?: string;
    storageFileName?: string;
    sort?: number;
    constructor() {
      this.currentPage = 0;
      this.pageSize = 0;
      this.planId = 0;
      this.fileName = "";
      this.fileSuffix = "";
      this.fileType = "";
      this.storageFilePath = "";
      this.storageFileName = "";
      this.sort = 0;
    }
  }

  export interface List {
    id: number;
    planId: number;
    fileName: string;
    fileSuffix: string;
    fileType: string;
    storageFilePath: string;
    storageFileName: string;
    sort: number;
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
 * 预案文件-添加-Model类库
 */
export namespace IpostAddPlanFileSpace {
  export class RequestParams {
    planId?: number;
    fileName?: string;
    fileSuffix?: string;
    fileType?: string;
    storageFilePath?: string;
    storageFileName?: string;
    sort?: number;
    constructor() {
      this.planId = 0;
      this.fileName = "";
      this.fileSuffix = "";
      this.fileType = "";
      this.storageFilePath = "";
      this.storageFileName = "";
      this.sort = 0;
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
