<template>
  <common-dialog-modelless
    :title="title"
    width="calc(var(--xl) * 19.32)"
    @close="handleClose"
    class="dialog-search-list"
    :draggable="true"
  >
    <hl-group class="w-full" dir="vertical" merge block full>
      <!-- <hl-group class="w-full" dir="horizontal" merge block full>
        <hl-select
          v-model="searchMode"
          placeholder="请选择"
          :teleported="false"
          style="width: calc(var(--xl) * 1.68)"
        >
          <template v-for="item in searchModeOptions" :key="item.value">
            <hl-option :label="item.label" :value="item.value" />
          </template>
        </hl-select>
        <hl-input v-model="keyword" placeholder="请输入内容" clearable />
        <hl-button
          type="primary"
          style="width: calc(var(--md) * 1.6)"
          @click="getEventList"
        >
          <template #icon>
            <img :src="search" class="search-icon" />
          </template>
          搜索
        </hl-button>
      </hl-group> -->
      <div class="w-full">
        <component
          :is="lookup[listMode]"
          :clusterInfo="clusterData"
          ref="currentSearchRef"
        />
      </div>
    </hl-group>
  </common-dialog-modelless>
</template>
<script lang="ts" setup>
import { ref, computed, shallowRef, reactive, nextTick } from 'vue';
import { SERCH_MODE_OPTION, getLastPath } from '@/common';
import { useMapTools } from '@/hooks';
import eventClusterList from './components/event-cluster-list.vue';
import resourceClusterList from './components/resource-cluster-list.vue';
import videoClusterList from './components/video-cluster-list.vue';
import search from '@/assets/images/eventDetail/ic_search.svg';

const props = defineProps({
  listMode: {
    type: String,
    default: 'eventCluster',
  },
  clusterInfo: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close']);

const titleMap = new Map([
  ['resourceCluster', { title: '资源列表' }],
  ['videoCluster', { title: '视频列表' }],
  ['eventCluster', { title: '事件列表' }],
]);

const title = computed(() => {
  return titleMap.get(props.listMode)?.title;
});

const clusterData = computed(() => {
  return props.clusterInfo;
});

const { flyToDefault } = useMapTools();

const lookup = reactive<any>({
  eventCluster: shallowRef(eventClusterList),
  resourceCluster: shallowRef(resourceClusterList),
  videoCluster: shallowRef(videoClusterList),
});

const handleClose = () => {
  // flyToDefault();
  emit('close');
};

const currentSearchRef = ref();
const getEventList = () => {
  nextTick(() => {
    currentSearchRef.value?.getList();
  });
};
</script>
<style lang="scss" scoped>
.search-icon {
  width: calc(var(--xl) * 0.6);
  height: calc(var(--xl) * 0.6);
  margin-right: calc(var(--xl) * 0.38);
}
</style>
