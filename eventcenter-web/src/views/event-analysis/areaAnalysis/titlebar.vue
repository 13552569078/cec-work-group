<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="card-wrap">
    <div class="title">{{ title }}</div>
    <div class="right">
      <div class="icon-btn-group">
        <i v-for="(val, key) in option" :key="key" :class="`${key} ${active==key?'active':''}`" @click.stop="_changeTab(key)" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    option: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: ''
    },
    active: {
      type: String,
      default: ''
    }
  },
  methods: {
    _changeTab(val) {
      this.$emit('change', val)
    }
  }
}
</script>
<style scoped lang="scss">
.card-wrap{
  position: relative;
  padding: 20px;
  background-color: #fff;
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 500;
    color: #4B4B4B;
    border-left: 4px solid #36A4FF;
    padding-left: 10px;
  }
  .right {
    position: absolute;
    right: 20px;
    top: 14px;
  }
}
.icon-btn-group {
  display: flex;
  background: #F0F4FC;
  border-radius: 4px;
  border: 1px solid #FFFFFF;
  i {
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    &:first-child {
      margin-right: 2px;
    }
    &.active {
      background-color: #FFFFFF;
      box-shadow: 0px 1px 4px 0px rgba(15,49,77,0.2);
      border-radius: 3px;
    }
    &.list {
      background-image: url(~@/assets/icon-list.png);
      &.active {
        background-image: url(~@/assets/icon-list-hover.png);
      }
    }
    &.graph {
      background-image: url(~@/assets/icon-graph.png);
      &.active {
        background-image: url(~@/assets/icon-graph-hover.png);
      }
    }
  }
}
</style>
