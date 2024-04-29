<!--/*
* @Author: dingli
* @Desc: 运营规则配置
* @Date:
*/-->
<template>
  <div class="page-wrap">
    <!--内容区-->
    <div
      ref="page-content"
      class="page-content"
    >
      <search-items class="">
        <template v-slot:content-header_right>
          <c-button type="primary" @click="clickAdd"><i class="c-icon-plus"></i> 新增自定义规则</c-button>
        </template>
      </search-items>
      <c-table :data="dataList" :height="tableHeight">
        <c-table-column label="#" type="index" width="60">
          <template slot-scope="scope">
            <span class="table-index">{{
              (page.pageNum - 1) * page.pageSize + scope.$index + 1
            }}</span>
          </template>
        </c-table-column>
        <c-table-column
          prop="ruleType"
          label="配置类型"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ RULE_TYPE[scope.row.ruleType] || '--' }}
          </template>
        </c-table-column>
        <c-table-column
          prop="showContent"
          label="展示内容"
          show-overflow-tooltip
        />
        <c-table-column
          prop="ruleStatus"
          label="生效状态"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ RULE_STATUS[scope.row.ruleStatus] || '--' }}
          </template>
        </c-table-column>
        <c-table-column
          prop="ruleOrder"
          label="规则优先级"
          show-overflow-tooltip
        />
        <c-table-column
          prop="objectCount"
          label="生效目标数量"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <c-button type="text" underline @click="clickObjectCount(scope.row)">{{ scope.row.objectCount }}</c-button>
          </template>
        </c-table-column>
        <c-table-column
          prop="validTime"
          label="生效时间"
          width="170px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.validTime || '--' }}
          </template>
        </c-table-column>
        <c-table-column
          prop="invalidTime"
          label="失效时间"
          width="170px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.invalidTime || '--' }}
          </template>
        </c-table-column>
        <c-table-column
          label="操作"
          fixed="right"
          width="150"
        >
          <template slot-scope="scope">
            <btn-group
              :btns="getbtns(scope.row)"
              @handleClick="handleOperateClick"
            />
          </template>
        </c-table-column>
      </c-table>
    </div>
    <div class="list-page-footer">
      <c-pagination
        background
        :current-page="page.pageNum"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        class="size-left"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <object-dialog :visible="objectDialogVisible" :data="selectedData" @close="objectDialogClose" />
    <enable-dialog :visible="enableDialogVisible" :type="enableDialogType" :data="selectedData" @close="enableDialogClose" @ok="enableDialogOk" />
    <add-dialog :visible="addDialogVisible" :type="addDialogType" :data="selectedData" @close="addDialogClose" @ok="addDialogOk" />
  </div>
</template>
<script>
import myMixin from '@/mixin/list-page-cache-mixin.js'
import searchItems from '@/components/search-items'
import { operationRuleList, deleteOperationRule } from '@/api/operate-rule'
import ObjectDialog from './components/object-dialog.vue'
import EnableDialog from './components/enable-dialog.vue'
import AddDialog from './components/add-dialog.vue'

export default {
  name: '',
  components: { searchItems, ObjectDialog, EnableDialog, AddDialog },
  filters: {},
  mixins: [myMixin],
  data() {
    return {
      searchTags: [], // 搜索标签
      contentHight: 'auto', // 内容区高度
      totalInfoSearch: false,
      objectDialogVisible: false,
      enableDialogVisible: false,
      addDialogVisible: false,
      enableDialogType: 1, // 1-启用, 2-停用
      addDialogType: 'add',
      selectedData: null,
      RULE_TYPE: {
        1: '封面标签'
      },
      RULE_STATUS: {
        0: '待生效',
        1: '生效中',
        2: '已失效'
      }
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    this.setTableHeight()
  },
  beforeDestroy() {
  },
  methods: {
    clickAdd() {
      this.selectedData = null
      this.addDialogType = 'add'
      this.addDialogVisible = true
    },
    clickObjectCount(row) {
      this.selectedData = { id: row.id }
      this.objectDialogVisible = true
    },
    enableDialogClose() {
      this.enableDialogVisible = false
      this.enableDialogType = 1
      this.selectedData = null
    },
    enableDialogOk() {
      this.enableDialogClose()
      this.search()
    },
    addDialogClose() {
      this.addDialogVisible = false
      this.selectedData = null
    },
    addDialogOk() {
      this.addDialogClose()
      this.search()
    },
    objectDialogClose() {
      this.objectDialogVisible = false
      this.selectedData = null
    },
    setTableHeight(val) {
      this.tableHeight = document.querySelector('.app-main').offsetHeight - 80 - 70
    },
    getbtns(row) {
      return [
        {
          label: '编辑',
          disabled: +row.ruleStatus === 1,
          row: row
        }, {
          label: +row.ruleStatus === 1 ? '停用' : '启用',
          row: row
        }, {
          label: '删除',
          row: row
        }
      ]
    },
    // 操作列按钮事件
    handleOperateClick(msg) {
      switch (msg.label) {
        case '编辑':
          this.selectedData = { id: msg.row.id }
          this.addDialogType = 'edit'
          this.addDialogVisible = true
          break
        case '删除':
          this.clickDel(msg.row)
          break
        case '停用':
          this.showEnableDialog(2, msg.row)
          break
        case '启用':
          this.showEnableDialog(1, msg.row)
          break
        default:
          break
      }
    },
    showEnableDialog(type, row) {
      this.selectedData = { ...row }
      this.enableDialogType = type
      this.enableDialogVisible = true
    },
    clickDel(row) {
      this.$confirm(
        '<strong class="confirm-title">请确认是否删除此规则？</strong><br><p class="confirm-subtitle">删除后规则将自动失效，请慎重操作！</p>',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          iconClass: 'c-ioc-icon-warning'
        }
      ).then(() => {
        deleteOperationRule(row.id).then(res => {
          this.$message.success('操作成功')
          this.search(1)
        })
      }).catch(() => {})
    },
    async search(pageNum = 1) {
      const queryParams = this.getQueryParams(pageNum)
      const res = await operationRuleList(queryParams)
      console.log(res)
      this.dataList = res.data.list
      this.page = {
        ...this.page,
        pageNum: res.data.currPage,
        pageSize: res.data.pageSize,
        total: res.data.total
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.list-page-footer {
  box-sizing: border-box;
  padding-right: 24px;
  padding-left: 20px;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #ffffff;
  z-index: 1000;
}
.page-content {
  box-sizing: border-box;
  padding: 0 20px 70px;
  background: #ffffff;
  box-shadow: 0px 0px 2px 0px rgba(71, 78, 92, 0.1);
}
.page-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  .c-icon-plus {
    font-weight: bold;
  }
}
</style>
