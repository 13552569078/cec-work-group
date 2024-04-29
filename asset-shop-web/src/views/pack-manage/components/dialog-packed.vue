<!--/*
* @Author: dingli
* @Desc: 选择资源弹框
* @Date:
*/-->
<template>
  <c-dialog
    title="选择资源"
    class="dialog-center"
    :visible.sync="dialogVisible"
    width="1080px"
    @close="close">
    <div class="cls-search">
      <c-form ref="refFormData" :model="searchForm" inline>
        <c-form-item label="资源名称" prop="assetName">
          <c-input
            v-model="searchForm.assetName"
            placeholder="请输入" />
        </c-form-item>
        <c-form-item label="资源编码" prop="assetCode">
          <c-input
            v-model="searchForm.assetCode"
            placeholder="请输入" />
        </c-form-item>
      </c-form>
      <div>
        <c-button type="" size="small" @click="clickReset">重置</c-button>
        <c-button type="primary" size="small" @click="clickSearch">查询</c-button>
      </div>
    </div>
    <c-table :data="tableData" height="400">
      <c-table-column label="" width="50">
        <template slot-scope="scope">
          <c-checkbox v-model="scope.row._checked" @change="clickCheckbox(scope.row)"></c-checkbox>
        </template>
      </c-table-column>
      <c-table-column type="index" label="" width="70">
        <template slot-scope="scope">{{ pageData.pageSize*(pageData.currPage-1)+scope.$index+1 }}</template>
      </c-table-column>
      <c-table-column label="资源名称" prop="assetName" show-overflow-tooltip />
      <c-table-column label="资源编码" prop="assetCode" show-overflow-tooltip />
      <c-table-column label="版本号" prop="version" show-overflow-tooltip />
      <c-table-column label="资源类型" prop="assetSubtype" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ typeFormat(scope.row) }}
        </template>
      </c-table-column>
      <c-table-column label="资源描述" prop="assetDesc" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.assetDesc||'--' }}
        </template>
      </c-table-column>
    </c-table>
    <!-- <c-pagination
      background
      :current-page="pageData.currPage"
      :page-size="pageData.pageSize"
      layout="total, prev, pager, next, jumper"
      :total="pageData.total"
      class="cls-pagination"
      @current-change="handleCurrentChange"
    /> -->
    <span slot="footer" class="dialog-footer">
      <c-button type="" size="small" @click="dialogVisible = false">取消</c-button>
      <c-button type="primary" size="small" @click="clickOk">确定</c-button>
    </span>
  </c-dialog>
</template>
<script>
import { asseTypeFormatLong, getAssetTypeBySubtype } from '@/utils/enum'
import { packedAssetList } from '@/api'
export default {
  name: 'DialogPacked',
  props: {
    visible: Boolean,
    init: Object,
    shopCode: [String],
    assetType: [Number, String]
  },
  data() {
    return {
      dialogVisible: true,
      searchForm: {
        assetName: '',
        assetCode: '',
        assetSubtype: ''
      },
      tableData: [],
      pageData: { total: 0, pageSize: 10, currPage: 1 },
      selected: null
    }
  },
  watch: {
    visible: {
      handler(nv) {
        this.dialogVisible = nv
        if (nv) {
          this.selected = this.init
          this.search(1)
        }
      }
    }
  },
  created() {
    this.dialogVisible = this.visible
    if (this.visible) {
      this.search(1)
    }
  },
  methods: {
    clickCheckbox(row) {
      if (row._checked) {
        this.tableData.forEach(d => {
          d._checked = false
          if (d.assetCode === row.assetCode && d.version === row.version) {
            d._checked = true
          }
        })
      }
      this.selected = row._checked ? row : null
    },
    clickOk() {
      if (!this.selected) {
        return this.$message.warning('请选择资源')
      }
      this.$emit('ok', this.selected)
    },
    close() {
      this.selected = null
      this.searchForm.assetName = ''
      this.searchForm.assetCode = ''
      this.searchForm.assetSubtype = ''
      this.tableData = []
      this.$emit('close')
    },
    clickSearch() {
      this.search(1)
    },
    clickReset() {
      this.searchForm.assetName = ''
      this.searchForm.assetCode = ''
      this.searchForm.assetSubtype = ''
      this.search(1)
    },
    typeFormat(row) {
      return asseTypeFormatLong(row.assetType, row.assetSubtype)
    },
    handleCurrentChange(pageNum) {
      this.search(pageNum)
    },
    async search(pageNum = 1) {
      try {
        const typeArr = getAssetTypeBySubtype(this.assetType, true)
        const params = {
          shopCode: this.shopCode,
          ...this.searchForm,
          assetType: typeArr[0],
          assetSubtype: typeArr[1] || undefined
        }
        const { data } = await packedAssetList(params)
        this.tableData = data.map(d => ({
          ...d,
          _checked: !!(this.selected && d.assetCode === this.selected.assetCode && d.version === this.selected.version)
        }))
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.cls-search {
  display: flex;
  justify-content: space-between;
}
::v-deep.c-form.c-form--inline {
  .c-form-item__label {
    line-height: 30px;
    padding: 0 4px 0 0;
  }
}
.cls-pagination {
  text-align: right;
}
</style>
