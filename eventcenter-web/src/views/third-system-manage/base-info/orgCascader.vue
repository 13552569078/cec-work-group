<template>
  <!-- <div v-clickoutside="handleClickOutside" class="cestc-grid-cascader"> -->
  <div class="cestc-grid-cascader">
    <div class="cascader-tip">
      <svg-icon icon-class="grid" />
      <div class="cas-content" @click="toggleOpen">
        <span v-if="!selectedList.length" class="placehoder">{{ placeholder }}</span>
        <span v-if="selectedList.length" class="selected-tags">
          <span class="clo-name ellipsis">
            {{ selectedList[0].name }}
          </span>
          <i class="c-icon-circle-close" @click.stop="delGrid" />
          <span v-if="selectedList.length > 1" class="gn-tip">+{{ selectedList.length - 1 }}</span>
        </span>
        <span class="icon-control" @mouseenter="controlEnter" @mouseleave="controlLeave">
          <i
            v-if="(!isOpen && !controlIn) || (!isOpen && controlIn && !selectedList.length)"
            class="c-icon-caret-bottom"
          />
          <i
            v-if="(isOpen && !controlIn) || (isOpen && controlIn && !selectedList.length)"
            class="c-icon-caret-top"
          />
          <i v-if="controlIn && selectedList.length" class="c-icon-circle-close" @click.stop="delAll" />
        </span>
      </div>
    </div>
    <transition name="c-fade-in-linear">
      <div v-if="isOpen" class="cas-select">
        <div class="search">
          <el-input v-model="filterText" class="cestc-dark-input" placeholder="请输入网格名称搜索" />
          <!-- <div class="s-btn" @click="matchGrid">查询</div> -->
        </div>
        <div v-if="!filterText" class="cas-panels">
          <div v-for="(casGroup, index) in displayOptions" :key="index" class="cas-panel" :style="{width:displayOptions.length === 1 ? '274px' : '188px'}">
            <div class="cas-item">
              <el-checkbox
                :key="`cas-${index}`"
                v-model="treeLevelAllCheck[index]"
                @click.stop=""
                @change="allSelctChange($event, index)"
              />
              <span class="gn-label ellipsis">全部选择</span>
            </div>
            <div v-for="item in casGroup" :key="item.id" class="cas-item">
              <el-checkbox
                :key="`casitem-${item.id}`"
                v-model="item.isCheck"
                @click.stop=""
                @change="gridChange($event, item,index)"
              />
              <span
                class="gn-label ellipsis"
                @click="showNextLevel(item, index)"
              >{{ item.name }}</span>
              <span v-if="getChildCount(item) > 0" class="gn-tip">+{{ getChildCount(item) }}</span>
            </div>
          </div>
        </div>
        <div v-show="filterText" class="search-panels">
          <div v-for="item in matchList" :key="item.id" class="cas-item">
            <el-checkbox :key="`matchitem-${item.id}`" v-model="item.isCheck" @change="gridChange($event, item)" />
            <span class="gn-label ellipsis">{{ item.name }}</span>
          </div>
          <div v-if="!matchList.length" class="no-data grid-linear-text-3">未搜索到相关网格信息</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// import Clickoutside from 'cestc-ioc-ui/src/utils/clickoutside'

export default {
  name: 'ShzlFullviewWeixianGridCacader',
  // directives: { Clickoutside },
  props: {
    placeholder: {
      type: String,
      default: '请选择网格'
    },
    options: {
      type: Array,
      default: () => []
    },
    initGirds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isOpen: false,
      selectedList: [],
      controlIn: false,
      filterText: '',
      treeLevels: [],
      allGridList: [],
      treeLevelAllCheck: [],
      displayOptions: [],
      matchList: []
    }
  },
  watch: {
    options: {
      handler(val) {
        if (val.length) {
          this.allGridList = []
          this.selectedList = []
          this.optsFn()
        }
      },
      deep: true
    },
    // 模糊匹配搜索
    filterText(val) {
      if (val) {
        this.matchList = this.allGridList.filter(item => item.name.indexOf(val) > -1)
      }
    }
  },
  created() {
    if (this.options.length) this.optsFn()
  },
  methods: {
    optsFn() {
      const treeLevels = []
      this.initOpts(JSON.parse(JSON.stringify(this.options)), 0, treeLevels)
      this.$set(this, 'treeLevels', treeLevels)
      this.displayOptions[0] = this.treeLevels[0]
      this.$set(this, 'treeLevelAllCheck', new Array(this.treeLevels.length).fill(false))
      // 默认选中
      if (this.initGirds.length) {
        this.selectedList = this.allGridList.filter(item => item.isCheck)
        if (!this.displayOptions[0].some(item => !item.isCheck)) {
          this.treeLevelAllCheck[0] = true
        }
        this.$emit('gridChange', this.selectedList)
      }
    },
    initOpts(arr, idx, treeLevels) {
      arr.forEach(item => {
        item.isCheck = this.initGirds.some(sitem => sitem.id === item.id)
        this.allGridList.push(item)
        if (!treeLevels[idx]) {
          treeLevels[idx] = [item]
        } else {
          treeLevels[idx].push(item)
        }
        if (item.children && item.children.length) {
          this.initOpts(item.children, idx + 1, treeLevels)
        }
      })
    },
    // 按钮控制
    toggleOpen() {
      this.isOpen = !this.isOpen
      this.filterText = ''
    },
    handleClickOutside() {
      this.isOpen = false
    },
    controlEnter() {
      this.controlIn = true
    },
    controlLeave() {
      this.controlIn = false
    },
    // 全选/反选逻辑
    allSelctChange(isCheck, idx) {
      this.displayOptions[idx].forEach(item => {
        item.isCheck = isCheck
      })
      this.selectedList = this.allGridList.filter(item => item.isCheck)
      this.$emit('gridChange', this.selectedList)
    },
    gridChange(isCheck, data, idx) {
      if (idx === undefined) {
        idx = this.displayOptions.findIndex(opts => opts.some(item => item.id === data.id))
      }
      if (idx !== -1) {
        this.treeLevelAllCheck[idx] = this.displayOptions[idx].length === this.displayOptions[idx].filter(item => item.isCheck).length
      }
      this.selectedList = this.allGridList.filter(item => item.isCheck)
      this.$emit('gridChange', this.selectedList)
    },
    // 获取下级选中个数
    getChildCount(data) {
      let count = 0
      const getCount = (data) => {
        if (data.children && data.children.length) {
          count += data.children.filter(item => item.isCheck).length
          data.children.forEach(item => {
            getCount(item)
          })
        }
      }
      getCount(data)
      return count
    },
    // 获取下级展示
    showNextLevel(grid, idx) {
      if (idx >= this.treeLevels.length - 1) return
      this.displayOptions.splice(idx + 1)
      if (grid.children && grid.children.length) {
        this.displayOptions[idx + 1] = this.treeLevels[idx + 1].filter(item => item.parentId === grid.id)
        this.treeLevelAllCheck[idx + 1] = this.displayOptions[idx + 1].length === this.displayOptions[idx + 1].filter(item => item.isCheck).length
      }
    },
    // 取消第一个选中
    delGrid() {
      const delGird = this.selectedList.splice(0, 1)[0]
      delGird.isCheck = false
      const idx = this.treeLevels.findIndex(levels => levels.some(level => level.id === delGird.id))
      this.treeLevelAllCheck[idx] = false
      this.$emit('gridChange', this.selectedList)
    },
    // 全部不选
    delAll() {
      this.allGridList.forEach(item => {
        item.isCheck = false
      })
      for (let i = 0; i < this.treeLevelAllCheck.length; i++) {
        this.treeLevelAllCheck[i] = false
      }
      this.selectedList = []
      this.$emit('gridChange', this.selectedList)
    },
    // 下钻逻辑 只保留当前及所有儿子
    downLayerGrids(parent) {
      this.allGridList.forEach(item => {
        item.isCheck = (item.id === parent.id) || (item.parentId === parent.id)
      })
      for (let i = 0; i < this.treeLevels.length; i++) {
        const idx = this.treeLevels[i].findIndex(item => item.id === parent.id)
        if (idx === -1) {
          this.treeLevelAllCheck[i] = false
        } else {
          if (parent.children && parent.children) {
            const childIdx = i + 1
            this.treeLevelAllCheck[childIdx] = true
            this.displayOptions[childIdx] = this.treeLevels[childIdx].filter(item => item.isCheck)
            this.displayOptions.splice(childIdx + 1)
            // 待修复---多层级
            for (let j = i; j >= 0; j--) {
              this.treeLevelAllCheck[j] = this.treeLevels[j].length === this.treeLevels[childIdx].filter(item => item.isCheck)
              this.displayOptions[j] = this.treeLevels[j]
            }
          }
          break
        }
      }
      this.selectedList = this.allGridList.filter(item => item.isCheck)
      this.$emit('gridChange', this.selectedList)
    }
  }
}
</script>

<style lang="scss" scoped>
.cestc-grid-cascader {
  position: relative;
  height: 42px;
  .cascader-tip {
    width: 282px;
    height: 42px;
    margin-right: 20px;
    padding-left: 16.5px;
    display: flex;
    align-items: center;
    // background-image: url('~@/assets/grid/网格图层选中.svg');
    background-repeat: no-repeat;
    background-size: 100%;
    position: relative;
    display: flex;
    align-items: center;
    .cas-content {
      width: calc(100% - 33px);
      padding-left: 8px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-image: linear-gradient(
        90deg,
        rgba(24, 33, 47, 0.5) 0%,
        rgba(49, 159, 255, 0.5) 51%,
        rgba(24, 33, 48, 0.5) 100%
      );
      color: #cce8ff;
      font-size: 14px;
      cursor: pointer;
      .selected-tags {
        display: flex;
        width: calc(100% - 30px);
        align-items: center;
        .clo-name {
          max-width: calc(100% - 60px);
        }
        i {
            margin-left: 6px;
            cursor: pointer;
            &:hover {
              color: #4db8ff;
            }
          }
        .gn-tip {
          flex-shrink: 0;
          margin-left: 8px;
        }
      }
      .placehoder {
        color: #cce8ff;
        font-size: 14px;
      }
      .icon-control {
        color: #4db8ff;
        i {
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }
  .gn-tip {
    display: inline-block;
    width: 30px;
    background: rgba(77, 184, 255, 0.3);
    height: 16px;
    line-height: 16px;
    border-radius: 6px;
    font-size: 12px;
    text-align: center;
  }
  .cas-select {
    position: absolute;
    width: auto;
    top: 45px;
    z-index: 9;
    .search {
      width: 274px;
      display: flex;
      background: rgba(26, 64, 102, 0.8);
      .s-btn {
        flex-shrink: 0;
        height: 32px;
        width: 46px;
        background-image: linear-gradient(
          180deg,
          rgba(67, 141, 179, 0.8) 1%,
          rgba(45, 124, 204, 0.64) 84%
        );
        border: 1px solid #33c9ff;
        box-shadow: inset 0px 0px 8px 0px rgba(54, 201, 255, 0.5);
        line-height: 32px;
        text-align: center;
        color: #ffffff;
        font-size: 14px;
        cursor: pointer;
      }
    }
    .cas-panels,.search-panels {
      border: 1px solid rgba(77, 184, 255, 0.6);
      background: rgba(26, 64, 102, 0.8);
      margin-top: 8px;
      height: 200px;
      display: flex;
      &.search-panels {
        display: block;
        overflow-y: auto;
        .no-data {
          font-weight: bold;
          font-size: 14px;
        }
      }
      .cas-panel {
        width: 188px;
        height: 100%;
        overflow-y: auto;
        border-right: 1px solid rgba(77, 184, 255, 0.6);
      }
      .cas-item {
          height: 32px;
          color: #cce8ff;
          font-size: 14px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          &:hover {
            background-image: linear-gradient(
              90deg,
              rgba(51, 173, 255, 0.5) 0%,
              rgba(51, 173, 255, 0.2) 100%
            );
          }
          ::v-deep {
            .c-checkbox__inner {
              background: rgba(19, 48, 77, 0.4);
              border: 1px solid rgba(77, 184, 255, 0.5);
              border-radius: 2px;
            }
            .c-checkbox__inner {
              &::before {
                width: 10px;
                height: 10px;
                background-image: radial-gradient(
                  circle at 50% 14%,
                  #ceebff 0%,
                  #2dabff 65%
                );
                border-radius: 1px;
                background-color: rgba(155, 155, 155, 0);
                left: 2px;
                top: 2px;
              }
              .c-checkbox__inner-border {
                border: 1px solid rgba(77, 184, 255, 1);
              }
            }
            .c-checkbox__input.is-checked .c-checkbox__inner {
              background: rgba(50, 127, 204, 0.5);
              &::after {
                border: 3px solid #fff;
                border-radius: 1px;
                border-image: linear-gradient(#ceebff, #2dabff) 2 2;
                border-left: 0;
                border-top: 0;
                top: 0px;
                left: 4px;
                width: 4px;
                height: 8px;
              }
              .c-checkbox__inner-border {
                border: 1px solid rgba(77, 184, 255, 1);
              }
            }
          }
          .gn-label {
            width: calc(100% - 46px);
            line-height: 30px;
            height: 100%;
            margin-left: 8px;
            display: inline-block;
            cursor: pointer;
          }
        }
    }
  }
}
</style>
