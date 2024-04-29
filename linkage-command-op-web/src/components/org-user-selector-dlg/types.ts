interface OrgUserItem {
  id?: string;
  children: OrgUserItem[];
  orgId?: string;
  orgName?: string;
  userId?: string;
  userName?: string;
  parentId?: string;
  groupId?: string;
  groupName?: string;
  strategyInfoId?: string;
  commandId?: string;
  commandName?: string;
  active?: boolean;
  name?: string;
  type?: string;
  communicationMode?: {id:string, mode:string, modeName:string, relationId: string, value:string} [];
  mobile?: string;
  treeType?: string;
  disable?: boolean;
  groupIdPath?: string;
  [propName: string]: any;
}
type TagKeys = 'user' | 'org' | 'group'
type IdKeys = 'userId' | 'orgId' | 'id'

type SubmitEvent = {
  organization: {
    user: OrgUserItem[];
    org: OrgUserItem[];
  },
  commandSystem: {
    user: OrgUserItem[];
    org: OrgUserItem[];
    group: OrgUserItem[];
  },
  other: {
    user: OrgUserItem[];
    org: OrgUserItem[];
  }
}

export {
  OrgUserItem,
  SubmitEvent,
  TagKeys,
  IdKeys
};
