<template>
  <template v-if="list && list.length">
    <event-list :height="height" :list="list" :seamlessScroll="true"></event-list>
  </template>
  <hl-group v-else :style="`height: ${height};`" full>
    <hb-empty image-size="0" description="暂无数据" />
  </hl-group>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGlobalState } from '@/hooks';

const { searchParams } = useGlobalState({
  handleWatch: (params: any) => {
    getData({ ...params });
  }
});

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 15.6)'
  },
  params: Object,
  autoTrigger: {
    type: Boolean,
    default: true
  }
});

const list = ref([]);

const getData = () => {
  //
};
</script>
<style lang="scss" scoped>
.page-content {
  justify-content: space-between;
  font-size: calc(var(--xl) * 0.48);
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;

  .page-count {
    color: #36b7ff;
  }
}

:deep(.hl-input .input-inner) {
  color: #96bee0 !important;
}
</style>
