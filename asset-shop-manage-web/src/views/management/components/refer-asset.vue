<!--/*
* @Author: dingli
* @Desc: 引用资源
* @Date: 2022-04-20
*/-->
<template>
  <div class="content-last details-content-layout_wrapper">
    <span class="content-label" style="margin-bottom: 20px">引用资源</span>
    <c-table :data="list">
      <c-table-column label="#" width="60">
        <template slot-scope="scope">
          <span class="table-index">{{ scope.$index + 1 }}</span>
        </template>
      </c-table-column>
      <c-table-column
        prop="referAssetName"
        label="资源名称"
        show-overflow-tooltip
      />
      <c-table-column
        prop="referAssetCode"
        label="资源编码"
        show-overflow-tooltip
      />
      <c-table-column
        prop="referAssetVersion"
        label="资源版本号"
        show-overflow-tooltip
      />
      <c-table-column
        prop="referAssetType"
        label="数字资源"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ _assetTypeFormat(scope.row) }}</span>
        </template>
      </c-table-column>
      <c-table-column
        prop="referAssetDesc"
        label="资源描述"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.referAssetDesc||'--' }}
        </template>
      </c-table-column>
    </c-table>
  </div>
</template>
<script>
import { asseTypeFormat } from '@/utils/enumerate'
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    _assetTypeFormat(item) {
      return asseTypeFormat(item.referAssetType, item.referAssetSubtype) || '--'
    }
  }
}
</script>
<style scoped lang="scss">
</style>
