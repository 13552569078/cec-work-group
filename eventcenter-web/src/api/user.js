import request from '@/utils/request'
import baseUrlMap from '@/utils/config'

const urls = {
  login: `${baseUrlMap.uc}/openApi/user/login`, // 临时登陆接口
  menuList: `${baseUrlMap.uc}/openApi/res/treeList`, // 菜单接口
  userFromToken: `${baseUrlMap.uc}/openApi/user/get`, // 通过 token 获取个人信息接口
  logout: `${baseUrlMap.uc}/openApi/user/logout`, // 退出
  userAppList: `${baseUrlMap.uc}/app/userAppList` // 通过 token 获取个人信息接口
}

const moduleSrv = {
  // 登陆接口
  toLogin: (params = {}) => request.post(urls.login, params),
  // 退出接口
  toLogOut: (params = {}) => request.post(urls.logout, params),
  // 菜单获取接口
  getMenuList: (params = {}) => request.post(urls.menuList, params),
  // 通过 token 获取个人信息接口
  getUserFromToken: (params = {}) => request.get(urls.userFromToken, params),
  // 用户可访问的应用列表
  getUserAppList: (params = {}) => request.post(urls.userAppList, params),
  // 切换组织角色
  switchOrgRole: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/user/login4SwitchRole`, params),
  // 系统配置
  systemConfiglist: (params = {}) => request.post(`${baseUrlMap.uc}/openApi/systemConfig/list`, params),

  // 根据 code 查询该应用的信息
  getAppInfoByCode: (params = {}) => request.get(`${baseUrlMap.uc}/app/getByCode`, params),

  // 基础平台字典数据获取
  getDictsFromBs: (params = {}) => request.get(`${baseUrlMap.bs}/dict/getDictListByType`, params),

  // 标准化字典数据获取
  getDictsDateTypeBs: (params = {}) => request.get(`${baseUrlMap.bs}/system/dict/data/type/${params.dictName}`),

  uploadUrl: `${baseUrlMap.bs}/oss/govern/upload` // 文件上传接口
}

export default moduleSrv
