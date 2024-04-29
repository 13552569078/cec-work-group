<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="icon-switch-wrap">
    <i class="icon list" :class="{active:value=='list'}" @click="clickIcon('list')"></i>
    <i class="icon card" :class="{active:value=='card'}" @click="clickIcon('card')"></i>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    value: String
  },
  data() {
    return {}
  },
  methods: {
    clickIcon(key) {
      this.$emit('input', key)
      this.$emit('change', key)
    }
  }
};
</script>
<style scoped lang="scss">
.icon-switch-wrap {
  margin-left: 32px;
  height: 32px;
  .icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    background-color: #F6F9FB;
    background-size: 60%;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .list {
    margin-right: 8px;
    background-image: url(~@/assets/imgs/icon-list.svg);
    background-size: 60%;
    &:hover, &.active {
      background-color: #EBF9FF;
      background-image: url(~@/assets/imgs/icon-list-hover.svg);
      background-size: 60%;
    }
  }
  .card {
    margin-right: 8px;
    background-image: url(~@/assets/imgs/icon-card.svg);
    background-size: 60%;
    &:hover, &.active {
      background-color: #EBF9FF;
      background-image: url(~@/assets/imgs/icon-card-hover.svg);
      background-size: 60%;
    }
  }
}
</style>
