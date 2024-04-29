import Vue from 'vue'
import {
  getUrlSearch,
  removeToken
} from '@/utils/index'
import { configInfo } from '@/api/index'

export default function preprocess(root) {
  // 监听内部页面传递的消息
  window.addEventListener('message', (e) => {
    // console.log(e, '-----接收到message');
    if (e.data.method === 'logout' && root instanceof Vue) {
      removeToken()
      configInfo().then(res => {
        localStorage.setItem('__systemConfig', JSON.stringify(res.data || {}))
        window.__systemConfig = res.data || {}
      })
    }
    if (e.data.msg && e.data.msg.system === 'indicatorPlatform') {
      /**
       * 指标平台发出的事件
       */
      //   msg: {
      //     system: “indicatorPlatform”，
      //     btn: 1,  indicator:（1，提交 2，取消3，指标验证）task:  1，提交  2，取消, 3, 提交并启用， 4启用  5 暂停 6 手动生成  7 删除
      //     Info: {page:"indicator"|page: 'task'}
      //  }
      // console.log(e.data.msg, 'eeeeeeeeee')
      const msg = e.data.msg
      if (msg.Info && msg.Info.page === 'indicator') {
        // 指标设计
        if (msg.btn !== 3) {
          root.$router.go(-1)
        }
      } else if (msg.Info && msg.Info.page === 'task') {
        // 任务编辑
        if (msg.btn !== 5 && msg.btn !== 6) {
          root.$router.go(-1)
        }
      }
    }
  })

  if (window.self !== window.top) {
    window.embed = true
  }
  // url中拼接了embed参数 可以关闭侧边导航和头部导航
  if (getUrlSearch('embed')) {
    window.embed = true
    // console.log(`window在iframe里:${window.top !== window.self};
    //   url里是否设置embed:${getUrlSearch('embed') === '1'}
    // `);
  }
}
