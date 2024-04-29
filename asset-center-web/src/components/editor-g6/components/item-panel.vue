<!--
* @Description：编辑器左边组件面板
* @Author：zhang sen
* @Date：2020-08-31
-->
<template>
  <div
    class="editor-item-panel"
    :style="{'height': height + 'px'}"
  >
    <div class="panel-btns">
      <div
        v-if="bizType === 'base'"
        :class="{'btn-selected': btnSelected === 0}"
        class="btn"
        @click="checkBtnSelected(0)"
      >
        <span>对</span><span>象</span><span>资</span><span>产</span>
      </div>
      <div
        v-if="bizType === 'judge'"
        :class="{'btn-selected': btnSelected === 1}"
        class="btn"
        @click="checkBtnSelected(1)"
      >
        <span>基</span><span>础</span><span>模</span><span>型</span><span>组</span><span>件</span>
      </div>
      <div
        v-if="bizType === 'judge'"
        :class="{'btn-selected': btnSelected === 2}"
        class="btn"
        @click="checkBtnSelected(2)"
      >
        <span>模</span><span>型</span><span>资</span><span>产</span>
      </div>
      <div
        :class="{'btn-selected': btnSelected === 3}"
        class="btn"
        @click="checkBtnSelected(3)"
      >
        <span>运</span><span>算</span><span>组</span><span>件</span>
      </div>
      <div
        :class="{'btn-selected': btnSelected === 5}"
        class="btn"
        @click="checkBtnSelected(5)"
      >
        <span>算</span><span>法</span><span>资</span><span>产</span>
      </div>
      <div
        :class="{'btn-selected': btnSelected === 4}"
        class="btn"
        @click="checkBtnSelected(4)"
      >
        <span>通</span><span>用</span><span>组</span><span>件</span>
      </div>
    </div>
    <c-scrollbar
      class="tree-box"
      wrap-class="scrollbar-wrapper"
    >
      <div v-show="btnSelected===1" class="cls-basic-btn">
        <c-button size="small" type="ordinary" @click="handleEditBasicModel">基础模型维护</c-button>
      </div>
      <div class="cls-main-data">
        <c-tree
          v-if="(btnSelected === 0 || btnSelected === 1 || btnSelected === 2) && treeData"
          class="tree-wrapper"
          :data="treeData"
          :props="defaultProps"
          @node-expand="handleNodeClick"
        >
          <div
            slot-scope="{ data }"
            class="special-tree-node tree-laber-wrapper"
            :class="{'node-can-drag': getTreeDraggableItem(data)}"
            :draggable="getTreeDraggableItem(data)"
            :data-item="getEditorNodeModel(data)"
            data-drag-flag="false"
          >
            <img
              v-if="data.type === 0"
              src="../assets/icons/special-icon.svg"
              class="tree-node-icon"
              alt="special"
            >
            <text-over-tooltip
              class="tree-laber"
              :placement="'right'"
              :content="data.name "
            />
          </div>
        </c-tree>
        <div
          v-show="btnSelected === 3"
          class="items"
        >
          <div
            v-for="item in operationArr"
            :key="item.type"
            class="c-tree-node__content"
          >
            <span :class="`operate-icon ${item.icon} custom-operate-icon`" />
            <c-tooltip
              :content="item.tips"
              placement="right"
            >
              <span
                data-drag-flag="false"
                class="special-tree-node"
                :data-item="getEditorOperationNodeModel(item)"
                :class="{'node-can-drag': !locked}"
                :draggable="!locked"
              > {{ item.label }} </span>
            </c-tooltip>
          </div>
        </div>
        <div
          v-show="btnSelected === 5"
          class="items"
        >
          <div
            v-for="item in algoArr"
            :key="item.id"
            class="c-tree-node__content"
          >
            <span class="operate-icon operate-icon-arithmetic custom-operate-icon" />
            <c-tooltip
              v-if="item.assetDesc"
              :content="item.assetDesc"
              placement="right"
            >
              <span
                data-drag-flag="false"
                class="special-tree-node tree-node-item"
                :data-item="getEditorAlgoNodeModel(item)"
                :class="{'node-can-drag': !locked}"
                :draggable="!locked"
              > {{ item.assetName }} </span>
            </c-tooltip>
            <span
              v-else
              data-drag-flag="false"
              class="special-tree-node tree-node-item"
              :data-item="getEditorAlgoNodeModel(item)"
              :class="{'node-can-drag': !locked}"
              :draggable="!locked"
            > {{ item.assetName }} </span>
          </div>
        </div>
        <div
          v-show="btnSelected === 4"
          class="items"
        >
          <div
            v-for="item in commonArr"
            :key="item.type"
            class="c-tree-node__content"
          >
            <span class="expanded c-tree-node__expand-icon c-icon-price-tag" />
            <span
              data-drag-flag="false"
              class="special-tree-node"
              :data-item="getEditorEndNodeModel()"
              :class="{'node-can-drag': !locked}"
              :draggable="!locked"
            > {{ item.label }} </span>
          </div>
        </div>
      </div>
    </c-scrollbar>
  </div>
</template>

<script>
import {
  getModelDataTree,
  getBasicModelTree,
  fetchAlgoListNopage,
  getJudgeModelTree
} from '@/api/editor-g6';
import textOverTooltip from '@l/components/text-over-tooltip'
export default {
  inject: ['i18n'],
  components: {
    textOverTooltip
  },
  props: {
    height: {
      type: Number,
      default: 800
    },
    bizType: {
      type: String, // base: 基础模型   // judge 研判模型
      default: 'judge'
    },
    disableTreeNodes: {
      type: Array,
      default() {
        return []
      }
    },
    locked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      btnSelected: 1,
      operationArr: [
        {
          nodeType: 4,
          label: '统计',
          type: 'operator_statistics',
          icon: 'operate-icon-statistics',
          tips: '根据选择的字段进行计数、去重计数、求和、平均值、中位数、最大值、最小值的统计，中位数、求和和平均值只支持数值型字段，最大最小值支持数值和日期型字段，只支持单一数据源输入'
        },
        {
          nodeType: 4,
          label: '过滤',
          type: 'operator_filter',
          icon: 'operate-icon-filter',
          tips: '支持根据关键字模糊匹配及指定位置匹配、数字范围匹配、时间范围匹配的过滤模式，只支持单一数据源输入'
        },
        {
          nodeType: 4,
          label: '交集',
          type: 'operator_inter',
          icon: 'operate-icon-inter',
          tips: '根据设置的字段求得两个输入源的相交的部分，交集需要设置两个数据源输入'
        },
        {
          nodeType: 4,
          label: '并集',
          type: 'operator_union',
          icon: 'operate-icon-union',
          tips: '根据设置的字段求得两个输入源的合并，并集需要设置两个数据源输入'
        },
        {
          nodeType: 4,
          label: '计算公式',
          type: 'operator_math',
          icon: 'operate-icon-math',
          tips: '提供字段间的四则运算，目前只支持数值型的字段计算，只支持单一数据源输入'
        },
        {
          nodeType: 4,
          label: '差集',
          type: 'operator_diff',
          icon: 'operate-icon-diff',
          tips: '计算属于主表但不属于子表的元素，需要设置两个数据源输入'
        },
        {
          nodeType: 4,
          label: '去重',
          type: 'operator_distinct',
          icon: 'operate-icon-distinct',
          tips: '针对选择的字段进行去重计算，只支持单一数据源输入'
        },
        {
          nodeType: 4,
          label: '字段处理',
          type: 'operator_concat',
          icon: 'operate-icon-concat',
          tips: '对指定的两个字段进行内容的拼接，只能设置单一数据源输入'
        },
        {
          nodeType: 4,
          label: 'Top值筛选',
          type: 'operator_top',
          icon: 'operate-icon-top',
          tips: '对指定字段进行TOP值的筛选，支持正序和倒序排列，只能设置单一数据源输入'
        },
        {
          nodeType: 4,
          label: '补集',
          type: 'operator_complement',
          icon: 'operate-icon-complement',
          tips: '计算主表中不属于子表的元素，需要设置两个数据源输入'
        },
        {
          nodeType: 4,
          label: '自定义',
          type: 'operator_customize',
          icon: 'operate-icon-customize',
          tips: '通过自定义sql语句实现对输入源的运算，需要设置大于等于一个的数据源输入'
        }
      ],
      commonArr: [
        {
          nodeType: 5,
          label: '输出结果',
          type: 'output'
        }
      ],
      treeData: null,
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      algoArr: []
    };
  },
  created() {
    this.btnSelected = this.bizType === 'judge' ? 1 : 0
    this.fetchTreeData();
  },
  methods: {
    handleEditBasicModel() {
      // 点击基础模型维护按钮
      this.$emit('handleEditBasicModel')
    },
    getTreeDraggableItem(data) {
      return !this.locked && data.type !== 0 && this.disableTreeNodes.indexOf(parseInt(data.id)) === -1;
    },
    // 获取算法组件节点模型
    getEditorAlgoNodeModel(itemInfo) {
      return `{
          clazz:'algo',
          size:'160*48',
          label:'${itemInfo.assetName}',
          data: {
            "modelId": ${parseFloat(itemInfo.id)},
            "nodeType": 6,
            "remark": "",
            "output": [],
            "orgdata": {}
          },
        }`
    },
    // 获取逻辑组件节点模型
    getEditorOperationNodeModel(itemInfo) {
      return `{
          clazz:'operation',
          size:'160*48',
          label:'${itemInfo.label}',
          data: {
            "nodeType": 4,
            "remark": "",
            "output": []
          }
        }`
    },
    // 获取通用组件节点模型
    getEditorEndNodeModel() {
      const item = {
        clazz: 'end',
        size: '160*48',
        label: '输出结果',
        data: {
          'nodeType': 5,
          'remark': '', // 备注,
          'output': []
          // "biz": {}
        }
      }
      return JSON.stringify(item)
    },
    // 获取模型组件节点模型
    getEditorNodeModel(itemInfo) {
      const item = {
        clazz: 'input',
        size: '160*48',
        label: itemInfo.name,
        data: {
          nodeType: this.btnSelected + 1,
          'modelId': parseInt(itemInfo.id), // 模型id，节点类型=【研判模型、基础模型、模型数据】
          'output': [],
          'remark': '' // 备注
          // biz: itemInfo
        }
      }
      return JSON.stringify(item)
    },
    checkBtnSelected(info) {
      if (this.btnSelected === info) return;
      this.btnSelected = info;
      this.treeData = null;
      this.$nextTick(() => {
        this.fetchTreeData();
      })
    },
    fetchTreeData() {
      if (this.btnSelected === 0) {
        getModelDataTree().then(res => {
          if (res.code === 0) {
            this.treeData = res.data.map(d => ({ ...d, name: d.assetName }))
            this.$nextTick(() => {
              this.doEmitEvent();
            })
          }
        });
      } else if (this.btnSelected === 1) {
        getBasicModelTree().then(res => {
          if (res.code === 0) {
            this.treeData = res.data
            this.$nextTick(() => {
              this.doEmitEvent();
            })
          }
        });
      } else if (this.btnSelected === 2) {
        getJudgeModelTree().then(res => {
          if (res.code === 0) {
            this.treeData = res.data.map(d => ({ ...d, name: d.assetName }))
            this.$nextTick(() => {
              this.doEmitEvent();
            })
          }
        });
      } else if (+this.btnSelected === 5) {
        fetchAlgoListNopage({}).then(res => {
          this.algoArr = res.data
          this.$nextTick(() => {
            this.doEmitEvent();
          })
        })
      }
    },
    handleNodeClick() {
      this.doEmitEvent();
    },
    doEmitEvent() {
      this.$nextTick(() => {
        this.$emit('handleNodeClick');
      })
    }
  }
}
</script>

<style lang="scss" >
@import '@/styles/variables.scss';
.custom-operate-icon {
  margin: 0 6px;
  width: 12px !important;
  height: 12px !important;
  background-size: 100% 100% !important;
}
.editor-item-panel {
  position: relative;
  box-sizing: border-box;
  padding: 8px 0 8px 49px;
  background: #fff;
  user-select: none;
  .items {
    padding-right: 16px;
  }
  .panel-btns {
    position: absolute;
    left: 0;
    top: -1px;
    border-right: 1px solid #d9d9d9;
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 48px;
      min-height: 130px;
      padding: 10px 0;
      box-sizing: border-box;
      font-size: 14px;
      color: rgba(155, 155, 155, 1);
      border-bottom: 1px solid #d9d9d9;
      text-align: center;
      cursor: pointer;
      span {
        display: inline-block;
        margin-bottom: 5px;
      }
    }
    .btn-selected {
      font-weight: 600;
      color: $primaryColor;
      background-color: $hoverColor;
      // color: rgba(92, 101, 141, 1);
      // background: rgba(92, 101, 141, 0.2);
    }
  }
  .c-tree-node__content {
    height: 40px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(64, 64, 64, 1);
    line-height: 20px;
    &:active,
    &:hover,
    &:visited {
      background-color: #F2F3F8;
      color: $primaryColor;
    }
    &:active,
    &:visited {
      background-color: #F2F3F8;
      color: $primaryColor;
      .tree-node-item {
        color: rgba(92, 101, 141, 1);
      }
    }
    .is-leaf{
      width: 16px;
    }
  }
  .c-tree-node.is-current > .c-tree-node__content {
    .tree-node-item {
      color: rgba(92, 101, 141, 1);
    }
  }
  .tree-box {
    height: 100%;
    .tree-wrapper {
      padding-right: 16px;
    }
    .c-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  .tree-node-item {
    display: inline-block;
    width: calc(100% - 12px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

  }
  .node-can-drag {
    cursor: move;
  }
  .tree-laber-wrapper {
    width: calc(100% - 24px);
    .tree-node-icon {
      display: inline-block;
      margin-right: 2px;
      padding-bottom: 3px;
      width: 14px;
    }
    .tree-laber {
      display: inline-block;
      width: 100%;
    }
  }
}
.cls-basic-btn{
  padding-right: 22px;
  height: 50px;
  line-height: 40px;
  border-bottom: 1px solid #EDEDED;
  text-align: right;
}
.cls-main-data{
  padding-left: 12px;
}
</style>

