<template>
  <common-dialog title="摄像头视频" width="730px" @close="$emit('close')">
    <div class="video-widow" style="position: relative">
      <videoPlay v-if="showVideo" v-bind="options" @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeupdate"
    @canplay="onCanplay"/>
    </div>
  </common-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, reactive } from 'vue';
import 'vue3-video-play/dist/style.css';
import { videoPlay } from 'vue3-video-play';
import { apiEventAnalysisObj } from '@/apis/modules/event-analysis/index';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});

const showVideo = ref(false);
const options = reactive({
  width: '100%', // 播放器高度
  height: '400px', // 播放器高度
  color: '#409eff', // 主题色
  muted: false, // 静音
  webFullScreen: false,
  speedRate: ['0.75', '1.0', '1.25', '1.5', '2.0'], // 播放倍速
  autoPlay: true, // 自动播放
  loop: false, // 循环播放
  mirror: false, // 镜像画面
  ligthOff: false, // 关灯模式
  volume: 0.3, // 默认音量大小
  control: true, // 是否显示控制器
  title: '', // 视频名称
  // src: 'http://10.74.115.104:8052/cam/realmonitor/51068100301310000005?subtype=0&streamType=0&token=1687647811_ce88dde35bb1f6674509f925842d4cc9d8c3effb&mediatype=HLS.m3u8', // 视频源
  src: '', // 视频源
  poster: '', // 封面
  type: 'm3u8',
  controlBtns: [
    'audioTrack',
    // "quality",
    'speedRate',
    'volume',
    'setting',
    'pip',
    // "pageFullScreen",
    'fullScreen',
  ], // 显示所有按钮,
});
const onPlay = (ev: any) => {
  console.log('播放');
};
const onPause = (ev: any) => {
  console.log(ev, '暂停');
};

const onTimeupdate = (ev: any) => {
  console.log(ev, '时间更新');
};
const onCanplay = (ev: any) => {
  console.log(ev, '可以播放');
};

const emit = defineEmits(['close']);

watch(() => props.id, val => {
  if (val) {
    nextTick(() => {
      playerVideo(val);
    });
  }
}, {
  immediate: true
});

const playerVideo = (channelId: string) => {
  apiEventAnalysisObj.getVideoUrl(channelId).then(res => {
    options.src = res.data.url;
    showVideo.value = true;
  });
};

defineExpose({ playerVideo });
</script>

<style lang="scss" scoped>
:deep(.hl-dialog > .hl-panel .panel-body) {
  padding-bottom: 0 !important;
  padding-top: 10px !important;
  margin-bottom: 10px !important;
}

.video-widow {
  width: 700px;
  height: 400px;
}
</style>
