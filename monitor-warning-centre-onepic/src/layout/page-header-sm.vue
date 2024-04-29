<template show-source>
  <hl-group class="page-header left p-md p-l-lg p-r-lg" full>
    <hl-group class="header-left" align="items-middle" gap="var(--md)">
      <hl-group gap="var(--xxl)">
        <h1 class="p-l-xxl w-xxl">{{ systemName }}中心</h1>
        <hl-group align="items-right items-middle" gap="var(--lg)">
          <hl-button class="header-btn-a" @click="handleRoutePush('/center')">总览</hl-button>
          <hl-button class="header-btn-a" @click="handleRoutePush('/judgement-center')">研判中心</hl-button>
          <!-- <hl-button class="header-btn-a" @click="handleRoutePush('/judge')">研判</hl-button>
          <hl-button class="header-btn-a" @click="handleRoutePush('/monitor-region')">监测主体</hl-button>
          <hl-button class="header-btn-a" @click="openVideo">视频监控</hl-button>
          <hl-button class="header-btn-a" @click="showWeatherDetail = true">天气预报</hl-button> -->
        </hl-group>
      </hl-group>
    </hl-group>
    <hl-group class="header-right" align="items-right items-middle" gap="var(--xxl)">
      <hl-group gap="var(--sm)">
        <hl-button equal round @click="changeFullScreen">
          <template #icon>
            <hl-icon>
              <fill-maximize />
            </hl-icon>
          </template>
        </hl-button>
        <hl-button equal round>
          <template #icon>
            <hl-icon>
              <fill-user />
            </hl-icon>
          </template>
        </hl-button>
      </hl-group>
    </hl-group>
  </hl-group>
  <!-- 天气 -->
  <hl-dialog v-model="showWeatherDetail" width="calc(var(--xxl) * 30)">
    <weather-detail v-if="showWeatherDetail" :activeIndex="activeIndex" @on-close="handleCloseWeatherDetail" @weatherMapSelectShow="weatherMapSelectShow"> </weather-detail>
  </hl-dialog>
  <!-- 视频监控 -->
  <hl-dialog v-model="dialogVisible" title="视频监控列表" full-body width="calc(var(--xxl) * 32)" height="calc(var(--xxl) * 20)">
    <video-play v-if="dialogVisible"></video-play>
  </hl-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, inject, watch } from 'vue';
import { FillMaximize, FillUser } from '@hongluan-ui/icons';
import { useRouter } from 'vue-router';
import VideoPlay from '@/views/video-play/index.vue';
import WeatherDetail from '@/views/weather-detail/index.vue';

export default defineComponent({
  name: 'PageHeader',
  components: {
    FillMaximize,
    FillUser,
    VideoPlay,
    WeatherDetail
  },
  inject: ['reload'],
  setup() {
    const router = useRouter();
    const dates = ref('');
    const day = ref('');
    const times = ref('00:00:00');
    const dialogVisible = ref(false);
    let setTimes = 0;

    const isMaxScreen = ref(true);
    const getDay = (num: number) => {
      const week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      return week[num];
    };

    const systemName = ref(inject('systemName'));

    const changeFullScreen = () => {
      isMaxScreen.value = !isMaxScreen.value;
      if (isMaxScreen.value) {
        const doc: any = document;
        if (doc.exitFullscreen) {
          doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
      } else {
        const element: any = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
    };
    const refreshTime = () => {
      const date = new Date();
      day.value = getDay(date.getDay());
      dates.value = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
      setTimes = window.setInterval(() => {
        const curDate = new Date();
        let h: number | string = curDate.getHours();
        let m: number | string = curDate.getMinutes();
        let s: number | string = curDate.getSeconds();
        if (h >= 0 && h < 10) {
          h = '0' + h;
        }
        if (m >= 0 && m < 10) {
          m = '0' + m;
        }
        if (s >= 0 && s < 10) {
          s = '0' + s;
        }
        times.value = h + ':' + m + ':' + s;
      }, 1000);
    };
    const handleRoutePush = (path: string) => {
      const prefix = document.location.href.includes('/monitor/') ? '/monitor' : '/warning';
      router.push(prefix + path);
    };
    onMounted(() => {
      refreshTime();
    });
    onBeforeUnmount(() => {
      if (setTimes) {
        window.clearInterval(Number(setTimes));
      }
    });

    const openVideo = () => {
      dialogVisible.value = true;
    };

    // 天气
    const activeIndex = ref(0);
    const showWeatherDetail = ref(false);
    // 天气详情弹窗
    const handleCloseWeatherDetail = () => {
      showWeatherDetail.value = !showWeatherDetail.value;
    };
    // 天气弹窗右上角地址选择事件
    const weatherMapSelectShow = (index: number) => {
      activeIndex.value = index;
      showWeatherDetail.value = false;
      // showPlaceDialog.value = true;
    };

    return {
      changeFullScreen,
      handleRoutePush,
      isMaxScreen,
      dates,
      day,
      times,
      dialogVisible,
      openVideo,
      activeIndex,
      showWeatherDetail,
      handleCloseWeatherDetail,
      weatherMapSelectShow,
      systemName
    };
  },
  data() {
    return {
      topMenuShow: true
    };
  }
});
</script>
