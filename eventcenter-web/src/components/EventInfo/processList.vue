<template>
  <div class="event-process-list">
    <common-title title="处理过程" />
    <div class="content mb24 mt22">
      <el-table :data="processList" style="width: 100%" :cell-class-name="cellClassName" tooltip-effect="light">
        <el-table-column
          type="index"
          width="55"
          :index="indexMethod"
          class-name="table-column-index"
        />
        <template v-for="(item, index) in columns">
          <el-table-column
            v-if="item.prop === 'expand'"
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            show-overflow-tooltip
            type="expand"
          >
            <template v-slot="{ row }">
              <el-table :data="formatRowTable(row)" style="width: 100%">
                <el-table-column prop="schedulType" label="调度类型" />
                <el-table-column prop="deptName" label="调度组织" />
                <el-table-column prop="roleName" label="调度角色" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
            show-overflow-tooltip
          />
        </template>
      </el-table>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ProcessList',
  props: {
    processList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      hasMsg: false,
      tableColumn: [
        {
          prop: 'activityName',
          label: '阶段',
          visible: true
        },
        {
          prop: 'startTime',
          label: '开始时间',
          visible: true
        },
        {
          prop: 'endTime',
          label: '结束时间',
          visible: true
        },
        {
          prop: 'roleName',
          label: '经办人角色',
          visible: true,
          width: 150
        },
        {
          prop: 'expand',
          label: '',
          visible: true,
          width: 120
        },
        {
          prop: 'userName',
          label: '经办人',
          visible: true
        },
        {
          prop: 'action',
          label: '操作动作',
          visible: true
        },
        {
          prop: 'comment',
          label: '处理意见',
          visible: true,
          width: 180
        }
      ]
    }
  },
  computed: {
    columns() {
      return this.tableColumn.filter((item) => item.visible)
    }
  },
  watch: {
    processList: {
      handler(nVal) {
        nVal.forEach((item) => {
          if (item.flowsList?.length || item.notifyList?.length) {
            item.expand = '调度信息'
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    toogleExpand(row) {
      const $table = this.$refs.table
      $table.toggleRowExpansion(row)
    },

    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5) {
        if (this.formatRowTable(row).length > 0) {
          return 'showMsgColumn'
        } else {
          return 'noMsgColumn'
        }
      }
    },

    // 格式化面板数据
    formatRowTable(row) {
      const flowsList =
        row.flowsList?.map((item) => {
          return {
            ...item,
            schedulType: '协办'
          }
        }) || []
      const notifyList =
        row.notifyList?.map((item) => {
          return {
            ...item,
            schedulType: '知会'
          }
        }) || []
      const list = [...flowsList, ...notifyList]
      if (list.length) {
        this.hasMsg = true
      } else {
        this.hasMsg = false
      }
      return list
    }
  }
}
</script>
<style lang="scss" scoped>
.event-process-list {
  ::v-deep {
    .el-table__body-wrapper {
      .noMsgColumn .cell {
        display: none;
      }
      .el-table__body {
        tr {
          .el-table__expanded-cell {
            padding-top: 6px;
            padding-left: 60px;
          }
        }
      }

      .showMsgColumn {
        .cell {
          display: flex;
          align-items: center;
          line-height: 20px;
          cursor: pointer;
          &:before {
            content: "调度信息";
            background: rgba(54, 164, 255, 0.2);
            border-radius: 2px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333;
          }
          .el-table__expand-icon {
            transform: rotate(-90deg) !important;
            position: absolute;
            height: 65px;
            width: 23px;
            left: 30px;
            .el-icon {
              transform: rotate(-180deg) !important;
              position: static;
              position: absolute;
              left: 6px;
              top: 65px;
              margin: 0;
              &:before {
                content: "" !important;
                color: #36a4ff;
                font-weight: 700;
              }
            }
          }
          .el-table__expand-icon--expanded {
            .el-icon {
              transform: rotate(0) !important;
              padding: 0;
            }
          }
        }
      }
    }
  }
}
</style>
