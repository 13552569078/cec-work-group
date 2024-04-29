<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
-->

<template>
  <div class="content">
    <div class="apply-history">
      <c-steps :active="-1" :space="250" align-center>
        <c-step v-for="(item,index) in applyHistory" :key="item.handleTime + index"
                icon="c-icon-edit">
          <template slot="icon">
            <div class="icon-box">
              <i :class="getClassByStatus(item.applyStatus,index)"></i>
              <span>{{ getTitle(item.applyStatus,index) }}</span>
            </div>
          </template>
          <template slot="description">
            <div class="description-info">
              <c-tooltip :content="`${item.handleRole} ${item.handleUserName||''}`"
                         placement="top-start">
                <p class="u-name">{{ item.handleRole }} {{ item.handleUserName }}</p>
              </c-tooltip>
              <p class="u-time">{{ item.handleTime |timeFiler }}</p>
              <c-tooltip v-if="item.applyStatus || item.applyStatus===0" class="item"
                         :content="getAuditMsg(item)" placement="top-start">
                <p class="u-desc green" :class="{red:item.applyStatus ===2}">{{ getAuditMsg(item) }}</p>
              </c-tooltip>
            </div>
          </template>
        </c-step>
      </c-steps>
    </div>
    <div class="detail-wrap-box">
      <div class="detail-wrap-box-content scrollDom" @scroll.self="onscroll">
        <div class="detail-info">
          <div class="box-wrap">
            <h3 class="info-title">申请信息</h3>
            <c-row :gutter="24">
              <c-col v-if="![5,51,31,23].includes(+assetType)" :span="8" class="form-list">
                <p>申请资源主体</p>
                <span>{{ detailData.referPackName||'--' }}</span>
              </c-col>
              <c-col :span="8" class="form-list">
                <p>所属地区</p>
                <span>{{ applyExtendInfo.districtText||'--' }}</span>
              </c-col>
              <c-col :span="8" class="form-list">
                <p>所属部门</p>
                <span>{{ applyExtendInfo.buildDeptName||'--' }}</span>
              </c-col>
            </c-row><c-row :gutter="24">
              <c-col :span="8" class="form-list">
                <p>联系人</p>
                <span>{{ applyExtendInfo.contactName||'--' }}</span>
              </c-col>
              <c-col :span="8" class="form-list">
                <p>联系邮箱</p>
                <span>{{ applyExtendInfo.contactEmail||'--' }}</span>
              </c-col>
              <c-col :span="8" class="form-list">
                <p>联系电话</p>
                <span>{{ applyExtendInfo.contactPhone||'--' }}</span>
              </c-col>
              <c-col :span="16" class="form-list">
                <p>使用场景</p>
                <span v-html="textAreaFilter(applyExtendInfo.appDesc)"></span>
              </c-col>
              <c-col :span="24" class="form-list">
                <p>附件</p>
                <div class="">
                  <div v-if="applyExtendInfo.filePath&&applyExtendInfo.filePath.length" class="file-wrap">
                    <div class="file-item" @click="downloadFile(applyExtendInfo.filePath[0])">
                      <p>{{ applyExtendInfo.filePath[0].name }}</p>
                    </div>
                  </div>
                  <span v-else>--</span>
                </div>
              </c-col>
            </c-row>
          </div>
          <div v-if="applyType==2&&[1,5].includes(+detailData.downloadStatus)" class="box-wrap">
            <h3 class="info-title">授权信息</h3>
            <template v-if="detailData.downloadStatus==1">
              <div class="form-list">
                <p>ClientId<i v-copy="detailData.clientId" class="copy" @click="clickCopy('ClientId')" />
                </p>
                <span>{{ detailData.clientId||'--' }}</span>
              </div>
              <div class="form-list">
                <p>ClientSecret<i v-copy="detailData.clientSecret" class="copy" @click="clickCopy('ClientSecret')" /></p>
                <span>{{ detailData.clientSecret||'--' }}</span>
              </div>
            </template>
            <c-row v-if="detailData.downloadStatus==5" :gutter="24">
              <c-col :span="8" class="form-list">
                <p>失效时间</p>
                <span>{{ detailData.invalidTime||'--' }}</span>
              </c-col>
              <c-col :span="8" class="form-list">
                <p>失效原因</p>
                <span>{{ detailData.invalidDesc||'--' }}</span>
              </c-col>
            </c-row>
          </div>
        </div>
        <h3 class="info-title detail-title">基本信息</h3>
        <component
          :is="componentName"
          :shop-code="shopCode"
          :pack-version="packVersion"
          :hidebtn="true"
          :is-snapshoot="true"
          :showsnapshootinfo="false"
          :show-subscribe="applyType==2"
          :pack-version-id="packVersionId"
          :showfooter="false"
          :hideappraise="true"
          :custom-click-tab="customClickTab" />
      </div>
    </div>
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { applyUserLog, getApplyAuthorizeByApplyId, getApplyAuthorizeByAppInfo, applyLog, applyDetail, applyDetailByAssetinfo } from '@/api'
import moment from 'moment-cn'
import detail from '@/views/home/components/detail.vue'
import detailApi from '@/views/home/components/detail-api.vue'
import detailSupportapp from '@/views/home/components/detail-supportapp.vue'
export default {
  name: '',
  components: { detail, detailApi, detailSupportapp },
  filters: {
    timeFiler(val) {
      if (!val) return ''
      return moment(val).format('YYYY.MM.DD HH:mm:ss')
    }
  },
  data() {
    let componentName = [22, 14, 7, 72].includes(+this.$route.query.assetType) ? 'detailApi' : 'detail'
    if (+this.$route.query.assetType === 27) {
      componentName = 'detailSupportapp'
    }
    return {
      componentName,
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      packVersionId: this.$route.query.packVersionId,
      appName: this.$route.query.appName,
      applyId: this.$route.query.applyId,
      assetType: this.$route.query.assetType,
      applyType: this.$route.query.applyType,
      detailData: {},
      applyExtendInfo: {},
      activeStep: 0,
      applyHistory: [],
      hasSearch: false,
      loading: false,
      download: {
        name: '',
        url: ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    // 下载附件
    downloadFile(file) {
      console.log(file, 'file')
      if (!file) return
      const filePath = file.filePath || file.response.data.relativePath
      const fileName = file.name || file.fileName
      this.download.name = fileName
      this.download.url = `${getProxyUrl(serviceSuffix.file_upload)}/fdfs/download?relativePath=${filePath}&filename=${encodeURI(fileName)}`
      this.$nextTick(() => {
        console.log('--------dddd', this.$refs.refDownloadFile)
        this.$refs.refDownloadFile.click()
      })
    },
    onscroll() {
      const top = document.querySelector('.scrollDom').scrollTop
      const tabDom = document.querySelector('.fixedTabDom')
      const baseHeight = document.querySelector('.detail-info').offsetHeight + 300
      if (top > baseHeight) {
        tabDom.style.width = tabDom.parentElement.offsetWidth + 'px'
        tabDom.style.position = 'fixed'
        tabDom.style.top = '321px'
        tabDom.style.zIndex = 10
      } else {
        tabDom.style.position = ''
        tabDom.style.top = ''
      }
    },
    customClickTab(top) {
      const topbase = document.querySelector('.detail-info').getBoundingClientRect().top
      top = top - topbase - 100
      const scrollDom = document.querySelector('.scrollDom')
      console.log(top)
      scrollDom.scrollTo({ behavior: 'smooth', top: top })
    },
    clickCopy(flag) {
      this.$message.success(flag + '已复制')
    },
    init() {
      this.getLogList()
      this.getApplyAuthInfo()
      this.getApplyDetail()
    },
    getApplyAuthInfo() {
      let fn
      if (this.applyId) {
        fn = getApplyAuthorizeByApplyId({
          applyId: this.applyId
        })
      } else {
        if (!this.shopCode || !this.packVersion || !this.appName) return
        fn = getApplyAuthorizeByAppInfo({
          shopCode: this.shopCode,
          packVersion: this.packVersion,
          appName: this.appName
        })
      }
      fn.then(res => {
        this.detailData = res.data || {}
      })
    },
    getAuditMsg(row) {
      return `【${this.getStatus(row.applyStatus)}】${row.auditMsg || ''}`
    },
    getStatus(val) {
      let res = ''
      switch (val) {
        case 0:
          res = '提交成功'
          break
        case 1:
          res = '通过'
          break
        case 2:
          res = '驳回'
          break
        case 4:
          res = '驳回'
          break

        default:
          break
      }
      return res || ''
    },
    getTitle(status, index) {
      let res = ''
      switch (status) {
        case 0:
          res = '提交'
          break
        case 1:
          res = '审核'
          break
        case 2:
          res = '审核'
          break
        default:
          break
      }
      if (index === this.applyHistory.length - 1) res = '终审'
      return res || '审核'
    },
    getClassByStatus(status, index) {
      let res = ''
      switch (status) {
        case 0:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }
          break
        case 1:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }

          break
        case 2:
          res = 'icon-fail'
          if (index === this.activeStep) { res = 'icon-fail-big' }
          break
        default:
          break
      }
      return res || 'icon-pendding'
    },
    // 检索
    async getLogList() {
      this.loading = true
      try {
        let result
        if (this.applyId) {
          result = await applyLog({ applyId: this.applyId })
        } else {
          result = await applyUserLog({
            shopCode: this.shopCode,
            packVersion: this.packVersion
          })
        }
        this.applyHistory = result.data
        this.$nextTick(() => {
          document.querySelectorAll('.apply-history')[0].scrollTo(2000, 1)
        })
        this.activeStep = this.applyHistory.filter(item => item.applyStatus || item.handleTime).length ? this.applyHistory.filter(item => item.applyStatus || item.handleTime).length - 1 : 0
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 获取申请单详情
    getApplyDetail() {
      let sendFn = applyDetail
      let params = { applyId: this.applyId }
      if (!this.applyId) {
        sendFn = applyDetailByAssetinfo
        params = {
          packVersionId: this.packVersionId,
          applyType: 1,
          applyStatus: 0
        }
      }
      sendFn(params).then(res => {
        res.data.applyExtendInfo = res.data.applyExtendInfo ? JSON.parse(res.data.applyExtendInfo) : {}
        this.detailData = res.data
        this.applyExtendInfo = res.data.applyExtendInfo
        console.log(this.detailData, this.applyExtendInfo)
      })
    }
  }
}
</script>
<style scoped lang="scss">
.padding {
  color: #1e6fff;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-1.png) no-repeat center;
    background-size: 100%;
  }
}
.fulfilled {
  color: #4cc09e;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-2.png) no-repeat center;
    background-size: 100%;
  }
}
.rejected {
  color: #ff4d4f;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-3.png) no-repeat center;
    background-size: 100%;
  }
}
.apply-history {
  height: 180px;
  background: #fff;
  // border-top: solid 1px #ededed;
  overflow-x: auto;
  padding: 40px 20px 0;
  .c-step__head.is-finish {
    border-color: #bdbdbd;
  }
  .c-step {
    flex-shrink: 0;
    &:last-child {
      max-width: auto;
    }
  }
}
.icon-box {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4b4b4b;
  display: flex;
  align-items: center;
}
.description-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  width: 150px;
  .u-name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #8a8a8a;
  }
  .u-time {
    width: 100%;
    color: #8a8a8a;
  }
  .u-desc {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
  }
  .red {
    color: #ff4d4f !important;
  }
  .green {
    color: #4cc09e;
  }
}
.icon-success-big {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: url(~@/assets/imgs/icon-success-big.png);
}
.icon-fail-big {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: url(~@/assets/imgs/icon-fail-big.png);
}
.icon-success {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-success.png);
}
.icon-fail {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-fail.png);
}
.icon-pendding {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-pendding.png);
  background-size: 100%;
}
.detail-wrap-box {
  height: calc(100% - 200px);
  overflow: hidden auto;
  .detail-wrap-box-content{
    height:100%;
    overflow: hidden auto;
  }
  .detail {
    max-width: 1280px;
    height: auto !important;
    overflow: hidden;
  }
}
.apply-info {
  padding: 20px 20px 20px 40px;
  margin-bottom: 20px;
  background: #fff;
  .info-title {
    margin-left: -20px;
  }
}
.content{
  height: calc(100% - 67px);
  overflow: hidden auto;
}
.copy {
  width: 16px;
  height: 16px;
  background: url(~@/assets/logo/copy.png) no-repeat center;
  background-size: 100%;
  z-index: 2;
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-image: url(~@/assets/logo/copy-hover.png);
  }
}
.form-list {
  p {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8a8a8a;
    line-height: 20px;
    margin-bottom: 10px;
    position: relative;
    display: flex;
    align-items: center;
  }
  span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4b4b4b;
    line-height: 20px;
    display: block;
    margin-bottom: 10px;

  }
}
.margin-top-42px {
  margin-top: 40px;
}
.detail-title {
  background: white;
  margin-bottom: 0;
  margin-top: 20px;
  padding: 20px 0 0 20px;
}
::v-deep.detail {
  .top {
    padding-top: 1px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .width {
    width: 100%
  }
  .tab-wrapper .c-tabs__nav {
    margin-left: 20px;
  }
}
.file-item {
  width: 400px;
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
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 56px;
    color: #4b4b4b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
