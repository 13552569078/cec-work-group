<template>
  <common-dialog-modelless :title="title" width="calc(var(--xxl) * 19)" @close="handleClose" class="rect-manager-info" :draggable="true">

    <hl-group wrap class="standard-text" gap="var(--md)">
      <hl-group v-for="i in info" :key="i.label" style="width: 48%;">
        {{ i.label }}： <span>{{ i.value }}</span>
      </hl-group>
    </hl-group>

  </common-dialog-modelless>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useMapTools, useRectData, useGlobalState } from '@/hooks';
import { IgetRectDataSpace, IgetRectManagerDataSpace } from '@/apis/modules/rect-data/model';

const props = defineProps({
  data: Object
});

const emit = defineEmits(['close']);

const title = '网格员详细信息';

const mapper = new Map([
  ['xm', '姓名'],
  ['dhhm', '电话'],
  ['xb', '性别'],
  ['zw', '职位'],
  ['zzmm', '政治面貌'],
  ['sswg', '所属网格'],
  ['ssjd', '所属街道'],
  ['sq', '社区'],
  ['zt', '工作状态'],
  ['xl', '学历'],
  ['zjhm', '身份证'],
]);

const getPosition = (rectManagerInfo: IgetRectManagerDataSpace.RectManagerInfo) => {
  if (rectManagerInfo.dwgcsf === '0') {
    if (rectManagerInfo.zwgcsf !== '0') {
      return rectManagerInfo.zwgcsf;
    } else {
      return '网格员';
    }
  } else {
    return rectManagerInfo.dwgcsf;
  }
};

const info = computed(() => {
  const zw = getPosition(props.data);

  const newInfo = {
    ...props.data,
    sswg: `${props.data.ssdwg}/${props.data.sszwg}/${props.data.ssxwg}`,
    zw
  };

  const arr = [];

  mapper.forEach((label: string, key: string) => {
    arr.push({
      label,
      value: newInfo[key as keyof typeof newInfo]
    });
  });

  return arr;
});

const handleClose = () => {
  // rectInfoVisible.value = false;
  emit('close');
};

</script>
<style lang="scss" scoped>

</style>
