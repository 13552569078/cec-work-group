<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-form ref="refFormInfo" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="assetInfo">关联资源</h3>
      <c-form-item label="API资源" prop="apiResource" :rules="rules.apiResource">
        <div v-show="!(isview||(disabledkey=='public'||disabledkey=='update'))">
          <c-button size="small" @click="clickAddApi">新增</c-button>
        </div>
        <c-table
          :data="formData.apiResource"
          :border="true"
          style="margin-top:20px;margin-bottom: 8px;"
        >
          <c-table-column type="index" label="#" width="80">
            <template slot-scope="scope">{{ scope.$index+1 }}</template>
          </c-table-column>
          <c-table-column label="接口名称" prop="name" show-overflow-tooltip />
          <c-table-column label="版本号" prop="version" show-overflow-tooltip />
          <c-table-column label="创建人" prop="createUserName" show-overflow-tooltip />
          <c-table-column v-if="isview" label="标签" prop="tags" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ Array.isArray(scope.row.tags)?scope.row.tags.join(','):'' }}
            </template>
          </c-table-column>
          <c-table-column label="接口描述" prop="desc" show-overflow-tooltip />
          <c-table-column fixed="right" label="操作" :width="120">
            <template slot-scope="scope">
              <btn-group
                :btns="getbtns(scope.row)"
                @handleClick="handleOperateClick" />
            </template>
          </c-table-column>
        </c-table>
      </c-form-item>
      <c-form-item label="其他资源" prop="otherResource" :rules="rules.inputRequired">
        <vue-tinymce
          key="otherResource"
          :height="200"
          :editor-content="formData.otherResource"
          :status="isview?1:0"
          :disabled="disabledkey=='public'||disabledkey=='update'"
          class="cls-tinymce"
          @editorBlur="editorBlur"
        />
      </c-form-item>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="versionInfo">版本信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="版本号" prop="packVersion" :rules="rules.version">
            <div v-if="isview">{{ formData.packVersion }}</div>
            <div v-else class="csl-version">
              <span>v</span>
              <c-input-number
                v-model="formData.packVersion1"
                :min="0"
                :max="99"
                :controls="false"
                :precision="0"
                :disabled="(disabledkey=='public'||disabledkey=='update')"
                class="input-version"
                placeholder="" />.
              <c-input-number
                v-model="formData.packVersion2"
                :min="0"
                :max="99"
                :controls="false"
                :precision="0"
                :disabled="(disabledkey=='public'||disabledkey=='update')"
                class="input-version"
                placeholder="" />.
              <c-input-number
                v-model="formData.packVersion3"
                :min="0"
                :max="99"
                :controls="false"
                :precision="0"
                :disabled="(disabledkey=='public'||disabledkey=='update')"
                class="input-version"
                placeholder="" />
            </div>
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="16">
          <c-form-item label="版本说明" prop="packVersionDesc" :rules="rules.inputRequired">
            <c-input
              v-model="formData.packVersionDesc"
              type="textarea"
              maxlength="200"
              :rows="4"
              :disabled="(disabledkey=='public'||disabledkey=='update')"
              :autosize="isview?true:false"
              resize="none"
              show-word-limit
              placeholder="请输入" />
          </c-form-item>
        </c-col>
      </c-row>
    </div>
    <c-dialog
      :class="'dialog-center'"
      title="选择关联资源"
      width="1080px"
      :visible.sync="dialogFlag"
      append-to-body
      :before-close="closeDialog">
      <div class="cls-dialog-search-wrap">
        <c-input-search v-model="searchVal" clearable @search="handleSearch" @clear="handleSearch"></c-input-search>
      </div>
      <c-table
        ref="refDialogTable"
        :height="450"
        :data="apiResourceFromTable"
        @selection-change="handleTableSelection"
      >
        <c-table-column type="selection" width="55" />
        <c-table-column type="index" label="" width="80">
          <template slot-scope="scope">{{ scope.$index+1 }}</template>
        </c-table-column>
        <c-table-column label="接口名称" prop="name" show-overflow-tooltip />
        <c-table-column label="版本号" prop="version" show-overflow-tooltip />
        <c-table-column label="创建人" prop="createUserName" show-overflow-tooltip />
        <!-- <c-table-column label="所属组织" prop="orgName" show-overflow-tooltip /> -->
        <!-- <c-table-column label="标签" prop="tags" show-overflow-tooltip /> -->
        <c-table-column label="接口描述" prop="desc" show-overflow-tooltip />
      </c-table>
      <div slot="footer" class="dialog-footer">
        <c-button size="small" type="" @click="closeDialog">取消</c-button>
        <c-button type="primary" size="small" @click="okDialog">确定</c-button>
      </div>
    </c-dialog>
    <dialogApiInfo :visible="!!dialogApiInfoFlag" :bizcode="dialogApiInfoFlag" @close="dialogApiInfoFlag=''" />
  </c-form>
</template>
<script>
import vueTinymce from '@/components/tinymce'
import { queryApimList } from '@/api/index'
import dialogApiInfo from '@/components/dialog-api-info.vue'
export default {
  name: '',
  components: { vueTinymce, dialogApiInfo },
  props: {
    isview: Boolean,
    disabledkey: String,
    shopCode: String
  },
  data() {
    return {
      formData: {
        packVersion1: undefined,
        packVersion2: undefined,
        packVersion3: undefined,
        apiResource: [],
        otherResource: ''
      },
      rules: {
        apiResource: {
          required: true,
          validator(rule, val, cb) {
            if (!val.length) return cb('请选择API资源')
            if (val.length > 30) return cb('最多选择30条API资源')
            cb()
          },
          trigger: ['change']
        },
        version: {
          required: true,
          validator: (rule, val, cb) => {
            const msg = '请输入版本号'
            const v1 = this.formData.packVersion1
            const v2 = this.formData.packVersion2
            const v3 = this.formData.packVersion3
            if (!(v1 !== undefined && v2 !== undefined && v3 !== undefined)) return cb(msg)
            cb()
          },
          trigger: ['change', 'blur']
        },
        inputRequired: { required: true, message: '请输入', trigger: ['blur'] }
      },
      dialogFlag: false,
      searchVal: '',
      apiResourceFrom: [],
      apiResourceFromTable: [],
      apiResourceFromTableSelected: [],
      apiResourceAll: [],
      dialogApiInfoFlag: ''
    }
  },
  created() {
    this.getApiList()
  },
  methods: {
    clickAddApi() {
      if (this.formData.apiResource.length >= 30) {
        return this.$message.warning('最多选择30条数据')
      }
      this.apiResourceFromTable = [...this.apiResourceFrom]
      this.dialogFlag = true
    },
    getbtns(row) {
      if (this.isview || (this.disabledkey === 'public' || this.disabledkey === 'update')) {
        return [{ label: '详情', row: row }]
      }
      return [
        { label: '详情', row: row },
        { label: '删除', row: row }
      ]
    },
    handleOperateClick(msg) {
      const { label, row } = msg
      if (label === '详情') {
        this.dialogApiInfoFlag = row.bizCode
      } else if (msg.label === '删除') {
        // 删除后，弹框内再次展示这条数据
        const arr = this.formData.apiResource.filter(d => d.name !== row.name)
        this.$set(this.formData, 'apiResource', arr)
        const newData = this.apiResourceAll.find(d => d.name === row.name) || row
        this.apiResourceFrom.unshift(newData)
      }
      this.$refs.refFormInfo.validateField('apiResource')
    },
    editorBlur(val) {
      this.formData.otherResource = val
    },
    okDialog() {
      // 确定后当前表格删除这条数据
      this.formData.apiResource = [...this.formData.apiResource, ...this.apiResourceFromTableSelected]
      this.apiResourceFrom = this.apiResourceFrom.map(d => {
        const i = this.apiResourceFromTableSelected.findIndex(dd => dd.name === d.name)
        if (i !== -1) return null
        return d
      })
      this.apiResourceFrom = this.apiResourceFrom.filter(d => !!d)
      this.apiResourceFromTableSelected = []
      this.$refs.refDialogTable.clearSelection()
      this.$refs.refFormInfo.validateField('apiResource')
      this.closeDialog()
    },
    closeDialog() {
      this.dialogFlag = false
      this.searchVal = ''
    },
    handleTableSelection(val) {
      this.apiResourceFromTableSelected = val
    },
    handleSearch() {
      if (!this.searchVal) {
        this.apiResourceFromTable = [...this.apiResourceFrom]
      } else {
        // 搜索范围包括【接口名称】、【标签】、【所属组织】、【创建人】、【接口描述】
        this.apiResourceFromTable = this.apiResourceFrom.filter(d => {
          const flagName = d.name && d.name.indexOf(this.searchVal) !== -1
          const flagTag = d.tags && d.tags.includes(this.searchVal)
          const flagOrg = d.orgName && d.orgName.indexOf(this.searchVal) !== -1
          const flagUser = d.createUserName && d.createUserName.indexOf(this.searchVal) !== -1
          const flagDesc = d.desc && d.desc.indexOf(this.searchVal) !== -1
          return flagName || flagTag || flagOrg || flagUser || flagDesc
        })
      }
    },
    async getApiList() {
      try {
        const { data } = await queryApimList({ shopCode: this.shopCode, category: 'zc-category-01' })
        this.apiResourceAll = data
        const apiResourceNames = (this.detailData && this.detailData.designInfo && this.detailData.designInfo.apiResource || []).map(d => d.name)
        this.apiResourceFrom = data.filter(d => {
          if (apiResourceNames.includes(d.name)) {
            return false
          }
          return true
        })
      } catch (e) {
        console.error(e)
      }
    },
    getFormData() {
      this.$refs.refFormInfo.validateField('apiResource')
      const params = { ...this.formData }
      if (this.formData.packVersion1 !== undefined && this.formData.packVersion2 !== undefined && this.formData.packVersion3 !== undefined) {
        params.packVersion = `v${this.formData.packVersion1}.${this.formData.packVersion2}.${this.formData.packVersion3}`
      }
      const designInfo = {}
      designInfo.apiResourceIds = this.formData.apiResource.map(d => d.bizCode)
      designInfo.otherResource = this.formData.otherResource
      params.designInfo = JSON.stringify(designInfo)
      return params
    },
    validateForm() {
      let flag
      this.$refs.refFormInfo.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFormData()
      })
      return flag
    },
    backFill(data) {
      if (!data) return
      data.designInfo = data.designInfo ? JSON.parse(data.designInfo) : {}
      this.detailData = data
      this.$set(this.formData, 'apiResource', data.designInfo.apiResource)
      this.$set(this.formData, 'otherResource', data.designInfo.otherResource)
      this.$set(this.formData, 'packVersion', data.packVersion)
      this.$set(this.formData, 'packVersionDesc', data.packVersionDesc)
      if (data.packVersion) {
        const arr = data.packVersion.match(/(\d{1,})/g)
        this.formData.packVersion1 = arr[0]
        this.formData.packVersion2 = arr[1]
        this.formData.packVersion3 = arr[2]
      }
      if (this.isview) {
        ['otherResource', 'packVersionDesc'].forEach(k => {
          if (!this.formData[k]) {
            this.formData[k] = '--'
          }
        })
        this.$nextTick(() => {
          this.apiResourceFrom = this.apiResourceFrom.filter(d => {
            return !data.designInfo.apiResourceIds.includes(d.bizCode)
          })
          this.$refs.refFormInfo.clearValidate()
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.bg-white {
  padding: 20px 40px;
  margin-bottom: 20px;
  background: white;
  .info-title {
    margin-left: -20px;
  }
}
.cls-dialog-search-wrap {
  margin-bottom: 10px;
  text-align: right;
  ::v-deep.c-input__inner {
    width: 200px;
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
