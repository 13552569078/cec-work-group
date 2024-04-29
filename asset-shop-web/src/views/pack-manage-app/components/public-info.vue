<!--/*
* @Author: dingli
* @Desc: 上架信息
* @Date:
*/-->
<template>
  <c-form ref="refFormPublic" :model="formData" label-position="top" :disabled="formDisabledKey('all')||isview" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="versionInfo">版本信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="" prop="packVersion" :rules="rules.packVersion">
            <span slot="label" class="label-has-icon">版本号
              <c-tooltip v-if="packVersionType=='select'" placement="top-start">
                <div slot="content">只能选择在资源中心关联创建应用的已部署版本</div>
                <i class="icon-info" />
              </c-tooltip>
            </span>
            <c-input
              v-if="packVersionType=='input'"
              v-model="formData.packVersion"
              maxlength="20"
              :disabled="formDisabledKey()"
              placeholder="请输入" />
            <c-select
              v-if="packVersionType=='select'"
              v-model="formData.packVersion"
              specific-suffix
              :disabled="formDisabledKey()"
              @change="packVersionChange">
              <c-option
                v-for="v in packVersionList"
                :key="v.version"
                :label="v.version"
                :value="v.version" />
            </c-select>
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="适用终端" prop="assetSubtype" :rules="rules.selectRequired">
            <c-checkbox-group v-model="formData.assetSubtype" :disabled="formDisabledKey()">
              <c-checkbox v-for="d in APP_TYPES" :key="d.value" :label="d.value+''" name="assetSubtype">{{ d.label }}</c-checkbox>
            </c-checkbox-group>
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
              :disabled="formDisabledKey()"
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
          <c-form-item label="与数字资源服务门户统一用户中心" prop="unifyUc" :rules="rules.selectRequired">
            <c-radio-group v-model="formData.unifyUc" :disabled="formDisabledKey('update')">
              <c-radio label="1">是</c-radio>
              <c-radio label="0">否</c-radio>
            </c-radio-group>
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="" prop="applyType">
            <span slot="label" class="label-has-icon">
              支持申请类型
              <c-tooltip placement="top-start">
                <div slot="content">权限分配需统一用户中心；应用已申请订阅其他资源不能独立部署；第三方开发应用选择资源下载需上传资源包。</div>
                <i class="icon-info" />
              </c-tooltip>
            </span>
            <div v-if="isview&&!(formData.applyType&&formData.applyType.length)">--</div>
            <c-checkbox-group v-else v-model="formData.applyType" :disabled="formDisabledKey('update')" @change="applyTypeChange">
              <c-checkbox label="3" name="applyType" :disabled="applyTypeDisabled.includes('3')">权限分配</c-checkbox>
              <!-- <c-checkbox label="4" name="applyType" :disabled="applyTypeDisabled.includes('4')">独立部署</c-checkbox> -->
              <c-checkbox label="1" name="applyType" :disabled="applyTypeDisabled.includes('1')">资源下载</c-checkbox>
            </c-checkbox-group>
          </c-form-item>
        </c-col>
        <c-col v-if="packageInfoShow" :span="24">
          <c-form-item label="上传软件包" prop="packageInfo" :rules="rules.uploadRequired">
            <c-upload
              :action="UPLOAD_URL"
              :limit="1"
              accept=".zip,.rar,.7z"
              :on-remove="(...a)=>handleRemove('packageInfo',...a)"
              :on-success="(...a)=>handleUpload('packageInfo',...a)"
              :before-upload="(...a)=>beforeUpload('packageInfo',...a)"
              :file-list="formData.packageInfo"
              :disabled="formDisabledKey('update')"
              :on-preview="(...a)=>handlePreview('packageInfo',...a)"
              style="width:320px">
              <c-button size="small" type="upload">选择文件</c-button>
              <div slot="tip" class="c-upload__tip">请上传RAR/ZIP/7Z等压缩包格式文档，大小不能超过500M</div>
            </c-upload>
          </c-form-item>
        </c-col>
        <c-col v-if="formData.assetSubtype.includes('3')" :span="16">
          <c-form-item label="访问方式（PC）" prop="accessWayPc" :rules="rules.inputRequired">
            <c-input
              v-model="formData.accessWayPc"
              type="textarea"
              maxlength="200"
              :disabled="formDisabledKey()"
              :rows="4"
              :autosize="isview?true:false"
              resize="none"
              show-word-limit
              placeholder="请输入" />
          </c-form-item>
        </c-col>
        <c-col v-if="formData.assetSubtype.includes('4')" :span="16">
          <c-form-item label="访问方式（H5）" prop="accessWayH5" :rules="rules.inputRequired">
            <c-input
              v-model="formData.accessWayH5"
              type="textarea"
              maxlength="200"
              :disabled="formDisabledKey()"
              :rows="4"
              :autosize="isview?true:false"
              resize="none"
              show-word-limit
              placeholder="请输入" />
          </c-form-item>
        </c-col>
      </c-row>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="securityInfo">安全信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="等保等级" prop="secLevel">
            <c-select v-model="formData.secLevel" specific-suffix :disabled="formDisabledKey()">
              <c-option
                v-for="(v, k) in APP_ENUMS.SEC_LEVEL"
                :key="k"
                :label="v"
                :value="k" />
            </c-select>
          </c-form-item>
        </c-col>
      </c-row>
      <c-form-item label="等保备案" prop="secFiling">
        <c-upload
          :action="UPLOAD_URL"
          :limit="1"
          :disabled="formDisabledKey()"
          accept=".jpeg,.jpg,.png"
          :on-remove="(...a)=>handleRemove('secFiling',...a)"
          :on-success="(...a)=>handleUpload('secFiling',...a)"
          :before-upload="(...a)=>beforeUpload('secFiling',...a)"
          :file-list="formData.secFiling"
          :on-preview="(...a)=>handlePreview('secFiling',...a)"
          style="width:320px">
          <c-button size="small" type="upload">选择文件</c-button>
          <div slot="tip" class="c-upload__tip">请上传PDF/JPG/PNG格式文档，大小不能超过10M</div>
        </c-upload>
      </c-form-item>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="系统管理员" prop="secSysAdmin">
            <c-autocomplete
              v-model="formData.secSysAdmin"
              value-key="empName"
              :fetch-suggestions="(...a)=>querySearch('secSysAdmin', ...a)"
              placeholder="请输入"
              :trigger-on-focus="true"
            ></c-autocomplete>
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="安全保密员" prop="secSecrecy">
            <c-autocomplete
              v-model="formData.secSecrecy"
              value-key="empName"
              :fetch-suggestions="(...a)=>querySearch('secSecrecy', ...a)"
              placeholder="请输入"
              :trigger-on-focus="true"
            ></c-autocomplete>
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="安全审计员" prop="secAuditor">
            <c-autocomplete
              v-model="formData.secAuditor"
              value-key="empName"
              :fetch-suggestions="(...a)=>querySearch('secAuditor', ...a)"
              placeholder="请输入"
              :trigger-on-focus="true"
            ></c-autocomplete>
          </c-form-item>
        </c-col>
      </c-row>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="caseGuide">案例指导</h3>
      <c-form-item label="成功案例" prop="caseExample">
        <vue-tinymce
          key="caseExample"
          :height="200"
          :editor-content="formData.caseExample"
          :status="isview?1:0"
          :disabled="formDisabledKey('all')"
          class="cls-tinymce"
          @editorBlur="editorBlur"
        />
      </c-form-item>
      <c-form-item label="使用指南" prop="useGuide" :rules="rules.uploadRequired">
        <c-upload
          :action="UPLOAD_URL"
          :limit="1"
          :disabled="formDisabledKey()"
          accept=".zip,.rar,.7z"
          :on-remove="(...a)=>handleRemove('useGuide',...a)"
          :on-success="(...a)=>handleUpload('useGuide',...a)"
          :before-upload="(...a)=>beforeUpload('useGuide',...a)"
          :file-list="formData.useGuide"
          :on-preview="(...a)=>handlePreview('useGuide',...a)"
          style="width:320px">
          <c-button size="small" type="upload">选择文件</c-button>
          <div slot="tip" class="c-upload__tip">请上传RAR/ZIP/7Z等压缩包格式文档，大小不能超过100M</div>
        </c-upload>
      </c-form-item>
      <c-form-item label="测试报告" prop="testReport">
        <div v-if="isview&&!(formData.testReport&&formData.testReport.length)">--</div>
        <c-upload
          v-else
          :action="UPLOAD_URL"
          :limit="1"
          :disabled="formDisabledKey()"
          accept=".zip,.rar,.7z"
          :on-remove="(...a)=>handleRemove('testReport',...a)"
          :on-success="(...a)=>handleUpload('testReport',...a)"
          :before-upload="(...a)=>beforeUpload('testReport',...a)"
          :file-list="formData.testReport"
          :on-preview="(...a)=>handlePreview('testReport',...a)"
          style="width:320px">
          <c-button size="small" type="upload">选择文件</c-button>
          <div slot="tip" class="c-upload__tip">请上传RAR/ZIP/7Z等压缩包格式文档，大小不能超过100M</div>
        </c-upload>
      </c-form-item>
    </div>
    <!-- 文件下载 -->
    <a
      ref="refDownload"
      :href="download.url"
      :download="download.name"
    ></a>
  </c-form>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import vueTinymce from '@/components/tinymce'
import { bus } from '@/utils'
import { debounce } from '@l/utils'
import * as APP_ENUMS from '../enums.js'
import { deployVersionList, validateAppPack, userInfoByTenant } from '@/api'
export default {
  name: 'PublicInfo',
  components: { vueTinymce },
  props: {
    isview: Boolean,
    shopCode: String
  },
  data() {
    return {
      UPLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload',
      DOWNLOAD_URL: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/download',
      formData: {
        assetSubtype: [],
        applyType: [],
        secFiling: [],
        useGuide: [],
        packageInfo: [],
        testReport: [],
        unifyUc: '',
        accessWayPc: '',
        accessWayH5: ''
      },
      rules: {
        selectRequired: { required: true, message: '请选择', trigger: ['change', 'blur'] },
        inputRequired: { required: true, message: '请输入', trigger: ['change', 'blur'] },
        uploadRequired: { required: true, message: '请上传', trigger: ['change', 'blur'] },
        packVersion: [
          { required: true, validator: (rule, val, cb) => {
            if (!val) {
              const str = this.packVersionType === 'input' ? '请输入版本号' : '请选择版本号'
              return cb(str)
            }
            if (this.packVersionType === 'input' && !/^[a-zA-Z]{1}[0-9a-zA-Z_.]{0,20}$/.test(val)) {
              return cb('长度20，字母开头，支持英文、数字、下划线、句点')
            }
            cb()
          }, trigger: ['change', 'blur'] }
        ]
      },
      APP_ENUMS,
      download: {
        name: '',
        url: ''
      },
      packVersionType: 'input',
      packVersionList: [],
      applyTypeDisabled: [],
      userDataList: [],
      APP_TYPES: window.ENUMS.TAB_APP_TYPE,
      changefromData: {},
      detailData: null
    }
  },
  computed: {
    packageInfoShow() {
      // 第三方渠道，并且申请类型选择资源下载
      if (this.formData.applyType.includes('1') && +this.changefromData.buildChannel === 2) {
        return true
      }
      return false
    }
  },
  watch: {
    'formData.unifyUc': {
      handler() {
        // 选择 是 可 选择权限分配
        if (+this.formData.unifyUc === 1) {
          this.applyTypeDisabled = this.applyTypeDisabled.filter(d => +d !== 3)
        } else {
          this.$set(this.formData, 'applyType', this.formData.applyType.filter(d => +d !== 3))
          this.applyTypeDisabled = [...this.applyTypeDisabled, '3']
        }
      }
    },
    formData: {
      handler() {
        if (this.isBackFill) return
        debounce(this.formDataChange, 1000)
      },
      deep: true
    }
  },
  created() {
    bus.$on('-bus-packappform-change-', this.regirterformDataChange)
    this.getUserInfoByTenant()
  },
  destroyed() {
    bus.$off('-bus-packappform-change-', this.regirterformDataChange)
  },
  methods: {
    formDisabledKey(key) {
      const navList0 = (this.$store.state.publicManage.navList || [])[0]
      if (this.detailData && +this.detailData.packStatus === 15) {
        if (navList0 && +navList0.state === 13) {
        // 已注册-更新 全部不可编辑
          return true
        }
        if (navList0 && +navList0.state === 4) {
        // 已上架-更新 系统管理员/安全保密员/安全审计员/成功案例可编辑，其他不可不编辑
          if (key === 'update') return false
          if (key === 'all') return false
          return true
        }
      } else if (this.detailData && +this.detailData.packStatus === 0) {
        // 重新上架 系统管理员/安全保密员/安全审计员/成功案例可编辑，其他不可不编辑
        if (navList0 && +navList0.state === 4 || +navList0.state === 5) {
          if (key === 'update') return false
          if (key === 'all') return false
          return true
        }
      }
      return false
    },
    packVersionChange() {
      this.$set(this.formData, 'applyType', [])
      const item = this.packVersionList.find(d => d.version === this.formData.packVersion)
      console.log(item, '=====packVersionChange')
      if (!item) return
      if (item.accessUrl && /^\{(.+)\}$/.test(item.accessUrl)) {
        const accessUrl = JSON.parse(item.accessUrl)
        accessUrl.pc && this.$set(this.formData, 'accessWayPc', accessUrl.pc)
        accessUrl.h5 && this.$set(this.formData, 'accessWayH5', accessUrl.h5)
      }
      if (Array.isArray(item.appType)) {
        // 发布端数组内的值是字符串格式
        this.$set(this.formData, 'assetSubtype', item.appType.map(d => d + ''))
      }
    },
    formDataChange() {
      bus.$emit('-bus-packappform-leave-validate-', true)
    },
    querySearch(type, queryString, cb) {
      // 模糊匹配用户
      if (!queryString) return cb(this.userDataList)
      const listData = this.userDataList.filter(d => d.empName.includes(queryString))
      return cb(listData)
    },
    regirterformDataChange(data) {
      this.changefromData = data
      console.log('----regirterformDataChange----', data.buildChannel)
      if (!data.buildChannel) return
      // 资源中心开发的应用：下拉选择版本号，申请类型可选择 4独立部署、1资源下载
      if (+data.buildChannel === 1) {
        this.packVersionType = 'select'
        this.applyTypeDisabled = this.applyTypeDisabled.filter(d => +d === 3)
        this.getVersionList()
      } else {
        this.packVersionType = 'input'
        this.applyTypeDisabled = [...this.applyTypeDisabled, '4']
        this.$set(this.formData, 'applyType', this.formData.applyType.filter(d => +d === 3))
      }
      this.$set(this.formData, 'packVersion', '')

      this.$nextTick(() => {
        this.$refs.refFormPublic && this.$refs.refFormPublic.clearValidate('packVersion')
      })
    },
    applyTypeChange() {
      // 独立部署、资源下载 需要判断是否打包
      const hasDownload = this.formData.applyType.find(d => (+d === 1))
      const hasPublic = this.formData.applyType.find(d => (+d === 4))
      if ((hasDownload || hasPublic) && +this.changefromData.buildChannel === 1) {
        if (!this.formData.packVersion) {
          this.$set(this.formData, 'applyType', this.formData.applyType.filter(d => (+d !== 1 && +d !== 4)))
          return this.$message.warning('请先选择版本号！')
        }
        const params = {
          appCode: this.changefromData.assetCode,
          version: this.formData.packVersion,
          type: 2,
          tenantId: this.$store.state.user.userInfo.tenantId
        }
        // 仅部署 门户+运营 屏蔽掉开发中心的接口
        if (window.__systemConfig && +window.__systemConfig.deployType === 2) {
          return
        }
        // 校验是否打包
        validateAppPack(params).then(res => {
          if (+res.data.useSubResourceFlag === 1 && hasPublic) {
            this.$set(this.formData, 'applyType', this.formData.applyType.filter(d => (+d !== 1 && +d !== 4)))
            this.$confirm('该应用存在订阅资源，不支持独立部署！', {
              title: '提示',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              confirmButtonIsLeft: false,
              iconClass: 'c-ioc-icon-warning',
              type: 'warning'
            }).then((k) => {
            }).catch(() => {})
            return
          } else if (+res.data.packStatus !== 2) {
            this.$set(this.formData, 'applyType', this.formData.applyType.filter(d => (+d !== 1 && +d !== 4)))
            this.$confirm('该应用尚未完成打包，不能支持资源下载！', {
              title: '提示',
              confirmButtonText: '前往打包',
              cancelButtonText: '取消',
              confirmButtonIsLeft: false,
              iconClass: 'c-ioc-icon-warning',
              type: 'warning'
            }).then((k) => {
              if (!window.__systemConfig.assetCenterUrl) return this.$message.warning('路径获取有误！')
              window.open(`${window.__systemConfig.assetCenterUrl}application-management`)
            }).catch(() => {})
            return
          }
        })
      }
    },
    handleRemove(type, file, fileList) {
      // 删除
      if (this.isview) return false
      if (this.formDisabledKey()) return false
      this.formData[type] = fileList
      this.$refs.refFormPublic.validateField(type)
    },
    handleUpload(type, response, file, fileList) {
      // 上传成功
      if (response.code !== 0) {
        this.formData[type] = []
        this.$message.error(response.msg || '上传失败')
      } else {
        this.formData[type] = fileList
      }
      this.$refs.refFormPublic.validateField(type)
    },
    beforeUpload(type, file) {
      console.log(file, '----beforeUploadReport')
      let limit = 100
      if (type !== 'secFiling') {
        limit = 10
        const reg = /\.(zip|rar|7z|gz|bz|ar|car|cpgz|dar)$/i
        if (!reg.test(file.name)) {
          this.$message.warning('请上传RAR/ZIP/7Z等压缩包格式文档')
          return false
        }
      }
      if (type === 'packageInfo') {
        limit = 500
      }
      // 上传前狗子，单个不能超过 **M
      if (file.size > (limit * 1024 * 1024)) {
        this.$message.warning(`单个文件不能超过${limit}M`)
        return false
      }
      return true
    },
    handlePreview(type, file) {
      file.url = file.url || file.response.data.relativePath
      // 点击文件列表的狗子函数
      this.download.name = file.name
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${file.url}&filename=${encodeURI(file.name)}`
      this.$nextTick(() => {
        this.$refs.refDownload.click()
      })
    },
    // 编辑器失去焦点
    editorBlur(content) {
      console.log('----editorBlur-----')
      this.$set(this.formData, 'caseExample', content)
      this.$refs.refFormPublic.validateField('caseExample')
    },
    backFill(data) {
      this.regirterformDataChange(data)
      data.caseGuide = data.caseGuide ? JSON.parse(data.caseGuide) : {}
      data.securityInfo = data.securityInfo ? JSON.parse(data.securityInfo) : {}
      data.packageInfo = data.packageInfo ? JSON.parse(data.packageInfo) : {}
      typeof data.unifyUc === 'number' && (data.unifyUc = data.unifyUc + '')
      this.detailData = data
      console.log(this.detailData)

      data.assetSubtype && this.$set(this.formData, 'assetSubtype', data.assetSubtype.split(','))
      data.packVersion && this.$set(this.formData, 'packVersion', data.packVersion)
      data.packVersionDesc && this.$set(this.formData, 'packVersionDesc', data.packVersionDesc)
      // 兼容旧数据accessWay不是JSON串
      data.accessWay = data.accessWay && /^\{(.+)\}$/.test(data.accessWay) ? JSON.parse(data.accessWay) : {}
      data.accessWay.pc && this.$set(this.formData, 'accessWayPc', data.accessWay.pc)
      data.accessWay.h5 && this.$set(this.formData, 'accessWayH5', data.accessWay.h5)
      data.unifyUc && this.$set(this.formData, 'unifyUc', data.unifyUc)
      data.applyType && this.$set(this.formData, 'applyType', data.applyType.split(','))

      data.securityInfo.secLevel && this.$set(this.formData, 'secLevel', data.securityInfo.secLevel)
      data.securityInfo.secSysAdmin && this.$set(this.formData, 'secSysAdmin', data.securityInfo.secSysAdmin)
      data.securityInfo.secSecrecy && this.$set(this.formData, 'secSecrecy', data.securityInfo.secSecrecy)
      data.securityInfo.secAuditor && this.$set(this.formData, 'secAuditor', data.securityInfo.secAuditor)
      if (data.securityInfo.secFiling) {
        const file = { name: data.securityInfo.secFiling.fileName, url: data.securityInfo.secFiling.filePath }
        this.$set(this.formData, 'secFiling', [file])
      }

      this.$set(this.formData, 'caseExample', data.caseGuide.caseExample || '')
      if (data.caseGuide.useGuide) {
        const file = { name: data.caseGuide.useGuide.fileName, url: data.caseGuide.useGuide.filePath }
        this.$set(this.formData, 'useGuide', [file])
      }
      if (data.packageInfo && data.packageInfo.filePath) {
        const file = { name: data.packageInfo.fileName, url: data.packageInfo.filePath }
        this.$set(this.formData, 'packageInfo', [file])
      }
      if (data.caseGuide.testReport) {
        const file = { name: data.caseGuide.testReport.fileName, url: data.caseGuide.testReport.filePath }
        this.$set(this.formData, 'testReport', [file])
      }
      if (this.isview) {
        ['caseExample'].forEach(k => {
          if (!this.formData[k]) {
            this.formData[k] = '--'
          }
        })
      }
    },
    getFormData() {
      const params = { ...this.formData }
      params.applyType = this.formData.applyType ? this.formData.applyType.join(',') : ''
      params.assetSubtype = Array.isArray(params.assetSubtype) ? params.assetSubtype.join(',') : ''
      const securityInfo = {}
      this.formData.secLevel && (securityInfo.secLevel = this.formData.secLevel)
      this.formData.secSysAdmin && (securityInfo.secSysAdmin = this.formData.secSysAdmin)
      this.formData.secSecrecy && (securityInfo.secSecrecy = this.formData.secSecrecy)
      this.formData.secAuditor && (securityInfo.secAuditor = this.formData.secAuditor)
      if (this.formData.secFiling && this.formData.secFiling[0]) {
        securityInfo.secFiling = {
          fileName: this.formData.secFiling[0].name,
          filePath: this.formData.secFiling[0].url || this.formData.secFiling[0].response.data.relativePath
        }
      }
      params.securityInfo = Object.keys(securityInfo).length ? JSON.stringify(securityInfo) : ''

      const caseGuide = {}
      this.formData.caseExample && (caseGuide.caseExample = this.formData.caseExample)
      if (this.formData.useGuide && this.formData.useGuide[0]) {
        caseGuide.useGuide = {
          fileName: this.formData.useGuide[0].name,
          filePath: this.formData.useGuide[0].url || this.formData.useGuide[0].response.data.relativePath
        }
      }
      if (this.formData.testReport && this.formData.testReport[0]) {
        caseGuide.testReport = {
          fileName: this.formData.testReport[0].name,
          filePath: this.formData.testReport[0].url || this.formData.testReport[0].response.data.relativePath
        }
      }
      params.caseGuide = Object.keys(caseGuide).length ? JSON.stringify(caseGuide) : ''
      // 第三方渠道 且 资源下载时 资源包必传
      if (this.formData.applyType.findIndex(d => +d === 1) !== -1 && +this.changefromData.buildChannel === 2 && this.formData.packageInfo && this.formData.packageInfo[0]) {
        const packageInfo = {
          fileName: this.formData.packageInfo[0].name,
          filePath: this.formData.packageInfo[0].url || this.formData.packageInfo[0].response.data.relativePath
        }
        params.packageInfo = JSON.stringify(packageInfo)
      } else {
        params.packageInfo = ''
      }
      const accessWay = {}
      if (this.formData.accessWayH5) {
        accessWay.h5 = this.formData.accessWayH5
      }
      if (this.formData.accessWayPc) {
        accessWay.pc = this.formData.accessWayPc
      }
      params.accessWay = JSON.stringify(accessWay)
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
    async getVersionList() {
      try {
        const params = {
          appCode: this.changefromData.assetCode,
          tenantId: this.$store.state.user.userInfo.tenantId
        }
        const res = await deployVersionList(params)
        this.packVersionList = res.data
      } catch (e) {
        this.packVersionList = []
      }
    },
    getUserInfoByTenant() {
      userInfoByTenant().then(res => {
        this.userDataList = res.data || []
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
::v-deep.c-form.disabled-new {
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
  ::v-deep.c-form-item {
    margin-bottom: 20px !important;
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
