import Vue from 'vue'
import { getUrlSearch } from '../utils/index'

const iframeDisabledOrigin = '*'

export default function preprocess(root) {
  // 监听内部页面传递的消息
  window.addEventListener('message', (e) => {
    if (e.origin === iframeDisabledOrigin) {
      return
    }
    // console.log(e, '-----接收到message', window)
    if (e.data.method === 'logout' && root instanceof Vue) {
      root.$store.dispatch('user/resetToken', root.$route.fullPath)
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

