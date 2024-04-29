<template>
<hl-group class="buffer-panel p-sm" dir="vertical">
  <hl-group class="panel-header w-full m-b-md p-b-sm" align="items-between items-middle">
    <h2 class="title font-xxl">设置半径</h2>
    <div
      class="close cursor-pointer"
      @click="handleClose"
    >
      <img :src="closeButton" />
    </div>
  </hl-group>
  <hl-form ref="formRef" :model="formData" :rules="rules">
    <hl-group align="items-between items-middle">
      <hl-form-item prop="radius">
        <hl-input v-model="formData.radius" maxLength="4" class="static" style="width: calc(var(--xl) * 3)" />
      </hl-form-item>
      <span>千米内</span>
      <hl-button style="width: calc(var(--xl) * 2)" @click="handleConfirm">确认</hl-button>
    </hl-group>
  </hl-form>
</hl-group>
</template>

<script lang='ts' setup>
import { ref, inject, nextTick, reactive } from 'vue';
import { apiIndexPageObj as api } from '@/apis';
import { useMapData, useMapTools } from '@/hooks';
import { ruleNumber } from '@/common';
import closeButton from '@/assets/images/dialog/close.png';

const { eventData, eventMapWrapper } = useMapData();
const { flyToLast, setBufferOptions } = useMapTools();

const emit = defineEmits(['close']);
const reload: any = inject('reload');
const formRef = ref();

const formData = reactive({
  radius: 1
});

const rules = {
  radius: [
    { required: true, message: '请输入查询半径', trigger: 'blur' },
    ruleNumber
  ]
};

const radius = ref(5);

const handleClose = () => {
  reload();
  nextTick(() => {
    setBufferOptions(null);
    flyToLast();
    emit('close');
  });
};

const fetchData = async () => {
  const res = await api.bufferSearch({
    coordx: eventData.value[0].coordinates[0],
    coordy: eventData.value[0].coordinates[1],
    radius: formData.radius
  });
  return res.data;
};

const handleConfirm = async () => {
  await formRef.value.validate();
  flyToLast();
  setBufferOptions({
    center: eventData.value[0].coordinates,
    radius: formData.radius
  });
  // TODO: 缓冲区查询
  console.log('fetchData');
  const eventList = await fetchData();
  const mapEventList = eventList && eventList.length
    ? eventList.map((point: any) => {
      return eventMapWrapper(point);
    })
    : [];
  eventData.value = [eventData.value[0], ...mapEventList.filter(point => point.properties.id !== eventData.value[0].properties.id)];
  console.log(eventData.value, 999);
};

</script>

<style lang='scss' scoped>
  .close {
    img {
      margin-top: calc(var(--xl) * 0.2);
      width: calc(var(--xxl) * 0.672);
    }
  }
  .panel-header {
    min-height: calc(var(--xl) * 1.3) !important;
    max-height: calc(var(--xl) * 2.3);
    background-image: url('@/assets/images/eventStat/underline_half.png');
    background-repeat: no-repeat;
    background-size: contain !important;
    background-color: rgba(33, 40, 49, 0.8) !important;
    padding-bottom: calc(var(--xl) * 0.25);
    background-position: -48% 90%;
    border: 0 none!important;
    &::before {
      display: none;
    }
    &::after {
      display: none;
    }
    .title {
      font-family: SourceHanSansCN-Medium, SourceHanSansCN;
      font-weight: 500;
      color: #ffffff;
    }
  }
  .panel-body {
    background-color: rgba(33, 40, 49, 0.8) !important;
    padding: calc(var(--xl) * 0.6) !important;
  }
</style>
