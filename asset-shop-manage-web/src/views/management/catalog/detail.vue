<!--
 * @Description: 待审核详情
 * @Author: zs
 * @Date: 2022-01-20
-->
<template>
  <div
    class="detail-box_page"
    :class="{ 'detail-box_page_bottom': nofooter }"
  >
    <component :is="detailComponentName" :page-status="pageStatus" :apply-type="applyType" :apply-id="applyId" :asset-type="assetType" @getData="getDetailData" />
    <div
      class="btn-box"
      :class="{ 'btn-box-shadow': showShadow, 'no-btn': nofooter}"
    >
      <Anchor v-if="showAnchor" :scrolldom="scrollDom" :hidepulick="hidePublicInfo" class="cls-anchor" />
      <c-button v-if="pageStatus!==1" type="gradual" @click="postAudit">审核</c-button>
      <!-- 开发渠道=1资源中心 且 上架申请、升级申请 -->
      <button-dropdown
        v-show="pageInfo.buildChannel==1&&(applyType==2||applyType==1)"
        class="btn-pre"
        :options="preBtnList"
        :text="'应用预览'"
        @command="handleAppPre" />
    </div>
    <post-audit
      :post-dailog-flag="showPostDailog"
      :apply-id="applyId"
      :apply-type="applyType"
      @close="colseDialog"
    />
    <qrcodeVue v-if="!!qrUrl" :dialog-flag="!!qrUrl" :url="qrUrl" @close="qrUrl=''"></qrcodeVue>
  </div>
</template>
<script>
import Anchor from '@/components/anchor'
import detailAsset from './detail-asset.vue'
import detailApp from './detail-app.vue'
import detailApi from './detail-api.vue'
import detailSupportapp from './detail-supportapp.vue'
import postAudit from '../components/post-audit'
import ButtonDropdown from '@/components/button-dropdown'
import { addParamToUrl } from '@/utils'
import { APP_TYPE } from '@/utils/enumerate.js'
import qrcodeVue from '@/components/qrcode.vue'

export default {
  name: '',
  components: {
    Anchor,
    detailAsset,
    postAudit,
    detailApp,
    detailApi,
    detailSupportapp,
    ButtonDropdown,
    qrcodeVue
  },
  data() {
    return {
      applyId: parseInt(this.$route.query.id),
      pageStatus: parseInt(this.$route.query.status), // 0, 待审核 1 已审核  详情
      applyType: parseInt(this.$route.query.applyType), // 1-上架申请、2-更新申请、 3-注册申请、4-下架申请
      assetType: this.$route.query.assetType,
      activeTabName: '1',
      showShadow: true,
      detailInfoData: null,
      showPostDailog: false,
      applyObject: this.$route.query.applyObject,
      scrollDom: null,
      hidePublicInfo: +this.$route.query.applyType === 3,
      pageInfo: {},
      APP_TYPE,
      qrUrl: ''
    }
  },
  computed: {
    nofooter() {
      return !(this.pageStatus !== 1 || (+this.pageInfo.buildChannel === 1 && +this.pageInfo.packStatus === 4))
    },
    detailComponentName() {
      if ([22, 14, 72, 7].includes(+this.assetType)) {
        return 'detailApi'
      } else if (+this.assetType === 27) {
        return 'detailSupportapp'
      } else if (+this.applyObject === 2) {
        return 'detailApp'
      }
      return 'detailAsset'
    },
    showAnchor() {
      return true
    },
    preBtnList() {
      let item = this.pageInfo.assetSubtype
      if (item && typeof item === 'string') {
        item = item.split(',')
      }
      console.log(item, this.APP_TYPE, '----preBtnList')
      if (Array.isArray(item)) {
        return item.map(d => ({ label: this.APP_TYPE[d], value: d }))
      }
      return []
    }
  },
  created() {
  },
  mounted() {
    if (this.showAnchor) {
      setTimeout(() => {
        this.scrollDom = document.querySelector('.refScrollDom')
      }, 500)
    }
  },
  methods: {
    getDetailData(data) {
      data.accessWay = data.accessWay || ''
      if (typeof data.accessWay === 'string') {
        data.accessWay = /^\{(.+)\}$/.test(data.accessWay) ? JSON.parse(data.accessWay) : {}
      }
      this.pageInfo = data
    },
    handleAppPre(val) {
      console.log(this.pageInfo.accessWay)
      if (+val === 3 && this.pageInfo.accessWay.pc) { // pc
        window.open(addParamToUrl(this.pageInfo.accessWay.pc))
      } else if (+val === 4 && this.pageInfo.accessWay.h5) { // h5
        this.qrUrl = this.pageInfo.accessWay.h5
      }
    },
    postAudit() {
      // 点击审核
      this.showPostDailog = true
    },
    colseDialog(msg) {
      this.showPostDailog = false
      if (msg) {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.detail-box_page {
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 64px;
  // background: #ffffff;
  font-size: 14px;
  color: #404040;
  .detail-box-1 {
    padding-top: 20px;
  }
  .line-box {
    width: 100%;
    height: 16px;
    background: #f3f4fb;
  }
  .btn-box {
    position: absolute;
    width: 100%;
    height: 64px;
    line-height: 64px;
    padding-left: 20px;
    left: 0;
    bottom: 0;
    background: #ffffff;
  }
  .btn-box-shadow {
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
  }
  ::v-deep .c-tabs__header {
    margin: 0;
  }
}
.detail-box_page_bottom {
  padding-bottom: 20px;
}
.cls-anchor {
  position: absolute;
  right: 20px;
  bottom: 100px;
}
.no-btn {
  height: 0 !important;
}
.btn-pre {
  display: inline-block;
  margin-left: 16px;
}
</style>
