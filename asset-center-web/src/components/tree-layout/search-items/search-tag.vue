<!--
 * @Description: 搜索项标签页面
 * @Author: zs
 * @Date: 2022-01-27
-->
<template>
  <div class="search-page-tag_wrap" :class="{'search-page-tag_wrap-hide': showHide}">
    <div
      v-for="item in tags"
      :key="item.key"
      :class="{
        'search-tag': true,
        'search-tag-all': showType === 'all'
      }"
    >
      <span>{{ item.label + '：' + item.valueName }}</span>
      <div class="white-line"></div>
      <i class="tag-close c-icon-close" @click="_clear(item)"></i>
    </div>
    <div v-if="tags.length" class="clear-all" :class="{'clear-all-bottom': showType === 'all'}" @click="_clear('all')">清空</div>
  </div>

</template>
<script>
export default {
  name: '',
  components: {
  },
  props: {
    showType: {
      type: String,
      default: 'limit' // 'limit' 限定展示 会对比父元素的宽度进行选择是否渲染  'all' 不做任何限定，正常展示
    },
    tags: {
      type: Array,
      default() {
        return []
      }
    },

    boxWidth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showHide: false,
      timer: null
    }
  },
  computed: {
  },
  watch: {
    tags: {
      handler(val) {
        this.$nextTick(() => {
          this.computedWidth()
        })
      },
      deep: true
    },
    boxWidth(val) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$nextTick(() => {
          this.computedWidth()
          this.timer = null
        })
      }, 50)
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 对比自己的宽度
    computedWidth() {
      this.showHide = this.$el.parentNode.offsetWidth - this.$el.offsetWidth <= 48 && this.showType === 'limit'
      this.$emit('hideIt', this.showHide)
    },
    _clear(item) {
      this.$emit('clearEvent', item)
    }
  }
}
</script>

<style scoped lang='scss'>
.search-page-tag_wrap {
  display: inline-block;
  .search-tag {
    display: inline-block;
    box-sizing: border-box;
    position: relative;
    height: 32px;
    background: #F1F3F8;
    border-radius: 2px;
    border: 1px solid #E7E7E7;
    line-height: 32px;
    padding: 0 49px 0 16px;
    color: #4B4B4B;
    font-size: 14px;
    margin-right: 16px;
    .white-line {
      position: absolute;
      top: 10px;
      right: 32px;
      width: 1px;
      height: 12px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, #FFFFFF 51%, rgba(255, 255, 255, 0.3) 100%);
    }
    .tag-close {
      position: absolute;
      top: 8px;
      right: 8px;
      font-size: 16px;
      cursor: pointer;
    }

    &:hover {
      color: #36A4FF;
      background: #D7EDFF;
      border-radius: 2px;
      border: none;
      border: 1px solid #D7EDFF;
    }
  }
  .clear-all {
    display: inline-block;
    color: #8A8A8A;
    font-size: 14px;
    &:hover {
      cursor: pointer;
      color: #36A4FF;
    }
  }
  .clear-all-bottom {
    height: 32px;
    line-height: 32px;
    margin-bottom: 20px;
  }
}
.search-page-tag_wrap-hide {
  height: 0;
  overflow: hidden;
}
.search-tag-all {
  margin-bottom: 20px;
}
</style>
