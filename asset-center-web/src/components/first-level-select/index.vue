<!--
 * @Description:场景树top部分
 * @Author: pancj
 * @Date: 2021-09-07
-->
<template>
  <div class="first-level-scene-wrap">
    <div class="top-main">
      <div
        id="nav-content"
        class="left-slider-main"
        @mouseleave="leaveBarToClose"
        @mouseenter="moveBarToShow"
      >
        <ul
          class="main-left"
          :style="{height:'100%',left:leftWidth+'px',width:firstLevelData * 140 +'px'}"
        >

          <li
            v-for="(item,idx) in firstLevelData"
            :key="item.groupId"
            class="list-items"
            :class="idx === activeIndex?'active':''"
            :style="{left:idx*140+'px'}"
            @mouseenter="moveChangeTopIndex(item,idx)"
            @click="selectNowLevel(1,item,idx)"
          >
            <div class="item-style">{{ splitStr(item.groupName) }}</div>

          </li>

        </ul>
      </div>
      <div class="click-btns">
        <em
          class="btn-common"
          :class="prev"
          @click="changeIndex(prev)"
        />
        <em
          class="btn-common"
          :class="next"
          @click="changeIndex(next)"
        />
        <em
          v-if="operatable"
          class="btn-common add-new"
          @click.stop="addTreeNode({parentId:0})"
        />
      </div>
    </div>

    <div>
      <div
        v-if="(secondEmptyShow&&showDropDownPanel||showDropDownPanel&&(!secondEmptyShow&&(activeItem.childList&&activeItem.childList.length>0)))"
        class=" bottom-dropdown-box"
        :class="activeItem.hasOneMoreThreeChild?'has-one-more':'has-none-three-child'"
        :style="{left:activeItem.hasOneMoreThreeChild?'0px':(activeIndex*140+leftWidth>0? (activeIndex*140+leftWidth-40) + 30:0)+'px'}"
        @mouseenter="moveToBlack"
        @mouseleave="moveOutBlack"
      >
        <div class="bottom-dropdown-wrap">
          <div
            class="left-slider"
            :style="{maxHeight:screenRestHei*0.8+'px'}"
          >

            <div class="two-levels-list">
              <div
                v-for="(secondLevelsItem,index) in activeItem.childList"
                v-show="activeItem.childList.length>0"
                :key="secondLevelsItem.groupId"
                class="two-list-item"
                :class="index === activeSecondIndex?'active':''"
                @mouseover="moveChangeSecondIndex(secondLevelsItem,index)"
                @click="selectNowLevel(2,secondLevelsItem,index)"
              >
                {{ splitStr(secondLevelsItem&& secondLevelsItem.groupName||'') }}
                <div
                  v-if="operatable&&activeItem.readOnly!==1"
                  class="right-node"
                >
                  <span
                    class="iconfont icon-c-more icon-operate"
                    @click.stop="''"
                  />
                  <NavTreeTooltip
                    popper-class="tree-tooltip"
                    effect="dark"
                    placement="bottom"
                  >
                    <div
                      slot="content"
                      class="tree-btn dark"
                    >
                      <p
                        class="item"
                        @click.stop="editTree(secondLevelsItem)"
                      >编辑</p>
                      <p
                        class="item"
                        @click.stop="addTreeNode(secondLevelsItem)"
                      >添加</p>
                      <p
                        class="item"
                        @click.stop="deleteTree(secondLevelsItem)"
                      >删除</p>
                    </div>
                  </NavTreeTooltip>

                </div>
              </div>
            </div>
          </div>
          <div
            v-if="activeItem.hasOneMoreThreeChild"
            class="right-slider"
            :style="{minHeight:screenRestHei*0.45+'px',maxHeight:screenRestHei*0.8+'px'}"
          >
            <div
              v-for="(item,_index) in getThirdTreeList(activeSecondItem.childList)"
              :key="_index"
              class="third-tree-list first"
            >
              <div
                v-for="(thirdLevelsItem,index) in item"
                :key="thirdLevelsItem.groupId"
                class="third-list-item-wrap"
              >
                <!-- TODO:暂时去掉选中状态回显 -->
                <!-- :class="selectedData.length>3&&selectedData[2] ===thirdLevelsItem.groupId?'active':''" -->
                <div class="list-item">
                  <span
                    class="index"
                    @click.stop="selectNowLevel(3,thirdLevelsItem)"
                  >{{ index*threeMaxNum+_index+1 }}</span>
                  <span
                    class="group-name"
                    @click.stop="selectNowLevel(3,thirdLevelsItem)"
                  >{{ splitStr(thirdLevelsItem.groupName) }}</span>
                  <div
                    v-if="operatable&&activeItem.readOnly!==1"
                    class="right-node"
                  >
                    <span
                      class="iconfont icon-c-more icon-operate"
                      @click.stop="''"
                    />
                    <NavTreeTooltip
                      popper-class="tree-tooltip"
                      effect="dark"
                      placement="bottom"
                      :tooltip-top="'20px'"
                    >
                      <div
                        slot="content"
                        class="tree-btn dark"
                      >
                        <p
                          class="item"
                          @click.stop="editTree(thirdLevelsItem)"
                        >编辑</p>
                        <p
                          class="item"
                          @click.stop="addTreeNode(thirdLevelsItem)"
                        >添加</p>
                        <p
                          class="item"
                          @click.stop="deleteTree(thirdLevelsItem)"
                        >删除</p>
                      </div>
                    </NavTreeTooltip>
                  </div>
                </div>
                <div
                  v-if="thirdLevelsItem.childList.length>0"
                  class="fourth-items-wrap"
                >
                  <div
                    v-for="(forthItem) in thirdLevelsItem.childList"
                    :key="forthItem.groupId"
                    class="fourth-items-list"
                  >
                    <!-- TODO:暂时去掉选中状态回显 -->
                    <!-- :class="selectedData.length>4&&selectedData[3] ===forthItem.groupId?'active':''" -->
                    <div v-if="forthItem.childList.length > 0">
                      <div class="list-fourth-top">
                        <span
                          class="expand-logo down"
                          :class="`ref_${forthItem.groupId}`"
                          @click="clickToClose(`ref_${forthItem.groupId}`)"
                        />
                        <span
                          class="group-name"
                          @click="selectNowLevel(4,forthItem,thirdLevelsItem)"
                        >{{ splitStr(forthItem.groupName) }}</span>
                        <div
                          v-if="operatable&&activeItem.readOnly!==1"
                          class="right-node"
                        >
                          <span
                            class="iconfont icon-c-more icon-operate"
                            @click.stop="''"
                          />
                          <NavTreeTooltip
                            popper-class="tree-tooltip"
                            effect="dark"
                            placement="bottom"
                          >
                            <div
                              slot="content"
                              class="tree-btn dark"
                            >
                              <p
                                class="item"
                                @click.stop="editTree(forthItem)"
                              >编辑</p>
                              <p
                                class="item"
                                @click.stop="addTreeNode(forthItem)"
                              >添加</p>
                              <p
                                class="item"
                                @click.stop="deleteTree(forthItem)"
                              >删除</p>
                            </div>
                          </NavTreeTooltip>
                        </div>
                      </div>
                      <ul
                        class="fifth-items-list-wrap "
                        :class="`ref_${forthItem.groupId}_list`"
                      >
                        <li
                          v-for="(fifthItem) in forthItem.childList"
                          :key="fifthItem.groupId"
                          class=" fifth-items-list"
                          @click="selectNowLevel(5,fifthItem,forthItem,thirdLevelsItem)"
                        >
                          <span class="group-name">{{ splitStr(fifthItem.groupName) }}</span>
                          <div
                            v-if="operatable&&activeItem.readOnly!==1"
                            class="right-node"
                          >
                            <span
                              class="iconfont icon-c-more icon-operate"
                              @click.stop="''"
                            />
                            <NavTreeTooltip
                              popper-class="tree-tooltip"
                              effect="dark"
                              placement="bottom"
                            >
                              <div
                                slot="content"
                                class="tree-btn dark"
                              >
                                <p
                                  class="item"
                                  @click.stop="editTree(fifthItem)"
                                >编辑</p>
                                <!-- <p
                                class="item"
                                @click.stop="addTreeNode(fifthItem)"
                              >添加</p> -->
                                <p
                                  class="item"
                                  @click.stop="deleteTree(fifthItem)"
                                >删除</p>
                              </div>
                            </NavTreeTooltip>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div
                      v-else
                      class="list-fourth-top"
                      @click="selectNowLevel(4,forthItem,thirdLevelsItem)"
                    >
                      <span class="group-name">{{ splitStr(forthItem.groupName) }}</span>
                      <div
                        v-if="operatable&&activeItem.readOnly!==1"
                        class="right-node"
                      >
                        <span
                          class="iconfont icon-c-more icon-operate"
                          @click.stop="''"
                        />
                        <NavTreeTooltip
                          popper-class="tree-tooltip"
                          effect="dark"
                          placement="bottom"
                        >
                          <div
                            slot="content"
                            class="tree-btn dark"
                          >
                            <p
                              class="item"
                              @click.stop="editTree(forthItem)"
                            >编辑</p>
                            <p
                              class="item"
                              @click.stop="addTreeNode(forthItem)"
                            >添加</p>
                            <p
                              class="item"
                              @click.stop="deleteTree(forthItem)"
                            >删除</p>
                          </div>
                        </NavTreeTooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    <c-dialog v-if="dialogVisible"
              :class="'dialog-center'"
              :title="title"
              width="480px"
              class="details-dialog-adjustpadding-1"
              :visible.sync="dialogVisible"
    >
      <c-form
        ref="formData"
        :model="formData"
        :rules="rules"
        @submit.native.prevent
      >
        <c-form-item
          class="group-form-item need-small"
          label="节点名称"
          label-width="80px"
          prop="currentLabel"
        >
          <c-input
            v-model="formData.currentLabel"
            style="width:100%"
            size="small"
            type="text"
            maxlength="8"
            minlength="4"
            placeholder="请输入节点名称"
          />
        </c-form-item>
      </c-form>
      <div
        slot="footer"
        class="dialog-footer"
      >

        <c-button
          size="small"
          type="ordinary"
          @click="dialogVisible = false"
        >取消</c-button>
        <c-button
          type="gradual"
          size="small"
          @click="saveNode()"
        >确定</c-button>
      </div>
    </c-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { reservedStr } from '@/utils'
import NavTreeTooltip from './tree-tooltip.vue'
// import { addTree } from '@/api/index';
export default {
  name: 'SceneNav',
  components: { NavTreeTooltip },
  filters: {

  },
  props: {
    firstLevelData: {
      type: Array,
      default: () => []
    },
    operatable: { // 是否显示操作按钮
      type: Boolean,
      default: false
    },
    secondEmptyShow: { // 第二级按钮全为空是否展示
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      title: '',
      formData: {
        currentLabel: ''
      },
      isInNavBar: false,
      isInBlackDropdown: false,
      saveBtnFlag: true,
      dialogVisible: false,
      rules: {
        currentLabel: [{
          required: true, trigger: 'blur', message: '请输入节点名称'
        }, {
          max: 8, trigger: 'blur', message: '最多输入8个字'
        }]
      },
      isFirst: true,
      activeIndex: 0,
      activeItem: {},
      deleteInit: false,
      activeSecondIndex: 0,
      activeSecondItem: {},
      next: 'next-disabled',
      prev: 'prev-disabled',
      showDropDownPanel: false,
      screenMaxNum: 0, // 最大数量
      leftWidth: 0,
      totalWidth: 0,
      screenRestHei: 0,
      selectedData: [], // firstId, secondId, thirdId, fourthId, fifthId, selectName
      threeMaxNum: 5 // 三级ul最大放几列
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {
    firstLevelData: {
      handler(v, o) {
        if (v.length < o.length) {
          this.deleteInit = true
        } else {
          this.deleteInit = false
        }

        this.initNav()
      },
      deep: true
    },
    'sidebar.opened'() {
      window.requestAnimationFrame(() => this.initNav())
    }
  },
  created() {
  },
  mounted() {
    this.initNav()
  },
  methods: {
    splitStr(str) {
      return reservedStr(str)
    },
    getThirdTreeList(val) {
      const res = []
      if (!Array.isArray(val)) return []
      val.forEach((item, index) => {
        const _index = index % this.threeMaxNum

        res[_index] ? res[_index].push(item) : res[_index] = [item]
      })
      return res
    },
    moveOutBlack() {
      setTimeout(() => {
        // if (this.isInBlackDropdown) {
        //   if (this.showDropDownPanel && !this.isInNavBar && !this.dialogVisible) {
        //     if ($('div[aria-hidden=false]').length > 0) {
        //       this.showDropDownPanel = true
        //     } else {
        //       this.showDropDownPanel = false
        //     }
        //   }
        if (this.dialogVisible) {
          return
        }
        this.isInBlackDropdown = false
        if (this.showDropDownPanel) {
          this.showDropDownPanel = false
        }

        //
        // return
        //   }
      }, 100)
    },
    moveToBlack() {
      window.requestAnimationFrame(() => {
        if (!this.isInBlackDropdown) {
          this.isInBlackDropdown = true
        }
      })
    },
    moveBarToShow() {
      if (!this.isInNavBar) {
        this.isInNavBar = true
      }
    },
    leaveBarToClose() {
      setTimeout(() => {
        if (this.isInNavBar) {
          this.isInNavBar = false
        }
        if (!this.showDropDownPanel) {
          return
        }
        if (this.isInBlackDropdown || this.dialogVisible) {
          return
        }
        this.showDropDownPanel = false
      }, 100)
    },
    deleteTree(node) {
      this.$emit('deleteTree', {
        groupId: node.groupId,
        groupName: node.groupName,
        parentId: node.parentId
      })
      this.showDropDownPanel = false
    },
    saveNode() {
      this.saveBtnFlag = false
      this.$refs.formData.validate(valid => {
        if (!valid) {
          this.saveBtnFlag = true
          return
        }
        if (this.formData.currentTreeId) {
          const params = {
            groupId: this.formData.currentTreeId,
            groupName: this.formData.currentLabel
          }
          this.$emit('updateTree', params)
          this.dialogVisible = false
          this.saveBtnFlag = true
        } else {
          const paramsAdd = {
            parentId: this.formData.parentId || 0,
            groupName: this.formData.currentLabel
          }
          this.$emit('addTree', paramsAdd)
          this.dialogVisible = false
          this.saveBtnFlag = true
        }
        this.showDropDownPanel = false
      })
    },
    addTreeNode(node) {
      this.formData.currentLabel = ''
      this.formData.parentId = node.groupId
      this.formData.currentTreeId = null
      this.dialogVisible = true
      this.title = '添加节点'
    },
    editTree(node) {
      this.formData.currentTreeId = node.groupId
      this.formData.currentLabel = node.groupName
      this.dialogVisible = true
      this.title = '编辑节点'
    },
    clickToClose(ref) {
      if ($('.' + ref)[0].className.indexOf('down') > -1) {
        $('.' + ref)[0].className = $('.' + ref)[0].className.replace(/down/, 'up')
        $('.fifth-items-list-wrap.' + ref + '_list')[0].className = $('.fifth-items-list-wrap.' + ref + '_list')[0].className + ' show'
      } else if ($('.' + ref)[0].className.indexOf('up') > -1) {
        $('.' + ref)[0].className = $('.' + ref)[0].className.replace(/up/, 'down')
        $('.fifth-items-list-wrap.' + ref + '_list')[0].className = $('.fifth-items-list-wrap.' + ref + '_list')[0].className.replace(/show/, '')
      }
    },
    changeIndex(clickValue) {
      if (clickValue.indexOf('disable') > -1) {
        return
      }
      if (clickValue.indexOf('next') > -1) {
        this.leftWidth -= 140
      } else {
        this.leftWidth += 140
      }
      if (this.leftWidth * 1 === 0) {
        this.prev = 'prev-disabled'
      } else {
        this.prev = 'prev-active'
      }
      if ((this.leftWidth / 140 * -1) + this.screenMaxNum >= this.firstLevelData.length) {
        this.next = 'next-disabled'
      } else {
        this.next = 'next-active'
      }
    },
    initNav() {
      const dropDownWidth = document.querySelector('.top-main').offsetWidth
      // TODO:可以动态计算，现在先统一为5
      // this.threeMaxNum = Math.floor((dropDownWidth - 284) / 260)
      const domRealWidth = dropDownWidth - 184
      this.screenMaxNum = Math.floor(domRealWidth / 140)
      if (this.firstLevelData.length > this.screenMaxNum) {
        this.next = 'next-active'
      }
      const wrapDom = document.querySelector('.left-slider-main')
      wrapDom.style.width = this.screenMaxNum * 140 - 1 + 'px'
      this.screenRestHei = document.body.clientHeight - wrapDom.offsetHeight - $('.left-slider-main').offset().top - 54
      setTimeout(() => {
        if (!$('.sliding-block-move').length) {
          $('#nav-content').SlidingBlock({
            slider_h: '8px'
          })
        }
        if (this.deleteInit) {
          this.leftWidth = 0
          this.activeItem = this.firstLevelData[0]
          this.activeIndex = 0
          this.prev = 'prev-disabled'
          $('.sliding-block-move').stop(true, true).animate({
            'width': 140,
            'left': 0
          }, 100);
        }
      }, 300)
    },
    leaveFirstLevel() {
      if (this.showDropDownPanel) {
        this.showDropDownPanel = false
      }
    },
    selectNowLevel(level, item, index, endparams = {}) {
      switch (level) {
        case 1:
          this.activeIndex = index
          console.log()
          this.activeItem = item
          this.selectedData = [].concat([item.groupId])
          break
        case 2:
          this.activeSecondIndex = index
          this.activeSecondItem = item
          this.selectedData = [].concat([this.activeItem.groupId, item.groupId])
          break
        case 3:
          this.selectedData = [].concat([this.activeItem.groupId, this.activeSecondItem.groupId, item.groupId])
          break
        case 4:

          this.selectedData = [].concat([this.activeItem.groupId, this.activeSecondItem.groupId, index.groupId, item.groupId])
          break
        case 5:
          this.selectedData = [].concat([this.activeItem.groupId, this.activeSecondItem.groupId, endparams.groupId, index.groupId, item.groupId])
          break
        default:
          break
      }
      this.$emit('selectGroups', { id: item.groupId, name: item.groupName, isLeaf: item.childList.length === 0 })
      this.showDropDownPanel = false
    },
    moveChangeTopIndex(item, index) {
      this.activeIndex = index
      this.activeItem = item
      if (this.isFirst) {
        this.isFirst = false
      }
      if (this.selectedData.length > 3 && index === this.selectedData[0]) {
        item.map((sec, index) => { if (sec.groupId === this.selectedData[1]) { this.activeSecondIndex = index } });
        this.activeSecondItem = item.childList[this.activeSecondIndex]
      } else {
        if (item.hasOneMoreThreeChild && item.childList[0].childList.length > 0) {
          this.activeSecondIndex = 0;
          this.activeSecondItem = item.childList[0]
        }
      }

      if (!this.showDropDownPanel) {
        this.showDropDownPanel = true
      }
    },
    moveChangeSecondIndex(item, index) {
      this.activeSecondIndex = index
      this.activeSecondItem = item
    }
  }
}
</script>

<style  lang="scss">
.group-name {
  display: inline-block;
  width: 150px;
  white-space: nowrap;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sliding-block {
  content: '';
  width: 140px;
  height: 8px;
  background-image: url('../../assets/logo/selected-logo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  bottom: 4px !important;
  left: 0;
}
.first-level-scene-wrap {
  width: 100%;
  position: relative;
  box-sizing: border-box;

  // 滚动条样式
  ::-webkit-scrollbar-thumb {
    background: transparent !important;
  }
  .top-main {
    width: 100%;
    height: 52px;
    // border-bottom: 1px solid #e2f2ff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left-slider-main {
      width: calc(100% - 184px);
      height: 100%;
      overflow: hidden;
      position: relative;
      .main-left {
        line-height: 80px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .list-items {
          width: 140px;
          height: 52px;
          text-align: center;
          position: absolute;
          top: 0;
          cursor: pointer;
          &.active .item-style {
            font-weight: 500;
            font-family: PingFangSC-Medium;
            color: #4B4B4B;
          }

          .item-style {
            font-size: 18px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: #8A8A8A;
            width: 100%;
            height: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            line-height: 35px;
          }
        }
      }
    }
    .click-btns {
      width: 184px;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      display: flex;
      align-items: start;
      justify-content: flex-start;
      padding-top: 1px;
      .btn-common {
        width: 36px;
        height: 36px;
        // background-size: cover;
        // background-repeat: no-repeat;
        // background-position: center;
        display: block;
        &.next {
          &-active {
            background-image: url('../../assets/logo/next-active.png');
            background-size: 100% 100%;
            margin-left: 16px;
            cursor: pointer;
          }
          &-disabled {
            background-image: url('../../assets/logo/next-active.png');
            background-size: 100% 100%;
            opacity: 0.7;
            margin-left: 16px;
          }
        }
        &.prev {
          &-active {
            background-image: url('../../assets/logo/prev-active.png');
            background-size: 100% 100%;
            margin-left: 32px;
            cursor: pointer;
          }
          &-disabled {
            background-image: url('../../assets/logo/prev-active.png');
            background-size: 100% 100%;
            opacity: 0.7;
            margin-left: 32px;
          }
        }
        &.add-new {
          margin-left: 32px;
          cursor: pointer;
          background-image: url('../../assets/logo/add-first.png');
          background-size: 100% 100%;
        }
      }
    }
  }

  .bottom-dropdown-box {
    position: absolute;
    border-top: 1px solid #fff;
    z-index: 1999;
    width: 180px;
    margin: auto;
    .btn-put-away {
      position: absolute;
      bottom: -27px;
      left: 0;
      width: 100%;
      height: 28px;
      &::after {
        content: '';
        position: absolute;
        top: -1px;
        left: 50%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
      .btns {
        width: 16px;
        height: 16px;
        cursor: pointer;
        background-image: url('../../assets/logo/dropdown-putaway.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        left: 50%;
        margin-left: -8px;
        z-index: 10;
      }
    }
    &.has-one-more {
      width: 100%;
      left: 0;
      .btn-put-away {
        &::after {
          width: 200px;
          height: 28px;
          margin-left: -100px;
          z-index: 10;
          background-image: url('../../assets/logo/logo-dorpdown.png');
        }
        .btns {
          z-index: 11;
          top: 6px;
        }
      }
    }
    &.has-none-three-child {
      left: 0;
      .btn-put-away {
        bottom: -28px;
        &::after {
          width: 144px;
          height: 18px;
          margin-left: -72px;
          z-index: 10;
          background-image: url('../../assets/logo/small-dropdown.png');
        }
        .btns {
          z-index: 11;
          top: 0;
        }
      }
    }
  }
  .bottom-dropdown-wrap {
    overflow: hidden;
    box-sizing: content-box;
    border-radius: 4px;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
    .left-slider {
      box-sizing: border-box;
      padding: 16px 22px;
      overflow-y: auto;
      overflow-x: hidden;

      .two-levels-list {
        .two-list-item {
          width: 100%;
          height: 48px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8A8A8A;
          line-height: 48px;
          position: relative;
          cursor: pointer;
          &:hover {
            .right-node {
              display: block;
            }
            .right-node:hover .tree-tooltip {
              display: block;
            }
          }
          .right-node {
            position: absolute;
            right: 16px;
            top: 0;
            display: none;
          }
          &.active {
            border-radius: 2px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #36A4FF;
          }
        }
      }
    }
    .right-slider {
      width: calc(100% - 284px);
      min-height: 99%;
      overflow: auto;
      display: flex;
      flex-wrap: nowrap;
      margin-top: 32px;
      align-items: flex-start;
      .third-tree-list {
        min-width: 20%;
        width: 260px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #bdbdbd;
        .third-list-item-wrap {
          .list-item {
            height: 40px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 0 24px;
            cursor: pointer;
            position: relative;
            &:hover {
              .right-node {
                display: block;
              }
              .right-node:hover .tree-tooltip {
                display: block;
              }
            }
            .right-node {
              position: absolute;
              right: 16px;
              top: 12px;
              color: #36a4ff;
              display: none;
            }
            &.active,
            &:hover {
              .index {
                background: #36a4ff;
              }
              .group-name {
                color: #36a4ff;
              }
            }
            .index {
              width: 24px;
              height: 24px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              border-radius: 2px;
              background: #bdbdbd;
              text-align: center;
              line-height: 24px;
            }
            .group-name {
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #bdbdbd;
              padding-left: 16px;
            }
          }
          .fourth-items-list {
            padding-left: 63px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #bdbdbd;
            line-height: 32px;
            &.active,
            &:hover {
              color: #36a4ff;
              cursor: pointer;
            }
            &:hover {
              .right-node {
                display: block;
              }
              .right-node:hover .tree-tooltip {
                display: block;
              }
            }
            .right-node {
              position: absolute;
              right: 16px;
              top: 0px;
              color: #36a4ff;
              display: none;
            }
            .list-fourth-top {
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-right: 24px;
              position: relative;
              .expand-logo {
                width: 16px;
                height: 16px;
                position: absolute;
                top: 8px;
                left: -20px;
                background-image: url('../../assets/logo/defalut-expand-logo.png');
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                cursor: pointer;
                &.down {
                  transform: rotate(0deg);
                }
                &.up {
                  transform: rotate(90deg);
                }
              }
            }
            .fifth-items-list-wrap {
              padding-left: 12px;
              display: none;

              .fifth-items-list {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #bdbdbd;
                line-height: 32px;
                position: relative;
                &.active,
                &:hover {
                  color: #36a4ff;
                  cursor: pointer;
                }
                &:hover {
                  .right-node {
                    display: block;
                  }
                  .right-node:hover .tree-tooltip {
                    display: block;
                  }
                }
                .right-node {
                  position: absolute;
                  right: 16px;
                  top: 0px;
                  color: #36a4ff;
                  display: none;
                }
              }

              &.show {
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
</style>
