<template>
  <div class="app-header" :style="`background-image: url(${headBg});`">
    <section class="wrapper_left">
      <div :class="`${isShzl ? 'logo shzl-logo' : 'logo'}`">
        <img :src="innerLogo" alt="" @click.stop="toPortal">
      </div>
      <div :class="`${isShzl ? 'text_entrance-shzl fs16 fw-b' : 'text_entrance fs16 fw-b'}`">{{ platformTitle }}</div>
    </section>
    <section class="wrapper_right">
      <div class="menu mr20">
        <img
          :src="profile.avatar || require('@/assets/man.png')"
          class="user-avatar"
          alt=""
        >
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="avatar-wrapper">
            <span class="el-dropdown-link ml10">
              {{ nameAndGroup }}
              <i class="el-icon-arrow-down el-icon--right op65" />
            </span>
          </div>
          <el-dropdown-menu slot="dropdown" class="app-user-dropdown">
            <el-dropdown-item v-if="selectedOrgRole.id" command="switchOrgRole">切换角色</el-dropdown-item>
            <!-- 子应用隐藏退出功能 -->
            <el-dropdown-item v-show="false" command="b">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </section>
    <select-org-role-dialog :visible.sync="showSelectOrgRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import selectOrgRoleDialog from '@/components/page-wrapper/selectOrgRoleDialog.vue'
import innerLogo from '@/assets/login/inner-logo.png'
import countyHeadBg from '@/assets/bg.png'

export default {
  name: 'AppHeader',
  components: {
    selectOrgRoleDialog
  },
  data() {
    return {
      showSelectOrgRole: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'profile', 'selectedOrgRole', 'appInfo']),
    platformTitle() {
      return this.appInfo.name || ''
    },
    // 右侧组织机构名称拼接
    nameAndGroup() {
      return `${this.profile.username || ''}${this.selectedOrgRole.id ? `-${this.selectedOrgRole.org.name}-${this.selectedOrgRole.role.name}` : ''}` || '空姓名'
    },
    isShzl() {
      return window.GLOBAL_CONFIG.isShzl
    },
    innerLogo() {
      return !this.isShzl ? innerLogo : (window.origin + window.location.pathname + 'static/headImgs/hlogo.png')
    },
    headBg() {
      return !this.isShzl ? countyHeadBg : (window.origin + window.location.pathname + 'static/headImgs/headbg.png')
    }

  },

  methods: {
    // 跳转工作台的聚合页，新标签打开
    toPortal() {
      // window.open('/index/#/portal', '_blank')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },

    handleCommand(command) {
      if (command === 'b') {
        this.$store.dispatch('user/logout')
      } else if (command === 'switchOrgRole') {
        this.showSelectOrgRole = true
      }
    },
    toIdentify() {
      this.$router.push({ path: '/manage/certification' })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  @extend %center_middle_flex;
  justify-content: space-between;

  height: 100%;
  font-size: 14px;
  padding: 0;

  .wrapper_left {
    @extend %center_middle_flex;
  }
  .logo {
    position: relative;
    display: flex;
    align-content: center;
    width: 46px;
    height: 46px;
    margin-left: 20px;
    cursor: pointer;
    &.shzl-logo {
      height: 40px;
      width: auto;
      &::after {
        content: '';
        position: absolute;
        width: 1px;
        height: 16px;
        background: #bfc3cb;
        transform: translateY(-50%);
        right: -16px;
        top: 50%;
      }
    }
    img {
      width: 100%;
      height: 100%;
    }

  }

  .text_entrance {
    margin-left: 18px;
    color: $white;
    font-size: 28px;
    font-family: PangMenZhengDao;
    color: #FFFFFF;
    line-height: 32px;
    text-shadow: 0px 1px 3px rgba(0,120,219,0.4);
  }
  .text_entrance-shzl {
    margin-left: 33px;
    color: $white;
  }

  .menu {
    display: flex;
    justify-content: center;
    align-content: center;
    line-height: 1.15;
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 100%;
      vertical-align: middle;
      background: linear-gradient(180deg, #6bb5ff 0%, #07529d 100%);
      border: 2px solid rgba(255, 255, 255, 0.65);
      @extend %header_font;
    }
    .avatar-wrapper {
      cursor: pointer;
      @extend %header_font;
    }
  }
  .wrapper_right {
    @extend %center_middle_flex;
  }
}
</style>

<style lang="scss">
.app-user-dropdown {
  .el-dropdown-menu__item {
    height: 40px;
    line-height: 40px;
    width: 100px;
    text-align: center;
    &:hover {
      background: #F9FAFE;
      color: #36A4FF;
    }
  }
}
</style>
