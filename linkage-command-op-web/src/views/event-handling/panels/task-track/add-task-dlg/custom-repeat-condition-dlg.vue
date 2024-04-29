<template>
  <hl-dialog
    class="custom-repeat-condition-dlg"
    :model-value="true"
    :modal="false"
    width="calc(var(--xxs) * 90)"
    placement="center"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    :append-to-body="true"
    @close="$emit('cancel')"
  >
    <template #header>
      <h4>自定义重复</h4>
    </template>
    <hl-group dir="vertical" gap="var(--lg)" class="w-full">
      <hl-group>
        <p>重复周期</p>
        <p
          v-show="searchParams.repeatNum !== '' || searchParams.repeatTypeName !== ''"
        >( {{searchParams.tips}} )</p>
      </hl-group>
      <hl-group class="w-full" align="items-middle items-between">
        每
        <div>
          <hl-select
            v-model="searchParams.repeatNum"
            placeholder="  "
            filterable
            allow-create
            value-key="value"
            @change="repeatNumChange"
          >
            <hl-option
              v-for="item in option.default"
              :key="item + 'index'"
              :label="item"
              :value="`${item}`"
            />
          </hl-select>
          <hl-select
            v-model="searchParams.repeatType"
            placeholder="  "
            style="width:calc(var(--xxs) * 19)"
            @change="repeatTypeChange"
          >
            <hl-option
              v-for="item in optionRepeatType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </hl-select>
        </div>
      </hl-group>
      <hl-group
        v-if="option[searchParams.repeatType]"
        dir="vertical"
        class="border radius-lg"
        align="items-middle"
        full
        gap="var(--lg)"
      >
        <h5
          class="p-lg w-full"
          style="background:var(--border-regular)"
        >设置每{{ searchParams.repeatTypeName }}重复日期，可复选</h5>
        <hl-group class="border-top border-left m-b-lg" style="width:calc(var(--xxs) * 71)" wrap>
          <template v-if="searchParams.repeatType === 'week'">
            <hl-group
              v-for="it in option[searchParams.repeatType]"
              :key="it + 'ind'"
              align="items-middle items-center"
              class="border-bottom border-right cursor-pointer"
              :class="[
              searchParams.repeatSeondary.includes(it.numVal)? 'bg-active text-inverse' : 'bg-content text-gray'
            ]"
              style="width:calc(var(--xxs) * 10);height:calc(var(--xxs) * 10);"
              @click="selectDay(it.numVal)"
            >{{ it.label }}</hl-group>
          </template>
          <template v-else>
            <hl-group
              v-for="it in option[searchParams.repeatType]"
              :key="it + 'ind'"
              align="items-middle items-center"
              class="border-bottom border-right cursor-pointer"
              :class="[
              searchParams.repeatSeondary.includes(it)? 'bg-active text-inverse' : 'bg-content text-gray'
            ]"
              style="width:calc(var(--xxs) * 10);height:calc(var(--xxs) * 10);"
              @click="selectDay(it)"
            >{{ it }}</hl-group>
          </template>
        </hl-group>
      </hl-group>
    </hl-group>
    <template #footer>
      <hl-group class="dialog-footer" gap="var(--md)">
        <hl-button @click="$emit('cancel')">取 消</hl-button>
        <hl-button type="primary" @click="submit">确 定</hl-button>
      </hl-group>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { reactive, watch, watchEffect } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { useTask } from './use-task';
import { WEEK_MAP } from '@/common/constants';

const props = defineProps({
  params: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const { optionRepeatType, getRepeatTaskTips, getOriginalLabel } = useTask();

const option = {
  default: 10,
  month: 31,
  week: WEEK_MAP
} as { [key: string]: any };

const emit = defineEmits(['cancel', 'submit']);

const searchParams = reactive({
  repeatType: props.params.repeatType ?? '',
  repeatTypeName: '',
  repeatNum: props.params.repeatNum ?? '',
  repeatSeondary: props.params.repeatSeondary ?? [] as number[],
  tips: '',
  isRepeat: 1
});
const rangeReg = /^[1-9]+[0-9]*$/;

const repeatNumChange = (val: string) => {
  if (`${val}`.search(rangeReg) === -1) {
    HlMessage({
      type: 'warning',
      message: '请输入正整数!',
    });
  }
};
const repeatTypeChange = () => {
  searchParams.repeatSeondary = [];
};
const selectDay = (day: number) => {
  const dayIndex = searchParams.repeatSeondary.findIndex((el:number) => el === day);
  dayIndex === -1 ? searchParams.repeatSeondary.push(day) : searchParams.repeatSeondary.splice(dayIndex, 1);
};

const submit = () => {
  console.log(searchParams, 'submit');
  if (!searchParams.repeatNum && !searchParams.repeatType) {
    HlMessage({
      type: 'warning',
      message: '请选择或输入重复周期和时长!',
    });
  } else {
    emit('submit', searchParams);
    emit('cancel');
  }
};

watch(props.params, val => {
  const { repeatType, repeatNum, repeatSeondary } = val;
  searchParams.repeatType = repeatType;
  searchParams.repeatNum = repeatNum;
  searchParams.repeatSeondary = repeatSeondary;
}, { immediate: true });
watch(() => searchParams.repeatType, val => {
  searchParams.repeatTypeName = getOriginalLabel(val) as string;
}, { immediate: true });
watchEffect(() => {
  searchParams.tips = getRepeatTaskTips({
    repeatNum: searchParams.repeatNum,
    repeatSeondary: searchParams.repeatSeondary,
    repeatType: searchParams.repeatType,
    isRepeatTaskCustom: 1
  }) as string;
});

</script>

<style lang="scss">
.custom-repeat-condition-dlg {
  --panel-border-color: none;
  .panel-header {
    background-image: url(@/assets/images/event-handling/right-3/add-task-dlg/custom-repeat-condition-dlg.png) !important;
    background-size: 100% 100% !important;
  }
}
.text-gray {
  color: #5e6278;
}
</style>
