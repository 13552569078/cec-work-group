/* eslint-disable @typescript-eslint/no-namespace */

/**
 * 资源主表-主键查询-Model类库
 */
export namespace IpostFindResourceMainByIdSpace {

  export class RequestParams{
    id?:number;
    constructor(){
      this.id=0;
    }
  }

  export interface Attr {
    code: string;
    value: string;
    valueName: string;
  }

  export interface Data {
    id: number;
    typeCode: string;
    name: string;
    administrative: string;
    contacts: string;
    telephone: string;
    address: string;
    longitude: string;
    latitude: string;
    attrs: Attr[];
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
 * 资源类型-树-Model类库
 */
export namespace IpostTypeTreeSpace {

  export class RequestParams{

    constructor(){

    }
  }

  export interface Children {
    id: string;
    code: string;
    name: string;
    label: string;
    value: string;
    sort: number;
    enabled: number;
    system: number;
    children?: Children[];
  }

  export interface Data {
    id: string;
    code: string;
    name: string;
    sort: number;
    enabled: number;
    system: number;
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
 * 资源类型属性-列表-Model类库
 */
export namespace IpostFindResourceTypeAttrPageSpace {

  export class RequestParams{
    offset?:number;currentPage?:number;pageSize?:number;typeCode?:string;code?:string;name?:string;type?:number;notNull?:number;length?:number;precision?:number;demo?:string;system?:number;display?:number;sort?:number;
    constructor(){
      this.offset=0;this.currentPage=0;this.pageSize=0;this.typeCode="";this.code="";this.name="";this.type=0;this.notNull=0;this.length=0;this.precision=0;this.demo="";this.system=0;this.display=0;this.sort=0;
    }
  }

  export interface List {
    id: number|string;
    typeCode: string;
    code: string;
    name: string;
    type: number;
    notNull: number;
    length: number;
    precision: number;
    demo: string;
    system: number;
    display: number;
    sort: number;
    isConst?: boolean;
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
 * 应急保障资源列表详情-Model类库
 */
export namespace IpostPageResourceSpace {

  export class RequestParams{
    currentPage?:number;pageSize?:number;type?:string;resType?:string;name?:string;areaCode?:string;areaCodeList?:[];
    constructor(){
      this.currentPage=0;this.pageSize=0;this.type="";this.resType="";this.name="";this.areaCode="";this.areaCodeList=[];
    }
  }

  export interface List {
    id: number;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
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
export namespace IgetEquipStatSpace {
  export interface Data {
   name: string;
   count: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}

export namespace IpostFindResourceEquipStatPageSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IgetMaterialStatSpace {
  export interface Data {
   name: string;
   count: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}

export namespace IpostFindResourceMaterialStatPageSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IgetRefugeStatSpace {
  export interface Data {
   name: string;
   count: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}

export namespace IpostFindResourceRefugeStatPageSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostEmergencyStatSpace {
  export interface Data {
    code: string;
    name: string;
    count: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: {
      total: number;
      resourceCountList: Data[];
    }
  }
}

export namespace IpostEmergencyPageSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IgetFocusGoalsStatSpace {
  export interface Data {
    code: string;
    name: string;
    val: number;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[]
  }
}

export namespace IpostFindFocusGoalsPageByTypeSpace {
  export interface Data {
    totalRow: number;
    list: List[];
  }

  export interface List {
    id: string;
    resName: string;
    address: string;
    latitude: string;
    longitude: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data;
  }
}

export namespace IpostListResourceManagerSpace {
  export interface Data {
    userId: string;
    userName: string;
    mobile: string;
    tempUser: number;
    orgId: string;
    orgName: string;
    groupId: string;
    groupName: string;
  }

  export interface Model {
    code: string;
    desc: string;
    tips: string;
    httpStatusCode: number;
    data: Data[];
  }
}

