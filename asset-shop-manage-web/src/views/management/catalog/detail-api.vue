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
                    <c-table :data="itemList" :max-height="530" style="width: 100%;line-height: 1;" :border="true">
                      <c-table-column type="index" label="#" fit :width="60" />
                      <c-table-column show-overflow-tooltip fit prop="fieldName" label="更新项" />
                      <c-table-column show-overflow-tooltip fit prop="beforeContent" label="更新前" />
                      <c-table-column show-overflow-tooltip fit prop="afterContent" label="更新后" />
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
                  <span class="content-label">接口名称</span>
                  <span class="content-value">{{ contactInfo.designInfo.name||'--' }}</span>
                </div>
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">版本号</span>
                  <span class="content-value">{{ contactInfo.packVersion }}</span>
                </div>
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">创建人</span>
                  <span class="content-value">{{ contactInfo.designInfo.createUserName || '--' }}</span>
                </div>
                <div v-if="assetType!==22" class="details-content-layout_column_box_item">
                  <span class="content-label">{{ (assetType!=7&&assetType!=72)?'体征类型':'模型类型' }}</span>
                  <span class="content-value">{{ CATEGORY_TYPES[contactInfo.designInfo.bizType]||'--' }}</span>
                </div>
                <div class="details-content-layout_column_box_item-1 ">
                  <span class="content-label">版本说明</span>
                  <span class="content-value" v-html="textAreaFilter(contactInfo.designInfo.desc)"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="design box-wrap">
            <h3 class="info-title" data-section="transfer">调用信息</h3>
            <div class="content details-content-layout_wrapper">
              <div class="details-content-layout_column_box">
                <c-collapse v-model="interfaceShowDataActiveName" accordion class="interface-collapse">
                  <c-collapse-item v-for="item,i in interfaceShowData" :key="i" :name="i+''">
                    <template slot="title">
                      <div class="collapse-title-box">
                        <div class="line-collapse"></div>
                        <div class="path">
                          <p class="label">请求路径</p>
                          <p class="value">{{ item.path }}</p>
                        </div>
                        <div class="method">
                          <p class="label">请求方法</p>
                          <p class="value">{{ (item.method||"").toUpperCase() }}</p>
                        </div>
                      </div>
                    </template>
                    <div class="content">
                      <c-tabs v-model="item.tab" type="box" class="tabs-box">
                        <c-tab-pane label="入参" name="1"></c-tab-pane>
                        <c-tab-pane label="出参" name="2"></c-tab-pane>
                      </c-tabs>
                      <c-table v-if="item.tab=='1'" :key="i+'item.tab==1'" :data="item.inputData">
                        <c-table-column type="index" label="" />
                        <c-table-column prop="name" label="参数名称" show-overflow-tooltip />
                        <c-table-column prop="in" label="参数位置" show-overflow-tooltip />
                        <c-table-column prop="type" label="类型" show-overflow-tooltip>
                        </c-table-column>
                        <c-table-column prop="required" label="必填" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{ scope.row.required?true:false }}
                          </template>
                        </c-table-column>
                        <c-table-column prop="fillInFlag" label="默认值" show-overflow-tooltip>
                          <template>
                            --
                          </template>
                        </c-table-column>
                        <c-table-column prop="pkFlag" label="参数限制" show-overflow-tooltip>
                          <template>
                            --
                          </template>
                        </c-table-column>
                        <c-table-column prop="desc" label="描述" show-overflow-tooltip>

                        </c-table-column>
                      </c-table>
                      <c-table v-if="item.tab=='2'" :key="i+'item.tab==2'" :data="item.outputData">
                        <c-table-column type="index" label="" />
                        <c-table-column prop="name" label="参数名称" show-overflow-tooltip />
                        <c-table-column prop="in" label="参数位置" show-overflow-tooltip />
                        <c-table-column prop="type" label="类型" show-overflow-tooltip>
                        </c-table-column>
                        <c-table-column prop="required" label="必填" show-overflow-tooltip>
                          <template slot-scope="scope">
                            {{ scope.row.required?true:false }}
                          </template>
                        </c-table-column>
                        <c-table-column prop="fillInFlag" label="默认值" show-overflow-tooltip>
                          <template>
                            --
                          </template>
                        </c-table-column>
                        <c-table-column prop="pkFlag" label="参数限制" show-overflow-tooltip>
                          <template>
                            --
                          </template>
                        </c-table-column>
                        <c-table-column prop="desc" label="描述" show-overflow-tooltip>

                        </c-table-column>
                      </c-table>
                      <div v-if="item.tab=='2' && item.body" class="body-box">
                        <span class="label">Body描述</span>
                        <span class="value">{{ item.body }}</span>
                      </div>
                    </div>
                  </c-collapse-item>

                </c-collapse>
              </div>
            </div>
          </div>
          <div class="box-wrap">
            <h3 class="info-title" data-section="up">上架信息</h3>
            <div class="content details-content-layout_wrapper">
              <div class="details-content-layout_column_box">
                <div class="details-content-layout_column_box_item">
                  <span class="content-label">资源名称</span>
                  <span class="content-value">{{ contactInfo.packName||'--' }}</span>
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

                <div class="details-content-layout_column_box_item">
                  <span class="content-label">来源应用</span>
                  <span class="content-value">{{ contactInfo.oriAppPackName || '--' }}</span>
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
                  <span class="content-label">简要说明</span>
                  <span class="content-value" v-html="textAreaFilter(contactInfo.packDesc)"></span>
                </div>
                <div class="details-content-layout_column_box_item-1">
                  <span class="content-label">调用数据示例</span>
                  <span class="content-value ">
                    <vue-tinymce
                      :height="200"
                      :editor-content="contactInfo.instruction||'--'"
                      :status="1"
                      class="cls-tinymce"
                    />
                  </span>
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
  </div>
</template>
<script>
import { applyLog, packApiDetail, applyDetail, applyUpdateDifference } from '@/api/manage'
import vueTinymce from '@/components/tinymce'

import { getProxyUrl } from '@/api/service-suffix.js'
import auditLogSteps from '../components/audit-log-steps.vue'
import { formatInterfaceShowData } from '@/utils'
import { CATEGORY_TYPES } from '@/utils/enumerate.js'
export default {
  name: '',
  components: {
    vueTinymce,
    auditLogSteps
  },
  props: {
    pageStatus: Number,
    applyType: Number,
    applyId: Number,
    assetType: [Number, String]
  },
  data() {
    return {
      PREVIEW_URL: getProxyUrl('fdfs_preview_prefix') + '/',
      applyLogList: [],
      interfaceShowDataActiveName: '0',
      interfaceShowData: [],
      downInfo: { subscribeInfo: {}},
      itemList: [],
      contactInfo: {
        designInfo: {},
        contactInfo: {},
        imageList: [],
        subInfo: {}
      },
      CATEGORY_TYPES
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
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    phoneFilter(data) {
      data = data ? JSON.parse(data) : {}
      return data.contactPhone || '--'
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
      const senFn = packApiDetail
      senFn(this.applyId).then((res) => {
        res.data.designInfo = res.data.designInfo ? JSON.parse(res.data.designInfo) : {}
        res.data.subInfo = res.data.subInfo ? JSON.parse(res.data.subInfo) : {}
        res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
        this.contactInfo = res.data
        const dataDef = res.data.designInfo.dataDef ? JSON.parse(res.data.designInfo.dataDef) : null
        this.interfaceShowData = formatInterfaceShowData(dataDef)
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
.mt20{
    margin-top: 20px;
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
