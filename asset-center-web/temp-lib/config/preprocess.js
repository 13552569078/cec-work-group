import Vue from 'vue'
import { getUrlSearch, removeToken } from '../utils/index'
import { configInfo } from '@/api/index'

const iframeDisabledOrigin = '*'

export default function preprocess(root) {
  // 监听内部页面传递的消息
  window.addEventListener('message', (e) => {
    if (e.origin === iframeDisabledOrigin) {
      return
    }
    // console.log(e, '-----接收到message', window)
    if (e.data.method === 'logout' && root instanceof Vue) {
      // 删除token 重新请求配置接口 跳转sso登录
      removeToken()
      configInfo().then(res => {
        localStorage.setItem('__systemConfig', JSON.stringify(res.data || {}))
        window.__systemConfig = res.data || {}
      })
    }
  })

  // url中拼接了embed参数 可以关闭侧边导航和头部导航
  if (window.top !== window.self || !!getUrlSearch('embed')) {
    window.embed = true
    // console.log(`window在iframe里:${window.top !== window.self};
    //   url里是否设置embed:${getUrlSearch('embed') === '1'}
    // `);
  }
}

