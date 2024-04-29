<!--/*
* @Author: dingli
* @Desc: 注册信息
* @Date:
*/-->
<template>
  <c-form ref="refFormRegister" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="baseInfo">基础信息</h3>
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
          <c-form-item label="建设渠道" prop="buildChannel" :rules="rules.selectRequired">
            <c-select v-model="formData.buildChannel" specific-suffix :disabled="disabled" @change="buildChannelChange">
              <c-option
                v-for="(v, k) in CHANNEL"
                :key="k"
                :label="v"
                :value="k" />
            </c-select>
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="资源状态" prop="appStatus" :rules="rules.selectRequired">
            <c-select v-model="formData.appStatus" specific-suffix :disabled="disabled" @change="appStatusChange">
              <c-option
                v-for="(v, k) in APP_ENUMS.APP_STATUS"
                :key="k"
                :label="v"
                :value="k" />
            </c-select>
          </c-form-item>
        </c-col>
        <c-col v-if="formData.packSource==3" :span="8">
          <c-form-item label="" prop="assetCode" :rules="rules.selectRequired">
            <span slot="label" class="label-has-icon">关联资源中心应用
              <c-tooltip placement="top-start">
                <div slot="content">应用列表将过滤已关联的应用（包括未提交表单中的）：若资源状态为“开发中”“已停用”则未关联的应用均可选择；若资源状态为“已上线”则仅能选择存在已部署版本的应用。</div>
                <i class="icon-info" />
              </c-tooltip>
            </span>
            <div v-if="isview">{{ formData.assetName ? `${formData.assetName}(${formData.assetCode})` : '--' }}</div>
            <c-select v-else v-model="formData.assetCode" filterable specific-suffix :disabled="disabled" @change="assetCodeChange">
              <c-option
                v-for="d in appList"
                :key="d.appCode"
                :label="`${d.appName}(${d.appCode})`"
                :value="d.appCode" />
            </c-select>
          </c-form-item>
        </c-col>
        <c-col :span="24">
          <c-form-item label="网络类型" prop="netType" :rules="rules.selectRequired">
            <c-radio-group v-model="formData.netType" :disabled="disabled">
              <c-radio v-for="(v, k) in APP_ENUMS.NET_TYPE" :key="k" :label="k">{{ v }}</c-radio>
            </c-radio-group>
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="资源分类" prop="packSceneId" :rules="rules.selectRequired">
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
      </c-row>
      <c-row :gutter="24">
        <c-col :span="16">
          <c-form-item label="资源介绍" prop="packDesc" :rules="rules.packDesc">
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
      <c-form-item label="资源图片" prop="imageList" :rules="rules.uploadRequired" disabled>
        <div class="picture-wrap">
          <div
            v-for="(path, i) in showImageList"
            :key="`uploadImg-${i}`"
            class="picture-item"
            @click.stop="''"
          >
            <img
              :src="PREVIEW_URL + path"
              style="object-fit:cover"
              class="picture-item-img"
            />
            <c-checkbox v-if="!isview" :disabled="disabled" :value="formData.imageList.includes(path)" @change="(v)=>handlePictureSelect(path, v)" />
            <span class="cover">
              <i
                class="c-icon-zoom-in"
                @click.stop="imgDialogImageUrl=PREVIEW_URL+path;imgDialogVisible=true;"
              />
              <i v-if="!isview&&uploadImgs.includes(path)" class="c-icon-delete" @click="handleRemoveImg(path)" />
            </span>
          </div>
          <c-upload
            v-show="(!isview&&!disabled&&formData.imageList.length<1)"
            :action="UPLOAD_URL"
            list-type="picture-card"
            accept=".jpeg,.jpg,.png"
            :multiple="false"
            :show-file-list="false"
            :before-upload="beforeUploadImg"
            :on-success="handleUploadImg"
            class="upload">
            <div class="c-upload-tip_box">
              <i class="c-ioc-icon-upload" />
              <div class="c-upload-text">点击上传</div>
            </div>
          </c-upload>
          <div class="c-upload__tip">
            请上传jpg/png格式文件，文件大小不超过5M，建议图片比例16:9
          </div>
        </div>
        <c-dialog :visible.sync="imgDialogVisible" class="dialog-center">
          <img width="100%" :src="imgDialogImageUrl" alt="">
        </c-dialog>
      </c-form-item>
      <c-form-item label="预览设置">
        <cardPreview ref="refCardPreview" class="card-preview" :img="selectImgIndex" :init-data="formData.coverConfigJson" @change="coverImgPreChange" />
      </c-form-item>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="projectInfo">项目信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="项目名称" prop="projectName">
            <c-input
              v-model="formData.projectName"
              maxlength="40"
              :disabled="disabled"
              placeholder="请输入" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="项目编号" prop="projectNum">
            <c-input
              v-model="formData.projectNum"
              maxlength="40"
              :disabled="disabled"
              placeholder="请输入" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="建设周期">
            <div v-if="isview">{{ formData.projectBuildDate && formData.projectBuildDate.join(' 至 ') || '--' }}</div>
            <c-date-picker
              v-else
              v-model="formData.projectBuildDate"
              :disabled="disabled"
              type="monthrange"
              range-separator="至"
              value-format="yyyy-MM"
              start-placeholder="开始月份"
              end-placeholder="结束月份">
            </c-date-picker>
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="立项金额(万元)" prop="projectAmount">
            <c-input-number
              v-model="formData.projectAmount"
              size="small"
              :controls="false"
              :disabled="disabled"
              :min="0"
              :max="999999999"
              placeholder="请输入"
              style="width:100%;text-align:left;" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="16">
          <c-form-item label="项目简介" prop="projectDesc">
            <c-input
              v-model="formData.projectDesc"
              :disabled="disabled"
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
      <c-form-item label="可研报告" prop="studyReport">
        <c-upload
          :action="UPLOAD_URL"
          :disabled="disabled"
          :limit="1"
          accept=".zip,.rar,.7z"
          :on-remove="handleRemoveReport"
          :on-success="handleUploadReport"
          :before-upload="beforeUploadReport"
          :file-list="formData.studyReport"
          :on-preview="handlePreview"
          style="width:320px">
          <c-button size="small" type="upload">选择文件</c-button>
          <div slot="tip" class="c-upload__tip">请上传RAR/ZIP/7Z等压缩包格式文档，大小不能超过100M</div>
        </c-upload>
      </c-form-item>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="firmInfo">厂商信息</h3>
      <c-row v-for="(d, k) in APP_ENUMS.FIRM_TYPE" :key="`FIRM_TYPE-${k}`" :gutter="24">
        <c-col :span="8">
          <c-form-item :label="d" :prop="`firmName${k}`">
            <c-input
              v-model="formData[`firmName${k}`]"
              maxlength="40"
              placeholder="请输入" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="联系人" :prop="`firmContact${k}`">
            <c-input
              v-model="formData[`firmContact${k}`]"
              maxlength="20"
              placeholder="请输入" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="联系方式" :prop="`firmContactWay${k}`">
            <c-input
              v-model="formData[`firmContactWay${k}`]"
              maxlength="40"
              placeholder="电话或邮箱" />
          </c-form-item>
        </c-col>
      </c-row>
    </div>
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </c-form>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'// 地址级联选择器
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { queryTagTree, allTenantOrganizations, userInfoByTenant, relationAppList } from '@/api/index'
import { checkPhoneOrTell, checkEmail, positiveInteger } from '@l/utils/validate.js'
import { bus } from '@/utils'
import { debounce } from '@l/utils'
import cestcTreeSelect from '@/components/cestc-tree-select'
import * as APP_ENUMS from '../enums.js'
import cardPreview from './card-pre.vue'
export default {
  name: 'Register',
  components: { cestcTreeSelect, cardPreview },
  props: {
    isview: Boolean,
    disabled: Boolean,
    shopCode: String
  },
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      PREVIEW_URL: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      areaSelectData: regionData, // options绑定的数据就是引入的 provinceAndCityData
      formData: {
        packSource: '',
        imageList: [],
        studyReport: [],
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
        selectRequired: { required: true, message: '请选择', trigger: ['change', 'blur'] },
        inputRequired: { required: true, message: '请输入', trigger: ['change', 'blur'] },
        uploadRequired: { required: true, message: '请上传', trigger: ['change', 'blur'] },
        packDesc: { required: true, message: '请填写资源介绍', trigger: ['change', 'blur'] },
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
        projectNum: {
          required: true,
          validator: (rule, val, cb) => {
            if (!val) return cb('支持字母、数字、中横线，长度40')
            const reg = /^[a-zA-Z0-9-]{1,40}$/
            if (!reg.test(val)) return cb('支持字母、数字、中横线，最大长度40')
            cb()
          }, trigger: ['change', 'blur'] },
        projectAmount: {
          required: true,
          validator: (rule, val, cb) => {
            if (!val) return cb('请输入')
            if (!positiveInteger(val)) return cb('请输入正确金额')
            cb()
          }, trigger: ['change', 'blur']
        },
        numOrEmail: {
          required: true,
          validator: (rule, val, cb) => {
            if (!val) return cb('请输入电话或邮箱')
            if (!(checkPhoneOrTell(val) || checkEmail(val))) return cb('请输入电话或邮箱')
            cb()
          }, trigger: ['change', 'blur']
        }
      },
      packSceneData: [],
      packTagData: [],
      CHANNEL: window.ENUMS.CHANNEL,
      APP_ENUMS,
      uploadImgs: [],
      initImgList: (window.__systemConfig && window.__systemConfig.packImages) || [],
      imgDialogVisible: false,
      imgDialogImageUrl: '',
      selectImgIndex: '',
      download: {
        name: '',
        url: ''
      },
      tenantOrganizationsData: [],
      userListData: [],
      detailData: null,
      isBackFill: false,
      appList: []
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
    this._formDataChange = debounce(this.formDataChange, 2000)
    this.getLabels(1)
    this.getLabels(2)
    this.getAllTenantOrganizations()
    this.userInfoInit()
    this.getRelationAppList()
  },
  mounted() {
    setTimeout(() => {
      this.$refs.refFormRegister.clearValidate()
    }, 100)
  },
  methods: {
    contactUserChange(v) {
      const user = v
      this.$set(this.formData, 'contactPhone', user.mobileNo)
      this.$set(this.formData, 'contactEmail', user.email)
      this.$nextTick(() => {
        this.$refs.refFormRegister.clearValidate(['contactPhone', 'contactEmail'])
      })
    },
    contactUserFilter(queryString, cb) {
      let restaurants = this.userListData
      if (queryString) {
        restaurants = this.userListData.filter(d => (d.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0))
      }
      cb(restaurants)
    },
    coverImgPreChange(data) {
      this.formData.coverConfigJson = data
    },
    formDataChange() {
      if (this.isBackFill) return
      console.log('----emit')
      bus.$emit('-bus-packappform-leave-validate-', true)
    },
    assetCodeChange() {
      bus.$emit('-bus-packappform-change-', this.getFormData(true))
    },
    appStatusChange() {
      if (+this.formData.buildChannel === 1 && [2, 3, 4].includes(+this.formData.appStatus)) {
        this.$set(this.formData, 'packSource', '3')
        this.getRelationAppList()
      } else {
        this.$set(this.formData, 'packSource', '')
      }
      this.$set(this.formData, 'assetCode', '')
      this.$nextTick(() => {
        this.$refs.refFormRegister.clearValidate('assetCode')
      })
      bus.$emit('-bus-packappform-change-', this.getFormData(true))
    },
    buildChannelChange() {
      if (+this.formData.buildChannel === 1 && [2, 3, 4].includes(+this.formData.appStatus)) {
        this.$set(this.formData, 'packSource', '3')
        this.getRelationAppList()
      } else {
        this.$set(this.formData, 'packSource', '')
      }
      this.$set(this.formData, 'assetCode', '')
      this.$nextTick(() => {
        this.$refs.refFormRegister.clearValidate('assetCode')
      })
      bus.$emit('-bus-packappform-change-', this.getFormData(true))
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
      this.formData.studyReport = fileList
      this.$refs.refFormRegister.validateField('studyReport')
    },
    handleUploadReport(response, file, fileList) {
      // 可研报告 上传成功
      if (response.code !== 0) {
        this.formData.studyReport = []
        this.$message.error(response.msg || '上传失败')
      } else {
        this.formData.studyReport = fileList
      }
      this.$refs.refFormRegister.validateField('studyReport')
    },
    beforeUploadReport(file) {
      console.log(file, '----beforeUploadReport')
      const reg = /\.(zip|rar|7z|gz|bz|ar|car|cpgz|dar)$/i
      if (!reg.test(file.name)) {
        this.$message.warning('请上传RAR/ZIP/7Z等压缩包格式文档')
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
    beforeUploadImg(file) {
      console.log(file, '-----beforeUploadImg')
      // 上传前狗子，单个不能超过5M
      const limit = 5 * 1024 * 1024
      if (file.size > limit) {
        this.$message.warning('单个文件不能超过5M')
        return false
      }
      if (this.uploadImgs.length >= 1) {
        this.$message.warning('最多选择1张图片')
        return false
      }
      return true
    },
    // 应用图片-选择为封面
    handleCover(path) {
      if (this.disabled) return
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
        this.formData.imageList = [path]
        this.selectImgIndex = path
      } else {
        this.formData.imageList = []
        this.selectImgIndex = ''
      }
    },
    // 应用图片-删除
    handleRemoveImg(path) {
      this.uploadImgs = this.uploadImgs.filter(d => d !== path)
      this.formData.imageList = this.formData.imageList.filter(d => d !== path)
      if (path === this.selectImgIndex) {
        this.selectImgIndex = this.formData.imageList[0] || ''
      }
      this.$refs.refFormRegister.validateField('imageList')
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
        this.formData.imageList = [response.data.relativePath]
        this.selectImgIndex = this.formData.imageList[0]
      }
      this.$refs.refFormRegister.validateField('imageList')
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
    backFill(data) {
      // 清空自动填充数据
      this.$set(this.formData, 'buildDeptId', '')
      this.$set(this.formData, 'contactUserName', '')
      this.$set(this.formData, 'contactPhone', '')
      this.$set(this.formData, 'contactEmail', '')
      this.$nextTick(() => {
        this.$refs.refFormRegister.clearValidate(['buildDeptId', 'contactUserName', 'contactPhone', 'contactEmail'])
      })
      this.isBackFill = true
      data.contactInfo = data.contactInfo ? JSON.parse(data.contactInfo) : {}
      data.projectInfo = data.projectInfo ? JSON.parse(data.projectInfo) : {}
      data.firmInfo = data.firmInfo ? JSON.parse(data.firmInfo) : []
      data.appStatus && (data.appStatus = data.appStatus + '')
      data.buildChannel && (data.buildChannel = data.buildChannel + '')
      data.netType && (data.netType = data.netType + '')
      this.detailData = data
      console.log(this.detailData)
      const keys = ['packName', 'appStatus', 'buildChannel', 'packSceneId', 'netType', 'packDesc', 'packSource', 'assetCode', 'assetName']
      keys.forEach(k => {
        if (data[k]) {
          this.$set(this.formData, k, data[k])
        }
      })
      this.$refs.refCardPreview.init(data.coverConfigJson)
      data.tagList && this.$set(this.formData, 'tagList', data.tagList.map(d => d.groupId))
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
      if (data.imageList) {
        const uploadImgs = []
        const imageList = data.imageList.map((d, i) => {
          this.selectImgIndex = d.filePath
          if (!this.initImgList.includes(d.filePath)) {
            uploadImgs.push(d.filePath)
          }
          return d.filePath
        })
        this.uploadImgs = uploadImgs
        this.$set(this.formData, 'imageList', imageList)
      }
      ['projectName', 'projectNum', 'projectAmount', 'projectDesc'].forEach(k => {
        if (data.projectInfo[k]) {
          this.$set(this.formData, k, data.projectInfo[k])
        }
      })
      if (data.projectInfo.projectBuildStartDate && data.projectInfo.projectBuildEndDate) {
        this.$set(this.formData, 'projectBuildDate', [data.projectInfo.projectBuildStartDate, data.projectInfo.projectBuildEndDate])
      }
      if (data.projectInfo.studyReport) {
        const file = { name: data.projectInfo.studyReport.fileName, url: data.projectInfo.studyReport.filePath }
        this.$set(this.formData, 'studyReport', [file])
      }
      if (Array.isArray(data.firmInfo)) {
        data.firmInfo.forEach(d => {
          d.firmName && this.$set(this.formData, `firmName${d.firmType}`, d.firmName)
          d.firmContact && this.$set(this.formData, `firmContact${d.firmType}`, d.firmContact)
          d.firmContactWay && this.$set(this.formData, `firmContactWay${d.firmType}`, d.firmContactWay)
        })
      }
      // 处理查看状态下，非必填项数据展示--问题
      if (this.isview) {
        ['contactEmail'].forEach(k => {
          if (!this.formData[k]) {
            this.formData[k] = '--'
          }
        })
      }
      setTimeout(() => {
        this.isBackFill = false
      }, 100)
    },
    getFormData(noValdate) {
      if (!noValdate) {
        this.$refs.refFormRegister.validateField('packName')
        this.$refs.refFormRegister.validateField('appStatus')
      }
      const params = { ...this.formData }
      params.packName = this.formData.packName
      params.coverConfigJson = this.formData.coverConfigJson

      params.appStatus = this.formData.appStatus
      params.buildChannel = this.formData.buildChannel
      if (+params.packSource === 3 && params.assetCode) {
        const item = this.appList.find(d => d.appCode === params.assetCode)
        params.assetName = item ? item.appName : ''
      }
      params.packSceneId = this.formData.packSceneId
      params.tagList = this.formData.tagList
      params.tagList = Array.isArray(params.tagList) ? params.tagList.map(d => ({ groupId: d })) : []
      params.netType = this.formData.netType
      params.packDesc = this.formData.packDesc
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
      this.formData.contactPhone && (contactInfo.contactPhone = this.formData.contactPhone)
      this.formData.contactEmail && (contactInfo.contactEmail = this.formData.contactEmail)
      params.contactInfo = Object.keys(contactInfo).length ? JSON.stringify(contactInfo) : ''

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
      // 项目信息
      const projectInfo = {}
      this.formData.projectName && (projectInfo.projectName = this.formData.projectName)
      this.formData.projectNum && (projectInfo.projectNum = this.formData.projectNum)
      this.formData.projectAmount && (projectInfo.projectAmount = this.formData.projectAmount)
      this.formData.projectDesc && (projectInfo.projectDesc = this.formData.projectDesc)
      if (this.formData.projectBuildDate) {
        projectInfo.projectBuildStartDate = this.formData.projectBuildDate[0]
        projectInfo.projectBuildEndDate = this.formData.projectBuildDate[1]
      }
      if (Array.isArray(this.formData.studyReport) && this.formData.studyReport[0]) {
        projectInfo.studyReport = {
          fileName: this.formData.studyReport[0].name,
          filePath: this.formData.studyReport[0].url || this.formData.studyReport[0].response.data.relativePath
        }
      }

      params.projectInfo = Object.keys(projectInfo).length ? JSON.stringify(projectInfo) : ''
      // 厂商信息
      const firmInfo = []
      Object.keys(this.APP_ENUMS.FIRM_TYPE).forEach(k => {
        const item = {
          firmType: k,
          firmName: this.formData[`firmName${k}`],
          firmContact: this.formData[`firmContact${k}`],
          firmContactWay: this.formData[`firmContactWay${k}`]
        }
        if (item.firmName || item.firmContact || item.firmContactWay) {
          firmInfo.push(item)
        }
      })
      params.firmInfo = firmInfo.length ? JSON.stringify(firmInfo) : ''
      console.log(params)
      return params
    },
    validateForm() {
      let flag
      this.$refs.refFormRegister.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFormData()
      })
      return flag
    },
    userInfoInit() {
      if (this.isBackFill) return
      if (this.buildDeptId && this.buildDeptId.length) return
      const { orgid, mobileNo, empid, email, empname } = this.$store.state.user.userInfo || {}
      this.userListData = [{ empId: empid, mobileNo, email, empName: empname, value: empname }]
      this.getUserInfoByTenant(orgid)
      orgid && this.$set(this.formData, 'buildDeptId', [orgid])
      empname && this.$set(this.formData, 'contactUserName', empname)
      mobileNo && this.$set(this.formData, 'contactPhone', mobileNo)
      email && this.$set(this.formData, 'contactEmail', email)
    },
    getAllTenantOrganizations() {
      this.tenantOrganizationsData = []
      allTenantOrganizations().then(res => {
        this.tenantOrganizationsData = res.data || []
      })
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
        this.$refs.refFormRegister.clearValidate(['contactUserName', 'contactPhone', 'contactEmail'])
      })
    },
    async getRelationAppList() {
      try {
        // 资源状态选择已上线3时仅过滤出已部署的数据
        const params = {
          type: +this.formData.appStatus === 3 ? 2 : 1,
          excludeShopCode: this.shopCode,
          tenantId: this.$store.state.user.userInfo.tenantId
        }
        const res = await relationAppList(params)
        this.appList = res.data
      } catch (e) {
        this.appList = []
        console.error(e)
      }
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
  .picture-wrap, .card-preview {
    margin-top: 10px;
  }
}
.picture-wrap {
  max-width: 850px;
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
  .picture-item:nth-child(n+7) {
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
.label-has-icon {
  position: relative;
  .icon-info {
    position: absolute;
    top: 3px;
    right: -20px;
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url(~@/assets/imgs/icon-info.png) no-repeat center;
    background-size: 100%;
  }
}
</style>
