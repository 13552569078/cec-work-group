<!--
 * @Description: 根据是否宽度大于table的cell的宽度显示缩略
 * @Author: zhangsen
 * @Date: 2021-05-06
-->
<template>
  <div class="cell-item">
    <c-tooltip
      :effect="effect"
      :disabled="isDisabledTooltip"
      :placement="placement"
      popper-class="cell-tags-popover"
    >
      <div :ref="refName" class="content-wrap ellipsis" :class="{'close-box': !isDisabledTooltip}">
        <span class="empty-text">1</span><ctag v-for="(tag,index) in tags" :key="index" :tag="tag"></ctag>
      </div>
      <div slot="content" class="item-tag-content-wrapper">
        <ctag v-for="(tag,index) in tags" :key="index" class=" item-tag-content" :tag="tag"></ctag>
      </div>
    </c-tooltip>
  </div>
</template>

<script>
import ctag from './tag.vue'
export default {
  name: 'TextOverTooltip',
  components: {
    ctag
  },
  props: {
    // 是否显示模仿 input 的 disable 样式
    tags: {
      type: Array
    },
    // 子元素标识（如在同一页面中调用多次组件，此参数不可重复）
    refName: {
      type: String,
      default: 'tag'
    },
    // 默认提供的主题 dark/light
    effect: {
      type: String,
      default: () => {
        return 'light';
      }
    },
    // Tooltip 的出现位置top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end
    placement: {
      type: String,
      default: () => {
        return 'bottom';
      }
    }
  },
  data() {
    return {
      hasMounted: false,
      hasChecked: false,
      isDisabledTooltip: true // 是否需要禁止提示
    }
  },
  watch: {
    tags(val) {
      // if (this.hasMounted) {
      this.doInit()
      // }
    }
  },
  mounted() {
    this.doInit()
    this.hasMounted = true
  },
  methods: {
    // 判断内容的宽度contentWidth是否大于父级的宽度
    doChecked() {
      if (!this.$refs[this.refName]) return
      const parentWidth = this.$refs[this.refName].parentNode.offsetWidth;
      const contentWidth = this.$refs[this.refName].offsetWidth;
      // 判断是否禁用tooltip功能
      this.isDisabledTooltip = contentWidth <= parentWidth;
      this.hasChecked = true
    },
    doInit() {
      if (this.tags && this.tags.length && !this.hasChecked) {
        this.$nextTick(() => {
          this.doChecked(this.refName)
        })
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.cell-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  height: 24px;
}
.empty-text {
  display: inline-block;
  width: 0;
  color: transparent;
}
.content-wrap {
  display: inline-block;
}
.close-box {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

</style>
<style lang="scss">
@import '@/styles/variables.scss';
.cell-tags-popover .item-tag-content-wrapper .item-tag-content {
  display: inline-block;
  margin-right: 8px;
  margin-bottom: 8px;
}
.cell-tags-popover .item-tag-content-wrapper {
  margin-bottom: -8px;
}
</style>

