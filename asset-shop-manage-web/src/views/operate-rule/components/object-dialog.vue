<!--/*
* @Author: dingli
* @Desc: 生效目标
* @Date:
*/-->
<template>
  <c-dialog
    title="生效目标"
    width="734px"
    class="dialog-center"
    :visible.sync="dialogVisible"
    @close="beforeClose"
  >
    <c-table :data="dataList" height="324">
      <c-table-column label="#" type="index" width="60">
        <template slot-scope="scope">
          <span class="table-index">{{ (page.pageNum - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </c-table-column>
      <c-table-column
        prop="packName"
        label="资源名称"
        width="180"
      >
        <template slot-scope="scope">
          <c-tooltip :content="scope.row.packName" :disabled="nameTipDisable(scope.row)" placement="top">
            <span :class="{'name-sold':scope.row.packStatus==5}"><span class="name-text">{{ scope.row.packName }}</span></span>
          </c-tooltip>
        </template>
      </c-table-column>
      <c-table-column
        prop="shopCode"
        label="资源编码"
        show-overflow-tooltip
      />
      <c-table-column
        prop="packVersion"
        label="版本号"
        width="90"
        show-overflow-tooltip
      />
      <c-table-column
        prop="assetType"
        label="生效类型"
        width="160"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ assetTypeFilter(scope.row)||'--' }}
        </template>
      </c-table-column>
    </c-table>
    <div class="page-footer">
      <c-pagination
        background
        :current-page="page.pageNum"
        :pager-count="5"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </c-dialog>
</template>
<script>
import { operationRuleObjects } from '@/api/operate-rule'
import { referAssetTypeObj, ASSET_SUBTYPE } from '@/utils/enumerate'
export default {
  name: 'ObjectDialog',
  components: {},
  props: {
    visible: {
      type: Boolean,
      require: true
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {},
  watch: {
    visible: {
      handler(nv) {
        this.dialogVisible = nv
        if (nv) {
          this.getData()
        }
      }
    }
  },
  created() {},
  methods: {
    nameTipDisable(row) {
      if (+row.packStatus === 5) {
        return row.packName.length <= 6
      }
      return row.packName.length <= 11
    },
    assetTypeFilter(row) {
      const assetSubtype = row.assetSubtype ? row.assetSubtype.split(',') : []
      const str = []
      if (referAssetTypeObj[row.assetType]) {
        str.push(referAssetTypeObj[row.assetType])
      }
      const assetSubtypeStr = (assetSubtype.map(d => ASSET_SUBTYPE[d])).join(',')
      if (assetSubtypeStr) {
        str.push(assetSubtypeStr)
      }
      return str.join('-')
    },
    beforeClose() {
      this.dataList = []
      this.page = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      this.$emit('close')
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize
      this.getData()
    },
    handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum
      this.getData()
    },
    async getData() {
      try {
        const params = {
          id: this.data.id,
          pageNum: this.page.pageNum,
          pageSize: this.page.pageSize
        }
        const res = await operationRuleObjects(params)
        this.dataList = res.data.list
        this.page = {
          ...this.page,
          pageNum: res.data.currPage,
          pageSize: res.data.pageSize,
          total: res.data.total
        }
      } catch (e) {
        // e
      }
    }
  }
}
</script>
<style scoped lang="scss">
.page-footer {
  width: 100%;
  padding-top: 24px;
  text-align: right;
}
.name-text {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.name-sold {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    right: -70px;
    top: -4px;
    width: 62px;
    height: 20px;
    background: url(~@/assets/img/icon-sold.png) no-repeat center;
    background-size: 100% 100%;
  }
  .name-text {
    display: inline-block;
    max-width: 100px;
  }
}
</style>
