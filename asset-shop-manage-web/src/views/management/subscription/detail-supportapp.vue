<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="baseinfo">基础信息</h3>
      <div class="content details-content-layout_wrapper">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源名称</span>
            <span class="content-value">{{ contactInfo.packName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">适用终端</span>
            <span class="content-value">{{ contactInfo.basicInfo.applyType|typeFilter }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">资源分类</span>
            <span class="content-value">{{ contactInfo.packSceneName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">标签分类</span>
            <span
              v-if="contactInfo.tagList && contactInfo.tagList.length !== 0"
              class="content-value"
            >
              <c-tag
                v-for="tag in contactInfo.tagList"
                :key="tag.groupId"
                class="asset-tag"
                size="small"
              >
                {{ tag.groupName }}
              </c-tag>
            </span>
            <span v-else class="content-value">--</span>
          </div>
          <div class="details-content-layout_column_box_item-1">
            <span class="content-label">简要说明</span>
            <span class="content-value" v-html="textAreaFilter(contactInfo.packDesc)"></span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">所属地区</span>
            <span class="content-value">{{ contactInfo.contactInfo.district||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">建设部门</span>
            <span class="content-value">{{ contactInfo.contactInfo.buildDeptName || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">联系人</span>
            <span class="content-value">{{ contactInfo.contactInfo.contactUserName || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">电话</span>
            <span class="content-value">{{ contactInfo.contactInfo.contactPhone || '--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">邮箱</span>
            <span class="content-value">{{ contactInfo.contactInfo.contactEmail || '--' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="transfer">关联资源</h3>
      <div class="content details-content-layout_wrapper">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item-1">
            <span class="content-label">API资源</span>
            <span class="content-value">
              <c-table
                ref="refDialogTable"
                :max-height="530"
                :data="contactInfo.designInfo.apiResource"
                style="width: 100%;line-height: 1;"
              >
                <c-table-column type="index" label="" width="60">
                  <template slot-scope="scope">{{ scope.$index+1 }}</template>
                </c-table-column>
                <c-table-column label="接口名称" prop="name" show-overflow-tooltip />
                <c-table-column label="版本号" prop="version" show-overflow-tooltip />
                <c-table-column label="创建人" prop="createUserName" show-overflow-tooltip />
                <c-table-column label="标签" prop="tags" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ (Array.isArray(scope.row.tags)?scope.row.tags.join(','):'')||'--' }}
                  </template>
                </c-table-column>
                <c-table-column label="接口描述" prop="desc" show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.desc||'--' }}</template>
                </c-table-column>
                <c-table-column fixed="right" label="操作" :width="90">
                  <template slot-scope="scope">
                    <c-button type="text" @click="showAPIDetail(scope.row)">详情</c-button>
                  </template>
                </c-table-column>
              </c-table>
            </span>
          </div>
          <div class="details-content-layout_column_box_item-1 ">
            <span class="content-label">其他资源</span>
            <span class="content-value">
              <vue-tinymce
                :height="200"
                :editor-content="contactInfo.designInfo.otherResource||'--'"
                :status="1"
                class="cls-tinymce"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="versionInfo">版本信息</h3>
      <div class="content details-content-layout_wrapper">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">版本号</span>
            <span class="content-value">{{ contactInfo.packVersion }}</span>
          </div>
          <div class="details-content-layout_column_box_item-1 ">
            <span class="content-label">版本说明</span>
            <span class="content-value" v-html="textAreaFilter(contactInfo.packVersionDesc)"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="box-wrap">
      <h3 class="info-title" data-section="replenish">订阅后显示信息</h3>
      <div class="content details-content-layout_wrapper">
        <div class="details-content-layout_column_box">
          <div class="details-content-layout_column_box_item">
            <span class="content-label">联系人</span>
            <span class="content-value">{{ contactInfo.subInfo.contactUserName||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item">
            <span class="content-label">联系电话</span>
            <span class="content-value">{{ contactInfo.subInfo.contactPhone||'--' }}</span>
          </div>
          <div class="details-content-layout_column_box_item-1">
            <span class="content-label">补充说明</span>
            <span class="content-value ">
              <vue-tinymce
                :height="200"
                :editor-content="contactInfo.subInfo.desc||'--'"
                :status="1"
                class="cls-tinymce"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
    <dialogApiInfo :visible="!!dialogApiInfoFlag" :bizcode="dialogApiInfoFlag" @close="dialogApiInfoFlag=''" />
  </div>
</template>
<script>
import { supportappPublishDetail } from '@/api/manage'
import { getProxyUrl } from '@/api/service-suffix.js'
import vueTinymce from '@/components/tinymce'
import dialogApiInfo from '@/components/dialog-api-info.vue'
import { APP_TYPE } from '@/utils/enumerate'
export default {
  name: '',
  components: { vueTinymce, dialogApiInfo },
  filters: {
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
    packVersionId: [String, Number]
  },
  data() {
    return {
      PREVIEW_URL: getProxyUrl('fdfs_preview_prefix') + '/',
      dialogApiInfoFlag: '',
      contactInfo: {
        designInfo: {},
        imageList: [],
        subInfo: {},
        basicInfo: {}
      }
    }
  },
  computed: {
    imageList() {
      const arr = []
      this.contactInfo.imageList.forEach((item) => {
        arr.push({
          fit: item.fileMark || 'cover',
          url: this.getImage(item.filePath, item.fileName),
          srcList: [this.getImage(item.filePath, item.fileName)]
        })
      })
      return arr
    }
  },
  created() {
    this.runApplyPackDetail()
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    getImage(path, name) {
      return this.PREVIEW_URL + path
    },
    showAPIDetail(row) {
      this.dialogApiInfoFlag = row.bizCode
    },
    // 获取详情
    runApplyPackDetail() {
      supportappPublishDetail(this.packVersionId).then((res) => {
        res.data.designInfo = res.data.designInfo ? JSON.parse(res.data.designInfo) : {}
        res.data.subInfo = res.data.subInfo ? JSON.parse(res.data.subInfo) : {}
        res.data.basicInfo = res.data.basicInfo ? JSON.parse(res.data.basicInfo) : {}
        res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
        this.contactInfo = res.data
      })
    }
  }
}
</script>
<style scoped lang="scss">
.mt20 {
  margin-top: 20px;
}
.asset-tag{
  margin-top: 10px;
  margin-right: 8px;
}
</style>
