<template>
  <common-dialog title="摄像头视频" width="730px" @close="$emit('close')">
    <div style="height: 100%; width: 100%; position: relative">
      <hl-row class="video-widow">
        <hl-col v-for="(v, index) in channelList" :key="v.channelId" span="col-24">
          <div :id="`dahua-video-${index}`"></div>
        </hl-col>
      </hl-row>
    </div>
  </common-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { GlobalAPI } from '@/common/global-api';

const props = defineProps({
  id: {
    type: String,
    default: ''
  }
});
// eslint-disable-next-line camelcase
const videoConfig = JSON.parse(GlobalAPI.config.DAHUA_VIDEO_CONFIG);

const emit = defineEmits(['close']);

const showVideo = ref(false);

// 视频联接配置
const config = videoConfig;
// 控件配置
const controlConfig = ref([
  {
    ctrlType: 'playerWin',
    ctrl: 'ctrl1',
    displayMode: 1,
    splitNum: 1,
    cutPosX: 10,
    cutPosY: 10,
    crtPosX: 0,
    crtPosY: 10,
    crtWidth: 700,
    crtHeight: 400,
    domId: 'dahua-video-0',
  },
]);

const channelId = ref('51068100301310000002');

let isLogin = false;

// eslint-disable-next-line no-undef
const ws = DHWs.getInstance();
ws.addEventListener('connectStateChange', (data: any) => {
  if (data) {
    console.log('连接成功');
  } else {
    console.log('连接失败，下载客户端');
  }
});

onMounted(() => {
  window.addEventListener('onunload', () => {
    ws.logout({
      loginIp: config.loginIp,
    });
  });
});
onUnmounted(() => {
  destroy();
});

// 调用登录接口
const login = async () => {
  const res = await ws.detectConnectQt();
  if (res) {
    // 连接客户端成功
    await ws.login(config);
    await ws.on('loginState', (res2: boolean) => {
      isLogin = res2;
      if (res2) {
        console.log('登录成功');
        createPosition();
      } else {
        console.info('登录失败');
      }
    });
  } else {
    // 连接客户端失败
    console.info('请重新安装客户端');
  }
};

// 退出
const logout = () => {
  ws.logout({
    loginIp: config.loginIp,
  });
  isLogin = false;
};

// 销毁实例
const destroy = () => {
  if (!isLogin) {
    return false;
  }
  // eslint-disable-next-line array-callback-return
  if (channelList.value.length === 1) {
    // eslint-disable-next-line array-callback-return
    const ctrls = ws.ctrls.map((i: { ctrlCode: string }) => {
      if (i.ctrlCode === controlConfig.value[0].ctrl[0]) {
        return i.ctrlCode;
      }
    });
    ws.destroyCtrl(ctrls);
  }
  logout();
};

// 创建控件
const createPosition = () => {
  if (channelList.value.length === 1) {
    const params = [
      {
        ctrlType: controlConfig.value[0].ctrlType,
        ctrlCode: controlConfig.value[0].ctrl,
        ctrlProperty: {
          displayMode: controlConfig.value[0].displayMode,
          splitNum: controlConfig.value[0].splitNum,
          channelList: [{ channelId: channelId.value }],
        },
        visible: true,
        domId: controlConfig.value[0].domId,
      },
    ];
    setPos();
    ws.createCtrl(params)
      .then((res: any) => {
        console.log(res);
      })
      .catch((e: any) => {
        console.log(e);
      });
    ws.on('createCtrlResult', (res: any) => {
      console.warn(res);
    });
  } else {
    ws.openVideo(
      channelList.value.map((item: { channelId: string; channelName: string }) => {
        return item.channelId;
      })
    );
  }
};

const setPos = () => {
  const target = document.getElementById(controlConfig.value[0].domId)!;
  console.log(target, 'target');
  // target.style.right = `${controlConfig.crtPosX}px`;
  // target.style.top = `${controlConfig.value[0].crtPosY}px`;
  target.style.width = `${controlConfig.value[0].crtWidth}px`;
  target.style.height = `${controlConfig.value[0].crtHeight}px`;
  if (document.createEvent) {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, true);
    window.dispatchEvent(event);
  } else if ((document as any).createEventObject) {
    (window as any).fireEvent('onresize');
  }
};

const channelList = ref<{ channelId: string; channelName: string }[]>([]);
const title = ref('视频播放');
// 播放视频
const playerVideo = async (channels: { channelId: string; channelName: string }[]) => {
  channelList.value = channels;
  if (channels && channels.length) {
    if (channels.length === 1) {
      channelId.value = channels[0].channelId;
      title.value = channels[0].channelName;
      showVideo.value = true;
    }
  }
  // 处理配置
  if (isLogin) {
    createPosition();
  } else {
    await login();
  }
};

// todo 这里是demo, 回头业务回调赋值
// playerVideo([{ channelId: '51068100301310000002', channelName: 'demo' }]);

watch(() => props.id, val => {
  if (val) {
    nextTick(() => {
      playerVideo([{ channelId: val, channelName: 'demo' }]);
    });
  }
}, {
  immediate: true
});

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
