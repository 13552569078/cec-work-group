// 用户授权验证
import { AUTH_TOKEN } from './constant';
import { defaultCacheObj } from './cache';

const cacheTools = {
  save: (info: string) => {
    defaultCacheObj.set(AUTH_TOKEN, info);
  },
  get: () => AUTH_TOKEN || sessionStorage.getItem('TOKEN')
};

/**
 * 用户授权操作
 */
export default {
  // 验证登录状态
  checkLogin: () => !!cacheTools.get(),
  // 退出登录，清除token
  logoff: () => {
    defaultCacheObj.remove(AUTH_TOKEN);
  },
  saveToken: cacheTools.save,
  getToken: cacheTools.get
};
