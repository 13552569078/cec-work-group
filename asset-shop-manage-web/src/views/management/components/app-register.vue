<!--/*
* @Author: dingli
* @Desc: 注册信息
* @Date:
*/-->
<template>
  <div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="baseInfo">基础信息</h3>
      <div class="content details-content-layout_wrapper mb20">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源名称</span>
            <span class="content-value">{{ content.packName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">建设渠道</span>
            <span class="content-value">{{ CHANNEL[content.buildChannel] || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源状态</span>
            <span class="content-value">{{ APP_STATUS[content.appStatus] || '--' }}</span>
          </div>
          <div v-show="content.packSource==3" class="details-content-layout_column_box_item">
            <span class="content-label">关联资源中心应用</span>
            <span class="content-value">{{ content.assetName || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item-1 details-content-layout_column_box_3-2">
            <span class="content-label">网络类型</span>
            <span class="content-value">{{ NET_TYPE[content.netType] || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源分类</span>
            <span class="content-value">{{ content.packSceneName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">标签分类</span>
            <span
              v-if="content.tagList && content.tagList.length !== 0"
              class="content-value"
            >
              <c-tag
                v-for="tag in content.tagList"
                :key="tag.groupId"
                class="asset-tag"
                size="small"
              >
                {{ tag.groupName }}
              </c-tag>
            </span>
            <span v-else class="content-value">--</span>
          </div>
          <div class="details-content-layout_column_box_item-1 details-content-layout_column_box_3-2">
            <span class="content-label">资源介绍</span>
            <span class="content-value textarea" v-html="htmlFilter(content.packDesc)"></span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">所属地区</span>
            <span class="content-value">{{ contactInfo.district||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">建设部门</span>
            <span class="content-value">{{ contactInfo.buildDeptName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">联系人</span>
            <span class="content-value">{{ contactInfo.contactUserName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">电话</span>
            <span class="content-value">{{ contactInfo.contactPhone||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">邮箱</span>
            <span class="content-value">{{ contactInfo.contactEmail||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box content-last">
            <div class="details-content-layout_column_box_3-2">
              <span class="content-label">图片</span>
              <span class="content-value">
                <c-image
                  v-for="item in imageList"
                  :key="item.filePath"
                  class="asset-imgs"
                  style="width: 122px; height: 122px"
                  :src="item.url"
                  :preview-src-list="item.srcList"
                  :fit="item.fit"
                ></c-image>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="projectInfo">项目信息</h3>
      <div class="content details-content-layout_wrapper mb20">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">项目名称</span>
            <span class="content-value">{{ projectInfo.projectName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">项目编号</span>
            <span class="content-value">{{ projectInfo.projectNum||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">建设周期</span>
            <span class="content-value">{{ projectInfo.projectBuildStartDate ? `${projectInfo.projectBuildStartDate}至${projectInfo.projectBuildEndDate}` : '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">立项金额(万元)</span>
            <span class="content-value">{{ projectInfo.projectAmount||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item-1 details-content-layout_column_box_3-2">
            <span class="content-label">项目简介</span>
            <span class="content-value textarea" v-html="htmlFilter(projectInfo.projectDesc)"></span>
          </div>
          <div class="details-content-layout_column_box_item-1 details-content-layout_column_box_3-2">
            <span class="content-label">可研报告</span>
            <div class="upload-file" @click="downloadFile(projectInfo.studyReport)">
              <i v-show="projectInfo.studyReport" class="c-icon-document"></i>
              <span class="upload__item-text">
                {{ getPackName(projectInfo.studyReport) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="firmInfo">厂商信息</h3>
      <div class="content details-content-layout_wrapper mb20">
        <div v-for="(d, i) in firmInfo" :key="`firmInfo-${i}`" class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item-3">
            <span class="content-label">{{ FIRM_TYPE[d.firmType]||'' }}</span>
            <span class="content-value">{{ d.firmName }}</span>
          </div>
          <div class="details-content-layout_column_box_item-3">
            <span class="content-label">联系人</span>
            <span class="content-value">{{ d.firmContact }}</span>
          </div>
          <div class="details-content-layout_column_box_item-3">
            <span class="content-label">联系方式</span>
            <span class="content-value">{{ d.firmContactWay }}</span>
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
import { FIRM_TYPE, APP_TYPE, APP_STATUS, CHANNEL, NET_TYPE } from '@/utils/enumerate'
export default {
  name: 'AppRegister',
  components: {},
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
      FIRM_TYPE,
      APP_TYPE,
      APP_STATUS,
      CHANNEL,
      NET_TYPE,
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
    firmInfo() {
      if (this.content.firmInfo) {
        return JSON.parse(this.content.firmInfo) || []
      }
      return []
    },
    projectInfo() {
      if (this.content.projectInfo) {
        return JSON.parse(this.content.projectInfo) || {}
      }
      return {}
    },
    contactInfo() {
      if (this.content.contactInfo) {
        return JSON.parse(this.content.contactInfo) || {}
      }
      return {}
    }
  },
  methods: {
    htmlFilter(str) {
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
.content-last {
  margin-top: 20px;
}
  .mt20{
    margin-top: 20px;
  }
  .asset-tag {
  margin-right: 10px;
  margin-bottom: 10px;
  &:last-child {
    margin-right: 0;
    margin-bottom: 0;
  }
}
.asset-imgs {
  margin-right: 16px;
  border: 1px solid #c0ccda;
  border-radius: 2px;
  &:last-child {
    margin-right: 0;
  }
}
.upload-file {
  cursor: pointer;
  &:hover{
    color: $primaryColor;
  }
}
</style>
