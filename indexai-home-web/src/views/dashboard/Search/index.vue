<template>
  <div class="search-container">
    <div class="input-container">
      <SearchInput v-model:value="keyword" @search="searchFn" />
    </div>
    <div class="result-container" v-if="list.length" v-loading="loading">
      <ResultList :list="list" v-model:value="activeItem" />
      <RelatedIndex :activeItem="activeItem" />
    </div>
    <div class="no-data" v-else><Empty /></div>
  </div>
</template>
<script lang="ts" setup>
import moduleSrv from '/@/api/index'
import SearchInput from './components/SearchInput.vue'
import ResultList from './components/ResultList.vue'
import RelatedIndex from './components/RelatedIndex.vue'

const keyword = ref('')
const list = ref([]) as any
const activeItem = ref({}) as any
const loading = ref(false)
// 查询指标
const searchFn = async () => {
  list.value = []
  activeItem.value = {}
  if (keyword.value == '') return
  loading.value = true
  const res = await moduleSrv
    .searchIndex({
      text: keyword.value
    })
    .finally(() => {
      loading.value = false
    })
  list.value = res.data || []
  // list.value = [
  //   { indexId: 1012, indexContent: '氢燃料电池汽车分区登记上牌保有情况' },
  //   {
  //     indexId: 2,
  //     indexContent: '氢燃料电池汽车分区登记上牌保有情况氢燃料电池汽车分区登记上牌保有情况xxxxxxxs'
  //   },
  //   { indexId: 3, indexContent: 'xxxxxxxs' },
  //   { indexId: 4, indexContent: 'xxxxxxxs' },
  //   { indexId: 5, indexContent: 'xxxxxxxs' }
  // ]
  activeItem.value = list.value[0]
}
</script>
<style lang="scss" scoped>
.search-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .no-data {
    height: 980px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
