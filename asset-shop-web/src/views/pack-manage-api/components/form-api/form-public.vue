<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-form ref="refFormPublic" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview,'bg-white':true}">
    <h3 class="info-title" data-section="publicInfo">上架信息</h3>
    <c-row :gutter="24">
      <c-col :span="8">
        <c-form-item label="资源名称" prop="packName" :rules="rules.name">
          <c-input
            v-model="formData.packName"
            maxlength="20"
            :disabled="disabled"
            placeholder="请输入" />
        </c-form-item>
      </c-col>
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
    </c-row>
    <c-row :gutter="24">
      <c-col :span="8">
        <c-form-item label="标签分类">
          <div v-if="isview&&!formData.tagList">--</div>
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
      <c-col :span="8">
        <c-form-item label="" prop="oriAppShopCode">
          <template slot="label">
            <span>
              来源应用
              <c-tooltip placement="top" popper-class="cls-form-label-tip" content="关联后，该组件成为来源应用的“生成资源”">
                <i class="cls-icon-info"></i>
              </c-tooltip>
            </span>
          </template>
          <div v-if="isview&&!formData.oriAppShopCode">--</div>
          <c-select
            v-else
            v-model="formData.oriAppShopCode"
            specific-suffix
            clearable
            filterable
            placeholder="请选择">
            <c-option v-for="d in appList" :key="d.shopCode" :label="d.packName" :value="d.shopCode" />
          </c-select>
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
    <c-form-item label="调用数据示例" prop="instruction" :rules="rules.inputRequired">
      <vue-tinymce
        key="instruction1"
        :height="200"
        :editor-content="formData.instruction"
        :status="isview?1:0"
        class="cls-tinymce"
        @editorBlur="instructionEditorBlur"
      />
    </c-form-item>
    <c-form-item label="详细说明" prop="detailDesc">
      <vue-tinymce
        key="detailDesc1"
        :height="200"
        :editor-content="formData.detailDesc"
        :status="isview?1:0"
        class="cls-tinymce"
        @editorBlur="detailDescEditorBlur"
      />
    </c-form-item>
  </c-form>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { checkEmail, checkPhoneOrTell } from '@l/utils/validate.js'
import vueTinymce from '@/components/tinymce'
import cestcTreeSelect from '@/components/cestc-tree-select'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'// 地址级联选择器
import { queryTagTree, packAppSimpleList, allTenantOrganizations, userInfoByTenant } from '@/api/index'
import { debounce } from '@l/utils'
import { bus } from '@/utils'
export default {
  name: '',
  components: { vueTinymce, cestcTreeSelect },
  props: {
    isview: Boolean,
    disabled: Boolean
  },
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      formData: {
        imageList: [],
        instruction: '',
        detailDesc: '',
        publisher: ''
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
      packSceneData: [],
      packTagData: [],
      appList: [],
      selectImgIndex: '',
      imgDialogImageUrl: '',
      imgDialogVisible: false,
      initImgList: (window.__systemConfig && window.__systemConfig.packImages) || [],
      uploadImgs: [],
      areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
      isBackFill: false
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
  watch: {
    formData: {
      handler(nv, ov) {
        if (JSON.stringify(nv) !== JSON.stringify(ov)) {
          this._formDataChange()
        }
      },
      deep: true,
      immediate: false
    }
  },
  created() {
    this._formDataChange = debounce(this.formDataChange, 1000)
    this.getLabels(1)
    this.getLabels(2)
    this.getAppList()
    this.getAllTenantOrganizations(true)
  },
  methods: {
    formDataChange() {
      if (this.isBackFill) return
      console.log('----emit')
      bus.$emit('-bus-packapiform-leave-validate-', true)
    },
    contactUserChange(v) {
      const user = v
      this.$set(this.formData, 'contactPhone', user.mobileNo)
      this.$set(this.formData, 'contactEmail', user.email)
      this.$nextTick(() => {
        this.$refs.refFormPublic.clearValidate(['contactPhone', 'contactEmail'])
      })
    },
    contactUserFilter(queryString, cb) {
      let restaurants = this.userListData
      if (queryString) {
        restaurants = this.userListData.filter(d => (d.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0))
      }
      cb(restaurants)
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
        this.$refs.refFormPublic && this.$refs.refFormPublic.clearValidate(['contactUserName', 'contactPhone', 'contactEmail'])
      })
    },
    getFormData() {
      const params = { ...this.formData }
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
      this.$refs.refFormPublic.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFormData()
      })
      return flag
    },
    backFill(data) {
      // 清空自动填充数据
      this.$set(this.formData, 'buildDeptId', '')
      this.$set(this.formData, 'contactUserName', '')
      this.$set(this.formData, 'contactPhone', '')
      this.$set(this.formData, 'contactEmail', '')
      this.$nextTick(() => {
        this.$refs.refFormPublic.clearValidate(['buildDeptId', 'contactUserName', 'contactPhone', 'contactEmail'])
      })
      data.contactInfo = data.contactInfo ? JSON.parse(data.contactInfo) : {}
      this.isBackFill = true
      const keys = ['packName', 'packSceneId', 'oriAppShopCode', 'packDesc', 'instruction', 'detailDesc']
      keys.forEach(k => {
        if (data[k]) {
          this.$set(this.formData, k, data[k])
        }
      })
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
        ['contactEmail', 'detailDesc'].forEach(k => {
          if (!this.formData[k]) {
            this.formData[k] = '--'
          }
        })
      }
      this.$nextTick(() => {
        this.isBackFill = false
      })
    },
    beforeUploadImg(file) {
      console.log(file, '-----beforeUploadImg')
      // 上传前狗子，单个不能超过5M
      const limit = 5 * 1024 * 1024
      if (file.size > limit) {
        this.$message.warning('单个文件不能超过5M')
        return false
      }
      if (this.uploadImgs.length >= 5) {
        this.$message.warning('最多选择5张图片')
        return false
      }
      return true
    },
    // 应用图片-选择为封面
    handleCover(path) {
      if (this.isview) return
      if (!this.formData.imageList.includes(path)) {
        if (this.formData.imageList.length === 5) {
          return this.$message.warning('仅选中的图片可设置为封面')
        }
        this.handlePictureSelect(path, true)
      }
      this.selectImgIndex = path
      this.$message.success('设置封面成功！')
    },
    // 选择图片 最多5个
    handlePictureSelect(path, v) {
      if (this.isview) return
      if (v) {
        if (this.formData.imageList.length === 5) return this.$message.warning('最多选择5张图片')
        this.formData.imageList.push(path)
      } else {
        this.formData.imageList = this.formData.imageList.filter(d => d !== path)
        if (this.selectImgIndex === path) {
          this.selectImgIndex = this.formData.imageList[0] || ''
        }
      }
    },
    // 应用图片-删除
    handleRemoveImg(path) {
      this.uploadImgs = this.uploadImgs.filter(d => d !== path)
      this.formData.imageList = this.formData.imageList.filter(d => d !== path)
      if (path === this.selectImgIndex) {
        this.selectImgIndex = this.formData.imageList[0] || ''
      }
      this.$refs.refFormPublic.validateField('imageList')
    },
    // 应用图片-上传成功
    handleUploadImg(response, file, fileList) {
      console.log('-------应用图片-上传成功')
      const uploadImgs = [...this.uploadImgs]
      if (response.code !== 0) {
        this.uploadImgs = uploadImgs
        this.$message.error(response.msg || '上传失败')
      } else {
        uploadImgs.push(response.data.relativePath)
        this.uploadImgs = uploadImgs
        this.formData.imageList.push(response.data.relativePath)
      }
      this.$refs.refFormPublic.validateField('imageList')
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
    instructionEditorBlur(content) {
      console.log('----editorBlur-----')
      this.$set(this.formData, 'instruction', content)
      this.$refs.refFormPublic.validateField('instruction')
    },
    detailDescEditorBlur(content) {
      console.log('----editorBlur-----')
      this.$set(this.formData, 'detailDesc', content)
      // this.$refs.refFormPublic.validateField('detailDesc')
    },
    // 获取来源应用列表
    getAppList() {
      packAppSimpleList().then(res => {
        this.appList = res.data || []
      })
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
</style>
