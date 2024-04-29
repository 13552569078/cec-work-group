<template>
  <c-dialog :class="'dialog-center'" :title="'被引用关系'" width="1180px" :visible.sync="dialogFlag"
            append-to-body :before-close="close">
    <fixed-page
      class="checkbox-notree"
      padding="0"
      :background-color="'#fff'"
      :header-height="0"
      :header-margin="0"
      :footer-margin="0"
      :footer-height="0"
    >

      <div class="body-demo">
        <c-table
          ref="multipleTable"
          class="hidden-checkall-header"
          height="384px"
          :data="showList"
          element-loading-text="Loading"
        >

          <c-table-column
            label=""
            width="130"
          >
            <template slot-scope="scope">{{ pageData.pageSize*(pageData.pageNum-1)+scope.$index+1 }}</template>
          </c-table-column>
          <c-table-column label="资源名称" prop="name" show-overflow-tooltip min-width="200">
          </c-table-column>
          <c-table-column label="资源编码" prop="code" show-overflow-tooltip min-width="200">
          </c-table-column>
          <c-table-column label="版本号" prop="version" show-overflow-tooltip min-width="90">
          </c-table-column>
          <c-table-column label="类型" prop="type" show-overflow-tooltip min-width="120">
          </c-table-column>
          <c-table-column label="描述" prop="desc" show-overflow-tooltip min-width="120">

          </c-table-column>
          <c-table-column label="操作" show-overflow-tooltip min-width="90">
            <template slot-scope="scope">
              <span
                class=" icon-operate"
                @click="goDetail(scope.row)"
              >查看</span>
            </template>
          </c-table-column>
        </c-table>
        <c-pagination
          style="line-height:normal;padding-top: 24px;"
          background
          :current-page="pageData.pageNum"
          :page-size="pageData.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="pageData.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </fixed-page>

    <div slot="footer" class="dialog-footer">
      <c-button type="gradual" size="small" @click="close">确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import { DefaultValue } from '@/config/index'
import { getAssetTypeLabel, goDetail } from '@/utils'
import { assetReferenced, assetMysubReferenced } from '@/api'
export default {
  name: 'AuthInfo',

  props: {
    data: {
      type: Object,
      default: () => {
        return {
          shopCode: '',
          packVersion: '',
          appName: ''
        }
      }
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    isInterfaceAPI: {
      type: Boolean,
      default: false
    },
    flag: {
      type: [String],
      default: ''
    },
    groupId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      defaultValue: DefaultValue,
      pageData: { total: 0, pageSize: 10, pageNum: 1 },
      showList: []
    };
  },
  computed: {

  },
  created() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    goDetail(data) {
      goDetail(data)
    },
    getList() {
      let fn;
      if (this.data.appId && this.data.assetId) { // 应用订阅
        fn = assetReferenced({
          assetId: this.data.assetId,
          appId: this.data.appId,
          pageSize: this.pageData.pageSize,
          pageNum: this.pageData.pageNum
        })
      } else if (this.data.bizCode) { // 我的订阅
        fn = assetMysubReferenced({
          bizCode: this.data.bizCode,
          shopCode: this.isInterfaceAPI ? this.data.shopCode : '',
          packVersion: this.isInterfaceAPI ? this.data.packVersion : '',
          pageSize: this.pageData.pageSize,
          pageNum: this.pageData.pageNum
        })
      }
      if (!fn) return this.$message.warning('被引用关系入参错误')
      fn.then(res => {
        this.showList = res.data.list.map(item => {
          item.type = getAssetTypeLabel(item.assetType, item.subtype)
          item.assetId = item.id
          return item
        })
        this.pageData.total = res.data.total
      })
    },
    close() {
      this.$emit('close')
    },
    handleCurrentChange(pageNum) {
      this.pageData.pageNum = pageNum
      this.getList()
    }
  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.cls-model-form {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-footer {
  text-align: right;
}
.half-form-item {
  width: 50.85%;
  display: inline-block;
}
.header {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  .border {
    width: 4px;
    height: 14px;
    background: $primaryColor;
    margin: 0 8px 0 0px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: $textColor;
  }
}
.icon-operate{
  color:$primaryColor;
  cursor: pointer;
}
.no-margin{
  margin: 0;
}
.copy {
  position: absolute;
  top: -17px;
  right: 208px;
  width: 16px;
  height: 16px;
  background: url(~@/assets/logo/copy.png) no-repeat center;
  background-size: 100%;
  z-index: 2;
  cursor: pointer;
  &:hover {
    background-image: url(~@/assets/logo/copy-hover.png);
  }
}
</style>
