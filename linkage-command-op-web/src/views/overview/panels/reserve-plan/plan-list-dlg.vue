<template>
  <hl-dialog
    :model-value="true"
    custom-class="plan-list-dlg"
    width="calc(var(--xxl) * 35)"
    title="应急预案"
    append-to-body
    @closed="$emit('cancel')"
  >
    <hl-form inline class="form-container">
      <div class="display-flex plan-form-left">
        <hl-form-item label="行政区划">
          <area-cascader
            :model-data="form.areaCode"
            @change="onAreaCascaderChange"
          />
        </hl-form-item>
        <hl-form-item label="预案级别">
          <hl-select v-model="form.planLevel" class="w-sm">
            <hl-option v-for="item in planLevels" :key="item.code" :value="item.code" :label="item.name" />
          </hl-select>
        </hl-form-item>
        <hl-form-item label="预案类型">
          <hl-select v-model="form.planType"  class="w-sm">
            <hl-option v-for="item in planTypes" :key="item.code" :value="item.code" :label="item.name" />
          </hl-select>
        </hl-form-item>
      </div>
      <hl-form-item>
        <hl-input v-model="form.planName" clearable>
          <template #prefix>
            <hl-icon><fill-search /></hl-icon>
          </template>
        </hl-input>
        <div>
          <hl-button type="primary" class="m-r-sm m-l-sm" @click="handleCurrentChange(1)">搜索</hl-button>
          <hl-button @click="resetForm">重置</hl-button>
        </div>
      </hl-form-item>
    </hl-form>
    <hl-scrollbar height="calc(var(--xxs) * 110)">
      <hl-simple-table
        :cols="cols"
        :data="tableData"
        hover
        stripe
        list
        gap-y="var(--xxs)"
        class="normal-stripe-table"
        @cell-click="previewDlg"
      >
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
      </hl-simple-table>
    </hl-scrollbar>
    <div class="pagination">
      <hl-pagination
        layout="total, prev, pager, next"
        :page-size="paginationParams.pageSize"
        :total="paginationParams.total"
        :current-page="paginationParams.currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </hl-dialog>
  <digital-plan-dlg v-if="showPlanPreviewDlg" :title="previewPlanInfo.planName" :id="previewPlanInfo.id" @cancel="showPlanPreviewDlg = false;" />
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import { useAreaList, useCurrentArea } from '@/hooks';
import { GlobalAPI, tableDefaultProps } from '@/common';
import { DigitalPlanDlg, AreaCascader, AreaChangeEvent } from '@/components';
import { IpostAreaTreeAreaSpace } from '@/apis/modules/user-center/model';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { apiReservePlanManageObj } from '@/apis/modules/reserve-plan';
import { IpostPlanTypeSpace, IpostPlanLevelSpace, IpostFindReservePlanCatalogPageSpace } from '@/apis/modules/reserve-plan/model';

const props = defineProps({
  typeInfo: {
    type: String,
    default: '',
  }
});
const emit = defineEmits(['cancel', 'ok']);

const { areaCode } = useCurrentArea();

const planTypes = ref<IpostPlanTypeSpace.Data[]>([]);
const planLevels = ref<IpostPlanLevelSpace.Data[]>([]);
const form = reactive({
  areaCode: '',
  planLevel: '',
  planType: '',
  planName: '',
});

const tableData = ref<IpostFindReservePlanCatalogPageSpace.List[]>([]);
const cols = ref([
  { title: '序号', slotName: 'tableIndex', width: '4em' },
  { title: '预案名称', prop: 'planName', width: '18em', showTooltip: true, tooltipProps: { ...tableDefaultProps } },
  { title: '相关事故', prop: 'eventTypeCodeName', width: '18em', showTooltip: true, tooltipProps: { ...tableDefaultProps } },
  { title: '预案级别', prop: 'planLevelName' },
  { title: '预案类型', prop: 'planTypeName' },
  { title: '行政区划', prop: 'areaCodeName', width: 'calc(var(--xxs) * 26)' },
]);
const paginationParams = reactive({
  currentPage: 1,
  total: 0,
  pageSize: 8
});

const previewPlanInfo = ref({} as IpostFindReservePlanCatalogPageSpace.List);
const showPlanPreviewDlg = ref(false);

const resetForm = () => {
  form.areaCode = areaCode.value;
  form.planLevel = '';
  form.planType = '';
  form.planName = '';
  paginationParams.currentPage = 1;
  loadData();
};

const handleCurrentChange = (current: number) => {
  paginationParams.currentPage = current;
  loadData();
};

const previewDlg = (data: IpostFindReservePlanCatalogPageSpace.List, col: Record<string, any>) => {
  if (col.prop !== 'planName') return;
  previewPlanInfo.value = data;
  showPlanPreviewDlg.value = true;
};

const loadData = async() => {
  const params = {
    ...form,
    areaCode: !form.areaCode || form.areaCode === '-1' ? areaCode.value : form.areaCode,
    currentPage: paginationParams.currentPage,
    pageSize: paginationParams.pageSize,
  };
  const res = await apiReservePlanManageObj.postFindReservePlanCatalogPage(params);
  paginationParams.total = res.data.totalRow;
  tableData.value = res.data.list;
};

const onAreaCascaderChange = (data: AreaChangeEvent) => {
  const { id } = data;
  form.areaCode = id || '';
};

onMounted(async() => {
  form.planType = props.typeInfo;
  form.areaCode = areaCode.value;

  const res = await apiReservePlanManageObj.postPlanType();
  planTypes.value = res.data;

  const planLevelRusult = await apiReservePlanManageObj.postPlanLevel();
  planLevels.value = planLevelRusult.data;

  loadData();
});
</script>
<style lang="scss" scoped>
.plan-list-dlg {
  width: 100%;
  display: flex;
  flex-direction: column;
  .form-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: calc(var(--xxs) * 6);
    .plan-form-left {
      column-gap:var(--px20);
      :deep(.form-label) {
        margin-right: calc(var(--xxs) * 4);
      }
    }
  };
  .pagination {
    display: flex;
    justify-content: center;
    margin-top: calc(var(--xxs) * 6);
  }
}
.plan-name {
  cursor: pointer;
  color: #00DEFF;
  font-size: var(--font-lg);
  line-height: 1.375;
};
</style>
