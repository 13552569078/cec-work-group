<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="detail-wrap-box-content refScrollDom" @scroll.self="onscroll">
    <div class="apply-info">
      <div class="d-box">
        <h3 class="info-title" data-section="shenqingxinxi">申请信息</h3>
        <div class="d-content">
          <div class="d-info width100">
            <div class="d-label">申请资源</div>
            <div class="d-value">{{ applyInfo.packName||'--' }}</div>
          </div>
          <div class="d-info">
            <div class="d-label">申请类型</div>
            <div class="d-value">{{ applyInfo.applyType|applyTypeListFilter }}</div>
          </div>
          <div class="d-info width70">
            <div class="d-label">适用终端</div>
            <div class="d-value">{{ applyInfo.subtype |subtypeFilter }}</div>
          </div>
          <div v-if="applyInfo.applyType==1||applyInfo.applyType==4" class="d-info ">
            <div class="d-label">申请资源主体</div>
            <div class="d-value">{{ applyInfo.referPackName }}</div>
          </div>
          <div v-if="applyInfo.applyType==4" class="d-info width70">
            <div class="d-label">应用名称</div>
            <div class="d-value">{{ applyInfo.appName }}</div>
          </div>
          <div class="d-info">
            <div class="d-label">所属地区</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.districtText||'--' }}</div>
          </div>
          <div class="d-info width70">
            <div class="d-label">申请部门</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.buildDeptName||'--' }}</div>
          </div>
          <div class="d-info ">
            <div class="d-label">联系人</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.contactName||'--' }}</div>
          </div>
          <div class="d-info ">
            <div class="d-label">电话</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.contactPhone||'--' }}</div>
          </div>
          <div class="d-info ">
            <div class="d-label">邮箱</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.contactEmail||'--' }}</div>
          </div>
          <div class="d-info width100">
            <div class="d-label">使用场景</div>
            <div class="d-value" v-html="textAreaFilter(applyInfo.applyExtendInfo.appDesc)"></div>
          </div>
          <div class="d-info width100">
            <div class="d-label">附件</div>
            <div class="d-value">
              <div v-if="applyInfo.applyExtendInfo.filePath&&applyInfo.applyExtendInfo.filePath.length" class="file-wrap">
                <div class="file-item" @click="downloadFile(applyInfo.applyExtendInfo.filePath[0])">
                  <p>{{ applyInfo.applyExtendInfo.filePath[0].name }}</p>
                </div>
              </div>
              <span v-else>--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="top">
        <div class="top-wrap width">
          <div class="img" :style="pageInfo.imageList|coverImg"></div>
          <div class="info">
            <div class="title-box">
              <h3 class="title"><span>{{ pageInfo.packName||'--' }}</span></h3>
              <span class="f14 version">{{ pageInfo.packVersion||'--' }}</span>
              <span class="f14 appstatus" :class="`appstatus${pageInfo.appStatus}`">{{ APP_STATUS[pageInfo.appStatus] }}</span>
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
                <p class="value">{{ pageInfo.assetSubtype | subtypeFilter }}</p>
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
          </div>
        </div>
        <p class="width packdesc">{{ pageInfo.packDesc || '--' }}</p>
      </div>
      <div class="tab-wrapper fixedTabDom">
        <c-tabs v-model="tabActive" type="nav" class="width tab-wrap" @tab-click="clickTab">
          <c-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
        </c-tabs>
      </div>
      <div class="main width">
        <c-form ref="refForm" label-position="top">
          <div class="box-wrap">
            <h3 class="info-title jichuxinxi" data-section="jichuxinxi">基础信息</h3>
            <c-row>
              <c-col :span="8">
                <c-form-item label="建设渠道">{{ CHANNEL[pageInfo.buildChannel] || '--' }}</c-form-item>
              </c-col>
              <c-col :span="8">
                <c-form-item label="与数字资源服务门户统一用户中心">{{ pageInfo.unifyUc==0?'否':'是' }}</c-form-item>
              </c-col>
              <c-col :span="8">
                <c-form-item label="网络类型">{{ NET_TYPE[pageInfo.netType] || '--' }}</c-form-item>
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
            <h3 class="info-title guanlianziyuan" data-section="guanlianziyuan">关联资源</h3>
            <c-form-item label="">
              <c-tabs v-model="referAssetTabName" type="box" class="refer-asset-tab">
                <c-tab-pane label="使用资源" name="referUseAssetList"></c-tab-pane>
                <c-tab-pane label="产生资源" name="referOutputAssetList"></c-tab-pane>
              </c-tabs>
              <c-table :data="pageInfo[referAssetTabName]" :border="true">
                <c-table-column type="index" label="#" width="50" />
                <c-table-column prop="referAssetName" label="资源名称" show-overflow-tooltip />
                <c-table-column prop="referAssetCode" label="资源编码" show-overflow-tooltip />
                <c-table-column prop="referAssetVersion" label="版本号" show-overflow-tooltip />
                <c-table-column prop="referAssetSubtype" label="数字资源" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ assetTypeFilter(scope.row.referAssetType, scope.row.referAssetSubtype) }}
                  </template>
                </c-table-column>
                <c-table-column prop="referAssetDesc" label="资源描述" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.referAssetDesc||'--' }}
                  </template>
                </c-table-column>
                <c-table-column prop="action" label="操作" width="60">
                  <template slot-scope="scope">
                    <c-button type="text" @click="clickViewBtn(scope.row)">查看</c-button>
                  </template>
                </c-table-column>
              </c-table>
            </c-form-item>
          </div>
          <div class="box-wrap">
            <h3 class="info-title banbenxinxi" data-section="banbenxinxi">版本信息</h3>
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
            <h3 class="info-title xiangmuxinxi" data-section="xiangmujichangshangxinxi">项目及厂商信息</h3>
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
                <span class="firm-label">{{ FIRM_TYPE[d.firmType]||'' }}</span>
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
            <h3 class="info-title anlizhidao" data-section="anlizhidao">案例指导</h3>
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
        </c-form>
      </div>
    </div>
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>
</template>
<script>
import vueTinymce from '@/components/tinymce'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { asseTypeFormat, ASEET_APPLY_TYPE, APP_STATUS, NET_TYPE, FIRM_TYPE, CHANNEL, PACK_STATUS, APP_TYPE } from '@/utils/enumerate'
import { queryPackDetailApp, applyDetailShop } from '@/api/manage'
export default {
  name: '',
  components: { vueTinymce },
  filters: {
    applyTypeListFilter(item) {
      return ASEET_APPLY_TYPE[item] || '--'
    },
    subtypeFilter(item = '') {
      const res = []
      item.split(',').forEach(d => {
        if (APP_TYPE[d]) {
          res.push(APP_TYPE[d])
        }
      })
      return res.length ? res.join(' ') : '--'
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
    packVersionId: [Number, String],
    applyId: [Number, String]
  },
  data() {
    return {
      isSnapshoot: true,
      DOWNLOAD_URL: getProxyUrl('file_upload') + '/fdfs/download',
      tabActive: '基础信息',
      tabs: ['基础信息', '版本信息', '项目及厂商信息', '案例指导'],
      applyInfo: {
        applyExtendInfo: {}
      },
      download: {
        name: '',
        url: ''
      },
      pageInfo: {
        tagList: [],
        packFile: {},
        attachList: [],
        imageList: [],
        contactInfo: {},
        projectInfo: {},
        firmInfo: [],
        caseGuide: {}
      },
      referAssetTabName: 'referUseAssetList',
      APP_STATUS, NET_TYPE, FIRM_TYPE, CHANNEL, PACK_STATUS
    }
  },
  created() {
    this.getData()
    this.getApplyDetail()
  },
  methods: {
    clickViewBtn(row) {
      const base = `${location.origin}/asset_shop_web/#`
      let path
      if (this.referAssetTabName === 'referOutputAssetList') {
        const basePath = +row.referAssetType === 99 ? '/templateApp/detail' : '/home/detail'
        const query = {
          shopCode: row.referAssetCode,
          packVersionId: row.referAssetVersionId,
          packVersion: row.referAssetVersion,
          assetType: row.referAssetSubtype
        }
        path = `${base}${basePath}?${Object.keys(query).map(k => k + '=' + query[k]).join('&')}`
      } else {
        const basePath = +row.referAssetType === 99 ? '/templateApp/snapshoot' : '/home/snapshoot'
        const query = {
          shopCode: row.referAssetCode,
          packVersionId: row.referAssetVersionId,
          packVersion: row.referAssetVersion,
          assetType: row.referAssetSubtype
        }
        path = `${base}${basePath}?${Object.keys(query).map(k => k + '=' + query[k]).join('&')}`
      }
      window.open(path, '_blank')
    },
    assetTypeFilter(type, subtype) {
      return asseTypeFormat(type, subtype, '-') || '--'
    },
    clickTab() {
      let top = 300
      const topbase = document.querySelector('.top').getBoundingClientRect().top - 650
      if (this.tabActive === '基础信息') {
        top = document.querySelector('.jichuxinxi').getBoundingClientRect().top - topbase - 120
      } else if (this.tabActive === '关联资源') {
        top = document.querySelector('.guanlianziyuan').getBoundingClientRect().top - topbase - 120
      } else if (this.tabActive === '项目及厂商信息') {
        top = document.querySelector('.xiangmuxinxi').getBoundingClientRect().top - topbase - 120
      } else if (this.tabActive === '版本信息') {
        top = document.querySelector('.banbenxinxi').getBoundingClientRect().top - topbase - 120
      } else if (this.tabActive === '案例指导') {
        top = document.querySelector('.anlizhidao').getBoundingClientRect().top - topbase - 120
      }
      const scrollDom = document.querySelector('.refScrollDom')
      scrollDom.scrollTo({ behavior: 'smooth', top: top })
    },
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    downloadFile(file) {
      console.log(file)
      if (!file) return
      const filePath = file.filePath || file.response.data.relativePath
      const fileName = file.fileName || file.name
      this.download.name = fileName
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${filePath}&filename=${encodeURI(this.download.name)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    getApplyDetail() {
      applyDetailShop(this.applyId).then(res => {
        res.data.applyExtendInfo = JSON.parse(res.data.applyExtendInfo)
        try {
          res.data.authorizeDesc = JSON.parse(res.data.authorizeDesc)
        } catch (error) {
          console.log(error)
        }
        this.applyInfo = res.data
      })
    },
    getData() {
      queryPackDetailApp({ packVersionId: this.packVersionId }).then(res => {
        res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
        res.data.projectInfo = res.data.projectInfo ? JSON.parse(res.data.projectInfo) : {}
        res.data.caseGuide = res.data.caseGuide ? JSON.parse(res.data.caseGuide) : {}
        res.data.firmInfo = res.data.firmInfo ? JSON.parse(res.data.firmInfo) : []
        this.pageInfo = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.info-title {
  margin-bottom: 20px;
}
.apply-info {
  background: #fff;
  padding: 20px 20px 0 40px;
  margin-bottom: 20px;
  margin-top: 20px;
  .info-title {
    margin-left: -20px;
  }
  .d-content {
    padding: 0 0px;
    &::after{
      content: ' ';
      display: block;
      clear: both;
    }
    .d-info {
      float: left;
      width: 33%;
      margin-bottom: 20px;
      .d-label {
        font-size: 14px;
        margin-bottom: 10px;
        color: #8a8a8a;
        position: relative;
      }
      .d-value {
        display: block;
        font-size: 14px;
        color: #4b4b4b;
        word-break: break-all;
        word-wrap: break-word;

        line-height: 20px;
      }
    }
    .width100 {
      width: 100% !important;
    }
  }
}
.box-wrap {
  background: #FFFFFF;
  margin-top: 20px;
  padding: 20px 40px 20px 40px;
  .info-title {
    margin-left: -20px;
  }
}

.fixtop {
  position: fixed;
  top: 72px;
  z-index: 10;
}
.width {
  margin: auto;
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
    padding-left: 20px;
    padding-right: 20px;
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
      position: relative;
      flex: 1;
      .btn {
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .title-box{
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
    padding-left: 20px;
    width: 100%;
    background: #FFFFFF;
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
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    height: 22px;
    line-height: 22px;
    background: #EBF9FF;
    border-radius: 1px;
    padding: 0px 6px;
    color: #36A4FF;
    font-size: 12px;
    margin-right: 8px;

  }
.tag-list{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 600px;
  color: #36A4FF;
}
::v-deep.refer-asset-tab {
  margin-bottom: 20px;
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
</style>
