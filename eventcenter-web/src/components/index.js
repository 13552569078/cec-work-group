import Breadcrumb from './Breadcrumb'
import Hamburger from './Hamburger'
import SearchPanel from './SearchPanel'
import PanelItem from './SearchPanel/panelItem'
import SubBreadcrumb from './SubBreadcrumb'
import CestcPagination from './CestcPagination'
import CestcImage from './cestcImage'
import SearchTips from './SearchTips'
import CestcTree from './CestcTree'
import CestcDialog from './CestcDialog'
import CestcDatePicker from './CestcDatePicker'
import CestcUpload from './CestcUpload'
import CestcUploadCard from './CestcUpload/card'
import fixedPage from './page-wrapper/fixed-page'
import titleTip from './EventInfo/eventTitle'
import CestcVideo from './CestcVideo/index'
import CestcProgress from './CestcProgress/index'

import CommonTitle from './EventInfo/eventTitle'
import CommonPageList from './layout/commonPageList'
import CestcCascader from './CestcCascader'
import VideoPlayer from './video'
import MapControl from './mapControl'

export default {
  install: function(Vue) {
    Vue.component('Breadcrumb', Breadcrumb)
    Vue.component('Hamburger', Hamburger)
    Vue.component('SearchPanel', SearchPanel)
    Vue.component('PanelItem', PanelItem)
    Vue.component('SubBreadcrumb', SubBreadcrumb)
    Vue.component('CestcPagination', CestcPagination)
    Vue.component('CestcImage', CestcImage)
    Vue.component('SearchTips', SearchTips)
    Vue.component('CestcTree', CestcTree)
    Vue.component('CestcDialog', CestcDialog)
    Vue.component('CestcDatePicker', CestcDatePicker)
    Vue.component('CestcUpload', CestcUpload)
    Vue.component('CestcUploadCard', CestcUploadCard)
    Vue.component('fixedPage', fixedPage)
    Vue.component('titleTip', titleTip)
    Vue.component('CestcProgress', CestcProgress)
    Vue.component('CestcVideo', CestcVideo)
    Vue.component('CommonTitle', CommonTitle)
    Vue.component('CommonPageList', CommonPageList)
    Vue.component('CestcCascader', CestcCascader)
    Vue.component('VideoPlayer', VideoPlayer)
    Vue.component('MapControl', MapControl)
  }
}
