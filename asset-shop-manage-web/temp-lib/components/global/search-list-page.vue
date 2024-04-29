
<!--
 * @Description: 搜索列表页面布局
 * @Author: zs
 * @Date: 2021-09-06
-->
<template>
  <div class="page-wrapper">
    <div ref="page-header" class="page-header" :class="[dynamicClass, showDrop ? 'page-header-dynamic-drop' : '']">
      <div ref="form-wrap" class="form-wrap" :class="{'form-wrap-show': !dropState}">
        <div ref="form-box" class="form-box">
          <slot name="header" />
        </div>
      </div>
      <div class="btn-wrap">
        <slot name="btns" />
      </div>
      <div v-if="showDrop" class="drop-btn-box">
        <span class="drop-btn" @click="changeDrop"><i class="c-icon-arrow-down" :class="{'drop-btn-up': dropState}"></i></span>
      </div>
    </div>
    <div ref="page-content" :style="contentBoxH" class="page-content">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce'
import { bus } from '@/utils'
export default {
  name: 'SearchListPage',
  data() {
    return {
      dynamicClass: '',
      judgeStyle: null,
      dropState: false,
      showDrop: false,
      contentBoxH: null
    }
  },
  mounted() {
    this.judgeStyle = debounce(200, () => {
      this.setStyle()
    })
    window.addEventListener('resize', this.judgeStyle)
    this.setStyle()
    bus.$on('sideBar-on-off', this.judgeStyle)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.judgeStyle)
    bus.$off('sideBar-on-off', this.judgeStyle)
  },
  methods: {
    changeDrop() {
      this.dropState = !this.dropState
      this.setContentH()
    },
    setStyle() {
      const pageHeader_w = this.$refs['page-header'].offsetWidth
      const formWrap_w = this.$refs['form-wrap'].offsetWidth
      this.showDrop = this.$refs['form-box'].offsetHeight > 104
      if (!this.showDrop) {
        this.dropState = false
      }
      if (pageHeader_w - formWrap_w < 210) {
        this.dynamicClass = 'page-header-dynamic'
      } else {
        this.dynamicClass = ''
      }
      this.setContentH()
    },
    setContentH() {
      this.$nextTick(() => {
        const pageBoxInfo = this.$el.getBoundingClientRect()
        const contentBoxInfo = this.$refs['page-content'].getBoundingClientRect()
        const contentBoxH = pageBoxInfo.height - (contentBoxInfo.top - pageBoxInfo.top)
        this.contentBoxH = {
          height: contentBoxH + 'px'
        }
        this.$nextTick(() => {
          this.$emit('contentHeightChange', contentBoxH)
        })
      })
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .page-header {
    position: relative;
    box-sizing: border-box;
    background: #ffffff;
    border-top: 1px solid #45abff;
    padding: 20px 20px 0;
  }
  .page-content {
    margin-top: 16px;
    background: #ffffff;
  }
  .btn-wrap {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
  .form-wrap {
    display: inline-block;
  }
  .page-header-dynamic {
    padding-bottom: 52px;
    margin-bottom: 16px;
    .btn-wrap {
      width: 100%;
      position: absolute;
      text-align: center;
      right: 0;
      bottom: 20px;
    }
    .form-wrap {
      overflow: hidden;
    }
    .form-wrap-show {
      max-height: 104px;
    }
  }
  .page-header-dynamic-drop {
    margin-bottom: 32px;
  }
  .drop-btn-box {
    position: absolute;
    width: 100%;
    height: 16px;
    bottom: -14px;
    right: 0;
    text-align: center;
    .drop-btn {
      display: inline-block;
      width: 24px;
      height: 16px;
      text-align: center;
      line-height: 16px;
      font-size: 12px;
      background: #fff;
      cursor: pointer;
    }
    .c-icon-arrow-down {
      transition: all .3s;
    }
    .drop-btn-up {
      transform:rotate(180deg);
    }
  }
}
</style>
