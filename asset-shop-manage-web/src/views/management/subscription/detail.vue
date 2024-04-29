<!--
 * @Description: 待审核详情
 * @Author: zs
 * @Date: 2022-01-20
-->
<template>
  <div class="detail-box_page" :class="{ 'detail-box_page_bottom': pageStatus === 1 }">
    <div class="detail-box_wrap refScrollDom">
      <div ref="detail-box_content" class="detail-box_content">
        <auditLogSteps v-if="applyLogList.length" :list="applyLogList" class="audit-log-steps" />
        <div v-if="applyType==2" class="detail-box">
          <div class="app-detail">
            <div data-section="update" style="opacity:0;height:0;">订阅申请信息</div>
            <div class="box-wrap">
              <h3 class="info-title">订阅申请信息</h3>
              <div class="content details-content-layout_wrapper mb20">
                <div class="details-content-layout_column_box">
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">申请资源主体</span>
                    <span class="content-value">{{ downInfo.referPackName||'--' }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">所属部门</span>
                    <span class="content-value">{{ downInfo.applyExtendInfo.buildDeptName }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">所属地区</span>
                    <span
                      class="content-value">{{ downInfo.applyExtendInfo.districtText || '--' }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">联系邮箱</span>
                    <span
                      class="content-value">{{ downInfo.applyExtendInfo.contactEmail|| '--' }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">联系人</span>
                    <span
                      class="content-value">{{ downInfo.applyExtendInfo.contactName || '--' }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">联系电话</span>
                    <span
                      class="content-value">{{ downInfo.applyExtendInfo.contactPhone || '--' }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">使用场景</span>
                    <span class="content-value" v-html="textAreaFilter( downInfo.applyExtendInfo.appDesc)"></span>
                  </div>

                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">已订阅数</span>
                    <span
                      class="content-value">{{ (downInfo.subscribeInfo.subNum||0)+'次' || '--' }}</span>
                  </div>
                  <div class="details-content-layout_column_box_item">
                    <span class="content-label">附件</span>
                    <span class="content-value">
                      <div v-if="downInfo.applyExtendInfo.filePath&&downInfo.applyExtendInfo.filePath.length" class="file-wrap">
                        <div class="file-item" @click="downloadFile(downInfo.applyExtendInfo.filePath[0])">
                          <p>{{ downInfo.applyExtendInfo.filePath[0].name }}</p>
                        </div>
                      </div>
                      <span v-else>--</span>
                    </span>
                  </div>

                  <div class="details-content-layout_column_box_item-1 " style="margin-top:20px;">
                    <span class="content-label">已订阅详情</span>
                    <span class="content-value">
                      <c-table :data="downInfo.subscribeInfo.subApps" :max-height="530"
                               style="width: 100%;line-height: 1;" :border="true">
                        <c-table-column type="index" label="#" fit :width="60" />
                        <c-table-column show-overflow-tooltip fit prop="applyUserName" label="订阅人" />
                        <c-table-column show-overflow-tooltip fit prop="applyTime" label="订阅时间" />
                        <c-table-column show-overflow-tooltip fit prop="referPackName" label="订阅应用" />
                        <c-table-column show-overflow-tooltip fit prop="applyExtendInfo" label="联系电话">
                          <template slot-scope="scope">
                            {{ phoneFilter(scope.row.applyExtendInfo)||'--' }}
                          </template>
                        </c-table-column>
                      </c-table>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <detailSupportapp v-if="assetType==27" :pack-version-id="packVersionId" :apply-id="applyId" />
            <detailApi v-else :pack-version-id="packVersionId" :apply-id="applyId" />
          </div>
        </div>
        <div v-else class="detail-box">
          <detailApp v-if="applyObject==2" :pack-version-id="packVersionId" :apply-id="applyId" />
          <detailAsset v-if="applyObject==1" :pack-version-id="packVersionId" :apply-id="applyId" />
        </div>
      </div>
    </div>
    <div class="btn-box" :class="{ 'btn-box-shadow': showShadow, 'no-btn': pageStatus==1}">
      <Anchor v-if="applyType==2" :scrolldom="scrollDom" class="cls-anchor" />
      <c-button v-if="pageStatus !== 1" type="gradual" @click="postAudit">审核</c-button>
    </div>
    <post-audit :post-dailog-flag="showPostDailog" :apply-type="applyType" :apply-id="applyId" @close="colseDialog" />
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>
</template>
<script>
import { shopApplyLog, applyDetailShop } from '@/api/manage'
import { getProxyUrl } from '@/api/service-suffix.js'
import postAudit from '../components/post-audit-shop'
import Anchor from '@/components/anchor'
import auditLogSteps from '../components/audit-log-steps.vue'
import detailApi from './detail-api.vue'
import detailSupportapp from './detail-supportapp.vue'
import detailApp from './detail-app.vue'
import detailAsset from './detail-asset.vue'

export default {
  name: '',
  components: {
    postAudit,
    Anchor,
    auditLogSteps,
    detailApi,
    detailSupportapp,
    detailApp,
    detailAsset
  },
  props: {},
  data() {
    return {
      DOWNLOAD_URL: getProxyUrl('file_upload') + '/fdfs/download',
      packVersionId: parseInt(this.$route.query.packVersionId),
      applyId: parseInt(this.$route.query.id),
      pageStatus: parseInt(this.$route.query.status), // 0, 待审核 1 已审核  详情
      applyType: parseInt(this.$route.query.applyType), // 1-上架申请、2-升级申请、 3-注册申请、4-下架申请 5 更新申请
      assetType: this.$route.query.assetType,
      activeStep: 0,
      applyLogList: [],
      showShadow: false,
      downInfo: { subscribeInfo: {}, applyExtendInfo: {}},
      myObseprver: null,
      showPostDailog: false,
      applyObject: this.$route.query.applyObject,
      scrollDom: null,
      download: {
        name: '',
        url: ''
      }
    }
  },
  created() {
    this.fetchApplyLog()
    this.getDownInfo()
  },
  mounted() {
    this.scrollDom = document.querySelector('.refScrollDom')
    this.runResizeObserver()
  },
  beforeDestroy() {
    this.myObserver && this.myObserver.disconnect()
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    phoneFilter(data) {
      data = data ? JSON.parse(data) : {}
      return data.contactPhone || ''
    },
    getDownInfo() {
      applyDetailShop(this.applyId).then(res => {
        res.data.applyExtendInfo = res.data.applyExtendInfo ? JSON.parse(res.data.applyExtendInfo) : {}
        this.downInfo = res.data
      })
    },
    downloadFile(file) {
      console.log(file, '-----file')
      if (!file) return
      const filePath = file.filePath || file.response.data.relativePath
      const fileName = file.fileName || file.name
      this.download.name = fileName
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${filePath}&filename=${encodeURI(this.download.name)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
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
    },
    fetchApplyLog() {
      shopApplyLog(this.applyId).then((res) => {
        this.applyLogList = res.data
        this.$nextTick(() => {
          document.querySelectorAll('.apply-history')[0].scrollTo(2000, 1)
        })
        this.activeStep = this.applyLogList.filter(item => item.applyStatus || item.handleTime).length ? this.applyLogList.filter(item => item.applyStatus || item.handleTime).length - 1 : 0
      })
    },
    runResizeObserver() {
      this.myObserver = new ResizeObserver((entries) => {
        // 注意，entres是个数组，数组项为每个需要监听的DOM节点
        entries.forEach((entry) => {
          if (entry.target.className.indexOf('detail-box_content') !== -1) {
            this.setBoxShadow(entry.contentRect.height)
          }
        })
      })
      this.myObserver.observe(this.$refs['detail-box_content'])
    },
    setBoxShadow(num) {
      this.showShadow =
        this.$refs['detail-box_content'].parentNode.offsetHeight - num < 0
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
  .detail-box_wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
  .detail-box {
    position: relative;
    // padding: 0 20px 20px;
    // background: #ffffff;
    .line {
      position: absolute;
      top: 63px;
      left: 0;
      width: 100%;
      height: 1px;
      background: #ededed;
    }
  }
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
.mt20 {
  margin-top: 20px;
}
.apply-history {
  height: 180px;
  background: #fff;
  // margin-bottom: 20px;
  border-top: solid 1px #ededed;
  overflow-x: auto;
  padding: 40px 20px 0;
  .is-finish {
    border-color: #bdbdbd;
  }
  .c-step {
    flex-shrink: 0;
    &:last-child {
      max-width: auto;
    }
  }
}
.fixed {
  padding: 16px 20px;
  margin: 0 -16px 16px 0px;

  box-shadow: 0 -2px 7px 0 rgba(0, 0, 0, 0.06);
  background: #fff;
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 320px;
  right: 27px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
