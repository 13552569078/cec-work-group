<template>
  <div class="table-wrap">
    <p class="title" v-if="tableData.title">{{ tableData.title }}</p>
    <el-table :data="tableData.tBody" style="width: 100%">
      <el-table-column
        v-for="item in tableData.tHead"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        show-overflow-tooltip
      />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps(['tableData'])
console.log(props.tableData, 'table')
</script>

<style lang="scss" scoped>
.table-wrap {
  padding: 10px;
  .title {
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    margin: 10px 0;
  }
  :deep() {
    .el-table {
      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
        background: transparent;
      }
      background: transparent;
      color: #cbe9ff;
      tr {
        background: transparent;
      }
      th.el-table__cell {
        color: #cbe9ff;
        background: transparent;
      }
    }
  }
}
</style>
