<template>
  <hl-group :class="['layer-switcher-box', isSingleEvent ? 'layer-switcher-single-box' : '']" align="items-bottom">
    <hl-group v-show="isOpen && showMapResources" class="layer-panel m-r-md static m-t-md" dir="vertical"
      :gap="isSingleEvent ? 'var(--md)' : 'var(--xs)'">
      <div class="text event-item-title" v-if="isSingleEvent">
        <span>
          <img :src="radiusTitleIcon" />
          事件
        </span>
        <span><span class="number font-din">{{ mapResourcesTotal.eventStat.preDispatchNum +
          mapResourcesTotal.eventStat.completedNum + mapResourcesTotal.eventStat.disposalNum }}</span>件</span>
      </div>
      <div class="text map-level-title" v-else>事件图层</div>
      <hl-group class="panel" gap="var(--md)" v-if="isSingleEvent" align="items-between">
        <hl-group align="items-middle">
          <quarter-time-select v-model="quarterAndMonthTimeObj" @change="handleQuarterAndMonthTimeChanged" />
        </hl-group>
        <hl-group align="items-middle">
          <hl-group style="width: 50%;">
            <c-tabs :isFull="true" v-model="quickTimeMode" :tabs="timeTabs"
              @update:modelValue="changeCurrentTimeSelect" />
          </hl-group>
        </hl-group>
      </hl-group>
      <hl-group class="layer-box" dir="vertical">
        <hl-checkbox-group v-model="layerSwitch.layerSelected" :dir="isSingleEvent ? 'vertical' : ''"
          class="checkbox-group" gap="var(--xs)">
          <hl-checkbox custom :label="WAITING" gap="var(--sm)" :class="isSingleEvent ? '' : 'h-cell'">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="waiting" />
            <div class="event-checkout-item font-din" v-if="isSingleEvent">
              <span>待调度</span>
              <span><span class="number">{{ mapResourcesTotal.eventStat.preDispatchNum }}</span>件</span>
            </div>
            <span v-else>待调度</span>
          </hl-checkbox>
          <hl-checkbox custom :label="PENDING" gap="var(--sm)" :class="isSingleEvent ? '' : 'h-cell'">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="pending" />
            <div class="event-checkout-item font-din" v-if="isSingleEvent">
              <span>处置中</span>
              <span><span class="number">{{ mapResourcesTotal.eventStat.disposalNum }}</span>件</span>
            </div>
            <span v-else>处置中</span>
          </hl-checkbox>
          <hl-checkbox custom :label="FINISHED" gap="var(--sm)" :class="isSingleEvent ? '' : 'h-cell'">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="finished" />
            <div class="event-checkout-item font-din" v-if="isSingleEvent">
              <span>已办结</span>
              <span><span class="number">{{ mapResourcesTotal.eventStat.completedNum }}</span>件</span>
            </div>
            <span v-else>已办结</span>
          </hl-checkbox>
        </hl-checkbox-group>
      </hl-group>
      <div class="text event-item-title" v-if="isSingleEvent">
        <span>
          <img :src="radiusTitleIcon" />
          资源
        </span>
        <span><span class="number font-din">{{ resourcesTotal }}</span>件</span>
      </div>
      <div class="text map-level-title" v-else>资源图层</div>
      <hl-group class="layer-box" dir="vertical">
        <hl-checkbox-group v-model="layerSwitch.resourcesSelected" :dir="isSingleEvent ? 'vertical' : ''"
          class="checkbox-group" gap="var(--xs)" :style="isSingleEvent ? '' : 'flex-wrap: wrap;'">
          <hl-checkbox v-for="item in resourcesList" custom :label="item.type" gap="var(--sm)" :key="item.id"
            :class="isSingleEvent ? '' : 'h-cell'">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="sanxiao" v-if="item.type === RESOURCE.SANXIAO" />
            <img class="img-icon m-l-xs m-r-xs" :src="business" v-if="item.type === RESOURCE.BUSINESS" />
            <img class="img-icon m-l-xs m-r-xs" :src="traffic" v-if="item.type === RESOURCE.TRAFFIC" />
            <img class="img-icon m-l-xs m-r-xs" :src="hospital" v-if="item.type === RESOURCE.HOSPITAL" />
            <img class="img-icon m-l-xs m-r-xs" :src="school" v-if="item.type === RESOURCE.SCHOOL" />
            <img class="img-icon m-l-xs m-r-xs" :src="hotel" v-if="item.type === RESOURCE.HOTEL" />
            <div class="event-checkout-item font-din" v-if="isSingleEvent">
              <span>{{ item.name }}</span>
              <span><span class="number">{{ item.total }}</span>件</span>
            </div>
            <span v-else>{{ item.name }}</span>
          </hl-checkbox>
        </hl-checkbox-group>
      </hl-group>
      <div class="text event-item-title" v-if="isSingleEvent">
        <span>
          <img :src="radiusTitleIcon" />
          视频
        </span>
        <span><span class="number font-din">{{ mapResourcesTotal.videoStat.monitorVideoNum }}</span>件</span>
      </div>
      <div class="text map-level-title" v-else>视频图层</div>
      <hl-group class="layer-box" dir="vertical">
        <hl-checkbox-group v-model="layerSwitch.videosSelected" dir="vertical" class="checkbox-group" gap="var(--xs)">
          <hl-checkbox v-for="item in videosList" custom :label="item.type" gap="var(--sm)" :key="item.id">
            <img class="img-uncheck" :src="unCheck" />
            <img class="img-checked" :src="checked" />
            <img class="img-icon m-l-xs m-r-xs" :src="camera" />
            <div class="event-checkout-item font-din" v-if="isSingleEvent">
              <span>{{ item.name }}</span>
              <span><span class="number">{{ mapResourcesTotal.videoStat.monitorVideoNum }}</span>件</span>
            </div>
            <span v-else>{{ item.name }}</span>
          </hl-checkbox>
        </hl-checkbox-group>
      </hl-group>
    </hl-group>
    <hl-group dir="vertical" gap="var(--sm)" v-if="!isSingleEvent">
      <img class="measure cursor-pointer static" :src="isMeasure ? measureBtnOn : measureBtn" @click="handleMeasure" />
      <img class="switcher cursor-pointer static" :src="isOpen ? layerSwitchBtnOn : layerSwitchBtn"
        v-if="showMapResources" @click="handleToggle" />
    </hl-group>

  </hl-group>
</template>
<script lang="ts" setup>
import { ref, watch, computed, PropType, nextTick } from 'vue';
import {
  ALL,
  WAITING,
  PENDING,
  FINISHED,
  SHOW_CAMERA
} from '@/views/event-center/constant';
import {
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
// 半径查询图标
import radiusTitleIcon from '@/assets/images/layerSwitcher/radius-title-icon.png';

import { cloneDeep } from 'lodash-es';
import { DEFAULT_SET_TIME } from '@/common';
import dayjs from 'dayjs';
import { IgetDetailSpace } from '@/apis/modules/index-page/model';
import { apiIndexPageObj as api, apiEventResourcesObj } from '@/apis';

const { flyToLast, setBufferOptions } = useMapTools();

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
const { mapResourcesTotal, getMapResourcesTotal, eventData, eventMapWrapper, resourceMapWrapper, resourcesList: mapResourcesList, videoMapWrapper, cameraData } = useMapData();
const { eventInfoTabName, layerSwitch, isLastLevelArea, mapChangeModeToHeat, mapChangeModeToPoint, resourcesList, videosList, searchParams } = useGlobalState();
const { measureUtil } = useMapTools();
// 获取半径查询数量统计
watch(() => props.showMapResources, val => {
  if (val && props.isSingleEvent) {
    getMapResourcesTotal({
      'coordx': props.eventDetail.coordx,
      'coordy': props.eventDetail.coordy,
      'radius': Number(props.distances),
      'endTime': searchParams.endTime as string,
      'startTime': searchParams.startTime as string
    });
    nextTick(() => {
      // 事件
      getEventRadius();

      // 资源
      getResourceRadius();

      // 视频
      getVideoRadius();
    });
  }
}, {
  immediate: true
});
// 资源总数量
const resourcesTotal = ref(0);
watch(mapResourcesTotal, () => {
  resourcesTotal.value = 0;
  resourcesList.value.forEach(item => {
    item.total = mapResourcesTotal.value.resourceStat[item.prop];
    resourcesTotal.value += item.total;
  });
}, {
  deep: true
});

const isOpen = ref(true);
const isMeasure = ref(false);

const handleToggle = () => {
  isOpen.value = !isOpen.value;
};
const handleChangeMode = () => {
  layerSwitch.mode === MAP_HEAT ? mapChangeModeToPoint() : mapChangeModeToHeat();
};
const handleMeasure = () => {
  measureUtil.value && measureUtil.value.changeMode('length');
  isMeasure.value = !isMeasure.value;
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

const changeCurrentTimeSelect = (val: string | number) => {
  switch (val) {
    case 1:
      handleSearchTimeChanged([`${dayjs().format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    case 2:
      handleSearchTimeChanged([`${dayjs().startOf('week').format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().endOf('week').format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    case 3:
      handleSearchTimeChanged([`${dayjs().startOf('month').format('YYYY-MM-DD')} ${startTimePadStr}`, `${dayjs().endOf('month').format('YYYY-MM-DD')} ${endTimePadStr}`]);
      break;
    default:
      break;
  }
};
// 默认为当年当月
const quarterAndMonthTimeObj = ref(cloneDeep(DEFAULT_SET_TIME));
const handleQuarterAndMonthTimeChanged = (value: string[]) => {
  quickTimeMode.value = '';
  handleSearchTimeChanged(value);
};

const handleSearchTimeChanged = (value: string[]) => {
  searchParams.startTime = value[0];
  searchParams.endTime = value[1];
  // globalSearchIsChanged();
  console.log('时间变化', value);
  getMapResourcesTotal({
    'coordx': props.eventDetail.coordx,
    'coordy': props.eventDetail.coordy,
    'radius': Number(props.distances),
    'endTime': searchParams.endTime as string,
    'startTime': searchParams.startTime as string
  });
  getEventRadius();
};

// 半径查询事件
const fetchData = async () => {
  const res = await api.bufferSearch({
    coordx: Number(eventData.value[0].coordinates[0]),
    coordy: Number(eventData.value[0].coordinates[1]),
    radius: +props.distances,
    endTime: searchParams.endTime as string,
    startTime: searchParams.startTime as string
  });
  return res.data;
};

watch(() => props.distances, () => {
  nextTick(() => {
    if (props.showMapResources) {
      getMapResourcesTotal({
        'coordx': props.eventDetail.coordx,
        'coordy': props.eventDetail.coordy,
        'radius': Number(props.distances),
        'endTime': searchParams.endTime as string,
        'startTime': searchParams.startTime as string
      });
      // 事件
      getEventRadius();

      // 资源
      getResourceRadius();

      // 视频
      getVideoRadius();
    }
  });
});

const getEventRadius = async () => {
  flyToLast();
  setBufferOptions({
    center: [+eventData.value[0].coordinates[0], +eventData.value[0].coordinates[1]],
    radius: +props.distances,
  });
  const eventList = await fetchData();
  const mapEventList = eventList && eventList.length
    ? eventList.map((point: any) => {
      return eventMapWrapper(point);
    })
    : [];
  eventData.value = [eventData.value[0], ...mapEventList.filter(point => point.properties.id !== eventData.value[0].properties.id)];
};

const getResourceRadius = async () => {
  const { data } = await apiEventResourcesObj.postResourceRadiusQuery(eventData.value[0].coordinates[0], eventData.value[0].coordinates[1], +props.distances);
  const result = resourceMapWrapper(data as any);
  mapResourcesList.value = result;
};

const getVideoRadius = async () => {
  const { data } = await apiEventResourcesObj.postVideoRadiusQuery(eventData.value[0].coordinates[0], eventData.value[0].coordinates[1], +props.distances);
  const result = data.map(item => {
    return videoMapWrapper(item as any);
  });
  cameraData.value = result;
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
  width: calc(var(--xl) * 13.524);
  // background: url('@/assets/images/layerSwitcher/layer-switch-bg.png') no-repeat;
  // background-size: 100% 100%;
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
  height: calc(var(--xl) + var(--xl));

  .number {
    font-size: calc(var(--xl) * 1.16);
    font-weight: 600;
    margin-right: var(--sm);
    color: #FFC97A;
  }
}

.event-checkout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .number {
    font-size: calc(var(--xl) * 1.16);
    font-weight: 600;
    margin-right: var(--sm);
    color: #82FFA1;
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
    font-size: calc(var(--xl) * 0.52)
  }
}

.event-item-title {
  background: url("@/assets/images/layerSwitcher/radius-title-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding-right: var(--sm);
  height: calc(var(--xl) * 1.46);

  img {
    width: var(--lg);
    height: var(--lg);
    margin-left: var(--sm);
    margin-right: var(--xs);
  }
}

:deep(.hl-checkbox-group .hl-checkbox) {
  height: calc(var(--xl) * 1.45);
  background: rgba(33, 70, 100, 0.56);
  border: 1px solid #4C7595;
  padding-left: var(--sm);
  padding-right: var(--sm);
}
</style>
