<!--/*
* @Author: dingli
* @Desc: 资源表格，用于卡片和表格切换的表
* @Date:
*/-->
<template>
  <div class="cls-table-wrap" :style="`height:${height}`">
    <c-table :data="tableData" height="100%">
      <c-table-column type="index" label="#" width="60">
        <template slot-scope="scope">{{ page.pageSize*(page.pageNum-1)+scope.$index+1 }}</template>
      </c-table-column>
      <c-table-column label="" width="70">
        <template slot-scope="scope">
          <i v-if="(+scope.row.referVersionStatus===3)"
             class="algin-center" @click.stop="">
            <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
              <i class="alert-invalid" @click.stop="" />
            </c-tooltip>
          </i>
        </template>
      </c-table-column>
      <c-table-column label="资源名称" prop="assetName" show-overflow-tooltip></c-table-column>
      <c-table-column label="资源编码" prop="assetCode" show-overflow-tooltip></c-table-column>
      <c-table-column label="版本号" prop="_version" show-overflow-tooltip></c-table-column>
      <c-table-column label="资源状态" prop="_statusName" show-overflow-tooltip></c-table-column>
      <c-table-column label="共享状态" prop="_sharedFlagName" show-overflow-tooltip></c-table-column>
      <c-table-column label="更新人" prop="_updateUserName" show-overflow-tooltip></c-table-column>
      <c-table-column label="更新时间" prop="_updateTime" show-overflow-tooltip></c-table-column>
      <c-table-column label="操作" prop="" width="110">
        <template slot-scope="scope">
          <btn-group
            :limit="1"
            :btns="_getbtns(scope.row)"
            @handleClick="handleOperateClick" />
        </template>
      </c-table-column>
    </c-table>
  </div>
</template>
<script>
import { validateTenant } from '@/utils'
import { assetStatus, shareStatus } from '@/config/index'
export default {
  name: '',
  components: {},
  props: {
    pageKey: String,
    page: Object,
    height: [Number, String],
    data: Array,
    getbtns: Function
  },
  data() {
    return {};
  },
  computed: {
    tableData() {
      if (Array.isArray(this.data)) {
        return this.data.map(d => ({
          ...d,
          _version: d.version || '--',
          _updateUserName: d.updateUserName || '--',
          _updateTime: d.updateTime || '--',
          _sharedFlagName: (shareStatus.find(dd => !(dd.value - d.sharedFlag)) || {}).label || '--',
          _statusName: (assetStatus.find(dd => !(dd.value - d.status)) || {}).label || '--'
        }))
      }
      return []
    }
  },
  methods: {
    _getbtns(row) {
      return this.getbtns(row).filter(d => !d.disabled)
    },
    handleOperateClick(msg) {
      if (validateTenant(msg.row.createUserId, this.pageKey, msg.permissionKey)) return
      this.$emit('handleOperateClick', msg)
    }
  }
};
</script>
<style scoped lang="scss">
.cls-table-wrap {
  padding: 20px 20px 0 20px;
  background: white;
}
</style>
