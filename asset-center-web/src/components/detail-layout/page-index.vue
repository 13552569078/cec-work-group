<!--
 * @Description: 页面上下布局
 * @Author: pancj
 * @Date: 2021-5-7
-->
<template>
  <div class="detail-common-wrapper" :style="btns.length>0?{ paddingBottom: '59px'}:{paddingBottom:0}">
    <c-scrollbar :class="{'detail-box': true, 'detail-box-open': !showTop}">
      <page-top
        v-show="showTop"
        :page-title="pageTitle"
        :btns="btns"
        @handleOperate="handleOperate"
      />
      <slot name="content" />
    </c-scrollbar>
  </div>
</template>
<script>
import pageTop from '@/components/page-top'
export default {
  components: {
    pageTop
  },
  props: {
    pageTitle: {
      type: String,
      default: ''
    },
    showTop: {
      type: Boolean,
      default: true
    },
    btns: {
      type: Array,
      default: () => {
        return [{
          type: 'primary',
          disabled: false,
          label: '保存'
        }]
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    handleOperate(msg) {
      this.$emit('handleOperate', msg)
    }
  }
}
</script>
<style lang='scss' scoped>
@import '../../styles/variables.scss';
.detail-common-wrapper {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  // background: #fff;
  .detail-box {
    height:100%;
    background: #fff;
  }
  .detail-box-open {
    height: 100%;
  }
}
</style>
