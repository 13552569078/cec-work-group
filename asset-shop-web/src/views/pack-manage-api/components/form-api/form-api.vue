<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <c-form ref="refFormApi" :model="formData" label-position="top" :disabled="isview" :class="{'disabled-new':isview}">
    <div class="bg-white">
      <h3 class="info-title" data-section="baseInfo">基础信息</h3>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="待上架资源" prop="bizCode" :rules="rules.selectRequired">
            <c-select
              v-model="formData.bizCode"
              specific-suffix
              clearable
              filterable
              :disabled="disabled"
              placeholder="请选择"
              @change="bizCodeChange">
              <c-option v-for="d in apiList" :key="d.bizCode" :label="d.name" :value="d.bizCode" />
            </c-select>
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="版本号" prop="contactPhone">
            <c-input
              v-model="apiInfo.version"
              disabled
              placeholder="" />
          </c-form-item>
        </c-col>
        <c-col :span="8">
          <c-form-item label="并发限制" prop="contactEmail">
            <div v-if="isview&&!apiInfo.concurrentLimitStr">--</div>
            <c-input
              v-else
              v-model="apiInfo.concurrentLimitStr"
              disabled
              placeholder="" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="8">
          <c-form-item label="创建人" prop="contactUserId">
            <div v-if="isview&&!apiInfo.createUserName">--</div>
            <c-input
              v-else
              v-model="apiInfo.createUserName"
              disabled
              placeholder="" />
          </c-form-item>
        </c-col>
        <c-col v-if="assetType!=22" :span="8">
          <c-form-item :label="(assetType!=7&&assetType!=72)?'体征类型':'模型类型'" prop="bizTypeName">
            <div v-if="isview&&!apiInfo.bizTypeName">--</div>
            <c-input
              v-else
              v-model="apiInfo.bizTypeName"
              disabled
              placeholder="" />
          </c-form-item>
        </c-col>
      </c-row>
      <c-row :gutter="24">
        <c-col :span="16">
          <c-form-item label="版本说明" prop="projectDesc">
            <div v-if="isview&&!apiInfo.desc">--</div>
            <c-input
              v-else
              v-model="apiInfo.desc"
              disabled
              type="textarea"
              :rows="4"
              :autosize="isview?true:false"
              resize="none"
              :show-word-limit="false"
              placeholder="" />
          </c-form-item>
        </c-col>
      </c-row>
    </div>
    <div v-if="interfaceShowData&&interfaceShowData.length" class="bg-white">
      <h3 class="info-title" data-section="diaoyongxinxi">调用信息</h3>
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
  </c-form>
</template>
<script>
import { mapState } from 'vuex'
import { queryApimList, queryApimInfo } from '@/api'
import { debounce } from '@l/utils'
import { bus, formatInterfaceShowData } from '@/utils'
import { CATEGORY_TYPES } from '@/utils/enum'
export default {
  name: '',
  components: {},
  props: {
    isview: Boolean,
    disabled: Boolean,
    shopCode: String
  },
  data() {
    return {
      formData: {
        bizCode: ''
      },
      apiInfo: {},
      rules: {
        selectRequired: { required: true, message: '请选择', trigger: ['change', 'blur'] }
      },
      interfaceShowDataActiveName: '0',
      interfaceShowData: [],
      apiList: [],
      isBackFill: false,
      CATEGORY_TYPES
    }
  },
  computed: {
    ...mapState({
      assetType: state => state.publicManage && state.publicManage.assetType || ''
    })
  },
  watch: {
    formData: {
      handler(nv, ov) {
        if (JSON.stringify(nv) !== JSON.stringify(ov)) {
          this._formDataChange()
        }
      },
      deep: true,
      immediate: false
    },
    assetType: {
      handler(nv, ov) {
        if (nv && !ov) {
          this.getApiList()
        }
      },
      immediate: true
    }
  },
  created() {
    this._formDataChange = debounce(this.formDataChange, 1000)
  },
  methods: {
    formDataChange() {
      if (this.isBackFill) return
      console.log('----emit')
      bus.$emit('-bus-packapiform-leave-validate-', true)
    },
    getFormData() {
      const params = {
        ...this.formData,
        packVersion: this.apiInfo.version
      }
      return params
    },
    validateForm() {
      let flag
      this.$refs.refFormApi.validate((valid) => {
        if (!valid) return (flag = null)
        flag = this.getFormData()
      })
      return flag
    },
    backFill(data) {
      data.designInfo = data.designInfo ? JSON.parse(data.designInfo) : {}
      this.isBackFill = true
      const bizCode = data.designInfo ? data.designInfo.bizCode : ''
      if (bizCode) {
        const hasBizCode = this.apiList.filter(d => d.bizCode === bizCode)
        if (!hasBizCode.length) {
          this.initApiList = { ...data.designInfo }
          this.apiList = [this.initApiList, ...this.apiList]
        }
      }
      this.formData.bizCode = data.bizCode
      this.getApiDetail('', data.designInfo)
      this.$nextTick(() => {
        this.isBackFill = false
      })
    },
    bizCodeChange() {
      this.getApiDetail(this.formData.bizCode)
    },
    async getApiList() {
      try {
        const params = { shopCode: this.shopCode, category: 'zc-category-01' }
        if (+this.assetType === 7) {
          params.category = 'mx-category'
        } else if (+this.assetType === 14) {
          params.category = 'tz-category'
        }
        const { data } = await queryApimList(params)
        if (this.initApiList && Array.isArray(data)) {
          const index = data.findIndex(d => d.bizCode === this.initApiList.bizCode)
          if (index === -1) {
            data.unshift(this.initApiList)
          }
        }
        this.apiList = data
      } catch (e) {
        console.error(e)
      }
    },
    async getApiDetail(bizCode, designInfo) {
      try {
        this.apiInfo = {}
        this.interfaceShowData = []
        let data
        if (!designInfo) {
          if (!bizCode) return
          const res = await queryApimInfo(bizCode)
          data = res.data
        } else {
          data = designInfo
        }
        data.bizTypeName = this.CATEGORY_TYPES[data.bizType]
        data.concurrentLimitStr = Array.isArray(data.concurrentLimit) ? data.concurrentLimit.join('、') : ''
        this.apiInfo = data
        const obj = data.dataDef ? JSON.parse(data.dataDef) : {}
        this.interfaceShowData = formatInterfaceShowData(obj)
      } catch (e) {
        console.error(e)
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
::v-deep.c-form {
  // overflow-x: hidden;
  .c-upload-list {
    line-height: normal;
  }
  .c-select, .c-cascader, .c-date-editor {
    width: 100%;
  }
  .c-input-number .c-input__inner {
    text-align: left !important;
  }
}
.icon-cover {
  padding: 0 10px;
  position: relative;
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(~@/assets/imgs/cover1.png) no-repeat center;
    background-size: contain;
  }
}
.icon-cover.active::before {
  background: url(~@/assets/imgs/cover2.png) no-repeat center;
  background-size: contain;
}
.disabled-new {
  .picture-wrap {
    margin-top: 10px;
  }
}
.picture-wrap {
  max-width: 700px;
  .picture-item-img {
    width: 120px;
    height: 120px;
  }
  .picture-item, .upload {
    display: inline-block;
    width: 120px;
    height: 120px;
    margin-right: 16px;
    vertical-align: top;
  }
  .picture-item:nth-child(n+6), .upload {
    margin-top: 16px;
  }
  .picture-item {
    position: relative;
    img{
      border: 1px solid #e7e7e7;
      border-radius: 2px;
    }
    .c-checkbox {
      line-height: 16px;
      position: absolute;
      right: 8px;
      top: 8px;
      z-index: 10;
    }
  }
  .cover {
    position: absolute;
    width: 120px;
    height: 120px;
    display: block;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.3s;
    z-index: 2;
    line-height: 118px;
    i {
      cursor: pointer;
    }
    i:nth-child(n+2) {
      margin-left: 10px;
    }
  }
  .picture-item:hover .cover {
    opacity: 1;
  }
}
::v-deep.c-form.disabled-new {
  .picture-wrap {
    margin-bottom: 10px;
  }
  .c-cascader__tags .c-tag {
    background: rgba(54, 164, 255, 0.1);
    border-radius: 2px;
    color: #36A4FF;
  }
  .c-form-item.picture-card .c-form-item__label {
    margin-bottom: 10px;
  }
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
  .c-radio, .c-checkbox {
    display: none;
    font-weight: 400;
  }
  .c-radio__input, .c-checkbox__input {
    display: none;
  }
  .c-radio.is-checked, .c-checkbox.is-checked {
    display: inline-block;
  }
  .c-radio__label, .c-checkbox__label {
    padding-left: 0;
    color: #4B4B4B!important;
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
    width: 1168px;
    height: 100%;
    display: flex;
    justify-content:space-between;
    .line{
      width: 4px;
      height: 80px;
      background: rgba(30, 111, 255, 0.2);
    }

    .path{
      width: 1110px;
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
