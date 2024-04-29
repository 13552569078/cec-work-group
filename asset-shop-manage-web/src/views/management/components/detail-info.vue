<!--
 * @Description: 资源包信息
 * @Author: zhangsen
 * @Date: 2022-02-16
-->
<template>
  <div>
    <div class="box-wrap">
      <h3 class="info-title info-title_bottom" data-section="xiangqing">{{ title }}详情</h3>
      <div class="details-content-layout_wrapper mb20">
        <span class="content-label">详细说明</span>
        <vue-tinymce
          :height="200"
          :editor-content="content.detailDesc||'--'"
          :status="1"
          class="cls-tinymce"
        />
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title info-title_bottom" data-section="shiyongzhinan">使用指南</h3>
      <div class="details-content-layout_wrapper mb20">
        <span class="content-label">使用说明</span>
        <vue-tinymce
          :height="200"
          :editor-content="content.instruction||'--'"
          :status="1"
          class="cls-tinymce"
        />
        <span class="content-label">附件</span>
        <div
          v-if="!content.attachList || content.attachList.length === 0"
          class="details-content-layout_wrapper"
        >
          <div class="content-value">--</div>
        </div>
        <div v-if="content.attachList" class="attach-list">
          <div
            v-for="item in content.attachList"
            :key="item.fileName"
            class="file-item"
            @click="downloadFile(item)"
          >
            <p>{{ item.fileName }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vueTinymce from '@/components/tinymce'
import { getProxyUrl } from '@/api/service-suffix.js'
const UPLOAD_FILE_URL = getProxyUrl('file_upload')

export default {
  components: {
    vueTinymce
  },
  props: {
    content: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: '资源'
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {
  },
  mounted() {},
  destroyed() {},
  methods: {
    downloadFile(file) {
      console.log(file)
      this.downloadSourceData(file.filePath, file.fileName)
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
.cls-tinymce {
  border-radius: 2px;
  margin-bottom: 16px;
  max-width: 1240px;
}
.attach-list {
  max-width: 1260px;
  .file-item {
    width: 390px;
    position: relative;
    display: inline-block;
    padding: 18px 10px 18px 56px;
    font-weight: 500;
    background: #f9fafe;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
    p {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #4b4b4b;
      height: 20px;
      line-height: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 16px;
      width: 24px;
      height: 24px;
      transform: translateY(-50%);
      background: url(~@/assets/business/application/pack.png) no-repeat center;
    }
  }
}
</style>
