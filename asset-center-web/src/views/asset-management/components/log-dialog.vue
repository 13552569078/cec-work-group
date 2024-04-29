<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-11-29
-->
<template>
  <c-dialog
    :class="'dialog-center'"
    :title="'资源日志'"
    width="766px"
    class="details-dialog-adjustpadding-1"
    :visible.sync="logDialogFlag"
    append-to-body
    :before-close="close"
  >
    <div class="log-box" v-html="processLog"></div>
  </c-dialog>
</template>

<script>
export default {
  props: {
    logDialogFlag: {
      type: Boolean,
      default: false
    },
    processLog: {
      type: String,
      default: ''
    }
  },

  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.log-box{
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4B4B4B;
  line-height: 20px;
  max-height: 500px;
  overflow: auto;
}
</style>
