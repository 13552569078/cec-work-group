<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 220)"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="title || '资源详情'"
    borderless
    append-to-body
    @closed="$emit('cancel')"
  >
    <hl-scrollbar :height="scrollbarHeight" max-height="48vh">
      <hl-row layout="grid" class="m-t-lg font-16" count="count-2" gap-x="var(--xxl)" gap-y="var(--lg)">
        <hl-col span="col" v-for="item in labelDataList" :key="item.label">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">{{item.label}}</span>
            <hl-group align="items-left items-middle">
              <span class="font-bold group-item">{{ item.value }}</span>
              <img
                v-if="CALLABLE_COMMUNICATION_MODES.includes(item.key) && item.value"
                class="icon m-l-sm cursor-pointer"
                style="width: var(--sm); height: var(--sm);"
                :src="mobileIcon"
                @click="handleCall"
              >
            </hl-group>
          </hl-group>
        </hl-col>
        <hl-col span="col-span-2" v-if="resourceType === 'resource_material'">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">应急物资</span>
          </hl-group>
          <hl-simple-table
            :cols="equipTableCols"
            :data="tableData"
            cell-padding="sm"
            class="w-100 m-t-lg normal-stripe-table"
          >
            <template #tableIndex="{ rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
          </hl-simple-table>
        </hl-col>
      </hl-row>
    </hl-scrollbar>
  </hl-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { RESOURCE_MATERIAL, RESOURCE_EQUIP, CALLABLE_COMMUNICATION_MODES } from '@/common';
import { apiResourceObj } from '@/apis/modules/resource';
import { apiResourceDetailObj, ApiKeys } from '@/apis/modules/resource-detail';
import { IpostFindEquipByReserveIdSpace } from '@/apis/modules/resource-detail/model';
import { useCurrentEvent, useResourceData, useAreaList, useIcons, useCalling } from '@/hooks';

const { currentEvent } = useCurrentEvent();
const { resourceLabels, equipTableCols, getResourceCustomLabels } = useResourceData();
const { getAreaName, getAreaTree } = useAreaList();
const { mobileIcon } = useIcons();
const { currentCallingUser } = useCalling();

const props = defineProps({
  id: String,
  resourceType: String,
  name: String,
  title: String
});
const emit = defineEmits(['cancel']);

const labelDataList = ref<any>([]);
const scrollbarHeight = ref('auto');
const scrollbarHeightMap: Record<string, string> = {
  risk_reservoir: '45vh',
  resource_material: '48vh',
};
const tableData = ref<IpostFindEquipByReserveIdSpace.Data[]>([]);

const getDetail = async() => {
  const resourceType = props.resourceType!;
  scrollbarHeight.value = scrollbarHeightMap[resourceType] || 'auto';
  const { data } = await apiResourceObj.postFindResourceMainById(props.id!);
  const customData = {} as any;
  data.administrative = getAreaName(data.administrative);
  data.attrs.forEach((el: any) => {
    customData[el.code] = el.valueName || el.value || '--';
  });
  labelDataList.value = handleShowLabels(resourceLabels.value, { ...data, ...customData });

  if (resourceType === RESOURCE_MATERIAL) {
    await getResourceCustomLabels(RESOURCE_EQUIP);
    const res = await apiResourceDetailObj.postFindEquipByReserveId(props.id!);
    tableData.value = res.data.map(el => {
      el?.attrs.forEach((item: any) => {
        el[item.code] = item.valueName || item.value || '--';
      });
      return el;
    });
  }
};

const handleShowLabels = (showLabels: Array<{label: string; key: string; }>, data:any) => {
  const arr = showLabels.map(item => {
    const { label, key, } = item;
    let value = '';
    if (Array.isArray(key)) {
      const vals:any = [];
      key.forEach(k => {
        vals.push(data[k]);
      });
      value = vals.join(' - ');
    } else {
      value = data[key] + '' === '0' ? data[key] : data[key] || '--';
    }
    return {
      label,
      value,
      key
    };
  });
  return arr;
};

const handleCall = () => {
  const obj = { userName: '', mobile: '' };
  labelDataList.value.forEach((el: any) => {
    if (el.key === 'contacts') obj.userName = el.value;
    if (el.key === 'telephone') obj.mobile = el.value;
  });
  if (obj.userName && obj.mobile) currentCallingUser.value = obj;
};

onMounted(async() => {
  await getAreaTree();
  await getResourceCustomLabels(props.resourceType!);
  await getDetail();
});
</script>

<style lang="scss" scoped>
.pic {
  object-fit: cover;
  width: calc(var(--xxl) * 2 + var(--xxl) / 2);
  height: calc(var(--xxl) * 2 + var(--xxl) / 2);
}
:deep(.hl-simple-table) {
  tr>td {
    text-align: center;
  }
}
</style>
