<template>
  <common-dialog-modelless :title="title" width="calc(var(--xxl) * 19)" @close="handleClose" class="rect-info" :draggable="true">

    <hl-group class="w-full m-b-md" dir="vertical" merge block full gap="var(--md)">
      <hl-group class="standard-text" gap="var(--md)">
        <span>网格名称</span>
        {{ currentMidRectParams.wgmc ||  currentBigRectParams.wgmc}}
      </hl-group>
      <hl-group class="standard-text" gap="var(--md)">
        <span>所属街道</span>
        {{  currentMidRectParams.sszjd || currentBigRectParams.sszjd }}
      </hl-group>
    </hl-group>

    <hl-simple-table
      :cols="cols"
      :data="rectManagerList"
      class="m-b-md standard-text"
      @row-click="handleClick"
      hover
    >
      <template #zw="{ row }">
        <div>{{ getPosition(row) }}</div>
      </template>
      <template #handle>
        <a>
          <hl-icon>
            <FillPhone2 />
          </hl-icon>
        </a>
      </template>
    </hl-simple-table>

    <hl-pagination
      size="sm"
      :current-page="pagination.currentPage"
      page-size="10"
      layout="total, prev, pager, next"
      :total="pagination.total"
      align="items-between"
      @current-change="handleCurrentChange"> </hl-pagination>

  </common-dialog-modelless>

  <rect-manager-info v-if="currentManagerInfo" :data="currentManagerInfo" @close="currentManagerInfo = null"/>
</template>
<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useMapTools, useRectData, useGlobalState } from '@/hooks';
import { IgetRectDataSpace, IgetRectManagerDataSpace } from '@/apis/modules/rect-data/model';

const emit = defineEmits(['close']);

const title = '网格信息';

const { flyToDefault } = useMapTools();
const { rectManagerData, rectManagerList, currentBigRectParams, currentMidRectParams, getRectManagerData, resetRectMap } = useRectData();
const { rectInfoVisible } = useGlobalState();

const tableData = ref([]);

const pagination = reactive({
  currentPage: 1,
  total: 0
});

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page;
  getRectManagerData(page);
};

watch(() => rectManagerData.value, (val: any) => {
  if (val && val.total) {
    pagination.total = val.total;
  }
}, { immediate: true });

const cols = ref([
  { title: '姓名', prop: 'xm' },
  { title: '职位', slotName: 'zw', minWidth: '4em' },
  { title: '所属网格', prop: 'sszwg', align: 'center' },
  {
    title: '政治面貌',
    prop: 'zzmm',
    align: 'center',
  },
  {
    title: '联系方式',
    prop: 'dhhm',
    align: 'center',
  },
  { title: '操作', slotName: 'handle', align: 'center' },
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

const handleClose = () => {
  flyToDefault();
  resetRectMap();
  emit('close');
  rectInfoVisible.value = false;
};

const currentManagerInfo = ref();

const handleClick = (row: IgetRectManagerDataSpace.RectManagerInfo) => {
  console.log(row);
  currentManagerInfo.value = row;
};

</script>
<style lang="scss" scoped>

</style>
