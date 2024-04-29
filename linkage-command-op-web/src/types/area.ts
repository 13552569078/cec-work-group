export interface Area {
  administrativeLevel?: number
  areaCode: string
  areaName: string
  children?: Area[]
  id?: string
  latitude: string
  longitude: string
  parentId?: string
  sort?: number
  hasNextLevel?: boolean
}

export type CurrentArea = Pick<Area, 'areaCode'>

export interface AreaData {
  code: number
  data: Area[]
  desc: string
}
