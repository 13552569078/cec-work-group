<!--/*
* @Author: dingli
* @Desc: 锚点组件
* @Date:
scrolldom 滚动dom
data-section 锚点title，dom内部文案是显示的锚点文案
data-title 是控制其是否显示层级关系
*/-->
<template>
  <div class="anchor">
    <i class="start"></i>
    <ul>
      <li
        v-for="d in list"
        :key="d.value"
        class="item"
        :class="{active:d.value==active, title:d.isTitle}"
        @click="clickItem(d)">{{ d.label }}</li>
    </ul>
    <i class="end"></i>
  </div>
</template>
<script>
import { debounce } from '@l/utils'
export default {
  name: 'Anchor',
  props: {
    scrolldom: HTMLElement
  },
  data() {
    return {
      active: '',
      list: [],
      anchorDomList: []
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.debouncedScrollHandler = debounce(this.handlePageScroll, 500)
    this.$nextTick(() => {
      this.scrolldom.addEventListener('scroll', this.debouncedScrollHandler)
      this.getAnchorList()
    })
  },
  destroyed() {
    this.scrolldom.removeEventListener('scroll', this.debouncedScrollHandler)
  },
  methods: {
    clickItem(item) {
      this.active = item.value
      const section = this.scrolldom.querySelector(`[data-section=${this.active}]`)
      this.$nextTick(() => {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      })
    },
    getAnchorList() {
      const baseTop = Math.floor(this.scrolldom.getBoundingClientRect().top)
      const anchorDomList = this.scrolldom.querySelectorAll('[data-section]')
      const anchorObjList = []
      const list = []
      for (let i = 0; i < anchorDomList.length; i++) {
        anchorObjList[i] = {
          top: Math.floor(anchorDomList[i].getBoundingClientRect().top) - baseTop,
          dom: anchorDomList[i]
        }
        list.push({
          value: anchorDomList[i].dataset.section,
          label: anchorDomList[i].innerText || anchorDomList[i].dataset.section,
          isTitle: !!anchorDomList[i].dataset.title
        })
      }
      this.active = list[0] && list[0].value || ''
      this.list = list
      this.anchorDomList = anchorObjList
    },
    handlePageScroll(e) {
      e.stopPropagation()
      const currentScrollTop = this.scrolldom.scrollTop
      let currentSection
      const length = this.anchorDomList.length
      for (let i = 0; i < length; i++) {
        if (i === length - 1) {
          if (currentScrollTop >= this.anchorDomList[i].top) {
            currentSection = this.anchorDomList[i].dom
            break
          }
        } else {
          if (currentScrollTop >= this.anchorDomList[i].top && currentScrollTop < this.anchorDomList[i + 1].top) {
            currentSection = this.anchorDomList[i].dom
            break
          }
        }
      }
      const initVal = this.anchorDomList[0] ? this.anchorDomList[0].dom.dataset.section : ''
      this.active = currentSection && currentSection.dataset.section || initVal
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.anchor {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: -14px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #EDEDED;
  }
  .start {
    position: absolute;
    top: -10px;
    left: -18px;
    width: 10px;
    height: 10px;
    border: 2px solid #EDEDED;
  }
  .end {
    position: absolute;
    bottom: -10px;
    left: -18px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid #EDEDED;
  }
  .item {
    position: relative;
    width: 138px;
    height: 40px;
    line-height: 40px;
    padding-left: 30px;
    cursor: pointer;
    &:hover {
      background: #F9FAFE;
    }
    &::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 12px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid $primaryColor;
      background: white;
      opacity: 0;
      transition: opacity 0.5s ease-in-out;
    }
  }
  .title {
    padding-left: 15px;
    width: 138px;
    height: 40px;
    line-height: 40px;
  }
  .active {
    background: #F9FAFE;
    &::before {
      opacity: 1;
    }
  }
}
</style>
