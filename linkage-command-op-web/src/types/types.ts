import type { PieChartData } from 'fx-front-framework';
interface Users {
  userId: string,
  userName?: string,
  name?: string,
  id?: string,
  mobile?: string,
  active?: boolean,
  disable?: boolean,
  status?: number,
  orgList?: {
    orgId: string,
    orgName?: string
  }[],
  orgName?: string
}

interface CustomPieChartData extends PieChartData {
  taskState: number
}

interface CustomRange {
  label?: string,
  distance?: string,
  latitude?: string,
  longitude?: string,
  eventLongitude?: string;
  eventLatitude?: string;
  name?: string,
  areaCode?: string,
  distanceName?: string,
  areaName?: string,
  id?: string,
}

interface Performer {
  taskInfoId?: string,
  userName?: string,
  userId?: string,
  taskState?: string,
  mobile?: string,
  orgName?: string,
  orgId?: string,
  id?: string,
  type?: string,
  name?: string,
  groupId?: string,
  groupIdPath?: string,
  active?: boolean,
  disable?: boolean,
  strategyInfoId?: string,
  groupName?: string
}
type TagKeys = 'users' | 'orgs' | 'groups'
type IdKeys = 'userId' | 'orgId' | 'id'

export { Users, CustomPieChartData, CustomRange, Performer, TagKeys, IdKeys };
