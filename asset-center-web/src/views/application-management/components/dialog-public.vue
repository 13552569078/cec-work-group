<!--/*
* @Author: dingli
* @Desc: 应用发布
* @Date: 2022-4-22
*/-->
<template>
  <c-dialog
    :class="'dialog-center asset-post'"
    width="600px"
    :visible.sync="postDailogFlag"
    :before-close="resetPostDailog"
    @close="dialogClose"
  >
    <div slot="title">
      <span class="title-span">应用发布</span>
      <c-tooltip placement="top" popper-class="cls-form-label-tip">
        <div slot="content">应用发布后不可取消</div>
        <i class="cls-icon-info" />
      </c-tooltip>
    </div>
    <c-form
      v-if="postDailogFlag"
      ref="postFormData"
      :model="postFormData"
      label-position="top"
      class="cls-form"
      @submit.native.prevent
    >
      <c-form-item label="版本号" prop="version" :rules="rules.version">
        <div class="csl-version">
          <span>v</span>
          <c-input-number
            v-model="postFormData.packVersion1"
            :min="0"
            :max="99"
            :controls="false"
            :precision="0"
            class="input-version"
            placeholder="" />.
          <c-input-number
            v-model="postFormData.packVersion2"
            :min="0"
            :max="99"
            :controls="false"
            :precision="0"
            class="input-version"
            placeholder="" />.
          <c-input-number
            v-model="postFormData.packVersion3"
            :min="0"
            :max="99"
            :controls="false"
            :precision="0"
            class="input-version"
            placeholder="" />
          <span>最新版本为 <span style="color: #36A4FF;">{{ newVersion }}</span> </span>
        </div>
      </c-form-item>
      <c-form-item label="版本说明" prop="versionDesc" :rules="rules.versionDesc">
        <c-input
          v-model="postFormData.versionDesc"
          size="small"
          resize="none"
          type="textarea"
          maxlength="200"
          placeholder="请输入"
          show-word-limit
          :rows="3"
          clearable
        />
      </c-form-item>

    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="resetPostDailog"
      >取消</c-button>
      <c-button type="gradual" size="small" @click="postApp()"
      >确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
import { newestVersion } from '@/api'
import { getAssetTypeLabel } from '@/utils';
import { changePostStatusApp, subAssetList, appReferAsset } from '@/api/index';
export default {
  name: 'DialogPublic',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      postDailogFlag: false,
      newVersion: '',
      tableData: [],
      privateAssets: [],
      postFormData: {
        id: '',
        version: '',
        versionDesc: '',
        backFlowRange: 'all',
        packVersion1: undefined,
        packVersion2: undefined,
        packVersion3: undefined
      },
      rules: {
        version: {
          required: true,
          validator: (rule, val, cb) => {
            const msg = '请输入版本号'
            const v1 = this.postFormData.packVersion1
            const v2 = this.postFormData.packVersion2
            const v3 = this.postFormData.packVersion3
            if (!(v1 !== undefined && v2 !== undefined && v3 !== undefined)) return cb(msg)
            if (this.compare((v1 + '.' + v2 + '.' + v3), this.newVersion.replace('v', '')) !== 1) {
              return cb('版本号必须大于最新版本号')
            }
            cb()
          },
          trigger: ['change', 'blur']
        },
        versionDesc: [
          { required: true, message: '请输入版本说明', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        backFlowRange: {
          required: true,
          validator: (rule, val, cb) => {
            cb();
          },
          trigger: 'change'
        },
        backFlowIds: {
          required: true,
          validator: (rule, val, cb) => {
            if (this.postFormData.backFlowRange === 'parts') {
              const selects = Object.values(this.privateAssetsSelects).filter(d => !!d)
              if (!selects.length) {
                cb('请选择需要回流的资源')
              }
            }
            cb();
          },
          trigger: 'change'
        },
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
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      privateAssetsSelects: {},
      backFlow: {
        'all': '全部私有资源',
        'parts': '部分私有资源',
        'none': '不回流'
      }
    };
  },
  watch: {
    visible(nv) {
      this.postDailogFlag = nv
      if (nv) {
        this.getSubAssetList()
        this.getAppReferAsset()
        this.getNewestVersion()
      } else {
        this.postFormData = {
          id: '',
          version: '',
          versionDesc: '',
          backFlowRange: 'all',
          packVersion1: undefined,
          packVersion2: undefined,
          packVersion3: undefined
        }
      }
    }
  },
  methods: {
    compare(version1, version2) {
      const arr1 = version1.split('.');
      const arr2 = version2.split('.');
      const length = Math.max(arr1.length, arr2.length);
      for (let i = 0; i < length; i++) {
        const n1 = Number(arr1[i] || 0)
        const n2 = Number(arr2[i] || 0)
        if (n1 > n2) return 1
        if (n1 < n2) return -1
      }
      return 0
    },
    getNewestVersion() {
      newestVersion({
        resourceType: 'app',
        code: this.data.appCode
      }).then(res => {
        this.newVersion = res.data.version || 'v0.0.0'
      })
    },
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
    userClickSelect(arrs) {
      this.privateAssets.forEach(d => {
        if (arrs.find(dd => dd.assetId === d.assetId)) {
          this.privateAssetsSelects[d.assetId] = d
        } else {
          this.privateAssetsSelects[d.assetId] = null
        }
      })
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
    async getSubAssetList() {
      try {
        const params = {
          appCode: this.data.appCode,
          version: this.data.version
        }
        const res = await subAssetList(params)
        this.tableData = res.data.map(d => ({ clientId: '', clientSecret: '', ...d }))
      } catch (e) {
        // e
      }
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
    postApp() {
      this.$refs.postFormData.validate((valid) => {
        if (!valid) {
          return;
        }
        let selects = []
        if (this.postFormData.backFlowRange === 'parts') {
          selects = Object.values(this.privateAssetsSelects).filter(d => !!d).map(d => d.assetId)
        }
        const loading = this.$loading({
          lock: true,
          text: '发布中...',
          fullscreen: false,
          background: 'rgba(0, 0, 0, 0)'
        });
        const params = {
          id: this.data.id,
          version: 'v' + this.postFormData.packVersion1 + '.' + this.postFormData.packVersion2 + '.' + this.postFormData.packVersion3,

          versionDesc: this.postFormData.versionDesc,
          flag: 1,
          backFlowRange: this.postFormData.backFlowRange,
          backFlowIds: selects
        }
        params.subAssetAuthList = this.tableData.map((d, i) => {
          const item = {
            assetCode: d.assetCode,
            clientId: this.postFormData[`clientId-${i}`],
            clientSecret: this.postFormData[`clientSecret-${i}`],
            version: d.version
          }
          return item
        })
        changePostStatusApp(params).then((res) => {
          if (res.code * 1 === 0) {
            this.$message.success('操作成功');
            this.$emit('ok')
          }
          loading.close()
          this.resetPostDailog()
        }).catch(() => {
          loading.close()
        });
        return;
      });
    },
    dialogClose() {
      this.$emit('close')
    },
    getAppReferAsset() {
      // 获取私有资产数据
      const params = {
        appId: this.data.id,
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
    }
  }
};
</script>
<style scoped lang="scss">
.cls-click {
  padding-left: 8px;
  position: absolute;
  top: -6px;
  z-index: 100;
  cursor: pointer;
}
::v-deep.c-table.cls-table {
  tr td {
    padding: 0;
    .c-form-item {
      margin-top: 14px;
      margin-bottom: 14px;
    }
    .c-form-item.is-error {
      margin-top: 8px;
      margin-bottom: 20px;
    }
  }
}
.cls-form {
  max-height: 600px;
  overflow-y: auto;
}
.cls-pagination .c-pagination {
  padding-right: 0 !important;
}
::v-deep.asset-post .c-dialog__body-wrap {
  padding-right: 0 !important;
  .cls-form {
    padding-right: 28px;
  }
}
::v-deep.csl-version {
  display: flex;
  .input-version {
    margin: 0 4px;
    width: 35px;
    .c-input__inner {
      width: 35px;
      padding: 0 !important;
    }
  }
}
</style>
