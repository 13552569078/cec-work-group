<template>
  <div>
    <hv-panel title="主体概览">
      <template #action>
        <hl-group align="items-middle" gap="var(--xxs)" @click="handleShowWarningList">
          <span>当前{{ systemName }}</span>
          <h3 class="font-din text-danger">{{ warninbNum }}</h3>
        </hl-group>
      </template>

      <hl-row v-if="warninbList.length>0" layout="grid" count="count-2" gap="var(--xs)" class="m-t-md">
        <hl-col v-for="(item, index) in warninbList" :key="index" span="col">
          <hb-data-collect full="full-x" padding-x="var(--sm)" padding-y="var(--xs)" :style="`background-color:rgba(var(--rgb-level${index + 1}), 0.04)`">
            <hl-icon size="md" class="symbol" :type="`level${index + 1}`" style="position: relative" :style="`filter: drop-shadow(0 2px 8px rgba(var(--rgb-level${index + 1}), 0.3);`">
              <fill-page />
            </hl-icon>
            <span class="text-secondary font-md m-l-sm">{{ item.codeName || '未知' }}</span>
            <hl-group align="items-middle" class="static" gap="var(--xs)">
              <h4 class="font-din relative">{{ item.value || 0 }}</h4>
            </hl-group>
          </hb-data-collect>
        </hl-col>
      </hl-row>
      <hb-empty v-else image-size="10vh" :image="require('@/assets/images/no-data.svg')" />
    </hv-panel>
    <warning-list-dialog v-if="visible" v-model="visible" :onlyRegion="true"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue';
import { apiRegionAlarmObj } from '@/apis/modules/regionAlarm';
import { IgetFindCurrentRegionAlarmInfoSpace } from '@/apis/modules/regionAlarm/model';
import { useLoop } from '@/hooks';
import WarningListDialog from '../../monitor-center/components/warning-list-dialog.vue';

const props = defineProps({
  regionId: {
    type: Number,
    default: 0
  }
});

const { setLoop } = useLoop();

const visible = ref(false);
const handleShowWarningList = (valueName?: string, value?: string) => {
  visible.value = !visible.value;
};

const warninbNum = ref();
const warninbList = ref<IgetFindCurrentRegionAlarmInfoSpace.Data[]>([]);
const systemName = ref(inject('systemName'));

const initData = async() => {
  // 当前报警
  const { data } = await apiRegionAlarmObj.getFindCurrentWarningNumber(props.regionId);
  warninbNum.value = data;
  // 报警统计
  const searchParams = {
    regionId: props.regionId
  };
  const { data: data1 } = await apiRegionAlarmObj.getFindCurrentRegionAlarmInfo(searchParams);
  warninbList.value = data1;
};

initData();

// 定时刷新
setLoop(initData, 60);
</script>
