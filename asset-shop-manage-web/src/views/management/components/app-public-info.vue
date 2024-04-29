<!--/*
* @Author: dingli
* @Desc: 上架信息
* @Date:
*/-->
<template>
  <div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="versionInfo">版本信息</h3>
      <div class="content details-content-layout_wrapper mb20">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">版本号</span>
            <span class="content-value">{{ content.packVersion||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">适用终端</span>
            <span class="content-value">{{ content.assetSubtype | typeFilter }}</span>
          </div>
          <div class="details-content-layout_column_box_item-1">
            <span class="content-label">版本说明</span>
            <span class="content-value textarea" v-html="htmlFilter(content.packVersionDesc)"></span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">与资源门户统一用户中心</span>
            <span class="content-value">{{ content.unifyUc==0?'否':'是' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">支持申请类型</span>
            <span class="content-value">{{ content|applyTypeFilter }}</span>
          </div>
          <div v-if="packageInfo&&packageInfo.filePath" class="details-content-layout_column_box_item-1">
            <span class="content-label">软件包</span>
            <div class="upload-file" @click="downloadFile(packageInfo)">
              <i v-show="packageInfo" class="c-icon-document"></i>
              <span class="upload__item-text">
                {{ getPackName(packageInfo) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="securityInfo">安全信息</h3>
      <div class="content details-content-layout_wrapper mb20">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">等保等级</span>
            <span class="content-value">{{ SEC_LEVEL[securityInfo.secLevel]||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">等保备案</span>
            <div class="upload-file" @click="downloadFile(securityInfo.secFiling)">
              <i v-show="securityInfo.secFiling" class="c-icon-document"></i>
              <span class="upload__item-text">
                {{ getPackName(securityInfo.secFiling) }}
              </span>
            </div>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">系统管理员</span>
            <span class="content-value">{{ securityInfo.secSysAdmin||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">安全保密员</span>
            <span class="content-value">{{ securityInfo.secSecrecy||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">安全审计员</span>
            <span class="content-value">{{ securityInfo.secAuditor||'--' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="caseGuide">案例指导</h3>
      <div class="content details-content-layout_wrapper">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item-1">
            <span class="content-label">成功案例</span>
            <vue-tinymce
              :height="200"
              :editor-content="caseGuide.caseExample||'--'"
              :status="1"
              class="cls-tinymce"
            />
          </div>
          <div class="details-content-layout_column_box_item-1">
            <span class="content-label">使用指南</span>
            <div class="upload-file" @click="downloadFile(caseGuide.useGuide)">
              <i v-show="caseGuide.useGuide" class="c-icon-document"></i>
              <span class="upload__item-text">
                {{ getPackName(caseGuide.useGuide) }}
              </span>
            </div>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">测试报告</span>
            <div class="upload-file" @click="downloadFile(caseGuide.testReport)">
              <i v-show="caseGuide.testReport" class="c-icon-document"></i>
              <span class="upload__item-text">
                {{ getPackName(caseGuide.testReport) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 文件下载 -->
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>
</template>
<script>
import { getProxyUrl } from '@/api/service-suffix.js'
import vueTinymce from '@/components/tinymce'
import { APPLY_TYPE, SEC_LEVEL, APP_TYPE } from '@/utils/enumerate'
export default {
  name: 'AppPublic',
  components: { vueTinymce },
  filters: {
    applyTypeFilter(item) {
      if (item.applyType) {
        return item.applyType.split(',').map(d => APPLY_TYPE[d]).join(',')
      }
      return '--'
    },
    typeFilter(item) {
      if (item) {
        item = item.split(',')
      }
      if (Array.isArray(item)) {
        return item.map(d => APP_TYPE[d]).join(', ') || '--'
      }
      return '--'
    }
  },
  props: {
    content: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      PREVIEW_URL: getProxyUrl('fdfs_preview_prefix') + '/',
      DOWNLOAD_URL: getProxyUrl('file_upload') + '/fdfs/download',
      APPLY_TYPE,
      SEC_LEVEL,
      download: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    imageList() {
      const arr = []
      this.content.imageList.forEach((item) => {
        arr.push({
          fit: item.fileMark || 'cover',
          url: this.getImage(item.filePath, item.fileName),
          srcList: [this.getImage(item.filePath, item.fileName)]
        })
      })
      return arr
    },
    securityInfo() {
      if (this.content.securityInfo) {
        return JSON.parse(this.content.securityInfo) || {}
      }
      return {}
    },
    caseGuide() {
      if (this.content.caseGuide) {
        return JSON.parse(this.content.caseGuide) || {}
      }
      return {}
    },
    packageInfo() {
      if (this.content.packageInfo) {
        return JSON.parse(this.content.packageInfo) || {}
      }
      return ''
    }
  },
  methods: {
    htmlFilter(str) {
      console.log(str, '-----htmlFilter')
      if (!str) return '--'
      return str.replace(/\r|\n/g, '<br>')
    },
    getImage(path, name) {
      return this.PREVIEW_URL + path
    },
    getPackName(data) {
      if (!data) return '--'
      if (data.fileName) {
        return data.fileName
      }
      return '--'
    },
    // 下载附件
    downloadFile(file) {
      console.log(file)
      if (!(file && file.filePath)) return
      this.download.name = file.fileName || ''
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${file.filePath}&filename=${encodeURI(this.download.name)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@l/styles/variables.scss';
.info-title {
  margin-bottom: 0;
}
.mb20{
    margin-bottom: 20px;
  }
.cls-tinymce {
  border-radius: 2px;
  margin-bottom: 16px;
  max-width: 1240px;
}
.upload-file {
  cursor: pointer;
  &:hover{
    color: $primaryColor;
  }
}
</style>
