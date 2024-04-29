<template>
  <div class="similar-event">
    <div class="similar-event-header">
      <common-title :title="`相似事件 [编号] ${similarInfo.eventCode || '-'}`" />
      <el-popover
        placement="top-start"
        width="215"
        trigger="hover"
      >
        <slot>
          <div>满足以下条件，判定为重复事件：</div>
          <div>1.事件上报时间在30分钟之内</div>
          <div>2.事件发生地址相似</div>
          <div>3.事件描述相似</div>
        </slot>
        <i slot="reference" class="el-icon-question" />
      </el-popover>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="content mb24 mt22">
          <el-row class="mb20 pl10" :gutter="20">
            <el-col :span="12">
              <label class="info_label mb6 fw-n">事件状态</label>
              <div>{{ similarInfo.eventStateName || "-" }}</div>
            </el-col>
            <el-col :span="12">
              <label class="info_label mb6 fw-n">发生地址</label>
              <div>{{ `${similarInfo.deptName}${similarInfo.eventAddress}` || "-" }}</div>
            </el-col>
          </el-row>
          <el-row class="mb20 pl10">
            <label class="info_label mb6 fw-n">事件描述</label>
            <div>{{ similarInfo.eventDesc || "-" }}</div>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SimilarEvent',
  props: {
    similarInfo: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
.similar-event {
  background: #fff;
  color: #4b4b4b;
  margin-top: 16px;
  padding: 20px;
  &-header {
    display: flex;
    align-items: center;
    .el-icon-question {
      display: inline-block;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  .info_label {
      text-align: left;
      display: inline-block;
      color: #8a8a8a;
    }
}
</style>
