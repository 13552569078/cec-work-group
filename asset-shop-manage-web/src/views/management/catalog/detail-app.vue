<!--
 * @Description: 待审核详情
 * @Author: zs
 * @Date: 2022-01-20
-->
<template>
  <div class="detail-box_wrap refScrollDom">
    <div data-section="register" data-title="true" style="opacity:0;height:0;">注册信息</div>
    <div ref="detail-box_content" class="detail-box_content">
      <auditLogSteps v-if="applyLogList.length" :list="applyLogList" />
      <div v-if="detailInfoData" class="detail-box">
        <div class="app-detail">
          <div v-if="applyType===4" class="box-wrap">
            <h3 class="info-title" data-section="down">下架申请信息</h3>
            <div class="content details-content-layout_wrapper">
              <div class="details-content-layout_column_box">
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">下架方式</span>
                  <span class="content-value">{{ downInfo.unpackTime?`定时下架 ${downInfo.unpackTime}`:"立即下架" }}</span>
                </div>
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">申请使用次数</span>
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
                <div class="details-content-layout_column_box_item-1">
                  <span class="content-label"></span>
                  <span class="content-value ">
                    <c-table :data="itemList" :max-height="530"
                             style="width: 100%;line-height: 1;" :border="true">
                      <c-table-column type="index" label="#" fit :width="60" />
                      <c-table-column show-overflow-tooltip fit prop="fieldName" label="更新项"
                                      min-width="95" />
                      <c-table-column show-overflow-tooltip fit prop="beforeContent" align="left"
                                      label="更新前" min-width="95" />
                      <c-table-column show-overflow-tooltip fit prop="afterContent" align="left"
                                      label="更新后" min-width="95" />

                    </c-table>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <AppRegister :content="detailInfoData" />
          <div v-if="!hidePublicInfo" data-section="public" data-title="true" style="opacity:0;height:0;">上架信息</div>
          <AppPublic v-if="!hidePublicInfo" :content="detailInfoData" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { applyLog, applyPackDetailApp, applyUpdateDifference, applyDetail } from '@/api/manage'

import AppRegister from '../components/app-register.vue'
import AppPublic from '../components/app-public-info.vue'
import auditLogSteps from '../components/audit-log-steps.vue'

export default {
  name: '',
  components: {
    auditLogSteps,
    AppRegister,
    AppPublic
  },
  props: {
    pageStatus: Number,
    applyType: Number,
    applyId: Number
  },
  data() {
    return {
      applyLogList: [],
      detailInfoData: null,
      itemList: [],
      downInfo: { subscribeInfo: {}},
      hidePublicInfo: +this.$route.query.applyType === 3
    }
  },
  created() {
    this.fetchApplyLog()
    this.runApplyPackDetail()
    if (this.applyType === 4) { // 下架申请
      this.getDownInfo()
    }
    if (this.applyType === 5) { // 更新申请
      this.getUpdateInfo()
    }
  },
  methods: {
    getDownInfo() {
      applyDetail(this.applyId).then(res => {
        res.data.subscribeInfo = res.data.subscribeInfo || {}
        this.downInfo = res.data
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
    // 获取详情
    runApplyPackDetail() {
      applyPackDetailApp(this.applyId).then((res) => {
        if (+res.data.appStatus !== 3 && +this.$route.query.applyType === 5) {
          this.hidePublicInfo = true
        }
        this.detailInfoData = res.data
        this.$emit('getData', res.data)
      })
    },

    fetchApplyLog() {
      applyLog(this.applyId).then((res) => {
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
}
.line-box {
  width: 100%;
  height: 16px;
  background: #f3f4fb;
}
.mb20{
  margin-bottom: 20px;
}
</style>
