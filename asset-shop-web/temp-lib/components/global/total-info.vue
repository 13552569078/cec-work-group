<!--/*
* @Author: dingli
* @Desc: 表格上面提示信息
* @Date: 2021-9-2
*/-->
<template>
  <span class="list-total" :class="cls" v-html="text"></span>
</template>
<script>
export default {
  name: 'TotalInfo',
  props: {
    total: {
      type: [String, Number],
      default: 0
    },
    search: {
      type: Boolean,
      default: false
    },
    checked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    cls() {
      if (this.checked && this.total > 0) return 'is-checked'
      if (this.search) return 'is-search'
      return 'default'
    },
    text() {
      if (this.checked && this.total > 0) return `已选<span class="color-primary">${this.total}</span>条数据`
      if (this.search) {
        if (this.total > 0) return `查询结果<span class="color-primary">${this.total}</span>条数据`
        return '暂无查询结果'
      }
      if (this.total > 0) return `共计<span class="color-primary">${this.total}</span>条数据`
      return '暂无数据'
    }
  }
}
</script>
<style scoped lang="scss">
@import '../../styles/variables.scss';
.list-total {
  position: relative;
  font-size: 16px;
  color: #202020;
  padding-left: 24px;
  &.default::before {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(../../assets/imgs/icon-data.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  &.is-search::before {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(../../assets/imgs/icon-search.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
}
// 主题色
.color-primary {
  color: $primaryColor;
}
</style>
