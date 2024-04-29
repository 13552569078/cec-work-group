<!--
 * @Description: 待审核详情
 * @Author: zs
 * @Date: 2022-01-20
-->
<template>
  <div class="detail-box_wrap refScrollDom">
    <div ref="detail-box_content" class="detail-box_content">
      <auditLogSteps v-if="applyLogList.length" :list="applyLogList" />
      <div class="detail-box">
        <div v-if="applyType===4" class="box-wrap">
          <h3 class="info-title" data-section="down">下架申请信息</h3>
          <div class="content details-content-layout_wrapper">
            <div class="details-content-layout_column_box">
              <div class="details-content-layout_column_box_item">
                <span class="content-label">下架方式</span>
                <span class="content-value">{{ downInfo.unpackTime?`定时下架 ${downInfo.unpackTime}`:"立即下架" }}</span>
              </div>
              <div class="details-content-layout_column_box_item">
                <span class="content-label">申请下载数量</span>
                <span class="content-value">{{ (downInfo.subscribeInfo.subNum||0)+'次' }}</span>
              </div>
              <div class="details-content-layout_column_box_item">
                <span class="content-label">下架原因</span>
                <span class="content-value">{{ downInfo.unpackReason|| '--' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="applyType===5" class="box-wrap">
          <h3 class="info-title" data-section="update">更新内容</h3>
          <div class="content details-content-layout_wrapper">
            <div class="details-content-layout_column_box">
              <div class="details-content-layout_column_box_item-1" style="margin-top:20px;">
                <span class="content-label"></span>
                <span class="content-value ">
                  <c-table :data="itemList" :max-height="530" style="width: 100%;line-height: 1;" :border="true">
                    <c-table-column type="index" label="#" fit :width="60" />
                    <c-table-column show-overflow-tooltip fit prop="fieldName" label="更新项" />
                    <c-table-column show-overflow-tooltip fit prop="beforeContent" label="更新前" />
                    <c-table-column show-overflow-tooltip fit prop="afterContent" label="更新后" />
                  </c-table>
                </span>
              </div>
            </div>
          </div>
        </div>
        <asset-package-info :content="detailInfoData" />
        <base-info :content="detailInfoData" />
        <detail-info :content="detailInfoData" />
      </div>
    </div>
  </div>
</template>
<script>
import assetPackageInfo from '../components/asset-package-info.vue'
import baseInfo from '../components/base-info'
import detailInfo from '../components/detail-info'

import { applyLog, applyPackDetail, applyDetail, applyUpdateDifference } from '@/api/manage'
import auditLogSteps from '../components/audit-log-steps.vue'

export default {
  name: '',
  components: {
    assetPackageInfo,
    baseInfo,
    detailInfo,
    auditLogSteps
  },
  props: {
    pageStatus: Number,
    applyId: Number,
    applyType: Number
  },
  data() {
    return {
      applyLogList: [],
      activeTabName: '1',
      showShadow: false,
      myObserver: null,
      detailInfoData: {
        contactInfo: {}
      },
      itemList: [],
      downInfo: { subscribeInfo: {}}
    }
  },
  created() {
    this.fetchApplyLog()
    this.runApplyPackDetail()
    if (this.applyType === 4) { // 下架申请
      this.getDownInfo()
    } else if (this.applyType === 5) { // 更新申请
      this.getUpdateInfo()
    }
  },
  beforeDestroy() {
    // this.myObserver && this.myObserver.disconnect()
  },
  methods: {
    // 获取详情
    runApplyPackDetail() {
      applyPackDetail(this.applyId).then((res) => {
        res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
        this.detailInfoData = res.data
      })
    },
    getUpdateInfo() {
      applyUpdateDifference(this.applyId).then(res => {
        this.itemList = (res.data || []).map(d => {
          Object.keys(d).forEach(k => {
            if (d[k] === undefined || d[k] === null || d[k] === '') {
              d[k] = '--'
            }
          })
          return d
        })
      })
    },
    getDownInfo() {
      console.log('---获取下架信息')
      applyDetail(this.applyId).then(res => {
        this.downInfo = res.data
      })
    },
    fetchApplyLog() {
      applyLog(this.applyId).then((res) => {
        // if (this.pageStatus === 0 && res.data.length) {
        //   // 过滤出最新的第一条被驳回的信息
        //   for (let i = 0; i < res.data.length; i++) {
        //     if (parseInt(res.data[i].applyStatus) === 2) {
        //       this.applyLogList.push(res.data[i])
        //       break
        //     }
        //   }
        //   return
        // }
        res.data = res.data || []
        this.applyLogList = res.data.reverse()
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.detail-box_wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.detail-box {
  position: relative;
  // padding: 0 20px 20px;
}
.detail-box-1 {
  padding-top: 20px;
}
.line-box {
  width: 100%;
  height: 16px;
  background: #f3f4fb;
}
::v-deep .c-tabs__header {
  margin: 0;
}
::v-deep .c-tabs__content {
  padding-top: 0;
}
</style>
