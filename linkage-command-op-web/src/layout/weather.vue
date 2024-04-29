<template>
  <hl-group class="weather-info-wrap items-between items-middle flex-col" full gap-y="var(--xxs)">
    <hl-group class="left self-no-full items-middle w-full">
      <img
        v-if="latestWeather.icon && latestWeather.icon !== '999'"
        class="weather-icon"
        :src="`./images/weather/${latestWeather?.icon}.svg`"
        :onerror="(e) => e.target.src = defaultIconUrl" alt="">
      <img v-else class="weather-icon" :src="'./images/weather/default.svg'" alt="">
      <div class="m-l-lg">
        <hl-group gap-x="var(--md)" class="font-16">
          <span>{{ latestWeather.temp }}</span>
          <span>{{ latestWeather.weatherDesc }}</span>
          <span>{{ latestWeather.windDir}}</span>
          <span>{{ latestWeather.windScale}}</span>
        </hl-group>
      </div>
    </hl-group>
    <!-- <hl-group class="right self-no-full font-16" gap-x="var(--md)">
      <div><span class="text-secondary">相对温度&nbsp;&nbsp;</span><span>{{latestWeather.humidity || '--' }}</span></div>
      <div><span class="text-secondary">降水量&nbsp;&nbsp;</span><span>{{latestWeather.precip || '--' }}</span></div>
      <div><span>气压</span><span>{{latestWeather.pressure || '--' }}</span></div>
      <div><span>云量</span><span>{{latestWeather.cloud || '--' }}</span></div>
    </hl-group> -->
  </hl-group>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCurrentArea, useDataRefresher } from '@/hooks';
import { apiHefengWeatherObj } from '@/apis/modules/weather';
import { IgetLatestSpace } from '@/apis/modules/weather/model';
import { GlobalAPI } from '@/common';

const { areaCode } = useCurrentArea();
const latestWeather = ref<IgetLatestSpace.Data>({} as IgetLatestSpace.Data);

const defaultIconUrl = process.env.NODE_ENV === 'production' ? `${window.location.origin}/${GlobalAPI.config.PROD_PREFIX}/images/weather/default.svg` : '/images/weather/default.svg';

const getLatestWeather = async() => {
  // testCode 130427
  const res = await apiHefengWeatherObj.getLatest(areaCode.value);
  latestWeather.value = res?.data || {};
};

watch(areaCode, () => {
  getLatestWeather();
}, {
  immediate: true
});

useDataRefresher(getLatestWeather);
</script>
<style lang="scss" scoped>
.weather-info-wrap {
  margin-top:  calc(var(--xxs) * 3);
  margin-right: calc(var(--xxs) * 20);
  .left {
    display: flex;
    align-items: center;
    .weather-icon {
      width: calc(var(--xxs) * 5);
      height: calc(var(--xxs) * 5);
    }
  }
  .right {
    // color: #B5CEE3;
    div {
      display: flex;
      align-items: center;
    }
  }
}
</style>
