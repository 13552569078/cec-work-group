import tinymce from 'tinymce'
import VueTinymce from '@/components/tinymce/main'

// 主题
import 'tinymce/themes/silver'
// echart
import echarts from 'echarts'

// 插件
import 'tinymce/plugins/link' // 链接插件

import 'tinymce/plugins/table'
import 'tinymce/plugins/anchor'
import '@/components/tinymce/plugins/indent2em'
import '@/components/tinymce/plugins/lineheight'
import 'tinymce/plugins/paste'
import 'tinymce/icons/default/icons'
// 本地化
import '@/components/tinymce/lang/zh_CN.js'

import Vue from 'vue'
import '@/styles/index.scss'
import CestcIocUI from 'fx-asset-ui'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import '@/icons'
import '@/permission'

import PageWrapper from '@l/components/global'
import preprocess from '@/config/preprocess'
import VueCompare from '@l/components/v-compare'
import initStepClick from '@l/utils/v-step-click'
import { assetStatus } from '@/config'
import VueCopy from '@/components/v-copy'

import publishAsset from '@/views/asset-management/components/publish-asset.vue'
import subAsset from '@/views/asset-management/components/sub-asset.vue'

initStepClick(Vue)
Vue.prototype.$echarts = echarts
Vue.prototype.$tinymce = tinymce
Vue.use(VueTinymce)

Vue.component('publishAsset', publishAsset)
Vue.component('subAsset', subAsset)

Vue.config.productionTip = false
Vue.use(CestcIocUI)
Vue.use(PageWrapper)
Vue.use(VueCompare)
Vue.use(VueCopy)
Vue.filter('assetStatusFilter', (v) => {
  const findOne = assetStatus.find(item => item.value + '' === v + '')
  if (findOne) return findOne.label;
  return ''
})
Vue.filter('assetSrcFilter', (v) => {
  // 1自研 2下载
  v += ''
  let res = ''
  switch (v) {
    case '1':
      res = '自研'
      break;
    case '2':
      res = '下载'
      break;
    case '3':
      res = '导入'
      break;
    default:
      break;
  }
  return res
})

preprocess(new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}))

