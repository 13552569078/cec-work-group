<template>
  <div class="app-header">
    <section class="wrapper-left">
      <div class="logo">
        <img :src="logoSrc" />
      </div>
    </section>
    <div class="wrapper-right">
      <div class="menu mr20">
        <el-dropdown @command="doLogout">
          <div class="avatar-wrapper">
            <img :src="avatar" alt="" v-if="avatar" />
            <img :src="userImg" alt="" v-else />
            <span class="el-dropdown-link">
              <span class="name">{{ username }}</span
              ><el-icon :size="12"><arrow-down-bold /></el-icon>
            </span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '/@/store/modules/user'
import userImg from '/@/assets/images/face.png'
import { ArrowDownBold } from '@element-plus/icons-vue'
import innerLogo from '/@/assets/images/layout/logo.png'
import { getProfile } from '/@/utils/storage/auth'

defineProps({
  collapsed: {
    type: Boolean
  }
})

const logoSrc = ref()
onMounted(() => {
  logoSrc.value = innerLogo
  //后续接入用户中心，logo取配置的系统logo
})

const store = useUserStore()
//用户名
const username = computed(() => getProfile()?.username || '默认')
//头像
const avatar = computed(() => getProfile()?.avatar || userImg)

// 退出登录
const doLogout = () => {
  store.logout(true)
}
</script>

<style lang="scss" scoped>
.app-header {
  background: url('/@/assets/images/layout/navbar.png') no-repeat;
  background-size: 100% 100%;
  @extend %center_middle_flex;
  justify-content: space-between;

  height: 100%;
  font-size: 14px;
  padding: 0;

  .wrapper-left {
    @extend %center_middle_flex;
  }

  .icon_menu {
    width: 48px;
    height: 48px;
    background: #006dff;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      display: block;
      width: 16px;
      height: 16px;
    }
  }
  .logo {
    position: relative;
    display: flex;
    align-content: center;
    margin-left: 28px;
    width: auto;
    height: 47px;
  }
  .text {
    margin-left: 33px;
    color: $white;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: #ffffff;
    line-height: 16px;
  }
  .menu {
    display: flex;
    justify-content: center;
    align-content: center;
    line-height: 1.15;
    .avatar-wrapper {
      cursor: pointer;
      @extend %header_font;
      @extend %center_middle_flex;
      img {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 100%;
        vertical-align: middle;
      }
      .el-dropdown-link {
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
        .name {
          margin-right: 10px;
        }
      }
    }
  }

  .wrapper-right {
    @extend %center_middle_flex;
  }
}
</style>
