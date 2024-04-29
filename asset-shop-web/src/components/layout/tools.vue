<template>
  <div class="toolbar">
    <full-screen v-if="fullScreen" />
    <message-tip v-if="useMsg&&isLogin" />
    <c-dropdown class="toolbar-dropdown" @command="handleUserCommand">
      <div class="user-wrap">
        <img :src="avatar" class="user-icon">
      </div>
      <c-dropdown-menu slot="dropdown" class="toolbar-box">
        <c-dropdown-item v-if="!isLogin" command="login" class="item-logout">登录</c-dropdown-item>
        <template v-else>
          <c-dropdown-item command="logout" class="item-logout">{{ userName }}<i class="c-icon-switch-button" /></c-dropdown-item>
          <c-dropdown-item v-for="r in router" :key="r.path" :command="r.path">{{ r.meta.title }}</c-dropdown-item>
        </template>
      </c-dropdown-menu>
    </c-dropdown>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MessageTip from '@l/message/message-tip'
import { settingsConf } from '@l/settings'
import fullScreen from '@l/components/full-screen'
import { getToken } from '@l/utils/auth'

export default {
  components: { MessageTip, fullScreen },
  props: {
    userName: String,
    avatar: String
  },
  data() {
    return {
      useMsg: settingsConf.useMsg,
      fullScreen: settingsConf.fullScreen,
      isLogin: !!getToken()
    }
  },
  computed: {
    ...mapState({
      route: (state) => state.route
    }),
    router() {
      try {
        const route = this.$store.getters.routes.find(d => d.path === '/mine')
        if (route.children) {
          return route.children.filter(d => !d.hidden)
        }
      } catch (e) {
        return []
      }
      return []
    }
  },
  methods: {
    handleUserCommand(command) {
      if (command === 'logout') {
        this.$confirm('将要退出本系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          confirmButtonIsLeft: true,
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('user/logout', this.$route.fullPath)
        }).catch(() => {})
        return
      }
      if (command === 'login') {
        this.$store.dispatch('user/resetToken')
        return
      }
      if (command && command !== 'logout') {
        const r = this.router.find(d => d.path === command)
        this.clickroute(r)
      }
    },
    clickroute(r) {
      const current = r.redirect || r.path
      if (this.$route.path === current) {
        this.$router.go(0)
      } else {
        this.$router.push(current)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  align-items: center;
  padding-right: 32px;
  height: 75%;
}
.user-wrap {
  cursor: pointer;
      height: 100%;
    display: flex;
    align-items: center;
}
.user-name {
  padding-right: 16px;
  position: relative;
  color: #FFFFFF;
  &::after {
    content: '';
    position: absolute;
    top: 6px;
    right: 0;
    border: solid rgba(255, 255, 255, 0.65);
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
  }
}
.toolbar-dropdown{
  height: 100%;
}
.user-icon {
  margin-left: 38px;
  margin-right: 8px;
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
</style>

<style lang="scss">
.toolbar-box{
  border-radius:0px;
  .popper__arrow{
    display: none;
  }
  .c-icon-switch-button {
    margin-right: 0;
    margin-left: 12px;
  }
  .c-dropdown-menu__item {
    padding: 0 16px !important;
    text-align: center;
    font-size: 16px !important;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
  }
  .item-logout {
    height: 48px !important;
    line-height: 48px !important;
    border-bottom: 1px solid rgba(189, 189, 189, 0.6);
    background: rgba(30,111,255,0);
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
  }
}
</style>
