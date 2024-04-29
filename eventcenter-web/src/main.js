import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import CcxdUx from 'ccxd-ux'
import 'ccxd-ux/lib/theme-ce/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import globalComponents from '@/components'
import '@/icons' // icon
import '@/permission' // permission control

import { initEventBus } from '@/utils/eventBus'

import preprocess from './config/preprocess'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(CcxdUx, { size: 'small' })
Vue.use(globalComponents)

Vue.config.productionTip = false
// 初始化 event bus
initEventBus()
preprocess(new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}))

