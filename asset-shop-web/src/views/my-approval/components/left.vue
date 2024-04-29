<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
-->
<!--/*
* @Author: dingli
* @Desc: 上下架管理-左侧导航
* @Date: 2022-1-27
*/-->
<template>
  <ul class="cls-leftnav">
    <li class="title ftm500">我的审核</li>
    <li class="pointer ftm500 f16 h64" :class="{active:activeTab==='approvaling'}" @click="goto('approvaling')">待审核</li>
    <li class="pointer ftm500 f16 h64" :class="{active:activeTab==='approvaled'}" @click="goto('approvaled')">已审核</li>
  </ul>
</template>
<script>

export default {
  name: 'Leftnav',
  components: { },
  props: {
    activeTab: {
      type: String,
      default: 'approvaling'
    }
  },
  data() {
    return {}
  },
  computed: {

  },
  methods: {
    goto(flag) {
      this.$emit('goto', flag)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.f16 {
  font-size: 16px;
}
.cls-leftnav {
  padding: 16px 20px;
  li {
    padding-left: 20px;
    height: 48px;
    line-height: 48px;
  }
  .version-text {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pl16 {
    padding-left: 16px;
  }
  .pr20 {
    padding-right: 20px;
  }
  .pointer {
    cursor: pointer;
  }
  .title {
    padding-left: 0;
    margin-left: 20px;
    margin-bottom: 16px;
    margin-right: 20px;
    color: #8A8A8A;
    border-bottom: solid 1px #e7e7e7;
  }
  .h64{
    height: 64px;
    line-height: 64px;
  }
  .active {
    background: #E9EBED;
    border-radius: 2px;
    .version-text {
      font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
    }
  }
}
</style>
