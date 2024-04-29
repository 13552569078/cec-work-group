<!--
 * @Description: 应用详情
 * @Author: lianpeng
 * @Date: 2021-09-09
-->

<template>
  <router-page-layout :path="myPath">
    <div class="application-detail-main">
      <div class="appd-top">
        <div class="logo" :style="'background-image:url('+previewUrl+detailObj.appIcon+');'"></div>
        <div class="right-box">
          <div class="title-box">
            <span class="title">{{ detailObj.appName }}</span>
            <i v-if="getUserPermissionByKey('applicationManagement', 'appEdit')" class="edit-icon" @click="editApp"></i>
            <span class="tags-box">
              <span v-for="item in detailObj.tagList" :key="item.tagId" class="tag">{{ item.tagName }}</span>
            </span>
          </div>
          <div class="info-box">
            <div v-if="detailObj.shopName" class="info-item">
              <div class="label">关联注册应用</div>
              <div class="value">{{ detailObj.shopName }}</div>
            </div>
            <div class="info-item">
              <div class="label">应用编码</div>
              <div class="value">{{ detailObj.appCode }}</div>
            </div>
            <div class="info-item">
              <div class="label" style="display:flex;align-items: center;">版本总数
                <i class="log-icon" @click="openLogList"></i>
              </div>
              <div class="value">{{ detailObj.versionCount }}</div>
            </div>
            <div class="info-item">
              <div class="label">场景分类</div>
              <div class="value">{{ detailObj.sceneName }}</div>
            </div>
            <div class="info-item">
              <div class="label">发布端</div>
              <div class="value">{{ detailObj.appType |appTypeFilter }}</div>
            </div>
          </div>
          <div class="desc">{{ detailObj.appDesc }}</div>
        </div>
      </div>
      <div class="appd-table-list-wrap">
        <div class="top-box">
          <div class="left-box">
            <div class="version">{{ detailObj.version||"开发版本" }}</div>
            <!-- <div class="change-version">切换版本</div> -->
            <c-dropdown v-if="cType!='list'" @command="changeVersion">
              <span class="c-dropdown-link change-version">
                切换版本<i class="c-icon-arrow-down c-icon--right"></i>
              </span>
              <c-dropdown-menu slot="dropdown">
                <c-dropdown-item v-for="item in versionList" :key="item.version" class="table-expand-own" :command="item.id">
                  <div style="display:flex;align-items: center;">

                    <i v-if="(item.referVersionStatus===2||item.versionStatus===2)"
                       class="algin-center ">
                      <c-tooltip content="存在升级版本，请尽快切换到新版本" placement="top">
                        <i class="icon-alert-update"
                           @click.stop="" />
                      </c-tooltip>
                    </i>
                    <i v-else-if="(item.referVersionStatus===3||item.versionStatus===3)"
                       class="algin-center" @click.stop="">
                      <c-tooltip content="存在引用已失效的服务，该资源已无法使用" placement="top">
                        <i class="icon-alert-invalid"
                           @click.stop="" />
                      </c-tooltip>
                    </i>
                    <i v-else style="width:16px"></i>
                    <span style="min-width:70px;">{{ item.version ||"开发版本" }}</span>
                    <i style="margin-left:10px;" :class="getClass(item.appStatus)"></i>
                  </div>
                </c-dropdown-item>
              </c-dropdown-menu>
            </c-dropdown>
            <div class="time">更新时间：<span>{{ detailObj.updateTime }}</span> </div>
            <div class="status " :class="getClass(detailObj.appStatus)"></div>
          </div>
          <div class="right-box">
            <div v-for="btn in getDetailBtns(detailObj)" :key="btn.value" class="btn"
                 @click="btnClick(detailObj, btn.value)">
              {{ btn.label }}
            </div>
            <dropMenu v-if="+detailObj.appStatus ===6" :key="1" :children="accessUrlArr" :title="'访问应用'" @open="open"></dropMenu>
            <dropMenu v-if="+detailObj.appStatus !==6" :key="2" :title="'预览应用'" :children="preView" @open="openPreView"></dropMenu>
          </div>
        </div>
        <c-tabs v-model="tabActiveName" class="assets-tab">
          <c-tab-pane label="开发资源" name="assetsApplication"></c-tab-pane>
          <!-- deployType=1仅部署开发中心不显示 -->
          <c-tab-pane v-if="deployType!=1" label="订阅资源" name="assetsSubscription"></c-tab-pane>
          <!-- <c-tab-pane v-if="detailObj.appStatus != 1" label="发布记录" name="releaseRecord">
          </c-tab-pane> -->
          <c-tab-pane label="关系图谱" name="relation"></c-tab-pane>
          <!-- <c-tab-pane v-if="detailObj.appStatus == 6" label="部署记录" name="deployRecord"></c-tab-pane> -->
        </c-tabs>
        <div v-if="detailObj.appStatus === 1" class="asset-btns">
          <c-tooltip placement="top" content="应用创建的私有资源回流前仅在本应用范围内可见">
            <button-dropdown v-show="getUserPermissionByKey('applicationManagement', 'appSelectAsset')"
                             class="old-btn" :options="btnList" :text="'复制资源'"
                             @command="handleCommand" />
          </c-tooltip>
          <dropmenuBtn v-if="getUserPermissionByKey('applicationManagement', 'appSelectAsset')"
                       class="select-btn old-btn" :title="'引用资源'" :options="assetTypeList"
                       @select="openSelect"></dropmenuBtn>
          <c-tooltip placement="top" content="应用创建的私有资源回流前仅在本应用范围内可见">
            <dropmenuBtn v-show="getUserPermissionByKey('applicationManagement', 'appSelectAsset')"
                         class="add-btn c-menu-dropdown-add" :title="'新建资源'"
                         :options="assetTypeList" @select="openAdd"></dropmenuBtn>
          </c-tooltip>
        </div>
        <div class="content-box">
          <div v-show="tabActiveName==='assetsApplication'" class="appd-table-list"
               :class="{minHeight:detailObj.appStatus != 1}">
            <div class="asset-radio">
              <div v-for="(item, k) in assetTypeMap" :key="k" class="radio-item"
                   :class="{'active':radioAssetType==item.type}" @click="clickRadio(item.type)">
                <div class="label">{{ item.name }}</div>
                <div class="value">{{ item.count }}</div>
              </div>
            </div>
            <div class="list-box">

              <div v-if="assetList&&(assetList||[]).length" class="assets-list"
                   :class="{margintop16:detailObj.appStatus == 1}">
                <assetsCard v-for="_item in assetList||[]" :key="_item.assetId"
                            :page-key="'applicationManagement'"
                            :provide="true"
                            :deleteable="detailObj.appStatus === 1" :data="_item"
                            class="assets-item" :is-list="true" :show-status="true" :btn-list="getbtns(_item)"
                            @handleClick="handleOperateClick" @showDialog="showDialog" />
              </div>
              <div v-else class="assets-list assets-nodata">
                <!-- 非开发状态 -->
                <div class="no-list-show-wrap">
                  <img src="../../assets/application/no-data.png" class="img-no-list-show"
                       alt="暂无内容">
                  <span class="nodata-text">暂无内容</span>
                </div>

              </div>
            </div>

          </div>
          <detail-relation v-if="tabActiveName==='relation'" :curr-app="detailObj">
          </detail-relation>
          <detail-asset-subscription v-show="tabActiveName==='assetsSubscription'"
                                     ref="refAssetsSubscription" :app-id="id" />
        </div>

        <c-form v-show="tabActiveName==='releaseRecord'" label-position="top" class="release-record"
                @submit.native.prevent>
          <c-form-item label="版本号">{{ detailObj.version || '--' }}</c-form-item>
          <c-form-item label="版本说明">{{ detailObj.versionDesc || '--' }}</c-form-item>
          <c-form-item label="发布日志">
            <span v-html="detailObj.processLog||'--'"></span>
          </c-form-item>
        </c-form>
        <deploy-record v-show="tabActiveName==='deployRecord'" ref="refDeployRecord"
                       :data="detailObj" />
      </div>
      <c-dialog :class="'dialog-center'" :title="title" width="480px"
                class="details-dialog-adjustpadding-1" :visible.sync="showGroupEdit" :rule="rules">
        <c-form ref="formData" :model="formData" label-position="top" :rules="rules"
                @submit.native.prevent>
          <c-form-item class="group-form-item need-small" label="分组名称" label-width="80px"
                       prop="groupName">
            <c-input v-model="formData.groupName" style="width:100%" size="small" type="text"
                     placeholder="请输入分组名称" />
          </c-form-item>
        </c-form>
        <div slot="footer" class="dialog-footer">
          <c-button size="small" type="ordinary" @click="closeDialog">取消</c-button>
          <c-button type="gradual" size="small" @click="save()">确定</c-button>
        </div>
      </c-dialog>
      <c-dialog :class="'dialog-center'" :title="'查看接口'" width="666px" class="details-dialog"
                top="32px" :visible.sync="showDialogFlagInterface">
        <interfaceDetail v-if="showDialogFlagInterface" :flag="'detail'" :curr-id="currId"
                         @close="closeDetailDialog" />
      </c-dialog>
      <c-dialog :class="'dialog-center'" :title="'查看指标资源'" width="666px" class="details-dialog"
                top="32px" :visible.sync="showDialogFlagKpi">
        <kpiDetail v-if="showDialogFlagKpi" :flag="'detail'" :asset-id="currId"
                   @close="closeDetailDialog" />
      </c-dialog>
      <c-dialog :class="'dialog-center'" :visible.sync="showDialogFlagObject" :title="'查看对象资源'"
                width="666px">
        <objectDetail v-if="showDialogFlagObject" :flag="'view'" :asset-id="currId"
                      @close="closeDetailDialog" />
      </c-dialog>
      <c-dialog :class="'dialog-center'" :title="logTitle" width="766px" append-to-body
                class="details-dialog-adjustpadding-1" :visible.sync="logDialogFlag">
        <div class="log-box" v-html="detailObj.processLog"></div>
      </c-dialog>
      <dialog-public :visible="postDailogFlag" :data="currData" @close="_resetPostDailog"
                     @ok="gotoBack" />
      <copyDailog v-if="dialogVisibleCopy" :dialog-flag="dialogVisibleCopy"
                  :curr-id="currAsset.assetId" :app-id="detailObj.id" @close="closeCopyDialog" />
      <importDailog v-if="dialogVisibleImport" :dialog-flag="dialogVisibleImport"
                    :app-id="detailObj.id" :group-id="detailObj.sceneId"
                    @close="closeImportDownloadDialog" />
      <selectDownload v-if="dialogVisibleSelect" :group-id="detailObj.sceneId"
                      :dialog-flag="dialogVisibleSelect" :app-id="detailObj.id"
                      @close="closeImportDownloadDialog" />
      <selectCommon v-if="dialogVisibleCommon" :group-id="detailObj.sceneId"
                    :dialog-flag="dialogVisibleCommon" :app-id="detailObj.id"
                    @close="closeImportDownloadDialog" />
      <backDailog v-if="backFlag" :visible="backFlag" :app-id="detailObj.id"
                  @close="closeImportDownloadDialog" />
      <c-dialog :class="'dialog-center'" :title="'更新应用'" width="996px" class="details-dialog"
                top="32px" :visible.sync="editFlag" :close-on-click-modal="false">
        <editApp v-if="editFlag" :selectdata="currApp" @close="closeEditFlag" />
      </c-dialog>
      <c-dialog :class="'dialog-center'" :title="'资源日志'" width="460px" class="details-dialog"
                top="32px" :visible.sync="logFlag" :close-on-click-modal="false">
        <logList v-if="logFlag" :selectdata="currApp" @close="closeLogFlag" />
      </c-dialog>
      <qrcodeVue v-if="qrFlag" :dialog-flag="qrFlag" :url="url" @close="closeQrFlag"></qrcodeVue>
      <deploy-dialog
        :visible="!!deployDialogVisible"
        :data="deployDialogVisible"
        @close="deployDialogVisible = null"
        @ok="deployDialogOk"
      />
    </div>
  </router-page-layout>
</template>

<script>
import assetsCard from './components/assets-card.vue'
import interfaceDetail from '@/views/asset-management/technology-asset/interface-asset/'
import kpiDetail from '@/views/asset-management/statistics-asset/components/kpi-add.vue'
import objectDetail from '@/views/asset-management/object-asset/add.vue'
import DialogPublic from './components/dialog-public.vue'
import detailRelation from './components/detail-relation.vue'
import dropmenuBtn from './components/dropmenu-btn.vue'
import importDailog from './components/import-dialog.vue'
import selectDownload from './components/select-download.vue'
import dropMenu from './components/drop-menu.vue'
import selectCommon from './components/select-common.vue'
import editApp from './components/edit-app.vue'
import ButtonDropdown from '@/components/button-dropdown'
import qrcodeVue from './components/qrcode.vue'
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js';
import logList from './components/log-list.vue'
import {
  appDetail, checkNav, checkUnAuthAsset, appUndeploy, groupDelete, groupAdd, groupUpdate, groupAssetRemove,
  assetReferenced, assetDelete, appReleaseCheck,
  appGroupDetail
} from '@/api/index'
import { openAssetEditorUrl, addParamToUrl, openNav, getUserPermissionByKey, validateTenant } from '@/utils'

// import { getToken } from '@/utils/auth'
import DeployRecord from './components/deploy-record.vue'
import { APP_SRC } from './components/config.js'
import DetailAssetSubscription from './components/detail-asset-subscription.vue'
import copyDailog from '@/views/asset-management/components/copy-dialog.vue'
import backDailog from './components/back-dialog.vue'

import { assetTypeList } from '@/config'
import DeployDialog from './components/deploy-dialog.vue';
export default {
  components: {
    assetsCard,
    dropmenuBtn,
    selectCommon,
    editApp,
    backDailog,
    importDailog,
    selectDownload,
    ButtonDropdown,
    objectDetail,
    DialogPublic,
    qrcodeVue,
    copyDailog,
    dropMenu,
    kpiDetail,
    interfaceDetail,
    DeployRecord,
    logList,
    detailRelation,
    DetailAssetSubscription,
    DeployDialog
  },
  filters: {
    appTypeFilter(val) {
      if (!Array.isArray(val)) return ''
      const arr = ['', '', '', 'PC', 'H5']
      const res = []
      val.map(item => res.push(arr[item]))
      return res.join(',')
    },
    appSrcFilter(val) {
      return APP_SRC[val] || ''
    }
  },
  data() {
    let btnList = [{ label: '复制公共资源', code: 'common' }, { label: '复制下载资源', code: 'download' }, { label: '导入本地资源', code: 'local' }]
    // deployType=1仅部署开发中心不显示【复制下载资源】
    if (window.__systemConfig && +window.__systemConfig.deployType === 1) {
      btnList = btnList.filter(d => d.code !== 'download')
    }
    return {
      deployType: window.__systemConfig && +window.__systemConfig.deployType,
      qrFlag: false,
      url: '',
      cType: localStorage.getItem('application-management-ctype') || 'list',
      btnList,
      myPath: '/application-detail',
      currAsset: {},
      logFlag: false,
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      assetTypeList,
      deployDialogVisible: null,
      dialogVisibleCopy: false,
      dialogVisibleImport: false,
      dialogVisibleSelect: false,
      dialogVisibleCommon: false,
      isShowdropdown: false,
      logDialogFlag: false,
      logTitle: '发布日志',
      openDesc: false,
      detailObj: {
        appType: [],
        accessUrl: ''
      },
      appType: [],
      accessUrl: '',
      id: this.$route.query.id,
      code: this.$route.query.code,
      dev: this.$route.query.dev,
      currGroup: {},
      currData: {},
      postDailogFlag: false,
      showGroupEdit: false,
      showDialogFlagFlow: false,
      showDialogFlagKpi: false,
      showDialogFlagObject: false,
      showDialogFlagInterface: false,
      currId: '',
      backFlag: false,
      title: '',
      currApp: {},
      editFlag: false,
      formData: {
        groupName: ''
      },
      versionList: [],
      rules: {
        groupName: [
          { required: true, max: 20, message: '最多输入20个字符', trigger: 'blur' }
        ]
      },
      tabActiveName: 'assetsApplication',
      listOld: [],
      radioAssetType: '0',
      assetTypeMap: [{
        type: 0,
        name: '全部资源',
        count: 0
      }, {
        type: 5,
        name: '流程资源',
        count: 0
      }, {
        type: 3,
        name: '对象资源',
        count: 0
      }, {
        type: 1,
        name: '数据资源',
        count: 0
      }, {
        type: 2,
        name: '技术资源',
        count: 0
      }, {
        type: 7,
        name: '模型资源',
        count: 0
      }],
      assetList: [],
      getUserPermissionByKey
    }
  },
  computed: {
    preView() {
      const res = []
      if (this.appType) {
        this.appType.map(item => {
          res.push({ title: item === 3 ? 'PC' : 'H5', value: item })
        })
      }
      return res
    },
    accessUrlArr() {
      const res = []
      if (this.accessUrl) {
        try {
          const obj = JSON.parse(this.accessUrl)
          const appTypeStrArr = this.appType.map(item => {
            return item === 3 ? 'pc' : 'h5'
          })
          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key) && appTypeStrArr.indexOf(key) !== -1) {
              const element = obj[key];
              res.push({ title: key, value: key === 'h5' ? 4 : 3, url: element })
            }
          }
        } catch (error) { console.log(error) }
      }
      return res
    }
  },
  watch: {
    tabActiveName(nv) {
      if (nv === 'assetsApplication') {
        this.radioAssetType = '0'
      } else if (nv === 'deployRecord') {
        this.$refs.refDeployRecord.queryData(1)
      }
    },
    radioAssetType(nv) {
      this.listOld = this.listOld || []
      nv = +nv
      console.log(nv, 'dddd')
      if (+nv === 0) {
        this.assetList = this.listOld
      } else {
        this.assetList = this.listOld.filter(d => {
          console.log(d.assetType === nv)
          return d.assetType === nv
        }
        )
      }
    }
  },
  created() {
    // 非当前路由不调用默认的接口
    if (this.$route.path !== this.myPath) return

    this.getAppDetail()
    this.div = document.createElement('div')
    this.div.className = 'list-tabs-bg'
    this.div.id = 'list-tabs-bg-flow-index'
    this.$nextTick(() => {
      console.log(this.$route.path, this.myPath, 'this.$route.path === this.myPath')
      if (this.$route.path === this.myPath) { document.getElementsByClassName('page-content-wrapper')[0].append(this.div) }
    })
  },
  destroyed() {
    try {
      document.getElementsByClassName('page-content-wrapper')[0].removeChild(this.div)
    } catch (error) {
      console.error(error)
    }
  },
  methods: {
    deployDialogOk() {
      this.deployDialogVisible = null;
      this.$message.success('应用部署成功');
      this.getAppDetail();
    },
    closeQrFlag() {
      this.qrFlag = false
      this.url = ''
    },
    open(item) { // 访问
      console.log(item, 'item')
      if (!item) return
      if (item.value === 4) { // h5
        if (!item.url) {
          return this.$message.error('地址错误')
        }
        this.url = item.url
        this.qrFlag = true
      } else if (item.value === 3) { // pc
        window.open(addParamToUrl(item.url))
        // if (window.__systemConfig && window.__systemConfig.platformUrl) {
        //   const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/app/index?appVersion=${this.detailObj.version}&appCode=${this.detailObj.appCode}&appName=${this.detailObj.appName}`
        //   window.open(openUrl)
        // } else {
        //   this.$message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
        // }
      }
    },
    openPreView(item) { // 预览
      checkNav({
        appCode: this.detailObj.appCode,
        version: this.detailObj.version
      }).then(res => {
        console.log(res, 'result')
        if (res.data.result === 0) {
          this.$message.error('此应用尚未配置导航！');
          return
        }
        if (item.value === 4) { // h5
          if (window.__systemConfig && window.__systemConfig.platformUrl) {
            const openUrl = `${window.__systemConfig.platformUrl}h5?appVersion=${this.detailObj.version}&appCode=${this.detailObj.appCode}&appName=${encodeURIComponent(this.detailObj.appName)}`
            console.log(openUrl, openUrl.length, 'openUrl')
            this.url = openUrl
            this.qrFlag = true
          } else {
            this.$message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
          }
        } else if (item.value === 3) { // pc
          if (window.__systemConfig && window.__systemConfig.platformUrl) {
            const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/app/index?appVersion=${this.detailObj.version}&appCode=${this.detailObj.appCode}&appName=${this.detailObj.appName}`
            window.open(openUrl)
          } else {
            this.$message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
          }
        }
        console.log(item, 'item')
      })
    },
    getClass(status) {
      console.log(status, 'status')
      let res = ''
      switch (status) {
        case 1:
          res = 'deving'
          break;
        case 3:
          res = 'posting'
          break;
        case 4:
          res = 'post-err'
          break;
        case 5:
          res = 'posted'
          break;
        case 6:
          res = 'deployed'
          break;
        case 7:
          res = 'deploying'
          break;
        case 8:
          res = 'deploy-err'
          break;

        default:
          break;
      }
      return res
    },
    closeEditFlag(flag) {
      this.editFlag = false
      if (flag) { this.getAppDetail() }
    },
    closeLogFlag() {
      this.currApp = {

      }
      this.logFlag = false
    },
    openLogList() {
      this.currApp = {
        id: this.detailObj.id,
        appCode: this.detailObj.appCode
      }
      this.logFlag = true
    },
    editApp() {
      if (validateTenant(this.detailObj.createUserId, 'applicationManagement', 'appEdit')) return
      this.currApp = {
        id: this.detailObj.id,
        appCode: this.detailObj.appCode
      }
      this.editFlag = true
    },
    clickRadio(type) {
      this.radioAssetType = type
    },
    getDetailBtns(detailObj) {
      // 获取顶部操作按钮
      const appStatus = +detailObj.appStatus
      const map = [
        { label: '发布', value: 'public', show: appStatus === 1 },
        { label: '导航设计', value: 'design', show: appStatus === 1 },
        { label: '资源回流', value: 'back', show: appStatus === 5 || appStatus === 8 || appStatus === 6 },
        { label: '部署', value: 'deploy', show: appStatus === 5 || appStatus === 8 },
        { label: '取消部署', value: 'deployCancel', show: appStatus === 6 }
        // { label: '访问应用', value: 'link', show: appStatus === 6 },
        // { label: '预览应用', value: 'preview', show: appStatus !== 6 }
      ]
      return map.filter(d => d.show && getUserPermissionByKey('applicationManagement', d.value))
    },
    handleCommand(item) {
      if (validateTenant(this.detailObj.createUserId, 'applicationManagement', 'appSelectAsset')) return
      switch (item) {
        case 'common':
          this.dialogVisibleCommon = true
          break;
        case 'download':
          this.dialogVisibleSelect = true
          break;
        case 'local':
          this.dialogVisibleImport = true
          break;
        default:
          break;
      }
    },
    closeImportDownloadDialog() {
      this.dialogVisibleSelect = false
      this.dialogVisibleCommon = false
      this.backFlag = false
      this.dialogVisibleImport = false
      this.getAppDetail()
    },
    openSelect(item) {
      if (validateTenant(this.detailObj.createUserId, 'applicationManagement', 'appSelectAsset')) return

      this.checkAssetType((item + '')[0], item)
    },
    openAdd(item) {
      if (validateTenant(this.detailObj.createUserId, 'applicationManagement', 'appSelectAsset')) return
      this.editOrDetail({ subtype: item }, 'add')
    },
    getbtns(row) {
      let map = [{
        permissionKey: 'appAssetView',
        label: '查看',
        row: row
      },
      {
        permissionKey: 'appAssetEdit',
        label: '编辑',
        row: row,
        hide: row.status !== 1
      },
      {
        permissionKey: 'appAssetDesign',
        label: '接口注册',
        hide: row.subtype !== 22,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '体征注册',
        hide: row.subtype !== 14,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'design',
        label: '模型注册',
        hide: row.subtype !== 72,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'appAssetDesign',
        label: '流程设计',
        hide: row.assetType !== 5,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'appAssetDesign',
        label: '对象设计',
        hide: row.assetType !== 3,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'appAssetDesign',
        label: '指标设计',
        hide: row.subtype !== 11,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'appAssetDesign',
        label: '页面设计',
        hide: row.subtype !== 23,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'appAssetDesign',
        label: '脚本设计',
        hide: row.subtype !== 26,
        row: row,
        disabled: row.status !== 1
      },
      {
        permissionKey: 'appAssetCopy',
        label: '复制',
        hide: row.subtype === 11 || (row.subtype === 13 && row.referKpiId), // 数据资源 指标资源 不显示
        row: row,
        disabled: !(row.status === 1 || row.status === 5)
      },
      {
        permissionKey: 'appAssetDelete',
        label: '删除',
        row: row,
        hide: row.status !== 1
      },
      {
        permissionKey: 'appAssetDelete',
        label: '移除',
        row: row,
        hide: row.status === 1
      }]
      if (+this.detailObj.appStatus !== 1) {
        map = [map[0]]
      }
      return map.filter(d => !d.hide && getUserPermissionByKey('applicationManagement', d.permissionKey))
    },
    handleOperateClick(msg) {
      switch (msg.label) {
        // 权限判断
        case '查看':
          if (!getUserPermissionByKey('applicationManagement', 'appAssetView')) return
          this.editOrDetail(msg.row, 'detail')
          break
        case '编辑':
          this.editOrDetail(msg.row, 'edit')
          break
        case '接口注册':
        case '体征注册':
        case '模型注册':
        case '流程设计':
        case '对象设计':
        case '指标设计':
        case '页面设计':
        case '脚本设计':
          this.openAssetEditorUrl(msg.row)
          break
        case '删除':
          this.deleteAsset(msg.row)
          break
        case '移除':
          this.rmAsset(msg.row)
          break
        case '复制':
          this.showCopyAssetDialog(msg.row)
          break
      }
    },
    async editOrDetail(row, flag) {
      console.log(row)
      if (flag === 'edit') {
        const res = await assetReferenced({
          assetId: row.assetId,
          referRange: 'asset' // 这里只查是否被资源引用过
        })
        if (res.data.list && res.data.list.length) {
          try {
            const _res = await this.$confirm(
              `已被应用内其他资源引用（${res.data.list.map(item => item.name).join('、')}），资源内容修改可能会影响已有的配置，确定要继续编辑吗？`,
              {
                title: '提示',
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                type: 'warning'
              }
            )
            if (!_res) {
              return
            }
          } catch (error) {
            return
          }
        }
      }
      switch (+row.subtype) {
        case 51:// 流程
          this.$router.push({
            path: '/application-detail/add-flow',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 31:// 对象
          this.$router.push({
            path: '/application-detail/add-object',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 11:// 指标
          this.$router.push({
            path: '/application-detail/add-kpi',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 13:// 数据
          this.$router.push({
            path: '/application-detail/add-data',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 72:// 模型
          this.$router.push({
            path: '/application-detail/add-mode',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 14:// 体征
          this.$router.push({
            path: '/application-detail/add-ti',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 22:// 接口
          this.$router.push({
            path: '/application-detail/add-interface',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 23:// 页面
          this.$router.push({
            path: '/application-detail/add-page',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        case 26:// 脚本
          this.$router.push({
            path: '/application-detail/add-script',
            query: {
              id: row.assetId,
              flag,
              appId: this.detailObj.id
            }
          })
          break;
        default:
          break;
      }
    },
    async openAssetEditorUrl(row) {
      const res = await assetReferenced({
        assetId: row.assetId,
        referRange: 'asset' // 这里只查是否被资源引用过
      })
      if (res.data.list && res.data.list.length) {
        this.$confirm(
          `已被应用内其他资源引用（${res.data.list.map(item => item.name).join('、')}），资源内容修改可能会影响已有的配置，确定要继续设计吗？`,
          {
            title: '提示',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          }
        ).then(async () => {
          openAssetEditorUrl(row, this.$message)
        }).catch(() => {

        })
        return
      }
      openAssetEditorUrl(row, this.$message)
    },
    async deleteAsset(row) {
      const id = row.assetId
      const res = await assetReferenced({
        assetId: id,
        referRange: 'asset' // 这里只查是否被资源引用过
      })
      if (res.data.list && res.data.list.length) {
        this.$confirm(
          `该资产正在被（${res.data.list.map(item => item.name).join('、')}）资源引用，请先解除引用关系！`,
          {
            title: '提示',
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            type: 'warning'
          }
        )
        return
      }
      this.$confirm(
        '请确认是否删除资源？',
        {
          title: '资源删除',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).then(async () => {
        assetDelete(id).then(rs => {
          this.$message.success(rs.msg)
          this.getAppDetail()
        })
      }).catch(() => {

      })
    },
    // 显示复制弹框
    showCopyAssetDialog(currAsset) {
      this.currAsset = currAsset
      this.dialogVisibleCopy = true
    },
    closeCopyDialog(search = false) {
      this.dialogVisibleCopy = false
      this.currAsset = {}
      if (search) {
        this.getAppDetail()
      }
    },
    _resetPostDailog() {
      this.postDailogFlag = false;
      this.currData = {};
    },
    showLog(flag) {
      switch (flag) {
        case 1:
          this.logTitle = '发布日志'
          break;
        case 2:
          this.logTitle = '部署日志'
          break;

        default:
          break;
      }
      this.logDialogFlag = true
    },
    gotoBack() {
      this.$router.go(-1)
    },
    btnClick(data, flag) {
      if (validateTenant(data.createUserId, 'applicationManagement', flag)) return
      switch (flag) {
        case 'back':
          this.backFlag = true
          break;
        case 'deployCancel':
          this.$confirm(
            '请确认是否取消部署应用？',
            {
              title: '应用取消部署',
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              type: 'warning'
            }).then(() => {
            appUndeploy({
              appCode: data.appCode,
              version: data.version
            }).then((res) => {
              if (res.code * 1 === 0) {
                this.$message.success('应用取消部署成功');
                this.gotoBack();
              }
            });
          });

          break;

        case 'public':
          appReleaseCheck(data.id).then(res => {
            this.showPostDailog(data);
          })

          break;
        case 'deploy':
          this.deployDialogVisible = data

          // this.$confirm(
          //   '请确认是否部署应用？',
          //   {
          //     title: '应用部署',
          //     cancelButtonText: '取消',
          //     confirmButtonText: '确定',
          //     type: 'warning'
          //   }).then(() => {
          //   appDeploy({
          //     appCode: data.appCode,
          //     version: data.version
          //   }).then((res) => {
          //     if (res.code * 1 === 0) {
          //       this.$message.success('应用部署成功');
          //       this.gotoBack();
          //     }
          //   });
          // });
          break;

        case 'design': // 导航
          openNav(data, this.$message)
          break;
        case 'link': // 访问
          if (data.accessUrl) { window.open(addParamToUrl(data.accessUrl)) }
          break;
        case 'preview': // 预览
          checkNav({
            appCode: data.appCode,
            version: data.version
          }).then(res => {
            console.log(res, 'result')
            if (res.data.result === 0) {
              this.$message.error('此应用尚未配置导航！');
              return
            }
            if (window.__systemConfig && window.__systemConfig.platformUrl) {
              const openUrl = `${window.__systemConfig.platformUrl}lowcode-engine/app/index?appVersion=${data.version}&appCode=${data.appCode}&appName=${data.appName}`
              window.open(openUrl)
            } else {
              this.$message.warning('没有获取到低代码平台跳转地址，请刷新页面后重试')
            }
          })

          break;

        default:
          break;
      }
    },
    showDialog({ flag, currId }) {
      console.log(flag, currId, '====')
      if (flag === 'flow') {
        this.showDialogFlagFlow = true
      } else if (flag === 'object') {
        this.showDialogFlagObject = true
      } else if (flag === 'interface') {
        this.showDialogFlagInterface = true
      } else if (flag === 'kpi') {
        this.showDialogFlagKpi = true
      }
      this.currId = currId
    },
    closeDetailDialog() {
      this.showDialogFlagKpi = false
      this.showDialogFlagFlow = false
      this.showDialogFlagObject = false
      this.showDialogFlagInterface = false

      this.currId = ''
    },
    checkAssetType(type, subtype) {
      console.log(type, subtype, 'ddd')
      this.$router.push({
        path: '/select-assets',
        query: {
          assetType: type,
          subtype: subtype,
          appCode: this.detailObj.appCode,
          appId: this.detailObj.id
        }
      })
    },
    rmAsset(assetItem) {
      console.log(assetItem, 'assetItem')
      // 移除资源
      groupAssetRemove({
        id: this.detailObj.id,
        appCode: this.detailObj.appCode,
        assetId: assetItem.assetId,
        version: assetItem.version,
        assetType: assetItem.assetType,
        assetCode: assetItem.assetCode,
        subtype: assetItem.subtype
      }).then(res => {
        this.$message.success('操作成功')
        this.getAppDetail()
      })
    },
    resetAssetTypeMap() {
      this.assetTypeMap.forEach(item => {
        item.count = 0
      })
      // for (const key in this.assetTypeMap) {
      //   if (Object.hasOwnProperty.call(this.assetTypeMap, key)) {
      //     const element = this.assetTypeMap[key];
      //     element.count = 0
      //   }
      // }
    },

    getAppDetail() {
      if (this.id) {
        appGroupDetail(this.code).then(res => {
          this.detailObj = res.data
          this.versionList = res.data.versionList || []
          this.getDetail(this.id)
        })
      }
    },
    changeVersion(id) {
      console.log(id, 'sssssssssssssssss')
      this.getDetail(id)
    },
    getDetail(id) {
      this.resetAssetTypeMap()

      appDetail(id).then(res => {
        this.appType = res.data.appType
        this.accessUrl = res.data.accessUrl

        this.detailObj.shopName = res.data.shopName
        this.detailObj.appType = res.data.appType
        this.detailObj.appStatus = res.data.appStatus
        this.detailObj.id = res.data.id
        this.detailObj.version = res.data.version
        this.detailObj.accessUrl = res.data.accessUrl
        this.detailObj.updateTime = res.data.updateTime

        this.listOld = [].concat(res.data.assetList)
        this.assetList = res.data.assetList || []
        this.assetList.forEach(d => {
          this.assetTypeMap.find(item => item.type === d.assetType).count++
        })
        this.assetTypeMap.find(item => item.type === 0).count = this.assetList.length
        // this.assetTypeMap[0].count = this.assetList.length
        if (this.$route.query.tab === 'deployRecord') {
          this.tabActiveName = 'deployRecord'
        }
        this.$refs.refAssetsSubscription.getData({
          appCode: res.data.appCode,
          version: res.data.version
        })
      })
    },
    showPostDailog(data) {
      const loading = this.$loading({
        lock: true,
        text: '正在校验订阅资源...',
        fullscreen: false,
        background: 'rgba(0, 0, 0, 0)'
      });
      checkUnAuthAsset({ appCode: data.appCode }).then(res => {
        loading.close()
        if (res.data && +res.data.result === 1) {
          this.$message.error('存在未授权的订阅资源，不能进行应用发布！')
        } else if (res.data && +res.data.result === 0) {
          this.currData = data;
          this.postDailogFlag = true;
        }
      }).catch(() => {
        loading.close()
      })
    },
    editGroup(item) {
      this.currGroup = item
      this.formData.groupName = item.groupName
      this.showGroupEdit = true
      this.title = '编辑分组'
    },
    addGroup(item = {}) {
      this.currGroup = item
      this.formData.groupName = item.groupName
      this.showGroupEdit = true
      this.title = '添加分组'
    },
    closeDialog() {
      this.currGroup = {}
      this.showGroupEdit = false
      this.formData = { groupName: '' }
    },
    save() {
      this.$refs.formData.validate((v) => {
        if (!v) return

        if (this.currGroup && this.currGroup.groupId) {
          // 修改
          groupUpdate({
            id: this.detailObj.id,
            appCode: this.detailObj.appCode,
            groupId: this.currGroup.groupId,
            groupName: this.formData.groupName
          }).then(res => {
            this.closeDialog()
            this.getAppDetail()
          })
        } else {
          // 添加
          groupAdd({
            id: this.detailObj.id,
            appCode: this.detailObj.appCode,
            groupName: this.formData.groupName
          }).then(res => {
            this.closeDialog()
            this.getAppDetail()
          })
        }
      })
    },
    deleteGroup(id) {
      this.$confirm(
        '是否确认删除？',
        {
          title: '提示',
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      ).then(() => {
        groupDelete(id).then(rs => {
          this.$message.success(rs.msg)
          this.getAppDetail()
        })
      }).catch(() => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.log-box {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4b4b4b;
  line-height: 20px;
  max-height: 600px;
  overflow: auto;
}

.c-icon-arrow-right {
  &::before {
    position: absolute;
    right: 17px;
  }
}
.assets-nodata {
  width: 100% !important;
  min-height: 300px;
  align-content: center !important;
}
.margin-auto {
  margin: auto;
}
.no-list-show-wrap {
  // padding-top: 50px;
  width: 100%;
  height: 50%;
  position: relative;
  text-align: center;
  .img-no-list-show {
    height: 100%;
    display: block;
    margin: 0 auto 20px;
  }
  .nodata-text {
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
    color: #9dacce;
    position: absolute;
    top: 350px;
    left: 50%;
    transform: translateX(-50%);
  }
}

.dropdown-common-arrow {
  position: absolute;
  margin-left: 8px;
  width: 16px;
  height: 16px;
  background-image: url('~@/assets/imgs/icon-arrow.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transform: rotate(180deg);
  transition: transform 0.2s linear;
  &.dropdown-active-arrow {
    transform: rotate(0deg);
    transition: transform 0.2s linear;
  }
}
.app-dropdown-add-menu {
  &::v-deep {
    .c-dropdown-menu__item {
      width: 102px;
      text-align: center;
    }
  }
}
.application-detail-main {
  height: 100%;
  overflow: auto;
  width: 1625px;

  color: #4b4b4b;
  .appd-top {
    position: relative;
    padding: 40px;
    height: 256px;
    z-index: 1003;
    background: #fff;
    display: flex;
    align-content: center;
    .logo {
      flex-shrink: 0;
      width: 320px;
      height: 180px;
      margin-right: 32px;
      background-position: center;
    }
    .title-box {
      display: flex;
      align-items: center;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        font-weight: 500;
        line-height: 28px;
        letter-spacing: 0em;

        /* 文本色/text-title */
        color: #202020;
      }
      .edit-icon {
        display: block;
        width: 16px;
        height: 16px;
        background: url(~@/assets/imgs/edit-icon.png);
        margin-left: 10px;
        background-size: 100%;
        cursor: pointer;
      }
      .tags-box {
        margin-left: 40px;
        display: flex;
        align-items: center;
        .tag {
          margin-right: 8px;
          padding: 0px 4px;
          /* 背景色/bg-light */
          background: #f6f9fb;

          box-sizing: border-box;
          /* 边框色/border-regular */
          border: 1px solid #e4e9ed;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          font-weight: normal;
          line-height: 20px;
          letter-spacing: 0em;

          /* 文本色/text-secondary */
          color: #8a8a8a;
        }
      }
    }
    .info-box {
      width: 1192px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 20px;
      .info-item {
        flex: 1;
        // width: 311px;
        border-right: 1px solid #e4e9ed;
        margin-right: 20px;
        &:last-child {
          border-right: 0px solid #e4e9ed;
        }
        .log-icon {
          display: block;
          width: 16px;
          height: 16px;
          background: url(~@/assets/imgs/log-icon.png);
          background-size: 100%;
          cursor: pointer;
          margin-left: 4px;
        }

        .label {
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
          letter-spacing: 0em;

          /* 文本色/text-secondary */
          color: #8a8a8a;
          margin-bottom: 4px;
        }
        .value {
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0em;

          /* 文本色/text-regular */
          color: #4b4b4b;
        }
      }
    }
    .desc {
      width: 800px;
      height: 44px;
      opacity: 1;

      /* 文本样式/md */
      font-family: PingFangSC-Regular;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      letter-spacing: 0em;

      /* 文本色/text-secondary */
      color: #8a8a8a;
    }
    .appd-info-down {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1;
      height: 88px;
      // background: url(~@/assets/application/appd-info-down-content-bg.png)
      //   no-repeat;
      // background-size: 100% 100%;
      .appd-info-down-content {
        width: 100%;
        height: 56px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px 0 16px;
        .content-left {
          display: flex;
          align-items: center;
        }
        .icon-info {
          width: 16px;
          height: 16px;
          background: url(~@/assets/application/icon-info.png) no-repeat;
          background-size: 100%;
          margin-right: 8px;
        }
        .assets-name {
          font-size: 16px;
          font-weight: 500;
          color: #4b4b4b;
        }
        .icon-status {
          width: 100px;
          height: 28px;
          margin-left: 24px;
          background-size: contain;
          background-position: left;
          background-repeat: no-repeat;
        }

        .assets-code {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8a8a8a;
          height: 24px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px 2px 12px 2px;
          display: inline-block;
          line-height: 24px;
          padding: 0 11px;
          margin-left: 8px;
        }
      }
    }
    .appd-info-up-box {
      padding: 0 8px;
      position: relative;
      z-index: 20;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.45);
      border: 1px solid #fff;
      .appd-info-up {
        .appd-info-up-default {
          height: 80px;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px 0 32px;
          .width100 {
            width: 100px;
            cursor: pointer;
            text-align: right;
          }
          .assets-desc {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4b4b4b;
          }
          .assets-desc-active {
            color: $primaryColor !important;
          }
          .appd-info-up-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .appd-up-icon {
              display: block;
              width: 24px;
              height: 24px;
              margin-right: 8px;
              background-size: 100%;
              background-repeat: no-repeat;
            }
            .icon-type {
              background-image: url(~@/assets/application/icon-type.png);
            }
            .icon-use {
              background-image: url(~@/assets/application/icon-use.png);
            }
            .icon-label {
              background-image: url(~@/assets/application/icon-label.png);
            }
            .icon-version {
              background-image: url(~@/assets/application/icon-version.png);
            }
            .icon-source {
              background-image: url(~@/assets/application/icon-source.png);
            }
            .appd-up-label {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #8a8a8a;
              // width: 60px;
              margin-right: 16px;
            }
            .appd-up-value {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #4b4b4b;
              margin-right: 32px;
            }
            .tag-list {
              width: 15vw;
            }
          }
          .icon-up-or-down {
            width: 16px;
            height: 16px;
            margin-left: 11px;
            cursor: pointer;
            color: rgba(189, 189, 189, 0.9);
          }
        }
        .appd-info-up-assets-desc {
          position: absolute;
          top: 80px;
          width: calc(100% - 16px);
          padding: 12px 16px;
          background: #f9fafe;
          border-radius: 0px 0px 4px 4px;
          border: 1px solid #e2e9f2;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #8a8a8a;
          line-height: 20px;
          z-index: 1003;
          .desc-box {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
            &:last-child {
              margin-bottom: 0px;
            }
            .tag-list {
              width: calc(100% - 76px);
            }
          }
          .desc-label {
            display: inline-block;
            margin-right: 16px;
          }
          .desc-value {
            display: inline-block;
            word-break: break-all;
            word-wrap: break-word;
            flex: 1;
          }
        }
      }
    }
  }
  .appd-table-list-wrap {
    margin-top: 20px;
    min-height: calc(100% - 275px);
    overflow-y: auto;
    position: relative;
    .content-box {
      margin-top: 20px;
      overflow-x: hidden;
      .asset-radio {
        background: #fff;
        padding: 20px;
        height: 448px;
        font-size: 14px;
        .active {
          background: #f9fafe;
          color: #36a4ff !important;
        }
        .radio-item {
          width: 220px;
          height: 44px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          color: #4b4b4b;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          &:hover {
            /* 背景色/bg-hover */
            background: #f9fafe;
            color: #36a4ff;
          }
        }
      }
    }

    .top-box {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e4e9ed;
      background: #fff;
      .left-box {
        padding-left: 24px;
        display: flex;
        align-items: center;
        .version {
          display: flex;
          align-items: center;
          font-family: PingFangSC-Medium;
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: 0em;

          /* 文本色/text-title */
          color: #202020;
          &::before {
            display: block;
            content: '';
            width: 24px;
            height: 24px;
            background: url(~@/assets/imgs/icon.svg);
            margin-right: 10px;
          }
        }
        .change-version {
          display: flex;
          align-items: center;
          color: #36a4ff;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
          letter-spacing: 0em;
          padding-right: 0px !important;
          /* 文本色/text-hover */
          color: #36a4ff;

          margin: 0 0px 0 10px;
          cursor: pointer;
          &::before {
            display: block;
            content: '';
            width: 16px;
            height: 16px;
            background: url(~@/assets/imgs/book.png);
            background-size: 100%;
            margin-right: 4px;
          }
        }
        .time {
          margin-left: 40px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
          letter-spacing: 0em;

          /* 文本色/text-regular */
          color: #4b4b4b;
          span {
            /* 文本样式/md */
            font-family: PingFangSC-Regular;
            font-size: 14px;
            font-weight: normal;
            line-height: 22px;
            letter-spacing: 0em;

            /* 文本色/text-secondary */
            color: #8a8a8a;
          }
        }
      }
      .right-box {
        padding-right: 24px;
        display: flex;
        align-items: center;
        .btn {
          padding: 4px 8px;
          margin-left: 12px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: normal;
          line-height: 22px;
          text-align: center;
          letter-spacing: 0em;

          /* 状态色/primary */
          color: #36a4ff;
          cursor: pointer;
        }
      }
    }
  }

  .cls-btn-add {
    position: relative;
    padding-right: 34px;
    margin-left: 16px;
  }
  .minHeight {
    height: calc(100% - 64px) !important;
  }
  .list-box {
    margin-left: 20px;
    width: 1344px;
  }
  .appd-table-list {
    height: calc(100% - 64px);
    position: relative;
    display: flex;
    .assets-list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      width: 1344px;
      margin: 0 auto;
      .assets-item {
        margin-right: 20px;
        margin-bottom: 20px;
        width: 321px;
        &:nth-child(4n) {
          margin-right: 0px !important;
        }
      }
    }
    .appd-table-top {
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .appd-table-title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4b4b4b;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &::before {
          width: 4px;
          height: 14px;
          background: #36a4ff;
          content: '';
          display: inline-block;
          margin-right: 8px;
        }
      }
      .appd-table-add {
      }
    }
    .appd-table-content {
      .group-name-box:hover {
        .show-hidden {
          display: block !important;
        }
      }
      .group-name-box {
        display: flex;
        align-items: center;
        width: 400px;
        margin-top: 32px;
        .group-name {
          width: 216px;
          height: 28px;
          background: linear-gradient(
            270deg,
            rgba(54, 164, 255, 0.4) 0%,
            #36a4ff 100%
          );
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          display: flex;
          align-items: center;
          &::before {
            content: '';
            width: 1px;
            height: 100%;
            background: #fff;
            display: block;
            margin-left: 3px;
            margin-right: 8px;
          }
        }

        .show-hidden {
          display: none;
        }
        .delete-edit {
          display: flex;
          .group-edit {
            display: block;
            width: 16px;
            height: 16px;
            background: url(~@/assets/application/icon-edit.png);
            margin-left: 25px;
            cursor: pointer;
          }
          .group-delete {
            display: block;
            width: 16px;
            height: 16px;
            background: url(~@/assets/application/icon-delete-dark.png);
            cursor: pointer;
            margin-left: 10px;
          }
        }
      }
    }
  }
}
.margintop32 {
  margin-top: 32px !important;
}
.margintop16 {
}
.status{
  margin-left: 32px;
}
.deving {
  display: flex;
  align-items: center;
  &::before{
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    background: url(~@/assets/imgs/deving.png);
    background-size: 100%;
    margin-right: 4px;
  }
  &::after{
    display: block;
    content: '开发中';
    color: #36A4FF;
    font-size: 12px;
  }
}
.posting {

}
.post-err {
  display: flex;
  align-items: center;
  &::before{
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    background: url(~@/assets/imgs/error.png);
    background-size: 100%;
    margin-right: 4px;
  }
  &::after{
    display: block;
    content: '发布失败';
    color: #FF4D4F;
    font-size: 12px;
  }
}
.posted {
  display: flex;
  align-items: center;
  &::before{
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    background: url(~@/assets/imgs/success.png);
    background-size: 100%;
    margin-right: 4px;
  }
  &::after{
    display: block;
    content: '已发布';
    color: #4CC09E;
    font-size: 12px;
  }
}
.deploying {
}
.deploy-err {
  display: flex;
  align-items: center;
  &::before{
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    background: url(~@/assets/imgs/error.png);
    background-size: 100%;
    margin-right: 4px;
  }
  &::after{
    display: block;
    content: '部署失败';
    color: #FF4D4F;
    font-size: 12px;
  }
}
.deployed {
  display: flex;
  align-items: center;
  &::before{
    display: block;
    content: '';
    width: 12px;
    height: 12px;
    background: url(~@/assets/imgs/success.png);
    background-size: 100%;
    margin-right: 4px;
  }
  &::after{
    display: block;
    content: '已部署';
    color: #4CC09E;
    font-size: 12px;
  }
}
.flex-start-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

::v-deep.assets-tab {
  padding-left: 24px;
  padding-right: 24px;
  background: white;
  .c-tabs__header {
    margin: 0;
  }
  .c-tabs__content {
    display: none;
  }
  .c-tabs__item {
    height: 64px;
    line-height: 64px;
  }
}
::v-deep.release-record {
  height: calc(100% - 100px);
  overflow-y: auto;
  margin-top: 20px;
  margin-left: 10px;
  .c-form-item {
    max-width: 1062px;
  }
  .c-form-item__label {
    color: #8a8a8a;
  }
  .c-form-item__content {
    line-height: 20px;
  }
}
.asset-btn-box {
  display: flex;
  align-items: center;
  padding-right: 24px;
  margin-top: 50px;
}
.asset-select-btn {
  width: 352px;
  height: 120px;
  cursor: pointer;
}
.asset-btn-flow {
  background-image: url(~@/assets/imgs/asset-btn-flow.png);
  background-size: 100%;
  &:hover {
    background-image: url(~@/assets/imgs/asset-btn-flow-hover.png);
  }
}
.asset-btn-object {
  background-image: url(~@/assets/imgs/asset-btn-object.png);
  background-size: 100%;
  &:hover {
    background-image: url(~@/assets/imgs/asset-btn-object-hover.png);
  }
}
.asset-btn-statis {
  background-image: url(~@/assets/imgs/asset-btn-statis.png);
  background-size: 100%;
  &:hover {
    background-image: url(~@/assets/imgs/asset-btn-statis-hover.png);
  }
}
.asset-btn-tech {
  background-image: url(~@/assets/imgs/asset-btn-tech.png);
  background-size: 100%;
  &:hover {
    background-image: url(~@/assets/imgs/asset-btn-tech-hover.png);
  }
}
.detail-btn-box {
  display: flex;

  .detail-btn {
    width: 104px;
    height: 32px;
    cursor: pointer;
    background: linear-gradient(180deg, #cedeff 0%, #ffffff 100%);
    box-shadow: 2px 3px 8px 0px #1a81d5;
    border-radius: 2px;
    border: 1px solid #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #36a4ff;
    margin-left: 24px;
  }
}
.asset-btns {
  position: absolute;
  top: 88px;
  right: 20px;
  z-index: 1002;
  display: flex;
}
.select-btn {
  margin-left: 24px;
}
.add-btn {
  margin-left: 24px;
  height: 32px;
  &::v-deep {
    .btn-add {
      height: 32px;
    }
    .c-button--primary {
      border: 0;
      padding: 1px 4px 1px 13px !important;
      width: 100px !important;
      min-width: 100px !important;
      font-size: 14px;
      font-weight: normal;
      .dropdown-common-arrow{
        content: "\e6df";
        color: #FFFFFF;
        background-image: url(~@/assets/imgs/icon-arrow.png);
        background-size: 100%;
      }
    }

    .btn-add::before {
      width: 0px;
    }
  }
}
.old-btn {
  height: 32px;
  &::v-deep {
    .btn-add {
      height: 32px;
    }
    .c-button--gradual, .c-button--primary {
      border: 0;
      padding: 1px 4px 1px 13px !important;
      width: 100px !important;
      min-width: 100px !important;
      background: #EBF9FF;
      font-size: 14px;
      font-weight: normal;

      /* 状态色/primary */
      color: #36A4FF;
      .dropdown-common-arrow{
        content: "\e6df";
        color: #36A4FF;
        background-image: url(~@/assets/imgs/hl-icon.png);
        background-size: 100%;

      }
    }

    .btn-add::before {
      width: 0px;
    }
  }
}
.fullscreen-alert {
  width: 112px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  border: 1px solid #ffffff;
  color: #8a8a8a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  right: 24px;
  top: 80px;
  z-index: 3;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  .full-icon {
    width: 16px;
    height: 16px;
    background: url(~@/assets/imgs/full-icon.png) no-repeat;
    background-size: 100%;
  }
}
.unfullscreen-alert {
  width: 112px;
  height: 40px;
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  border-radius: 2px;
  border: 1px solid #ffffff;
  color: #8a8a8a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  right: 40px;
  top: 40px;
  padding: 10px 16px;
  z-index: 3;
  font-size: 14px;
  cursor: pointer;
  .unfull-icon {
    width: 16px;
    height: 16px;
    background: url(~@/assets/imgs/unfull-icon.png) no-repeat;
    background-size: 100%;
  }
}
.full-box {
  height: 100%;
  padding: 20px;
  background: #f3f4fb;
  overflow: auto;
}
.algin-center {
  display: flex;
  align-items: center;
}
</style>
<style>
.full-relation .c-dialog__header {
  display: none;
}
.full-relation .c-dialog__body-no-footer {
  padding: 0px;
  height: 100%;
}
.full-relation .c-dialog__body {
  height: 100%;
}
</style>
