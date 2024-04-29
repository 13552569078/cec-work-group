<!--/*
* @Author:
* @Desc:
* @Date:
*/-->
<template>
  <div class="top flex-between" :class="{ishistory:ishistory}">
    <div class="felx1">
      <p class="flex mb16">
        <i class="icon-top"></i>
        <span class="h2">{{ `${packName} ${version || '--'}` }}</span>
      </p>
      <p v-if="ishistory" class="time">{{ time }}</p>
      <p v-else-if="state==4" class="time">上架时间 {{ time }}</p>
      <p v-else class="time">上次编辑时间 {{ time }}</p>
    </div>
    <div v-if="btnList&&btnList.length" class="btn-box">
      <c-button v-for="(b, i) in btnList" :key="b.key" :type="i==btnList.length-1?'primary':''" @click="clickBtns(b.key)">{{ b.label }}</c-button>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    ishistory: [Boolean],
    packName: [Number, String],
    version: [String, Number],
    time: [String],
    btnList: [Array],
    state: [Number, String]
  },
  methods: {
    clickBtns(k) {
      this.$emit('clickBtns', k)
    }
  }
}
</script>
<style scoped lang="scss">
.top {
    margin-bottom: 20px;
    position: relative;
    height: 144px;
    padding-left: 240px;
    padding-right: 32px;
    padding-top: 32px;
    background-image: url(~@/assets/imgs/history-bg-1.png);
    background-repeat: no-repeat;
    background-size: auto cover;
    font-size: 14px;
    background-color: white;
    &.ishistory {
      background-image: url(~@/assets/imgs/history-bg.png);
      .icon-top {
        background-image: url(~@/assets/imgs/icon-history.png);
      }
    }
    .icon-top {
      margin-right: 12px;
      width: 24px;
      height: 24px;
      background-image: url(~@/assets/imgs/icon-app.png);
      background-repeat: no-repeat;
      background-size: 100%;
    }
    .h2 {
      line-height: 24px;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
      color: #4b4b4b;
    }
    .time {
      flex: 1;
      padding-left: 12px;
      height: 40px;
      line-height: 40px;
      background: #F6F9FB;
    }
    .flex {
      display: flex;
      align-items: center;
    }
    .mb16 {
      margin-bottom: 16px;
    }
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    .felx1 {
      flex: 1;
    }
    .btn-box {
      margin-left: 40px;
    }
  }
</style>
