<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-dialog
    :class="'dialog-center'"
    title="接口详情"
    width="1080px"
    :visible.sync="dialogFlag"
    append-to-body
    :before-close="closeDialog">
    <div class="box-wrap">
      <h3 class="info-title" style="padding-top:0">基础信息</h3>
      <c-row class="mt20">
        <c-col :span="12">
          <div class="cls-item" data-label="接口名称"><span v-html="dataInfo.name"></span></div>
        </c-col>
        <c-col :span="12">
          <div class="cls-item" data-label="版本号"><span v-html="dataInfo.version"></span></div>
        </c-col>
        <c-col :span="12">
          <div class="cls-item" data-label="创建人"><span v-html="dataInfo.createUserName"></span></div>
        </c-col>
        <!-- <c-col :span="12">
          <div class="cls-item" data-label="所属组织"><span v-html="dataInfo.orgName"></span></div>
        </c-col> -->
        <c-col :span="12">
          <div class="cls-item" data-label="标签"><span v-html="dataInfo.tags"></span></div>
        </c-col>
        <c-col :span="24">
          <div class="cls-item" data-label="接口说明"><span v-html="textAreaFilter(dataInfo.desc)"></span></div>
        </c-col>
      </c-row>
      <h3 class="info-title">调用信息</h3>
      <c-collapse v-model="interfaceShowDataActiveName" accordion class="interface-collapse">
        <c-collapse-item v-for="item,i in interfaceShowData" :key="i" :name="i+''">
          <template slot="title">
            <div class="collapse-title-box">
              <div class="line"></div>
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
              <c-table-column prop="type" label="类型" show-overflow-tooltip />
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
              <c-table-column prop="desc" label="描述" show-overflow-tooltip />
            </c-table>
            <c-table v-if="item.tab=='2'" :key="i+'item.tab==2'" :data="item.outputData">
              <c-table-column type="index" label="" />
              <c-table-column prop="name" label="参数名称" show-overflow-tooltip />
              <c-table-column prop="in" label="参数位置" show-overflow-tooltip />
              <c-table-column prop="type" label="类型" show-overflow-tooltip />
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
              <c-table-column prop="desc" label="描述" show-overflow-tooltip />
            </c-table>
            <div v-if="item.tab=='2' && item.body" class="body-box">
              <span class="label">Body描述</span>
              <span class="value">{{ item.body }}</span>
            </div>
          </div>
        </c-collapse-item>
      </c-collapse>
    </div>
  </c-dialog>
</template>
<script>
import { queryApimInfo } from '@/api'
import { formatInterfaceShowData } from '@/utils'
export default {
  name: '',
  props: {
    visible: Boolean,
    bizcode: String
  },
  data() {
    return {
      dialogFlag: false,
      dataInfo: {},
      interfaceShowDataActiveName: '0',
      interfaceShowData: []
    }
  },
  watch: {
    visible(nv) {
      this.dialogFlag = nv
      if (nv) {
        this.getApiData()
      }
    }
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    async getApiData() {
      try {
        if (!this.bizcode) {
          this.interfaceShowData = []
          return
        }
        const res = await queryApimInfo(this.bizcode)
        const data = res.data
        const keys = ['name', 'version', 'createUserName', 'orgName', 'desc']
        keys.forEach(k => {
          if (!data[k]) {
            data[k] = '--'
          }
        })
        if (data.tags && data.tags.length) {
          data.tags = data.tags.join(',')
        } else {
          data.tags = '--'
        }
        this.dataInfo = data
        data.concurrentLimitStr = Array.isArray(data.concurrentLimit) ? data.concurrentLimit.join('、') : ''
        const obj = data.dataDef ? JSON.parse(data.dataDef) : {}
        this.interfaceShowData = formatInterfaceShowData(obj)
      } catch (e) {
        console.error(e)
      }
    },
    closeDialog() {
      this.dialogFlag = false
      this.$emit('close')
    }
  }
}
</script>
<style scoped lang="scss">
.box-wrap {
  height: 650px;
  overflow: auto;
}
.mt20 {
  margin-top: 20px;
}
.cls-item {
  margin-bottom: 20px;
  &::before{
    content: attr(data-label);
    display: block;
    color: #8a8a8a;
    margin-bottom: 10px;
  }
}
.interface-collapse{
  position: relative;
  margin: 20px 0;
  &::v-deep{
    .c-icon-caret-bottom:before{
      content: "\e6df";
    }
    .c-collapse-item__header{
      height: 80px;
      &:first-child{
        border-top: 1px solid #EDEDED;
      }
    }
    .c-collapse-item__content{
      padding-bottom:0px;
    }
    .is-active{
      .c-icon-caret-bottom{
        color:#1E6FFF !important ;
      }
      .line{
        background: #1E6FFF !important;
      }
    }
    .c-tabs {
      padding-left: 20px !important;
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
  .collapse-title-box{
    width: 956px;
    height: 100%;
    display: flex;
    justify-content:space-between;
    .line{
      width: 4px;
      height: 80px;
      background: rgba(30, 111, 255, 0.2);
    }
    .path{
      width: 898px;
      padding: 15px 0 15px 16px;
      .label{
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
      }
      .value{
        margin-top: 10px;
        font-weight: 400;
        color: #4B4B4B;
        line-height: 20px;
      }
    }
    .method{
      padding: 15px 0 15px 0px;
      .label{
        font-weight: 400;
        color: #8A8A8A;
        line-height: 20px;
      }
      .value{
        margin-top: 10px;
        font-weight: 400;
        color: #4B4B4B;
        line-height: 20px;
      }
    }
  }
  .body-box{
    padding: 20px;
    background: #F9FAFE;
    display: flex;
    .label{
      display: inline-block;
      font-weight: 400;
      color: #8A8A8A;
      line-height: 20px;
    }
    .value{
      display: inline-block;
      margin-left: 16px;
      font-weight: 400;
      color: #4B4B4B;
      line-height: 20px;
    }
  }
}
.tabs-box {
  height: 72px;
  display: flex;
  align-items: center;
  background: #f9fafe;
  &::v-deep {
    .c-tabs__content {
      display: none;
    }
    .c-tabs__header {
      margin: 0;
    }
  }
}
</style>
