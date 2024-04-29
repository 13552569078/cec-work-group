<template>
  <hl-group v-if="eventMonitorPointData" gap="var(--lg)" full class="h-full p-lg" dir="vertical">
    <hl-group dir="vertical" full class="static" gap="var(--md)">
      <hl-group gap="var(--md)" dir="vertical">
          <h2>{{ eventMonitorPointData.eventTypeName }}</h2>
          <hl-group>
            <hl-group gap="var(--lg)">
              <hl-group gap="var(--sm)" align="items-center items-middle">
                <hl-icon><fill-map /></hl-icon>
                <span>监测指标：{{ eventMonitorPointData.targetName }}</span>
              </hl-group>
              <hl-group gap="var(--sm)" align="items-center items-middle">
                <hl-icon><fill-map /></hl-icon>
                <span>监测点：{{ eventMonitorPointData.monitorPointName}}</span>
              </hl-group>
            </hl-group>
          </hl-group>
          <hr style="margin: 0;" />
          <hl-group gap="var(--sm)" align="items-middle">
            <span>设备：</span>
            <hl-tag v-for="(equit, index) in eventMonitorPointData.monitorEquipNameList" :key="`equip-${index}`">{{ equit }}</hl-tag>
          </hl-group>
      </hl-group>
      <hl-group gap="var(--lg)" full class="" style="height: calc(var(--xs) * 90)">
        <hl-group dir="vertical" align="items-between" style="width: calc(var(--xxs) * 100)">
          <hl-scrollbar>
            <hl-group dir="vertical" full gap="var(--md)">
              <hl-group v-for="factor in eventMonitorPointData.monitorFactorVOList"
                        :key="factor.factorId"
                        dir="vertical"
                        full>
                <hl-group full class="m-b-md">
                  <h5 class="p-l-md">{{factor.ruleName}}</h5>
                  <hl-group style="float: right" class="items-right m-r-sm m-t-xxs cursor-pointer">
                    <hl-icon @click="factor.show=false" v-if="factor.show"><TwoChevronBottom /></hl-icon>
                    <hl-icon @click="factor.show=true" v-else><TwoChevronRight /></hl-icon>
                  </hl-group>
                </hl-group>
                <template v-if="factor.show">
                  <hl-group dir="vertical" class="bg-light m-b-md p-md" v-for="(item, index) in factor.strategyRuleFactorVOS" :key="item.factorId">
                    <hl-group full align="items-top">
                      <hl-group dir="vertical" gap="var(--xxs)">
                        <h5>因子{{index + 1}}：{{ item.factorName }}</h5>
                        <span class="text-secondary">计量单位：{{item.measureUnitName}}</span>
                      </hl-group>
                      <hl-tag size="sm" class="rule-tag static" type="level4">{{ item.factorDataTypeName }}</hl-tag>
                    </hl-group>
                    <!-- 这里有三种类型数据 -->
                    <hl-group dir="vertical" full class="m-t-md border-top p-t-md">
                      <hl-row gap="var(--md)">
                        <template v-if="item.factorDataTypeCode==='interzone'">
                          <hl-col :span="12">
                            <span class="text-secondary"> {{item.factorValue[0].lowKey}}：</span>
                            <span class="content">{{getSymbol(item.factorValue[0].lowExpression)}}{{item.factorValue[0].lowValue}}</span>
                          </hl-col>
                          <hl-col :span="12">
                            <span class="text-secondary">{{item.factorValue[0].upKey}}：</span>
                            <span class="content">{{getSymbol(item.factorValue[0].upExpression)}}{{item.factorValue[0].upValue}}</span>
                          </hl-col>
                        </template>
                        <template v-if="['contain','in'].includes(item.factorDataTypeCode)">
                          <hl-col :span="24">
                            <span class="content">{{item.factorValue[0].value}}</span>
                          </hl-col>
                        </template>
                        <template v-if="['switch'].includes(item.factorDataTypeCode)">
                          <hl-col :span="24">
                            <span class="content">{{Number(item.factorValue)===0?'否':'是'}}</span>
                          </hl-col>
                        </template>
                      </hl-row>
                    </hl-group>
                  </hl-group>
                  <hl-group dir="vertical" class="bg-light m-b-md p-md" v-if="factor.strategyRuleFactorVOS&&factor.strategyRuleFactorVOS.length>1">
                    <hl-group full align="items-top">
                      <hl-group dir="vertical" gap="var(--xxs)">
                        <h5>因子逻辑关系</h5>
                      </hl-group>
                    </hl-group>
                    <hl-group dir="vertical" full class="m-t-md border-top p-t-md">
                      <hl-row gap="var(--md)">
                        <hl-col :span="24">
                          <hl-group class="m-r-xl" :class="factor.ruleLogicRelationship==1?'text-primary':'text-secondary'">
                            <hl-icon size="md" class="m-r-xs" v-if="factor.ruleLogicRelationship==1"><TwoChecked /></hl-icon><hl-icon v-else size="md" class="m-r-xs"><TwoRemove /></hl-icon>与
                          </hl-group>
                          <hl-group :class="factor.ruleLogicRelationship==2?'text-primary':'text-secondary'">
                            <hl-icon size="md" class="m-r-xs"  v-if="factor.ruleLogicRelationship==2"><TwoChecked /></hl-icon><hl-icon v-else size="md" class="m-r-xs"><TwoRemove /></hl-icon>或
                          </hl-group>
                        </hl-col>
                      </hl-row>
                    </hl-group>
                  </hl-group>
                </template>
              </hl-group>
            </hl-group>
          </hl-scrollbar>
        </hl-group>
        <hl-group full dir="vertical" class="h-full">
          <hb-table-searchbar
            class="static p-b-lg border-bottom no-more-button"
            @change="searchChanged"
            :selector="selector"
            :searcher="searcher"
            padding="0"
            gap="var(--md)">
          <template #suffix>
            <hl-group merge indent class="static">
              <hl-radio-group v-model="tableCharts" custom merge indent @change="changeTableChart">
              <hl-radio :label="1">
                <hl-button size="md">
                  <template #icon>
                    <hl-icon>
                      <TwoAlignJustify />
                    </hl-icon>
                  </template>
                </hl-button>
              </hl-radio>
              <hl-radio :label="2">
                <hl-button size="md">
                  <template #icon>
                    <hl-icon>
                      <TwoChartLine />
                    </hl-icon>
                  </template>
                </hl-button>
              </hl-radio>
            </hl-radio-group>
            </hl-group>
          </template>
            <template #time>
              <hl-date-picker
                v-model="time"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                block
              />
            </template>
          </hb-table-searchbar>

          <hl-scrollbar  style="height: calc(var(--xxl) * 10);width: 100%">
            <hl-simple-table
              fixed-header
              v-if="tableCharts === 1"
              class="borderless-last"
              border="border-x"
              padding="var(--xl)"
              hover
              stripe
              :cols="cols"
              :data="tableData">
              <template #tableIndex="{ rowIndex }">
                <span>{{ rowIndex + 1 }}</span>
              </template>
              <template v-for="item in cols?(cols[2].children||[cols[2]]):[]" #[item.slotName]="{ row }" :key="item.slotName">
                <span v-if="row[item.slotName]==='--'">--</span>
                <span v-else class="text-primary">{{row[item.slotName]}}</span>
              </template>
            </hl-simple-table>
            <markline-chart
              :style="pointIdData!==''?{'max-width': 'calc(var(--lg) * 48.5)'}:{}"
              v-if="tableCharts===2&&lineChartData.length>0"
              :lineChartData="lineChartData"/>
            <hb-empty
              v-if="tableCharts===2&&lineChartData.length===0"
              image-size="20vh"
              :image="require('@/assets/images/no-data.svg')"/>
          </hl-scrollbar>
          <hl-group class="static p-y-lg  border-top" v-if="tableCharts === 1">
            <hl-pagination
              full
              align="items-right"
              layout="prev, pager, next, jumper, sizes"
              :total="tableParams.total"
              :page-size="tableParams.pageSize"
              :current-page="tableParams.currentPage"
              :page-sizes="[10, 20, 30, 50]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              block
              class="w-full">
            </hl-pagination>
          </hl-group>
        </hl-group>
      </hl-group>
    </hl-group>
  </hl-group>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useMonitorCenter } from '@/hooks';
import { Indexable } from 'fx-front-utils';
import { apiMonitorCenterObj } from '@/apis/modules/monitorCenter';
import { IgetListMonitorFactorDataListSpace } from '@/apis/modules/monitorCenter/model';
import MarklineChart from '@/components/charts/markline-chart.vue';

interface COLS {
  title: string,
  prop?: string,
  width?: string|number
  slotName?: string;
  fixed?: string;
}

const props = defineProps({
  eventId: {
    type: String,
    default: ''
  },
  startTime: String,
  pointIdData: {
    type: String,
    default: ''
  }
});

const { eventMonitorPointData, getEventPointData } = useMonitorCenter();

const tableData = ref<any[]>([

]);
const cols = ref();
const time = ref([]);
const tableParams = reactive({
  'currentPage': 1,
  'pageSize': 10,
  'useFor': 1,
  'eventId': props.eventId,
  'pointId': props.pointIdData,
  'monitorPointId': props.pointIdData,
  'startTime': '',
  'endTime': '',
  total: 0 });
const getListMonitorDataList = async() => {
  const { data } = await apiMonitorCenterObj.getFindMonitorDataPage(tableParams);
  // 处理表头和数据
  const col = [
    {
      title: '序号',
      width: '66px',
      align: 'center',
      slotName: 'tableIndex',
    },
    { title: '监测时间', prop: 'monitorTime', width: '120' },

    // TODO 动态多级表头
    {
      title: '监测因子值',
      prop: 'factor',
      align: 'center',
      children: [],
    },
  ];
  if (data.list.length > 0) {
    data.list.forEach(item => {
      item.monitorDataList.forEach(item2 => {
        item[item2.code] = item2.value === '' ? '--' : item2.value;
      });
    });
    tableData.value = data.list;
    col[2].children = [];
    data.list[0].columnHeaderList.forEach(item2 => {
      col[2].children?.push({
        title: item2.codeName, prop: item2.code, align: 'center', slotName: item2.code
      });
    });

    // 判断是否就一个子节点
    if (col[2].children.length === 1) {
      col[2] = col[2].children[0];
    }
    cols.value = col;
    tableParams.total = data.totalRow;
  } else {
    // col[2].children = [];
    cols.value = [];
    tableData.value = [];
    tableParams.total = 0;
  }
  /* tableParams.total = result.data.totalRow;
  // 处理表格数据
  const table:any[] = [];
  result.data.list.forEach(item => {
    const col:COLS[] = [
      { title: '#', slotName: 'tableIndex' },
      { title: '监测时间', prop: 'monitorTime', width: '120', fixed: 'left' }
    ];
    const tableItem = {
      monitorTime: item.monitorTime,
    };
    item.factorValueList.forEach(item2 => {
      col.push(
        { title: '监测因子·' + item2.name, prop: item2.name }
      );
      tableItem[item2.name] = item2.value;
    });
    table.push(tableItem);
    cols.value = col;
  });
  tableData.value = table; */
};
const lineChartData = ref<IgetListMonitorFactorDataListSpace.Data[]>([]);
const getListMonitorFactorDataList = async() => {
  const result = await apiMonitorCenterObj.getListMonitorFactorDataList(tableParams);
  lineChartData.value = result.data;
};
const tableCharts = ref(1);
const changeTableChart = (type:number) => {
  if (type === 1) {
    getListMonitorDataList();
  } else {
    getListMonitorFactorDataList();
  }
};

const init = () => {
  getEventPointData(props.eventId as string, props.pointIdData);
  tableParams.startTime = props.startTime as string;
  tableParams.endTime = props.startTime as string;
  getListMonitorDataList();
};

init();

const handleSizeChange = (val:number) => {
  console.log(`每页 ${val} 条`);
  tableParams.pageSize = val;
  getListMonitorDataList();
};
const handleCurrentChange = (val: number) => {
  console.log(`当前页: ${val}`);
  tableParams.currentPage = val;
  getListMonitorDataList();
};

const getSymbol = (expression: string) => {
  const mapper:Indexable<string> = {
    lt: '<',
    gt: '>',
    eq: '=',
    ge: '≥',
    le: '≤'
  };
  return mapper[expression];
};

const pagination = reactive({
  pageSize: 100,
  total: 400,
  currentPage: 1,
  show: false,
});

const originItems = [
  {
    span: 'xl:col-span-2',
    type: 'datetimerange',
    name: 'time',
    value: [props.startTime, props.startTime],
    'is-range': true,
    'range-separator': '至',
    'start-placeholder': '开始时间',
    'end-placeholder': '结束时间',
    'placeholder': '选择时间范围',
    format: 'YYYY-MM-DD HH:mm:ss',
    'value-format': 'YYYY-MM-DD HH:mm:ss'
  },
];
const searchChanged = (urlParams: any, mapParams: any, originalParams: any) => {
  console.log(urlParams, mapParams, originalParams);
  tableParams.startTime = mapParams.timeStart ? mapParams.timeStart : '';
  tableParams.endTime = mapParams.timeEnd ? mapParams.timeEnd : '';
  changeTableChart(tableCharts.value);
};
const searcher = reactive({
  show: false,
});
const selector = reactive({
  colCount: 'md:count-3 sm:count-2',
  items: originItems,
});
</script>
<style lang="scss">
.rule-tag {
  background: rgba(113, 248,252,0.24) !important;
  color: rgba(113, 248,252,1) !important;
}
</style>
