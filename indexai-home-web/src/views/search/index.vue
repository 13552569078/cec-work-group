<template>
  <div class="search-page-wrapper">
    <component :is="dyRoute" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import List from './list/index.vue'
import Detail from './detail/index.vue'

const route = useRoute()
const dyRoute = computed(() => {
  const { name = 'search' } = route
  const map = new Map()
  map.set('search', List)
  map.set('searchDetail', Detail)
  return map.get(name)
})
</script>

<style lang="scss" scoped>
.search {
  &-page-wrapper {
    flex: 1; // 如果需要兼容，则需要使用 calc 动态的计算高度.
    min-height: 600px;
    width: 100%;
    left: 50%;
    margin: 0 auto;
  }
}
</style>
