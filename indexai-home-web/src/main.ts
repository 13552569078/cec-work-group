import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '/@/store'
import { setupRouter } from '/@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '/@/styles/index.scss'
import 'virtual:svg-icons-register'

const app = createApp(App)

app.use(ElementPlus)

// element-plus按需引入方式下，全局修改组件大小
app.config.globalProperties.$ELEMENT = {
  size: 'small'
}
// 引入全局事件监听插件mitt,并把示例挂在window上
import mitt from 'mitt'
  ; (window as any).$emitter = mitt()

// 挂载vuex状态管理
setupStore(app)

// 挂载路由
setupRouter(app)

app.mount('#app')
