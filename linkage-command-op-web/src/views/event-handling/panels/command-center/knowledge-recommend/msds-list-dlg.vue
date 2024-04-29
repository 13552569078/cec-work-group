<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 310)"
    title="危险品知识库"
    class="msds-list-dlg"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <hl-group gap="var(--md)" class="w-full items-middle items-right m-b-lg">
      <hl-input v-model="keyword" @change="handleCurrentChange(1)">
        <template #prefix>
          <hl-icon><fill-search /></hl-icon>
        </template>
      </hl-input>
      <hl-button type="primary" class="normal-height normal-width" @click="handleCurrentChange(1)">搜索</hl-button>
    </hl-group>
    <hl-scrollbar height="calc(var(--xxs) * 172)">
      <hl-simple-table
        :cols="cols"
        :data="tableData"
        fixed-header
        hover
        row-class-name="cursor-pointer"
        class="normal-stripe-table"
        @row-click="showDetailDlg"
      >
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
      </hl-simple-table>
    </hl-scrollbar>
    <div class="pagination">
      <hl-pagination
        style="width:100%;"
        layout="sizes, total, slot, prev, pager, next"
        :page-size="paginationParams.pageSize"
        :total="paginationParams.total"
        :current-page="paginationParams.currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      >
        <span class="self-full"></span>
      </hl-pagination>
    </div>
    <msds-detail-dlg v-if="detailDlgId" :id="detailDlgId" @cancel="detailDlgId=''" />
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, PropType, onMounted, reactive } from 'vue';
import { apiKnowledgeRecommendObj } from '@/apis/modules/knowledge-recommend';
import { IpostMSDSPageSpace } from '@/apis/modules/knowledge-recommend/model';
import MsdsDetailDlg from './msds-detail-dlg.vue';

const keyword = ref('');
const tableData = ref<IpostMSDSPageSpace.List[]>([]);
const cols = ref([
  { title: '序号', slotName: 'tableIndex' },
  { title: '中文名称', prop: 'chName1', width: 'calc(var(--xxs) * 52)', showTooltip: true, tooltipProps: { width: 'calc(var(--xxs) * 52)' } },
  { title: '化学品俗名', prop: 'chName2' },
  { title: '英文名称', prop: 'enName1', width: 'calc(var(--xxs) * 52)', showTooltip: true, tooltipProps: { width: 'calc(var(--xxs) * 52)' } },
  { title: '化学品类别', prop: 'chemicalType' },
  { title: 'CAS.NO', prop: 'casNo' },
]);
const paginationParams = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 10
});
const detailDlgId = ref('');

const loadMSDSList = async() => {
  const result = await apiKnowledgeRecommendObj.postMSDSPage({ currentPage: paginationParams.currentPage, pageSize: paginationParams.pageSize, keyword: keyword.value });
  tableData.value = result.data.list;
  paginationParams.total = result.data.totalRow;
};

const handleCurrentChange = (current: number) => {
  paginationParams.currentPage = current;
  loadMSDSList();
};
const handleSizeChange = (val: number) => {
  paginationParams.pageSize = val;
  paginationParams.currentPage = 1;
  loadMSDSList();
};

const showDetailDlg = (row: IpostMSDSPageSpace.List) => {
  console.log('rowww, row', row);
  detailDlgId.value = row.id;
};

onMounted(() => {
  loadMSDSList();
});
</script>
<style scoped lang="scss">
.pagination {
  display: flex;
  justify-content: center;
  margin-top: calc(var(--xxs) * 6);
}
</style>
