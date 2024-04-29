<!--/*
* @Author: dingli
* @Desc: 审核记录
* @Date: 2022-4-20
*/-->
<template>
  <div class="detail-box">
    <h3 class="info-title info-title_bottom">审核记录</h3>
    <c-table :data="list">
      <c-table-column label="" width="60">
        <template slot-scope="scope">
          <span class="table-index">{{ scope.$index + 1 }}</span>
        </template>
      </c-table-column>
      <c-table-column prop="applyType" label="申请类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ _applyTypeFormat(scope.row.applyType) }}</span>
        </template>
      </c-table-column>
      <c-table-column
        prop="applyUserName"
        label="发起人"
        show-overflow-tooltip
      />
      <c-table-column v-if="applytype==4" prop="unpackReason" label="下架原因" show-overflow-tooltip />
      <c-table-column prop="applyTime" label="发起时间" show-overflow-tooltip />
      <c-table-column prop="applyStatus" label="审核状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ _applyStatusFormat(scope.row.applyStatus) }}</span>
        </template>
      </c-table-column>
      <c-table-column prop="auditMsg" label="审核意见" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.auditMsg || "--" }}</span>
        </template>
      </c-table-column>
      <c-table-column
        prop="handleTime"
        label="审核时间"
        show-overflow-tooltip
      />
    </c-table>
  </div>
</template>
<script>
import { applyStatusFormat, applyTypeFormat } from '@/utils/enumerate'
export default {
  name: 'AuditLog',
  components: {},
  props: {
    list: {
      type: Array,
      default: () => [],
      require: true
    }
  },
  data() {
    return {}
  },
  computed: {
    applytype() {
      return this.list[0] && this.list[0].applyType || ''
    }
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    _applyTypeFormat(val) {
      return applyTypeFormat(val)
    },
    _applyStatusFormat(val) {
      return applyStatusFormat(val)
    }
  }
}
</script>
<style scoped lang="scss">
</style>
