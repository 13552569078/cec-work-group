<template>
  <hl-group full class="p-l-lg" dir="vertical">
    <!-- header -->
    <hl-group block>
      <hl-group class="m-r-xxl">
        <hl-group>
          <img v-if="weatherInfo.code" style="width: 120px; height: 120px" :src="getWeatherIcon(weatherInfo.code, weatherInfo.last_update)" />
        </hl-group>
        <hl-group dir="vertical" class="m-l-xl" align="items-around">
          <hl-group>
            <hl-group class="h1">{{ weatherInfo.temp }}℃</hl-group>
          </hl-group>
          <hl-group>
            <hl-group class="font-16">{{ weatherInfo.text }}</hl-group>
            <hl-group class="font-16 m-l-lg">{{ weatherInfo.wind_dir }}</hl-group>
            <hl-group class="font-16 m-l-lg">{{ weatherInfo.wind_class }}</hl-group>
          </hl-group>
        </hl-group>
      </hl-group>
      <hl-group dir="vertical" class="m-l-xxl m-r-xxl">
        <hl-group align="items-center">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">降水量</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.prec }}mm</hl-group>
        </hl-group>
        <hl-group class="m-t-md">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">相对湿度</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.rh }}%</hl-group>
        </hl-group>
        <hl-group class="m-t-md">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">气压</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.pressure }}hpa</hl-group>
        </hl-group>
        <hl-group class="m-t-md">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">云量</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.clouds }}%</hl-group>
        </hl-group>
      </hl-group>
      <hl-group dir="vertical" class="m-l-xxl">
        <hl-group align="items-center">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">能见度</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.vis }}m</hl-group>
        </hl-group>
        <hl-group class="m-t-md">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">体感温度</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.feels_like }}℃</hl-group>
        </hl-group>
        <hl-group class="m-t-md">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">露点温度</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.dew }}℃</hl-group>
        </hl-group>
        <hl-group class="m-t-md">
          <hl-group class="h3 text-left" style="width: calc(var(--xxl) * 3">紫外线指数</hl-group>
          <hl-group class="m-l-sm font-lg">{{ weatherInfo.uv }}</hl-group>
        </hl-group>
      </hl-group>
    </hl-group>
    <!-- tabs -->
    <hl-group class="m-b-lg m-t-lg" align="items-right" merge>
      <hl-button @click="handleTabClick(index)" v-for="(item, index) in tabsList" :key="index" :type="index === currentTabIndex ? 'primary' : null">{{ item.label }}</hl-button>
    </hl-group>
    <hl-group dir="vertical">
      <hl-row v-for="(item, index) in tableList" :key="index" class="border-top p-t-sm p-b-sm">
        <hl-col span="col" class="text-center"><img v-cloak style="width: 20px" :src="getTabaleIconSrc(item.imgIndex)" /></hl-col>
        <hl-col span="col" class="text-center">{{ item.label }}</hl-col>
        <hl-col span="col" class="text-center" v-for="(subItem, subIndex) in item.data" :key="subIndex">
          <img v-if="item.imgIndex == 1" style="width: 20px" :src="getWeatherIcon(subItem, sourceList[subIndex].data_time)" />
          <span v-else>{{ subItem }}</span>
        </hl-col>
      </hl-row>
    </hl-group>
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { IgetGetIntelligentWeatherSpace, IpostGetHourlyFcstsSpace } from '@/apis/modules/weather/model';
import { apiWeatherObj } from '@/apis/modules/weather';
import { dateFormat } from '@/common/utils';
import useIcon from '../hooks/use-icon';

interface TableItem {
  label: string;
  imgIndex: number;
  data?: string[];
  mapKey: keyof IpostGetHourlyFcstsSpace.Data;
  unit?: string;
}

interface WeatherData {
  weatherInfo: Partial<IgetGetIntelligentWeatherSpace.Data>;
  sourceList: IpostGetHourlyFcstsSpace.Data[];
  tableList: TableItem[];
}

const props = defineProps({
  long: {
    type: String
  },
  lat: {
    type: String
  }
});

watch(
  () => [props.long, props.lat],
  () => {
    getWeatherInfo();
    getHourWeatherList();
  }
);

const store = useStore();

const { getWeatherIcon, getTabaleIconSrc } = useIcon();

const tabsList = [{ label: '逐小时' }, { label: '逐3小时' }];
const currentTabIndex = ref(0);
const weatherData = reactive<WeatherData>({
  weatherInfo: {},
  // 接口返回的天气表格数据
  sourceList: [],
  // 处理后的表格数据
  tableList: []
});

const tableListTemp: TableItem[] = [
  {
    label: '时间',
    imgIndex: 0,
    mapKey: 'data_time'
  },
  {
    label: '天气',
    imgIndex: 1,
    mapKey: 'code'
  },
  {
    label: '气温',
    imgIndex: 2,
    mapKey: 'temp_fc',
    unit: '℃'
  },
  {
    label: '降水',
    imgIndex: 3,
    mapKey: 'prec',
    unit: 'mm'
  },
  {
    label: '风速',
    imgIndex: 4,
    mapKey: 'wind_speed',
    unit: 'm/s'
  },
  {
    label: '风向',
    imgIndex: 5,
    mapKey: 'wind_dir'
  },
  {
    label: '气压',
    imgIndex: 6,
    mapKey: 'pressure',
    unit: 'hPa'
  },
  {
    label: '湿度',
    imgIndex: 7,
    mapKey: 'rh',
    unit: '%'
  },
  {
    label: '云量',
    imgIndex: 8,
    mapKey: 'clouds',
    unit: '%'
  }
];

// 获取天气基本信息
const getWeatherInfo = async() => {
  /* const params = {
    lat: store.state.weatherStore.weatherLocation.y,
    lon: store.state.weatherStore.weatherLocation.x
  }; */
  const res = await apiWeatherObj.getGetIntelligentWeather(`${props.long},${props.lat}`);
  weatherData.weatherInfo = res.data;
  /* weatherData.weatherInfo = { text: '阴', code: '02', temp: '23.6', feels_like: '23', rh: '58', wind_class: '2级', wind_speed: '2.1', wind_dir: '东北风', wind_angle: '45', prec: '0.0', clouds: '99', vis: '26000', pressure: '951', dew: '14', uv: '3', snow: '', last_update: '2022-04-29 14:25' }; */
};
// 获取逐小时天气
const getHourWeatherList = (index = 0) => {
  const params = {
    hours: index ? 24 : 8,
    lonlat: `${props.long},${props.lat}`
  };
  // 逐3小时   逐小时postGetThHours
  const ajaxFn = index ? apiWeatherObj.postGetThHours(`${props.long},${props.lat}`, params.hours) : apiWeatherObj.postGetHourlyFcsts(`${props.long},${props.lat}`, params.hours);
  ajaxFn.then(res => {
    const { data } = res;
    weatherData.sourceList = [];
    weatherData.sourceList = data;
    weatherData.tableList = transformTableData(data);
  });
};
// 转换table数据
const transformTableData = (list: IpostGetHourlyFcstsSpace.Data[]) => {
  const tempList = JSON.parse(JSON.stringify(tableListTemp));
  tempList.forEach((item: TableItem) => {
    item.data = list.map(ele => {
      let result = '';
      const key = item.mapKey;
      if (key === 'data_time') {
        result = dateFormat(new Date(ele[key]), 'hh:mm');
      } else {
        result = ele[key] + (item.unit ? item.unit : '');
      }
      return result;
    });
  });
  return tempList;
};
const handleTabClick = (index: number) => {
  currentTabIndex.value = index;
  getHourWeatherList(index);
};

onMounted(() => {
  getWeatherInfo();
  getHourWeatherList();
});

// setup toRefs
const { weatherInfo, sourceList, tableList } = toRefs(weatherData);
</script>
