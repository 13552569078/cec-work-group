<!--
 * @description 城管处理轨迹-弹窗
 * @date 2022-09-20
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="城管处理轨迹"
    width="682px"
    top="10vh"
    v-on="$listeners"
  >
    <div class="cheng-guan-wrapper">
      <process-line-chengguan :process-list="processList" />
    </div>
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
import processLineChengguan from '../processLineChengguan.vue'
export default {
  name: 'ChengGuanDialog',
  components: {
    processLineChengguan
  },
  props: {
    processList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.cheng-guan-wrapper {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
