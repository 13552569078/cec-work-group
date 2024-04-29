<!--
 * @Description: 锚点组件，请参考demo配套使用
 * @Author: wyh19
 * @Date: 2021-03-25
-->
<template>
  <div class="anchor-wrapper">
    <div class="anchor-track"></div>
    <div ref="anchor" class="anchor">
      <div v-for="node in sections" :key="node.label"
           :class="[node.ismain?'anchor-main-node':'anchor-sub-node',{'anchor-node-active':currentSection===node.label}]"
           label="" :data-anchor="node.label" @click="handleClick(node.label)">
        {{ node.label }}
        <i v-if="node.tip && !noTip" class="highlight-tag">!</i>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '../../utils'
export default {
  props: {
    pageBlock: HTMLElement,
    noTip: Boolean,
    color: String
  },
  data() {
    return {
      currentSection: '',
      sections: []
    }
  },
  watch: {
    currentSection() {
      this.showCurrentSectionsAnchor()
    }
  },
  mounted() {
    this.$refs['anchor'].style.setProperty('--activeColor', this.color)
    this.debouncedScrollHandler = debounce(this.handlePageScroll, 100)
    this.sections = this.getSectionsData(this.pageBlock)
    this.currentSection = this.getCurrentSection()
    this.pageBlock.addEventListener('scroll', this.debouncedScrollHandler)
  },
  beforeDestroy() {
    this.pageBlock.removeEventListener('scroll', this.debouncedScrollHandler)
  },
  methods: {
    reRender() {
      this.sections = this.getSectionsData(this.pageBlock)
      this.currentSection = this.getCurrentSection()
    },
    getSectionsData(pageBlock) {
      if (!pageBlock) {
        return []
      }
      let mainIndex = 0
      let subIndex = 0
      const sections = Array.from(pageBlock.querySelectorAll('[data-section]'))
      return sections.map((item, index) => {
        let ismain = false
        if ('ismain' in item.dataset) {
          ismain = true
          mainIndex++
          subIndex = 0
        } else {
          subIndex++
        }
        let tip = false
        if ('tip' in item.dataset) {
          tip = true
        }
        return {
          tip,
          ismain,
          index: ismain ? mainIndex : `${mainIndex}.${subIndex}`,
          label: item.dataset.section,
          top: item.offsetTop
        }
      })
    },
    handleClick(label) {
      const section = this.pageBlock.querySelector(`[data-section=${label}]`)
      this.currentSection = label
      setTimeout(() => {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      })
    },
    getCurrentSection() {
      const currentScrollTop = this.pageBlock.scrollTop
      const sections = this.sections
      const length = sections.length
      let currentSection
      for (let i = 0; i < length; i++) {
        if (currentScrollTop === sections[i].top || (i < length - 1 && currentScrollTop > sections[i].top && currentScrollTop < sections[i + 1].top)) {
          currentSection = sections[i].label
          break
        } else if (i === length - 1) {
          if (currentScrollTop > sections[i].top) {
            currentSection = sections[i].label
            break
          }
        }
      }
      return currentSection
    },
    showCurrentSectionsAnchor() {
      const anchor = this.pageBlock.querySelector(`[data-anchor=${this.currentSection}]`)
      if (anchor) {
        const wrapper = anchor.parentElement
        const clientHeight = wrapper.clientHeight
        const offsetTop = anchor.offsetTop
        // 计算当前元素是否处于容器可视区域中间偏下的位置，如果是的，则让容器滚动使得元素可视居中
        if (offsetTop > clientHeight / 2) {
          wrapper.scrollTop = offsetTop - clientHeight / 2
        } else {
          wrapper.scrollTop = 0
        }
      }
    },
    handlePageScroll(e) {
      e.stopPropagation()
      this.currentSection = this.getCurrentSection()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';
.anchor-wrapper {
  position: relative;
  height: 100%;
  color: #4b4b4b;
  font-size: 14px;
}
.anchor-track {
  position: absolute;
  left: 6px;
  top: -10px;
  bottom: -10px;
  width: 2px;
  background: #EDEDED;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -4px;
    width: 10px;
    height: 10px;
    // border-radius: 10px;
    border: 2px solid #EDEDED;
    background: #fff;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: -4px;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    border: 2px solid #EDEDED;
    background: #fff;
  }
}
.anchor {
  --activeColor: $primaryColor;
  position: relative;
  padding: 10px 14px;
  width: 100%;
  height: 100%;
  min-width: 120px;
  min-height: 120px;
  overflow-x: visible;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.anchor-main-node {
  height: 40px;
  line-height: 40px;
  position: relative;
  font-weight: 400;
  cursor: pointer;
  margin-left: 10px;
  // &::after {
  //   content: '';
  //   position: absolute;
  //   left: -11px;
  //   top: 3px;
  //   width: 8px;
  //   height: 8px;
  //   border-radius: 8px;
  //   background: #666;
  // }
  &::before {
    content: attr(label);
    margin-left: 6px;
    margin-right: 6px;
  }
}
.anchor-sub-node {
  position: relative;
  margin: 10px 0;
  padding-left: 26px;
  color: #666;
  cursor: pointer;
  &::before {
    content: attr(label);
    margin-right: 6px;
  }
}
.anchor-node-active {
  background: #F9FAFE;
  // color: var(--activeColor);
  &::after {
    content: '';
    position: absolute;
    left: -24px;
    top: 14px;
    width: 14px;
    height: 14px;
    border: 3px solid var(--activeColor);
    background: white;
    border-radius: 50%;
  }
}
.highlight-tag {
  display: inline-block;
  text-align: center;
  margin-left: 8px;
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background: crimson;
  color: #efefef;
}
</style>
