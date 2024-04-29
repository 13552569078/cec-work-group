<!--/*
* @Author: dingli
* @Desc: 上架状态标签
* @Date: 2022-1-27
*/-->
<template>
  <span :class="`state-label state-${state}`"><span v-if="version">{{ version }}</span>{{ PACK_STATUS[state]||'-' }}</span>
</template>
<script>
import { PACK_STATUS } from '@/utils/enum'
export default {
  name: 'StateLabel',
  props: {
    state: {
      type: [String, Number],
      default: 0
    },
    version: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      PACK_STATUS
    }
  },
  methods: {}
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.state-label {
  position: relative;
  padding-left: 20px;
  &::before {
    content: '';
    width: 12px;
    height: 12px;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  &.state-0, &.state-10, &.state-15, &.state-20 {
    color: #FA8B16;
    &::before {
      background: url(~@/assets/imgs/orange.png) no-repeat center ;
      background-size: 100%;
    }
  }
  &.state-1, &.state-6, &.state-11, &.state-16, &.state-21 {
    color: #2059E4;
    &::before {
      background: url(~@/assets/imgs/blue.png) no-repeat center ;
      background-size: 100%;
    }
  }
  &.state-2, &.state-8, &.state-14, &.state-19, &.state-22 {
    color: #A9A9A9;
    &::before {
      background: url(~@/assets/imgs/revoke.png) no-repeat center ;
      background-size: 100%;
    }
  }
  &.state-3, &.state-7, &.state-12, &.state-17, &.state-23 {
    color: #FF4D4F;
    &::before {
      background: url(~@/assets/imgs/red.png) no-repeat center;
      background-size: 100%;
    }
  }
  &.state-4, &.state-13, &.state-18 {
    color: #4CC09E;
    &::before {
      background: url(~@/assets/imgs/green.png) no-repeat center ;
      background-size: 100%;
    }
  }
  &.state-5 {
    color: #A9A9A9;
    &::before {
      background: url(~@/assets/imgs/gray.png) no-repeat center ;
      background-size: 100%;
    }
  }
}
</style>
