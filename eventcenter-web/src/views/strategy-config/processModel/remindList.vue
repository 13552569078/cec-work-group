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
      <el-table-column width="70" class-name="table-column-action">
        <template #header>
          <span>操作</span>
        </template>
        <template v-slot="{ row }">
          <span class="action-btn" @click="_edit(row)">配置</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色编辑 -->
    <remind-dialog
      :visible.sync="roleDialogVisible"
      :mode="roleDialogType"
      :rowdata="roleDialogData"
      @update="updateList"
    />
  </div>
</template>
<script>
import RemindDialog from './remindDialog'
export default {
  name: 'RemindList',
  components: {
    RemindDialog
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
          prop: 'remindTypeName',
          label: '提醒类型',
          visible: true
        },
        {
          prop: 'remindModeName',
          label: '提醒方式',
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
    }
  }
}
</script>
