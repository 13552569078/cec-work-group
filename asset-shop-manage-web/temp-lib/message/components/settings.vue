<template>
  <div>
    <div>
      <c-checkbox v-model="msgSettings.voiceFlag" :true-label="1" :false-label="0">声音提醒</c-checkbox>
      <c-checkbox v-model="msgSettings.clearFlag" :true-label="1" :false-label="0">消息查看后从消息框中移出
      </c-checkbox>
    </div>
    <div class="button-bar">
      <c-button type="gradual" size="small" @click="handleSubmit">确认</c-button>
      <c-button type="ordinary" size="small" @click="handleCancel">取消</c-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msgSettings: {
      type: Object,
      default: () => ({ voiceFlag: 0, clearFlag: 0 })
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.msgSettings)
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.button-bar {
  text-align: right;
  margin: 25px 0 0 0;
}
</style>
