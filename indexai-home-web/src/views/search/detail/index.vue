<template>
  <div class="detail-container">
    <div class="go-back" @click="goBack"><svg-icon icon-class="go-back" />返回首页</div>
    <div class="top">
      <BaiscInfo :activeItem="activeItem" class="mr20" />
      <RelatedIndex :list="list" />
    </div>
    <div class="bottom">
      <ResultList :list="list" v-model:value="activeItem" class="mr20" />
      <Graph :data="activeItem" :list="list" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import BaiscInfo from './components/BaiscInfo.vue'
import ResultList from './components/ResultList.vue'
import RelatedIndex from './components/RelatedIndex.vue'
import Graph from './components/Graph.vue'
import moduleSrv from '/@/api'

const activeItem = computed(() => {
  return JSON.parse(localStorage.getItem('cardDetail') || '')
}) as any
const loading = ref(false)
const list = ref([])
// 指标关系
const getRelatedIndex = async () => {
  loading.value = true
  const res = await moduleSrv
    .getRelatedIndex({
      indexId: activeItem.value.indexId,
      indexContent: activeItem.value.content
    })
    .finally(() => {
      loading.value = false
    })
  list.value = res.data || []
}
watch(
  () => activeItem.value,
  (nVal: any) => {
    if (nVal) getRelatedIndex()
  },
  {
    immediate: true,
    deep: true
  }
)
const router = useRouter()
const goBack = () => {
  router.push('/search')
}
</script>
<style lang="scss" scoped>
.detail-container {
  width: 1276px;
  left: 50%;
  margin: 0 auto;
  padding: 20px;
  box-shadow: inset 0px 0px 20px 0px #044f7c;
  border: 1px solid #044f7c;
  background: rgba(6, 18, 79, 0.93);
  .go-back {
    cursor: pointer;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    margin-bottom: 16px;
    svg {
      margin-right: 3px;
    }
  }
  .top,
  .bottom {
    display: flex;
    flex-direction: row;
  }
  .top {
    margin-bottom: 28px;
  }
}
</style>
