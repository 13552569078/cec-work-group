<!--/*
* @Author: dingli
* @Desc: 第二步 - 填写基本信息
* @Date: 2022-2-9
*/-->
<template>
  <c-form ref="refFormStep2" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="jibenxinxi">基础信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="资源名称" prop="packName" :rules="rules.name">
            <c-input
              v-model="formData.packName"
              :disabled="packNameDisabled||disabled"
              maxlength="20"
              placeholder="请输入" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="版本号" prop="packVersion" :rules="rules.packVersion">
            <c-input
              v-model="formData.packVersion"
              disabled
              maxlength="20"
              placeholder="请输入" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="资源分类">
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
              style="width:100%"
              clearable></c-cascader>
          </c-form-item>
        </c-col>
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
              style="width:100%"
              clearable></c-cascader>
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
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
        <c-col :span="16">
          <c-form-item label="资源描述" prop="packDesc" :rules="rules.inputRequired">
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
        <c-col :span="16">
          <c-form-item label="版本说明" prop="packVersionDesc" :rules="rules.packVersionDesc">
            <c-input
              v-model="formData.packVersionDesc"
              type="textarea"
              maxlength="200"
              :rows="4"
              show-word-limit
              :autosize="isview?true:false"
              resize="none"
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
              :disabled="disabled"
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
    </div>
  </c-form>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'// 地址级联选择器
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
const UPLOAD_FILE_URL = getProxyUrl(serviceSuffix.file_upload)
import { checkPhoneOrTell, checkEmail } from '@l/utils/validate.js'
import { queryTagTree, allTenantOrganizations, userInfoByTenant, packAppSimpleList } from '@/api/index'
import { bus } from '@/utils'
import cestcTreeSelect from '@/components/cestc-tree-select'
export default {
  name: '',
  components: { cestcTreeSelect },
  filters: {
    coverImg(url) {
      if (url) {
        // ${getProxyUrl(serviceSuffix.fdfs_preview_prefix)}/
        return `background-image:url(${url})`
      }
      return ''
    }
  },
  props: {
    isview: {
      type: Boolean,
      default: false
    },
    disabled: Boolean
  },
  data() {
    return {
      UPLOAD_URL: UPLOAD_FILE_URL + '/fdfs/upload',
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      imgDialogVisible: false,
      imgDialogImageUrl: '',
      selectImgIndex: 0,
      formData: {
        imageList: [],
        buildDeptId: [],
        contactPhone: '',
        contactEmail: ''
      },
      areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
      packSceneData: [],
      packTagData: [],
      tenantOrganizationsData: [],
      rules: {},
      rules2: {
        name: [
          { required: true, message: '请填写资源上架名称', trigger: 'blur' },
          { validator: (rule, val, cb) => {
            if (val && val.length > 20) {
              return cb('最多输入20个字符')
            }
            const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,20}$/
            if (!reg.test(val)) {
              return cb('支持中英文、数字、下划线、中横线，最大长度20')
            }
            cb()
          }, trigger: 'blur' }
        ],
        packVersion: [
          { required: true, message: '请填写上架版本号', trigger: 'blur' },
          { validator: (rule, val, cb) => {
            if (!val) {
              return cb('请输入版本号')
            }
            if (!/^[a-zA-Z]{1}[0-9a-zA-Z_.]{0,20}$/.test(val)) {
              return cb('长度20，字母开头，支持英文、数字、下划线、句点')
            }
            cb()
          }, trigger: 'blur' }
        ],
        imageList: { required: true, message: '上传资源图片', trigger: ['change', 'blur'] },
        packVersionDesc: { required: true, message: '请填写版本说明', trigger: 'blur' },
        inputRequired: { required: true, message: '请输入', trigger: ['blur'] },
        selectRequired: { required: true, message: '请选择', trigger: ['change', 'blur'] },
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
          }, trigger: ['change', 'blur'] }
      },
      uploadImgs: [],
      packNameDisabled: false,
      oldData: null,
      initImgList: (window.__systemConfig && window.__systemConfig.packImages) || [],
      appList: [],
      userListData: []
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
    isview: {
      handler(nv) {
        if (nv) {
          this.rules = {}
        } else {
          this.rules = this.rules2
        }
      },
      immediate: true
    }
  },
  created() {
    this.getLabels(1)
    this.getLabels(2)
    this.getAllTenantOrganizations(true)
    this.getAppList()
    bus.$on('bus-parsepack', this.bushParsePack)
  },
  beforeDestroy() {
    bus.$off('bus-parsepack', this.bushParsePack)
  },
  methods: {
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
      if (!orgid) return
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
        this.$refs.refFormStep2.clearValidate(['contactUserName', 'contactPhone', 'contactEmail'])
      })
    },
    contactUserChange(v) {
      const user = v
      this.$set(this.formData, 'contactPhone', user.mobileNo)
      this.$set(this.formData, 'contactEmail', user.email)
      this.$nextTick(() => {
        this.$refs.refFormStep2.clearValidate(['contactPhone', 'contactEmail'])
      })
    },
    previewAvatar(path) {
      this.imgDialogImageUrl = path
      this.imgDialogVisible = true
    },
    beforeUpload(file) {
      // 上传前狗子，单个不能超过5M
      const limit = 5 * 1024 * 1024
      if (file.size > limit) {
        this.$message.warning('单个文件不能超过5M')
        return false
      }
      return true
    },
    handleExceed() {
      // 文件超出个数限制时的钩子
      this.$message.warning('最多上传5个图片')
    },
    bushParsePack({ packName, assetVersion }) {
      if (packName) {
        // 包解析成功后填充资源名称
        this.$set(this.formData, 'packName', packName)
        this.packNameDisabled = true
      }
      this.$set(this.formData, 'packVersion', assetVersion)
    },
    // 资源图片-选择为封面
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
    // 资源图片-查看缩略图
    handlePictureCardPreview(file) {
      this.imgDialogImageUrl = file.previewUrl || file.url
      this.imgDialogVisible = true
    },
    // 资源图片-删除
    handleRemove(path) {
      this.uploadImgs = this.uploadImgs.filter(d => d !== path)
      this.formData.imageList = this.formData.imageList.filter(d => d !== path)
      if (path === this.selectImgIndex) {
        this.selectImgIndex = this.formData.imageList[0] || ''
      }
      this.$refs.refFormStep2.validateField('imageList')
    },
    // 资源图片-上传成功
    handleUpload(response, file, fileList) {
      console.log(fileList, '----------handleUpload')
      if (response.code !== 0) {
        this.uploadImgs = [...this.uploadImgs]
        return this.$message.error(response.msg || '上传失败')
      }
      this.uploadImgs.push(response.data.relativePath)
      this.formData.imageList.push(response.data.relativePath)
      this.$refs.refFormStep2.validateField('imageList')
    },
    getFromData() {
      if (this.$refs.refFormStep2.$el.querySelector('.c-form-item__error')) return false
      const params = {
        ...this.formData,
        packName: this.formData.packName,
        packVersion: this.formData.packVersion,
        packSceneId: this.formData.packSceneId,
        tagList: this.formData.tagList,
        packDesc: this.formData.packDesc,
        packVersionDesc: this.formData.packVersionDesc,
        imageList: []
      }
      params.tagList = Array.isArray(params.tagList) ? params.tagList.map(d => ({ groupId: d })) : []
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
      if (this.formData.contactUserName) {
        const contactUserName = this.userListData.find(d => d.empId === this.formData.contactUserName)
        console.log(contactUserName, this.userListData)
        contactInfo.contactUserName = this.formData.contactUserName
      }
      this.formData.contactPhone && (contactInfo.contactPhone = this.formData.contactPhone)
      this.formData.contactEmail && (contactInfo.contactEmail = this.formData.contactEmail)
      params.contactInfo = Object.keys(contactInfo).length ? JSON.stringify(contactInfo) : ''
      const change = this.getChange(params)
      return {
        change,
        data: params
      }
    },
    getChange(data) {
      if (!this.oldData) return true
      const keys = ['packName', 'packVersion', 'packSceneId', 'packDesc', 'packVersionDesc', 'oriAppShopCode']
      for (let i = 0; i < keys.length; i++) {
        if (data[keys[i]] !== this.oldData[keys[i]]) {
          return true
        }
      }
      this.oldData.tagList = this.oldData.tagList || []
      this.oldData.imageList = this.oldData.imageList || []
      if (data.tagList.length !== this.oldData.tagList.length || data.imageList.length !== this.oldData.imageList.length) {
        return true
      }
      if (data.tagList.sort().join(',') !== this.oldData.tagList.sort().join(',')) {
        return true
      }
      for (let i = 0; i < data.imageList.length; i++) {
        const d = data.imageList[i]
        const item = this.oldData.imageList[i]
        if (!(item && item.fileMark === d.fileMark)) {
          return true
        }
      }
      return false
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
        //
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
    // 校验表单
    validate() {
      let flag
      this.$refs.refFormStep2.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFromData()
      })
      return flag
    },
    initForm(data, change, isUpdate) {
      data.contactInfo = data.contactInfo ? JSON.parse(data.contactInfo) : {}
      data.tagList = data.tagList || []
      data.imageList = data.imageList || []
      this.oldData = data
      if (change) return
      const params = {
        packName: data.packName,
        packVersion: data.packVersion,
        oriAppShopCode: data.oriAppShopCode,
        packSceneId: data.packSceneId,
        tagList: [],
        packDesc: data.packDesc,
        packVersionDesc: data.packVersionDesc,
        imageList: []
      }
      params.tagList = data.tagList.map(d => d.groupId)
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
      // 根据部门id获取联系人数据
      this.getUserInfoByTenant(data.contactInfo.buildDeptId)
      if (!data.packSceneId && this.isview) {
        params.packSceneId = ''
      }
      if (!(Array.isArray(data.tagList) && data.tagList.length) && this.isview) {
        params.tagList = ''
      }
      params.imageList = data.imageList.map((d, i) => {
        if (d.fileMark === 'cover') { this.selectImgIndex = d.filePath }
        if (!this.initImgList.includes(d.filePath)) {
          this.uploadImgs.push(d.filePath)
        }
        return d.filePath
      })
      if (isUpdate) {
        // 更新回填时不会填版本号和版本说明
        delete params.packVersion
        delete params.packVersionDesc
      }
      Object.keys(params).forEach(k => {
        this.$set(this.formData, k, params[k])
      })
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
::v-deep.disabled-new {
  .c-cascader__tags .c-tag {
    background: rgba(54, 164, 255, 0.1);
    border-radius: 2px;
    color: #36A4FF;
  }
  .c-form-item.picture-card .c-form-item__label {
    margin-bottom: 10px;
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
</style>
