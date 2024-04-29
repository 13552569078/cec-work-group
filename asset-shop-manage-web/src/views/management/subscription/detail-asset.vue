<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="refScrollDom" @scroll.self="onscroll">
    <div class="apply-info">
      <div class="d-box">
        <h3 class="info-title" data-section="shenqingxinxi">申请信息</h3>
        <div class="d-content">
          <div class="d-info">
            <div class="d-label">所属地区</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.districtText||'--' }}</div>
          </div>
          <div class="d-info width70">
            <div class="d-label">所属部门</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.buildDeptName||'--' }}</div>
          </div>
          <div class="d-info ">
            <div class="d-label">联系人</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.contactName||'--' }}</div>
          </div>
          <div class="d-info ">
            <div class="d-label">电话</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.contactPhone||'--' }}</div>
          </div>
          <div class="d-info ">
            <div class="d-label">邮箱</div>
            <div class="d-value">{{ applyInfo.applyExtendInfo.contactEmail||'--' }}</div>
          </div>
          <div class="d-info width100">
            <div class="d-label">使用场景</div>
            <div class="d-value" v-html="textAreaFilter(applyInfo.applyExtendInfo.appDesc)"></div>
          </div>
          <div class="d-info width100">
            <div class="d-label">附件</div>
            <div class="d-value">
              <div v-if="applyInfo.applyExtendInfo.filePath&&applyInfo.applyExtendInfo.filePath.length" class="file-wrap">
                <div class="file-item" @click="downloadFile(applyInfo.applyExtendInfo.filePath[0])">
                  <p>{{ applyInfo.applyExtendInfo.filePath[0].name }}</p>
                </div>
              </div>
              <span v-else>--</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail">
      <div class="top">
        <div class="top-wrap width">
          <div :class="`img ${assetClass(pageInfo)}`"></div>
          <div class="info">
            <div class="title-box">
              <h3 class="title"><span>{{ pageInfo.packName||'--' }}</span></h3>
              <span class="f14 version">{{ pageInfo.packVersion||'--' }}</span>
            </div>
            <p class="mt20 scene-bg">
              <span class="scene-tag">{{ pageInfo.packSceneName||'--' }}</span>
              <template v-if="pageInfo.tagList&&pageInfo.tagList.length">
                <span
                  v-for="item in pageInfo.tagList||[]"
                  :key="item.groupId"
                  class="search-tag"
                >{{ item.groupName }}</span>
              </template>
            </p>
            <div class="flex-wrap mt20">
              <div class="flex-item">
                <p class="label">数字资源</p>
                <p class="value">{{ assetTypeFilter(pageInfo.assetType, pageInfo.assetSubtype) }}</p>
              </div>
              <div v-if="pageInfo.assetSubtype==23" class="flex-item">
                <p class="label">页面类型</p>
                <p class="value">{{ PAGE_TYPES[pageInfo.bizType]||'--' }}</p>
              </div>
              <div class="flex-item">
                <p class="label">建设部门</p>
                <c-tooltip :disabled="!pageInfo.contactInfo.buildDeptName" :content="pageInfo.contactInfo.buildDeptName" placement="top">
                  <p class="value">
                    {{ pageInfo.contactInfo.buildDeptName||'--' }}
                  </p>
                </c-tooltip>
              </div>
              <div v-if="!isSnapshoot" class="flex-item">
                <p class="label">{{ pageInfo.assetSource!=1?'订阅次数':'申请次数' }}</p>
                <p class="value">{{ pageInfo.downloadCount || 0 }}</p>
              </div>
              <div class="flex-item">
                <p class="label">更新时间</p>
                <p class="value">{{ pageInfo.updateTime || '--' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="tab-wrapper">
        <c-tabs v-model="tabActive" type="nav" class="tab-wrap width" @tab-click="clickTab">
          <c-tab-pane v-for="tab in tabs" :key="tab" :label="tab" :name="tab" />
        </c-tabs>
      </div>
      <div class="main width">
        <c-form ref="refForm" label-position="top">
          <div class="box-wrap">
            <h3 class="info-title ziyuanmiaoshu">基础信息</h3>
            <c-row>
              <c-col :span="8">
                <c-form-item label="所属地区">{{ pageInfo.contactInfo.district || '--' }}</c-form-item>
              </c-col>
              <c-col :span="8">
                <c-form-item label="建设部门">{{ pageInfo.contactInfo.buildDeptName || '--' }}</c-form-item>
              </c-col>
              <c-col :span="8">
                <c-form-item label="联系人">{{ pageInfo.contactInfo.contactUserName || '--' }}</c-form-item>
              </c-col>
              <c-col :span="8">
                <c-form-item label="电话">{{ pageInfo.contactInfo.contactPhone || '--' }}</c-form-item>
              </c-col>
              <c-col :span="8">
                <c-form-item label="邮箱">{{ pageInfo.contactInfo.contactEmail || '--' }}</c-form-item>
              </c-col>
            </c-row>
            <c-form-item label="详细说明">
              <vue-tinymce :editor-content="pageInfo.detailDesc||'--'" :status="1" class="cls-tinymce" />
            </c-form-item>
          </div>
          <div class="design">
            <div v-if="pageInfo.assetType=='5'&&pageInfo.assetSubtype=='51'" class="box-wrap">
              <h3 class="info-title zichanyulan">流程预览</h3>
              <!--  流程-->
              <c-image style="width: 100px; height: 100px" class="img-border" :src="previewUrl+designInfo.previewImagePath"
                       :preview-src-list="[previewUrl+designInfo.previewImagePath]">
              </c-image>
            </div>
            <div v-if="pageInfo.assetType=='2'&&pageInfo.assetSubtype=='23' && designInfo.previewImagePath" class="box-wrap">
              <h3 class="info-title zichanyulan">页面预览</h3>
              <!--  页面-->
              <c-image style="width: 100%; " :src="previewUrl+designInfo.previewImagePath"
                       :preview-src-list="[previewUrl+designInfo.previewImagePath]">
              </c-image>
            </div>
            <div v-if="pageInfo.assetType=='3'&&pageInfo.assetSubtype=='31'" class="obj-table box-wrap">
              <h3 class="info-title zichanyulan" style="margin-bottom:0px">对象资源预览</h3>
              <!--  对象-->
              <c-tabs v-model="activeName" type="box" class="tabs-box" style="background:#fff;padding-left: 0px !important">
                <c-tab-pane label="业务字段" name="1"></c-tab-pane>
                <c-tab-pane label="索引" name="2"></c-tab-pane>
              </c-tabs>
              <c-table v-if="activeName=='1'" :key="'activeName==1'" :data="designInfo.dataDef.column" :border="true">
                <c-table-column type="index" label="#" />
                <c-table-column prop="comment" label="字段名称" show-overflow-tooltip />
                <c-table-column prop="filedName" label="字段标识" show-overflow-tooltip />
                <c-table-column prop="type" label="字段类型" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.type|columTypeFilter }}
                  </template>
                </c-table-column>
                <c-table-column prop="nullable" label="是否必填" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ !scope.row.nullable?'是':'否' }}
                  </template>
                </c-table-column>
              </c-table>
              <c-table v-if="activeName=='2'" :key="'activeName==2'" :data="designInfo.dataDef.index" :border="true">
                <c-table-column type="index" label="#" />
                <c-table-column prop="indexName" label="索引名称" show-overflow-tooltip />
                <c-table-column prop="uniqueness" label="索引类型" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ !!scope.row.uniqueness?'唯一索引':'普通索引' }}
                  </template>
                </c-table-column>
                <c-table-column prop="type" label="索引字段" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.columns.map(item=>item.filedName).join(',') }}
                  </template>
                </c-table-column>
              </c-table>
            </div>
          </div>
          <template v-if="pageInfo.assetSource==1">
            <div class="box-wrap">
              <h3 class="info-title shiyongzhinan">使用指南</h3>
              <c-form-item label="使用说明">
                <vue-tinymce :height="160" :editor-content="pageInfo.instruction" :status="1"
                             class="cls-tinymce" />
              </c-form-item>
              <c-form-item label="附件">
                <span v-if="!(pageInfo.attachList && pageInfo.attachList.length)">--</span>
                <div v-else class="file-wrap">
                  <div v-for="item in pageInfo.attachList" :key="item.fileName" class="file-item"
                       @click="downloadFile(item)">
                    <p>{{ item.fileName }}</p>
                  </div>
                  <i v-for="i in emptyEl" :key="`emptyEl-${i}`" class="file-item file-item-empty" />
                </div>
              </c-form-item>
            </div>
            <div class="box-wrap">
              <h3 class="info-title yinyongzichan">引用资源</h3>
              <c-form-item label="">
                <c-table :data="pageInfo.referAssetList" :border="true">
                  <c-table-column type="index" label="#" />
                  <c-table-column prop="referAssetName" label="资源名称" show-overflow-tooltip />
                  <c-table-column prop="referAssetCode" label="资源编码" show-overflow-tooltip />
                  <c-table-column prop="referAssetVersion" label="资源版本号" show-overflow-tooltip />
                  <c-table-column prop="referAssetSubtype" label="数字资源" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ assetTypeFilter(scope.row.referAssetType, scope.row.referAssetSubtype) }}
                    </template>
                  </c-table-column>
                  <c-table-column prop="referAssetDesc" label="资源描述" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ scope.row.referAssetDesc||'--' }}
                    </template>
                  </c-table-column>
                </c-table>
              </c-form-item>
            </div>
          </template>
        </c-form>
      </div>
      <!-- 文件下载 -->
      <a
        ref="refDownloadFile"
        :href="download.url"
        :download="download.name"
      ></a>
    </div>
  </div>
</template>
<script>
import vueTinymce from '@/components/tinymce'
import { getProxyUrl } from '@/api/service-suffix.js'
import { asseTypeFormat, fieldTypeList, PAGE_TYPES } from '@/utils/enumerate.js'
import { queryPackDetailAsset, applyDetailShop } from '@/api/manage.js'
export default {
  name: '',
  components: { vueTinymce },
  filters: {
    columTypeFilter(item) {
      return fieldTypeList[item] && fieldTypeList[item].textName || item
    },
    bytesToSize(bytes) {
      if (bytes === 0) return '0B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      // return (bytes / Math.pow(k, i)) + sizes[i]
      // toPrecision(3) 后面保留两位小数，如1.00GB
      return (bytes / Math.pow(k, i)).toPrecision(3) + sizes[i]
    }
  },
  props: {
    packVersionId: [Number, String],
    applyId: [Number, String]
  },
  data() {
    return {
      isSnapshoot: true,
      DOWNLOAD_URL: getProxyUrl('file_upload') + '/fdfs/download',
      previewUrl: getProxyUrl('fdfs_preview_prefix') + '/',
      activeName: '1',
      activeNameData: '1',
      tabActive: '基础信息',
      pageInfo: {
        tagList: [],
        packFile: {},
        attachList: [],
        imageList: [],
        contactInfo: {}
      },
      applyInfo: {
        applyExtendInfo: {}
      },
      PAGE_TYPES,
      download: {
        name: '',
        url: ''
      }
    }
  },
  computed: {
    titleShow() {
      let res
      switch (this.pageInfo.assetSubtype * 1) {
        case 51:
          res = '流程预览'
          break
        case 23:
          if (this.designInfo.previewImagePath) { res = '页面预览' }
          break
        case 31:
          res = '对象资源预览'
          break
        case 13:
          res = '数据资源预览'
          break
        default:
          break
      }
      return res
    },
    tabs() {
      let arr = ['基础信息', this.titleShow, '使用指南', '引用资源']
      if (this.pageInfo.assetSource !== 1) {
        arr = ['资源描述', this.titleShow]
        if (this.isSnapshoot) {
          arr.length = arr.length - 1
          return arr.filter(item => item)
        }
        return arr.filter(item => item)
      }
      if (this.isSnapshoot) {
        arr.length = arr.length - 1
        return arr.filter(item => item)
      }
      return arr.filter(item => item)
    },
    emptyEl() {
      let n = this.pageInfo.attachList.length % 3
      n = n ? 3 - n : n
      return n
    }
  },
  created() {
    this.queryData()
    this.getApplyDetail()
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    downloadFile(file) {
      console.log(file)
      if (!file) return
      const filePath = file.filePath || file.response.data.relativePath
      const fileName = file.fileName || file.name
      this.download.name = fileName
      this.download.url = `${this.DOWNLOAD_URL}?relativePath=${filePath}&filename=${encodeURI(this.download.name)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    clickTab() {
      let top = 300
      const topbase = document.querySelector('.top').getBoundingClientRect().top + 50
      if (this.tabActive === '引用资源') {
        top = document.querySelector('.yinyongzichan').getBoundingClientRect().top - topbase - 120
      } else if (this.tabActive === '使用指南') {
        top = document.querySelector('.shiyongzhinan').getBoundingClientRect().top - topbase - 120
      } else if (this.tabActive === '资源描述' || this.tabActive === '基础信息') {
        top = document.querySelector('.ziyuanmiaoshu').getBoundingClientRect().top - topbase - 120
      } else {
        top = document.querySelector('.zichanyulan').getBoundingClientRect().top - topbase - 120
      }

      const scrollDom = document.querySelector('.refScrollDom')
      scrollDom.scrollTo({ behavior: 'smooth', top: top })
    },
    assetTypeFilter(type, subtype) {
      return asseTypeFormat(type, subtype, '-')
    },
    assetClass(item) {
      const assetType = +item.assetType
      const assetSubtype = +item.assetSubtype
      switch (assetType) {
        case 5: return 'icon-asset-flow'
        case 3: return 'icon-asset-object'
        case 1: return 'icon-asset-kpi'
        case 2:
          if (assetSubtype === 22) return 'icon-asset-api'
          if (assetSubtype === 23) return 'icon-asset-page'
          if (assetSubtype === 26) return 'icon-asset-script'
          if (assetSubtype === 27) return 'icon-asset-supportapp'
          break
        case 7: return 'icon-asset-model'
      }
      return ''
    },
    getApplyDetail() {
      applyDetailShop(this.applyId).then(res => {
        res.data.applyExtendInfo = JSON.parse(res.data.applyExtendInfo)
        try {
          res.data.authorizeDesc = JSON.parse(res.data.authorizeDesc)
        } catch (error) {
          console.log(error)
        }
        this.applyInfo = res.data
      })
    },
    queryData() {
      try {
        queryPackDetailAsset(this.packVersionId).then((res) => {
          res.data.contactInfo = res.data.contactInfo ? JSON.parse(res.data.contactInfo) : {}
          this.pageInfo = res.data
          if (this.pageInfo.assetSource !== 1) {
            this.tabActive = '资源描述'
          }
          this.designInfo = res.data.designInfo ? {
            dataDef: JSON.parse(JSON.parse(res.data.designInfo).dataDef || '{}'),
            previewImagePath: JSON.parse(res.data.designInfo).previewImagePath
          } : {
            dataDef: {},
            previewImagePath: ''
          }
        })
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';
.info-title {
  margin-bottom: 20px;
}
.fixtop {
  position: fixed;
  top: 72px;
  z-index: 10;
}
.width {
  margin: auto;
}
.apply-info {
  background: #fff;
  padding: 20px 20px 0 40px;
  margin-bottom: 20px;
  margin-top: 20px;
  .info-title {
    margin-left: -20px;
  }
  .d-content {
    padding: 0 0px;
    &::after{
      content: ' ';
      display: block;
      clear: both;
    }
    .d-info {
      float: left;
      width: 33%;
      margin-bottom: 20px;
      .d-label {
        font-size: 14px;
        margin-bottom: 10px;
        color: #8a8a8a;
        position: relative;
      }
      .d-value {
        display: block;
        font-size: 14px;
        color: #4b4b4b;
        word-break: break-all;
        word-wrap: break-word;

        line-height: 20px;
      }
    }
    .width100 {
      width: 100% !important;
    }
  }
}
.detail {
  margin-top: 20px;
  height: 100%;
  overflow: auto;
  .mt20 {
    margin-top: 20px;
  }
  .scene-bg{
    height: 28px;
    line-height: 28px;
  }
  .flex-wrap {
    display: flex;
    align-items: center;
    .flex-item {
      flex: 1;
      max-width: 20%;
      line-height: 24px;
      border-right: 1px solid #E4E9ED;
      margin-right: 24px;
      &:last-child {
        border: 0;
        margin-right: 0;
      }
      .label {
        color: #8A8A8A;
      }
      .value {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .top {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
    padding-bottom: 40px;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0px 1px 0px 0px rgba(62, 78, 106, 0.08);
    .tips {
      position: relative;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      height: 48px;
      line-height: 48px;
      padding: 0 16px;
      padding-left: 48px;
      background: rgba(30, 111, 255, 0.05);
      border: 1px solid $primaryColor;
      &::before {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 16px;
        left: 16px;
        background: url('~@/assets/imgs/tip.png') no-repeat center;
        background-size: contain;
      }
      .link {
        color: $primaryColor;
        cursor: pointer;
      }
    }
    .top-wrap {
      display: flex;
      margin-top: 20px;
    }
    .packdesc {
      margin-top: 24px;
      padding: 12px;
      background: #F6F9FB;
      line-height: 22px;
      color: #8A8A8A;
    }
    .img {
      margin-right: 32px;
      width: 160px;
      height: 160px;
      background-size: 48px 48px;
      background-position: center;
      background-repeat: no-repeat;
    }
    .info {
      position: relative;
      flex: 1;
      .btn {
        position: absolute;
        right: 0px;
        top: 0px;
      }
      .title-box {
        display: flex;
        align-items: center;
      }
      .lh {
        line-height: 18px;
      }
      .version {
        margin-left: 20px;
        height: 16px;
        line-height: 16px;
        padding-left: 20px;
        background: url(~@/assets/imgs/version.svg) no-repeat ;
        background-size: 16px 16px;
        font-size: 14px;
        color: #8A8A8A;
      }
      .title {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        font-weight: 500;
        color: #202020;
        span{
          position: relative;
          z-index: 2;
        }
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
      }
      .scene-tag {
        margin-right: 20px;
        display: inline-block;
        padding: 0 8px 0 32px;
        border-radius: 100px;
        background: url(~@/assets/imgs/bg-scene.png) no-repeat;
        background-size: 18px 18px;
        background-position: 8px center;
        background-color: #F6F9FB;
        color: #8A8A8A;
      }
    }
  }
  .tab-wrapper {
    padding-left: 20px;
    width: 100%;
    background: #FFFFFF;
  }
  .tab-wrap {
    height: 72px;
    .width {
      height: 100%;
    }
  }
  .main {
    margin-top: 8px;
    margin-bottom: 20px;
    .info-title {
      padding-top: 0px;
    }
  }
}
.label-item {
  display: inline-block;
  margin-right: 4px;
  padding: 0 4px;
  height: 20px;
  line-height: 20px;
  background: rgba(54, 164, 255, 0.1);
  border-radius: 2px;
  font-size: 12px;
  color: $primaryColor;
  text-align: center;
}
.file-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.file-item {
  width: 390px;
  position: relative;
  display: inline-block;
  height: 56px;
  line-height: 56px;
  padding-left: 56px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  background: #f9fafe;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 16px;
    width: 24px;
    height: 24px;
    transform: translateY(-50%);
    background: url(~@/assets/imgs/pack.png) no-repeat center;
  }
  &:nth-child(n + 4) {
    margin-top: 20px;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.file-item-empty {
  opacity: 0;
}
::v-deep.swiper.c-carousel {
  .c-carousel__container {
    height: 100% !important;
  }
  .c-carousel__button {
    width: 30px;
    height: 5px;
    background: #eeeeee;
    opacity: 1;
  }
  .is-active .c-carousel__button {
    background: $primaryColor;
    opacity: 1;
  }
}
::v-deep .detail {
  .c-carousel__indicator.is-active button {
    background: $primaryColor;
  }
  .c-carousel__button {
    opacity: 1;
    background: #eeeeee;
  }
}
::v-deep.c-form {
  .c-form-item {
    padding-left: 0 !important;
  }
  .c-form-item__label {
    color: #8a8a8a;
  }
}
@keyframes progressmove {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}

.search-tag {
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  height: 20px;
  background: rgba(54, 164, 255, 0.1);
  border-radius: 2px;
  line-height: 20px;
  padding: 0px 4px;
  color: #36a4ff;
  font-size: 12px;
  margin-right: 10px;
}
.tag-list {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 600px;
  color: #36a4ff;
}
.design {
  margin-bottom: 20px;
}
.tabs-box {
  height: 72px;
  display: flex;
  align-items: center;
  &::v-deep {

    .c-tabs__content {
      display: none;
    }
    .c-tabs__header {
      margin: 0;
    }
  }
}

.protocol{
  margin-bottom: 20px;
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
.img-border{
  border: 1px solid #E7E7E7;
  border-radius: 2px;
}
::v-deep .c-tabs {
  .c-tabs__nav-item {
    height: 72px;
    line-height: 72px;
    padding: 0 32px;
  }
}
</style>

