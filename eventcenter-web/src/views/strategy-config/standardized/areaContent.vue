<template>
  <div
    ref="commonList"
    class="page-container"
  >
    <div class="page-content">
      <div
        class="bottom"
        :style="{ height: contentHeight }"
      >
        <div class="bottom-left">
          <el-scrollbar style="height: 100%">
            <cestc-tree
              ref="areaTreeRef"
              :data="areaTree"
              check-strictly
              :props="treeProps"
              :node-key="'code'"
              icon-class-fold="el-icon-caret-right"
              icon-class-unfold="el-icon-caret-bottom"
              @handleNodeClick="handleNodeClick"
            />
          </el-scrollbar>
        </div>
        <div class="bottom-right">
          <div class="area-msg">
            <div class="left-msg">
              <div class="msg-start">
                <img
                  class="msg-icon"
                  src="@/assets/strategyConfig/pos_start.png"
                  alt=""
                >
              </div>
              <span>{{ areaPath }}</span>
            </div>
            <div
              v-if="currentArea.level === 0"
              class="right-msg"
            >
              <div class="area-text">
                <span class="label">国家全称</span>
                <span class="text">中华人民共和国</span>
              </div>
            </div>
            <div
              v-else
              class="right-msg"
            >
              <div
                v-if="currentArea.level === 1"
                class="area-text"
              >
                <span class="label">省份简称</span>
                <span class="text">{{ currentArea.shortName|| '--' }}</span>
              </div>
              <div class="area-text">
                <span class="label">{{ areaLabelMap.get(currentArea.level).label }}</span>
                <span class="text">{{ currentArea.name }}</span>
              </div>
              <div class="area-text">
                <span class="label">行政区划代码</span>
                <span class="text">{{ currentArea.code }}</span>
              </div>
            </div>
          </div>
          <el-table
            :data="tableData"
            style="width: 100%;margin-bottom: 20px;"
            row-key="id"
            :height="tableHeight"
            border
          >
            <!-- <el-table-column
              type="index"
              width="50"
            /> -->
            <el-table-column
              v-for="item in tableColMap.get(currentArea.level)"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import search from './search'
import searchMixin from '@/mixin/searchMixin'
import moduleSrvWhh from '@/api/dispatchWhh'
import { SUCCESS_CODE, PROVINCE_SHORT_MAPPING_DATA } from '@/constants'

export default {
  name: 'AreaCode',
  components: {
    // search
  },
  mixins: [searchMixin],
  props: {},
  data() {
    return {
      contentHeight: '100%',
      treeProps: {
        value: 'code',
        label: 'name'
      },
      currentArea: {
        name: '',
        shortName: '',
        code: '',
        provinceCode: '',
        path: '',
        level: 0
      },
      areaLabelMap: new Map([
        [0, {
          label: '国家'
        }],
        [1, {
          label: '省份全称'
        }],
        [2, {
          label: '城市'
        }],
        [3, {
          label: '区县'
        }],
        [4, {
          label: '乡镇街道'
        }],
        [5, {
          label: '村/社区'
        }]
      ]),
      areaTree: [
        {
          code: 0,
          haveChild: true,
          level: 0,
          name: '中国',
          pcode: null,
          provinceCode: 0,
          children: []
        }
      ],
      childAreaList: [],
      pathList: [],
      areaPath: '中国',
      tableColMap: new Map([
        [0, [{
          prop: 'name',
          label: '省份全称'
        }, {
          prop: 'shortName',
          label: '省份简称'
        }, {
          prop: 'code',
          label: '行政区划代码'
        }
        // {
        //   prop: 'parentName',
        //   label: '所属国家'
        // },
        // {
        //   prop: 'count',
        //   label: '城市数量'
        // }
        ]],
        [1, [{
          prop: 'name',
          label: '城市'
        }, {
          prop: 'code',
          label: '行政区划代码'
        }
        // {
        //   prop: 'parentName',
        //   label: '所属省份'
        // },
        // {
        //   prop: 'count',
        //   label: '区县数量'
        // }
        ]],
        [2, [{
          prop: 'name',
          label: '区县'
        }, {
          prop: 'code',
          label: '行政区划代码'
        }
        // {
        //   prop: 'parentName',
        //   label: '所属城市'
        // },
        // {
        //   prop: 'count',
        //   label: '乡镇街道数量'
        // }
        ]],
        [3, [{
          prop: 'name',
          label: '乡镇街道'
        }, {
          prop: 'code',
          label: '行政区划代码'
        }
        // {
        //   prop: 'parentName',
        //   label: '所属区县'
        // },
        // {
        //   prop: 'count',
        //   label: '村/社区数量'
        // }
        ]],
        [4, [{
          prop: 'name',
          label: '村/社区'
        }, {
          prop: 'code',
          label: '行政区划代码'
        }
        // {
        //   prop: 'parentName',
        //   label: '所属乡镇街道'
        // },
        // {
        //   prop: 'count',
        //   label: '村/社区数量'
        // }
        ]]
      ]),
      tableData: [],
      tableHeight: 'calc(100% - 101px)'
    }
  },
  mounted() {
    this.getAreaTree(0)
  },
  methods: {
    getAreaTree(pcode) {
      moduleSrvWhh.getAreaChildrenList({
        pcode
      }
      ).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.areaTree[0].children = res.data
          this.handleNodeClick(this.areaTree[0], this.areaTree[0])
        }
      })
    },
    getChildrenList(data) {
      moduleSrvWhh.getAreaChildrenList(
        {
          pcode: this.currentArea.code
        }
      ).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.childAreaList = res.data
          this.setTableColumnAndData(res.data)
          if (data.children) return
          this.$refs.areaTreeRef.$refs.tree.updateKeyChildren(data.code, this.childAreaList)
        }
      })
    },
    handleNodeClick(data, node) {
      console.log(data, node, 210000)
      this.pathList = []
      this.currentArea = data
      if (data.level === 1) {
        this.currentArea.shortName = PROVINCE_SHORT_MAPPING_DATA.get(data.name)?.shortName || '--'
      }
      this.createNodePath(node)
      this.areaPath = this.pathList.length ? this.pathList.reverse().join('/') : '中国'
      this.getChildrenList(data)
    },
    createNodePath(node) {
      if (node?.parent) {
        this.pathList.push(node.data.name)
        this.createNodePath(node.parent)
      }
    },
    setTableColumnAndData(data) {
      this.tableData = data.map(e => {
        return {
          parentName: this.areaPath,
          shortName: PROVINCE_SHORT_MAPPING_DATA.get(e.name)?.shortName || '--',
          count: e?.count || '--',
          ...e
        }
      })
    },
    calcHeight() {
      this.$nextTick(() => {
        const sheight = this.$refs.searchRef.offsetHeight // 搜索栏的高度
        let contentHeight = this.$refs.commonList.offsetHeight
        if (sheight) {
          contentHeight = contentHeight - sheight - 18
        }
        // 设置给一个最小高度
        this.contentHeight = contentHeight > 100 ? `${contentHeight}px` : '100px'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100%;

  .top {
    width: 100%;
    min-height: 72px;
    background: #ffffff;
    border-top: 1px solid #36a4ff;
  }

  .bottom {
    display: flex;
    height: 100%;

    .bottom-left {
      width: 272px;
      height: inherit;
      background: #ffffff;
      height: 100%;
      ::v-deep {
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }

    .bottom-right {
      border-left: 1px solid #e4e9f0;
      flex: 1;
      background: #ffffff;
      height: inherit;
      padding: 20px;
      .area-msg {
        padding-right: 20px;
        margin-bottom: 20px;
        width: 100%;
        height: 81px;
        background: #f9fafe;
        border-radius: 2px;
        display: flex;
        font-size: 16px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 500;
        color: #4b4b4b;
        align-items: center;
        justify-content: space-between;
        .left-msg {
          display: flex;
          align-items: center;
          .msg-start {
            margin: 16px;
            width: 48px;
            height: 47px;
            background: #ebf9ff;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            .msg-icon {
              width: 25px;
              height: 23px;
            }
          }
        }
        .right-msg {
          display: flex;
          .area-text {
            margin-left: 27px;
            .label {
              margin-right: 8px;
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #8a8a8a;
            }
            .text {
              font-size: 14px;
              font-family: PingFangSC, PingFang SC;
              font-weight: 400;
              color: #4b4b4b;
            }
          }
        }
      }
    }
  }
  ::v-deep {
    .el-tree-node__expand-icon {
      font-size: 16px;
    }
    .el-tree-node__expand-icon.expanded:before {
      color: #000;
    }
    .el-table__body-wrapper {
      &::-webkit-scrollbar {
        width: 0;
        background: rgba(213, 215, 220, 0.3);
        border: 0 none;
      }
      &::-webkit-scrollbar-track {
        border: 0 none;
      }
    }
    .el-table th.gutter {
      display: none;
      width: 0;
    }
    .el-table colgroup col[name="gutter"] {
      display: none;
      width: 0;
    }
    .el-table__body {
      width: 100% !important;
    }
    .el-table--border {
      border-color: transparent;
    }
    .el-table td, .el-table--border td {
      border-color: $greyDivision;
      border-right-color: $greyDivision;
      border-bottom-color: $greyDivision;
    }
    .el-table tr td:nth-of-type(1) {
      border-left: 1px solid $greyDivision;
    }
    .el-table--border th {
      border-color: $greyDivision;
      border-bottom: 1px solid $greyDivision;
      border-top: 1px solid $greyDivision;
      &:nth-of-type(1) {
        border-left: 1px solid $greyDivision;
      }
    }
    .el-table__body tr:hover>td  {
      background-color: $columnHover;
    }

    .el-table--border th.gutter:last-of-type {
      border-top: 0 none;
      border-bottom: 0 none;
      background: #fff;
    }
    .el-table::before {
      height: 0px;
    }
  }
}
</style>
