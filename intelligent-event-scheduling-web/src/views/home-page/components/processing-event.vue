<template>
  <hl-panel
    class="w-full h-full"
    header-style="gap: 0px;"
    borderless
    padding="var(--xl)"
    body-class="p-b-lg p-x-lg"
    body-style="padding-top: 0px;"
  >
    <hl-group style="height: calc(var(--xxs) * 18)" align="items-middle">
      <div class="panel-header-left">
        <hl-icon class="static" type="primary" size="md">
          <FillOrnamentTitle4></FillOrnamentTitle4>
        </hl-icon>
      </div>
      <div class="panel-title">
        <h6 class="title">正在处置中事件</h6>
      </div>
    </hl-group>
    <hl-simple-table :cols="cols" :data="tableData" border="bordered" resize class="m-b-lg">
      <template #tableIndex="{ rowIndex }">
        <span>{{ rowIndex + 1 }}</span>
      </template>
    </hl-simple-table>
  </hl-panel>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { apiHomePageApiObj } from '@/apis/modules/home-page';

const tableData = ref([]);
const cols = ref([
  { title: '序号', slotName: 'tableIndex', width: '50px' },
  { title: '事件标题', prop: 'name', showTooltip: true, tooltipProps: { effect: 'light' } },
  { title: '事件类型', prop: 'eventTypeName', showTooltip: true, width: '120px', tooltipProps: { effect: 'light' } },
  { title: '事件地点', prop: 'address', showTooltip: true, tooltipProps: { effect: 'light' } },
  { title: '发生时间', prop: 'happenTime', width: '200px' },
]);

const getEventList = async() => {
  const res = await apiHomePageApiObj.getEventList();
  tableData.value = res.data;
};

onMounted(async() => {
  await getEventList();
});
</script>
