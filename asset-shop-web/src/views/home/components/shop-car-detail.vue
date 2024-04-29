<script>
import { carCheck } from '@/api'
import { asseTypeFormatLong } from '@/utils/enum'
import { applyTypeListMap } from '@/config/index.js'
import applyDialog from '@/views/home/components/download-dialog.vue'
export default {
  components: { applyDialog },
  data() {
    return {
      dialogVisible: false,
      clearVisible: false,
      asseTypeFormatLong,
      applyTypeListMap,
      tableSelection: [],
      applyInfo: null
    }
  },
  computed: {
    shopCarCount() {
      return this.$store.state?.shopCar?.shopCarCount || 0
    },
    tableList() {
      return this.$store.state?.shopCar?.shopCarList || []
    }
  },
  watch: {
    '$store.state.shopCar.show': {
      handler(val) {
        if (val) {
          this.dialogVisible = true
        }
      },
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false
      this.$store.commit('shopCar/CLOSE_CART_DIALOG')
    },
    async handleOk() {
      try {
        const params = {}
        params.shopCartIdList = this.tableSelection.map(d => d.id)
        if (!(params.shopCartIdList && params.shopCartIdList.length)) {
          return this.$message.error('请选择资源')
        }
        await carCheck(params)
        this.applyInfo = params
        this.handleClose()
      } catch (e) {
        console.error(e)
      }
    },
    applyDialogClose(flag) {
      this.applyInfo = null
      if (flag) {
        this.$store.dispatch('shopCar/getCartInfo')
      } else {
        this.dialogVisible = true
      }
    },
    closeConfirm() {
      this.clearVisible = false
    },
    handleClearCar() {
      this.$store.dispatch('shopCar/clearCart')
      this.closeConfirm()
    },
    handleRemove(data) {
      this.$store.dispatch('shopCar/delCart', data.id)
    },
    handleTabelSelect(val) {
      this.tableSelection = val
    },
    tableRowClassName({ row, rowIndex }) {
      if (+row.cartStatus !== 1) {
        return 'disabled-row'
      }
      return ''
    },
    tableSelectable(row) {
      return (+row.cartStatus === 1)
    }
  }
}
</script>
<template>
  <div class="z-50">
    <c-dialog
      custom-class="dialog-shop-cart"
      width="1080px"
      append-to-body
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <h3 slot="title" class="info-title h-[44px] mb-0">购物车({{ shopCarCount }})</h3>
      <div class="max-h-[60vh] overflow-auto">
        <c-table
          :data="tableList"
          :border="false"
          style="width:100%"
          :row-class-name="tableRowClassName"
          @selection-change="handleTabelSelect"
        >
          <c-table-column type="index" label="#" width="55" />
          <c-table-column type="selection" width="30" :selectable="tableSelectable" class-name="td-p-0" />
          <c-table-column label="" width="45" class-name="td-p-0">
            <template slot-scope="scope">
              <i :class="'cartStatus-'+scope.row.cartStatus"></i>
            </template>
          </c-table-column>
          <c-table-column prop="packName" label="资源名称" show-overflow-tooltip />
          <c-table-column prop="assetType" label="资源类型" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ asseTypeFormatLong(scope.row.assetType, scope.row.assetSubtype)||'--' }}
            </template>
          </c-table-column>
          <c-table-column prop="packVersion" label="版本号" width="85" show-overflow-tooltip />
          <c-table-column prop="applyType" label="申请类型" width="85" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ applyTypeListMap.get(+scope.row.applyType)||'--' }}
            </template>
          </c-table-column>
          <c-table-column prop="referPackName" label="申请资源主体" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.referPackName||'--' }}
            </template>
          </c-table-column>
          <c-table-column prop="appName" label="资源名称" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.appName||'--' }}
            </template>
          </c-table-column>
          <c-table-column
            label="操作"
            width="60"
          >
            <template slot-scope="scope">
              <c-button type="text" size="small" @click="handleRemove(scope.row)">移除</c-button>
            </template>
          </c-table-column>
        </c-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <c-button size="small" @click="clearVisible=true">清空购物车</c-button>
        <c-button type="primary" size="small" @click="handleOk">下一步</c-button>
      </span>
    </c-dialog>
    <applyDialog
      v-if="!!applyInfo"
      :dialog-flag="!!applyInfo"
      :datainfo="applyInfo"
      from="shopCar"
      @close="applyDialogClose" />
    <c-dialog
      title="提示"
      :visible.sync="clearVisible"
      append-to-body
      width="300px"
      :before-close="closeConfirm">
      <span>确定要清空购物车吗?</span>
      <span slot="footer" class="dialog-footer">
        <c-button type="" size="small" @click="closeConfirm">取消</c-button>
        <c-button type="primary" size="small" @click="handleClearCar">确定</c-button>
      </span>
    </c-dialog>

  </div>

</template>
<style lang='scss' scoped>
.cartStatus-2 {
  &::before {
    content: '已更新';
    font-size: 12px;
    color: #2059E4;
  }
}
.cartStatus-3 {
  &::before {
    content: '已升级';
    font-size: 12px;
    color: #4CC09E;
  }
}
.cartStatus-4 {
  &::before {
    content: '已下架';
    font-size: 12px;
    color: #FF4D4F;
  }
}
::v-deep.c-table {
  .disabled-row {
    color: #bdbdbd;
  }
  .td-p-0 {
    .cell {
      padding: 0 !important;
    }
  }
}
</style>
