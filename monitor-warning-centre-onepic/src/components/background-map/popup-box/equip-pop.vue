<template>
  <hl-panel v-if="equipmentList && equipmentList.length" borderless class="page-panel" body-padding="var(--sm)" :class="{ collapsed: minStatus}">
    <template #header>
      <h5 class="panel-title font-lg">
        设备列表
      </h5>
      <div class="panel-header-right" style="transform: translateX(12px);user-select:none;">
        <hl-button equal no-fill @click="handleClose">
          <hl-icon><two-close /></hl-icon>
        </hl-button>
      </div>
    </template>
    <hl-group v-if="equipmentList" dir="vertical" gap="var(--md)" class="p-l-sm cursor-pointer">
      <hl-group
        v-for="equip in equipmentList"
        :key="equip.equipId"
        align="items-middle"
        gap="var(--xs)"
        @click="handleShowEquipDetail(equip)">
        <!-- 传感设备 -->
        <hl-thumb class="m-r-xs" v-if="equip.equipType === 1" :src="iconIot" size="xxxs"/>
        <!-- 视频设备 -->
        <hl-thumb class="m-r-xs" v-else :src="iconCamera" size="xxxs"/>
        <span>{{ equip.equipName }}</span>
      </hl-group>
    </hl-group>
  </hl-panel>

</template>

<script setup lang="ts">
import { ref, watch, inject } from 'vue';
import { useMonitorCenter } from '@/hooks';
import iconIot from '@/assets/images/popupbox/iot.png';
import iconCamera from '@/assets/images/popupbox/camera.png';
import { Emitter } from 'mitt';
const $mitter = inject('$mitter') as Emitter;

const emit = defineEmits(['close']);
const props = defineProps({
  monitorPointId: {
    type: String,
    default: ''
  }
});

const { equipmentList, getEquipmentList } = useMonitorCenter();

const handleClose = () => {
  emit('close');
};

const handleShowEquipDetail = (equip: any) => {
  if (equip.equipType === 1) {
    $mitter.emit('OPEN_DIALOG:iotInfo', equip.pointId);
  } else {
    // console.log('发送的', equip.equipId);
    $mitter.emit('OPEN_DIALOG:videoInfo', [equip.equipId]);
  }
};

watch(() => props.monitorPointId, (newVal: string) => {
  equipmentList.value = [];
  if (newVal) {
    getEquipmentList(newVal);
  }
});

</script>
