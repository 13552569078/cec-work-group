<template>
  <common-dialog-modelless :title="title" width="calc(var(--xl) * 21.02)" @close="handleClose" class="dialog-search-list" :draggable="true">

    <hl-group class="w-full" dir="vertical" merge block full>
      <hl-group class="w-full" dir="horizontal" merge block full>
        <hl-input v-model="keyword" placeholder="请输入内容" clearable />
        <hl-button type="primary" class="static" style="width: calc(var(--xl) * 3.6)" @click="getEventList">
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
import searchSimilar from './components/search-similar.vue';
import searchSource from './components/search-source.vue';
import searchVideo from './components/search-video.vue';
import search from '@/assets/images/eventDetail/ic_search.svg';
const emit = defineEmits(['close']);

const props = defineProps({
  title: {
    type: String,
    default: '资源搜索',
  },
  searchMode: {
    type: String,
    default: 'searchSource',
  },
});

const keyword = ref('');

const { flyToDefault } = useMapTools();

const lookup = reactive<any>({
  'searchEvent': shallowRef(searchEvent),
  'searchSimilar': shallowRef(searchSimilar),
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
