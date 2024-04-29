<template>
  <hl-dialog
    v-model="dialogVisible"
    title="监测点详情"
    width="800px"
    :append-to-body="true">
    <hl-row layout="grid" class="m-t-md" count="count-4" gap="var(--md)">
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">监测点名称</span>
          <span class="font-bold group-item">{{formData.monitorPointName?formData.monitorPointName:"-"}}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">监测主体</span>
          <span class="font-bold group-item">{{formData.regionName?formData.regionName:"-"}}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-4">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">事件类型</span>
          <span class="font-bold group-item">{{formData.eventTypeCodeName?formData.eventTypeCodeName:'-'}}</span>
        </hl-group>
      </hl-col>
      <!--   监测因子数组   -->
      <template v-for="(item, index) in formData.factorListVOList" :key="item.monitorPointId">
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">监测因子{{index + 1}}</span>
            <span class="font-bold group-item">{{item.factorName?item.factorName:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">公式</span>
            <span class="font-bold group-item">{{item.formulaCodeName?item.formulaCodeName:'-'}}</span>
          </hl-group>
        </hl-col>
      </template>
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">地址</span>
          <span class="font-bold group-item">{{formData.monitorPointAddress?formData.monitorPointAddress:'-'}}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">坐标</span>
          <span>{{formData.monitorPointLongitude?formData.monitorPointLongitude:'-'}}，{{formData.monitorPointLatitude?formData.monitorPointLatitude:'-'}}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-4">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">监测设备</span>
          <span>
            <hl-tag style="margin-right: var(--sm); cursor: pointer;" type="success" v-for="item in formData.monitorEquipListVoList" :key="item.id">
              {{item.equipName}}
            </hl-tag>
          </span>
        </hl-group>
      </hl-col>
      <hl-col span="col col-span-4">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">描述</span>
          <span class="font-bold group-item">{{formData.monitorPointDescription?formData.monitorPointDescription:'-'}}</span>
        </hl-group>
      </hl-col>
    </hl-row>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { apiRegionAlarmObj } from '@/apis/modules/regionAlarm';
import { IgetFindRegionMonitorPointDetailSpace } from '@/apis/modules/regionAlarm/model';

const props = defineProps({
  modelValue: Boolean,
  eventId: String
});
const formData = ref<IgetFindRegionMonitorPointDetailSpace.Data>({
  'monitorPointId': 0,
  'monitorPointName': '',
  'regionId': 0,
  'regionName': '',
  'eventTypeCode': '',
  'eventTypeCodeName': '',
  'monitorFrequency': 0,
  'monitorFrequencyUnit': '',
  'monitorFrequencyUnitName': '',
  'monitorPointAddress': '',
  'monitorPointLongitude': '',
  'monitorPointLatitude': '',
  'monitorPointDescription': '',
  'factorListVOList': [
    /* {
      'factorId': 0,
      'factorName': '',
      'formulaCode': '',
      'formulaCodeName': '',
      'formulaExpression': '',
      'formulaUrl': ''
    } */
  ],
  'monitorEquipListVoList': [
    /* {
      'id': 0,
      'equipName': '',
      'equipType': 0,
      'equipCode': ''
    } */
  ]
});

const dialogVisible = ref(false);
const openDialog = async(data: any) => {
  console.log(data);
  const result = await apiRegionAlarmObj.getFindRegionMonitorPointDetail(data.pointId);
  console.log('详情', result.data);
  formData.value = result.data;
  dialogVisible.value = true;
};

// 需要暴露出去给父组件调用
defineExpose({ openDialog });
</script>

<style lang="scss">
</style>
