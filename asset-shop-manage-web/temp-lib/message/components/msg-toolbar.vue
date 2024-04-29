<!--
 * @Description:消息列表页工具条
 * @Author: wyh19
 * @Date: 2020-09-17
-->
<template>
  <div class="msg-toolbar">
    <div class="msg-toolbar-left">{{ unreadCount }}条未读</div>
    <div class="msg-toolbar-right">
      <span class="msg-toolbar-item" @click="handleOpenSettings"><i
        class="iconfont icon-c-setting" />设置</span>
      <span class="msg-toolbar-item" @click="handleReadAll"><i
        class="iconfont icon-c-complete" />全部标为已读</span>
      <span slot="reference" class="msg-toolbar-item" @click="handleClearAll"><i
        class="iconfont icon-c-delete" />清空所有消息</span>
      <c-radio-group v-model="status" style="margin-left:20px;" size="small"
                     @change="handleChangeStatus">
        <c-radio-button :label="2">全部</c-radio-button>
        <c-radio-button :label="1">已读</c-radio-button>
        <c-radio-button :label="0">未读</c-radio-button>
      </c-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    unreadCount: {
      type: Number,
      default: 0
    },
    readFlag: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      status: this.readFlag,
      settingsVisble: false
    }
  },
  watch: {
    readFlag(value) {
      this.status = value
    }
  },
  methods: {
    handleChangeStatus(v) {
      this.$emit('status-change', v)
    },
    handleOpenSettings() {
      this.$emit('open-settings')
    },
    handleReadAll() {
      this.$emit('read-all')
    },
    handleClearAll() {
      this.$emit('clear-all')
    }
  }
}
</script>

<style scoped lang="scss">
.msg-toolbar {
  display: flex;
  height: 100%;
  width: 100%;
  padding: 0 32px 0 16px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f4f4f4;
}
.msg-toolbar-left {
  font-size: 14px;
  color: #9b9b9b;
}
.msg-toolbar-item {
  font-size: 14px;
  margin: 0 12px;
  color: #404040;
  cursor: pointer;
  i {
    font-size: 14px;
    margin-right: 3px;
  }
}
</style>
