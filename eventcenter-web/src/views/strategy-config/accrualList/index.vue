<template>
  <div class="page-wrapper">
    <div class="search-tree">
      <!-- 需要添加内部滚动 -->
      <div class="title">事项类型目录</div>
      <cestc-tree
        ref="qzTree"
        :data="eventTypeToTree"
        check-strictly
        :props="treeProps"
        icon-class-fold="el-icon-caret-right"
        icon-class-unfold="el-icon-caret-bottom"
        :default-expanded-keys="defaultExpandedkeys"
        @handleNodeClick="handleNodeClick"
      />
    </div>
    <div class="result-content">
      <div class="action">
        <el-button
          class="add-btn common-action-btn"
          icon="custom-export common-icon"
          @click.stop="handleExport"
        >导出数据</el-button>
      </div>
      <el-table
        ref="tableRef"
        :data="dataList"
        style="width: 100%"
        height="calc(100% - 52px)"
      >
        <el-table-column
          type="index"
          width="55"
          :index="indexMethod"
          class-name="table-column-index"
        />
        <template v-for="(item, index) in tableColumn">
          <el-table-column
            :key="index"
            :label="item.label"
            :prop="item.prop"
            :min-width="item.minWidth"
            show-overflow-tooltip
            :formatter="_formatter"
          />
        </template>
        <el-table-column width="210" align="left" header-align="left">
          <template #header>
            <span>操作</span>
          </template>
          <template v-slot="{row}">
            <span class="action-group">
              <span
                :class="['action-btn', {'is-disabled': row.state === 2}]"
                @click="_action('set', row)"
              >设置权责</span>
              <span v-if="[1,2].includes(row.state)" class="action-divider">|</span>
              <template v-if="row.state === 1">
                <span
                  class="action-btn"
                  @click="_action('on', row)"
                >启用</span>
                <span class="action-divider">|</span>
                <span
                  class="action-btn"
                  @click="_action('del', row)"
                >清空权责</span>
              </template>
              <template v-if="row.state === 2">
                <span
                  class="action-btn"
                  @click="_action('off', row)"
                >停用</span>
                <span class="action-divider">|</span>
                <span
                  class="action-btn"
                  @click="_action('view', row)"
                >查看权责</span>
              </template>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 设置权限清单 -->
    <!-- 编辑 -->
    <edit-dialog
      :visible.sync="dialogVisible"
      :mode="dialogMode"
      :dialog-data="dialogData"
      :event-type-name="eventTypeName"
      @flash="_search"
    />
  </div>
</template>

<script>
import editDialog from './editDialog'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE, EVENTTYPEDUTYSTATE } from '@/constants'
import { mapActions } from 'vuex'

export default {
  name: 'AccrualList',
  components: {
    editDialog
  },
  data() {
    return {
      form: {
        eventTypeId: ''
      }, // 检索条件表单
      dataList: [],
      tableColumn: [
        {
          prop: 'eventTypeName',
          label: '事件类型名称'
        },
        {
          prop: 'eventTypeCode',
          label: '事件类型编码'
        },
        {
          prop: 'stateText',
          label: '权责状态'
        },
        {
          prop: 'busiTypeName',
          label: '业务分类'
        },
        {
          prop: 'eventLevelText',
          label: '处置级别'
        },
        {
          prop: 'masterDutyDeptCodeName',
          label: '主处置部门'
        },
        {
          prop: 'slaveDutyDeptCodeName',
          label: '从处置部门'
        }
      ],
      treeProps: {
        label: 'name',
        children: 'childList'
      },
      dialogVisible: false,
      dialogData: null,
      dialogMode: 'set',
      eventTypeName: { // 大类、中类名称缓存
        'eventLarge': '',
        'eventMiddle': ''
      },
      defaultExpandedkeys: []
    }
  },
  computed: {
    EVENTTYPEDUTYSTATEMap() {
      const map = new Map()
      EVENTTYPEDUTYSTATE.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    orgTypeOptionsMap() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      const orgType = this.$store.getters.getBsDictsByType('org_type')
      const map = new Map()
      orgType.forEach((item) => {
        map.set(item.dictValue, item.dictDesc)
      })
      return map
    },
    speType() {
      return this.$route.query.speType || ''
    },
    eventTypeToTree() {
      if ((this.speType && this.speType !== 'all')) {
        return this.$store.getters.getAllEventTypesBySpe(this.speType, true)
      }
      return this.$store.getters.getAllEventTypesBySpe('', true)
    }
  },
  created() {
    this.getEventType({ busiType: '', dispatchDeal: 0 })
  },
  beforeDestroy() {
    this.getEventType()
  },
  activated() {
    if (this.form.eventTypeId) {
      this.defaultExpandedkeys = [this.form.eventTypeId]
      this._search()
    }
  },
  methods: {
    ...mapActions('dispatch', ['getEventType']),
    handleNodeClick(data, node) {
      const { level = 1 } = node
      if (level === 2) {
        // 把树结构的节点名称保存，用于事件大类、事件小类的显示
        this.eventTypeName.eventMiddle = data.name
        this.eventTypeName.eventLarge = node.parent.data.name
        // 加载三级列表
        this.form.eventTypeId = data.id
        this._search()
      }
    },
    // 获取列表
    _search() {
      const params = { ...this.form }
      if (this.speType && this.speType !== 'all') params.speType = this.speType
      moduleSrv.getEventTypeDutyList(params).then(res => {
        if (res.code === SUCCESS_CODE) {
          this.dataList = res.data || []
        }
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    _action(action, row) {
      switch (action) {
        case 'set':
        case 'view':
          if (row.busiType === '1') {
            this.dialogVisible = true
            this.dialogMode = action
            this.dialogData = row
          } else {
            this.$router.push({ path: '/strategy-config/accrual-set', query: { ...this.eventTypeName, eventTypeName: row.eventTypeName, eventTypeId: row.eventTypeId, mode: action }})
          }
          break
        case 'on':
          this.updateStateDuty(action, row)
          break
        case 'off':
          this.updateStateDuty(action, row)
          break
        case 'del':
          this._del(row)
          break

        default:
          break
      }
    },
    _del(row) {
      this.$confirm('确定要清空权责吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.eventTypeId
        }
        moduleSrv.deleteEventTypeDuty(params).then(res => {
          if (res.code === SUCCESS_CODE) {
            this.$message.success(res.message)
            this._search()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        console.log('取消操作')
      })
    },
    // 状态更新
    updateStateDuty(action, row) {
      let tips = '确定要启用该事件类型吗？'
      let state = 2
      if (action === 'off') {
        tips = '确定要停用该事件类型吗？'
        state = 1
      }
      this.$confirm(tips, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const params = {
          id: row.eventTypeId,
          state
        }
        moduleSrv.updateStateDuty(params).then(res => {
          if (res.code === SUCCESS_CODE) {
            this.$message.success(res.message)
            this._search()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
        console.log('取消操作')
      })
    },
    async handleExport() {
      const serviceRes = await moduleSrv.getDutiesExcelExport({}, { responseType: 'blob' })
      const fileName = decodeURI(serviceRes.headers['content-disposition'].split(';')[1].split('=')[1])
      const url = window.URL.createObjectURL(new Blob([serviceRes.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      link = null
    },
    // 表格内容格式化
    _formatter(row, column, cellValue) {
      if (column.property === 'stateText') {
        return this.EVENTTYPEDUTYSTATEMap.get(row.state) || '-'
      }
      if (column.property === 'eventLevelText') {
        return this.orgTypeOptionsMap.get(row.eventLevel) || '-'
      }
      return cellValue || '-'
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  display: flex;
    .search-tree {
      flex: 0 0 272px;
      width: 272px;
      margin-right: 20px;
      background-color: $white;
      .title {
        padding-left: 20px;
        font-size: 14px;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
      }
      .cestc-tree {
        padding-top: 0;
        height: calc(100% - 64px);
        ::v-deep {
          .el-tree {
            max-height: calc(100% - 52px);
            overflow-y: auto;
          }
        }
      }
    }
    .result-content {
      flex: 1;
      width: calc(100% - 292px);
      overflow-y: auto;
      padding: 0 20px;
      background-color: $white;
      .action {
        display: flex;
        height: 64px;
        align-items: center;
        .el-button {
          margin-left: auto;
        }
      }
    }
  }

</style>
