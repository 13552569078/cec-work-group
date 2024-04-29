<template>
  <common-dialog-modelless :title="title" width="calc(var(--xl) * 19.32)" @close="handleClose" class="dialog-search-list" :draggable="true">

    <hl-group class="w-full" dir="vertical" merge block full>
      <hl-group class="w-full" dir="horizontal" merge block full>
        <hl-select v-model="searchMode" placeholder="请选择" :teleported="false" style="width: calc(var(--xl) * 1.68)">
        <template v-for="item in searchModeOptions" :key="item.value">
          <hl-option :label="item.label" :value="item.value" />
        </template>
        </hl-select>
        <hl-input v-model="keyword" placeholder="请输入内容" clearable />
        <hl-button type="primary" style="width: calc(var(--md) * 1.6)" @click="getEventList">
          <template #icon>
            <img :src="search" class="search-icon" />
          </template>
          搜索
        </hl-button>
      </hl-group>
      <div class="w-full" >
        <component :is="lookup[searchMode]" :keyword="keyword" ref="currentSearchRef"/>
      </div>
    </hl-group>

  </common-dialog-modelless>
</template>
<script lang="ts" setup>
import { ref, computed, shallowRef, reactive, nextTick } from 'vue';
import { SERCH_MODE_OPTION, getLastPath } from '@/common';
import { useMapTools } from '@/hooks';
import searchEvent from './components/search-event.vue';
// import searchSimilar from './components/search-similar.vue';
import searchSource from './components/search-source.vue';
import searchVideo from './components/search-video.vue';
import search from '@/assets/images/eventDetail/ic_search.svg';
const emit = defineEmits(['close']);

const title = '地图搜索';

const searchMode = ref('searchEvent');
const keyword = ref('');

const searchModeOptions = computed(() => {
  let modeArr = [];
  if (getLastPath() === 'center') {
    modeArr = [0, 2, 3]; // 地图搜索, 资源搜索, 视频搜索
  } else {
    modeArr = [0, 1, 2, 3]; // 地图搜索, 相似搜索, 资源搜索, 视频搜索
  }
  return modeArr.map(index => SERCH_MODE_OPTION[index]);
});

const { flyToDefault } = useMapTools();

const lookup = reactive<any>({
  'searchEvent': shallowRef(searchEvent),
  // 'searchSimilar': shallowRef(searchSimilar),
  'searchSource': shallowRef(searchSource),
  'searchVideo': shallowRef(searchVideo)
});

const handleClose = () => {
  flyToDefault();
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
