<template>
  <hl-group class="layer-switcher-box-nav" align="items-bottom">
    <hl-group v-show="isOpen" class="layer-panel m-r-md static p-sm" dir="vertical" :gap="isSingleEvent ? 'var(--md)' : 'var(--xs)'">

      <hl-group v-if="currentMode === 'nav-event'" align="items-center" gap="var(--xl)">
        <!-- <div class="text map-level-title">事件图层</div> -->

        <hl-group gap="var(--sm)">
          <span class="text">热力图</span>
          <div class="switch" @click="handleChangeMode">
            <img :src="layerSwitch.mode === MAP_HEAT ? switchLeft : switchRight" class="cursor-pointer" />
          </div>
          <span  class="text">点位</span>
        </hl-group>

        <hl-group class="layer-box">
          <hl-checkbox-group v-model="layerSwitch.layerSelected"  class="checkbox-group" gap="var(--xs)">
            <hl-checkbox custom :label="WAITING" gap="var(--sm)" :class="isSingleEvent ? '' : 'h-cell'">
              <img class="img-uncheck" :src="unCheck" />
              <img class="img-checked" :src="checked" />
              <img class="img-icon m-l-xs m-r-xs" :src="waiting" />
              <span>待调度</span>
            </hl-checkbox>
            <hl-checkbox custom :label="PENDING" gap="var(--sm)" :class="isSingleEvent ? '' : 'h-cell'">
              <img class="img-uncheck" :src="unCheck" />
              <img class="img-checked" :src="checked" />
              <img class="img-icon m-l-xs m-r-xs" :src="pending" />
              <span>处置中</span>
            </hl-checkbox>
            <hl-checkbox custom :label="FINISHED" gap="var(--sm)" :class="isSingleEvent ? '' : 'h-cell'">
              <img class="img-uncheck" :src="unCheck" />
              <img class="img-checked" :src="checked" />
              <img class="img-icon m-l-xs m-r-xs" :src="finished" />
              <span>已办结</span>
            </hl-checkbox>
          </hl-checkbox-group>
        </hl-group>
      </hl-group>

      <hl-group v-if="currentMode === 'nav-resource'" align="items-center">
        <!-- <div class="text map-level-title">资源图层</div> -->
        <hl-group class="layer-box" dir="vertical">
          <hl-checkbox-group v-model="layerSwitch.resourcesSelected" :dir="isSingleEvent ? 'vertical' : ''" class="checkbox-group" gap="var(--xs)" :style="isSingleEvent ? '' : 'flex-wrap: wrap;'">
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
      </hl-group>

      <hl-group v-if="currentMode === 'nav-video'" align="items-center">
        <!-- <div class="text map-level-title">视频图层</div> -->
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

    </hl-group>

  </hl-group>
</template>
<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import {
  ALL,
  WAITING,
  PENDING,
  FINISHED,
} from '@/views/event-center/constant';
import {
  MAP_HEAT,
  MAP_POINT,
  RESOURCE_TYPE as RESOURCE,
} from '@/common';
import { useGlobalState } from '@/hooks';
import switchLeft from '@/assets/images/layerSwitcher/switch-left.png';
import switchRight from '@/assets/images/layerSwitcher/switch-right.png';
import unCheck from '@/assets/images/layerSwitcher/uncheck.png';
import checked from '@/assets/images/layerSwitcher/checked.png';
import waiting from '@/assets/images/layerSwitcher/waiting.png';
import pending from '@/assets/images/layerSwitcher/pending.png';
import finished from '@/assets/images/layerSwitcher/finished.png';
import camera from '@/assets/images/layerSwitcher/camera.png';

// 资源
import business from '@/assets/images/layerSwitcher/business.png';
import hospital from '@/assets/images/layerSwitcher/hospital.png';
import hotel from '@/assets/images/layerSwitcher/hotel.png';
import sanxiao from '@/assets/images/layerSwitcher/sanxiao.png';
import school from '@/assets/images/layerSwitcher/school.png';
import traffic from '@/assets/images/layerSwitcher/traffic.png';

const props = defineProps({
  isSingleEvent: {
    type: Boolean,
    default: false
  }
});

const { layerSwitch, isLastLevelArea, mapChangeModeToHeat, mapChangeModeToPoint, resourcesList, videosList, currentMode } = useGlobalState();

const isOpen = computed(() => {
  const showSwitchLayerMode = ['nav-event', 'nav-resource', 'nav-video'];
  return showSwitchLayerMode.includes(currentMode.value);
});

const handleChangeMode = () => {
  layerSwitch.mode === MAP_HEAT ? mapChangeModeToPoint() : mapChangeModeToHeat();
};

watch(
  () => isLastLevelArea.value,
  (val: boolean) => {
    val && mapChangeModeToPoint();
  }
);

</script>

<style lang="scss" scoped>
.layer-panel {
  width: calc(var(--xl) * 27.47);
  height: calc(var(--xl) * 1.48);
  // background: rgba(26, 32, 42, 0.6);
  background: url('@/assets/images/guanghan/footer/switch-bg.png') no-repeat;
  background-size: 100% 100%;
  user-select: none;
}

.switch {
  img {
    width: calc(var(--xxl) * 0.6875);
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
