<template>
  <c-dialog
    :class="'dialog-center'"
    :title="title"
    width="750px"
    :visible.sync="dialogFlag"
    append-to-body
    :before-close="cancel">
    <c-form
      ref="formData"
      :model="formData"
      class="cls-model-form"
      label-position="top"
      :class="isView?'disabled-new':''"
      :rules="isView?{}:rules"
      @submit.native.prevent>
      <c-row :gutter="30">
        <c-col :span="12">
          <c-form-item v-if="from!='shopCar'" label="下载对象" class="">
            <c-input
              v-model="showData.packName"
              size="small"
              placeholder=""
              disabled
              type="text"
              maxlength="20" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="30">
        <c-col :span="12">
          <c-form-item label="所属地区" prop="district" class="">
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
                     :disabled="isView" maxlength="50" :autosize="isView?true:false" show-word-limit>
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
      <c-button size="small" type="" @click="cancel">{{ from=='shopCar'?'上一步':'取消' }}</c-button>
      <c-button type="primary" size="small" @click="confirmBtnClick">确定</c-button>
    </div>
  </c-dialog>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { regionData, CodeToText } from 'element-china-area-data'// 地址级联选择器
import cestcTreeSelect from '@/components/cestc-tree-select'
import { checkPhoneOrTell, checkEmail } from '@l/utils/validate.js'
import { downloadPack, allTenantOrganizations, userInfoByTenant, queryPublishDetailApi, shopCarSubmit } from '@/api/index'
export default {
  name: 'AssetCopy',
  components: { cestcTreeSelect },
  props: {
    shopCode: {
      type: [String, Number],
      default: ''
    },
    packVersion: {
      type: [String, Number],
      default: ''
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    packVersionId: {
      type: [String, Number],
      default: ''
    },
    datainfo: {
      type: Object,
      default: () => null
    },
    from: String
  },
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
      saveBtnFlag: true,
      tenantOrganizationsData: [],
      userListData: [],
      formData: {
        shopCode: this.shopCode,
        packVersion: this.packVersion,
        packVersionId: this.packVersionId,
        appDesc: ''
      },
      rules: {
        referPackVersionId: [
          { required: true, message: '请选择申请资源主体', trigger: 'blur' }
        ],
        district: [
          { required: true, message: '请选择所属地区', trigger: 'blur' }
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
        ],
        appDesc: [
          { required: true, message: '请输入使用场景', trigger: 'blur' },
          { max: 200, message: '最多输入50个字符', trigger: 'blur' }
        ]
      },
      showData: {},
      download: {}
    }
  },
  computed: {
    isView() {
      return false
    },
    title() {
      if (this.from === 'shopCar') {
        return '资源申请单'
      }
      return '下载申请'
    }
  },
  created() {
    this.getAllTenantOrganizations()
    this.userInfoInit()
    this.getDetail()
  },
  methods: {
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
    handlePreview(file) {
      file.url = file.url || file.response.data.relativePath
      // 点击文件列表的狗子函数
      this.download.name = file.name
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${file.url}&filename=${encodeURI(file.name)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
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
    getUserInfoByTenant(orgid) {
      if (!orgid) return
      const params = { orgId: orgid }
      userInfoByTenant(params).then(res => {
        this.userListData = res.data || []
      }).catch(() => {
        this.userListData = []
      })
    },
    validatorName(val, cb) {
      if (this.isView) {
        // 仅新增状态下可编辑资源编码
        return cb()
      }
      if (!/^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,20}$/.test(val)) {
        return cb('允许中英文、数字、下划线及中横线，最大长度20')
      }
      return cb()
    },
    getDetail() {
      if (this.datainfo) {
        this.showData = this.datainfo
        return
      }
      queryPublishDetailApi({ packVersionId: this.packVersionId }).then(res => {
        this.showData = res.data
      })
    },
    cancel() {
      this.close()
    },
    confirmBtnClick() {
      if (this.saveBtnFlag) {
        this.$refs.formData.validate((valid) => {
          if (!valid) return
          this.saveBtnFlag = false
          this.onSave()
        })
      }
    },
    close(flag = false) {
      this.$emit('close', flag)
    },
    async onSave() {
      try {
        if (this.formData.district) {
          this.formData.districtText = this.formData.district.map(d => CodeToText[d]).join('/')
        }
        if (this.from === 'shopCar') {
          await shopCarSubmit({
            shopCartIdList: this.datainfo.shopCartIdList,
            applyExtendInfo: JSON.stringify(this.formData)
          })
          this.$message.success('已发起申请')
        } else {
          await downloadPack({
            ...this.formData,
            applyExtendInfo: JSON.stringify(this.formData)
          })
          this.$message.success('已发起下载申请')
        }
        this.close(true)
      } catch (e) {
        console.error(e)
      }
      this.saveBtnFlag = true
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer {
  text-align: right;
}

.no-margin{
  margin: 0;
}
</style>
