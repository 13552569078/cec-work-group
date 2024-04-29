<template>
  <hl-group dir="vertical" gap="var(--md)" class="page-left">
    <left-1 :useFor="useFor"/>
    <left-2 />
  </hl-group>

  <hl-group dir="vertical" gap="var(--md)" class="page-right">
    <right-1 :useFor="useFor"/>
    <right-2 :useFor="useFor"/>
  </hl-group>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, inject } from 'vue';
import { Emitter } from 'mitt';

import left1 from './panels/left-1.vue';
import left2 from './panels/left-2.vue';
import right1 from './panels/right-1.vue';
import right2 from './panels/right-2.vue';

export default defineComponent({
  name: 'MonitorAlarm',
  components: {
    left1,
    left2,
    right1,
    right2,
  },
  setup() {
    const useFor = ref(1); // 1-监测，2-预警"
    const showDetail = ref(false);
    const monitorId = ref('');
    const $mitter = inject('$mitter') as Emitter;

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
    return { monitorId, showDetail, useFor };
  }
});
</script>
