<!--/*
* @Author: dingli
* @Desc: 标签
* @Date: 2022-1-21
*/-->
<template>
  <transition name="fade-transform" mode="out-in">
    <div v-show="list.length!==0" class="tag-wrap">
      <span v-for="tag in list" :key="tag.showId" class="tag-item">
        <span class="text">{{ tag.show }}</span>
        <i class="c-icon-close" @click="handleClose(tag)" />
      </span>
      <span class="clear" @click="handleClear">清空筛选条件</span>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'Tags',
  props: {
    list: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    handleClose(tag) {
      const list = []
      this.list.forEach(d => {
        if (d.showId !== tag.showId) {
          list.push(d)
        }
      })
      this.$emit('change', list)
    },
    handleClear() {
      this.$emit('change', [])
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.tag-wrap {
  padding: 16px 0 4px 0px;
  .tag-item {
    margin-right: 16px;
    margin-bottom: 16px;
    display: inline-block;
    height: 32px;
    line-height: 32px;
    background: #F1F3F8;
    border-radius: 2px;
    border: 1px solid #E7E7E7;
    background: linear-gradient(180deg, #F3F5F8 0%, #FDFDFE 100%);
    box-shadow: 2px 3px 8px 0px rgba(232, 237, 245, 0.6);
    border-radius: 16px;
    border: 1px solid #FFFFFF;
    cursor: pointer;
    .text {
      position: relative;
      padding-left: 16px;
    }
    i {
      margin: 0 10px;
    }
    &:hover {
      color: $primaryColor;
    }
  }
  .clear {
    display: inline-block;
    margin-bottom: 20px;
    color: #8A8A8A;
    cursor: pointer;
    &:hover {
      color: $primaryColor;
    }
  }
}
</style>
