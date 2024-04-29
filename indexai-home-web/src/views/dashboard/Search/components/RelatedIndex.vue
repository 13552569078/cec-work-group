<template>
  <div class="realted-index" v-loading="loading">
    <small-title title-name="关联指标" />
    <div class="index-list" v-if="list.length">
      <div v-for="item in list" :key="item.indexId" class="item">
        <TextTooltip :text="item.indexContent" />
      </div>
    </div>
    <Empty type="2" v-else />
    <small-title title-name="指标关系" />
    <div class="index-graph">
      <Graph ref="relatedGraph" :data="activeItem" :list="list" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import moduleSrv from '/@/api/index'
import Graph from '../components/Graph.vue'

const relatedGraph = ref()
const list = ref([]) as any
const props = defineProps({
  activeItem: {
    type: Object,
    default: () => {}
  }
})

const loading = ref(false)
const getRelatedIndex = async () => {
  loading.value = true
  const res = await moduleSrv
    .getRelatedIndex({
      indexId: props.activeItem.indexId,
      indexContent: props.activeItem.indexContent
    })
    .finally(() => {
      loading.value = false
    })
  list.value = res.data || []
}
watch(
  () => props.activeItem,
  (nVal: any) => {
    if (nVal) getRelatedIndex()
  },
  {
    immediate: true
  }
)
</script>
<style lang="scss" scoped>
.realted-index {
  display: flex;
  flex-direction: column;
  .index-list {
    margin: 8px 0 24px 0;
    .item {
      height: 34px;
      margin-top: 8px;
      padding: 6px 20px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.06);
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
