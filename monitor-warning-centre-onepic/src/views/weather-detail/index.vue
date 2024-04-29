<template>
  <hl-group block align="items-between items-center" class="border-bottom p-b-lg">
    <hl-group
      ><span class="font-lg font-bold">{{ DateUtils.formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss') }}</span></hl-group
    >
    <hl-group align="items-middle"
      >地址: {{ myAddress }}
      <hl-button type="primary" @click="locationDialogVisiable = true" class="m-l-md"
        >重新定位
        <template #icon>
          <hl-icon>
            <two-edit />
          </hl-icon>
        </template>
      </hl-button>
    </hl-group>
  </hl-group>
  <hl-row class="m-t-lg y-full" gap="var(--md)">
    <hl-col span="col-4" class="border-right">
      <!-- <hl-group dir="vertical" gap="var(--md)">
        <hl-button v-for="(item, index) in menuList" :key="index" @click="clickLeftMenu(index)" :type="index === menuActiveIndex ? 'primary' : null">{{ item }}</hl-button>
      </hl-group> -->
      <hl-list :hover="true">
        <hl-list-item v-for="(item, index) in menuList" :key="index" @click="clickLeftMenu(index)" :class="index === menuActiveIndex ? 'bg-hover' : null">
          {{ item }}
        </hl-list-item>
      </hl-list>
    </hl-col>
    <hl-col span="col-20">
      <hl-scrollbar style="height: calc(var(--xl) * 23">
        <smart-weather v-if="menuActiveIndex == 0 && longProps" :long="longProps" :lat="latProps" />
        <daily-weather v-if="menuActiveIndex == 1 && longProps" :long="longProps" :lat="latProps" />
        <weather-warning v-if="menuActiveIndex == 2 && longProps" :long="longProps" :lat="latProps" />
        <minute-rain v-if="menuActiveIndex == 3 && longProps" :long="longProps" :lat="latProps" />
      </hl-scrollbar>
    </hl-col>
  </hl-row>
  <location-map :visiable="locationDialogVisiable" @locationClose="locationClose" @locationSubmit="locationSubmit" :longitude="longProps" :latitude="latProps" />
</template>

<script lang="ts" setup>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { DateUtils } from 'fx-front-utils';
import type { IlocalInfo } from '@/types/local-info';
import LocationMap from '@/components/location-map.vue';
import SmartWeather from './components/smart-weather.vue';
import DailyWeather from './components/daily-weather.vue';
import WeatherWarning from './components/weather-warning.vue';
import MinuteRain from './components/minute-rain.vue';
import { GlobalAPI } from '@/common/global-api';
const { center, address } = JSON.parse(GlobalAPI.config.MAP_CONFIG_MONITOR_WARNING_ONEPIC);

const props = defineProps({
  long: {
    type: String
  },
  lat: {
    type: String
  },
  activeIndex: {
    type: Number,
    default: 0
  },
  address: {
    type: String
  }
});

const store = useStore();

const menuList = ['智能天气实况', '逐日天气', '天气预警', '分钟级降水预报'];
const menuActiveIndex = ref(0);
const myAddress = ref('');
const longProps = ref('');
const latProps = ref('');
const clickLeftMenu = (index: number) => {
  menuActiveIndex.value = index;
};

/* const address = computed(() => store.state.weatherStore.weatherLocation.formattedAddress); */

/* const initAdress = async() => {
  const { x, y } = store.state.weatherStore.weatherLocation;
  if (!address.value && x && y) {
    // 逆解析地址
    store.commit('weatherStore/setWeatherLocation', { formattedAddress: '北京市华熙live中心' });
  }
}; */

// 地图
const locationDialogVisiable = ref(false);
const locationClose = () => {
  locationDialogVisiable.value = false;
};
const locationSubmit = (info: IlocalInfo) => {
  locationDialogVisiable.value = false;
  myAddress.value = info?.address;
  longProps.value = info.lon;
  latProps.value = info.lat;
};

onMounted(() => {
  menuActiveIndex.value = props.activeIndex;
  myAddress.value = address || '盐城市盐都区';
  longProps.value = props.long || center[0];
  latProps.value = props.lat || center[1];
  /* if (!address.value) initAdress(); */
});
</script>
