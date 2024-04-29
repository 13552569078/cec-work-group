<template show-source>
 <hl-header>
    <div class="logo">
      <img :src="logoFXUrl" alt="hongluan.ui" style="height:calc(var(--xxs) * 9.5);width:auto;margin-left:calc(var(--xxs) * -1)"/>
    </div>
    <hl-group class="header-left" gap="var(--xs)">
    </hl-group>
    <div class="header-right">
      <hl-group gap="var(--xs)" class="m-r-xxl"> </hl-group>
      <div class="userinfo">
        <hl-dropdown popper-class="user-info-popper">
          <div class="display-flex items-middle">
            <hl-thumb round type="primary" size="sm" light class="face m-r-xs" :src="userHead">
              <span>{{ userInfo?.empname.substring(0, 1) }}</span>
            </hl-thumb>
            <hl-icon size="sm">
              <FillChevronBottom />
            </hl-icon>
          </div>
          <template #dropdown>
            <div class="user-info-dropdown">
              <hl-thumb round type="primary" size="sm" light class="face-big" :src="userHead">
                <span>{{ userInfo?.empname.substring(0, 1) }}</span>
              </hl-thumb>
              <div class="username">{{ userInfo?.empname }}</div>
              <div class="orgname">{{ userInfo?.orgname }}</div>
              <div class="menu-list">
                <div class="menu-item" @click="userLogout">
                  <hl-icon size="md" class="m-r-sm" color="#FF4D4F"><FillSignout /></hl-icon>
                  <span class="txt">退出</span>
                </div>
              </div>
            </div>
          </template>
        </hl-dropdown>
      </div>
    </div>
  </hl-header>
</template>

<script lang="ts" setup>
import { h, ref, onMounted } from 'vue';
import { ModelessDialogManager } from 'hongluan-business-ui';
import { User, useUser } from 'fx-front-ucenter';
import { GlobalAPI } from '@/common';
import ThemePreview from './theme.vue';
import logoFXUrl from '../assets/images/logo-fx-02.png';
import userHead from '../assets/images/user-head.png';

const { logout, getUserInfo } = useUser();
const userInfo = ref<User>();

const userLogout = () => {
  const loginUrl = encodeURIComponent(`${window.location.origin}/${GlobalAPI.config.PROD_PREFIX}`);
  logout(loginUrl);
};

onMounted(async() => {
  userInfo.value = await getUserInfo();
});

const configTheme = () => {
  ModelessDialogManager.show({
    id: 'themeDialog',
    title: '主题定制',
    showMaximize: false,
    body: h(ThemePreview)
  });
};
</script>
<style lang="scss">
div[id='themeDialog'] {
  width: 850px;
  height: 500px;
  left: 50%;
  transform: translate(-50%, 0);
  .panel-body {
    height: 100%;
    padding: 0;
  }
}
</style>
