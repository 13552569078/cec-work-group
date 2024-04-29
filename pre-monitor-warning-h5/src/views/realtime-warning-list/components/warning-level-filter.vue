<template>
  <van-dropdown-item ref="dropdownItemRef">
    <template #title>
      <!-- {{ navCurTitle }} -->
      <span :class="[selectedLevel ? 'title-activate' : '']">预警等级</span>
      <TwoChevronBottom :class="['icon16', selectedLevel ? 'title-activate' : '']" />
    </template>
    <div class="warning-filter-wrapper">
      <div class="warning-status-wrapper">
        <span
          v-for="t in levelList"
          :key="t.dictCode"
          @click="showResult(t)"
          :class="{ selected: t.selected, 'status-item': true }"
        >
          <span>{{ t.dictName }}</span>
        </span>
      </div>
    </div>
    <div class="button-group">
      <div class="btn btn-clear" @click="clearParam">清空</div>
      <div class="btn btn-sure" @click="queryList">查询</div>
    </div>
  </van-dropdown-item>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
import { apiDictObj } from "@/apis/modules/dict";
import { IgetListDictCustomVOsDictSpace } from "@/apis/modules/dict/model";

import type { DropdownItemInstance } from "vant";

defineProps({
  apiParams: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["filter"]);

const dropdownItemRef = ref<DropdownItemInstance>();
const levelList = ref<IgetListDictCustomVOsDictSpace.Data[]>([]);
const getDict = async () => {
  const { data } = await apiDictObj.getListDictCustomVOsDict("ALARM_LEVEL_CODE");
  levelList.value = data.map(item => { item.selected = false; return item; });
};
const selectedLevel = computed(() => {
  return !!levelList.value.filter(item => item.selected).length;
});
getDict();
// const navCurTitle = ref("");

const showResult = (t: any) => {
  t.selected = !t.selected;
};
const clearParam = () => {
  levelList.value.forEach(item => { item.selected = false; });
  emit("filter", { alarmLevels: [] });
  dropdownItemRef.value?.toggle();
};
const queryList = () => {
  emit("filter", { alarmLevels: levelList.value.filter(item => item.selected).map(item2 => item2.dictCode) });
  dropdownItemRef.value?.toggle();
};
</script>
<style lang="scss" scoped>
.warning-status-wrapper {
  display: flex;
  flex-direction: column;

  .status-item {
    height: 36px;
    padding-left: 16px;
    padding-right: 16px;
    font-size: 12px;
    font-weight: normal;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    &.selected {
      background-color: var(--bg-hover);
      color: var(--primary);
    }
  }
}
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
</style>
