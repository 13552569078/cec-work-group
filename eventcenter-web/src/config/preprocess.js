import Vue from 'vue'
import { getUrlSearch } from '@/utils/index'
import Layout from '@/layout'
import ExternalPage from '@/components/external-page'

export default function preprocess(root) {
  window.onMessageFromChild = function(params, option) {
    const router = root.$router
    const fixPath = `/external-page${params.fullPath.replace('?', '/')}` // 由于vue-router限制, 暂时只能添加不同路由解决缓存问题
    const newRoute = {
      path: fixPath,
      name: params.path,
      component: Layout,
      children: [{
        path: '',
        component: ExternalPage,
        meta: {
          title: params.title,
          externalPath: `${params.origin}${params.pathName}#${params.fullPath}`
        }
      }]
    }
    router.addRoute(newRoute)
    router.push(fixPath)
    if (option && option.method === 'logout') {
      console.log('option==', option)
      router.push('/login')
    }
  }
  // 监听内部页面传递的消息
  window.addEventListener('message', (e) => {
    // console.log(e, '-----接收到message');
    if (e.data.method === 'logout' && root instanceof Vue && e.origin === window.location.origin) {
      root.$store.dispatch('user/resetToken', root.$route.fullPath)
    }
  })

  window.isWindowOpenFromWujie = (window?.opener?.name || '').indexOf('wjAppName') > -1
  // url中拼接了embed参数 可以关闭侧边导航和头部导航
  if (window.top !== window.self || !!getUrlSearch('embed')) {
    window.embed = true
  }
}
