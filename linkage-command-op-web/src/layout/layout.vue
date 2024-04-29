<template>
  <div class="whole-layout">
    <div class="header-info">
      <div class="time font-xxl">{{ currentTime }}</div>
      <div class="right-info display-flex items-middle">
        <weather class="weather-section" />
        <div class="operate display-flex items-middle">
          <span class="icon-box" @click="showWarning = !showWarning">
            <img class="operate-icon" :src="operate0Src">
          </span>
          <span class="icon-box" @click="changeFullScreen">
            <img class="operate-icon" :src="operate1Src">
          </span>
          <span>
            <hl-dropdown popper-class="user-info-popper">
              <img class="operate-icon" :src="operate2Src">
              <template #dropdown>
                <div class="user-info-dropdown">
                  <hl-thumb round type="primary" size="sm" light class="face-big" :src="userHead">
                    <span>{{ userInfo?.empname.substring(0, 1) }}</span>
                  </hl-thumb>
                  <div class="username">{{ userInfo?.empname }}</div>
                  <div class="orgname">{{ userInfo?.shortName }}</div>
                  <div class="menu-list">
                    <div class="menu-item" @click="toMessageCenter">
                      <hl-icon size="md" class="m-r-sm" color="#47EAFD"><FillAlert /></hl-icon>
                      <span class="txt">我的消息</span>
                    </div>
                    <div class="menu-item" @click="userLogout">
                      <hl-icon size="md" class="m-r-sm" color="#47EAFD"><FillSignout /></hl-icon>
                      <span class="txt">退出</span>
                    </div>
                  </div>
                </div>
              </template>
            </hl-dropdown>
          </span>
        </div>
      </div>
    </div>
    <div class="mask-header"></div>
    <div class="header-contener">
      <div class="header-left">
        <img :src="imgHeaderLeftSrc" />
      </div>
      <div class="header-middle">
        <!-- <img :src="imgSrc" /> -->
        <span class="header-text">{{ globalTitle }}</span>
      </div>
      <div class="header-right">
        <img :src="imgHeaderRightSrc" />
      </div>
    </div>
  </div>
  <div class="mask-left-sider"></div>
  <div :class="['mask-left', showMask ? 'mask-show' : 'mask-left-hidden']">
    <div class="bar-left"></div>
    <div class="bar-right" @click="togglePanels">
      <img src="@/assets/images/layout/l-siderbar-right-open.png" alt="" v-if="!showMask">
      <img :src="imglbarSrc" v-else>
    </div>
  </div>
  <div class="mask-right-sider"></div>
  <div :class="['mask-right', showMask ? 'mask-show' : 'mask-right-hidden']">
    <div class="bar-left" @click="togglePanels">
      <img src="@/assets/images/layout/r-siderbar-left-open.png" alt="" v-if="!showMask">
      <img :src="imgrbarSrc" v-else>
    </div>
  </div>
  <div class="mask-footer">
    <img :src="imgfooterSrc" />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useMaxScreen } from 'fx-front-framework';
import dayjs from 'dayjs';
import { HlMessageBox } from 'hongluan-ui';
import { User, useUser } from 'fx-front-ucenter';
import { useLayout, useMapPlotting, useWarning } from '@/hooks';
import { GlobalAPI } from '@/common';
import imgSrc from '@/assets/images/layout/header-middle.png';
import imglbarSrc from '@/assets/images/layout/l-siderbar-right.png';
import imgrbarSrc from '@/assets/images/layout/r-siderbar-left.png';
import imgfooterSrc from '@/assets/images/layout/footer.png';
import imgHeaderLeftSrc from '@/assets/images/layout/header-left.png';
import imgHeaderRightSrc from '@/assets/images/layout/header-right.png';
import operate0Src from '@/assets/images/layout/operate0.png';
import operate1Src from '@/assets/images/layout/operate1.png';
import operate2Src from '@/assets/images/layout/operate2.png';
import meetingSrc from '@/assets/images/layout/meeting.png';
import headerMask from '@/assets/images/layout/rectangle-header.png';
import userHead from '@/assets/images/layout/user-head.png';
import Weather from './weather.vue';

const { globalTitle, showMask, toggleMask } = useLayout();
const { isMaxScreen, changeFullScreen } = useMaxScreen();
const { showWarning } = useWarning();
const { isPlotting, stopPlotting } = useMapPlotting();
const { logout, getUserInfo, getToken } = useUser();

const userInfo = ref<User>();
const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'));
let timer: any = '';

const userLogout = () => {
  const loginUrl = encodeURIComponent(`${window.location.origin}/${GlobalAPI.config.PROD_PREFIX}`);
  logout(loginUrl);
};
const toMessageCenter = () => {
  const url = GlobalAPI?.config?.MESSAGE_CENTER_URL;
  if (url) {
    window.open(`${url}?token=${getToken()}`);
  }
};
const togglePanels = async() => {
  if (isPlotting.value) {
    await HlMessageBox.confirm('当前正在协同标绘，是否保存标绘后打开面板？', '提示');
    stopPlotting();
  } else {
    toggleMask();
  }
};

onMounted(async() => {
  userInfo.value = await getUserInfo();
  timer = setInterval(() => {
    currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
  }, 1000);
});
onBeforeUnmount(() => {
  clearTimeout(timer);
});
</script>
<style lang="scss" scoped>
.header-info {
  width: 100vw;
  position: absolute;
  z-index: 1000;
  display: flex;
  padding-right: calc(var(--xxs) * 6);
  padding-left: calc(var(--xxs) * 6);
  height: calc(var(--xxs) * 10);
  justify-content: space-between;
  align-items: center;
  margin-top: calc(var(--xxs) * 5.25);
  .time{
    line-height: 1.2;
    font-family: Impact;
    color: #FFFFFF;
    letter-spacing: 1px;
    background: linear-gradient(180deg, #FFFFFF 0%, #A2E2FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding-top: calc(var(--xxs) * 2.5);
  }

  .operate > span {
    display: inline-block;
    width: calc(var(--xxs) * 10);
    height: calc(var(--xxs) * 10);
    cursor: pointer;
  }

  .icon-box {
    margin-right: calc(var(--xxs) * 5);
  }

  .operate-icon {
    width: 100%;
  }
}

.header-contener {
  display: flex;
  justify-content: center;
  height: 8.055555vh;

  .header-left {
    flex-grow: 1;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      margin-top: var(--xxs);
    }
  }

  .header-right {
    flex-grow: 1;
    z-index: 2;

    img {
      display: block;
      width: 100%;
      margin-top: var(--xxs);
    }
  }

  .header-middle {
    flex: none;
    width: calc(var(--xxs) * 240.75);
    height: calc(var(--xxs) * 21.75);
    position: relative;
    text-align: center;
    background: url("@/assets/images/layout/header-middle.png") no-repeat;
    background-size: calc(var(--xxs) * 331.25) 100%;
    background-position: center top;
    .img {
      width: 100%;
    }

    .header-text {
      position: absolute;
      font-size: calc(var(--font-lg) * 2.75);
      font-family: YouSheBiaoTiHei;
      line-height: calc(var(--font-md) * 5);
      letter-spacing: calc(var(--font-lg) / 2);
      left: 50%;
      transform: translateX(-50%);
      top: 0;
      color: #fff;
      // text-shadow: 0px 3px 15px rgba(0,0,0,0.5), 0px 0px 3px #FFFFFF;
      background: linear-gradient(180deg, #DAF0FF 0%, #B4E0FD 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}

.mask-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 14.074074074074075vh;
  background: url("@/assets/images/layout/rectangle-header.png") no-repeat;
  background-size: 100% 100%;
  z-index: 0;
}

.mask-left-sider {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: calc(var(--xxs) * 6.75); //27px
  z-index: 4;
  background: url("@/assets/images/layout/l-siderbar-left.png") 100% no-repeat;
  height: 100vh;
}

.mask-right-sider {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: calc(var(--xxs) * 6.75);
  z-index: 4;
  background: url("@/assets/images/layout/r-siderbar-right.png") 100% no-repeat;
  height: 100vh;
}

.mask-left {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: calc(var(--xxs) * 125);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url("@/assets/images/layout/rectangle-left.png") no-repeat;
  background-size: 100% 100%;

  .bar-left {
    width: calc(var(--xxs) * 6.75);
    display: inline-block;
    height: 100vh;
  }

  .bar-right {
    width: calc(var(--xxs) * 12.5);
    height: calc(var(--xxs) * 36.25);
    display: inline-block;
    position: relative;
    right: calc(var(--xxs) * 6.25 * -1);
    pointer-events: auto !important;
    cursor: pointer;
    img {
      height: calc(var(--xxs) * 40);
    }
  }
}

.mask-right {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: calc(var(--xxs) * 125);
  background: url("@/assets/images/layout/rectangle-right.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .bar-left {
    width: calc(var(--xxs) * 12.5);
    height: calc(var(--xxs) * 36.25);
    display: inline-block;
    position: relative;
    left: calc(var(--xxs) * 6.25 * -1);
    pointer-events: auto !important;
    cursor: pointer;
    img {
      height: calc(var(--xxs) * 40);
    }
  }

  .bar-right {
    width: calc(var(--xxs) * 6.75);
    // display: inline-block;
    height: 100vh;
    // background-image: url('@/assets/images/layout/r-siderbar-right.png');
  }
}

.mask-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 5.648148vh;
  display: flex;
  justify-content: center;
  background: url("@/assets/images/layout/rectangle-footer.png") 100% no-repeat;
  z-index: 996;
  .meeting-icon {
    position: absolute;
    left: 50%;
    bottom: 4.6vh;
    transform: translateX(-50%);
    width: calc(var(--xxs) * 38);
    height: calc(var(--xxs) * 13.75);
    cursor: pointer;
  }
}

.mask-left-hidden {
  transform: translateX(calc(var(--xxs) * 115 * -1));
  transition: all 0.3s;
}

.mask-right-hidden {
  transform: translateX(calc(var(--xxs) * 115));
  transition: all 0.3s;
}

.mask-show {
  transform: translateX(0);
  transition: all 0.3s;
}</style>
