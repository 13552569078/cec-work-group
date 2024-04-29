<template>
  <div class="toolbox-panel map-tools-moving-right">
    <left-actions @collapse-detail="collapse=!collapse"/>
    <div :style="{width: collapse ? '0' : 'calc(var(--xxs) * 80)'}" class="right-panel self-grow">
      <div class="tabs w-full text-secondary">
        <div :class="{ tab: true, active: activeTab === 'plotting' }" @click="changeTab('plotting')">标绘</div>
        <div :class="{ tab: true, active: activeTab === 'persons' }" @click="changeTab('persons')">协作者</div>
        <div :class="{ tab: true, active: activeTab === 'property' }" @click="changeTab('property')">编辑属性</div>
      </div>
      <div class="panel self-grow display-flex flex-col">
        <plotting-tab v-if="activeTab === 'plotting'" />
        <persons-tab v-else-if="activeTab === 'persons'" />
        <property-editor-tab v-else-if="activeTab === 'property'" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useMapPlotting } from '@/hooks';
import LeftActions from './toolbox/left-actions.vue';
import PlottingTab from './toolbox/plotting-tab.vue';
import PersonsTab from './toolbox/persons-tab.vue';
import PropertyEditorTab from './toolbox/property-editor-tab.vue';

const { currentPlottingInfo, layerId, listening, stopPlotting, getLayerDetail, changeTab } = useMapPlotting();

const collapse = ref(false);
const activeTab = computed(() => currentPlottingInfo.activeTab);

// const changeTab = (t: string) => {
//   activeTab.value = t;
// };

onMounted(async() => {
  await listening();
  await getLayerDetail(layerId.value);
});
onBeforeUnmount(() => {
  stopPlotting();
});
</script>
<style lang="scss" scoped>
.toolbox-panel {
  --extra-right: calc(var(--xxs) * 15);
  z-index: 2;
  display: flex;
  height: calc(var(--xxs) * 212);
  background-image: url('@/assets/images/map/plotting/tools-panel-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: calc(var(--panels-top) + var(--xxs) * 15);
  .right-panel {
    display: flex;
    flex-direction: column;
    transition: width .3s ease;
    overflow: hidden;
    .tabs {
      display: flex;
      height: calc(var(--xxs) * 10);
      .tab {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('@/assets/images/map/plotting/tab-inactive.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
        cursor: pointer;
        &.active {
          background-image: url('@/assets/images/map/plotting/tab-active.png');
          color: white;
          font-weight: 600;
        }
      }
    }
    .panel {
      padding: var(--px20);
    }
  }
}
</style>
