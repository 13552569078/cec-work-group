<template show-source>
  <hl-header>
    <div class="logo">
      <img :src="logoFXUrl" alt="hongluan.ui" />
      <h1>业务系统名称</h1>
    </div>
    <hl-group class="header-left" gap="var(--xs)">
      <!-- <hl-button type="link" class="text-inverse">可视化大屏</hl-button>
      <hl-button type="link" class="text-inverse">Hongluan.Ui</hl-button> -->
    </hl-group>
    <div class="header-right">
      <hl-group gap="var(--xs)" class="m-r-xxl"> </hl-group>
      <div class="userinfo">
        <span class="name">Hi，{{ userName }}</span>
        <hl-dropdown class="m-l-xs">
          <hl-thumb round type="primary" size="sm" light class="face">
            <span>{{ userName.substring(0, 1) }}</span>
          </hl-thumb>
          <template #dropdown>
            <hl-dropdown-menu>
              <hl-dropdown-item @click="userLogout">退出</hl-dropdown-item>
            </hl-dropdown-menu>
          </template>
        </hl-dropdown>
      </div>
    </div>
  </hl-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import logoFXUrl from '../assets/images/logo-fx.png';

export default defineComponent({
  name: 'LayoutHeader',
  components: {},

  setup() {
    return {
      userName: 'test',
      userLogout: () => { console.log('logout'); },
      logoFXUrl
    };
  }
});
</script>
<style lang="scss" scoped></style>
