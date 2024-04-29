<template>
  <common-dialog-modelless :title="title" width="calc(var(--xl) * 19.32)" @close="handleClose" class="dialog-search-list" :draggable="true">

    <hl-group class="w-full" dir="horizontal" merge block full>
      <hl-tabs class="w-full" type="button" v-model="searchMode">
        <hl-tab-pane class="w-full" v-for="option in searchModeOptions" :label="option.label" :name="option.value" :key="option.value">
          <component :is="lookup[option.value]" />
        </hl-tab-pane>
      </hl-tabs>
    </hl-group>

  </common-dialog-modelless>
</template>
<script lang="ts" setup>
import { ref, computed, } from 'vue';
import { SERCH_MODE_OPTION, getLastPath } from '@/common';
import { useMapTools } from '@/hooks';
import searchEvent from './components/search-event.vue';
import searchSimilar from './components/search-similar.vue';
import searchSource from './components/search-source.vue';
import searchVideo from './components/search-video.vue';

const emit = defineEmits(['close']);

const title = '地图搜索';

const searchMode = ref('searchEvent');

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

const lookup = {
  searchEvent,
  searchSimilar,
  searchSource,
  searchVideo
};

const handleClose = () => {
  flyToDefault();
  emit('close');
};

</script>
<style lang="scss" scoped>
</style>
