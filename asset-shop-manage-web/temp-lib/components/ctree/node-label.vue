<!--
 * @Description: 树节点文本  自动判断节点文本溢出时进行tip提示
 * @Author: zs
 * @Date: 2021-09-26
-->
<template>
  <div class="left-node">
    <c-tooltip
      :disabled="isDisabled"
      :content="label"
      placement="top-start"
    >
      <span ref="label">{{ label }}</span>
    </c-tooltip>
  </div>
</template>
<script>
export default {
  name: 'NodeLabel',
  components: {
  },
  props: {
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isDisabled: true,
      isMounted: false
    }
  },
  watch: {
    label(val) {
      if (this.isMounted) {
        this.judgeEllipsis()
      }
    }
  },
  mounted() {
    this.isMounted = true
    this.judgeEllipsis()
  },
  methods: {
    judgeEllipsis() {
      this.$nextTick(() => {
        this.isDisabled = this.$el.offsetWidth > this.$refs['label'].offsetWidth + 6
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.left-node {
  width: calc(100% - 41px); /*定义块元素的宽度*/
  display: inline-block;
  white-space: nowrap; /*内容超宽后禁止换行显示*/
  overflow: hidden; /*超出部分隐藏*/
  text-overflow: ellipsis; /*文字超出部分以省略号显示*/
  height: 26px;
  line-height: 26px;
}
</style>
