<!--
 * @Description: 接口详情
 * @Author:
 * @Date:
-->
<template>
  <div class="detail scrollDom" @scroll.self="onscroll">
    <div class="top">
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 1" class="tips width">
        <span>当前页面为资源快照，展示资源订阅时的资源信息</span>
        <span class="link" @click.prevent="showCurrAsset">查看资源详情</span>
      </div>
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 2" class="tips width">
        <span>当前页面为资源快照，展示资源订阅时的资源信息，当前资源已有版本更新</span>
        <span class="link" @click.prevent="showNewAsset">查看最新资源详情</span>
      </div>
      <div v-show="isSnapshoot&&showsnapshootinfo&&infoFlag === 3" class="tips width">
        <span>当前页面为资源快照，展示资源订阅时的资源信息，当前资源已下架</span>
        <span class="link" @click.prevent="showALLAsset">查看更多资源</span>
      </div>
      <div class="top-wrap width">
        <div class="img icon-asset-api"></div>
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
            <div v-if="pageInfo.assetSubtype==14" class="flex-item">
              <p class="label">体征类型</p>
              <p class="value">{{ CATEGORY_TYPES[pageInfo.bizType]||'--' }}</p>
            </div>
            <div v-else-if="pageInfo.assetSubtype==72" class="flex-item">
              <p class="label">模型类型</p>
              <p class="value">{{ CATEGORY_TYPES[pageInfo.bizType]||'--' }}</p>
            </div>
            <div class="flex-item">
              <p class="label">建设部门</p>
              <c-tooltip :disabled="!pageInfo.contactInfo.buildDeptName" :content="pageInfo.contactInfo.buildDeptName" placement="top">
                <p class="value">
                  {{ pageInfo.contactInfo.buildDeptName||'--' }}
                </p>
              </c-tooltip>
            </div>
            <div class="flex-item">
              <p class="label">申请次数</p>
              <p class="value">{{ pageInfo.downloadCount||0 }}</p>
            </div>
            <div class="flex-item">
              <p class="label">更新时间</p>
              <p class="value">{{ pageInfo.updateTime||'--' }}</p>
            </div>
          </div>
          <template v-if="!hidebtn&&pageInfo.packStatus==4&&!isSnapshoot">
            <div class="right-btns">
              <c-button class="btn btn-secondary" @click.stop="clickAddShopCar(pageInfo)">
                {{ "加入购物车" }}
              </c-button>
              <c-button type="primary" class="btn" @click.stop="clickSub">
                {{ "订阅" }}
              </c-button>
            </div>
          </template>
        </div>
      </div>
      <p class="width packdesc">{{ pageInfo.packDesc || '--' }}</p>
    </div>
    <div class="tab-wrapper fixedTabDom" :class="{fixtop:tabFixed}">
      <div class="width">
        <c-tabs v-model="tabActive" type="nav" class="tab-wrap" @tab-click="clickTab">
          <c-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
        </c-tabs>
        <template v-if="!hidebtn&&pageInfo.packStatus==4&&!isSnapshoot">
          <div v-show="tabFixed" class="right-btns">
            <c-button class="btn btn-secondary" @click.stop="clickAddShopCar(pageInfo)">
              {{ "加入购物车" }}
            </c-button>
            <c-button type="primary" class="btn" @click.stop="clickSub">
              {{ "订阅" }}
            </c-button>
          </div>
        </template>
      </div>
    </div>
    <div class="main width">
      <c-form ref="refForm" :model="formData" label-position="top">
        <div class="box-wrap">
          <h3 class="info-title ziyuanmiaoshu">基础信息</h3>
          <c-row :gutter="24">
            <c-col :span="8">
              <c-form-item label="来源应用">
                <span>{{ pageInfo.oriAppPackName||'--' }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="所属地区">
                <span>{{ pageInfo.contactInfo.district||'--' }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="建设部门">
                <span>{{ pageInfo.contactInfo.buildDeptName | emptyFilter }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="联系人">
                <span>{{ pageInfo.contactInfo.contactUserName | emptyFilter }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="电话">
                <span>{{ pageInfo.contactInfo.contactPhone | emptyFilter }}</span>
              </c-form-item>
            </c-col>
            <c-col :span="8">
              <c-form-item label="邮箱">
                <span>{{ pageInfo.contactInfo.contactEmail | emptyFilter }}</span>
              </c-form-item>
            </c-col>
          </c-row>
          <c-form-item label="详细说明">
            <vue-tinymce :editor-content="pageInfo.detailDesc||'--'" :status="1" class="cls-tinymce" />
          </c-form-item>
        </div>
        <div class="design box-wrap">
          <div>
            <h3 class="info-title diaoyongxinxi">调用信息</h3>
            <!--  接口-->
            <c-collapse v-model="interfaceShowDataActiveName" accordion class="interface-collapse">
              <c-collapse-item v-for="item,i in interfaceShowData" :key="i" :name="i+''">
                <template slot="title">
                  <div class="collapse-title-box">
                    <div class="line"></div>
                    <div class="path">
                      <p class="label">请求路径</p>
                      <p class="value">{{ item.path }}</p>
                    </div>
                    <div class="method">
                      <p class="label">请求方法</p>
                      <p class="value">{{ (item.method||"").toUpperCase() }}</p>
                    </div>
                  </div>
                </template>
                <div class="content">
                  <c-tabs v-model="item.tab" type="box" class="tabs-box">
                    <c-tab-pane label="入参" name="1"></c-tab-pane>
                    <c-tab-pane label="出参" name="2"></c-tab-pane>
                  </c-tabs>
                  <c-table v-if="item.tab=='1'" :key="i+'item.tab==1'" :data="item.inputData">
                    <c-table-column type="index" label="" />
                    <c-table-column prop="name" label="参数名称" show-overflow-tooltip />
                    <c-table-column prop="in" label="参数位置" show-overflow-tooltip />
                    <c-table-column prop="type" label="类型" show-overflow-tooltip>
                    </c-table-column>
                    <c-table-column prop="required" label="必填" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{ scope.row.required?true:false }}
                      </template>
                    </c-table-column>
                    <c-table-column prop="fillInFlag" label="默认值" show-overflow-tooltip>
                      <template>
                        --
                      </template>
                    </c-table-column>
                    <c-table-column prop="pkFlag" label="参数限制" show-overflow-tooltip>
                      <template>
                        --
                      </template>
                    </c-table-column>
                    <c-table-column prop="desc" label="描述" show-overflow-tooltip>

                    </c-table-column>
                  </c-table>
                  <c-table v-if="item.tab=='2'" :key="i+'item.tab==2'" :data="item.outputData">
                    <c-table-column type="index" label="" />
                    <c-table-column prop="name" label="参数名称" show-overflow-tooltip />
                    <c-table-column prop="in" label="参数位置" show-overflow-tooltip />
                    <c-table-column prop="type" label="类型" show-overflow-tooltip>
                    </c-table-column>
                    <c-table-column prop="required" label="必填" show-overflow-tooltip>
                      <template slot-scope="scope">
                        {{ scope.row.required?true:false }}
                      </template>
                    </c-table-column>
                    <c-table-column prop="fillInFlag" label="默认值" show-overflow-tooltip>
                      <template>
                        --
                      </template>
                    </c-table-column>
                    <c-table-column prop="pkFlag" label="参数限制" show-overflow-tooltip>
                      <template>
                        --
                      </template>
                    </c-table-column>
                    <c-table-column prop="desc" label="描述" show-overflow-tooltip>

                    </c-table-column>
                  </c-table>
                  <div v-if="item.tab=='2' && item.body" class="body-box">
                    <span class="label">Body描述</span>
                    <span class="value">{{ item.body }}</span>
                  </div>
                </div>
              </c-collapse-item>

            </c-collapse>
          </div>
        </div>
        <div class="box-wrap">
          <h3 class="info-title diaoyongshujushilie">调用数据示例</h3>
          <c-form-item label="">
            <vue-tinymce :editor-content="pageInfo.instruction||'--'" :status="1" class="cls-tinymce" />
          </c-form-item>
        </div>
        <div v-if="showSubscribe" class="box-wrap">
          <h3 class="info-title dingyuexinxi">订阅补充信息</h3>
          <c-form-item label="补充说明">
            <vue-tinymce :editor-content="pageInfo.subInfo.desc||'--'" :status="1" class="cls-tinymce" />
          </c-form-item>
        </div>
        <div class="box-wrap">
          <h3 class="info-title banbenxinxi">版本信息</h3>
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
            <div class="textarea-val" v-html="textAreaFilter(designInfo.desc||'--')"></div>
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
      :pack-version-id="pageInfo.packVersionId"
      @close="closeSubDialog" />
    <shopCarAdd
      :visible="shopCarAddFlag"
      :data="pageInfo"
      @close="closeSubDialog"
    />
    <!-- 文件下载 -->
    <a ref="refDownloadFile" :href="download.url" :download="download.name" />
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import PageFooter from '@/components/footer'
import vueTinymce from '@/components/tinymce'
import subDialog from './sub-dialog.vue'
import {
  queryPublishDetailApi,
  queryVersion
} from '@/api/index'
import { API_PACK_STATUS, asseTypeFormatLong, CATEGORY_TYPES } from '@/utils/enum'
import { getToken } from '@l/utils/auth'
import { formatInterfaceShowData } from '@/utils'
import shopCarAdd from './shop-car-add.vue'
import appraise from '@/views/home/components/appraise.vue'
export default {
  name: 'Detail',
  components: { vueTinymce, PageFooter, subDialog, shopCarAdd, appraise },
  filters: {
    emptyFilter(str) {
      return str || '--'
    },
    typeFilter(item, systype) {
      if (systype === 'jiekou' || systype === 'tizheng') {
        return asseTypeFormatLong('', item.assetSubtype)
      }
      return asseTypeFormatLong(item.assetType, item.assetSubtype, ' - ')
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
    }
  },
  props: {
    shopCode: { type: [String, Number], default: '' },
    packVersion: { type: [String, Number], default: '' },
    packVersionId: { type: [String, Number], default: '' },
    isSnapshoot: { type: Boolean, default: false },
    showsnapshootinfo: { type: Boolean, default: true },
    showfooter: { type: Boolean, default: true },
    showSubscribe: { type: Boolean, default: false },
    systype: String,
    showthird: { type: Boolean, default: true },
    hideappraise: { type: Boolean, default: false },
    hidebtn: Boolean,
    customClickTab: Function
  },
  data() {
    return {
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      interfaceShowDataActiveName: '0',
      interfaceShowData: [],
      activeName: '1',
      activeNameData: '1',
      activeNameInterface: '1',
      hideNewAsset: false,
      dialogFlagSub: false,
      shopCarAddFlag: false,
      btnLoading: false,
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
        subInfo: {},
        contactInfo: {}
      },
      PACK_STATUS: API_PACK_STATUS,
      CATEGORY_TYPES,
      newPackInfo: {},
      download: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    tabs() {
      let arr = ['基础信息', '调用信息', '调用数据示例', '订阅补充信息', '版本信息', '资源评价']
      if (!this.showSubscribe) {
        arr = arr.filter(d => d !== '订阅补充信息')
      }
      if (this.hideappraise) {
        arr = arr.filter(d => d !== '资源评价')
      }
      return arr
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
    clickAddShopCar(item) {
      this.shopCarAddFlag = true
    },
    login() {
      if (!getToken()) {
        this.$store.dispatch('user/resetToken')
        return true
      }
    },
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    closeSubDialog() {
      this.dialogFlagSub = false
      this.shopCarAddFlag = false
    },
    // 订阅
    clickSub() {
      if (this.login()) return
      this.dialogFlagSub = true
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
        query: {
          ...this.$route.query,
          shopCode: this.shopCode,
          packVersion: this.newPackInfo.packVersion,
          packVersionId: this.newPackInfo.packVersionId
        }
      })
    },
    // 点击查看最新资源
    showCurrAsset() {
      this.$router.push({
        path: '/home/detail',
        query: {
          ...this.$route.query,
          shopCode: this.shopCode,
          packVersion: this.newPackInfo.packVersion,
          packVersionId: this.newPackInfo.packVersionId
        }
      })
    },
    // 点击查看最新资源
    showALLAsset() {
      this.$router.push({
        path: '/home'
      })
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
      if (this.tabActive === '调用数据示例') {
        top = document.querySelector('.diaoyongshujushilie').getBoundingClientRect().top
      } else if (this.tabActive === '版本信息') {
        top = document.querySelector('.banbenxinxi').getBoundingClientRect().top
      } else if (this.tabActive === '基础信息') {
        top = document.querySelector('.ziyuanmiaoshu').getBoundingClientRect().top
      } else if (this.tabActive === '调用信息') {
        top = document.querySelector('.diaoyongxinxi').getBoundingClientRect().top
      } else if (this.tabActive === '订阅补充信息') {
        top = document.querySelector('.dingyuexinxi').getBoundingClientRect().top
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
        const param = {
          shopCode: this.shopCode,
          packVersion: this.packVersion,
          packVersionId: this.packVersionId
        }
        queryPublishDetailApi(param).then((res) => {
          res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
          res.data.subInfo = res.data.subInfo ? JSON.parse(res.data.subInfo) : {}
          this.pageInfo = res.data
          console.log(this.pageInfo)
          const designInfo = res.data.designInfo ? JSON.parse(res.data.designInfo) : {}
          this.designInfo = res.data.designInfo ? {
            ...designInfo,
            dataDef: designInfo.dataDef ? JSON.parse(designInfo.dataDef) : {},
            previewImagePath: designInfo.previewImagePath
          } : {
            dataDef: {},
            previewImagePath: ''
          }
          // 如果是应用中枢的接口资源需要变换数据格式
          this.interfaceShowData = formatInterfaceShowData(this.designInfo.dataDef)
          this.packVersion = res.data.packVersion
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
          this.newPackInfo = item
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
      background-position: center;
      background-size: 48px 48px;
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
      .type-tag {
        display: inline-block;
        margin-left: 19px;
        padding: 0 10px;
        height: 22px;
        line-height: 22px;
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
::v-deep .c-tabs {
  .c-tabs__nav-item {
    height: 72px;
    line-height: 72px;
    padding: 0 32px;
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
  &::v-deep {
    .c-tabs {
      padding-left: 20px !important;
    }
    .c-table th {
      background-color: #f1f3f8;
    }
    .c-table__body-wrapper {
      background-color: #f9fafe;
    }
    .c-table tr {
      background-color: #f9fafe;
    }
  }
}
.tabs-box {
  height: 72px;
  display: flex;
  align-items: center;
  background: #f9fafe;
  &::v-deep {

    .c-tabs__content {
      display: none;
    }
    .c-tabs__header {
      margin: 0;
    }
  }
}

.interface-collapse{
  &::v-deep{
    .c-icon-caret-bottom:before{
      content: "\e6df";
    }
    .c-collapse-item__header{
      height: 80px;
      &:first-child{
        border-top: 1px solid #EDEDED;
      }
    }
    .c-collapse-item__content{
      padding-bottom:0px;
    }
    .is-active{
      .c-icon-caret-bottom{
        color:#1E6FFF !important ;
      }
      .line{
        background: #1E6FFF !important;
      }
    }
  }
  .collapse-title-box{
    width: 1168px;
    display: flex;
    justify-content:space-between;
    .line{
      width: 4px;
      height: 80px;
      background: rgba(30, 111, 255, 0.2);
    }

    .path{
      width: 1110px;
      padding: 15px 0 15px 16px;
      .label{
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
      }
      .value{
        margin-top: 10px;
        font-weight: 400;
        color: #4B4B4B;
        line-height: 20px;
      }
    }
    .method{
      padding: 15px 0 15px 0px;
      .label{
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
      }
      .value{
        margin-top: 10px;
        font-weight: 400;
        color: #4B4B4B;
        line-height: 20px;
      }
    }
  }
  .body-box{
    padding: 20px;
    background: #F9FAFE;
    display: flex;
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
.obj-table{
  &::v-deep {
    .c-table th {
      background-color: #F9FAFE;
    }
    .c-table__body-wrapper {
      background-color: #fff;
    }
    .c-table tr {
      background-color: #fff;
    }
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
