import request from '/@/utils/http/axios/interceptors'
import { AppIdParams, LoginParams } from './model/user'
import loadjson from '/@/utils/loadJson'

enum Api {
  Login = '/api/login',
  Logout = '/api/uc/openApi/user/logout',
  GetUserInfo = '/api/uc/openApi/user/get', // 通过 token 获取个人信息接口
  dicts = '/cityie/system/dict/list',
  config = '/api/event/config',
  getMenuList = '/api/uc/openApi/res/treeList'
}

const moduleSrv = {
  /**
   * @description: 用户登陆接口
   */
  login: (params: LoginParams, isMock = false) =>
    isMock ? loadjson('mock', 'mock-login', {}) : request.post(Api.Login, params),

  /**
   * @description: 用户退出接口
   */
  logout: (params = {}) => request.post(Api.Logout, params),

  /**
   * @description: 获取用户登陆信息
   */
  getUserFromToken: async (isMock = false) =>
    isMock ? loadjson('mock', 'mock-userInfo', {}) : request.get(Api.GetUserInfo),

  /**
   * @description: 获取字典信息(超时重传)
   */
  getDictDatas: () => request.get(Api.dicts, { headers: { retry: 1 } }),

  /**
   * @description: 全局配置接口
   */
  getConfig: () => request.get(Api.config),
  /**
   * @description: 全局配置接口
   */
  getMenuList: (params: AppIdParams) => request.post(Api.getMenuList, params)
}

export default moduleSrv
