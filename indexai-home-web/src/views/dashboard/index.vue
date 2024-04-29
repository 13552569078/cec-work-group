<template>
  <div class="wrap">
    <el-tabs type="card" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="智能数字人" name="first"><Robot /></el-tab-pane>
      <el-tab-pane label="小京决策助理" name="second"><Search /></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import Robot from './Robot/index.vue'
import Search from './Search/index.vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 460px;
  margin: 0 auto;
  background: rgba(6, 18, 79, 0.9264);
  box-shadow: inset 0px 0px 20px 0px #044f7c;

  border: 1px solid #044f7c;
  padding: 16px;
  :deep() {
    .el-tabs {
      height: calc(100% - 32px - 2px);
      width: 428px;
    }

    .el-tabs__content {
      height: calc(100vh - 40px - 16px - 32px - 2px);
    }
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
  }
}
</style>
