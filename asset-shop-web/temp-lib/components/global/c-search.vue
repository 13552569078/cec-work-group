<!--/*
* @Author: dingli
* @Desc: 查询框
* @Date: 2021-8-23
*/-->
<template>
  <c-input
    v-model="valueStr"
    :size="size"
    :placeholder="placeholder"
    class="cls-c-search"
    @keyup.enter.native="valueChange">
    <i slot="append" class="c-icon-search" @click="valueChange"></i></c-input>
</template>
<script>
export default {
  name: 'CSearch',
  components: {},
  props: {
    /* 初始值 */
    value: {
      type: [Number, String],
      default: () => {
        return ''
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      valueStr: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.valueStr = val
      },
      immediate: true
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    valueChange() {
      // 更新绑定value数据
      this.$emit('input', this.valueStr)
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep.cls-c-search .c-input-group__append {
    padding: 0;
    width: 32px;
    height: auto;
    background: #F9FAFE;
    text-align: center;
    cursor: pointer;
  i.c-icon-search {
    display: inline-block;
    width: 100%;
    padding: 8px 0;
  }
  .c-icon-search:before {
    font-size: 14.5px;
    font-weight: 600;
    color: #4B4B4B;
  }
}
</style>
