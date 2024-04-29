// 用户授权验证
import { AUTH_TOKEN } from './constant';
import { defaultCacheObj } from './cache';
import { GlobalAPI } from '@/common';

const cacheTools = {
  save: (info: string) => {
    defaultCacheObj.set(AUTH_TOKEN, info);
  },
  get: () => defaultCacheObj.get(AUTH_TOKEN)
};

/**
 * 用户授权操作
 */
export default {
  // 验证登录状态
  checkLogin: () => !!cacheTools.get(),
  // 退出登录，清除token
  logoff: () => {
    // defaultCacheObj.remove(AUTH_TOKEN);
    // setTimeout(() => {
    //   window.location.href = GlobalAPI.config.PORTAL_URL || `http://${document.location.origin}/swan-settings-portal/login`;
    // }, 300);
  },
  saveToken: cacheTools.save,
  getToken: cacheTools.get,
  getTokenFromUrl: () => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get('token');
    urlToken && cacheTools.save(urlToken);
    return urlToken;
  }
};
