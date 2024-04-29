<template>
  <c-dialog :class="'dialog-center'" :title="'资源申请'" width="1048px" :visible.sync="dialogFlag"
            append-to-body :before-close="cancel">

    <c-form ref="formData" :model="formData" class="cls-model-form" label-position="top"
            :class="isView?'disabled-new':''" :rules="isView?{}:rules" label-width="100px"
            @submit.native.prevent>
      <c-row :gutter="26">
        <c-col :span="12">
          <c-form-item label="被申请资源" prop="oldappName" class="">
            <c-input v-model="formData.oldappName" size="small" disabled :placeholder="'请输入被申请资源'"
                     type="text" maxlength="20"></c-input>
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="适用终端" prop="assetSubtypeList" class="">
            <c-checkbox-group v-model="formData.assetSubtypeList" disabled>
              <c-checkbox v-if="assetSubtype.indexOf('3')!==-1" label="3">PC</c-checkbox>
              <c-checkbox v-if="assetSubtype.indexOf('4')!==-1" label="4">H5</c-checkbox>
            </c-checkbox-group>
          </c-form-item>
        </c-col>
        <c-col :span="24">
          <c-form-item label="申请类型" prop="applyType" class="">
            <div class="applytype-wrap">
              <div
                class="applytype-item"
                :class="{active:formData.applyType==3,disabled:applyType.indexOf('3')===-1}"
                @click="clickApplytype('3')">
                <h3>权限分配</h3>
                <p>{{ applyTypeTipsMap[3] }}</p>
              </div>
              <!-- <div
                class="applytype-item"
                :class="{active:formData.applyType==4,disabled:applyType.indexOf('4')===-1}"
                @click="clickApplytype('4')">
                <h3>独立部署</h3>
                <p>{{ applyTypeTipsMap[4] }}</p>
              </div> -->
              <div
                class="applytype-item"
                :class="{active:formData.applyType==1,disabled:applyType.indexOf('1')===-1}"
                @click="clickApplytype('1')">
                <h3>资源下载</h3>
                <p v-if="buildChannel==2">{{ applyTypeTipsMap['1_buildChannel2'] }}</p>
                <p v-else>{{ applyTypeTipsMap[1] }}</p>
              </div>
            </div>
            <!-- <c-radio-group v-model="formData.applyType">
              <c-radio :label="3" :disabled="applyType.indexOf('3')===-1">权限分配</c-radio>
              <c-radio :label="4" :disabled="applyType.indexOf('4')===-1">独立部署</c-radio>
              <c-radio :label="1" :disabled="applyType.indexOf('1')===-1">资源下载</c-radio>
            </c-radio-group> -->
          </c-form-item>
        </c-col>
        <c-col v-if="formData.applyType!=3" :span="12">
          <c-form-item label="申请资源主体" prop="referPackVersionId" class="">
            <c-select v-model="formData.referPackVersionId"
                      filterable
                      style="width:100%"
                      size="small"
                      :specific-suffix="true" placeholder="请选择" @change="referChange">
              <c-option
                v-for="item in referPackList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </c-option>
            </c-select>
          </c-form-item>
        </c-col>
        <c-col v-if="formData.applyType==4" :span="12">
          <c-form-item label="应用名称" prop="appName" class="">
            <c-input v-model="formData.appName" size="small" :placeholder="isView ? '' : '请输入应用名称'"
                     type="text" maxlength="20"></c-input>
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="26">
        <c-col :span="12">
          <c-form-item label="申请地区" prop="district" class="">
            <c-cascader
              v-model="formData.district"
              style="width:100%"
              :options="areaSelectData"
              specific-suffix
              size="small"
              placeholder="请选择" />
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="申请部门" prop="buildDeptId" class="">
            <cestcTreeSelect
              ref="refBuildDept"
              v-model="formData.buildDeptId"
              style="width:100%"
              :search="true"
              :props="{
                label: 'orgName',
                value: 'id',
                children: 'children'
              }"
              :options="tenantOrganizationsData"
              @getValue="buildDeptIdChange"
            />
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="联系人" prop="contactUserId" class="">
            <c-select
              ref="refcontactUserId"
              v-model="formData.contactUserId"
              style="width:100%"
              specific-suffix
              clearable
              filterable
              placeholder="请选择"
              @change="contactUserChange">
              <c-option v-for="d in userListData" :key="d.empId" :label="d.empName" :value="d.empId" />
            </c-select>
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="电话" prop="contactPhone" class="">
            <c-input v-model="formData.contactPhone" size="small" :placeholder="isView ? '' : '请输入'"
                     type="text" maxlength="20"></c-input>
          </c-form-item>
        </c-col>
        <c-col :span="12">
          <c-form-item label="邮箱" prop="contactEmail" class="">
            <c-input v-model="formData.contactEmail" size="small" :placeholder="isView ? '' : '请输入'"
                     type="text" maxlength="20"></c-input>
          </c-form-item>
        </c-col>
        <c-col :span="24">
          <c-form-item label="使用场景" prop="appDesc" class="">
            <c-input v-model="formData.appDesc" type="textarea" :placeholder="isView ? '' : '请输入'"
                     :disabled="isView" maxlength="200" :autosize="isView?true:false" show-word-limit>
            </c-input>
          </c-form-item>
        </c-col>
        <c-col :span="24">
          <c-form-item label="附件" prop="filePath" class="full-form-item no-margin">
            <c-upload
              :action="UPLOAD_URL"
              :limit="1"
              accept=".zip,.rar,.7z"
              :on-remove="handleRemoveReport"
              :on-success="handleUploadReport"
              :before-upload="beforeUploadReport"
              :file-list="formData.filePath"
              :on-preview="handlePreview"
              style="width:320px">
              <c-button size="small" type="primary">选择文件</c-button>
              <div slot="tip" class="c-upload__tip">请上传RAR/ZIP/7Z等压缩包格式文档，大小不能超过100M</div>
            </c-upload>
          </c-form-item>
        </c-col>
      </c-row>
      <a
        ref="refDownloadFile"
        :href="download.url"
        :download="download.name"
      ></a>
    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="" @click="cancel">取消</c-button>
      <c-button type="primary" size="small" @click="confirmBtnClick">确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import {
  packAppApply,
  allTenantOrganizations,
  appRegistList,
  queryPublishDetailApp,
  userInfoByTenant
} from '@/api/index'
import { regionData, CodeToText } from 'element-china-area-data'// 地址级联选择器
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import cestcTreeSelect from '@/components/cestc-tree-select'
import { DefaultValue } from '@/config/index'
import { checkPhoneOrTell, checkEmail } from '@l/utils/validate.js'
import { applyTypeTipsMap } from '@/config/index'
export default {
  name: 'AssetApply',
  components: {
    cestcTreeSelect
  },
  props: {
    packVersionId: {
      type: [String, Number],
      default: ''
    },
    appName: {
      type: [String, Number],
      default: ''
    },
    dialogFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      defaultValue: DefaultValue,
      applyTypeTipsMap,
      saveBtnFlag: true,
      areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
      tenantOrganizationsData: [],
      applyType: ['1', '3', '4'],
      assetSubtype: [],
      userListData: [],
      pageTopBtns: [
        {
          type: 'primary',
          disabled: false,
          label: '保存'
        }
      ],
      referPackList: [],
      formData: {
        packVersionId: this.packVersionId,
        oldappName: this.appName,
        appName: '',
        applyType: '',
        assetSubtypeList: this.assetSubtype,
        referPackVersionId: '',
        appDesc: '',
        district: '',
        buildDeptId: [],
        contactUserId: '',
        contactPhone: '',
        contactEmail: ''
      },
      span: 24,
      options: [
      ],
      rules: {
        oldappName: [
          {
            required: true,
            message: '请输入被申请资源',
            trigger: 'blur'
          }
        ],
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
          { max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ],
        applyType: [
          { required: true, message: '请选择申请类型', trigger: 'blur' }
        ],
        assetSubtypeList: [
          { required: true, message: '请选择发布端', trigger: 'blur' }

        ],
        referPackVersionId: [
          { required: true, message: '请选择申请资源主体', trigger: 'blur' }
        ],
        appDesc: [
          { required: true, message: '请输入使用场景', trigger: 'blur' },
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        district: [
          { required: true, message: '请选择申请地区', trigger: 'blur' }
        ],
        buildDeptId: [
          { required: true, message: '请选择申请部门', trigger: 'blur' }
        ],
        contactUserId: [
          { required: true, message: '请选择联系人', trigger: 'blur' }
        ],
        contactPhone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          {
            required: true,
            validator: (rule, val, cb) => {
              if (!val) return cb('请输入正确的电话号码')
              if (!checkPhoneOrTell(val)) return cb('请输入正确的电话号码')
              cb()
            }, trigger: ['change', 'blur'] }
        ],
        contactEmail: [
          {
            required: false,
            validator: (rule, val, cb) => {
              if (!val) return cb()
              if (!checkEmail(val)) return cb('请输入正确的邮箱')
              cb()
            }, trigger: ['change', 'blur'] }
        ]
      },
      processLog: '',
      buildChannel: '',
      isView: false,
      download: {}
    }
  },
  created() {
    this.getAllTenantOrganizations()
    this.userInfoInit()
    this.getPublishDetailApp()
  },
  methods: {
    clickApplytype(val) {
      if (this.applyType.indexOf(val) === -1) return
      this.$set(this.formData, 'applyType', val)
      this.$refs.formData.validateField('applyType')
    },
    referChange(data) {
      this.formData.appName = this.referPackList.find(item => item.value === data).label
    },
    getPublishDetailApp() {
      queryPublishDetailApp({
        packVersionId: this.packVersionId
      }).then(res => {
        console.log(res, 'res')
        this.applyType = res.data.applyType && (res.data.applyType + '').split(',')
        this.assetSubtype = res.data.assetSubtype && (res.data.assetSubtype + '').split(',')
        this.buildChannel = res.data.buildChannel

        this.formData.assetSubtypeList = this.assetSubtype
        this.getReferPackList()
      })
    },
    getReferPackList() {
      appRegistList({
        buildChannel: +this.buildChannel === 2 ? '' : this.buildChannel,
        appStatusList: +this.buildChannel === 2 ? [1, 2] : [1]
      }).then(res => {
        this.referPackList = res.data.map(item => ({
          value: item.packVersionId,
          label: item.packName
        }))
      })
    },
    handlePreview(file) {
      file.url = file.url || file.response.data.relativePath
      // 点击文件列表的狗子函数
      this.download.name = file.name
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${file.url}&filename=${encodeURI(file.name)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    handleRemoveReport(file, fileList) {
      // 可研报告删除
      if (this.isview) return false
      this.formData.filePath = fileList
    },
    handleUploadReport(response, file, fileList) {
      // 可研报告 上传成功
      if (response.code !== 0) {
        this.formData.filePath = []
        this.$message.error(response.msg || '上传失败')
      } else {
        this.formData.filePath = fileList
      }
    },
    beforeUploadReport(file) {
      console.log(file, '----beforeUploadReport')
      const reg = /\.(zip|rar|7z|gz|bz|ar|car|cpgz|dar)$/i
      if (!reg.test(file.name)) {
        this.$message.warning('请上传RAR/ZIP/7Z等压缩包格式文档，大小不能超过100M')
        return false
      }
      // 可研报告 上传前狗子，单个不能超过100M
      const limit = 100 * 1024 * 1024
      if (file.size > limit) {
        this.$message.warning('单个文件不能超过100M')
        return false
      }
      return true
    },
    userInfoInit() {
      const { orgid, mobileNo, empid, email, empname, orgname } = this.$store.state.user.userInfo || {}
      this.userListData = [{ empId: empid, mobileNo, email, empName: empname }]
      orgid && this.$set(this.formData, 'buildDeptId', [orgid])
      empid && this.$set(this.formData, 'contactUserId', empid)
      mobileNo && this.$set(this.formData, 'contactPhone', mobileNo)
      email && this.$set(this.formData, 'contactEmail', email)
      this.formData.buildDeptName = orgname
      this.formData.contactName = empname
      this.getUserInfoByTenant(orgid)
    },
    getAllTenantOrganizations() {
      this.tenantOrganizationsData = []
      allTenantOrganizations().then(res => {
        this.tenantOrganizationsData = res.data || []
      })
    },
    cancel() {
      this.close()
    },
    confirmBtnClick() {
      if (this.saveBtnFlag) {
        this.saveBtnFlag = false
        this.onSave()
      }
    },
    buildDeptIdChange(data) {
      const id = data[0] && data[0].id || ''
      this.getUserInfoByTenant(id)
      this.$set(this.formData, 'contactUserId', '')
      this.$set(this.formData, 'contactPhone', '')
      this.$set(this.formData, 'contactEmail', '')
      this.formData.buildDeptName = data[0] && data[0].orgName
      this.$nextTick(() => {
        this.$refs.formData.clearValidate(['contactUserId', 'contactPhone', 'contactEmail'])
      })
    },
    getUserInfoByTenant(orgid) {
      if (!orgid) return
      const params = { orgId: orgid }
      userInfoByTenant(params).then(res => {
        this.userListData = res.data || []
      }).catch(() => {
        this.userListData = []
      })
    },
    contactUserChange(v) {
      const user = this.userListData.find(d => d.empId === v)
      if (!user) return
      this.$set(this.formData, 'contactPhone', user.mobileNo)
      this.$set(this.formData, 'contactEmail', user.email)
      console.log(user, 'user.empname')
      this.formData.contactName = user.empName

      this.$nextTick(() => {
        this.$refs.formData.clearValidate(['contactPhone', 'contactEmail'])
      })
    },
    close(flag = false) {
      this.$emit('close', flag)
    },
    onSave() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.formData.district) {
            this.formData.districtText = this.formData.district.map(d => CodeToText[d]).join('/')
          }
          const addData = {
            packVersionId: this.formData.packVersionId,
            applyType: this.formData.applyType,
            referPackVersionId: this.formData.referPackVersionId,
            appName: this.formData.appName,
            assetSubtypeList: this.formData.assetSubtypeList.join(','),
            applyExtendInfo: JSON.stringify(this.formData)
          }
          packAppApply(addData)
            .then((res) => {
              if (res.code === 0) {
                this.close(true)
              }
              this.saveBtnFlag = true
            })
            .catch((e) => {
              this.saveBtnFlag = true
              console.error(e)
            })
        } else {
          console.log('check invalid')
          this.saveBtnFlag = true
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.cls-model-form {
  max-height: 550px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-footer {
  text-align: right;
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

}
.no-margin{
  margin: 0;
}
.full-form-item {
  width: 48.5%;
  display: block;
}
.half-form-item {
  width: 48.5%;
  display: inline-block;
  margin-right: 20px;
  &:nth-child(2n+1){
    margin-right: 0px;
  }
}
.applytype-wrap {
  display: flex;
  gap: 20px;
  // justify-content: space-between;
  .applytype-item {
    width: 311px;
    height: 136px;
    padding: 16px 20px;
    background: url(~@/assets/imgs/applytype-default.png) no-repeat center;
    background-size: 100%;
    cursor: pointer;
    h3 {
      margin-bottom: 12px;
      color: #4b4b4b;
      font-family: PingFangSC-Medium;
      font-size: 16px;
      font-weight: 500;
    }
    p {
      color: #8A8A8A;
      line-height: 22px;
    }
    &.active {
      background: url(~@/assets/imgs/applytype-active.png) no-repeat center;
      background-size: 100%;
    }
    &.disabled {
      background: url(~@/assets/imgs/applytype-disable.png) no-repeat center;
      background-size: 100%;
      cursor: no-drop;
      h3, p {
        color: #bdbdbd;
      }
    }
  }
}
.c-form.c-form--label-top .c-form-item {
  padding-left: 10px;
}
</style>
