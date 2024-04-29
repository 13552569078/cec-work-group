<template>
  <statistics-panel :regionId="regionId" />
  <hl-group dir="vertical" gap="var(--md)" class="page-left">
    <left-1 :regionId="regionId" />
    <left-2 :regionId="regionId" />
    <left-3 :regionId="regionId" />
  </hl-group>

  <hl-group dir="vertical" gap="var(--md)" class="page-right">
    <right-1 :regionId="regionId" />
  </hl-group>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject, watch, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { Emitter } from 'mitt';
import { useMonitorCenter, useLoop, useMap } from '@/hooks';

import statisticsPanel from './components/statistics-panel.vue';
import left1 from './panels/left-1.vue';
import left2 from './panels/left-2.vue';
import left3 from './panels/left-3.vue';
import right1 from './panels/right-1.vue';

export default defineComponent({
  name: 'MonitorAlarm',
  components: {
    left1,
    left2,
    left3,
    right1,
    statisticsPanel
  },
  setup() {
    const route = useRoute();
    const showDetail = ref(false);
    const monitorId = ref('');
    const regionId = ref(route.query.regionId || 1); // 主体ID
    const $mitter = inject('$mitter') as Emitter;

    const { setLoop } = useLoop();

    const {
      mapRegions,
      mapEvents,
      mapMonitorPoints,
      getMapRegionData,
      getMapEvent,
      getMapMonitorPoints,
    } = useMonitorCenter();

    const {
      updatePointData,
      updatePolygonData,
      resetMapPoint
    } = useMap();

    const fetchMapData = () => {
      const params = {
        monitorRegionId: route.query.regionId as string,
        regionTypeCodeList: '',
        eventTypeCodeList: ''
      };
      resetMapPoint();
      getMapRegionData(params);
      getMapEvent(params);
      getMapMonitorPoints(params);
    };

    fetchMapData();

    setLoop(fetchMapData, 60);

    watch(() => mapRegions.value, () => {
      updatePolygonData(mapRegions.value);
      $mitter.emit('SET_MAP:fly', {
        center: mapRegions.value[0].center,
        zoom: 15,
        duration: 2000
      });
    });

    watch(() => mapEvents.value, () => {
      updatePointData(mapEvents.value);
    });

    watch(() => mapMonitorPoints.value, () => {
      updatePointData(mapMonitorPoints.value);
    });

    onMounted(() => {
      $mitter.on('openDialog:monitorDetail', (id: any) => {
        if (id) {
          showDetail.value = true;
          monitorId.value = id;
        }
      });
      $mitter.on('closeDialog:monitorDetail', () => {
        showDetail.value = false;
      });
    });
    return {
      monitorId,
      showDetail,
      regionId
    };
  }
});
</script>
<style lang="scss">
.today-condition {
  position: absolute;
  top: calc(var(--xxs) * 24);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}
.float-number {
  position: absolute;
  left: size(32px);
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
}
</style>
