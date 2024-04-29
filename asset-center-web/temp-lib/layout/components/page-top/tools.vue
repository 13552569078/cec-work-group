<template>
  <div class="toolbar">
    <full-screen v-if="fullScreen" />
    <message-tip v-if="useMsg&&isRoot" />
    <c-dropdown trigger="click" @command="handleUserCommand">
      <div class="user-wrap">
        <img :src="avatar" class="user-icon">
        <span class="user-name">{{ userName }}</span>
      </div>
      <c-dropdown-menu slot="dropdown">
        <c-dropdown-item icon="c-icon-switch-button" command="logout">退出</c-dropdown-item>
      </c-dropdown-menu>
    </c-dropdown>
  </div>
</template>

<script>
import MessageTip from '../../../message/message-tip'
import { settingsConf } from '../../../settings'
import fullScreen from '../../../components/full-screen'

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
      isRoot: window.top === window.self
    }
  },
  methods: {
    handleUserCommand(command) {
      switch (command) {
        case 'logout':
          this.$confirm('将要退出本系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            confirmButtonIsLeft: true,
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('user/logout', this.$route.fullPath)
          })
          break
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
}
.user-wrap {
  cursor: pointer;
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
.user-icon {
  margin-left: 26px;
  margin-right: 8px;
  width: 32px;
  height: 32px;
  vertical-align: middle;
}
</style>
