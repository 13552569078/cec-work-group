<template>
  <hl-dialog
    :model-value="true"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="损失情况"
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
      <dynamic-form-item v-for="idx in lossIdxList" :key="idx.code" :idx="idx"/>
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
import { ref, reactive, PropType, provide, computed } from 'vue';
import { pick } from 'lodash-es';
import { useCurrentEvent } from '@/hooks';
import { LOSS_CARD, nonNegativeFloatValidator, nonNegativeIntValidator } from '@/common';
import { CommonUtils } from 'fx-front-utils';
import DynamicFormItem from './dynamic-form-item.vue';

import type { FormInstance } from 'hongluan-ui';
import type { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';
import type { IpostFindEventTypeIndexListSpace } from '@/apis/modules/event-element/model';

const props = defineProps({
  idxList: {
    type: Array as PropType<IpostFindEventTypeIndexListSpace.Data[]>,
    default: () => []
  }
});
const emit = defineEmits(['ok']);

const { disableFutureDate } = CommonUtils;

const formRef = ref<FormInstance>();
const formData = reactive({
  customIdx: {} as Record<string, any>
});
const rules = {};
const lossIdxList = computed(() => props.idxList.filter(i => i.displayCard === LOSS_CARD.value));

const initFormData = (currentEvent: IpostFindEventDetailByIdSpace.Data) => {
  currentEvent.indicies.filter(i => i.displayCard === LOSS_CARD.value).forEach(i => {
    formData.customIdx[i.code] = {
      value: i.value,
      code: i.code,
      unit: i.unit,
    };
  });
};
const handleOK = async() => {
  await formRef.value?.validate();
  emit('ok', formData);
};

provide('formData', formData);

useCurrentEvent(initFormData);
</script>
<style lang="scss" scoped>
</style>
