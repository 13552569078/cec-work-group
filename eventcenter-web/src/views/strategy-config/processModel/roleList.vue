<!--
 * @description 流程模型管理--节点配置--角色配置
 * @date 2020-09-10
 * @author lism
-->
<template>
  <div class="role-config">
    <el-table :data="tableData" style="width: 100%" tooltip-effect="light">
      <el-table-column
        type="index"
        width="55"
        class-name="table-column-index"
      />
      <el-table-column
        v-for="(item, index) in tableColumn"
        :key="item.prop || index"
        :label="item.label"
        :prop="item.prop"
        :width="item.width"
        show-overflow-tooltip
        :formatter="_formatter"
      />
      <el-table-column width="110" class-name="table-column-action">
        <template #header>
          <span>操作</span>
        </template>
        <template v-slot="{ row }">
          <span class="action-group">
            <span class="action-btn" @click="_edit(row)">编辑</span>
            <span class="action-divider" />
            <span class="action-btn" @click="_del(row)">删除</span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色编辑 -->
    <role-dialog
      :visible.sync="roleDialogVisible"
      :mode="roleDialogType"
      :rowdata="roleDialogData"
      :currentnode="currentnode"
      @update="updateList"
    />
  </div>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import roleDialog from './roleDialog'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'RoleConfig',
  components: {
    roleDialog
  },
  props: {
    tableData: {
      type: Array,
      required: true,
      default: () => []
    },
    currentnode: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableColumn: [
        {
          prop: 'roleName',
          label: '角色名称',
          visible: true
        },
        {
          prop: 'orgTypeText',
          label: '处置级别',
          visible: true
        },
        {
          prop: 'createTime',
          label: '创建时间',
          visible: true
        },
        {
          prop: 'orderNum',
          label: '排序',
          visible: true
        }
      ],
      roleDialogVisible: false,
      roleDialogType: 'eidt',
      roleDialogData: null
    }
  },
  inject: ['_formatter'],
  methods: {
    _edit(row) {
      this.roleDialogVisible = true
      this.roleDialogType = 'edit'
      this.roleDialogData = row
    },
    updateList() {
      this.$emit('update')
    },
    _del(row) {
      this.$confirm('确定要删除该角色配置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'cestc-confirm-warning'
      }).then(() => {
        const form = new FormData()
        form.append('ids', row.id)
        moduleSrv.removeProcessTaskRole(form).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.$emit('update')
          } else {
            this.$message({
              message: res.message || '操作失败！',
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>
