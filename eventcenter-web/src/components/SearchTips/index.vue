<template>
  <div ref="stCotainer" class="search-tips-container">
    <div ref="sTips" class="search-tips">
      <div v-if="showTips" id="sLeft" ref="sLeft" class="left fs16">
        <!-- 表格上面的搜索结果高亮提示 -->
        <span v-if="false" class="total-icon" />
        <span class="el-icon-search" />
        <span
          v-if="selectCount"
        >已选<span class="result-total">{{ selectCount }}</span>条数据</span>
        <span
          v-else-if="total && !selectCount"
        >查询结果<span class="result-total">{{ total }}</span>条数据</span>
        <span v-else>暂无查询结果</span>
        <!-- 添加刷新 icon 按要求隐藏-->
        <span v-if="$route.meta.keepAlive && false" class="el-icon-refresh" @click="handleRefresh" />
      </div>
      <div v-if="showActions" ref="sRight" class="right">
        <slot />
      </div>
    </div>
    <div v-if="showSearchItems && searchItems.length" class="s-tips" :style="filterStyle">
      <div v-for="item in searchItems" :key="item.labelKey" ref="sTip" class="s-tip">
        <span class="val">{{ item.val }}</span>
        <span class="el-icon-close" @click="closeTip(item)" />
      </div>
      <span class="clear-btn" @click="clearAll">清空</span>
    </div>
  </div>
</template>

<script>
import resizeObserverMixin from '@/mixin/resizeObserverMixin'
export default {
  name: 'SearchTips',
  mixins: [resizeObserverMixin],
  props: {
    total: {
      type: [String, Number],
      default: 0
    },
    showActions: {
      type: Boolean,
      default: false
    },
    showTips: {
      type: Boolean,
      default: true
    },
    showSearchItems: {
      type: Boolean,
      default: false
    },
    searchItems: {
      type: Array,
      default: () => []
    },
    selectCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      filterStyle: {
        left: '140px',
        top: '15px',
        position: 'absolute'
      },
      containerHeight: 64
    }
  },
  watch: {
    searchItems: {
      handler() {
        if (this.showSearchItems) {
          this.$nextTick(() => {
            this.calcStyle()
          })
        }
      },
      deep: true
    },
    containerHeight(val) {
      this.$emit('heightChange', val)
    }
  },
  mounted() {
    // 监听搜索结果宽度变化
    if (this.showSearchItems && this.showTips) {
      // 创建观察实例
      this.initObServer(document.getElementById('sLeft'), entries => {
        console.log('创建观察实例==', entries)
        if (entries[0].target) {
          this.calcStyle()
        }
      })
    }
  },
  methods: {
    handleRefresh() {
      this.$emit('refresh')
    },
    async calcStyle() {
      await this.$nextTick()
      const sLeftRef = this.$refs.sLeft
      const sTipsRef = this.$refs.sTips
      const sRightRef = this.$refs.sRight
      let filterWidth = sTipsRef.offsetWidth
      if (sLeftRef) {
        // 减去查询结果
        filterWidth -= sLeftRef.offsetWidth
      }
      if (sRightRef) {
        // 减去操作按钮
        filterWidth -= sRightRef.offsetWidth
      }
      // 查询结果和操作按钮之前的左右padding
      filterWidth -= 40
      // 计算搜索项宽度
      const tipEles = this.$refs.sTip
      let tipsWidth = 0
      if (tipEles) {
        tipEles.forEach((dom) => {
          tipsWidth += dom.offsetWidth + 16
        })
      }
      // 加上清空宽度
      tipsWidth += 50
      if (tipsWidth > filterWidth) {
        this.filterStyle = {
          width: '100%',
          position: 'relative'
        }
      } else {
        this.filterStyle = {
          left: (sLeftRef?.offsetWidth || 0) + 'px',
          top: this.showActions ? '15px' : '15px', // 没有操作按钮
          width: filterWidth + 'px',
          position: 'absolute'
        }
      }
      this.containerHeight = this.$refs.stCotainer.offsetHeight
    },
    _handleClick() {
      this.$emit('add')
    },
    closeTip(tip) {
      this.$emit('delFilter', tip)
    },
    clearAll() {
      this.$emit('clear')
    }
  }
}
</script>

<style lang="scss">
%hover {
  &:active, &:hover {
    color: $primaryColor;
  }
}
.search-tips-container {
  position: relative;
  background-color: #fff;
  .s-tips {
    margin-left: 16px;
    padding: 0 20px;
    .s-tip {
      display: inline-block;
      margin-right: 16px;
      background: #F1F3F8;
      border-radius: 2px;
      border: 1px solid #E7E7E7;
      height: 32px;
      color: #4B4B4B;
      line-height: 32px;
      text-align: center;
      padding: 0 8px 0 16px;
      margin-bottom: 16px;
      &:hover, &:active {
        color: $primaryColor;
        .el-icon-close {
          color: $primaryColor;
        }
        background: rgba($primaryColor,0.2);
      }
      .val {
        position: relative;
        padding-right: 16px;
        &::after {
          content: " ";
          height: 12px;
          width: 1px;
          background: #ffffff;
          right: 0;
          position: absolute;
          top: 2px;
        }
      }
      .el-icon-close {
        color: #4B4B4B;
        padding-left: 10px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
      }
    }
    .clear-btn {
      color: #8A8A8A;
      cursor: pointer;
      margin-right: 16px;
      display: inline-block;
      @extend %hover;
    }
  }
}
.search-tips {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  position: relative;
  color: $tableHeaderColor;
  .right {
    margin-left: auto;
    display: flex;
    .el-button {
      margin-left: 16px;
    }
  }
  .result-total {
    color: $primaryColor;
  }
  .el-icon-search {
    margin-right: 8px;
    font-weight: bold;
  }
  .el-icon-refresh {
    cursor: pointer;
  }
  .left {
    display: flex;
    align-items: center;
  }
  .total-icon {
    display: inline-block;
    vertical-align: middle;
    width: 16px;
    height: 16px;
    background-image: url(~@/assets/icon-data.png);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-right: 8px;
  }
  .selectcount-icon {
    position: relative;
    width: 16px;
    height: 20px;
    background: #FFFFFF;
    border: 2px solid #4B4B4B;
    display: inline-block;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    margin-right: 8px;
    &::after {
      content: " ";
      position: absolute;
      left: 5px;
      top: 3px;
      width: 2px;
      height: 6px;
      background: #4B4B4B;
    }
  }
}
</style>
