<template>
  <hl-group full class="p-l-lg" dir="vertical">
    <!--  -->
    <hl-group block align="items-center items-between" class="static">
      <hl-group dir="vertical">
        <hl-group>
          <h2>预警信息</h2>
        </hl-group>
        <hl-group class="m-t-sm">
          截止{{ DateUtils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') }}，当前生效预警 <span class="text-warning font-lg m-l-xxs m-r-xxs">{{ tableData.length }}</span
          >条
        </hl-group>
      </hl-group>
      <hl-group align="items-right items-bottom">
         <!-- @click="isMap = !isMap" -->
        <!-- <hl-button type="primary" v-if="isMap">预警列表</hl-button>
        <hl-button type="primary" v-else @click="isMap = !isMap">预警地图</hl-button> -->
        <hl-button type="primary">预警列表</hl-button>
      </hl-group>
    </hl-group>
    <!-- map -->
    <hl-group full class="border m-t-lg" v-if="isMap" style="height: calc(var(--xl) * 20">
      <x-map :zoom="10" :center="centers">
        <x-tianditu-layer />
        <x-map-marker :coordinates="mapWarning" :draggable="true" color="red"  v-if="tableData.length" />
      </x-map>
    </hl-group>
    <!-- table -->
    <hl-group full class="m-t-lg table-content" v-else>
      <hl-simple-table v-if="tableData.length" :data="tableData" :cols="cols" stripe>
        <template #tableIndex="{ rowIndex }">
          <span>{{ rowIndex + 1 }}</span>
        </template>
        <template #effective="{ row }">
          <span>{{ DateUtils.formatDate(new Date(row.effective), 'yyyy-MM-dd HH:mm:ss') }}</span>
        </template>
      </hl-simple-table>
      <hb-empty description="暂无天气预警" v-else/>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { DateUtils } from 'fx-front-utils';
import { IgetGetAlertsWeatherSpace } from '@/apis/modules/weather/model';
import { apiWeatherObj } from '@/apis/modules/weather';

const props = defineProps({
  long: {
    type: String
  },
  lat: {
    type: String
  }
});

const isMap = ref(false);
const mapWarning = ref([]);
const centers = ref<string[]>([]);
const tableData = ref<IgetGetAlertsWeatherSpace.Data[]>([]);

watch(
  () => [props.long, props.lat],
  () => {
    getWarningList();
  }
);

// 表格相关
const cols = [
  {
    title: '序号',
    prop: '',
    slotName: 'tableIndex',
    width: '30px',
    align: 'left'
  },
  {
    title: '预警标题',
    prop: 'title',
    width: '100px',
    align: 'left',
    showTooltip: true
  },
  {
    title: '预警时间',
    width: '120px',
    slotName: 'effective',
    showTooltip: true
  },
  {
    title: '预警详情',
    prop: 'desc',
    width: '120px',
    showTooltip: true
  }
];

const getWarningList = async() => {
  centers.value = [props.long || '116.37304', props.lat || '39.92594'];
  mapWarning.value = [props.long || '116.37304', props.lat || '39.92594'];
  const { data } = await apiWeatherObj.getGetAlertsWeather(`${props.long},${props.lat}`);
  tableData.value = data;
};

getWarningList();
/* const tableData = ref([{ geocode: '510600', title: '四川省德阳市发布大风黄色预警', desc: '德阳市气象台2022年04月29日16时50分发布大风黄色预警：预计4月29日20时到30日20时，受地面冷空气影响，我市中江有一次大风天气过程，主要影响时段为今天夜间，中江县平均风力可达5到7级，局部地方风力可达8级及以上，请注意防范大风、局地强对流等天气带来的危害。（预警信息来源：国家预警信息发布中心）', type: '大风', level: '黄色预警', public_time: '2022-04-29T08:50:00.000+00:00', effective: '2022-04-29T08:50:00.000+00:00', expires: '2022-04-30T12:00:00.000+00:00', lat: '31.130428', lon: '104.389648' }]); */
</script>
