<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
-->

<template>
  <div class="content">
    <div class="apply-history">
      <c-steps :active="-1" :space="250" align-center>
        <c-step v-for="(item,index) in applyHistory" :key="item.handleTime + index"
                icon="c-icon-edit">
          <template slot="icon">
            <div class="icon-box">
              <i :class="getClassByStatus(item.applyStatus,index)"></i>
              <span>{{ getTitle(item.applyStatus,index) }}</span>
            </div>
          </template>
          <template slot="description">
            <div class="description-info">
              <c-tooltip :content="`${item.handleRole} ${item.handleUserName||''}`"
                         placement="top-start">
                <p class="u-name">{{ item.handleRole }} {{ item.handleUserName }}</p>
              </c-tooltip>
              <p class="u-time">{{ item.handleTime |timeFiler }}</p>
              <c-tooltip v-if="item.applyStatus || item.applyStatus===0" class="item"
                         :content="getAuditMsg(item)" placement="top-start">
                <p class="u-desc green" :class="{red:item.applyStatus ===2}">{{ getAuditMsg(item) }}</p>
              </c-tooltip>
            </div>
          </template>
        </c-step>
      </c-steps>
    </div>
    <div class="detail-wrap-box">
      <div class="detail-wrap-box-content scrollDom" @scroll.self="onscroll">
        <div class="detail-info">
          <div class="d-box">
            <h3 class="info-title">申请信息</h3>
            <div class="d-content">
              <div class="d-info width100">
                <div class="d-label">申请资源</div>
                <div class="d-value">{{ applyInfo.packName }}</div>
              </div>
              <div class="d-info">
                <div class="d-label">申请类型</div>
                <div class="d-value">{{ applyInfo.applyType|applyTypeListFilter }}</div>
              </div>
              <div class="d-info width70">
                <div class="d-label">申请发布端</div>
                <div class="d-value">{{ applyInfo.subtype |subtypeFilter }}</div>
              </div>
              <div v-if="applyInfo.applyType==1||applyInfo.applyType==4" class="d-info ">
                <div class="d-label">申请资源主体</div>
                <div class="d-value">{{ applyInfo.referPackName }}</div>
              </div>
              <div v-if="applyInfo.applyType==4" class="d-info width70">
                <div class="d-label">应用名称</div>
                <div class="d-value">{{ applyInfo.appName }}</div>
              </div>
              <div v-else-if="applyInfo.applyType==1" class="d-info width70">
                <div class="d-label"></div>
                <div class="d-value" style="height:34px"></div>
              </div>
              <div class="d-info">
                <div class="d-label">所属地区</div>
                <div class="d-value">{{ applyInfo.applyExtendInfo.districtText }}</div>
              </div>
              <div class="d-info width70">
                <div class="d-label">申请部门</div>
                <div class="d-value">{{ applyInfo.applyExtendInfo.buildDeptName }}</div>
              </div>
              <div class="d-info ">
                <div class="d-label">联系人</div>
                <div class="d-value">{{ applyInfo.applyExtendInfo.contactName }}</div>
              </div>
              <div class="d-info ">
                <div class="d-label">电话</div>
                <div class="d-value">{{ applyInfo.applyExtendInfo.contactPhone }}</div>
              </div>
              <div class="d-info ">
                <div class="d-label">邮箱</div>
                <div class="d-value">{{ applyInfo.applyExtendInfo.contactEmail ||'--' }}</div>
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
          <div v-if="applyInfo.applyStatus==1" class="d-box">
            <!-- 审核通过在显示 -->
            <h3 class="info-title">授权信息</h3>
            <template v-if="applyInfo.applyType!=1">
              <div v-if="(applyInfo.applyType==4&&applyInfo.deployStatus==2||applyInfo.applyType ==3)" class="d-content">
                <div v-if="applyInfo.applyType==3" class="d-info width100">
                  <div class="d-label">访问信息</div>
                  <div class="d-value " v-html="brFileterMethod(applyInfo.authorizeDesc)||'--'"></div>
                </div>
                <div v-if="applyInfo.applyType==4 &&applyInfo.authorizeDesc&&applyInfo.authorizeDesc.pcUrl" class="d-info width100">
                  <div class="d-label">PC访问地址<i v-copy="applyInfo.authorizeDesc.pcUrl" class="copy" @click="clickCopy('PC访问地址')" /></div>
                  <div class="d-value">{{ applyInfo.authorizeDesc.pcUrl }}</div>
                </div>
                <div v-if="applyInfo.applyType==4 &&applyInfo.authorizeDesc&&applyInfo.authorizeDesc.h5Url" class="d-info width100">
                  <div class="d-label">H5访问地址<i v-copy="applyInfo.authorizeDesc.h5Url" class="copy" @click="clickCopy('H5访问地址')" /></div>
                  <div class="d-value">{{ applyInfo.authorizeDesc.h5Url }}</div>
                </div>
                <div v-if="applyInfo.applyType==4 &&applyInfo.authorizeDesc&&applyInfo.authorizeDesc.appCode" class="d-info width100">
                  <div class="d-label">应用编码<i v-copy="applyInfo.authorizeDesc.appCode" class="copy" @click="clickCopy('应用编码')" /></div>
                  <div class="d-value">{{ applyInfo.authorizeDesc.appCode }}</div>
                </div>
              </div>
              <div v-else class="d-content" style="margin-bottom:20px">
                审核通过，正在部署中...
              </div>
            </template>
            <div v-if="applyInfo.packageInfo" class="d-content">
              <div class="d-info width100">
                <div class="d-label">软件包</div>
                <div v-if="!(applyInfo.packageInfo&&applyInfo.packageInfo.fileName)" class="d-value">--</div>
                <div v-else class="d-value pointer" @click="clickPackageInfo(applyInfo.packageInfo)"><i class="c-icon-document" /> {{ applyInfo.packageInfo.fileName }}</div>
              </div>
            </div>
          </div>
        </div>
        <h3 class="info-title detail-title">基本信息</h3>
        <detail
          v-if="applyInfo.packVersionId"
          :shop-code="shopCode"
          :pack-version="packVersion"
          :pack-version-id="applyInfo.packVersionId"
          :is-snapshoot="true"
          :showsnapshootinfo="false"
          :showfooter="false"
          :hideappraise="true"
          :custom-click-tab="customClickTab" />
      </div>
    </div>

    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>
</template>
<script>
import { applyLog, applyDetail } from '@/api'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { applyTypeList } from '@/config'
import moment from 'moment-cn'
import detail from '@/views/home/components/detail-app.vue'
export default {
  name: '',
  components: { detail },
  filters: {
    brFileter(val) {
      if (!val) return ''
      val = val.replace(/\n/ig, '<br>')
      console.log(val, 'val')
      return val
    },
    timeFiler(val) {
      if (!val) return ''
      return moment(val).format('YYYY.MM.DD HH:mm:ss')
    },
    applyTypeListFilter(item) {
      return (applyTypeList.find(_item => _item.value + '' === '' + item) || {}).label
    },
    subtypeFilter(item = '') {
      const arr = ['', '', '', 'PC', 'H5']
      const res = []
      item.split(',').forEach(_item => {
        res.push(arr[+_item])
      })
      return res.join(',')
    }
  },
  data() {
    return {
      shopCode: this.$route.query.shopCode,
      packVersion: this.$route.query.packVersion,
      applyId: this.$route.query.applyId,
      setting: {
        tableHeight: 0,
        headerHeight: 80,
        headerMargin: 0,
        footerMargin: 0,
        footerHeight: 76
      },
      download: {
        name: '',
        url: ''
      },
      applyInfo: {
        applyExtendInfo: {}
      },
      activeStep: 0,
      searchForm: {
        applyType: ''
      },
      applyHistory: [],
      hasSearch: false,
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      loading: false,
      tableData: [],
      tags: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    textAreaFilter(str) {
      return (str || '--').replace(/\r|\n/g, '<br/>')
    },
    onscroll() {
      const top = document.querySelector('.scrollDom').scrollTop
      const tabDom = document.querySelector('.fixedTabDom')
      const baseHeight = document.querySelector('.detail-info').offsetHeight + 300
      if (top > baseHeight) {
        tabDom.style.width = tabDom.parentElement.offsetWidth + 'px'
        tabDom.style.position = 'fixed'
        tabDom.style.top = '321px'
        tabDom.style.zIndex = 10
      } else {
        tabDom.style.position = ''
        tabDom.style.top = ''
      }
    },
    customClickTab(top) {
      const topbase = document.querySelector('.detail-info').getBoundingClientRect().top
      top = top - topbase - 100
      const scrollDom = document.querySelector('.scrollDom')
      console.log(top)
      scrollDom.scrollTo({ behavior: 'smooth', top: top })
    },
    clickPackageInfo(file) {
      this.downloadFile(file)
    },
    brFileterMethod(val) {
      console.log(val, 'val')
      if (!val) return ''
      val = val.replace(/\n/ig, '<br>')
      return val
    },
    // 下载附件
    downloadFile(file) {
      console.log(file, 'file')
      if (!file) return
      const filePath = file.filePath || file.response.data.relativePath
      const fileName = file.name || file.fileName
      this.download.name = fileName
      this.download.url = `${getProxyUrl(serviceSuffix.file_upload)}/fdfs/download?relativePath=${filePath}&filename=${encodeURI(fileName)}`
      this.$nextTick(() => {
        console.log('--------dddd', this.$refs.refDownloadFile)
        this.$refs.refDownloadFile.click()
      })
    },
    clickCopy(flag) {
      this.$message.success(flag + '已复制')
    },
    init() {
      this.getList()
      this.getApplyDetail()
    },
    getApplyDetail() {
      applyDetail({ applyId: this.applyId }).then(res => {
        res.data.applyExtendInfo = JSON.parse(res.data.applyExtendInfo)
        res.data.packageInfo = res.data.packageInfo ? JSON.parse(res.data.packageInfo) : {}
        try {
          res.data.authorizeDesc = JSON.parse(res.data.authorizeDesc)
        } catch (error) {
          console.log(error)
        }
        this.applyInfo = res.data
      })
    },
    goto(flag) {
      switch (flag) {
        case 'assetApply':
          this.$router.push('/myApply')
          break
        case 'appApply':
          this.$router.push('/myApply/app')
          break

        default:
          break
      }
    },
    handleLink(item, index) {
      if (item.path) {
        return this.$router.push(item.path)
      }
    },
    getAuditMsg(row) {
      return `【${this.getStatus(row.applyStatus)}】${row.auditMsg || ''}`
    },
    getStatus(val) {
      let res = ''
      switch (val) {
        case 0:
          res = '提交成功'
          break
        case 1:
          res = '通过'
          break
        case 2:
          res = '驳回'
          break
        case 4:
          res = '驳回'
          break

        default:
          break
      }
      return res || ''
    },
    getbtns(row) {
      return [{
        label: '查看',
        row: row
      }
      ]
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        case '查看':
          this.editData(msg.row, 'detail')
          break
      }
    },
    editData(row, flag) {

    },
    contentHeightChange(val) {
      this.setting.tableHeight = document.getElementsByClassName('tree-layout-right')[0].offsetHeight - val - 108 - 64 + 'px'
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.search(this.page.pageNum)
    },
    handleCurrentChange(pageNum) {
      this.search(pageNum)
    },
    getSearch(val) {
      this.searchForm = { ...val }
      console.log(this.searchForm, '-------')
      if (this.searchForm.handleTime) {
        this.searchForm.handleTimeStart = this.searchForm.handleTime[0]
        this.searchForm.handleTimeEnd = this.searchForm.handleTime[1]
      } else {
        this.searchForm.handleTimeStart = ''
        this.searchForm.handleTimeEnd = ''
      }
      if (this.searchForm.applyTime) {
        this.searchForm.applyTimeStart = this.searchForm.applyTime[0]
        this.searchForm.applyTimeEnd = this.searchForm.applyTime[1]
      } else {
        this.searchForm.applyTimeStart = ''
        this.searchForm.applyTimeEnd = ''
      }

      this.handleSearch()
    },
    getQueryParams(pageNum) {
      const search = this.hasSearch ? this.searchForm : {}
      return {
        ...search,
        pageSize: this.page.pageSize,
        pageNum: pageNum || this.page.pageNum
      }
    },
    doQueryCache(arr) {
      this.queryCacheDataNames = arr // 指定缓存的数据名称
      this.queryCacheDataNames.push('hasSearch')
      const cache = window.sessionStorage.getItem('queryCache')
      let obj = {}
      if (cache) {
        obj = JSON.parse(cache)
      }
      if (this.queryCacheDataNames) {
        // 如果有设置缓存数据就缓存
        obj[this.cachesKey] = {}
        this.queryCacheDataNames.forEach(element => {
          obj[this.cachesKey][element] = this[element]
        })
        window.sessionStorage.setItem('queryCache', JSON.stringify(obj))
      }
    },
    cacheTags(tags) {
      this.tags = tags
    },
    handleSearch() {
      this.hasSearch = true
      const pageNum = 1
      this.search(pageNum)
    },
    search(pageNum = 1) {
      this.page.pageNum = pageNum
      this.getList()
    },
    getTitle(status, index) {
      let res = ''
      switch (status) {
        case 0:
          res = '提交'
          break
        case 1:
          res = '审核'
          break
        case 2:
          res = '审核'
          break
        default:
          break
      }
      if (index === this.applyHistory.length - 1) res = '终审'
      return res || '审核'
    },
    getClassByStatus(status, index) {
      console.log(status, 'status')
      let res = ''
      switch (status) {
        case 0:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }
          break
        case 1:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }

          break
        case 2:
          res = 'icon-fail'
          if (index === this.activeStep) { res = 'icon-fail-big' }
          break
        default:
          break
      }
      return res || 'icon-pendding'
    },
    // 检索
    async getList() {
      this.loading = true
      try {
        const result = await applyLog({
          shopCode: this.shopCode,
          packVersion: this.packVersion,
          applyId: this.applyId
        })
        this.applyHistory = result.data
        this.$nextTick(() => {
          document.querySelectorAll('.apply-history')[0].scrollTo(2000, 1)
        })
        // const lastNodeRole = this.applyHistory[this.applyHistory.length - 1].handleRole
        // if (lastNodeRole !== '系统' && lastNodeRole !== '平台管理者') {
        //   this.applyHistory = [].concat(this.applyHistory, [{
        //     handleRole: '资源提供者',
        //     handleUserName: '',
        //     applyStatus: '',
        //     auditMsg: '',
        //     handleTime: ''
        //   }, {
        //     handleRole: '',
        //     handleUserName: '',
        //     applyStatus: '',
        //     auditMsg: '',
        //     handleTime: ''
        //   }])
        // }
        this.activeStep = this.applyHistory.filter(item => item.applyStatus || item.handleTime).length ? this.applyHistory.filter(item => item.applyStatus || item.handleTime).length - 1 : 0
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>
<style scoped lang="scss">
.content {
  height: calc(100% - 67px);
  overflow: hidden auto;
}
.pointer {
  cursor: pointer;
}
.padding {
  color: #1e6fff;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-1.png) no-repeat center;
    background-size: 100%;
  }
}
.fulfilled {
  color: #4cc09e;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-2.png) no-repeat center;
    background-size: 100%;
  }
}
.rejected {
  color: #ff4d4f;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-3.png) no-repeat center;
    background-size: 100%;
  }
}
.apply-history {
  height: 180px;
  background: #fff;
  margin-bottom: 20px;
  // border-top: solid 1px #ededed;
  overflow-x: auto;
  padding: 40px 20px 0;
  .c-step__head.is-finish {
    border-color: #bdbdbd;
  }
  .c-step {
    flex-shrink: 0;
    &:last-child {
      max-width: auto;
    }
  }
}
.icon-box {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4b4b4b;
  display: flex;
  align-items: center;
}
.description-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  width: 150px;
  .u-name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #8a8a8a;
  }
  .u-time {
    width: 100%;
    color: #8a8a8a;
  }
  .u-desc {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
  }
  .red {
    color: #ff4d4f !important;
  }
  .green {
    color: #4cc09e;
  }
}
.icon-success-big {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: url(~@/assets/imgs/icon-success-big.png);
}
.icon-fail-big {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: url(~@/assets/imgs/icon-fail-big.png);
}
.icon-success {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-success.png);
}
.icon-fail {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-fail.png);
}
.icon-pendding {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-pendding.png);
  background-size: 100%;
}
.detail-wrap-box {
  height: calc(100% - 200px);
  overflow: hidden auto;
  // background: #fff;
  .detail-wrap-box-content{
    height:100%;
    overflow: hidden auto;
  }
  .detail {
    max-width: 1280px;
    height: auto !important;
    overflow: hidden;
  }
}
.detail-info {
  .d-box {
    background: #fff;
    padding: 20px 20px 20px 40px;
    margin-bottom: 20px;
    .info-title {
      margin-left: -20px;
    }
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
  }
}
.copy {
  width: 16px;
  height: 16px;
  background: url(~@/assets/logo/copy.png) no-repeat center;
  background-size: 100%;
  z-index: 2;
  display: inline-block;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    background-image: url(~@/assets/logo/copy-hover.png);
  }
}
.width100 {
  width: 100% !important;
}
.width70 {
  width: 60% !important;
}
.height200{
  height: 80px ;
}
.file-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
.file-item {
  width: 400px;
  position: relative;
  display: inline-block;
  height: 56px;
  line-height: 56px;
  padding-left: 56px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  background: #F9FAFE;
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
  &:nth-child(n+4) {
    margin-top: 20px;
  }
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
}
.detail-title {
  background: white;
  margin-bottom: 0;
  padding: 20px 0 0 20px;
}
::v-deep.detail {
  .top {
    padding-top: 1px;
    padding-right: 20px;
    padding-left: 20px;
  }
  .width {
    width: 100%
  }
  .tab-wrapper .c-tabs__nav {
    margin-left: 20px;
  }
}
</style>
