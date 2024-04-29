<template>
  <van-dropdown-item ref="dropdownItemRef">
    <template #title>
      <!-- {{ navCurTitle }} -->
      <span :class="[date ? 'title-activate' : '']">预警时间</span>
      <TwoChevronBottom :class="['icon16', date ? 'title-activate' : '']" />
    </template>
    <div class="warning-filter-wrapper">
      <van-cell
        title="选择日期区间"
        :value="date"
        @click="show = true"
        is-link
        title-class="left-title"
      />
    </div>
    <div class="button-group">
      <div class="btn btn-clear" @click="clearParam">清空</div>
      <div class="btn btn-sure" @click="queryList">查询</div>
    </div>
  </van-dropdown-item>
  <van-calendar
        ref="calendarRef"
        v-model:show="show"
        :min-date="minDate"
        type="range"
        @confirm="onConfirm"
        color="#36A4FF"
      />
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import type { DropdownItemInstance } from "vant";
import { DateUtils } from "fx-front-utils";

const props = defineProps({
  apiParams: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["filter"]);

const dropdownItemRef = ref<DropdownItemInstance>();
// const navCurTitle = ref("");
const date = ref("");
const show = ref(false);
const minDate = new Date(2000, 0, 1);
let startTime = "";
let endTime = "";
const formatDate = (val: any) => DateUtils.formatDate(val, "yyyy-MM-dd");
const onConfirm = (values: string[]) => {
  const [start, end] = values;
  show.value = false;
  startTime = formatDate(start);
  endTime = formatDate(end);
  date.value = `${formatDate(start)} ~ ${formatDate(end)}`;
};

const calendarRef = ref();

const clearParam = () => {
  date.value = "";
  startTime = "";
  endTime = "";
  calendarRef.value?.reset();
  emit("filter", { startTime: "", endTime: "" });
  dropdownItemRef.value?.toggle();
};
const queryList = () => {
  emit("filter", {
    startTime: startTime ? startTime + " 00:00:00" : "",
    endTime: endTime ? endTime + " 00:00:00" : "",
  });
  dropdownItemRef.value?.toggle();
};
</script>
<style lang="scss" scoped>
.button-group {
  display: flex;
  margin-bottom: 16px;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  .btn {
    height: 40px;
    width: 164px;
    text-align: center;
    border-radius: 8px;
    line-height: 40px;
  }
  .btn-clear {
    background: #f6f9fb;
    color: #4b4b4b;
  }
  .btn-sure {
    background: #36a4ff;
    color: #ffffff;
  }
}
:deep(.van-cell__title) {
  flex: none;
  width: 32%;
}
</style>
