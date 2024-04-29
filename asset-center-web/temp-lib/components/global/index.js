import DefaultPage from './default-page'
import WebPage from './web-page'
import FixedPage from './fixed-page'
import RoDiv from './ro-div'
import CSearch from './c-search'
import SearchListPage from './search-list-page.vue'
import TotalInfo from './total-info.vue'
import BtnGroup from './btn-group.vue'
import RouterPageLayout from './router-page-layout'
const components = [
  DefaultPage,
  WebPage,
  FixedPage,
  RoDiv,
  CSearch,
  SearchListPage,
  TotalInfo,
  BtnGroup,
  RouterPageLayout
]

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  install,
  DefaultPage,
  WebPage,
  FixedPage,
  RoDiv,
  SearchListPage,
  TotalInfo,
  BtnGroup,
  RouterPageLayout
}

