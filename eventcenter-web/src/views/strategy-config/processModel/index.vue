<!--
 * @description 流程模型管理
 * @date 2020-09-08
 * @author lism
-->
<template>
  <div class="page-wrapper">
    <common-page-list class="common-page-list" :has-footer="false">
      <search slot="search" ref="searchRef" @searchList="dealwithFilter" @reset="clearFilters" />
      <div slot="content" class="result-content">
        <search-tips
          ref="searchTips"
          :total="dataList.length"
          show-search-items
          show-actions
          :search-items="filterTips"
          :select-count="selectCount"
          @heightChange="tipHeightChange"
          @delFilter="delFilter"
          @clear="clearFilters"
        >
          <el-button
            type="primary"
            class="add-btn common-action-btn"
            icon="custom-add common-icon"
            @click.stop="dialogVisible = true"
          >新增流程模型</el-button>
        </search-tips>
        <div v-loading="loading" class="result-list" :style="resultStyle">
          <el-table
            :data="dataList"
            style="width: 100%"
            row-key="id"
            class="event-process-model-table"
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
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                show-overflow-tooltip
                :formatter="_formatter"
              />
            </template>
            <el-table-column width="240" class-name="table-column-action">
              <template #header>
                <span>操作</span>
              </template>
              <template v-slot="{ row }">
                <span class="action-group">
                  <span class="action-btn" @click="_publish(row)">发布流程</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_draw(row)">绘制流程</span>
                  <span class="action-divider">|</span>
                  <span class="action-btn" @click="_del(row)">删除模型</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </common-page-list>
    <!-- 新增流程模型弹窗 -->
    <add-model :visible.sync="dialogVisible" />
  </div>
</template>

<script>
import search from './searchModle'
import searchMixin from '@/mixin/searchMixin'
import addModel from './addModel'
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'ProcessModel',
  components: {
    search,
    addModel
  },
  mixins: [searchMixin],
  data() {
    return {
      tableColumn: [
        {
          prop: 'name',
          label: '流程模型名称',
          visible: true
        },
        {
          prop: 'key',
          label: '流程标识',
          visible: false
        },
        {
          prop: 'version',
          label: '版本号',
          visible: false,
          width: 80
        },
        {
          prop: 'createTime',
          label: '创建时间',
          visible: true
        },
        {
          prop: 'lastUpdateTime',
          label: '更新时间',
          visible: true
        }
      ],
      dialogVisible: false, // 策略配置弹窗
      dialogData: null
    }
  },
  created() {
    this._search()
  },
  methods: {
    // 列表查询
    _search() {
      const params = {
        ...this.searchParams
      }
      moduleSrv.getProcessModelList(params).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.dataList = res.data || []
        } else {
          console.warn('getProcessModelList 接口报错')
        }
      })
    },
    // 自定义序号
    indexMethod(index) {
      return index + 1 > 9 ? index + 1 : `${index + 1}`
    },
    // 发布流程
    _publish(row) {
      console.log('_publish--', row)
      moduleSrv.deployModel(row.id).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message || '操作失败！',
            type: 'error'
          })
        }
      })
    },
    // 删除模型
    _del(row) {
      this.$confirm('确定要删除该模型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const form = new FormData()
        form.append('ids', row.id)
        moduleSrv.removeModel(form).then((res) => {
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
      console.log('row==', row)
      this.$router.push({
        path: '/process/process-model/nodeConfig',
        query: {
          id: row.id,
          ...row
        }
      })
    },
    // 跳转绘制流程页面
    _draw(row) {
      this.$router.push({
        path: '/process/process-model/draw',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  @include resultContent;
  ::v-deep {
    @include oneLineSearch;
    .advance-search {
      .el-input {
        width: 296px;
      }
    }
  }
}
</style>
