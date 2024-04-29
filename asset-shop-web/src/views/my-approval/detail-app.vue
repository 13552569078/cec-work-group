<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2022-04-24
-->

<template>
  <div class="apply-main">
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
              <c-tooltip :content="`${item.handleRole} ${item.handleUserName||''}`" placement="top-start">
                <p class="u-name">{{ item.handleRole }} {{ item.handleUserName }}</p>
              </c-tooltip>
              <p class="u-time">{{ item.handleTime |timeFiler }}</p>
              <c-tooltip v-if="item.applyStatus || item.applyStatus===0" class="item" :content="getAuditMsg(item)" placement="top-start">
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
          <div v-if="applyInfo.applyStatus == 1&&(applyInfo.applyType ==4||applyInfo.applyType ==3)" class="d-box">
            <!-- 审核通过在显示 -->
            <div class="info-title"><span>授权信息</span> <i v-if="applyInfo.applyType ==1||applyInfo.applyType ==3||applyInfo.deployStatus==2" class="c-icon-edit" style="cursor: pointer;margin-left: 20px;" @click="openDialog(applyInfo.applyType)"></i></div>
            <div v-if="(applyInfo.applyType ==3||applyInfo.applyType ==4&&applyInfo.deployStatus==2)" class="d-content">
              <div v-if="applyInfo.applyType ==3" class="d-info width100">
                <div class="d-label">访问信息</div>
                <div class="d-value " v-html="brFileterMethod(applyInfo.authorizeDesc) "></div>
              <!-- <div class="d-value">{{ applyInfo.authorizeDesc }}</div> -->
              </div>
              <div v-if="applyInfo.applyType ==4 &&applyInfo.authorizeDesc&&applyInfo.subtype.indexOf(3)!=-1" class="d-info width100">
                <div class="d-label">PC访问地址<i v-copy="applyInfo.authorizeDesc.pcUrl" class="copy" @click="clickCopy('PC访问地址')" /></div>
                <div class="d-value">{{ applyInfo.authorizeDesc.pcUrl }}</div>
              </div>
              <div v-if="applyInfo.applyType ==4 &&applyInfo.authorizeDesc&&applyInfo.subtype.indexOf(4)!=-1" class="d-info width100">
                <div class="d-label">H5访问地址<i v-copy="applyInfo.authorizeDesc.h5Url" class="copy" @click="clickCopy('H5访问地址')" /></div>
                <div class="d-value">{{ applyInfo.authorizeDesc.h5Url }}</div>
              </div>
              <div v-if="applyInfo.applyType ==4 &&applyInfo.authorizeDesc" class="d-info width100">
                <div class="d-label">应用编码<i v-copy="applyInfo.authorizeDesc.appCode" class="copy" @click="clickCopy('应用编码')" /></div>
                <div class="d-value">{{ applyInfo.authorizeDesc.appCode }}</div>
              </div>
            </div>
            <div v-else-if="applyInfo.deployStatus==3" class="d-content">
              部署失败
            </div>
            <div v-else class="d-content">
              审核通过，正在部署中...
            </div>
          </div>
        </div>
        <template v-if="applyInfo.packVersionId">
          <h3 class="info-title detail-title">基本信息</h3>
          <detail
            :shop-code="shopCode"
            :pack-version="packVersion"
            :pack-version-id="applyInfo.packVersionId"
            :is-snapshoot="true"
            :showsnapshootinfo="false"
            :showfooter="false"
            :hideappraise="true"
            :custom-click-tab="customClickTab" />
        </template>
      </div>
    </div>
    <div v-if="$route.query.flag ==='approval'" class="fixed-bottom">
      <c-button
        type="primary"
        size="small"
        @click="approvale()"
      >审核</c-button>
    </div>
    <post-audit :post-dailog-flag="approvalFLag" :apply-type="applyInfo.applyType" :apply-id="currRow.id" @close="colseDialog"></post-audit>

    <c-dialog v-if="dialogFlag3"
              :class="'dialog-center'"
              :title="'编辑授权信息'"
              width="480px"
              class="details-dialog-adjustpadding-1"
              :visible.sync="dialogFlag3"
    >
      <c-form ref="formData"
              :model="formData"
              :rules="rules"
              @submit.native.prevent
      >
        <c-form-item
          class="group-form-item need-small"
          label="访问信息"
          label-width="80px"
          prop="accessUrl"
        >
          <c-input
            v-model="formData.accessUrl"
            style="width:100%"
            size="small"
            maxlength="200"
            type="textarea"
            placeholder="请输入"
          />
        </c-form-item>
      </c-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <c-button
          size="small"
          type=""
          @click="dialogFlag3 = false"
        >取消</c-button>
        <c-button
          type="primary"
          size="small"
          @click="saveNode()"
        >确定</c-button>
      </div>
    </c-dialog>
    <c-dialog v-if="dialogFlag4"
              :class="'dialog-center'"
              :title="'编辑授权信息'"
              width="480px"
              class="details-dialog-adjustpadding-1"
              :visible.sync="dialogFlag4"
    >
      <c-form ref="formData"
              :model="formData"
              :rules="rules"
              label-width="100px"
              :label-position="'top'"
              @submit.native.prevent
      >
        <c-form-item
          v-if="applyInfo.subtype.indexOf(3)!=-1"
          class="group-form-item need-small"
          label="PC访问地址"
          prop="pcUrl"
        >
          <c-input
            v-model="formData.pcUrl"
            style="width:100%"
            size="small"
            type="textarea"
            maxlength="100"
            placeholder="请输入"
          />
        </c-form-item>
        <c-form-item
          v-if="applyInfo.subtype.indexOf(4)!=-1"
          class="group-form-item need-small"
          label="H5访问地址"

          prop="h5Url"
        >
          <c-input
            v-model="formData.h5Url"
            style="width:100%"
            size="small"
            type="textarea"
            maxlength="100"
            placeholder="请输入"
          />
        </c-form-item>
        <c-form-item
          class="group-form-item need-small"
          label="应用编码"

          prop="appCode"
        >
          <c-input
            v-model="formData.appCode"
            style="width:100%"
            size="small"
            maxlength="20"
            placeholder="请输入"
          />
        </c-form-item>
      </c-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <c-button
          size="small"
          type=""
          @click="dialogFlag4 = false"
        >取消</c-button>
        <c-button
          type="primary"
          size="small"
          @click="saveNode()"
        >确定</c-button>
      </div>
    </c-dialog>
    <a
      ref="refDownloadFile"
      :href="download.url"
      :download="download.name"
    ></a>
  </div>

</template>
<script>
import postAudit from './components/post-audit'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
import { applyLog, applyDetail, authorizeUpdate } from '@/api'
import { applyTypeList } from '@/config'
import { checkUrl } from '@/utils/validate.js'
import moment from 'moment-cn'
import detail from '@/views/home/components/detail-app.vue'
export default {
  name: '',
  components: { detail, postAudit },
  filters: {
    statusFilter(val) {
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

        default:
          break
      }
      return res
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
      let res = ''
      item.split(',').forEach(_item => {
        res += arr[+_item] + ' '
      })
      return res
    }
  },
  data() {
    return {
      dialogFlag3: false,
      dialogFlag4: false,
      approvalFLag: false,
      currRow: {},
      formData: {
        applyId: this.$route.query.applyId,
        accessUrl: '',
        pcUrl: '',
        h5Url: '',
        appCode: ''
      },
      download: {
        name: '',
        url: ''
      },
      rules: {
        accessUrl: [{ required: true, trigger: 'blur', message: '请输入访问信息' }],
        pcUrl: [
          { required: true, trigger: 'blur', message: '请输入PC访问地址' },
          { required: false,
            validator: (rule, val, cb) => {
              if (!val) return cb()
              if (!checkUrl(val)) return cb('请输入正确的PC访问地址')
              cb()
            }, trigger: ['change', 'blur']
          }
        ],
        h5Url: [{ required: true, trigger: 'blur', message: '请输入H5访问地址' },
          { required: false,
            validator: (rule, val, cb) => {
              if (!val) return cb()
              if (!checkUrl(val)) return cb('请输入正确的H5访问地址')
              cb()
            }, trigger: ['change', 'blur'] }],
        appCode: [{ required: true, trigger: 'blur', message: '请输入应用编码' }]
      },
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
    brFileterMethod(val) {
      console.log(val, 'val')
      if (!val) return ''
      val = val.replace(/\n/ig, '<br>')
      console.log(val, 'val')
      return val
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
    downloadFile(file) {
      if (!file) return
      const filePath = file.response.data.relativePath
      const fileName = file.name
      this.download.name = fileName
      this.download.url = `${getProxyUrl(serviceSuffix.file_upload)}/fdfs/download?relativePath=${filePath}&filename=${encodeURI(fileName)}`
      this.$nextTick(() => {
        this.$refs.refDownloadFile.click()
      })
    },
    saveNode() {
      this.$refs.formData.validate(valid => {
        if (!valid) {
          return
        }

        authorizeUpdate({ ...this.formData }).then(res => {
          this.close()
        }).catch(err => {
          console.log(err)
          // loading.close()
        })
      })
    },
    openDialog(type) {
      switch (type) {
        case 3:// 访问信息
          this.dialogFlag3 = true
          break
        case 4:// 访问地址
          this.dialogFlag4 = true
          break

        default:
          break
      }
    },
    close() {
      this.dialogFlag3 = false
      this.dialogFlag4 = false
      this.getApplyDetail()
    },
    approvale() {
      this.currRow = { id: this.applyId }
      this.approvalFLag = true
    },
    colseDialog() {
      this.currRow = { }
      this.approvalFLag = false
      this.$router.back()
    },
    init() {
      this.getApplyDetail()
      this.getList()
    },
    getApplyDetail() {
      applyDetail({ applyId: this.applyId }).then(res => {
        res.data.applyExtendInfo = JSON.parse(res.data.applyExtendInfo)
        try {
          res.data.authorizeDesc = JSON.parse(res.data.authorizeDesc)
        } catch (error) {
          console.log(error)
        }
        this.applyInfo = res.data
        if (typeof res.data.authorizeDesc === 'object' && res.data.authorizeDesc !== null) {
          this.formData = { ...this.formData, ...res.data.authorizeDesc }
        } else {
          this.formData = { ...this.formData, accessUrl: res.data.authorizeDesc }
        }
      })
    },
    goto(flag) {
      switch (flag) {
        case 'approvaling':
          this.$router.push('/myApproval')
          break
        case 'approvaled':
          this.$router.push('/myApproval/appprovaled')
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
    getApplyStatus(status) {
      let res = ''
      let title = ''
      switch (status) {
        case 0:
          res = 'padding'
          title = '审核中'
          break
        case 1:
          res = 'fulfilled'
          title = '已通过'
          break
        case 2:
          res = 'rejected'
          title = '已驳回'
          break

        default:
          break
      }
      return { class: res, title: title }
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
      console.log(status, 'status')
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
.apply-main {
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  max-width: 1280px;
  padding-bottom: 10px;
  overflow: hidden;
}
.padding {
  color: #1e6fff;
  display: flex;
  align-items: center;
  i {
    width: 16px;
    height: 16px;
    display: inline-block;
    background: url(~@/assets/imgs/icon-1.png) no-repeat center ;
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
    background: url(~@/assets/imgs/icon-2.png) no-repeat center ;
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
    background: url(~@/assets/imgs/icon-3.png) no-repeat center ;
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
  .is-finish{border-color: #BDBDBD;}
.c-step {

  flex-shrink: 0;
    &:last-child {
      max-width: auto;
    }
  }
}
.icon-box{
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4B4B4B;
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
    color: #8a8a8a;
  }
  .u-desc {
    width: 100%;
    width: 120px;
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
.fixed-bottom{
  flex-shrink: 0;
  padding: 16px 20px;
  box-shadow: 0 -2px 7px 0 rgba(0 ,0 ,0 , 0.06);
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.detail-wrap-box {
  flex: 1;
  overflow: hidden auto;
  // background: #fff;
  .detail-wrap-box-content{
    height: 100%;
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
