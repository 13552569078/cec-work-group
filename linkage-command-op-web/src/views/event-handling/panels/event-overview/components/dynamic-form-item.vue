<template>
  <hl-form-item
    v-if="formData.customIdx[idx.code]"
    :key="idx.code"
    :label="idx.name"
    :prop="`customIdx.${idx.code}.value`"
    :class="{'col-span-3': idx.type === EVENT_TEXT_IDX && idx.length === EVENT_TEXT_IDX_LONG}"
    :rules="idx.type === EVENT_NUM_IDX ? [{
      validator: validateCustomValue(idx.length, idx.precision)
    }, {
      validator: validateUnit
    }] : []"
  >
    <template v-if="idx.type === EVENT_TEXT_IDX">
      <hl-input
        v-model="formData.customIdx[idx.code].value"
        :native-type="idx.length !== EVENT_TEXT_IDX_LONG ? 'text' : 'textarea'"
        placeholder="请输入"
        block
        :maxlength="idx.length"
        :show-word-limit="idx.length === EVENT_TEXT_IDX_LONG"
        :rows="4"
      />
    </template>
    <template v-else>
      <hl-group full="full-x" block>
        <hl-input
          v-model="formData.customIdx[idx.code].value"
          placeholder="请输入"
          block
          class="with-affixe"
        >
          <template #suffix>
            <hl-select v-model="formData.customIdx[idx.code].unit" placeholder="单位" filterable>
              <hl-option v-for="u in getUnits(idx.unit)" :key="u" :label="u" :value="u"></hl-option>
            </hl-select>
          </template>
        </hl-input>
      </hl-group>
    </template>
  </hl-form-item>
</template>
<script lang="ts" setup>
import { inject, onMounted, PropType } from 'vue';
import { validateCustomValue, EVENT_TEXT_IDX, EVENT_NUM_IDX, EVENT_TEXT_IDX_LONG } from '@/common';
import { IpostFindEventTypeIndexListSpace } from '@/apis/modules/event-element/model';

const props = defineProps({
  idx: {
    type: Object as PropType<IpostFindEventTypeIndexListSpace.Data>,
    default: () => ({})
  },
});

const formData = inject('formData') as Record<string, any>;

const validateUnit = (_: any, __: string, callback: (err?: Error) => void) => {
  if (formData.customIdx[props.idx.code].value && !formData.customIdx[props.idx.code].unit) {
    callback(new Error('请选择单位'));
  } else {
    callback();
  }
};

const getUnits = (units: string) => {
  return units?.split(',') || [];
};

onMounted(() => {
  if (!formData.customIdx[props.idx.code].unit) {
    formData.customIdx[props.idx.code].unit = getUnits(props.idx.unit)[0] || '';
  }
});
</script>
