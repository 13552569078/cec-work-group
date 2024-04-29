<!--
  * @Description: 资源标签多个场景下交互显示组件
 * @Author: renzhenggang
 * @Date: 2021-05-08
-->
<template>
  <div class="flex">
    <div v-for="(tag,index) in tags" :key="index" class="tags-inline" @mouseenter="onMouseEnter($event)">
      <c-tooltip v-if="index <= showNum - 1" :disabled="disabled" placement="top" :content="tag">
        <span
          v-if="index <= showNum - 1"
          :style="{ maxWidth: maxWidth + 'px'}"
          class="text-overflow tag inline-tag">{{ tag }}</span>
      </c-tooltip>

    </div>
    <!-- 隐藏加载所有标签 -->
    <div ref="tagId" class="hidden-div">
      <div v-for="(tag,index) in tags" :key="index" class="tags-inline">
        <span
          class="text-overflow tag inline-tag">{{ tag }}</span>
      </div>
    </div>
    <div v-if="tags.length > showNum">
      <c-popover
        popper-class="ct-tags-popover"
        :width="width"
        :placement="placement"
        :trigger="trigger">
        <div v-for="(tag,index) in tags" :key="index" class="dark-bg" @mouseenter="onMouseEnter($event)">
          <span class="text-overflow tag popover-tag">{{ tag }}</span>
        </div>
        <span slot="reference"><em class="iconfont icon-c-more"></em></span>
      </c-popover>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TagsPopover',
  props: {
    tags: {
      type: Array
    },
    // 业务标签div的宽度
    divWidth: {
      type: Number,
      default: 280
    },
    maxWidth: {
      type: Number // 设置未交互场景下单个tag的最大宽度
    },
    placement: {
      type: String
    },
    trigger: {
      type: String,
      default() {
        return 'hover'
      }
    },
    width: {
      type: Number, // 设置popover宽度
      default() {
        return 260
      }
    }
  },
  data() {
    return {
      disabled: false,
      showNum: 0
    }
  },
  watch: {

  },
  mounted() {
    this.getTagShowNum(this.$refs.tagId.children, this.divWidth)
  },
  methods: {

    getTagShowNum(tagsList, divWidth) {
      divWidth = divWidth - 16
      let fontLength = 0
      let res = 0
      for (let index = 0; index < tagsList.length; index++) {
        fontLength += tagsList[index].offsetWidth;
        if (fontLength > divWidth) {
          break
        }
        res++
      }
      this.showNum = res
      return
    },
    onMouseEnter(event) {
      if (event.target) {
        const target = event.target
        this.disabled = !this.isEllipsis(target.children[0])
      }
    },
    isEllipsis(dom) {
      let parent
      let flag
      const checkDom = dom.cloneNode()
      checkDom.style.width = dom.offsetWidth + 'px'
      checkDom.style.height = dom.offsetHeight + 'px'
      checkDom.style.overflow = 'auto'
      // checkDom.style.position = 'absolute'
      // checkDom.style.zIndex = -1
      checkDom.style.opacity = 0
      checkDom.style.whiteSpace = 'nowrap'
      checkDom.innerHTML = dom.innerHTML
      parent = dom.parentNode
      parent.appendChild(checkDom)
      if (checkDom.scrollWidth && checkDom.offsetWidth) {
        flag = checkDom.scrollWidth > checkDom.offsetWidth
      } else {
        flag = false
      }
      parent.removeChild(checkDom)
      return flag
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.hidden-div{
  position: fixed;
  z-index: -1;
  height: 0;
  overflow: hidden;
}
.tag {
  display: inline-block;
  background: #F2F3F8;
  color: $primaryColor;
  height: 29px;
  line-height: 29px;
  padding: 0 12px;
  border-radius: 15px;
  font-size: 12px;
  margin: 0 3px;
}
.inline-tag {
  max-width: 144px;
}
.popover-tag {
  max-width: 144px;
}
</style>
<style lang="scss" >
.flex {
  display: flex;
  align-items: center;
}
.flex>div{
  display: flex;
  align-items: center;
}
.ct-tags-popover {
  display: flex;
  flex-flow: row wrap;
  background: #303133;
  .popper__arrow::after{
    border-bottom-color: #303133 !important;
  }
}
.text-overflow {
  // max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
