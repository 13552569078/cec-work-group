<template>
  <van-dropdown-item ref="dropdownItemRef">
    <template #title>
      <!-- {{ navCurTitle }} -->
      <span :class="[keys.length ? 'title-activate' : '']">事件类型</span>
      <TwoChevronBottom :class="['icon16', keys.length ? 'title-activate' : '']" />
    </template>
    <div class="warning-filter-wrapper">
      <hl-tree
        ref="hlTreeRef"
        node-key="systemCode"
        :data="eventTypeData"
        @check-change="handleCheckChange"
        :props="defaultProps"
        show-checkbox
      />
    </div>
    <div class="button-group">
      <div class="btn btn-clear" @click="clearParam">清空</div>
      <div class="btn btn-sure" @click="queryList">查询</div>
    </div>
  </van-dropdown-item>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { HlTree } from "hongluan-ui";
import "hongluan-ui/theme/base.css";
import "hongluan-ui/theme/hl-tree.css";
import type { DropdownItemInstance } from "vant";
import { apiWarningObj } from "@/apis/modules/warning";

defineProps({
  apiParams: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["filter"]);

const dropdownItemRef = ref<DropdownItemInstance>();

// const navCurTitle = ref("");

const eventTypeData = ref<any>([]);
const getData = async () => {
  const result = await apiWarningObj.getListEventTreeVOsEventType();
  eventTypeData.value = result.data;
};
getData();
const defaultProps = {
  children: "childrens",
  label: "eventTypeName",
};
const hlTreeRef = ref();
const keys = ref<string[]>([]);
const handleCheckChange = (val: any, checked: any, indeterminate: any) => {
  console.log(val, checked, indeterminate);
  keys.value = hlTreeRef.value.getCheckedKeys();
};
const clearParam = () => {
  emit("filter", { eventTypeCodes: [] });
  hlTreeRef.value.setCheckedKeys([]);
  keys.value = [];
  dropdownItemRef.value?.toggle();
};
const queryList = () => {
  emit("filter", { eventTypeCodes: keys.value });
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
</style>
