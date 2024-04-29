export interface UserInfo {
  [key: string]: any
  mobile?: string;
  userType?: number;
}
export interface CurrentUser {
  userInfo: UserInfo;
}
export interface RootState {
  version: string;
}
