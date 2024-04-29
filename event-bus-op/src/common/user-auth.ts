// 用户授权验证
import { HlMessage } from 'hongluan-ui';
import { AnyFunction } from 'fx-front-utils';
import axios from 'axios';
import { GlobalAPI } from '@/common';
import { useGlobalState } from '@/hooks';
import { defaultCacheObj } from './cache';

const { setUserInfo, userInfo } = useGlobalState();

const cacheTools = {
  save: (info: string) => {
    defaultCacheObj.set('token', info);
  },
  get: () => defaultCacheObj.get('token'),
  saveFxToken: (token: string) => {
    defaultCacheObj.set('fxToken', token);
  },
  getFxToken: () => defaultCacheObj.get('fxToken'),
};

const getUserInfo = async (token: string) => {
  const url = '/api/uc/openApi/user/get';
  const res = await axios.get(url, {
    headers: {
      'Authorization': token
    }
  });
  return res;
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
  getFxToken: cacheTools.getFxToken,
  getTokenFromUrl: async (callback?: AnyFunction<any>) => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlToken = searchParams.get('token');
    const fxToken = searchParams.get('fxToken');
    urlToken && cacheTools.save(urlToken); // 服务A token
    fxToken && cacheTools.saveFxToken(fxToken); // 繁星 token
    if (urlToken) {
      const res = await getUserInfo(urlToken);
      if (res.data.data) {
        setUserInfo({
          id: res.data.data.id,
          username: res.data.data.username
        });
      } else {
        HlMessage.error('获取用户信息失败，使用默认用户登录');
        const defaultUserInfo = JSON.parse(GlobalAPI.config.DEFAULT_USER);
        setUserInfo({
          id: defaultUserInfo.id,
          username: defaultUserInfo.username
        });
      }
    } else {
      const defaultUserInfo = JSON.parse(GlobalAPI.config.DEFAULT_USER);
      setUserInfo({
        id: defaultUserInfo.id,
        username: defaultUserInfo.username
      });
    }
    if (typeof callback === 'function') {
      callback.call(this, userInfo);
    }
    return urlToken;
  }
};
