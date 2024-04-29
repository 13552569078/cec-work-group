<!--
 * @Description: 详细信息
 * @Author: zhangsen
 * @Date: 2022-02-16
-->
<template>
  <div class="box-wrap">
    <h3 class="info-title" data-section="jibenxinxi">基础信息</h3>
    <div class="content details-content-layout_wrapper">
      <div class="details-content-layout_column_box">
        <div class="details-content-layout_column_box_item">
          <span class="content-label">资源名称</span>
          <span class="content-value">{{ content.packName }}</span>
        </div>
        <div class="details-content-layout_column_box_item">
          <span class="content-label">版本号</span>
          <span class="content-value">{{ content.packVersion }}</span>
        </div>
        <div class="details-content-layout_column_box_item">
          <span class="content-label">资源分类</span>
          <span class="content-value">{{ content.packSceneName || "--" }}</span>
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
      </div>
      <div class="details-content-layout_column_box">
        <div class="details-content-layout_column_box_item">
          <span class="content-label">资源描述</span>
          <span class="content-value">{{ content.packDesc || "--" }}</span>
        </div>
      </div>
      <div class="details-content-layout_column_box">
        <div class="details-content-layout_column_box_item">
          <span class="content-label">来源应用</span>
          <span class="content-value">{{ content.oriAppPackName || "--" }}</span>
        </div>
      </div>
      <div class="details-content-layout_column_box">
        <div class="details-content-layout_column_box_item">
          <span class="content-label">版本说明</span>
          <span class="content-value textarea" v-html="htmlFilter(content.packVersionDesc)"></span>
        </div>
      </div>
      <div class="details-content-layout_column_box">
        <div class="details-content-layout_column_box_item">
          <span class="content-label">所属地区</span>
          <span class="content-value">{{ content.contactInfo.district||'--' }}</span>
        </div>
        <div class="details-content-layout_column_box_item">
          <span class="content-label">建设部门</span>
          <span class="content-value">{{ content.contactInfo.buildDeptName || '--' }}</span>
        </div>
        <div class="details-content-layout_column_box_item">
          <span class="content-label">联系人</span>
          <span class="content-value">{{ content.contactInfo.contactUserName || '--' }}</span>
        </div>
        <div class="details-content-layout_column_box_item">
          <span class="content-label">电话</span>
          <span class="content-value">{{ content.contactInfo.contactPhone || '--' }}</span>
        </div>
        <div class="details-content-layout_column_box_item">
          <span class="content-label">邮箱</span>
          <span class="content-value">{{ content.contactInfo.contactEmail || '--' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getProxyUrl } from '@/api/service-suffix.js'
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
    return {
      PREVIEW_URL: getProxyUrl('fdfs_preview_prefix') + '/'
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
    contactInfo() {
      if (!this.content.contactInfo) return {}
      if (typeof this.content.contactInfo === 'string') {
        return JSON.parse(this.content.contactInfo) || {}
      }
      return this.content.contactInfo
    }
  },
  methods: {
    htmlFilter(str) {
      if (!str) return '--'
      return str.replace(/\r|\n/g, '<br>')
    },
    getImage(path, name) {
      return this.PREVIEW_URL + path
      // return `${UPLOAD_FILE_URL}/fdfs/download?relativePath=${path}&filename=${encodeURI(
      //   name
      // )}`
    }
  }
}
</script>
<style lang='scss' scoped>
.info-title {
  margin-bottom: 0;
}
.content-last {
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
</style>
