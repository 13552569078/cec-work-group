<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="detail-box_wrap refScrollDom">
    <div ref="detail-box_content" class="detail-box_content">
      <auditLogSteps v-if="applyLogList.length" :list="applyLogList" />
      <div class="detail-box">
        <div class="app-detail">
          <div v-if="applyType===4" class="box-wrap">
            <h3 class="info-title" data-section="down">下架申请信息</h3>
            <div class="content details-content-layout_wrapper">
              <div class="details-content-layout_column_box">
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">下架方式</span>
                  <span class="content-value">{{ downInfo.unpackTime?`定时下架 ${downInfo.unpackTime}`:"立即下架" }}</span>
                </div>
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">订阅次数</span>
                  <span class="content-value">{{ (downInfo.subscribeInfo.subNum||0)+'次' }}</span>
                </div>
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">下架原因</span>
                  <span class="content-value">{{ downInfo.unpackReason|| '--' }}</span>
                </div>
                <div class="details-content-layout_column_box_item-1" style="margin-top:20px;">
                  <span class="content-label">已订阅详情</span>
                  <span class="content-value ">
                    <c-table :data="downInfo.subscribeInfo.subApps" :max-height="530"
                             style="width: 100%;line-height: 1;" :border="true">
                      <c-table-column type="index" label="#" fit :width="60" />
                      <c-table-column show-overflow-tooltip fit prop="applyUserName" label="订阅人" />
                      <c-table-column show-overflow-tooltip fit prop="applyTime" label="订阅时间" />
                      <c-table-column show-overflow-tooltip fit prop="referPackName" label="订阅应用" />
                      <c-table-column show-overflow-tooltip fit prop="applyExtendInfo" label="联系电话">
                        <template slot-scope="scope">
                          {{ phoneFilter(scope.row.applyExtendInfo) }}
                        </template>
                      </c-table-column>
                    </c-table>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="applyType===5" class="box-wrap">
            <h3 class="info-title" data-section="update">更新内容</h3>
            <div class="content details-content-layout_wrapper">
              <div class="details-content-layout_column_box">
                <div class="details-content-layout_column_box_item-1" style="margin-top:20px;">
                  <span class="content-label"></span>
                  <span class="content-value ">
                    <c-table :data="itemList" :max-height="530"
                             style="width: 100%;line-height: 1;" :border="true">
                      <c-table-column type="index" label="#" fit :width="60" />
                      <c-table-column show-overflow-tooltip fit prop="fieldName" label="更新项"
                                      min-width="95" />
                      <c-table-column show-overflow-tooltip fit prop="beforeContent" align="left"
                                      label="更新前" min-width="95" />
                      <c-table-column show-overflow-tooltip fit prop="afterContent" align="left"
                                      label="更新后" min-width="95" />

                    </c-table>
                  </span>
                </div>
              </div>
            </div>
          </div>
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
                <div class="details-content-layout_column_box_item-1">
                  <span class="content-label">详细说明</span>
                  <span class="content-value ">
                    <vue-tinymce
                      :height="200"
                      :editor-content="contactInfo.detailDesc||'--'"
                      :status="1"
                      class="cls-tinymce"
                    />
                  </span>
                </div>
                <div class="details-content-layout_column_box_item-1">
                  <span class="content-label">使用约束</span>
                  <span class="content-value ">
                    <vue-tinymce
                      :height="200"
                      :editor-content="contactInfo.instruction||'--'"
                      :status="1"
                      class="cls-tinymce"
                    />
                  </span>
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
                      <!-- <c-table-column label="所属组织" prop="orgName" show-overflow-tooltip /> -->
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
        </div>
      </div>
    </div>
    <dialogApiInfo :visible="!!dialogApiInfoFlag" :bizcode="dialogApiInfoFlag" @close="dialogApiInfoFlag=''" />
  </div>
</template>
<script>
import { applyLog, packSupportappDetail, applyDetail, applyUpdateDifference } from '@/api/manage'
import vueTinymce from '@/components/tinymce'

import { getProxyUrl } from '@/api/service-suffix.js'
import auditLogSteps from '../components/audit-log-steps.vue'
import { APP_TYPE } from '@/utils/enumerate'
import dialogApiInfo from '@/components/dialog-api-info.vue'
export default {
  name: '',
  components: {
    vueTinymce,
    auditLogSteps,
    dialogApiInfo
  },
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
    pageStatus: Number,
    applyType: Number,
    applyId: Number
  },
  data() {
    return {
      PREVIEW_URL: getProxyUrl('fdfs_preview_prefix') + '/',
      applyLogList: [],
      downInfo: { subscribeInfo: {}},
      itemList: [],
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
    this.fetchApplyLog()
    this.runApplyPackDetail()
    if (this.applyType === 4) { // 下架申请
      this.getDownInfo()
    } else if (this.applyType === 5) { // 更新申请
      this.getUpdateInfo()
    }
  },
  methods: {
    phoneFilter(data) {
      data = data ? JSON.parse(data) : {}
      return data.contactPhone || '--'
    },
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    showAPIDetail(row) {
      this.dialogApiInfoFlag = row.bizCode
    },
    getDownInfo() {
      applyDetail(this.applyId).then(res => {
        this.downInfo = res.data
      })
    },
    getUpdateInfo() {
      applyUpdateDifference(this.applyId).then(res => {
        this.itemList = (res.data || []).map(d => {
          Object.keys(d).forEach(k => {
            if (d[k] === undefined || d[k] === null || d[k] === '') {
              d[k] = '--'
            }
          })
          return d
        })
      })
    },
    getImage(path, name) {
      return this.PREVIEW_URL + path
    },
    // 获取详情
    runApplyPackDetail() {
      packSupportappDetail(this.applyId).then((res) => {
        res.data.designInfo = res.data.designInfo ? JSON.parse(res.data.designInfo) : {}
        res.data.subInfo = res.data.subInfo ? JSON.parse(res.data.subInfo) : {}
        res.data.basicInfo = res.data.basicInfo ? JSON.parse(res.data.basicInfo) : {}
        res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
        this.contactInfo = res.data
      })
    },
    fetchApplyLog() {
      applyLog(this.applyId).then((res) => {
        this.applyLogList = res.data.reverse()
        this.$nextTick(() => {
          document.querySelectorAll('.apply-history')[0].scrollTo(2000, 1)
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
.info-title {
  margin-bottom: 0;
}
.detail-box_wrap {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.detail-box {
  position: relative;
}
.line-box {
  width: 100%;
  height: 16px;
  background: #f3f4fb;
}
.mb20{
    margin-bottom: 20px;
  }
.design {
  margin-bottom: 20px;
  &::v-deep {
    .c-tabs {
      padding-left: 20px !important;
      margin-top: 20px;
    }
    .c-table th {
      background-color: #f1f3f8;
    }
    .c-table__body-wrapper {
      background-color: #f9fafe;
    }
    .c-table tr {
      background-color: #f9fafe;
    }
  }
}
.interface-collapse {
  margin-top: 20px;
  &::v-deep {
    .c-icon-caret-bottom:before {
      content: '\e6df';
    }
    .c-collapse-item__header {
      height: 80px;
      &:first-child {
        border-top: 1px solid #ededed;
      }
    }
    .c-collapse-item__content {
      padding-bottom: 0px;
    }
    .is-active {
      .c-icon-caret-bottom {
        color: #1e6fff !important ;
      }
      .line-collapse {
        background: #36a4ff !important;
      }
    }
  }
  .collapse-title-box {
    width: 968px;
    display: flex;
    justify-content: space-between;
    .line-collapse {
      width: 4px;
      height: 80px;
      background: rgba(30, 111, 255, 0.2);
    }

    .path {
      width: 910px;
      padding: 15px 0 15px 16px;
      .label {
        font-weight: 400;
        color: #8a8a8a;
        line-height: 20px;
      }
      .value {
        margin-top: 10px;
        font-weight: 400;
        color: #4b4b4b;
        line-height: 20px;
      }
    }
    .method {
      padding: 15px 0 15px 0px;
      .label {
        font-weight: 400;
        color: #8a8a8a;
        line-height: 20px;
      }
      .value {
        margin-top: 10px;
        font-weight: 400;
        color: #4b4b4b;
        line-height: 20px;
      }
    }
  }
  .body-box {
    padding: 20px;
    background: #f9fafe;
    display: flex;
    .label {
      display: inline-block;
      font-weight: 400;
      color: #8a8a8a;
      line-height: 20px;
    }
    .value {
      display: inline-block;
      margin-left: 16px;
      font-weight: 400;
      color: #4b4b4b;
      line-height: 20px;
    }
  }
}
.fixed {
  padding: 16px 20px;
  margin: 0 -16px 16px 0px;

  box-shadow: 0 -2px 7px 0 rgba(0, 0, 0, 0.06);
  background: #fff;
  position: fixed;
  z-index: 999;
  bottom: 0;
  left: 320px;
  right: 27px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.asset-tag{
  margin-top: 10px;
  margin-right: 8px;
}
.asset-imgs{
  margin-right: 8px;

}
</style>
