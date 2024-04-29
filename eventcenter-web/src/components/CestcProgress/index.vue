<template>
  <div class="progress-wrap">
    <div v-if="showLabel" class="progress-label">{{ label }}</div>
    <div class="progress-con">
      <div class="slider" :style="{ 'width': getWidth() }" />
    </div>
    <div v-if="showPrecent" class="progress-text">{{ precent }}{{ recentUnit }}</div>
  </div>
</template>

<script>
export default {
  name: 'CestcTree',
  props: {
    label: {
      type: String,
      default: () => '相似度'
    },
    showLabel: {
      type: Boolean,
      default: () => true
    },
    precent: {
      type: String,
      required: true,
      default: () => '20'
    },
    recentUnit: {
      type: String,
      default: () => '%'
    },
    showPrecent: {
      type: Boolean,
      default: () => true
    }
  },
  data() {
    return {
    }
  },
  watch: {},
  methods: {
    getWidth() {
      return (+this.precent / 100).toFixed(2) * 100 + '%'
    }
  }
}
</script>

<style lang="scss">
.progress-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 16px;
  gap: 8px;

  .progress-con {
    flex: 1;
    border-radius: 4px;
    position: relative;
    background: #EBF9FF;
    height: 16px;

    .slider {
      background: #36A4FF;
      border-radius: 4px;
      position: absolute;
      height: 100%;
      left: 0;
      top: 0;
    }
  }

  .progress-label {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #4B4B4B;
    line-height: 20px;
  }

  .progress-text {
    font-size: 12px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #36A4FF;
    line-height: 17px;
  }
}
</style>
