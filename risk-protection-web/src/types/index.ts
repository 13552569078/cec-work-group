export * from './env';

export type IdProp = { id: number | string }

export type IdKey = string | number;

export interface Users {
  userId: string,
  userName: string,
  id?: string,
  mobile?: string,
  active?: boolean,
  disable?: boolean,
  status?: number,
  orgList?: {
    orgId: string,
    orgName?: string
  }[],
  orgName?: string,
  orgId?: string
}

export type ActionType = 'add' | 'edit' | 'detail'
