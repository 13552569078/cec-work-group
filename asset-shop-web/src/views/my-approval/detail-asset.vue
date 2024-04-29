<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
-->

<template>
  <div class="apply-main">
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
              <c-tooltip :content="`${item.handleRole} ${item.handleUserName||''}`" placement="top-start">
                <p class="u-name">{{ item.handleRole }} {{ item.handleUserName }}</p>
              </c-tooltip>
              <p class="u-time">{{ item.handleTime |timeFiler }}</p>
              <c-tooltip v-if="item.applyStatus || item.applyStatus===0" class="item" :content="getAuditMsg(item)" placement="top-start">
                <p class="u-desc green" :class="{red:item.applyStatus ===2}">{{ getAuditMsg(item) }}</p>
              </c-tooltip>
            </div>
          </template>
        </c-step>
      </c-steps>
    </div>
    <div class="detail-wrap-box scrollDom" @scroll.self="onscroll">
      <div class="detail-info">
        <div class="apply-info">
          <h3 class="info-title">申请信息</h3>
          <c-row :gutter="24">
            <c-col v-if="![5,51,31,23].includes(+assetType)" :span="8" class="form-list">
              <p>申请资源主体</p>
              <span>{{ detailData.referPackName||'--' }}</span>
            </c-col>
            <c-col :span="8" class="form-list">
              <p>所属部门</p>
              <span>{{ applyExtendInfo.buildDeptName||'--' }}</span>
            </c-col>
            <c-col :span="8" class="form-list">
              <p>所属地区</p>
              <span>{{ applyExtendInfo.districtText||'--' }}</span>
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
      </div>
      <h3 class="info-title detail-title">基本信息</h3>
      <component
        :is="componentName"
        :shop-code="shopCode"
        :pack-version="packVersion"
        :hidebtn="true"
        :is-snapshoot="true"
        :showsnapshootinfo="false"
        :show-subscribe="$route.query.flag!=='approval'&&detailData.applyType==2"
        :pack-version-id="packVersionId"
        :showfooter="false"
        :hideappraise="true"
        :custom-click-tab="customClickTab" />
    </div>
    <div v-if="$route.query.flag ==='approval'" class="fixed-bottom">
      <c-button type="primary" size="small" @click="approvale()">审核</c-button>
    </div>
    <post-audit :post-dailog-flag="approvalFLag" :apply-type="currRow.applyType" :apply-id="currRow.id" @close="colseDialog"></post-audit>
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import postAudit from './components/post-audit'
import { applyLog, applyDetail } from '@/api'
import moment from 'moment-cn'
import detail from '@/views/home/components/detail.vue'
import detailApi from '@/views/home/components/detail-api.vue'
import detailSupportapp from '@/views/home/components/detail-supportapp.vue'
export default {
  name: '',
  components: { detail, postAudit, detailApi, detailSupportapp },
  filters: {
    statusFilter(val) {
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

        default:
          break
      }
      return res
    },
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
      approvalFLag: false,
      currRow: {},
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      applyId: this.$route.query.applyId,
      assetType: this.$route.query.assetType,
      packVersionId: this.$route.query.packVersionId,
      activeStep: 0,
      applyHistory: [],
      hasSearch: false,
      loading: false,
      detailData: {},
      applyExtendInfo: {},
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
    approvale() {
      this.currRow = { id: this.applyId, applyType: this.detailData.applyType }
      this.approvalFLag = true
    },
    colseDialog(isOk) {
      this.currRow = { }
      this.approvalFLag = false
      if (isOk) {
        this.$router.back()
      }
    },
    init() {
      this.getList()
      this.getApplyDetail()
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
    getClassByStatus(status, index) {
      console.log(status, 'status')
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
    getTitle(status, index) {
      console.log(status, 'status')
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
    // 检索
    async getList() {
      this.loading = true
      try {
        const result = await applyLog({
          applyId: this.applyId
        })
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
      if (!this.applyId) return
      applyDetail({ applyId: this.applyId }).then(res => {
        if (res.data.applyExtendInfo) {
          res.data.applyExtendInfo = JSON.parse(res.data.applyExtendInfo)
        }
        this.detailData = res.data || {}
        this.applyExtendInfo = res.data.applyExtendInfo
      })
    }
  }
}
</script>
<style scoped lang="scss">
.apply-main {
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  max-width: 1280px;
  padding-bottom: 10px;
  overflow: hidden;
}
.padding {
  color: #1e6fff;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-1.png) no-repeat center ;
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
    background: url(~@/assets/imgs/icon-2.png) no-repeat center ;
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
    background: url(~@/assets/imgs/icon-3.png) no-repeat center ;
    background-size: 100%;
  }
}
.apply-history {
  height: 180px;
  background: #fff;
  margin-bottom: 20px;
  // border-top: solid 1px #ededed;
  overflow-x: auto;
  padding: 40px 20px 0;
  .c-step {
  flex-shrink: 0;

    &:last-child {
      max-width: auto !important;
    }
  }
}
.icon-box{
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4B4B4B;
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
    width: 150px;
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
.fixed-bottom{
  flex-shrink: 0;
  padding: 16px 20px;
  // margin: 0 -16px 16px 0px;
  box-shadow: 0 -2px 7px 0 rgba(0 ,0 ,0 , 0.06);
  background: #fff;
  // position: fixed;
  // z-index: 999;
  // bottom: 0;
  // left: 320px;
  // right: 27px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.detail-wrap-box {
  flex: 1;
  // height: calc(100% - 250px);
  overflow: hidden auto;
  // background: #fff;
  .detail-wrap-box-content{
    height: 100%;
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
.detail-title {
  background: white;
  margin-bottom: 0;
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
