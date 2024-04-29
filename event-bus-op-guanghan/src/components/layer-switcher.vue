<template>
  <hl-group :class="['layer-switcher-box', isSingleEvent ? 'layer-switcher-single-box' : '']" align="items-bottom">
    <hl-group v-show="isOpen" class="layer-panel m-r-md static p-md" dir="vertical" gap="var(--xs)">

      <box-close-button @click="handleToggle"/>

      <hl-group align="items-between items-middle">
        <hl-group>
          <div class="text map-level-title m-r-sm">事件图层</div>
          <hl-group gap="var(--sm)" align="items-middle">
            <div class="switch" @click="handleToggleMapRect">
              <img :src="!rectMapVisible ? switchLeft : switchRight" class="cursor-pointer" />
            </div>
            <span>地图网格</span>
          </hl-group>
        </hl-group>
        <c-tabs v-model="layerSwitch.mode" :tabs="modeTabs" mini @click="handleChangeMode"/>
      </hl-group>

      <hl-group class="layer-box" dir="vertical">
        <hl-checkbox-group v-model="layerSwitch.layerSelected" :dir="isSingleEvent ? 'vertical' : ''" class="checkbox-group" gap="var(--xs)">
          <hl-checkbox custom :label="WAITING" gap="var(--sm)" class="h-cell">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="waiting" />
            <span>待调度</span>
          </hl-checkbox>
          <hl-checkbox custom :label="PENDING" gap="var(--sm)" class="h-cell">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="pending" />
            <span>处置中</span>
          </hl-checkbox>
          <hl-checkbox custom :label="FINISHED" gap="var(--sm)" class="h-cell">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="finished" />
            <span>已办结</span>
          </hl-checkbox>
          <hl-checkbox custom :label="SELF_HANDLE" gap="var(--sm)" class="h-cell">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="selfHandle" />
            <span>自处置</span>
          </hl-checkbox>
        </hl-checkbox-group>
      </hl-group>
      <hl-group align="items-between items-middle">
        <hl-group>
          <div class="text map-level-title m-r-sm">资源图层</div>
        </hl-group>
        <hl-button type="primary" size="sm" @click="openLayerSearch('资源搜索', 'searchSource')">资源搜索</hl-button>
      </hl-group>
      <hl-group class="layer-box" dir="vertical">
        <hl-checkbox-group v-model="layerSwitch.resourcesSelected" :dir="isSingleEvent ? 'vertical' : ''" class="checkbox-group" gap="var(--xs)" :style="isSingleEvent ? '' : 'flex-wrap: wrap;'" align="items-between">
          <hl-checkbox v-for="item in resourcesList" custom :label="`${item.type}`" gap="var(--sm)" :key="item.id" :class="isSingleEvent ? '' : 'h-cell'">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="sanxiao" v-if="`${item.type}` === RESOURCE.SANXIAO" />
            <img class="img-icon m-l-xs m-r-xs" :src="business" v-if="`${item.type}` === RESOURCE.BUSINESS" />
            <img class="img-icon m-l-xs m-r-xs" :src="traffic" v-if="`${item.type}` === RESOURCE.TRAFFIC" />
            <img class="img-icon m-l-xs m-r-xs" :src="hospital" v-if="`${item.type}` === RESOURCE.HOSPITAL" />
            <img class="img-icon m-l-xs m-r-xs" :src="school" v-if="`${item.type}` === RESOURCE.SCHOOL" />
            <img class="img-icon m-l-xs m-r-xs" :src="hotel" v-if="`${item.type}` === RESOURCE.HOTEL" />
            <span>{{ item.name }}</span>
          </hl-checkbox>
        </hl-checkbox-group>
      </hl-group>
      <hl-group align="items-between items-middle">
        <hl-group>
          <div class="text map-level-title m-r-sm">视频图层</div>
        </hl-group>
        <hl-button type="primary" size="sm" @click="openLayerSearch('视频搜索', 'searchVideo')">视频搜索</hl-button>
      </hl-group>
      <hl-group class="layer-box" dir="vertical">
        <hl-checkbox-group v-model="layerSwitch.videosSelected" dir="vertical" class="checkbox-group" gap="var(--xs)">
          <hl-checkbox v-for="item in videosList" custom :label="item.type" gap="var(--sm)" :key="item.id">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="camera" />
            <span>{{ item.name }}</span>
          </hl-checkbox>
        </hl-checkbox-group>
      </hl-group>
    </hl-group>
    <hl-group dir="vertical" gap="var(--sm)">
      <img
        class="measure cursor-pointer static"
        :src="isMeasureMode ? measureBtnOn : measureBtn" @click="handleMeasure" />
      <img
        class="switcher cursor-pointer static"
        :src="isOpen ? layerSwitchBtnOn : layerSwitchBtn"
        v-if="showMapResources"
        @click="handleToggle" />
    </hl-group>
     <!-- 弹窗：地图搜索 -->
    <map-layer-search v-if="maplayerSearchVisible" :title="layerTitle" :searchMode="layerSearchMode" @close="handleClose" />
  </hl-group>
</template>
<script lang="ts" setup>
import { ref, watch, computed, PropType, nextTick } from 'vue';
import {
  ALL,
  WAITING,
  PENDING,
  FINISHED,
  SELF_HANDLE,
  SHOW_CAMERA
} from '@/views/event-center/constant';
import {
  MAP_AGGRE,
  MAP_HEAT,
  MAP_POINT,
  RESOURCE_TYPE as RESOURCE,
} from '@/common';
import { useGlobalState, useMapTools, useMapData } from '@/hooks';
import switchLeft from '@/assets/images/layerSwitcher/switch-left.png';
import switchRight from '@/assets/images/layerSwitcher/switch-right.png';
import unCheck from '@/assets/images/layerSwitcher/uncheck.png';
import checked from '@/assets/images/layerSwitcher/checked.png';
import waiting from '@/assets/images/layerSwitcher/waiting.png';
import pending from '@/assets/images/layerSwitcher/pending.png';
import finished from '@/assets/images/layerSwitcher/finished.png';
import selfHandle from '@/assets/images/layerSwitcher/self-handle.png';
import camera from '@/assets/images/layerSwitcher/camera.png';

import layerSwitchBtn from '@/assets/images/layerSwitcher/layer-switch.png';
import layerSwitchBtnOn from '@/assets/images/layerSwitcher/layer-switch-on.png';
import measureBtn from '@/assets/images/layerSwitcher/measure.png';
import measureBtnOn from '@/assets/images/layerSwitcher/measure-on.png';

// 资源
import business from '@/assets/images/layerSwitcher/business.png';
import hospital from '@/assets/images/layerSwitcher/hospital.png';
import hotel from '@/assets/images/layerSwitcher/hotel.png';
import sanxiao from '@/assets/images/layerSwitcher/sanxiao.png';
import school from '@/assets/images/layerSwitcher/school.png';
import traffic from '@/assets/images/layerSwitcher/traffic.png';

import { IgetDetailSpace } from '@/apis/modules/index-page/model';

const props = defineProps({
  isSingleEvent: {
    type: Boolean,
    default: false
  },
  showMapResources: {
    type: Boolean,
    default: true
  },
  distances: {
    type: String || Number,
    default: 5
  },
  eventDetail: {
    type: Object as PropType<IgetDetailSpace.Data>,
    default: () => ({})
  }
});
const { layerSwitch, isLastLevelArea, mapChangeModeToPoint, resourcesList, videosList, isMeasureMode, rectMapVisible, maplayerSearchVisible } = useGlobalState();
const { measureUtil } = useMapTools();

const modeTabs = computed(() => {
  return [
    {
      label: '点位',
      value: MAP_POINT
    },
    {
      label: '聚合',
      value: MAP_AGGRE
    },
    {
      label: '热力',
      value: MAP_HEAT
    }
  ];
});

const isOpen = ref(false);
const isMeasure = ref(false);
const layerTitle = ref('资源搜索');
const layerSearchMode = ref('searchSource');

const handleToggle = () => {
  isOpen.value = !isOpen.value;
};
const handleChangeMode = (mode: string) => {
  layerSwitch.mode === mode;
};
const handleMeasure = () => {
  measureUtil.value && measureUtil.value.changeMode('length');
  isMeasureMode.value = true;
};

const handleToggleMapRect = () => {
  rectMapVisible.value = !rectMapVisible.value;
};

watch(
  () => isLastLevelArea.value,
  (val: boolean) => {
    val && mapChangeModeToPoint();
  }
);

// 处理时间
// 新增快捷时间条件
const quickTimeMode = ref('');
const startTimePadStr = '00:00:00';
const endTimePadStr = '23:59:59';

const timeTabs = computed(() => {
  return [
    {
      label: '本日',
      value: 1
    },
    {
      label: '本周',
      value: 2
    },
    {
      label: '本月',
      value: 3
    }
  ];
});

const openLayerSearch = (title:string, mode:string) => {
  layerTitle.value = title;
  layerSearchMode.value = mode;
  maplayerSearchVisible.value = true;
};
const handleClose = () => {
  maplayerSearchVisible.value = false;
};

</script>

<style lang="scss" scoped>
.switcher,
.measure {
  display: block;
  width: calc(var(--xxl) * 0.95175);
  height: calc(var(--xxl) * 0.95175);
}

.layer-panel {
  width: calc(var(--xl) * 15.524);
  // background: rgba(26, 32, 42, 0.6);
  background: url('@/assets/images/layerSwitcher/layer-switch-bg.png') no-repeat;
  background-size: 100% 100%;
  user-select: none;
}

.switch {
  img {
    width: calc(var(--xxl) * 0.7875);
    height: auto;
  }
}

.text {
  font-size: calc(var(--xl) * 0.52);
}

$checkbox-image-width: calc(var(--xl) * 0.52);

.checkbox-group {
  user-select: none;

  .img-icon {
    display: inline-block;
    width: calc(var(--xl) * 0.64);
  }

  .img-uncheck {
    display: inline-block;
    width: $checkbox-image-width;
    height: $checkbox-image-width;
  }

  .img-checked {
    display: none;
    width: $checkbox-image-width;
    height: $checkbox-image-width;
  }

  .is-checked {
    .img-checked {
      display: inline-block;
    }

    .img-uncheck {
      display: none;
    }
  }
}

.event-item-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .number {
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
    font-size: calc(var(--xl) * 0.60);
    font-weight: 600;
    margin-right: var(--sm);
  }
}
.event-checkout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .number {
    font-family: AkzidenzGroteskBQ-Cnd, AkzidenzGroteskBQ;
    font-size: calc(var(--xl) * 0.52);
    font-weight: 500;
    margin-right: var(--sm);
  }
}
.map-level-title {
  font-size: calc(var(--xl) * 0.6);
  font-family: YouSheBiaoTiHei;
  color: #96BEE0;
  background: linear-gradient(180deg, #FFFFFF 0%, #A3D7FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.h-cell {
  width: calc(var(--xxl) * 3.2);
  span {
    font-size:calc(var(--xl) * 0.52)
  }
}
</style>
