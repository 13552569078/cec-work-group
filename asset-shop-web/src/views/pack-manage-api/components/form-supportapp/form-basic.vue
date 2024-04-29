<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-form ref="refFormBasic" :model="formData" label-position="top" :disabled="isview" class="bg-white" :class="{'disabled-new':isview}">
    <h3 class="info-title" data-section="basicInfo">基础信息</h3>
    <c-row :gutter="24">
      <c-col :span="8">
        <c-form-item label="资源名称" prop="packName" :rules="rules.name">
          <c-input
            v-model="formData.packName"
            maxlength="20"
            :disabled="!!disabledkey"
            placeholder="请输入" />
        </c-form-item>
      </c-col>
      <c-col :span="8">
        <c-form-item label="适用终端" prop="applyType" :rules="rules.selectRequired">
          <div v-if="isview&&!(formData.applyType&&formData.applyType.length)">--</div>
          <c-checkbox-group v-else v-model="formData.applyType">
            <c-checkbox v-for="d in APP_TYPES" :key="d.value" :label="d.value+''" name="applyType">{{ d.label }}</c-checkbox>
          </c-checkbox-group>
        </c-form-item>
      </c-col>
    </c-row>
    <c-row :gutter="24">
      <c-col :span="8">
        <c-form-item label="资源分类" prop="packSceneId">
          <div v-if="isview&&!formData.packSceneId">--</div>
          <c-cascader
            v-else
            v-model="formData.packSceneId"
            :options="packSceneData"
            :specific-suffix="true"
            :show-all-levels="false"
            :props="{
              children: 'childList',
              label: 'groupName',
              pid: 'parentId',
              value: 'groupId',
              checkStrictly: true,
              emitPath: false
            }"
            size="small"
            clearable></c-cascader>
        </c-form-item>
      </c-col>
      <c-col :span="8">
        <c-form-item label="标签分类">
          <div v-if="isview&&!formData.tagList.length">--</div>
          <c-cascader
            v-else
            v-model="formData.tagList"
            :options="packTagData"
            :specific-suffix="true"
            :show-all-levels="false"
            :props="{
              children: 'childList',
              label: 'groupName',
              pid: 'parentId',
              value: 'groupId',
              emitPath: false,
              multiple: true
            }"
            size="small"
            clearable></c-cascader>
        </c-form-item>
      </c-col>
    </c-row>
    <c-row :gutter="24">
      <c-col :span="16">
        <c-form-item label="简要说明" prop="packDesc" :rules="rules.packDesc">
          <c-input
            v-model="formData.packDesc"
            type="textarea"
            maxlength="200"
            :rows="4"
            :autosize="isview?true:false"
            resize="none"
            show-word-limit
            placeholder="请输入" />
        </c-form-item>
      </c-col>
    </c-row>
    <c-row :gutter="24">
      <c-col :span="8">
        <c-form-item label="所属地区" prop="district" :rules="rules.selectRequired">
          <c-cascader
            v-model="formData.district"
            :options="areaSelectData"
            specific-suffix
            size="small"
            placeholder="请选择" />
        </c-form-item>
      </c-col>
      <c-col :span="8">
        <c-form-item label="建设部门" prop="buildDeptId" :rules="rules.selectRequired">
          <div v-if="isview&&!formData.buildDeptId">--</div>
          <cestcTreeSelect
            v-else
            ref="refBuildDept"
            v-model="formData.buildDeptId"
            :search="true"
            :allow-create="true"
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
    </c-row>
    <c-row :gutter="24">
      <c-col :span="8">
        <c-form-item label="联系人" prop="contactUserName" :rules="rules.selectRequired">
          <c-autocomplete
            v-model="formData.contactUserName"
            :fetch-suggestions="contactUserFilter"
            placeholder="请输入内容"
            @select="contactUserChange"
          ></c-autocomplete>
        </c-form-item>
      </c-col>
      <c-col :span="8">
        <c-form-item label="电话" prop="contactPhone" :rules="rules.contactPhone">
          <c-input
            ref="refcontactPhone"
            v-model="formData.contactPhone"
            placeholder="请输入" />
        </c-form-item>
      </c-col>
      <c-col :span="8">
        <c-form-item label="邮箱" prop="contactEmail" :rules="rules.contactEmail">
          <c-input
            ref="refcontactEmail"
            v-model="formData.contactEmail"
            placeholder="请输入" />
        </c-form-item>
      </c-col>
    </c-row>
    <c-form-item label="详细说明" prop="detailDesc" :rules="rules.inputRequired">
      <vue-tinymce
        key="detailDesc2"
        :height="200"
        :editor-content="formData.detailDesc"
        :status="isview?1:0"
        class="cls-tinymce"
        @editorBlur="detailDescEditorBlur"
      />
    </c-form-item>
    <c-form-item label="使用约束" prop="instruction" :rules="rules.inputRequired">
      <vue-tinymce
        key="instruction2"
        :height="200"
        :editor-content="formData.instruction"
        :status="isview?1:0"
        class="cls-tinymce"
        @editorBlur="instructionEditorBlur"
      />
    </c-form-item>
  </c-form>
</template>
<script>
import vueTinymce from '@/components/tinymce'
import cestcTreeSelect from '@/components/cestc-tree-select'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'// 地址级联选择器
import { checkPhoneOrTell, checkEmail } from '@l/utils/validate.js'
import { queryTagTree, allTenantOrganizations, userInfoByTenant } from '@/api/index'
export default {
  name: '',
  components: { vueTinymce, cestcTreeSelect },
  props: {
    isview: Boolean,
    disabledkey: String
  },
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      formData: {
        applyType: [],
        imageList: [],
        tagList: [],
        buildDeptId: [],
        contactPhone: '',
        contactEmail: ''
      },
      rules: {
        name: [
          { required: true, message: '支持中英文、数字、下划线、中横线，最大长度20', trigger: 'blur' },
          { validator: (rule, val, cb) => {
            if (val && val.length > 20) return cb('支持中英文、数字、下划线、中横线，最大长度20')
            const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,20}$/
            if (!reg.test(val)) return cb('支持中英文、数字、下划线、中横线，最大长度20')
            cb()
          }, trigger: 'blur' }
        ],
        packDesc: { required: true, message: '请输入', trigger: ['blur'] },
        contactPhone: {
          required: true,
          validator: (rule, val, cb) => {
            if (!val) return cb('请输入正确的电话号码')
            if (!checkPhoneOrTell(val)) return cb('请输入正确的电话号码')
            cb()
          }, trigger: ['change', 'blur'] },
        contactEmail: {
          required: false,
          validator: (rule, val, cb) => {
            if (this.isview) return cb()
            if (!val) return cb()
            if (!checkEmail(val)) return cb('请输入正确的邮箱')
            cb()
          }, trigger: ['change', 'blur'] },
        uploadRequired: { required: true, message: '请上传', trigger: ['change', 'blur'] },
        inputRequired: { required: true, message: '请输入', trigger: ['blur'] },
        selectRequired: { required: true, message: '请选择', trigger: ['change', 'blur'] }
      },
      APP_TYPES: window.ENUMS.TAB_APP_TYPE,
      packSceneData: [],
      packTagData: [],
      initImgList: (window.__systemConfig && window.__systemConfig.packImages) || [],
      uploadImgs: [],
      imgDialogVisible: false,
      imgDialogImageUrl: '',
      selectImgIndex: '',
      areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
      tenantOrganizationsData: []
    }
  },
  computed: {
    showImageList() {
      if (this.isview) {
        return this.formData.imageList
      }
      return [...this.initImgList, ...this.uploadImgs]
    }
  },
  created() {
    this.getLabels(1)
    this.getLabels(2)
    this.getAllTenantOrganizations(true)
  },
  mounted() {
    // 解决 cestcTreeSelect 组件初始化就校验报错的问题
    setTimeout(() => {
      this.$refs.refFormBasic.clearValidate()
    }, 100)
  },
  methods: {
    contactUserChange(v) {
      const user = v
      this.$set(this.formData, 'contactPhone', user.mobileNo)
      this.$set(this.formData, 'contactEmail', user.email)
      this.$nextTick(() => {
        this.$refs.refFormBasic && this.$refs.refFormBasic.clearValidate(['contactPhone', 'contactEmail'])
      })
    },
    contactUserFilter(queryString, cb) {
      let restaurants = this.userListData
      if (queryString) {
        restaurants = this.userListData.filter(d => (d.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0))
      }
      cb(restaurants)
    },
    // 获取资源分类和标签
    async getLabels(groupType) {
      try {
        const res = await queryTagTree({ groupType })
        if (groupType === 1) {
          const packSceneData = res.data || []
          this.treeRecursion(packSceneData, 1)
          this.packSceneData = packSceneData
        } else if (groupType === 2) {
          const packTagData = res.data
          this.treeRecursion(packTagData)
          this.packTagData = packTagData
        }
      } catch (e) {
        console.error(e)
      }
    },
    // 处理标签树的数据,只能选择叶节点
    treeRecursion(data, type) {
      if (Array.isArray(data) && data.length) {
        data.forEach((unit, index) => {
          // 只允许选择叶子节点  场景可选择一级节点
          if (type !== 1) {
            if (!unit.parentId && !unit.childList.length) {
              unit.disabled = true
            }
          }
          if (unit.childList && unit.childList.length) {
            this.treeRecursion(unit.childList, type)
          } else {
            unit.childList = null
          }
        })
      }
    },
    detailDescEditorBlur(content) {
      this.$set(this.formData, 'detailDesc', content)
    },
    instructionEditorBlur(content) {
      this.$set(this.formData, 'instruction', content)
    },
    getAllTenantOrganizations(isInit) {
      this.tenantOrganizationsData = []
      allTenantOrganizations().then(res => {
        this.tenantOrganizationsData = res.data || []
        if (isInit) {
          this.userInfoInit()
        }
      })
    },
    userInfoInit() {
      if (this.isBackFill) return
      if (this.formData.buildDeptId && this.formData.buildDeptId.length) return
      const { orgid, mobileNo, empid, email, empname } = this.$store.state.user.userInfo || {}
      this.userListData = [{ empId: empid, mobileNo, email, empName: empname, value: empname }]
      this.getUserInfoByTenant(orgid)
      orgid && this.$set(this.formData, 'buildDeptId', [orgid])
      empname && this.$set(this.formData, 'contactUserName', empname)
      mobileNo && this.$set(this.formData, 'contactPhone', mobileNo)
      email && this.$set(this.formData, 'contactEmail', email)
    },
    getUserInfoByTenant(orgid) {
      if (!orgid) {
        this.userListData = []
        return
      }
      const params = { orgId: orgid }
      userInfoByTenant(params).then(res => {
        this.userListData = (res.data || []).map(d => ({ ...d, value: d.empName }))
      }).catch(() => {
        this.userListData = []
      })
    },
    buildDeptIdChange(data) {
      const orgid = data[0] && data[0].id || ''
      this.getUserInfoByTenant(orgid)
      this.$set(this.formData, 'contactUserName', '')
      this.$set(this.formData, 'contactPhone', '')
      this.$set(this.formData, 'contactEmail', '')
      this.$nextTick(() => {
        this.$refs.refFormBasic.clearValidate(['contactUserName', 'contactPhone', 'contactEmail'])
      })
    },
    getFormData() {
      this.$refs.refFormBasic.validateField('packName')
      const params = { ...this.formData }
      const basicInfo = {}
      basicInfo.applyType = Array.isArray(params.applyType) ? params.applyType.join(',') : ''
      if (basicInfo.applyType) {
        params.basicInfo = JSON.stringify(basicInfo)
      }
      params.tagList = Array.isArray(params.tagList) ? params.tagList.map(d => ({ groupId: d })) : []
      // 图片
      params.imageList = []
      let hasfileMark
      if (Array.isArray(this.formData.imageList)) {
        params.imageList = this.formData.imageList.map(d => {
          if (d === this.selectImgIndex) {
            hasfileMark = true
          }
          return {
            fileName: '',
            filePath: d,
            fileMark: (d === this.selectImgIndex) ? 'cover' : ''
          }
        })
      }
      if (!hasfileMark && params.imageList[0]) {
        params.imageList[0].fileMark = 'cover'
      }
      // 联系信息
      const contactInfo = {}
      if (this.formData.district) {
        contactInfo.district = this.formData.district.map(d => CodeToText[d]).join('/')
      }
      if (this.formData.buildDeptId) {
        if (typeof this.formData.buildDeptId === 'string') {
          contactInfo.buildDeptId = ''
          contactInfo.buildDeptName = this.formData.buildDeptId
        } else {
          contactInfo.buildDeptId = this.formData.buildDeptId[0]
          contactInfo.buildDeptName = this.$refs.refBuildDept.getSelectedTitle(this.formData.buildDeptId)[0]
        }
      }
      contactInfo.contactUserName = this.formData.contactUserName || ''
      contactInfo.contactPhone = this.formData.contactPhone || ''
      contactInfo.contactEmail = this.formData.contactEmail || ''
      params.contactInfo = Object.keys(contactInfo).length ? JSON.stringify(contactInfo) : ''
      return params
    },
    validateForm() {
      let flag
      this.$refs.refFormBasic.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFormData()
      })
      return flag
    },
    backFill(data) {
      this.isBackFill = true
      // 清空自动填充数据
      this.$set(this.formData, 'buildDeptId', '')
      this.$set(this.formData, 'contactUserName', '')
      this.$set(this.formData, 'contactPhone', '')
      this.$set(this.formData, 'contactEmail', '')
      this.$nextTick(() => {
        this.$refs.refFormBasic.clearValidate(['buildDeptId', 'contactUserName', 'contactPhone', 'contactEmail'])
      })
      if (!data) return
      data.contactInfo = data.contactInfo ? JSON.parse(data.contactInfo) : {}
      data.basicInfo = data.basicInfo ? JSON.parse(data.basicInfo) : {}
      const keys = ['packName', 'packSceneId', 'packDesc', 'detailDesc', 'instruction']
      keys.forEach(k => {
        if (data[k]) {
          this.$set(this.formData, k, data[k])
        }
      })
      if (data.basicInfo.applyType) {
        this.$set(this.formData, 'applyType', data.basicInfo.applyType.split(','))
      }
      data.tagList && this.$set(this.formData, 'tagList', data.tagList.map(d => d.groupId))
      if (data.imageList) {
        const uploadImgs = []
        const imageList = data.imageList.map((d, i) => {
          if (d.fileMark === 'cover') { this.selectImgIndex = d.filePath }
          if (!this.initImgList.includes(d.filePath)) {
            uploadImgs.push(d.filePath)
          }
          return d.filePath
        })
        this.uploadImgs = uploadImgs
        this.$set(this.formData, 'imageList', imageList)
      }
      if (data.contactInfo.district) {
        const district = data.contactInfo.district.split('/')
        const province = TextToCode[district[0]].code
        const city = TextToCode[district[0]][district[1]].code
        const region = TextToCode[district[0]][district[1]][district[2]].code
        this.$set(this.formData, 'district', [province, city, region])
      }
      if (data.contactInfo.buildDeptId) {
        this.$set(this.formData, 'buildDeptId', [data.contactInfo.buildDeptId])
      } else if (data.contactInfo.buildDeptName) {
        this.$set(this.formData, 'buildDeptId', data.contactInfo.buildDeptName)
      }
      data.contactInfo.contactUserName && this.$set(this.formData, 'contactUserName', data.contactInfo.contactUserName)
      data.contactInfo.contactPhone && this.$set(this.formData, 'contactPhone', data.contactInfo.contactPhone)
      data.contactInfo.contactEmail && this.$set(this.formData, 'contactEmail', data.contactInfo.contactEmail)
      if (this.isview) {
        ['contactEmail', 'detailDesc', 'instruction'].forEach(k => {
          if (!this.formData[k]) {
            this.formData[k] = '--'
          }
        })
        this.$nextTick(() => {
          this.$refs.refFormBasic.clearValidate()
        })
      }
      this.isBackFill = false
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.bg-white {
  padding: 20px 40px;
  margin-bottom: 20px;
  background: white;
  .info-title {
    margin-left: -20px;
  }
}
  ::v-deep.c-form {
    // overflow-x: hidden;
    .c-upload-list {
      line-height: normal;
    }
    .c-select, .c-cascader, .c-date-editor, .c-autocomplete {
      width: 100%;
    }
    .c-input-number .c-input__inner {
      text-align: left !important;
    }
  }
  .icon-cover {
    padding: 0 10px;
    position: relative;
    &::before {
      content: '';
      width: 20px;
      height: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(~@/assets/imgs/cover1.png) no-repeat center;
      background-size: contain;
    }
  }
  .icon-cover.active::before {
    background: url(~@/assets/imgs/cover2.png) no-repeat center;
    background-size: contain;
  }
  .disabled-new {
    .picture-wrap {
      margin-top: 10px;
    }
  }
  .picture-wrap {
    max-width: 700px;
    .picture-item-img {
      width: 120px;
      height: 120px;
    }
    .picture-item, .upload {
      display: inline-block;
      width: 120px;
      height: 120px;
      margin-right: 16px;
      vertical-align: top;
    }
    .picture-item:nth-child(n+6), .upload {
      margin-top: 16px;
    }
    .picture-item {
      position: relative;
      img{
        border: 1px solid #e7e7e7;
        border-radius: 2px;
      }
      .c-checkbox {
        line-height: 16px;
        position: absolute;
        right: 8px;
        top: 8px;
        z-index: 10;
      }
    }
    .cover {
      position: absolute;
      width: 120px;
      height: 120px;
      display: block;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: #fff;
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      z-index: 2;
      line-height: 118px;
      i {
        cursor: pointer;
      }
      i:nth-child(n+2) {
        margin-left: 10px;
      }
    }
    .picture-item:hover .cover {
      opacity: 1;
    }
  }
  ::v-deep.c-form.disabled-new {
    .picture-wrap {
      margin-bottom: 10px;
    }
    .c-cascader__tags .c-tag {
      background: rgba(54, 164, 255, 0.1);
      border-radius: 2px;
      color: #36A4FF;
    }
    .c-form-item.picture-card .c-form-item__label {
      margin-bottom: 10px;
    }
    .c-table {
      margin-top: 20px;
    }
    .c-upload-list__item-status-label {
      opacity: 0;
    }
    .c-upload-list__item:hover {
      background: white;
      color: #4B4B4B;
      .c-upload-list__item-text {
        text-decoration: underline;
      }
    }
    .c-icon-close {
      opacity: 0;
    }
    .c-icon-close-tip {
      opacity: 0;
    }
    .c-radio, .c-checkbox {
      display: none;
      font-weight: 400;
    }
    .c-radio__input, .c-checkbox__input {
      display: none;
    }
    .c-radio.is-checked, .c-checkbox.is-checked {
      display: inline-block;
    }
    .c-radio__label, .c-checkbox__label {
      padding-left: 0;
      color: #4B4B4B!important;
    }
    .cls-select-input {
      padding-left: 0;
      border: none;
      .c-icon-document {
        display: inline-block;
        margin-right: 4px;
      }
      &:hover {
        text-decoration: underline;
        color: $primaryColor;
        .c-icon-circle-close {
          display: none;
        }
      }
    }
  }
  .info-title {
    margin-top: 20px;
  }
  </style>

