<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-12-21
-->

<template>
  <div class="kpi-detail">
    <c-form
      ref="dataForm"
      :model="formData"
      label-width="100px"
      class="cls-model-form"
      :class="flag === 'detail'?'disabled-new':''"

      label-position="top"
      :rules="rules"
      :disabled="flag === 'detail'"
      @submit.native.prevent
    >
      <c-form-item
        class="half-form-item"
        label="资源名称"
        prop="assetName"
      >
        <c-input
          v-model="formData.assetName"
          :placeholder="'请输入资源名称'"
          maxlength="20"
          size="small"
          clearable
        />
      </c-form-item>
      <c-form-item
        class="half-form-item"
        prop="assetCode"
      >
        <template slot="label">
          <span>资源编码
            <c-tooltip
              placement="top"
              popper-class="cls-form-label-tip"
            >
              <div slot="content" v-html="AssetCodeToolTipText">
              </div>
              <i class="cls-icon-info"></i>
            </c-tooltip>
          </span>
        </template>
        <c-input
          v-model="formData.assetCode"
          :placeholder="flag === 'detail'?'':'请输入资源编码'"
          size="small"
          clearable
          class="form-input-item "
          :maxlength="flag === 'add'?17:20"
          :disabled="flag !== 'add'"
          @input="formData.assetCode = formData.assetCode.replace(/[^\w]/ig,'')"
        >
          <template v-if="flag === 'add'" slot="prepend">{{ formData.assetCodePrefix }}</template>
        </c-input>
      </c-form-item>
      <c-form-item
        class="half-form-item"
        prop="businessType"
        label="指标类型"
      >
        <c-select
          v-model="formData.businessType"
          style="width:100%"
          :specific-suffix="true"
          size="small"
          :placeholder="flag === 'detail'?'':'请选择'"
        >
          <c-option
            v-for="item in kpiTypeOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </c-select>
      </c-form-item>
      <c-form-item
        v-if="formData.status&&formData.status != 1"
        class="half-form-item"
        label="版本号"
        prop="version"
      >
        <c-input
          v-model="formData.version"
          size="small"
          type="text"
          maxlength="20"
          :placeholder="'请输入版本号'"
          clearable
        />
      </c-form-item>
      <c-form-item
        v-if="flag === 'detail'"
        label="资源状态" prop="version"
        class="half-form-item form-label"
      >
        <span slot="label">
          <span class="lable">资源状态</span>
          <span
            v-if="formData.status!=1||formData.processLog"
            class="log-btn" @click="showLog"
          >查看日志</span>
        </span>
        <span
          class="form-text"
        >{{ formData.status|assetStatusFilter }}</span>
      </c-form-item>
      <c-form-item
        label="资源标签"
        prop="tagIdList"
        class=""
      >
        <div v-if="flag === 'detail'">
          <div v-if="!formData.tagList||!formData.tagList.length">{{ defaultValue }}</div>
          <ctag
            v-for="(tag,index) in formData.tagList"
            :key="index"
            class=" item-tag-content"
            :tag="tag.groupName"
          ></ctag>
        </div>
        <c-cascader
          v-else
          v-model="formData.tagIdList"
          style="width:100%"
          size="small"
          :specific-suffix="true"
          :show-all-levels="false"
          :options="tagTreeDataO"
          :props="{
            multiple: true,
            value: 'groupId',
            label: 'groupName',
            children: 'childList',
            emitPath: false,
          }"
          :placeholder="'请选择'"
          clearable
        />
      </c-form-item>

      <c-form-item
        label="资源描述"
        prop="assetDesc"
      >
        <c-input
          v-model="formData.assetDesc"
          size="small"
          type="textarea"
          maxlength="200"
          :rows="4"
          resize="none"
          show-word-limit
          :autosize="flag === 'detail'?true:false"
          :disabled="flag === 'detail'"
          :placeholder="flag === 'detail' ? '' : '请输入资源描述'"
          clearable
        />
      </c-form-item>
      <c-form-item
        v-if="flag === 'detail'&& formData.status !== 1"
        label="版本说明"
        prop="versionDesc"
      >
        <c-input
          v-model="formData.versionDesc"
          size="small"
          type="textarea"
          maxlength="200"
          :rows="4"
          resize="none"
          show-word-limit
          :autosize="flag === 'detail'?true:false"
          :disabled="flag === 'detail'"
          :placeholder="flag === 'detail' ? '' : ''"
          clearable
        />
      </c-form-item>
      <c-form-item
        v-if="flag ==='detail'"
        class="half-form-item"
        label="创建人"
        prop="createUserName"
      >
        <c-input
          v-model="formData.createUserName"
          size="small"
          clearable
        />
      </c-form-item>
      <c-form-item
        v-if="flag ==='detail'"
        class="half-form-item"
        label="创建时间"
        prop="createTime"
      >
        <c-input
          v-model="formData.createTime"
          size="small"
          clearable
        />
      </c-form-item>
      <c-form-item
        v-if="flag ==='detail'"
        class="half-form-item"
        label="修改人"
        prop="updateUserName"
      >
        <c-input
          v-model="formData.updateUserName"
          size="small"
          clearable
        />
      </c-form-item>
      <c-form-item
        v-if="flag ==='detail'"
        class="half-form-item"
        label="最后修改时间"
        prop="updateTime"
      >
        <c-input
          v-model="formData.updateTime"
          size="small"
          clearable
        />
      </c-form-item>
    </c-form>
    <div
      slot="footer"
      class="dialog-footer"
    >

      <c-button
        v-if="flag!=='detail'"
        size="small" type="ordinary"
        @click="close"
      >取消</c-button>
      <c-button
        v-else
        type="gradual"
        size="small"
        @click="clickDesign"
      >更多</c-button>
      <c-button
        v-if="flag!=='detail'"
        type="gradual"
        size="small"
        @click="flag!=='detail'?save():close(false)"
      >确定</c-button>
    </div>
    <log-dialog :log-dialog-flag="logDialogFlag" :process-log="processLog||defaultValue" @close="logDialogFlag=false;processLog=''"></log-dialog>
  </div>
</template>

<script>
import { changeTreeDataByChildListLength } from '@/utils/helper/tool'
import { kpiDetail, assetCodeExist, assetNameExist } from '@/api/index'
import { kpiAdd } from '@/api/statistics-asset'
import { checkAssetCode, checkAssetName, checkVersion } from '@/utils/validate'
import { AssetCodeToolTipText, DefaultValue } from '@/config/index'
import ctag from '@/components/tags-popover/tag'
import logDialog from '@/views/asset-management/components/log-dialog.vue'

import qs from 'qs'
export default {
  name: 'KpiDetail',
  components: { ctag, logDialog },
  props: {
    flag: {
      type: String,
      default: 'add'
    },
    assetId: {
      type: [String, Number],
      default: ''
    },

    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tagTreeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      kpiTypeOption: [{
        value: 1,
        label: '基础指标'
      }, {
        value: 3,
        label: '指标簇'
      }],
      processLog: '',
      logDialogFlag: false,
      AssetCodeToolTipText,
      defaultValue: DefaultValue,
      tagTreeDataO: [],
      treeDataO: [],
      formData: {
        assetCode: ''
      },
      rules: {
        assetName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { max: 20, message: '最多输入20个字符', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorName(val, cb)
            },
            trigger: 'blur'
          }
        ],
        assetDesc: [
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        assetCode: [
          { required: true, message: '请输入资源编码', trigger: 'blur' },
          { validator: (rule, val, cb) => {
            // 不能重名
            this.validatorCode(val, cb)
          }, trigger: 'blur' }
        ],
        businessType: [
          { required: true, message: '请选择指标类型', trigger: 'blur' },
          { required: true, message: '请选择指标类型', trigger: 'change' }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          },
          {
            validator: (rule, val, cb) => {
              checkVersion(val, cb)
            },
            trigger: 'blur'
          }
        ]

      }
    }
  },
  created() {
    this.tagTreeDataO = this.tagTreeData.map(d => ({
      ...d,
      childList: d.childList.map(dd => ({ ...dd, childList: null }))
    }))
    this.treeDataO = JSON.parse(JSON.stringify(this.treeData))
    changeTreeDataByChildListLength(this.treeDataO)
    if ((this.flag === 'edit' || this.flag === 'detail') && this.assetId) {
      this.getDetail()
    }
  },
  methods: {
    showLog() {
      this.processLog = this.formData.processLog
      this.logDialogFlag = true
    },
    clickDesign() {
      this.close(false)
      setTimeout(() => {
        this.gotoKpiEdit(this.formData)
      }, 200);
    },
    validatorCode(val, cb) {
      if (this.flag !== 'add') {
        // 仅新增状态下可编辑资源编码
        return cb()
      }
      if (!checkAssetCode(val)) {
        return cb('允许字母、数字、下划线最大长度20')
      }
      assetCodeExist(val).then(res => {
        if (res.data && res.data.result * 1 === 1) {
          cb('资源编码已经存在！')
        } else {
          cb()
        }
      })
    },
    validatorName(val, cb) {
      if (this.flag !== 'add') {
        // 仅新增状态下可编辑资源编码
        return cb()
      }
      if (!checkAssetName(val)) {
        return cb('允许中英文、数字、下划线及中横线，最大长度20')
      }
      assetNameExist(val).then(res => {
        if (res.data && res.data.result * 1 === 1) {
          cb('资源名称已经存在！')
        } else {
          cb()
        }
      })
    },

    getDetail() {
      kpiDetail(this.assetId).then(res => {
        this.formData = res.data
        this.formData.tagIdList = res.data.tagList && res.data.tagList.map(item => item.groupId)
        if (this.flag === 'detail') {
          this.rules = {}
          Object.keys(this.formData).forEach(key => {
            if (!this.formData[key] && key !== 'version' && key !== 'processLog') this.formData[key] = this.defaultValue
          })
        }
      })
    },
    save() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) { return }
        if (this.assetId) { // 修改
          return
        } else { // 添加
          kpiAdd({ ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }).then(res => {
            this.close(true)
            setTimeout(() => {
              this.gotoKpiEdit({ assetCode: res.data })
            }, 200);
          })
        }
      })
    },
    gotoKpiEdit({ assetCode, version }) {
      if (window.__systemConfig && window.__systemConfig.kpiEditorUrl) {
        this.$router.push({
          path: '/asset-management/statistics-asset/kpi-asset/edit',
          query: {
            cache: true,
            url: encodeURI(window.__systemConfig.kpiEditorUrl + '?' + qs.stringify({
              embed: 1,
              state: this.flag === 'detail' ? 3 : 2, // 1,新建 2,编辑 3,详情
              system: window.__systemConfig.sysCode,
              code: assetCode,
              version
            }))
          }
        })
      } else {
        this.$message.warning('没有获取到指标平台跳转地址，请刷新页面后重试')
      }
    },
    close(flag = false) {
      this.$emit('close', flag)
    }

  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
  padding-top:12px;
}
.cls-model-form{
  max-height:500px;
  overflow-x: hidden;
  overflow-y: auto;

}
.half-form-item{
  width: 50%;
  display: inline-block;
}
</style>
