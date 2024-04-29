import tinymce from 'tinymce'
import VueTinymce from '@/components/tinymce/main'
// 主题
import 'tinymce/themes/silver'
// 插件
import 'tinymce/plugins/image'// 插入上传图片插件
import 'tinymce/plugins/link' // 链接插件
import 'tinymce/plugins/table'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/autoresize'
import '@/components/tinymce/plugins/indent2em'
import '@/components/tinymce/plugins/lineheight'
import 'tinymce/plugins/paste'
import 'tinymce/icons/default/icons'
// 本地化
import '@/components/tinymce/lang/zh_CN.js'

import Vue from 'vue'
import '@/styles/index.scss'
import CestcIocUI from 'cestc-ioc-ui'

import App from '@/App'
import store from '@/store'
import router from '@/router'
import '@/icons'
import '@/permission'
import PageWrapper from '@l/components/global'
import preprocess from '@l/config/preprocess'
import VueCompare from '@l/components/v-compare'
import initStepClick from '@l/utils/v-step-click'
import VueCopy from '@l/components/v-copy'

Vue.config.productionTip = false
initStepClick(Vue)
Vue.prototype.$tinymce = tinymce
Vue.use(VueTinymce)
Vue.use(CestcIocUI)
Vue.use(PageWrapper)
Vue.use(VueCompare)
Vue.use(VueCopy)

preprocess(new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}))

