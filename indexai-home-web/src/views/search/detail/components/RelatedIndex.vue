<template>
  <div class="realted-index">
    <small-title title-name="关联指标" />
    <div class="index-list" v-if="list.length">
      <div v-for="item in list" :key="item.indexId" class="item">
        <TextTooltip :text="item.indexContent" />
      </div>
    </div>
    <Empty type="2" v-else />
  </div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue'

defineProps({
  list: {
    type: Array as PropType<Array<any>>,
    default: () => []
  }
})
</script>
<style lang="scss" scoped>
.realted-index {
  width: 428px;
  height: 239px;
  display: flex;
  flex-direction: column;
  .index-list {
    .item {
      height: 34px;
      margin-top: 8px;
      padding: 6px 20px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
      &:first-child {
        margin: 0;
      }
    }
  }

  .index-graph {
    width: 428px;
    height: 212px;
    background: rgba(255, 255, 255, 0.06);
    margin-top: 8px;
    margin-bottom: 40px;
  }
}
</style>
