<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-25
-->
<template>
  <div class="detail scrollDom" @scroll.self="onscroll">
    <div class="top">
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 1" class="tips width">
        <span>当前页面为应用快照，展示应用下载时的应用信息 </span>
        <span class="link" @click.prevent="showCurrAsset">查看应用详情</span>
      </div>
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 2" class="tips width">
        <span>当前页面为应用快照，展示应用下载时的应用信息，当前应用已有版本更新</span>
        <span class="link" @click.prevent="showNewAsset">查看最新应用详情</span>
      </div>
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 3" class="tips width">
        <span>当前页面为应用快照，展示应用下载时的应用信息，当前应用已下架</span>
        <span class="link" @click.prevent="showALLAsset">查看更多应用</span>
      </div>
      <div class="top-wrap width">
        <div class="img" :style="pageInfo.imageList|coverImg"></div>
        <div class="info">
          <div class="title-box">
            <h3 class="title"><span>{{ pageInfo.packName | emptyFilter }}</span></h3>
            <span class="f14 version">{{ pageInfo.packVersion | emptyFilter }}</span>
            <span class="f14 appstatus" :class="`appstatus${pageInfo.appStatus}`">{{ APP_ENUMS.APP_STATUS[pageInfo.appStatus] }}</span>
          </div>
          <p class="mt20 scene-bg">
            <span class="scene-tag">{{ pageInfo.packSceneName||'--' }}</span>
            <template v-if="pageInfo.tagList&&pageInfo.tagList.length">
              <span
                v-for="item in pageInfo.tagList||[]"
                :key="item.groupId"
                class="search-tag"
              >{{ item.groupName }}</span>
            </template>
          </p>
          <div class="flex-wrap mt20">
            <div class="flex-item">
              <p class="label">适用终端</p>
              <p class="value">{{ pageInfo.assetSubtype | typeFilter }}</p>
            </div>
            <div class="flex-item">
              <p class="label">建设部门</p>
              <c-tooltip :disabled="!pageInfo.contactInfo.buildDeptName" :content="pageInfo.contactInfo.buildDeptName" placement="top">
                <p class="value">
                  {{ pageInfo.contactInfo.buildDeptName||'--' }}
                </p>
              </c-tooltip>
            </div>
            <div v-if="!isSnapshoot" class="flex-item">
              <p class="label">申请次数</p>
              <p class="value">{{ pageInfo.downloadCount || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="label">更新时间</p>
              <p class="value">{{ pageInfo.updateTime || '--' }}</p>
            </div>
          </div>
          <div class="right-btns">
            <!-- 开发渠道=1资源中心 且 已上架 -->
            <button-dropdown
              v-show="pageInfo.buildChannel==1&&pageInfo.packStatus==4"
              class="btn-pre"
              :options="preBtnList"
              :text="'应用预览'"
              @command="handleAppPre" />
            <template v-if="!hidebtn&&pageInfo.packStatus!==13&&pageInfo.packStatus!==5&&!isSnapshoot&&pageInfo.applyType">
              <c-button class="btn btn-shopcar btn-secondary" @click.stop="clickAddShopCar(pageInfo)">加入购物车</c-button>
              <c-button type="primary" :disabled="pageInfo.downloadStatus === 1" class="btn" @click.stop="clickDownload">
                {{ DOWNLOADAPP[pageInfo.downloadStatus||0] }}
              </c-button>
            </template>
          </div>
        </div>
      </div>
      <p class="width packdesc">{{ pageInfo.packDesc || '--' }}</p>
    </div>
    <div class="tab-wrapper fixedTabDom" :class="{fixtop:tabFixed}">
      <div class="width">
        <c-tabs v-model="tabActive" type="nav" class="tab-wrap" @tab-click="clickTab">
          <c-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
        </c-tabs>
        <div v-show="tabFixed" class="right-btns">
          <!-- 开发渠道=1资源中心 且 已上架 -->
          <button-dropdown
            v-show="pageInfo.buildChannel==1&&pageInfo.packStatus==4"
            class="btn-pre"
            :options="preBtnList"
            :text="'应用预览'"
            @command="handleAppPre" />
          <template v-if="!hidebtn&&pageInfo.packStatus!==13&&pageInfo.packStatus!==5&&!isSnapshoot&&pageInfo.applyType">
            <c-button class="btn btn-shopcar btn-secondary" @click.stop="clickAddShopCar(pageInfo)">加入购物车</c-button>
            <c-button type="primary" :disabled="pageInfo.downloadStatus === 1" class="btn" @click.stop="clickDownload">
              {{ DOWNLOADAPP[pageInfo.downloadStatus||0] }}
            </c-button>
          </template>
        </div>
      </div>
    </div>
    <div class="main width">
      <c-form ref="refForm" :model="formData" label-position="top">
        <div class="box-wrap">
          <h3 class="info-title jichuxinxi">基础信息</h3>
          <c-row>
            <c-col :span="8">
              <c-form-item label="建设渠道">{{ CHANNEL[pageInfo.buildChannel] || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="与数字资源服务门户统一用户中心">{{ pageInfo.unifyUc==0?'否':'是' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="网络类型">{{ APP_ENUMS.NET_TYPE[pageInfo.netType] || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="所属地区">{{ pageInfo.contactInfo.district || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="建设部门">{{ pageInfo.contactInfo.buildDeptName || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="联系人">{{ pageInfo.contactInfo.contactUserName || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="电话">{{ pageInfo.contactInfo.contactPhone || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="邮箱">{{ pageInfo.contactInfo.contactEmail || '--' }}</c-form-item>
            </c-col>
          </c-row>
        </div>
        <div class="box-wrap">
          <h3 class="info-title guanlianziyuan">关联资源</h3>
          <c-form-item label="">
            <c-tabs v-model="referAssetTabName" type="box" class="refer-asset-tab">
              <c-tab-pane label="使用资源" name="referUseAssetList"></c-tab-pane>
              <c-tab-pane label="产生资源" name="referOutputAssetList"></c-tab-pane>
            </c-tabs>
            <c-table :data="referTableList" :border="true">
              <c-table-column type="index" label="#" width="50" />
              <c-table-column prop="referAssetName" label="资源名称" show-overflow-tooltip />
              <c-table-column prop="referAssetCode" label="资源编码" show-overflow-tooltip />
              <c-table-column prop="referAssetVersion" label="版本号" show-overflow-tooltip />
              <c-table-column prop="referAssetTypeName" label="资源类型" show-overflow-tooltip />
              <c-table-column prop="referAssetDesc" label="资源描述" show-overflow-tooltip />
              <c-table-column prop="action" label="操作" width="60">
                <template slot-scope="scope">
                  <c-button type="text" @click="clickViewBtn(scope.row)">查看</c-button>
                </template>
              </c-table-column>
            </c-table>
          </c-form-item>
        </div>
        <div class="box-wrap">
          <h3 class="info-title banbenxinxi">版本信息</h3>
          <c-row>
            <c-col :span="8">
              <c-form-item label="版本号">{{ pageInfo.packVersion||'--' }}</c-form-item>
            </c-col>
            <c-col :span="12">
              <c-form-item label="生效时间">{{ pageInfo.packTime||'--' }}</c-form-item>
            </c-col>
            <c-col :span="24">
              <c-form-item label="版本说明"><div class="textarea-val" v-html="textAreaFilter(pageInfo.packVersionDesc||'--')"></div></c-form-item>
            </c-col>
          </c-row>
        </div>
        <div class="box-wrap">
          <h3 class="info-title xiangmuxinxi">项目及厂商信息</h3>
          <c-row>
            <c-col :span="8">
              <c-form-item label="项目名称">{{ pageInfo.projectInfo.projectName || '--' }}</c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="建设周期">{{ pageInfo.projectInfo.projectBuildStartDate?`${pageInfo.projectInfo.projectBuildStartDate} 至 ${pageInfo.projectInfo.projectBuildEndDate}`:'--' }}</c-form-item>
            </c-col>
            <c-col :span="24">
              <c-form-item label="项目简介">
                <div class="textarea-val" v-html="textAreaFilter(pageInfo.projectInfo.projectDesc||'--')"></div>
              </c-form-item>
            </c-col>
          </c-row>
          <div v-for="(d, i) in pageInfo.firmInfo" :key="`firmInfo-${i}`" class="firm-wrap">
            <p>
              <span class="firm-label">{{ APP_ENUMS.FIRM_TYPE[d.firmType]||'' }}</span>
              <span class="firm-value">{{ d.firmName || '--' }}</span>
            </p>
            <p>
              <span class="firm-label">联系人</span>
              <span class="firm-value">{{ d.firmContact || '--' }}</span>
            </p>
            <p>
              <span class="firm-label">联系方式</span>
              <span class="firm-value">{{ d.firmContactWay || '--' }}</span>
            </p>
          </div>
        </div>
        <div v-if="[4,5,6,7,8].indexOf( pageInfo.packStatus)!==-1" class="box-wrap">
          <h3 class="info-title anlizhidao">案例指导</h3>
          <c-form-item label="成功案例">
            <vue-tinymce
              :height="200"
              :editor-content="pageInfo.caseGuide.caseExample"
              :status="1"
              class="cls-tinymce"
            />
          </c-form-item>
          <c-form-item label="">
            <template slot="label">
              <span>
                使用指南
                <c-tooltip placement="right">
                  <div slot="content">请审核通过后可点击下载</div>
                  <i class="cls-icon-info"></i>
                </c-tooltip>
              </span>
            </template>
            <span v-if="!pageInfo.caseGuide.useGuide">--</span>
            <div v-else class="file-wrap">
              <div class="file-item" @click="downloadFile(pageInfo.caseGuide.useGuide)">
                <p>{{ pageInfo.caseGuide.useGuide.fileName }}</p>
              </div>
            </div>
          </c-form-item>
          <c-form-item label="">
            <template slot="label">
              <span>
                测试报告
                <c-tooltip placement="right">
                  <div slot="content">请审核通过后可点击下载</div>
                  <i class="cls-icon-info"></i>
                </c-tooltip>
              </span>
            </template>
            <span v-if="!pageInfo.caseGuide.testReport">--</span>
            <div v-else class="file-wrap">
              <div class="file-item" @click="downloadFile(pageInfo.caseGuide.testReport)">
                <p>{{ pageInfo.caseGuide.testReport.fileName }}</p>
              </div>
            </div>
          </c-form-item>
        </div>
        <div v-if="!hideappraise" class="box-wrap">
          <h3 class="info-title ziyuanpingjia">资源评价</h3>
          <appraise :shop-code="shopCode" />
        </div>
      </c-form>
    </div>
    <page-footer v-if="showfooter" />
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
    <subDialog
      v-if="dialogFlagSub"
      :pack-version-id="pageInfo.packVersionId"
      :app-name="pageInfo.packName"
      :dialog-flag="dialogFlagSub"
      :shop-code="pageInfo.shopCode"
      :pack-version="pageInfo.packVersion"
      @close="closeSubDialog" />
    <qrcodeVue v-if="!!qrUrl" :dialog-flag="!!qrUrl" :url="qrUrl" @close="qrUrl=''"></qrcodeVue>
    <shopCarAdd
      :visible="shopCarAddFlag"
      :data="pageInfo"
      @close="closeSubDialog"
    />
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import PageFooter from '@/components/footer'
import vueTinymce from '@/components/tinymce'
import { queryPublishDetailApp, queryVersionLog, queryVersion, queryPackDetailApp } from '@/api/index'
import { APP_TYPE, APP_PACK_STATUS, DOWNLOADAPP, asseTypeFormatLong } from '@/utils/enum'
import { getToken } from '@l/utils/auth'
import { addParamToUrl } from '@/utils'
import * as APP_ENUMS from '@/views/pack-manage-app/enums.js'
import subDialog from '@/views/template-app/components/sub-dialog.vue'
import ButtonDropdown from '@/components/button-dropdown'
import qrcodeVue from './qrcode.vue'
import shopCarAdd from './shop-car-add.vue'
import appraise from '@/views/home/components/appraise.vue'
export default {
  name: 'APPDetail',
  components: { vueTinymce, PageFooter, subDialog, ButtonDropdown, qrcodeVue, shopCarAdd, appraise },
  filters: {
    emptyFilter(str) {
      return str || '--'
    },
    typeFilter(item) {
      if (item && typeof item === 'string') {
        item = item.split(',')
      }
      if (Array.isArray(item)) {
        return item.map(d => APP_TYPE[d]).join(', ') || '--'
      }
      return '--'
    },
    coverImg(arr) {
      let item
      if (Array.isArray(arr)) {
        item = arr[0]
      }
      if (item && item.filePath) {
        return `background-image:url(${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/${item.filePath})`
      }
      return ''
    },
    bytesToSize(bytes) {
      if (bytes === undefined || bytes === null) {
        return '--'
      }
      if (bytes === 0) return '0B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      // toPrecision(3) 后面保留两位小数，如1.00GB
      return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i]
    }
  },
  props: {
    shopCode: { type: [String, Number], default: '' },
    packVersion: { type: [String, Number], default: '' },
    packVersionId: { type: [String, Number], default: '' },
    isSnapshoot: { type: Boolean, default: false },
    showsnapshootinfo: { type: Boolean, default: true },
    showfooter: { type: Boolean, default: true },
    hidebtn: { type: Boolean, default: false },
    hideappraise: { type: Boolean, default: false },
    customClickTab: Function
  },
  data() {
    return {
      packType: 2,
      infoFlag: 0,
      hideNewAsset: false,
      btnLoading: false,
      tabFixed: false,
      dialogFlagSub: false,
      shopCarAddFlag: false,
      tabActive: '基础信息',
      formData: {},
      pageInfo: {
        tagList: [],
        packFile: {},
        attachList: [],
        imageList: [],
        contactInfo: {},
        projectInfo: {},
        firmInfo: [],
        caseGuide: {},
        accessWay: {}
      },
      versionList: [],
      PACK_STATUS: APP_PACK_STATUS,
      DOWNLOADAPP,
      APP_ENUMS,
      CHANNEL: window.ENUMS.CHANNEL,
      referAssetTabName: 'referUseAssetList',
      APP_TYPE,
      qrUrl: '',
      download: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    tabs() {
      let arr = ['基础信息', '版本信息', '项目及厂商信息', '案例指导', '资源评价']
      if (this.isSnapshoot || [4, 5, 6, 7, 8].indexOf(this.pageInfo.packStatus) === -1) {
        arr = arr.filter(d => d !== '案例指导')
      }
      if (this.hideappraise) {
        arr = arr.filter(d => d !== '资源评价')
      }
      return arr
    },
    preBtnList() {
      let item = this.pageInfo.assetSubtype
      if (item && typeof item === 'string') {
        item = item.split(',')
      }
      if (Array.isArray(item)) {
        return item.map(d => ({ label: this.APP_TYPE[d], value: d }))
      }
      return []
    },
    referTableList() {
      const list = this.pageInfo[this.referAssetTabName] || []
      return list.map(d => ({
        ...d,
        referAssetName: d.referAssetName || '--',
        referAssetCode: d.referAssetCode || '--',
        referAssetVersion: d.referAssetVersion || '--',
        referAssetTypeName: this.assetTypeFilter(d) || '--',
        referAssetDesc: d.referAssetDesc || '--'
      }))
    }
  },
  created() {
    this.queryData()
    if (this.isSnapshoot) { this.queryVersionInfo() }
  },
  beforeDestroy() {
    this.notify && this.notify.close()
  },
  methods: {
    clickAddShopCar(item) {
      this.shopCarAddFlag = true
    },
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    assetTypeFilter(item) {
      if (+item.referAssetType === 99) {
        return '应用资源'
      }
      if (+item.referAssetSubtype === 27) {
        return '支撑应用'
      }
      return asseTypeFormatLong(item.referAssetType, item.referAssetSubtype)
    },
    handleAppPre(val) {
      if (+val === 3 && this.pageInfo.accessWay.pc) { // pc
        window.open(addParamToUrl(this.pageInfo.accessWay.pc))
      } else if (+val === 4 && this.pageInfo.accessWay.h5) { // h5
        this.qrUrl = this.pageInfo.accessWay.h5
      }
    },
    clickViewBtn(row) {
      let path
      if (this.referAssetTabName === 'referOutputAssetList') {
        const basePath = +row.referAssetType === 99 ? '/templateApp/detail' : '/home/detail'
        path = this.$router.resolve({
          path: basePath,
          query: {
            shopCode: row.referAssetCode,
            packVersionId: row.referAssetVersionId,
            packVersion: row.referAssetVersion,
            assetType: row.referAssetSubtype
          }
        })
      } else {
        const basePath = +row.referAssetType === 99 ? '/templateApp/snapshoot' : '/home/snapshoot'
        path = this.$router.resolve({
          path: basePath,
          query: {
            shopCode: row.referAssetCode,
            packVersionId: row.referAssetVersionId,
            packVersion: row.referAssetVersion,
            assetType: row.referAssetSubtype
          }
        })
      }
      window.open(path.href, '_blank')
    },
    closeSubDialog() {
      this.dialogFlagSub = false
      this.shopCarAddFlag = false
    },
    login() {
      if (!getToken()) {
        this.$store.dispatch('user/resetToken')
        return true
      }
    },
    // 下载附件
    downloadFile(file) {
      if (!file.filePath) return
      this.download.name = file.fileName
      this.download.url = `${getProxyUrl(serviceSuffix.file_upload)}/fdfs/download?relativePath=${file.filePath}&filename=${encodeURI(file.fileName)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    // 点击查看最新资源
    showNewAsset() {
      this.$router.push({
        path: '/templateApp/detail',
        query: { shopCode: this.shopCode, packVersionId: this.packVersionId }
      })
    },
    // 点击查看最新资源
    showCurrAsset() {
      this.$router.push({
        path: '/templateApp/detail',
        query: { shopCode: this.shopCode, packVersionId: this.packVersionId }
      })
    },
    // 点击查看最新资源
    showALLAsset() {
      this.$router.push('/templateApp')
    },
    // 下载包
    clickDownload() {
      if (this.login()) return
      if (this.pageInfo.downloadStatus === 1) return
      // 审核中跳转至审核详情
      if (this.pageInfo.downloadStatus === 3) {
        const path = this.$router.resolve({
          path: '/myApply/appDetail',
          query: {
            shopCode: this.pageInfo.shopCode,
            packVersion: this.pageInfo.packVersion
          }
        })
        window.open(path.href, '_blank')
        return
      }
      this.dialogFlagSub = true
    },
    onscroll() {
      const top = document.querySelector('.scrollDom').scrollTop
      if (top > 300) {
        const tabDom = document.querySelector('.fixedTabDom')
        tabDom.style.width = tabDom.parentElement.offsetWidth + 'px'
        this.tabFixed = true
      } else {
        this.tabFixed = false
      }
    },
    clickTab() {
      let top = 300
      if (this.tabActive === '基础信息') {
        top = document.querySelector('.jichuxinxi').getBoundingClientRect().top
      } else if (this.tabActive === '关联资源') {
        top = document.querySelector('.guanlianziyuan').getBoundingClientRect().top
      } else if (this.tabActive === '项目及厂商信息') {
        top = document.querySelector('.xiangmuxinxi').getBoundingClientRect().top
      } else if (this.tabActive === '版本信息') {
        top = document.querySelector('.banbenxinxi').getBoundingClientRect().top
      } else if (this.tabActive === '案例指导') {
        top = document.querySelector('.anlizhidao').getBoundingClientRect().top
      } else if (this.tabActive === '资源评价') {
        top = document.querySelector('.ziyuanpingjia').getBoundingClientRect().top
      }
      if (typeof this.customClickTab === 'function') {
        this.customClickTab(top)
        return
      }
      const topbase = document.querySelector('.top').getBoundingClientRect().top + 50
      top = top - topbase - 120
      const scrollDom = document.querySelector('.scrollDom')
      scrollDom.scrollTo({ behavior: 'smooth', top: top })
    },
    queryData(onlyDetail) {
      try {
        const param = { packVersionId: this.packVersionId, shopCode: this.shopCode }
        const apiFn = this.isSnapshoot ? queryPackDetailApp : queryPublishDetailApp
        apiFn(param).then(res => {
          res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
          console.log(res.data.contactInfo, res.data)
          res.data.projectInfo = res.data.projectInfo ? JSON.parse(res.data.projectInfo) : {}
          res.data.caseGuide = res.data.caseGuide ? JSON.parse(res.data.caseGuide) : {}
          res.data.firmInfo = res.data.firmInfo ? JSON.parse(res.data.firmInfo) : []
          res.data.accessWay = res.data.accessWay && /^\{(.+)\}$/.test(res.data.accessWay) ? JSON.parse(res.data.accessWay) : {}
          this.pageInfo = res.data
          // this.packVersion = res.data.packVersion
        })
        if (onlyDetail || this.isSnapshoot) return
        queryVersionLog({ shopCode: param.shopCode }).then(res => {
          this.versionList = res.data
        })
      } catch (e) {
        console.error(e)
      }
    },
    async queryVersionInfo() {
      try {
        const res = await queryVersion({ shopCode: this.shopCode })
        // 当前上架的版本
        const item = res.data.find((d) => d.packStatus === 4)
        if (item) {
          if (item.packVersion && this.packVersion && item.packVersion === this.packVersion) {
            this.infoFlag = 1
          } else {
            this.infoFlag = 2
          }
        } else {
          this.infoFlag = 3
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.box-wrap {
  background: #FFFFFF;
  margin-top: 20px;
  padding: 20px 40px;
  .info-title {
    margin-left: -20px;
  }
}

.fixtop {
  position: fixed !important;
  top: 56px !important;
  z-index: 10;
}
.width {
  width: 1280px;
  margin: auto;
  position: relative;
}
.detail {
  height: 100%;
  overflow: auto;
  .mt20 {
    margin-top: 20px;
  }
  .scene-bg{
    height: 28px;
    line-height: 28px;
  }
  .flex-wrap {
    display: flex;
    align-items: center;
    .flex-item {
      flex: 1;
      max-width: 20%;
      line-height: 24px;
      border-right: 1px solid #E4E9ED;
      margin-right: 24px;
      &:last-child {
        border: 0;
        margin-right: 0;
      }
      .label {
        color: #8A8A8A;
      }
      .value {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .top {
    padding-top: 20px;
    padding-bottom: 40px;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 1px 0px 0px rgba(62, 78, 106, 0.08);
    .tips {
      position: relative;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      height: 48px;
      line-height: 48px;
      padding: 0 16px;
      padding-left: 48px;
      background: rgba(30, 111, 255, 0.05);
      border: 1px solid $primaryColor;
      &::before {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 16px;
        left: 16px;
        background: url('~@/assets/imgs/tip.png') no-repeat center;
        background-size: contain;
      }
      .link {
        color: $primaryColor;
        cursor: pointer;
      }
    }
    .top-wrap {
      display: flex;
      margin-top: 20px;
    }
    .packdesc {
      margin-top: 24px;
      padding: 12px;
      background: #F6F9FB;
      line-height: 22px;
      color: #8A8A8A;
    }
    .img {
      margin-right: 32px;
      width: 160px;
      height: 160px;
      background: #EAF1F8;
      background-size: auto 100%;
      background-position: center;
      background-repeat: no-repeat;
    }
    .info {
      padding-top: 8px;
      position: relative;
      flex: 1;
      .title-box{
        height: 32px;
        display: flex;
        align-items: center;
      }
      .lh {
        line-height: 18px;
      }
      .version{
        margin-left: 20px;
        height: 16px;
        line-height: 16px;
        padding-left: 20px;
        background: url(~@/assets/imgs/version.svg) no-repeat ;
        background-size: 16px 16px;
        font-size: 14px;
        color: #8A8A8A;
      }
      .appstatus {
        margin-left: 20px;
        padding-left: 16px;
        width: 58px;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        text-align: center;
        &.appstatus1 {
          background: url(~@/assets/imgs/orange.png) no-repeat;
          background-size: 12px 12px;
          background-position: left center;
          color: #FA8B16;
        }
        &.appstatus2 {
          background: url(~@/assets/imgs/light-blue.png) no-repeat center ;
          background-size: 12px 12px;
          background-position: left center;
          color: #36A4FF;
        }
        &.appstatus3 {
          background: url(~@/assets/imgs/green.png) no-repeat;
          background-size: 12px 12px;
          background-position: left center;
          color: #4CC09E;
        }
        &.appstatus4{
          background: url(~@/assets/imgs/gray.png) no-repeat center ;
          background-size: 12px 12px;
          background-position: left center;
          color: #8A8A8A;
        }
      }
      .title {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        font-weight: 500;
        color: #202020;
        span{
          position: relative;
          z-index: 2;
        }
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
      .scene-tag {
        margin-right: 20px;
        display: inline-block;
        padding: 0 8px 0 32px;
        border-radius: 100px;
        background: url(~@/assets/imgs/bg-scene.png) no-repeat;
        background-size: 18px 18px;
        background-position: 8px center;
        background-color: #F6F9FB;
        color: #8A8A8A;
      }
    }
  }
  .tab-wrapper {
    width: 100%;
    background: #FFFFFF;
    .right-btns {
      top: 20px;
      right: 2px;
    }
  }
  .tab-wrap {
    height: 72px;
    .width {
      height: 100%;
    }
  }
  .main {
    margin-top: 8px;
    margin-bottom: 20px;
    .info-title {
      padding-top: 0px;
    }
  }
}
.firm-wrap {
  display: flex;
  p {
    width: 30%;
    margin-right: 20px;
    margin-bottom: 12px;
    height: 38px;
    line-height: 38px;
    border: 1px solid #E4E9ED;
    overflow: hidden;
    &:first-child {
      width: 40%;
    }
    &:last-child {
      margin-right: 0;
      margin-bottom: 0;
    }
  }
  .firm-label {
    width: 144px;
    padding-left: 12px;
    display: inline-block;
    background: #F6F9FB;
    border-right: 1px solid #E4E9ED;
  }
  .firm-value {
    padding-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.label-item {
  display: inline-block;
  margin-right: 4px;
  padding: 0 4px;
  height: 20px;
  line-height: 20px;
  background: rgba(54, 164, 255, 0.1);
  border-radius: 2px;
  font-size: 12px;
  color: $primaryColor;
  text-align: center;
}
.file-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.file-item {
  width: 390px;
  position: relative;
  display: inline-block;
  height: 56px;
  line-height: 56px;
  padding-left: 56px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  background: #F9FAFE;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    background: url(~@/assets/imgs/pack.png) no-repeat center;
  }
  &:nth-child(n+4) {
    margin-top: 20px;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.file-item-empty {
  opacity: 0;
}
::v-deep .c-tabs {
  .c-tabs__nav-item {
    height: 72px;
    line-height: 72px;
    padding: 0 32px;
  }
}
::v-deep.c-form{
  .c-form-item {
    padding-left: 0 !important;
  }
  .c-form-item__label {
    color: #8A8A8A;
  }
  .c-textarea.is-disabled .c-textarea__inner {
    background: white;
    color: #404040;
  }
  .c-form-item__content {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
  }
}
.search-tag {
  padding: 0px 4px;
  height: 22px;
  line-height: 22px;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  color: #8A8A8A;
  font-size: 12px;
  margin-right: 8px;
  border: 1px solid #E4E9ED;
  background: #F6F9FB;
}
.tag-list{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 600px;
  color: #36A4FF;
}
::v-deep.refer-asset-tab {
  padding-left: 0;
  .c-tabs__content {
    display: none;
  }
  .c-tabs__nav-item {
    padding: 0 18px;
  }
}
.textarea-val {
  max-height: 300px;
  overflow: auto;
}
::v-deep.c-form {
  .c-form-item {
    padding-left: 0 !important;
  }
  .c-form-item__label {
    color: #8a8a8a;
  }
  .c-form-item__content {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    font-weight: 500;
  }
}
.right-btns {
  position: absolute;
  right: 0px;
  top: 8px;
  .btn-pre {
    display: inline-block;
  }
  .btn {
    margin-left: 16px;
  }
}
</style>
