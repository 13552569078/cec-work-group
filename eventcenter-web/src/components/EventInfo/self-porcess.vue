<template>
  <div class="self-porcess-wrap">
    <common-title title="处置流程" />
    <div class="status-wrap">
      <div class="step1 step">
        <span class="status" :class="dealStatus==='0'?'active':null">上报</span>
      </div>
      <div v-if="dealStatus==='0'" class="step2 step">
        <span class="status">办结</span>
      </div>
      <div v-if="dealStatus==='1'" class="step3 step">
        <span class="status" :class="dealStatus==='1'?'active':null">办结</span>
      </div>
      <div v-if="dealStatus==='2'" class="step4 step">
        <span class="status" :class="dealStatus==='2'?'active':null">作废</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SelfPorcess',
  props: {
    eventInfo: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    dealStatus() {
      return this.eventInfo?.dealStatus
    }
  }
}
</script>
<style lang="scss" scoped>
.self-porcess-wrap {
  padding: 20px;
  background: #ffffff;
  margin-bottom: 20px;
  height: 140px;
  .status-wrap {
    display: flex;
    gap: 112px;
    margin-top: 20px;
  }
  .step {
    height: 36px;
    width: 36px;
    background-image: url("~@/assets/eventInfo/self1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    position: relative;
    text-align: center;
    font-size: 14px;
    .status {
      position: absolute;
      width: 100%;
      bottom: -30px;
      left: 0px;
    }
    .active {
      color: #36a4ff;
    }
    &.step2 {
      background-image: url("~@/assets/eventInfo/self-doing.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    &.step3 {
      background-image: url("~@/assets/eventInfo/self-ok.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    &.step4 {
      background-image: url("~@/assets/eventInfo/self-cancel.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    &:not(:last-child) {
      &:after {
        content: "";
        display: inline-block;
        width: 112px;
        height: 1px;
        border-radius: 8px;
        border-bottom: 2px dashed #e7e7e7;
        position: absolute;
        z-index: 1;
        top: 20px;
        left: 36px;
      }
    }
  }
}
</style>
