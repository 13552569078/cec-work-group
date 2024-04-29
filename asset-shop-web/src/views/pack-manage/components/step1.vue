<!--/*
* @Author: dingli
* @Desc: 第一步 - 选择上架资源
* @Date: 2022-2-9
*/-->
<template>
  <c-form ref="refFormStep1" :model="formData" label-position="top" :disabled="disabled" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="shangjaiziyuan">上架资源</h3>
      <c-form-item label="上架方式" prop="packSource" :rules="rules.packSource">
        <c-radio-group v-model="formData.packSource" @change="radioChange">
          <c-radio label="1">选择资源</c-radio>
          <c-radio label="2">上传资源包</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-row v-if="formData.packSource==1" :gutter="34">
        <c-col :span="8">
          <c-form-item label="已打包资源" prop="selectAsset" :rules="rules.selectAsset">
            <div class="c-input__inner cls-select-input">
              <div @click="clickSelectAsset">
                <i class="c-icon-document"></i>
                <span v-show="!formData.selectAsset" class="placeholder">请选择</span>
                <span v-show="!!formData.selectAsset">{{ formData.selectAsset }}</span>
              </div>
              <i class="c-icon-circle-close" @click="clickSelectAssetClear" />
            </div>
          </c-form-item>
        </c-col>
      </c-row>
      <c-form-item v-if="formData.packSource!=1" label="资源包" prop="fileList" :rules="rules.pack">
        <c-upload
          :action="UPLOAD_URL"
          :on-remove="handleRemove"
          :on-success="handleUpload"
          :before-remove="beforeRemove"
          :limit="1"
          accept=".zip"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
          :file-list="formData.fileList"
          :on-preview="handlePreview"
          style="width:320px">
          <c-button size="small" type="upload">选择文件</c-button>
          <div slot="tip" class="c-upload__tip">请上传ZIP压缩包格式文档，大小不能超过50M</div>
        </c-upload>
      </c-form-item>
    </div>
    <div class="bg-white">
      <h3 class="info-title" data-section="ziyuanbaoxinxi">资源包信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="资源名称">
            <c-input
              v-model="formData.assetName"
              placeholder=""
              :disabled="true" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="资源编码">
            <c-input
              v-model="formData.assetCode"
              placeholder=""
              :disabled="true" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="版本号">
            <c-input
              v-model="formData.assetVersion"
              placeholder=""
              :disabled="true" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="资源类型">
            <c-input
              :value="assetTypeFilter(formData.assetType, formData.assetSubtype)"
              placeholder=""
              :disabled="true" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-form-item label="引用资源">
        <c-table :data="tableData" :border="true">
          <c-table-column type="index" label="#" />
          <c-table-column prop="referAssetName" show-overflow-tooltip label="资源名称" />
          <c-table-column prop="referAssetCode" show-overflow-tooltip label="资源编码" />
          <c-table-column prop="referAssetVersion" show-overflow-tooltip label="资源版本号" />
          <c-table-column prop="referAssetSubtype" show-overflow-tooltip label="资源类型">
            <template slot-scope="scope">
              {{ assetTypeFilter(scope.row.referAssetType, scope.row.referAssetSubtype) }}
            </template>
          </c-table-column>
          <c-table-column prop="referAssetDesc" label="资源描述" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.referAssetDesc||'--' }}
            </template>
          </c-table-column>
        </c-table>
      </c-form-item>
    </div>
    <c-dialog
      title="提示"
      class="dialog-center"
      :visible.sync="dialogVisible"
      width="424px"
      @before-close="dialogVisible=false">
      <div class="c-message-box__container">
        <div class="c-message-box__status c-ioc-icon-warning" />
        <div class="c-message-box__message">
          <p>上架列表中已存在该资源！</p>
          <p style="font-size: 12px; cursor: pointer;margin-top:10px" @click="showDetail">资源编码：{{ viewshopCode }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <c-button type="" @click="dialogVisible = false">关闭</c-button>
        <c-button v-show="!hideDetailViewBtn" type="primary" size="small" @click="showDetail">查看</c-button>
      </span>
    </c-dialog>
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    />
    <dialog-packed :visible="dialogPackedVisible" :asset-type="assetType" :shop-code="shopCode" :init="selectAssetData" @ok="dialogPackedOk" @close="dialogPackedVisible=false" />
  </c-form>
</template>
<script>
import { mapState } from 'vuex'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
const UPLOAD_FILE_URL = getProxyUrl(serviceSuffix.file_upload)
import { parsePack } from '@/api/index'
import { asseTypeFormatLong } from '@/utils/enum'
import { bus, downloadFile } from '@/utils'
import DialogPacked from './dialog-packed.vue'
export default {
  name: '',
  components: { DialogPacked },
  props: {
    isview: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      UPLOAD_URL: UPLOAD_FILE_URL + '/fdfs/upload',
      shopCode: this.$route.params.shopCode || this.$route.query.shopCode,
      dialogVisible: false,
      disabled: false,
      formData: {
        packSource: '1',
        selectAsset: '',
        fileList: []
      },
      tableData: [],
      rules: {},
      rules2: {
        pack: { required: true, message: '请上传资源包', trigger: ['change', 'blur'] },
        packSource: { required: true, message: '请选择上架方式', trigger: 'change' },
        selectAsset: { required: true, message: '请选择已打包资源', trigger: ['change', 'blur'] }
      },
      resInfo: null,
      download: {
        name: '',
        url: ''
      },
      oldData: null,
      viewshopCode: '',
      dialogPackedVisible: false,
      selectAssetData: null,
      hideDetailViewBtn: false,
      asseTypeFormatLong
    }
  },
  computed: {
    ...mapState({
      assetType: state => state.publicManage && state.publicManage.assetType || ''
    })
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
    },
    'formData.selectAsset': {
      handler(nv) {
        this.$refs.refFormStep1.validateField('selectAsset')
      }
    }
  },
  methods: {
    assetTypeFilter(type, subType) {
      if (!type && !subType) {
        return this.isview ? '--' : ''
      }
      return asseTypeFormatLong(type, subType, '-')
    },
    radioChange() {
      if (+this.formData.packSource === 1) {
        this.handleRemove(null, [])
      } else {
        this.clickSelectAssetClear()
      }
    },
    dialogPackedOk(data) {
      this.selectAssetData = data
      this.$set(this.formData, 'selectAsset', `${data.assetName}_${data.version}`)
      this.dialogPackedVisible = false
      this.parsePackFn(data.packFilePath)
    },
    clickSelectAsset() {
      if (this.disabled) return
      if (this.isview) {
        const file = {
          url: this.selectAssetData.packFilePath,
          name: this.formData.selectAsset
        }
        this.handlePreview(file)
        return
      }
      this.dialogPackedVisible = true
    },
    clickSelectAssetClear() {
      if (this.isview || this.disabled) return
      this.$set(this.formData, 'selectAsset', '')
      this.$set(this.formData, 'assetName', '')
      this.$set(this.formData, 'assetCode', '')
      this.$set(this.formData, 'assetType', '')
      this.$set(this.formData, 'assetSubtype', '')
      this.$set(this.formData, 'assetVersion', '')
      this.tableData = []
      this.selectAssetData = null
    },
    beforeUpload(file) {
      // 上传文件之前的钩子
      if (!/(\.zip$)/i.test(file.name)) {
        this.$message.warning('请上传ZIP压缩包格式文档，大小不能超过50M')
        return false
      }
      const limit = 50 * 1024 * 1024
      if (file.size > limit) {
        this.$message.warning('单个文件不能超过50M')
        return false
      }
      return true
    },
    handlePreview(file) {
      const path = file.url || file.response.data.relativePath
      const name = file.name
      const href = `${UPLOAD_FILE_URL}/fdfs/download?relativePath=${path}&filename=${encodeURI(name)}`
      downloadFile(href, name + '.zip')
    },
    // 删除上传文件
    handleRemove(file, fileList) {
      if (this.isview) return false
      this.formData.fileList = fileList
      this.$refs.refFormStep1.validateField('fileList')
      this.$set(this.formData, 'assetName', '')
      this.$set(this.formData, 'assetCode', '')
      this.$set(this.formData, 'assetVersion', '')
      this.$set(this.formData, 'assetType', '')
      this.$set(this.formData, 'assetSubtype', '')
      this.tableData = []
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多上传1个文件')
    },
    beforeRemove(file, fileList) {
      // if (this.isview) return false
      // return this.$confirm(`确定移除 ${file.name}？`, '提示', {
      //   confirmButtonText: '确认',
      //   cancelButtonText: '取消',
      //   confirmButtonIsLeft: false
      // })
    },
    // 包上传成功
    handleUpload(response, file, fileList) {
      if (response.code !== 0) {
        this.formData.fileList = []
        return this.$message.error(response.msg || '上传失败')
      }
      this.formData.fileList = fileList
      this.$refs.refFormStep1.validateField('fileList')
      this.parsePackFn(response.data.relativePath, file.name)
    },
    async parsePackFn(path, name) {
      try {
        const res = await parsePack({ packFilePath: path })
        if (!(+res.data.assetType === +this.assetType || +res.data.assetSubtype === +this.assetType)) {
          this.formData.fileList = []
          return this.$message.error('资源类型错误！')
        }
        this.resInfo = res.data
        this.$set(this.formData, 'assetName', res.data.assetName)
        this.$set(this.formData, 'assetCode', res.data.assetCode)
        this.$set(this.formData, 'assetVersion', res.data.assetVersion)
        this.$set(this.formData, 'assetType', res.data.assetType)
        this.$set(this.formData, 'assetSubtype', res.data.assetSubtype)
        this.tableData = res.data.referAssetList
        if (res.data.shopCode && this.shopCode !== res.data.shopCode) {
          this.viewshopCode = res.data.shopCode
          this.dialogVisible = true
          this.hideDetailViewBtn = +res.data.packByCurrentTenant === 0
          return
        }
        bus.$emit('bus-parsepack', { ...res.data })
        this.$emit('change', {
          filePath: path,
          fileName: name || ''
        })
      } catch (e) {
        //
      }
    },
    // 跳转查看已存在的资源信息
    async showDetail(shopCode) {
      try {
        this.dialogVisible = false
        const path = this.$route.path
        const toPath = location.href.replace(/\?.+/, '').replace(path, `/packManage/asset/config/${this.viewshopCode}`)
        window.open(`${toPath}?assetType=${this.assetType}`)
      } catch (e) {
        //
      }
    },
    // 校验表单
    validate() {
      let flag
      let change
      this.$refs.refFormStep1.validate((valid) => {
        if (!valid) return (flag = null)
        flag = {
          packSource: this.formData.packSource
        }
        if (+flag.packSource === 1) {
          flag.packFile = {
            fileName: `${this.selectAssetData.assetCode}_${this.selectAssetData.version}`,
            filePath: this.selectAssetData.packFilePath
          }
        } else {
          flag.packFile = {
            fileName: this.formData.fileList[0].name,
            filePath: this.formData.fileList[0].url || this.formData.fileList[0].response.data.relativePath
          }
        }
        change = !(this.oldData && this.oldData.packFile.filePath === flag.packFile.filePath && +this.oldData.packSource === +flag.packSource)
      })
      return flag ? {
        change: change,
        data: flag
      } : null
    },
    initForm(data, change) {
      // 升级未提交的状态下允许编辑上架资源信息
      const leftNavList = this.$store.state.publicManage && this.$store.state.publicManage.navList || []
      if (+data.packStatus === 15) {
        this.disabled = true
      } else if (+data.packStatus === 0 && leftNavList.length === 2) {
        this.disabled = true
      } else {
        this.disabled = false
      }
      // 兼容旧数据
      data.packSource = data.packSource || 2
      this.oldData = { packFile: data.packFile, packSource: data.packSource }
      if (data && data.shopCode) {
        this.shopCode = data.shopCode
      }
      if (change) return
      this.$set(this.formData, 'packSource', data.packSource + '')
      this.$set(this.formData, 'assetName', data.assetName)
      this.$set(this.formData, 'assetCode', data.assetCode)
      this.$set(this.formData, 'assetVersion', data.assetVersion)
      this.$set(this.formData, 'assetType', data.assetType)
      this.$set(this.formData, 'assetSubtype', data.assetSubtype)
      this.tableData = data.referAssetList
      if (+data.packSource === 1) {
        this.$set(this.formData, 'selectAsset', `${data.assetName}_${data.assetVersion}`)
        this.selectAssetData = {
          assetName: data.assetName,
          version: data.assetVersion,
          assetCode: data.assetCode,
          packFilePath: data.packFile.filePath
        }
      } else {
        this.formData.fileList = [{ name: data.packFile.fileName, url: data.packFile.filePath }]
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
.cls-select-input {
  height: 32px;
  line-height: 32px;
  position: relative;
  cursor: pointer;
  .c-icon-document {
    display: none;
  }
  .c-icon-circle-close {
    display: none;
    position: absolute;
    right: 8px;
    top: 8px;
  }
  .placeholder {
    color: #BDBDBD;
  }
  &:hover {
    .c-icon-circle-close {
      display: block;
    }
  }
}
.pt22 {
  padding-top: 22px;
}
::v-deep.c-form.disabled-new {
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
  .c-radio {
    display: none;
    font-weight: 400;
  }
  .c-radio__input {
    display: none;
  }
  .c-radio.is-checked {
    display: inline-block;
  }
  .c-radio__label {
    padding-left: 0;
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
