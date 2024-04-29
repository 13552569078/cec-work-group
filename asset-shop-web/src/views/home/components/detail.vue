<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
-->
<template>
  <div class="detail scrollDom" @scroll.self="onscroll">
    <div class="top">
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 1" class="tips width">
        <span>当前页面为资源快照，展示资源{{ pageInfo.assetSource!=1?'订阅':'下载' }}时的资源信息</span>
        <span class="link" @click.prevent="showCurrAsset">查看商城基础信息</span>
      </div>
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 2" class="tips width">
        <span>当前页面为资源快照，展示资源{{ pageInfo.assetSource!=1?'订阅':'下载' }}时的资源信息，当前资源已有版本更新</span>
        <span class="link" @click.prevent="showNewAsset">查看最新基础信息</span>
      </div>
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 3" class="tips width">
        <span>当前页面为资源快照，展示资源{{ pageInfo.assetSource!=1?'订阅':'下载' }}时的资源信息，当前资源已下架</span>
        <span class="link" @click.prevent="showALLAsset">查看更多资源</span>
      </div>
      <div class="top-wrap width">
        <div :class="`img ${assetClass(pageInfo)}`"></div>
        <div class="info">
          <div class="title-box">
            <h3 class="title"><span>{{ pageInfo.packName | emptyFilter }}</span></h3>
            <span class="f14 version">{{ pageInfo.packVersion | emptyFilter }}</span>
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
              <p class="label">资源类型</p>
              <p class="value">{{ pageInfo | typeFilter(systype) }}</p>
            </div>
            <div v-if="pageInfo.assetSubtype==23" class="flex-item">
              <p class="label">页面类型</p>
              <p class="value">{{ PAGE_TYPES[pageInfo.bizType]||'--' }}</p>
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
              <p class="label">{{ pageInfo.assetSource!=1?'订阅次数':'申请次数' }}</p>
              <p class="value">{{ pageInfo.downloadCount || 0 }}</p>
            </div>
            <div class="flex-item">
              <p class="label">更新时间</p>
              <p class="value">{{ pageInfo.updateTime || '--' }}</p>
            </div>
          </div>
          <div v-if="!hidebtn&&pageInfo.packStatus === 4 && !isSnapshoot" class="right-btns">
            <c-button v-if="![1,2,3].includes(+pageInfo.downloadStatus)" class="btn btn-shopcar btn-secondary" @click.stop="clickAddShopCar(pageInfo)">加入购物车</c-button>
            <c-button v-if="pageInfo.assetSource==1" type="primary" :disabled="pageInfo.downloadStatus==1" class="btn" @click.stop="clickDownload">
              {{ DOWNLOAD[pageInfo.downloadStatus] || "下载" }}
            </c-button>
            <c-button v-else type="primary" class="btn" @click.stop="clickSub">
              {{ "订阅" }}
            </c-button>
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
        <template v-if="!hidebtn&&pageInfo.packStatus === 4 && !isSnapshoot">
          <div v-show="tabFixed" class="right-btns">
            <c-button v-if="![1,2,3].includes(+pageInfo.downloadStatus)" class="btn btn-shopcar btn-secondary" @click.stop="clickAddShopCar(pageInfo)">加入购物车</c-button>
            <c-button v-if="pageInfo.assetSource==1" type="primary" :disabled="pageInfo.downloadStatus==1" class="btn" @click.stop="clickDownload">
              {{ DOWNLOAD[pageInfo.downloadStatus] || "下载" }}
            </c-button>
            <c-button v-else type="primary" class="btn" @click.stop="clickSub">
              {{ "订阅" }}
            </c-button>
          </div>
        </template>
      </div>
    </div>
    <div class="main width">
      <c-form ref="refForm" :model="formData" label-position="top" class="disabled-new">
        <div class="box-wrap">
          <h3 class="info-title ziyuanmiaoshu">基础信息</h3>
          <c-row>
            <c-col :span="24">
              <c-form-item label="来源应用">{{ pageInfo.oriAppPackName || '--' }}</c-form-item>
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
          <c-form-item label="详细说明">
            <vue-tinymce :editor-content="pageInfo.detailDesc||'--'" :status="1" class="cls-tinymce" />
          </c-form-item>
        </div>
        <div class="design">
          <div v-if="pageInfo.assetType=='5'&&pageInfo.assetSubtype=='51'" class="box-wrap">
            <h3 class="info-title zichanyulan">流程预览</h3>
            <!--  流程-->
            <c-image style="width: 100px; height: 100px" class="img-border" :src="previewUrl+designInfo.previewImagePath"
                     :preview-src-list="[previewUrl+designInfo.previewImagePath]">
            </c-image>
          </div>
          <div v-if="pageInfo.assetType=='2'&&pageInfo.assetSubtype=='23' && designInfo.previewImagePath" class="box-wrap">
            <h3 class="info-title zichanyulan">页面预览</h3>
            <!--  页面-->
            <c-image style="width: 100%; " :src="previewUrl+designInfo.previewImagePath"
                     :preview-src-list="[previewUrl+designInfo.previewImagePath]">
            </c-image>
          </div>
          <div v-if="pageInfo.assetType=='3'&&pageInfo.assetSubtype=='31'" class="obj-table box-wrap">
            <h3 class="info-title zichanyulan" style="margin-bottom:0px">对象资源预览</h3>
            <!--  对象-->
            <c-tabs v-model="activeName" type="box" class="tabs-box" style="background:#fff;padding-left: 0px !important">
              <c-tab-pane label="业务字段" name="1"></c-tab-pane>
              <c-tab-pane label="索引" name="2"></c-tab-pane>
            </c-tabs>
            <c-table v-if="activeName=='1'" :key="'activeName==1'" :data="designInfo.dataDef.column" :border="true">
              <c-table-column type="index" label="#" />
              <c-table-column prop="comment" label="字段名称" show-overflow-tooltip />
              <c-table-column prop="filedName" label="字段标识" show-overflow-tooltip />
              <c-table-column prop="type" label="字段类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.type|columTypeFilter }}
                </template>
              </c-table-column>
              <c-table-column prop="nullable" label="是否必填" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ !scope.row.nullable?'是':'否' }}
                </template>
              </c-table-column>
            </c-table>
            <c-table v-if="activeName=='2'" :key="'activeName==2'" :data="designInfo.dataDef.index" :border="true">
              <c-table-column type="index" label="#" />
              <c-table-column prop="indexName" label="索引名称" show-overflow-tooltip />
              <c-table-column prop="uniqueness" label="索引类型" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ !!scope.row.uniqueness?'唯一索引':'普通索引' }}
                </template>
              </c-table-column>
              <c-table-column prop="type" label="索引字段" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row.columns.map(item=>item.filedName).join(',') }}
                </template>
              </c-table-column>
            </c-table>
          </div>
        </div>
        <template v-if="pageInfo.assetSource==1">
          <div class="box-wrap">
            <h3 class="info-title shiyongzhinan">使用指南</h3>
            <c-form-item label="使用说明">
              <vue-tinymce :height="160" :editor-content="pageInfo.instruction" :status="1"
                           class="cls-tinymce" />
            </c-form-item>
            <c-form-item label="附件">
              <span v-if="!(pageInfo.attachList && pageInfo.attachList.length)">--</span>
              <div v-else class="file-wrap">
                <div v-for="item in pageInfo.attachList" :key="item.fileName" class="file-item"
                     @click="downloadFile(item)">
                  <p>{{ item.fileName }}</p>
                </div>
                <i v-for="i in emptyEl" :key="`emptyEl-${i}`" class="file-item file-item-empty" />
              </div>
            </c-form-item>
          </div>
          <div class="box-wrap">
            <h3 class="info-title yinyongzichan">引用资源</h3>
            <c-form-item label="">
              <c-table :data="pageInfo.referAssetList" :border="true">
                <c-table-column type="index" label="#" />
                <c-table-column prop="referAssetName" label="资源名称" show-overflow-tooltip />
                <c-table-column prop="referAssetCode" label="资源编码" show-overflow-tooltip />
                <c-table-column prop="referAssetVersion" label="资源版本号" show-overflow-tooltip />
                <c-table-column prop="referAssetSubtype" label="资源类型" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row | assetTypeFilter }}
                  </template>
                </c-table-column>
                <c-table-column prop="referAssetDesc" label="基础信息" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.referAssetDesc||'--' }}
                  </template>
                </c-table-column>
              </c-table>
            </c-form-item>
          </div>
        </template>
        <div v-if="!isSnapshoot" class="box-wrap">
          <h3 class="info-title banbenlishi">版本信息</h3>
          <c-row :gutter="24">
            <c-col :span="8">
              <c-form-item label="上架时间">
                <span>{{ pageInfo.packTime | emptyFilter }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="最近更新">
                <span>{{ pageInfo.updateTime | emptyFilter }}</span>
              </c-form-item>
            </c-col>
          </c-row>
          <c-row :gutter="24">
            <c-col :span="8">
              <c-form-item label="版本号">
                <span>{{ pageInfo.packVersion | emptyFilter }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="状态">
                <span>{{ PACK_STATUS[pageInfo.packStatus] | emptyFilter }}</span>
              </c-form-item>
            </c-col>
          </c-row>
          <c-form-item label="版本说明">
            <div class="textarea-val" v-html="textAreaFilter(pageInfo.packVersionDesc||'--')"></div>
          </c-form-item>
        </div>
        <div v-if="!hideappraise" class="box-wrap">
          <h3 class="info-title ziyuanpingjia">资源评价</h3>
          <appraise :shop-code="shopCode" />
        </div>
      </c-form>
    </div>
    <page-footer v-if="showfooter" />
    <subDialog
      v-if="dialogFlagSub"
      :dialog-flag="dialogFlagSub"
      :datainfo="pageInfo"
      :shop-code="pageInfo.shopCode"
      :pack-version="pageInfo.packVersion"
      @close="closeSubDialog" />
    <downloadDialog
      v-if="dialogFlagDownload"
      :dialog-flag="dialogFlagDownload"
      :datainfo="pageInfo"
      :shop-code="pageInfo.shopCode"
      :pack-version="pageInfo.packVersion"
      :pack-version-id="pageInfo.packVersionId"
      @close="closeSubDialog" />
    <!-- 文件下载 -->
    <a ref="refDownloadFile" :href="download.url" :download="download.name" />
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import PageFooter from '@/components/footer'
import vueTinymce from '@/components/tinymce'
import subDialog from './sub-dialog.vue'
import downloadDialog from './download-dialog.vue'
import {
  queryPublishDetail,
  downloadPack,
  queryVersion
} from '@/api/index'
import { PACK_STATUS, DOWNLOAD, fieldTypeList, asseTypeFormatLong, PAGE_TYPES } from '@/utils/enum'
import { getToken } from '@l/utils/auth'
import { formatInterfaceShowData } from '@/utils'
import appraise from '@/views/home/components/appraise.vue'
export default {
  name: 'Detail',
  components: { vueTinymce, PageFooter, subDialog, downloadDialog, appraise },
  filters: {
    emptyFilter(str) {
      return str || '--'
    },
    columTypeFilter(item) {
      return fieldTypeList[item] && fieldTypeList[item].textName || item
    },
    typeFilter(item, systype) {
      if (systype === 'jiekou' || systype === 'tizheng') {
        return asseTypeFormatLong('', item.assetSubtype)
      }
      return asseTypeFormatLong(item.assetType, item.assetSubtype, ' - ')
    },
    assetTypeFilter(item) {
      return asseTypeFormatLong(item.referAssetType, item.referAssetSubtype)
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      // return (bytes / Math.pow(k, i)) + sizes[i]
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
    systype: String,
    showthird: { type: Boolean, default: true },
    hideappraise: { type: Boolean, default: false },
    hidebtn: Boolean,
    customClickTab: Function
  },
  data() {
    return {
      interfaceShowDataActiveName: '0',
      interfaceShowData: [],
      activeName: '1',
      activeNameData: '1',
      activeNameInterface: '1',
      packType: this.$route.path.includes('templateApp/') ? 2 : 1,
      hideNewAsset: false,
      dialogFlagSub: false,
      dialogFlagDownload: false,
      btnLoading: false,
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      tabFixed: false,
      infoFlag: 0,
      tabActive: '基础信息',
      formData: {},
      designInfo: {
        dataDef: {},
        previewImagePath: ''
      },
      pageInfo: {
        tagList: [],
        packFile: {},
        attachList: [],
        imageList: [],
        contactInfo: {}
      },
      PACK_STATUS,
      DOWNLOAD,
      PAGE_TYPES,
      download: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    titleShow() {
      let res
      switch (this.pageInfo.assetSubtype * 1) {
        case 51:
          res = '流程预览'
          break
        case 23:
          if (this.designInfo.previewImagePath) { res = '页面预览' }
          break
        case 31:
          res = '对象资源预览'
          break
        default:
          break
      }
      return res
    },
    tabs() {
      let arr = ['基础信息', this.titleShow, '使用指南', '引用资源', '版本信息']
      if (this.pageInfo.assetSource !== 1) {
        arr = ['基础信息', this.titleShow, '版本信息']
      }
      if (this.isSnapshoot) {
        arr = arr.filter(item => item !== '版本信息')
      }
      if (!this.hideappraise) {
        arr.push('资源评价')
      }
      return arr.filter(item => item)
    },
    emptyEl() {
      let n = this.pageInfo.attachList.length % 3
      n = n ? 3 - n : n
      return n
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
    login() {
      if (!getToken()) {
        this.$store.dispatch('user/resetToken')
        return true
      }
    },
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    assetClass(item) {
      const assetType = +item.assetType
      const assetSubtype = +item.assetSubtype
      switch (assetType) {
        case 5: return 'icon-asset-flow'
        case 3: return 'icon-asset-object'
        case 1: return 'icon-asset-kpi'
        case 2:
          if (assetSubtype === 22) return 'icon-asset-api'
          if (assetSubtype === 23) return 'icon-asset-page'
          if (assetSubtype === 26) return 'icon-asset-script'
          if (assetSubtype === 27) return 'icon-asset-supportapp'
          break
        case 7: return 'icon-asset-model'
      }
      return ''
    },
    closeSubDialog() {
      this.dialogFlagSub = false
      this.dialogFlagDownload = false
    },
    // 订阅
    clickSub() {
      if (this.login()) return
      this.dialogFlagSub = true
    },
    clickAddShopCar(item) {
      this.$store.dispatch('shopCar/addToCart', { params: { packVersionId: item.packVersionId, applyType: 1 }})
    },
    // 下载附件
    downloadFile(file) {
      this.download.name = file.fileName
      this.download.url = `${getProxyUrl(serviceSuffix.file_upload)}/fdfs/download?relativePath=${file.filePath}&filename=${encodeURI(file.fileName)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    // 点击查看最新资源
    showNewAsset() {
      this.$router.push({
        path: '/home/detail',
        query: { shopCode: this.shopCode }
      })
    },
    // 点击查看最新资源
    showCurrAsset() {
      this.$router.push({
        path: '/home/detail',
        query: { shopCode: this.shopCode }
      })
    },
    // 点击查看最新资源
    showALLAsset() {
      this.$router.push({
        path: '/home'
      })
    },
    // 下载包
    clickDownload() {
      console.log(this.packType, '[[[[')
      if (this.login()) return
      if (this.pageInfo.downloadStatus === 1) return
      // 审核中跳转至审核详情
      if (this.pageInfo.downloadStatus === 3) {
        const path = this.$router.resolve({
          path: '/myApply/assetDetail',
          query: {
            shopCode: this.pageInfo.shopCode,
            packVersion: this.pageInfo.packVersion,
            packVersionId: this.pageInfo.packVersionId,
            assetType: this.pageInfo.assetSubtype
          }
        })
        window.open(path.href, '_blank')
        return
      }
      this.dialogFlagDownload = true
    },
    async downloadFn(item) {
      try {
        const param = {
          packVersionId: this.packVersionId
        }
        await downloadPack(param)
        this.queryData(true)
      } catch (e) {
        // this.btnLoading = this.btnLoading.filter(d => d !== item.shopCode)
      }
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
      if (this.tabActive === '引用资源') {
        top = document.querySelector('.yinyongzichan').getBoundingClientRect().top
      } else if (this.tabActive === '使用指南') {
        top = document.querySelector('.shiyongzhinan').getBoundingClientRect().top
      } else if (this.tabActive === '版本信息') {
        top = document.querySelector('.banbenlishi').getBoundingClientRect().top
      } else if (this.tabActive === '基础信息' || this.tabActive === '基础信息') {
        top = document.querySelector('.ziyuanmiaoshu').getBoundingClientRect().top
      } else if (this.tabActive === '资源评价') {
        top = document.querySelector('.ziyuanpingjia').getBoundingClientRect().top
      } else {
        top = document.querySelector('.zichanyulan').getBoundingClientRect().top
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
        queryPublishDetail(this.packVersionId).then((res) => {
          res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
          this.pageInfo = res.data
          if (this.pageInfo.assetSource !== 1) {
            this.tabActive = '基础信息'
          }
          this.designInfo = res.data.designInfo ? {
            dataDef: JSON.parse(JSON.parse(res.data.designInfo).dataDef || '{}'),
            previewImagePath: JSON.parse(res.data.designInfo).previewImagePath
          } : {
            dataDef: {},
            previewImagePath: ''
          }
          // 如果是应用中枢的接口资源需要变换数据格式
          if (this.pageInfo.assetSource !== 1) {
            this.interfaceShowData = formatInterfaceShowData(this.designInfo.dataDef)
          }
          this.packVersion = res.data.packVersion
        })
        if (onlyDetail || this.isSnapshoot) return
      } catch (e) {
        //
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
        //
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
  position: fixed;
  top: 56px;
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
      background-size: 48px 48px;
      background-position: center;
      background-repeat: no-repeat;
    }
    .info {
      padding-top: 8px;
      position: relative;
      flex: 1;
      .title-box {
        height: 32px;
        display: flex;
        align-items: center;
      }
      .lh {
        line-height: 18px;
      }
      .version {
        margin-left: 20px;
        height: 16px;
        line-height: 16px;
        padding-left: 20px;
        background: url(~@/assets/imgs/version.svg) no-repeat ;
        background-size: 16px 16px;
        font-size: 14px;
        color: #8A8A8A;
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
  background: #f9fafe;
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
  &:nth-child(n + 4) {
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
::v-deep.swiper.c-carousel {
  .c-carousel__container {
    height: 100% !important;
  }
  .c-carousel__button {
    width: 30px;
    height: 5px;
    background: #eeeeee;
    opacity: 1;
  }
  .is-active .c-carousel__button {
    background: $primaryColor;
    opacity: 1;
  }
}
::v-deep .detail {
  .c-carousel__indicator.is-active button {
    background: $primaryColor;
  }
  .c-carousel__button {
    opacity: 1;
    background: #eeeeee;
  }
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
@keyframes progressmove {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
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
.tag-list {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 600px;
  color: #36a4ff;
}
.design {
  margin-bottom: 20px;
}
.tabs-box {
  height: 72px;
  display: flex;
  align-items: center;
  &::v-deep {

    .c-tabs__content {
      display: none;
    }
    .c-tabs__header {
      margin: 0;
    }
  }
}

.protocol{
  margin-bottom: 20px;
  .label{
    display: inline-block;
    font-weight: 400;
    color: #8A8A8A;
    line-height: 20px;
  }
  .value{
    display: inline-block;
    margin-left: 16px;
    font-weight: 400;
    color: #4B4B4B;
    line-height: 20px;
  }
}
.img-border{
  border: 1px solid #E7E7E7;
  border-radius: 2px;
}
::v-deep .c-tabs {
  .c-tabs__nav-item {
    height: 72px;
    line-height: 72px;
    padding: 0 32px;
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
