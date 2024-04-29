<!--/*
* @Author: dingli
* @Desc: 应用部署弹框
* @Date: 2022-3-16
*/-->
<template>
  <c-dialog class="dialog-center asset-post"
            width="670px"
            title="资源回流" :visible.sync="visible"
            :before-close="dialogClose">
    <template slot="title">
      <span>
        资源回流
        <c-tooltip placement="right" popper-class="cls-form-label-tip">
          <div slot="content">可选择私有资源回流至对应的组件资源开发列表，若引用其它私有资源，将一起回流。</div>
          <i class="cls-icon-info"></i>
        </c-tooltip>
      </span>
    </template>
    <c-form ref="deployDialogForm" label-position="top" :model="postFormData" :rules="rules" @submit.native.prevent>

      <c-form-item v-if="!!page.total" :rules="rules.backFlowRange">
        <template slot="label">
          <span>
            选择回流范围
          </span>
        </template>
        <c-radio-group v-model="postFormData.backFlowRange" @change="radioChange">
          <c-radio v-for="(item, k) in backFlow" :key="k" :label="k">{{ item }}</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-form-item v-if="postFormData.backFlowRange=='parts'" label="选择回流资源" prop="backFlowIds" :rules="rules.backFlowIds">
        <div class="header-wrap">
          <div class="left-top">
            <div class="search-item">
              <span>资源名称</span>
              <c-input
                v-model="requestForm.assetName"
                placeholder="请输入"
                clearable
                class="all-input"
                size="small"
              />
            </div>
            <div
              class="search-item"
            >
              <span>资源编码</span>
              <c-input
                v-model="requestForm.assetCode"
                placeholder="请输入"
                clearable
                class="all-input"
                size="small"
              />
            </div>

          </div>
          <div class="right-top">

            <c-button
              type="gradual"
              size="small"
              @click="search"
            >
              搜索
            </c-button>
          </div>
        </div>
        <c-table
          ref="multipleTable"
          :data="privateAssets"
          :height="200"
          style="width:100%;line-height: 1;"
          @select="userClickSelect"
          @select-all="userClickSelect">
          <c-table-column
            type="index"
            label=""
            width="50">
          </c-table-column>
          <c-table-column
            type="selection"
            width="45"
          />
          <c-table-column
            prop="assetName"
            label="资源名称"
            show-overflow-tooltip
          >
          </c-table-column>
          <c-table-column
            prop="assetCode"
            label="资源编码"
            show-overflow-tooltip
          >
          </c-table-column>
          <c-table-column
            prop="assetType"
            label="资源类型"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ assetTypeFilter(scope.row) }}
            </template>
          </c-table-column>
        </c-table>
      </c-form-item>
      <div v-if="postFormData.backFlowRange=='parts'" class="cls-pagination">
        <c-pagination
          :current-page="page.pageNum"
          :page-size="page.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="page.total"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="dialogClose">取消</c-button>
      <c-button type="gradual" size="small" @click="postApp()">确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
import { appReferAsset, backFlow } from '@/api/index'
import { getAssetTypeLabel } from '@/utils';
export default {
  name: 'BackDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    appId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      rules: {

        backFlowRange: {
          required: true,
          validator: (rule, val, cb) => {
            cb();
          },
          trigger: 'change'
        },
        // backFlowIds: {
        //   required: true,
        //   validator: (rule, val, cb) => {
        //     if (this.postFormData.backFlowRange === 'parts') {
        //       const selects = Object.values(this.privateAssetsSelects).filter(d => !!d)
        //       if (!selects.length) {
        //         cb('请选择需要回流的资源')
        //       }
        //     }
        //     cb();
        //   }
        // },
        subAssetAuthList: {
          required: true,
          validator: (rule, val, cb) => {
            cb();
          },
          trigger: 'blur'
        },
        clientId: {
          validator: (rule, val, cb) => {
            if (val) {
              return cb()
            }
            cb('ClientId不能为空！');
          },
          trigger: 'blur'
        },
        clientSecret: {
          validator: (rule, val, cb) => {
            if (val) {
              return cb()
            }
            cb('ClientSecret不能为空！');
          },
          trigger: 'blur'
        }
      },
      privateAssets: [],
      requestForm: {
        assetName: '',
        assetCode: ''
      },
      postFormData: {
        id: '',
        version: '',
        versionDesc: '',
        backFlowRange: 'parts'

      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      privateAssetsSelects: {},
      backFlow: {
        'parts': '部分私有资源',
        'all': '全部私有资源'
      }
    };
  },
  watch: {

  },
  mounted() {
    this.getAppReferAsset()
  },
  methods: {
    assetTypeFilter(v) {
      v.subtype = v.subType || v.subtype
      const res = getAssetTypeLabel(v.assetType, v.subtype)
      return res
    },
    radioChange(val) {
      if (val === 'parts') {
        this.getAppReferAsset()
      }
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getAppReferAsset()
    },
    handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum
      this.getAppReferAsset()
    },
    viewSubscription() {
      const route = this.$router.resolve({
        path: '/subscription-management/asset-subscription',
        query: {
        }
      })
      window.open(route.href, '_blank')
    },
    search() {
      this.getAppReferAsset()
    },
    getAppReferAsset() {
      // 获取私有资产数据
      const params = {
        ...this.requestForm,
        appId: this.appId,
        assetRange: 1,
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum
      }
      appReferAsset(params).then(res => {
        this.privateAssets = res.data.list
        this.page.pageNum = res.data.currPage
        this.page.total = res.data.total
        this.$nextTick(() => {
          this.privateAssets.forEach((d, i) => {
            const flag = !!this.privateAssetsSelects[d.assetId]
            this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(this.privateAssets[i], flag)
          })
        })
      })
    },
    resetPostDailog() {
      this.postDailogFlag = false;
      this.page = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      this.resetPostFormData();
    },
    resetPostFormData() {
      Object.keys(this.postFormData).forEach(k => {
        this.postFormData[k] = ''
      })
      this.postFormData.backFlowRange = 'all'
    },
    userClickSelect(arrs) {
      this.privateAssets.forEach(d => {
        if (arrs.find(dd => dd.assetId === d.assetId)) {
          this.privateAssetsSelects[d.assetId] = d
        } else {
          this.privateAssetsSelects[d.assetId] = null
        }
      })
    },
    dialogClose() {
      this.$emit('close')
    },
    postApp() {
      this.$refs.deployDialogForm.validate((valid) => {
        if (!valid) {
          return;
        }
        if (this.postFormData.backFlowRange === 'parts') {
          const selects = Object.values(this.privateAssetsSelects).filter(d => !!d)
          if (!selects.length) {
            return this.$message({
              message: '请选择需要回流的资源',
              type: 'warning'
            })
          }
        }
        let selects = []
        if (this.postFormData.backFlowRange === 'parts') {
          selects = Object.values(this.privateAssetsSelects).filter(d => !!d).map(d => d.assetId)
        }
        const loading = this.$loading({
          lock: true,
          text: '回流中...',
          fullscreen: false,
          background: 'rgba(0, 0, 0, 0)'
        });
        const params = {
          id: this.appId,
          backFlowRange: this.postFormData.backFlowRange,
          backFlowIds: selects
        }
        backFlow(params).then((res) => {
          if (res.code * 1 === 0) {
            this.$message.success('操作成功');
            this.$emit('close')
          }
          loading.close()
          this.resetPostDailog()
        }).catch(() => {
          loading.close()
        });
        return;
      });
    }
  }
};
</script>
<style scoped lang="scss">
.form-item-half {
  display: inline-block;
  width: 50%;
}

::v-deep.col1 .c-form-item {
  padding-left: 0 !important;
}

::v-deep.c-form {
  .c-form-item__label {
    color: #8A8A8A;
  }
}
.header-wrap {
    height: 38px;
    width: 100%;
    box-sizing: border-box;
    margin-bottom: 26px;
    // border-bottom: 1px solid rgba(244, 244, 244, 1);
    // padding: 0 32px 0 12px;
    align-items: center;
    display: flex;
    justify-content: space-between;
    .left-top {
      width: calc(100% - 40px);
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .search-item {
        font-size: 14px;
        width: 45%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-right: 24px;
        &:last-child {
          margin-right: 0px;
        }
        span {
          width: 57px;
          text-align: right;
        }
        .all-input {
          width: calc(100% - 70px);
        }
      }
    }
    .right-top {
      align-items: center;
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
