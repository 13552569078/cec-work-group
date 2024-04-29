<!--
 * @Description: 页面顶部栏
 * @Author: zhangsen
 * @Date: 2020-10-30
-->
<template>
  <div
    class="page-top-box"
    :class="{'page-top-view-show' : viewShow}"
  >
    <!-- <div
      v-if="!viewShow"
      class="page-title"
    >
      <div class="line" />
      {{ pageTitle }}
    </div> -->
    <div
      v-if="btns.length>0"
      class="page-common-btn"
      :style="sidebar.opened?{width:`calc(100% - 296px)`}:{width:`calc(100% - 137px)`}"
    >
      <div
        class="operate-btns"
        style="width:100% !important"
      >
        <c-button
          v-for="(item, index) in btns"
          :key="item.label"
          v-step-click:500="{operate: handleOperate, params: [item]}"
          class="btn"
          size="small"
          :disabled="item.disabled"
          :type="item.type"
          :plain="index === 1"
        >
          {{ item.label }}
        </c-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PageTop',
  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    btns: {
      type: Array,
      default() {
        return []
      }
    },
    viewShow: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    handleOperate(item) {
      this.$emit('handleOperate', item)
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';
.page-top-box {
  width: 100%;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  .page-title {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 14px;
    font-weight: 500;
     color: #4B4B4B;
    .line {
      width: 4px;
      height: 14px;
      background: $primaryColor;
      margin-right: 8px;
    }
  }
  .page-common-btn {
    padding: 16px 20px;
    margin: 0 -16px 16px -23px;
    // box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    background: white;
    position: fixed;
    z-index: 999;
    bottom: 0;
    right: 36px;
    box-sizing: border-box;
    ::v-deep.c-button {
      min-width: 80px;
    }
    ::v-deep.c-button + .c-button {
      margin-left: 16px;
    }
    .operate-btns {
      display: flex;
      align-items: center;
      .btn {
        // margin-left: 16px;
      }
    }
  }
}
.page-top-view-show {
  height: 20px;
  border-bottom: none;
}
</style>
