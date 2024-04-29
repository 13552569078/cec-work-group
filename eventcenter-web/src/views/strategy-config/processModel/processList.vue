<!--
 * @description 流程模型管理--流程管理
 * @date 2020-09-10
 * @author lism
-->
<template>
  <common-page-list has-footer class="common-page-list">
    <search slot="search" ref="searchRef" @searchList="dealwithFilter" @reset="clearFilters" />
    <div slot="content" class="result-content">
      <search-tips
        ref="searchTips"
        :total="page.total"
        show-search-items
        :show-actions="false"
        :search-items="filterTips"
        :select-count="selectCount"
        @heightChange="tipHeightChange"
        @delFilter="delFilter"
        @clear="clearFilters"
      />
      <div v-loading="loading" class="result-list" :style="resultStyle">
        <el-table
          :data="dataList"
          style="width: 100%"
          row-key="id"
          class="event-process-model-table"
          :tree-props="{
            children: 'children',
            hasChildren: 'hasChildren',
          }"
          tooltip-effect="light"
        >
          <el-table-column
            type="index"
            width="55"
            :index="indexMethod"
            class-name="table-column-index"
          />
          <template v-for="(item, index) in tableColumn">
            <el-table-column
              v-if="item.prop === 'diagramResourceName'"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
            >
              <template v-slot="{ row }">
                <span
                  class="action-item action-btn"
                  @click="_toNewTab('img', row)"
                >{{ row.diagramResourceName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else-if="item.prop === 'resourceName'"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
            >
              <template v-slot="{ row }">
                <span
                  class="action-item action-btn"
                  @click="_toNewTab('xml', row)"
                >{{ row.resourceName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-else
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip
            />
          </template>
          <el-table-column width="180" class-name="table-column-action">
            <template #header>
              <span>操作</span>
            </template>
            <template v-slot="{ row }">
              <span class="action-group">
                <span
                  class="action-btn"
                  @click="_nodeConfig(row)"
                >节点配置</span>
                <span class="action-divider">|</span>
                <span class="action-btn" @click="_del(row)">删除流程</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template v-slot:footer>
      <cestc-pagination
        background
        :current-page="page.pageNum"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
  </common-page-list>
</template>

<script>
import search from './searchProcess'
import pageMixin from '@/mixin/pageMixin'
import searchMixin from '@/mixin/searchMixin'
import moduleSrv from '@/api/dispatch'
import { mapGetters } from 'vuex'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'ProcessList',
  components: {
    search
  },
  mixins: [pageMixin, searchMixin],
  data() {
    return {
      form: {},
      tableData: [],
      tableColumn: [
        {
          prop: 'name',
          label: '流程名称',
          visible: true
        },
        {
          prop: 'processId',
          label: '流程编号',
          visible: false
        },
        {
          prop: 'key',
          label: '流程key',
          visible: false
        },
        {
          prop: 'deploymentId',
          label: '部署编号',
          visible: false
        },
        {
          prop: 'diagramResourceName',
          label: '流程图片名',
          visible: false
        },
        {
          prop: 'resourceName',
          label: '流程文件名',
          visible: false
        },
        {
          prop: 'category',
          label: '流程类别',
          visible: true
        },
        {
          prop: 'version',
          label: '流程版本',
          visible: true
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getConfig'])
  },
  created() {
    this._search()
  },
  methods: {
    // 列表查询
    _search() {
      const { pageNum, pageSize } = this.page
      const params = {
        pageNum,
        pageSize,
        ...this.searchParams
      }
      moduleSrv.getProcessList(params).then((res) => {
        const { list = [], total = 0 } = res.data
        if (res.code === SUCCESS_CODE) {
          this.dataList = list
          this.page.total = total
        } else {
          console.warn('getProcessModelList 接口报错')
        }
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    _del(row) {
      this.$confirm('确定要删除该模型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const form = new FormData()
        form.append('ids', row.deploymentId)
        moduleSrv.removeProcess(form).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            // 刷新列表
            this._search()
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    },
    // 节点配置
    _nodeConfig(row) {
      this.$router.push({
        path: '/process/process-list/nodeConfig',
        query: {
          ...row
        }
      })
    },
    // 流程图片跳转、流程文件跳转
    _toNewTab(type, row) {
      let url = `${this.getConfig.activitiUrl}/activiti/process/resource`
      if (type === 'img') {
        url = `${url}/${encodeURI(encodeURI(row.diagramResourceName))}/${
          row.deploymentId
        }`
      } else {
        url = `${url}/${encodeURI(encodeURI(row.resourceName))}/${
          row.deploymentId
        }`
      }
      window.open(url)
    }
  }
}
</script>

<style lang="scss" scoped>
.common-page-list {
  @include resultContent;
}
::v-deep {
  @include oneLineSearch;
  .advance-search {
    .el-input {
      width: 296px;
    }
  }
}
</style>
