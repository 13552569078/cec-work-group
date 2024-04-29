<template>
  <div class="tip-item">
    <p :style="{color:status==0?'#404040':'#9B9B9B'}" @click="handleRead" v-html="content"></p>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    },
    status: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleRead() {
      this.$emit('read')
    }
  }
}
</script>

<style scoped lang="scss">
.tip-item {
  padding: 8px;
  border-bottom: 1px solid #f4f4f4;
  p {
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    cursor: pointer;
  }
  &:last-child {
    border: none;
  }
}
</style>
