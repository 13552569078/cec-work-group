<!--
 * @Description: 资源包信息
 * @Author: zhangsen
 * @Date: 2022-02-16
-->
<template>
  <div class="asset-package-page">
    <div class="box-wrap">
      <h3 class="info-title mb20" data-section="shangjiaziyuan">上架资源</h3>
      <div class="content details-content-layout_wrapper mb20">
        <div style="margin-bottom:20px">
          <span class="content-label">上架方式</span>
          <span class="content-value">{{ content.packSource==1 ? '选择资源' : '上传资源包' }}</span>
        </div>
        <span class="content-label">资源包</span>
        <div class="upload-file" @click="downloadFile(content.packFile)">
          <i v-show="content.packFile" class="c-icon-document"></i>
          <span class="upload__item-text">
            {{ getPackName(content) }}
          </span>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="ziyuanbaoxinxi">资源包信息</h3>
      <div class="content details-content-layout_wrapper">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源名称</span>
            <span class="content-value">{{ content.assetName || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源编码</span>
            <span class="content-value">{{ content.assetCode || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">版本号</span>
            <span class="content-value">{{ content.assetVersion || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">数字资源</span>
            <span class="content-value">{{ _assetTypeFormat(content.assetType, content.assetSubtype) }}</span>
          </div>
        </div>
      </div>
      <div class="content-last details-content-layout_wrapper">
        <span class="content-label" style="margin-bottom: 20px">引用资源</span>
        <c-table :data="content.referAssetList" :border="true">
          <c-table-column label="#" width="60">
            <template slot-scope="scope">
              <span class="table-index">{{ scope.$index + 1 }}</span>
            </template>
          </c-table-column>
          <c-table-column
            prop="referAssetName"
            label="资源名称"
            show-overflow-tooltip
          />
          <c-table-column
            prop="referAssetCode"
            label="资源编码"
            show-overflow-tooltip
          />
          <c-table-column
            prop="referAssetVersion"
            label="资源版本号"
            show-overflow-tooltip
          />
          <c-table-column
            prop="referAssetType"
            label="数字资源"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ _assetTypeFormat(scope.row.referAssetType, scope.row.referAssetSubtype) }}</span>
            </template>
          </c-table-column>
          <c-table-column
            prop="referAssetDesc"
            label="资源描述"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.referAssetDesc||'--' }}
            </template>
          </c-table-column>
        </c-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getProxyUrl } from '@/api/service-suffix.js'
const UPLOAD_FILE_URL = getProxyUrl('file_upload')
import { asseTypeFormat } from '@/utils/enumerate'
export default {
  props: {
    content: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    getPackName(data) {
      if (!data.packFile) return '--'
      if (data.packFile.fileName) {
        return data.packFile.fileName
      }
      if (data.assetName && data.assetVersion) {
        return `${data.assetName}_${data.assetVersion}`
      }
      return '--'
    },
    _assetTypeFormat(type, subtype) {
      return asseTypeFormat(type, subtype) || '--'
    },
    downloadFile(file) {
      console.log(file)
      if (!(file && file.filePath)) return
      let name = file.fileName
      if (!name && this.content.assetVersion && this.content.assetCode) {
        name = `${this.content.assetCode}_${this.content.assetVersion}`
      }
      this.downloadSourceData(file.filePath, name)
    },
    downloadSourceData(path, name) {
      console.log(href)
      const href = `${UPLOAD_FILE_URL}/fdfs/download?relativePath=${path}&filename=${encodeURI(
        name
      )}`
      // return
      var downloadElement = document.createElement('a')
      downloadElement.href = href
      downloadElement.download = name // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
    }
  }
}
</script>
<style lang='scss' scoped>
.info-title {
  margin-bottom: 0;
}
.info-title.mb20 {
  margin-bottom: 20px;
}
.upload-file {
  font-size: 14px;
  color: #4b4b4b;
  cursor: pointer;
  margin-bottom: 24px;
  &:hover {
    color: #36a4ff;
    .upload__item-text {
      text-decoration: underline;
    }
  }
}
.content-last {
  margin-top: 20px;
}
</style>
