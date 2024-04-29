<template>
  <hl-dialog
    :model-value="true"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="事件基本信息"
    width="calc(var(--xxs) * 186)"
    @close="$emit('cancel')"
  >
    <hl-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      class="count-3 grid grid-direction-vertical hl-row"
      style="--row-gap-x: calc(var(--xxs) * 5);--row-gap-y: calc(var(--xxs) * 5)"
    >
      <hl-form-item label="信息标题" prop="name">
        <hl-input v-model="formData.name" placeholder="请输入" block :maxlength="50" />
      </hl-form-item>

      <hl-form-item label="事件类型" prop="eventTypeName">
        <hl-input v-model="formData.eventTypeName" placeholder="请选择" block disabled />
      </hl-form-item>

      <hl-form-item label="事件等级" prop="eventLevelCode">
        <hl-select v-model="formData.eventLevelCode" placeholder="请选择" block>
          <hl-option v-for="level in eventLevels" :key="level.value" :label="level.name" :value="level.value" />
        </hl-select>
      </hl-form-item>

      <hl-form-item  label="发生时间" prop="happenTime">
        <hl-date-picker v-model="formData.happenTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="请选择" :disabled-date="disableFutureDate" block>
          <template #icon>
            <hl-icon><two-calendar /></hl-icon>
          </template>
        </hl-date-picker>
      </hl-form-item>

      <hl-form-item label="行政区划" prop="mainAreaCode">
        <area-cascader
          :model-data="formData.mainAreaCode"
          @change="onAreaCascaderChange"
        />
      </hl-form-item>

      <dynamic-form-item v-for="idx in basicIdxList" :key="idx.code" :idx="idx"/>

      <hl-form-item label="事件描述" prop="desc" class="col-span-3">
        <hl-input v-model="formData.desc" placeholder="请填写" :rows="4" native-type="textarea" show-word-limit :maxlength="1000" block />
      </hl-form-item>

      <hl-form-item label="图片视频文件" prop="detailedAttachmentInfo" class="col-span-3">
        <event-upload-file-form-item
          :attachment-list="formData.detailedAttachmentInfo"
          @update="uploadFileChange"
        />
      </hl-form-item>

    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button class="m-r-lg" @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="hover-style normal-width" @click="handleOK">确定</hl-button>
      </div>
    </template>
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, PropType, provide, computed } from 'vue';
import { pick } from 'lodash-es';
import { FormInstance } from 'hongluan-ui';
import { CommonUtils } from 'fx-front-utils';
import { AreaCascader, AreaChangeEvent } from '@/components';
import { useCurrentEvent, useCurrentArea } from '@/hooks';
import { BASIC_CARD } from '@/common';
import { apiCreateEventObj } from '@/apis/modules/event-create';
import { IgetEventLevelsSpace } from '@/apis/modules/event-create/model';
import EventUploadFileFormItem from './event-upload-file-form-item.vue';
import DynamicFormItem from './dynamic-form-item.vue';

import type { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import type { IpostFindEventTypeIndexListSpace } from '@/apis/modules/event-element/model';

const props = defineProps({
  idxList: {
    type: Array as PropType<IpostFindEventTypeIndexListSpace.Data[]>,
    default: () => []
  }
});
const emit = defineEmits(['ok']);

const { areaCode, areaName } = useCurrentArea();
const { disableFutureDate } = CommonUtils;

const formRef = ref<FormInstance>();
const formData = reactive({
  name: '', // 信息标题
  eventTypeCode: '', // 事件类型编码
  eventTypeName: '', // 事件类型编码
  eventLevelCode: '', // 事件级别
  eventLevelName: '', // 事件级别
  happenTime: '', // 发生时间
  desc: '', // 事件描述
  mainAreaCode: '', // 行政区划编码
  mainAreaName: '', // 行政区划名称
  detailedAttachmentInfo: [] as any[],
  customIdx: {} as Record<string, any>
});
const rules = {
  name: [{ required: true, message: '请输入信息标题' }],
  eventTypeCode: [{ required: true, message: '请选择事件类型' }],
  eventTypeName: [{ required: true, message: '请选择事件类型' }],
  happenTime: [{ required: true, message: '请选择发生时间' }],
  mainAreaCode: [{ required: true, message: '请选择行政区划' }],
  desc: [{ required: true, message: '请输入事件描述' }]
};
const eventLevels = ref<IgetEventLevelsSpace.Data[]>([]);

const basicIdxList = computed(() => props.idxList.filter(i => i.displayCard === BASIC_CARD.value));

const initFormData = async(currentEvent: IpostFindEventDetailByIdSpace.Data) => {
  Object.assign(formData, pick(currentEvent,
    'name',
    'eventTypeCode',
    'eventTypeName',
    'eventLevelCode',
    'eventLevelName',
    'happenTime',
    'desc',
    'mainAreaCode',
    'mainAreaName',
    'detailedAttachmentInfo',
  ));
  currentEvent.indicies.filter(i => i.displayCard === BASIC_CARD.value).forEach(i => {
    formData.customIdx[i.code] = {
      value: i.value,
      code: i.code,
      unit: i.unit,
    };
  });
};

const uploadFileChange = (fileList: any[]) => {
  formData.detailedAttachmentInfo = fileList;
};

const handleOK = async() => {
  await formRef.value?.validate();
  emit('ok', formData);
};

const handleGetEventLevels = async() => {
  const res = await apiCreateEventObj.getEventLevels();
  eventLevels.value = res.data;
};

const onAreaCascaderChange = (data: AreaChangeEvent) => {
  const { id, name } = data;
  formData.mainAreaCode = id || '';
  formData.mainAreaName = name;
};

provide('formData', formData);

useCurrentEvent(initFormData);

onMounted(() => {
  handleGetEventLevels();
});
</script>
<style lang="scss" scoped>
</style>
