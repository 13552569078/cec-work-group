<!--/*
* @Author: lianpeng
* @Desc: 视图资源
* @Date: 2021-5-10
*/-->
<template>
  <div style="width:100%;height:100%;">
    <detail-layout
      :page-title="'基本信息'"
      :btns="pageStatus === 'detail'?pageTopBtnsDetail:pageTopBtns"
      @handleOperate="handleOperate"
    >
      <template v-slot:content>
        <detailBaseInfo v-if="pageStatus=='detail'" :hide-scene="true" :form-data="formData" @showLog="showLog" />
        <div v-show="pageStatus!='detail'" ref="base-info" class="white-box-wrap">
          <c-form
            ref="dataForm"
            :model="formData"
            label-width="108px"
            class=""
            :class="pageStatus === 'detail'?'disabled-new':''"
            :rules="pageStatus === 'detail'?{}:rules"
            :disabled="pageStatus === 'detail'"
            label-position="top"
            @submit.native.prevent
          >
            <div class="header">
              <div class="border"></div>
              <div class="title">基本信息</div>
            </div>
            <div class="cls-item-wrapper">
              <!-- :style="pageStatus === 'detail'?{ padding: '24px 24px 24px 0'}:{ padding: '24px 24px 24px 24px'}" -->
              <c-row
                :gutter="0"
                class="search-box"
              >
                <c-col :span="span">
                  <c-form-item
                    label="页面类型"
                    prop="businessType"
                  >
                    <c-select
                      v-model="formData.businessType"
                      :specific-suffix="true"
                      class="form-input-item"
                      :disabled="pageStatus !== 'add'"
                      size="small"
                      placeholder="请选择">
                      <c-option v-for="item in pageTypeList" :key="item.value" :label="item.label" :value="item.value"></c-option>
                    </c-select>
                  </c-form-item>
                </c-col>
                <c-col v-if="formData.businessType===1" :span="span">
                  <c-form-item
                    label="设置为默认登录页"
                    prop="loginType"
                  >
                    <c-radio-group
                      v-model="formData.loginType"
                      :disabled="pageStatus !== 'add'"
                    >
                      <c-radio :label="1">是</c-radio>
                      <c-radio :label="0">否</c-radio>
                    </c-radio-group>
                  </c-form-item>
                </c-col>
                <c-col v-if="formData.businessType===2" :span="span">
                  <c-form-item
                    label="模板选择"
                    prop="navType"
                  >
                    <c-radio-group
                      v-model="formData.navType"
                      :disabled="pageStatus !== 'add'"
                    >
                      <c-radio :label="1">顶部导航</c-radio>
                      <c-radio :label="0">左侧导航</c-radio>
                    </c-radio-group>
                  </c-form-item>
                </c-col>
              </c-row>
              <c-row
                :gutter="0"
                class="search-box"
              >
                <c-col :span="span">

                  <c-form-item
                    label="资源名称"
                    prop="assetName"
                  >
                    <c-input
                      v-model="formData.assetName"
                      :placeholder="pageStatus === 'detail'?'':'请输入资源名称'"
                      size="small"
                      clearable
                      :disabled="pageStatus !== 'add'"
                      class="form-input-item"
                      maxlength="20"
                    />
                  </c-form-item>
                </c-col>
                <c-col :span="span">

                  <c-form-item
                    label=""
                    prop="assetCode"
                  >
                    <template slot="label">
                      <span>
                        资源编码
                        <c-tooltip
                          placement="top"
                          popper-class="cls-form-label-tip"
                        >
                          <div
                            slot="content"
                            class="hahah"
                            v-html="AssetCodeToolTipText"
                          >
                          </div>
                          <i class="cls-icon-info"></i>
                        </c-tooltip>
                      </span>
                    </template>
                    <c-input
                      v-model="formData.assetCode"
                      :placeholder="pageStatus === 'detail'?'':'请输入资源编码'"
                      size="small"
                      clearable
                      class="form-input-item "
                      :maxlength="pageStatus === 'add'?17:20"
                      :disabled="pageStatus !== 'add'"
                      @input="formData.assetCode = formData.assetCode.replace(/[^\w]/ig,'')"
                    >
                      <template v-if="pageStatus === 'add'" slot="prepend">{{ formData.assetCodePrefix }}</template>
                    </c-input>
                  </c-form-item>

                </c-col>
                <c-col v-if="pageStatus !== 'add' && formData.status !== 1" :span="span">
                  <c-form-item
                    label="版本号"
                    prop="version"
                  >
                    <c-input
                      v-model="formData.version"
                      :placeholder="pageStatus === 'detail'?'':'请输入'"
                      size="small"
                      type="text"
                      :disabled="pageStatus !== 'add'"
                      maxlength="20"
                      class="form-input-item"
                      clearable
                    />
                  </c-form-item>
                </c-col>
                <c-col :span="span">
                  <c-form-item
                    v-if="pageStatus === 'detail'"
                    label="资源状态"
                    prop="status"
                  >
                    <span slot="label">
                      <span class="lable">资源状态</span>
                      <span
                        v-if="formData.status!=1||formData.processLog"
                        class="log-btn" @click="showLog"
                      >查看日志</span>
                    </span>
                    <span
                      class="form-input-item"
                    >{{ formData.status|assetStatusFilter }}</span>
                  </c-form-item>

                </c-col>
              </c-row>
              <div v-if="pageStatus === 'detail'" ref="form-line" class="form-line" :style="'width:'+lineWidth+'px'"></div>

              <c-row
                :gutter="0"
              >
                <c-col :span="pageStatus === 'detail'?span*2:span ">

                  <c-form-item
                    label="资源标签"
                    prop="tagNameList"
                  >
                    <c-select
                      v-model="formData.tagNameList"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      :specific-suffix="true"
                      class="form-input-item"
                      placeholder="请选择">
                      <c-option
                        v-for="item in topicTreeData"
                        :key="item.groupName"
                        :label="item.groupName"
                        :value="item.groupName">
                      </c-option>
                    </c-select>
                  </c-form-item>
                </c-col>
              </c-row>

              <c-row
                :gutter="0"
              >
                <c-col :span="span">
                  <c-form-item
                    label="资源描述"
                    prop="assetDesc"
                  >
                    <c-input
                      v-model="formData.assetDesc"
                      size="small"
                      type="textarea"
                      class="form-input-item"
                      :placeholder="pageStatus === 'detail'?'':'请输入资源描述'"
                      :autosize="pageStatus === 'detail'?true:false"
                      maxlength="200"
                      :rows="4"
                      resize="none"
                      show-word-limit
                      clearable
                    />
                  </c-form-item>
                </c-col>

              </c-row>
              <c-row
                v-if="pageStatus === 'detail'&&formData.status !== 1"
                :gutter="0"
              >
                <c-col :span="span">
                  <c-form-item
                    label="版本说明"
                    prop="versionDesc"
                  >
                    <c-input
                      v-model="formData.versionDesc"
                      size="small"
                      type="textarea"
                      class="form-input-item"
                      :placeholder="pageStatus === 'detail'?'':'请输入资源描述'"
                      :autosize="pageStatus === 'detail'?true:false"
                      maxlength="200"
                      :rows="4"
                      resize="none"
                      show-word-limit
                      clearable
                    />
                  </c-form-item>
                </c-col>

              </c-row>
              <!-- <div v-if="pageStatus === 'detail'" ref="form-line" class="form-line" :style="'width:'+lineWidth+'px'"></div> -->
            </div>
          </c-form>
        </div>
        <div class="">
          <c-form
            ref="dataForm"
            :model="formData"
            label-width="108px"
            class=""
            :class="pageStatus === 'detail'?'disabled-new':''"
            :rules="pageStatus === 'detail'?{}:rules"
            label-position="top"
            @submit.native.prevent
          >
            <div class="white-box-wrap">
              <div class="header">
                <div class="border"></div>
                <div class="title">引用发布资源</div>
              </div>
              <c-row
                :gutter="0"
                class="search-box"
              >
                <c-col :span="span *2">
                  <c-form-item
                    label=""
                  >
                    <publishAsset :provide="true" :show-list="formData.referKpiList" :page-status="pageStatus" @goDetail="goDetail" @deleteRefer="deleteRefer" @add="openIndexTableDialog"></publishAsset>
                  </c-form-item>
                </c-col>
              </c-row>
            </div>
            <!-- deployType=1仅部署开发中心不显示 -->
            <div v-if="deployType!=1" class="white-box-wrap">
              <div class="header">
                <div class="border"></div>
                <div class="title">引用订阅资源</div>
              </div>
              <c-row
                :gutter="0"
                class="search-box"
              >
                <c-col :span="span *2">
                  <c-form-item label="">
                    <subAsset :show-list="formData.referKpiList2" :page-status="pageStatus" @goDetail="goDetail2"
                              @deleteRefer="deleteRefer2" @add="openIndexTableDialog2"></subAsset>

                  </c-form-item>
                </c-col>
              </c-row>
            </div>
            <div v-if="pageStatus === 'detail'&& formData.status===5" class="white-box-wrap">
              <div class="header">
                <div class="border"></div>
                <div class="title">被引用关系</div>
              </div>
              <c-row
                :gutter="0"
                class="search-box"
              >
                <c-col :span="span *2">
                  <c-form-item label="" style=" margin-top: 6px; ">
                    <div
                      class="table-name"
                      style="height:1px"
                    ></div>
                    <c-table
                      :data="formData.referList"
                      :max-height="330"
                      style="width: 100%;line-height: 1;"
                    >
                      <c-table-column
                        type="index"
                        label=""
                        fit
                        :width="130"
                      />
                      <c-table-column
                        show-overflow-tooltip
                        fit
                        prop="name"
                        label="名称"
                        min-width="95"
                      />
                      <c-table-column
                        show-overflow-tooltip
                        fit
                        prop="code"
                        align="left"
                        label="编码"
                        min-width="95"
                      />
                      <c-table-column
                        show-overflow-tooltip
                        fit
                        prop="version"
                        align="left"
                        label="版本号"
                        min-width="95"
                      />
                      <c-table-column
                        show-overflow-tooltip
                        fit
                        prop="assetTypeLabel"
                        align="left"
                        label="类型"
                        min-width="95"
                      />
                      <c-table-column
                        show-overflow-tooltip
                        fit
                        prop="assetDesc"
                        align="left"
                        label="描述"
                        min-width="95"
                      />
                      <c-table-column
                        label="操作"
                        fixed="right"
                        width="160"
                      >
                        <template slot-scope="scope">
                          <div class="oprete-list">
                            <span
                              class="icon-to-text icon-operate"
                              :class="pageStatus !== 'detail'?'has-split':''"
                              @click="goDetail(scope.row)"
                            >查看</span>
                          </div>
                        </template>
                      </c-table-column>
                    </c-table>

                  </c-form-item>
                </c-col>
              </c-row>
            </div>
            <div v-if="pageStatus === 'detail'" class="white-box-wrap nopadding">
              <creator-info :form-data="formData"></creator-info>
            </div>
          </c-form>
        </div>

      </template>
    </detail-layout>
    <referrassetDialog
      v-if="indexDialogVisible"
      title="引用资源"
      checked-name="assetId"
      :provide="true"
      tag-real-name="tagNameList"
      :page-data="indexDialogTable.page"
      :table-cloumn-data="columns()"
      :show-list="indexDialogTable.list"
      :init-select-arrs="indexDialogTable.selectedArr"
      @getTableList="getDialogTableList"
      @saveTableList="saveIndexTableList"
      @close="indexDialogVisible=false"
    />
    <expandTable
      v-if="indexDialogVisible2" title="引用订阅资源" checked-name="assetId"
      tag-real-name="tagNameList" :page-data="indexDialogTable2.page"
      :table-cloumn-data="columns()" :show-list="indexDialogTable2.list"
      :init-select-arrs="indexDialogTable2.selectedArr"
      @getTableList="getDialogTableList2" @saveTableList="saveIndexTableList2"
      @close="indexDialogVisible2=false" />
    <c-dialog
      :class="'dialog-center'"
      :visible.sync="showDialogFlagObject"
      :title="'查看对象资源'" width="666px">
      <objectDetail
        v-if="showDialogFlagObject"
        :flag="'view'"
        :asset-id="currId"
        @close="closeDialog"
      />

    </c-dialog>
    <c-dialog
      :class="'dialog-center'"
      :title="'查看接口'"
      width="666px"
      class="details-dialog"
      top="32px"
      :visible.sync="showDialogFlagInterface"
    >
      <interfaceDetail
        v-if="showDialogFlagInterface"
        :flag="'detail'"
        :curr-id="currId"
        @close="closeDialog"
      />
    </c-dialog>
    <log-dialog :log-dialog-flag="logDialogFlag" :process-log="processLog" @close="logDialogFlag=false;processLog=''"></log-dialog>
  </div>

</template>
<script>
import { addPage, editPage, pageDetail } from '@/api/interface-assets';
import expandTable from '@/components/expand-table'
// import referrsubassetDialog from '@/components/checkbox-notree/referrsubasset.vue'
import referrassetDialog from '@/components/checkbox-notree/referrasset.vue'
import detailLayout from '@/components/detail-layout/page-index'
import { tagTree, assetCodeExist, assetNameExist, apiAssetListPage, getByBasicInfo, assetReferenced, getByBizCode } from '@/api/index'
import { mapGetters } from 'vuex'
import logDialog from '@/views/asset-management/components/log-dialog.vue'
import { openAssetEditorUrl, getAssetTypeLabel, goDetail, openWindow, getCodePrefix, getRandomCode } from '@/utils'
import creatorInfo from '@/components/creator-info'

import { checkAssetCode, checkAssetName, checkVersion } from '@/utils/validate'
import objectDetail from '@/views/asset-management/object-asset/add.vue'
import interfaceDetail from '@/views/asset-management/technology-asset/interface-asset/index.vue'
import { AssetCodeToolTipText, DefaultValue } from '@/config/index'
import detailBaseInfo from '@/views/asset-management/components/detail-base-info.vue'
export default {
  name: 'IndexManagement',
  components: { detailBaseInfo, detailLayout, creatorInfo, logDialog, referrassetDialog, expandTable, objectDetail, interfaceDetail },
  data() {
    return {
      deployType: window.__systemConfig && +window.__systemConfig.deployType,
      pageTypeList: [
        // { label: '登录页', value: 1 },
        // { label: '门户页', value: 2 },
        // { label: '空白页', value: 3 },
        { label: '表单页面', value: '4' },
        { label: '审批列表', value: '5' },
        { label: '普通列表', value: '6' },
        { label: '统计列表页面', value: '7' },
        { label: '自定义页面', value: '8' },
        { label: '开发页面', value: '9' }

      ],
      logDialogFlag: false,
      processLog: '',
      AssetCodeToolTipText,
      type: '1',
      span: 12,
      defaultValue: DefaultValue,
      lineWidth: 1000,
      formData: {
        groupId: this.$route.query.groupId,
        appId: this.$route.query.appId,
        assetCode: '',
        assetCodePrefix: '',
        assetObjectList: [],
        referList: [],
        assetTechList: [],
        referKpiList2: [],
        tagNameList: [],
        subtype: 23,
        referSubAssetList: [],
        referKpiList: []
      },
      showDialogFlagObject: false,
      showDialogFlagInterface: false,
      currId: '',
      citationKpi: [],
      indexDialogTable: {
        page: { total: 0, pageSize: 10, currPage: 1 },
        list: [],
        selectedArr: []
      },
      indexDialogTable2: {
        page: { total: 0, pageSize: 10, currPage: 1 },
        list: [],
        selectedArr: []
      },
      pageStatus: this.$route.query.flag,
      topicTreeData: [],
      indexDialogVisible: false,
      indexDialogVisible2: false,
      modelDialogVisible: false,
      dataDialogVisible: false,
      pageTopBtns: [
        {
          type: 'primary',
          label: '提交',
          disabled: this.$route.query.flag === 'detail'
        }, {
          type: 'default',
          label: '重置',
          disabled: this.$route.query.flag === 'detail'
        }
      ],
      pageTopBtnsDetail: [
        {
          type: 'primary',
          label: '更多'
        }
      ],
      rules: {
        businessType: [
          { required: true, message: '请选择页面类型', trigger: 'blur' }
        ],
        loginType: [
          { required: true, message: '请选择是否是默认登录页', trigger: 'change' }
        ],
        navType: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        assetName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { max: 20, message: '最多输入20个字符', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorName(val, cb)
            },
            trigger: 'blur'
          }
        ],

        assetCode: [
          { required: true, message: '请输入资源编码', trigger: 'blur' },
          { validator: (rule, val, cb) => {
            // 不能重名
            this.validatorCode(val, cb)
          }, trigger: 'blur' }
        ],
        version: [
          {
            required: true,
            message: '请输入版本号',
            trigger: 'blur'
          },
          {
            validator: (rule, val, cb) => {
              checkVersion(val, cb)
            },
            trigger: 'blur'
          }
        ],
        tagNameList: [
          {
            validator: (rule, val, cb) => {
              if (val && val.length) {
                const flag = val.filter(d => d.length > 10)
                if (flag.length > 0) return cb('单个标签的最大长度为10')
              }
              cb()
            },
            trigger: ['blur', 'change']
          }
        ]

      }
    };
  },
  computed: {
    pageTitle() {
      const PAGE_STATUS_OBJ = { edit: '编辑页面', add: '新增页面', detail: '查看页面' }
      return PAGE_STATUS_OBJ[`${this.$route.query.flag}`]
    },
    ...mapGetters(['sidebar']),
    columns() {
      return function (type) {
        return [
          {
            lable: '资源名称',
            prop: 'assetName'
          },
          {
            lable: '资源编码',
            prop: 'assetCode'
          },
          {
            lable: '版本号',
            prop: 'version'
          }, {
            lable: '资源类型',
            prop: 'assetTypeLabel'
          }, {
            lable: '资源描述',
            prop: 'assetDesc'
          }
        ]
      }
    }
  },
  watch: {
    'sidebar.opened'() {
      this.setLineWidth()
    }
  },
  created() {
    this.getAssetLabels()
    if (this.pageStatus === 'detail' || this.pageStatus === 'edit') { this.initData() } else {
      this.formData.assetCode = getRandomCode(this.formData.subtype)
      this.formData.assetCodePrefix = getCodePrefix(this.formData.subtype)
    }
  },
  mounted() {
    window.onresize = () => {
      this.setLineWidth()
    }
    this.setLineWidth()
  },
  methods: {
    handleSelect(list) {
      this.type = list
    },
    getReferList() {
      assetReferenced({
        assetId: this.$route.query.id
      }).then(res => {
        this.$set(this.formData, 'referList', res.data.list.map(item => {
          item.assetTypeLabel = getAssetTypeLabel(item.assetType, item.subtype, true)
          item.assetId = item.id
          return item
        }))
      })
    },
    showLog() {
      this.processLog = this.formData.processLog
      this.logDialogFlag = true
    },
    closeDialog() {
      this.showDialogFlagObject = false
      this.showDialogFlagInterface = false

      this.currId = ''
    },
    setLineWidth() {
      this.lineWidth = this.$refs['base-info'].offsetWidth - 40
    },
    validatorCode(val, cb) {
      if (this.pageStatus !== 'add') {
        // 仅新增状态下可编辑资源编码
        return cb()
      }
      if (!checkAssetCode(val)) {
        return cb('允许字母、数字、下划线，最大长度20')
      }
      assetCodeExist(val).then(res => {
        if (res.data && res.data.result * 1 === 1) {
          cb('资源编码已经存在！')
        } else {
          cb()
        }
      })
    },
    validatorName(val, cb) {
      if (this.pageStatus !== 'add') {
        // 仅新增状态下可编辑资源编码
        return cb()
      }
      if (!checkAssetName(val)) {
        return cb('允许中英文、数字、下划线及中横线，最大长度20')
      }
      assetNameExist(val).then(res => {
        if (res.data && res.data.result * 1 === 1) {
          cb('资源名称已经存在！')
        } else {
          cb()
        }
      })
    },
    deleteRefer(row) {
      this.$confirm(
        '请确认是否取消引用此资源？',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then((res) => {
          // this.formData.referAssetList.splice(index, 1)
          // this.formData.referKpiList.splice(index, 1)
          const index = this.formData.referAssetList.findIndex(item => item.referAssetId === row.assetId)
          console.log(index, 'index', this.formData.referAssetList, row)
          if (index === -1) return
          this.formData.referAssetList.splice(index, 1)
          this.formData.referKpiList.splice(index, 1)
        })
    },
    goDetail2(row) {
      if (row.subtype + '' === '27') {
        getByBasicInfo({
          shopCode: row.bizKey,
          packVersion: row.version
        }).then(res => {
          if (res.code === 1404) {
            this.$message.error('订阅资源不存在！')
          } else {
            this.downloadOpen(res.data)
          }
        })
        return
      }
      getByBizCode({
        bizCode: row.bizCode
      }).then(res => {
        if (res.code === 1404) {
          this.$message.error('订阅资源不存在！')
        } else {
          this.downloadOpen(res.data)
        }
      })
    },
    deleteRefer2({ row, subIndex }) {
      this.$confirm(
        '请确认是否取消引用此资源？',
        '提示',
        {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }
      )
        .then((res) => {
          if (subIndex !== undefined) {
            const index = this.formData.referSubAssetList.findIndex(item => item.referAssetId === row.assetId)
            console.log(index, 'index')
            this.formData.referSubAssetList[index].referApiList.splice(subIndex, 1)
            this.formData.referKpiList2[index].children.splice(subIndex, 1)
            if (this.formData.referSubAssetList[index].referApiList.length === 0) {
              this.formData.referSubAssetList.splice(index, 1)
            }
            if (this.formData.referKpiList2[index].children.length === 0) {
              this.formData.referKpiList2.splice(index, 1)
            }
          } else {
            const index = this.formData.referSubAssetList.findIndex(item => item.referAssetId === row.assetId)
            console.log(index, 'index', this.formData.referSubAssetList, row)
            if (index === -1) return
            this.formData.referSubAssetList.splice(index, 1)
            this.formData.referKpiList2.splice(index, 1)
          }
        })
    },
    openIndexTableDialog2() {
      if (this.pageStatus === 'detail') return
      this.indexDialogTable2.selectedArr = this.formData.referKpiList2
      this.indexDialogVisible2 = true
    },
    getDialogTableList2(params) {
      const realParams = Object.assign({ createSrc: 2, appId: this.$route.query.appId, neAssetId: this.$route.query.id }, params, this.pageStatus === 'add' ? {} : { assetId: this.$route.query.id * 1, filterAssetCode: this.formData.assetCode })
      apiAssetListPage(realParams).then(res => {
        this.indexDialogTable2.list = res.data.list.map(item => {
          item.assetTypeLabel = getAssetTypeLabel(item.assetType, item.subtype)
          return item
        })
        this.indexDialogTable2.page = {
          total: res.data.total,
          pageSize: res.data.pageSize,
          currPage: res.data.currPage
        }
      })
    },
    goDetail(row) {
      const res = goDetail(row)
      if (res) {
        this.showDialog(res, row.assetId)
      }
    },
    showDialog(flag, currId) {
      if (flag === 'flow') {
        this.showDialogFlagFlow = true
      } else if (flag === 'object') {
        this.showDialogFlagObject = true
      } else if (flag === 'interface') {
        this.showDialogFlagInterface = true
      }
      this.currId = currId
    },
    openWindow(path) {
      openWindow(path)
    },
    openIndexTableDialog() {
      if (this.pageStatus === 'detail') return
      this.indexDialogTable.selectedArr = this.formData.referKpiList
      this.indexDialogVisible = true
    },
    getDialogTableList(params) {
      const realParams = Object.assign({ createSrc: 1, appId: this.$route.query.appId }, params, this.pageStatus === 'add' ? {} : { assetId: this.$route.query.id * 1, filterAssetCode: this.formData.assetCode })
      apiAssetListPage(realParams).then(res => {
        this.indexDialogTable.list = res.data.list.map(item => {
          item.assetTypeLabel = getAssetTypeLabel(item.assetType, item.subtype)
          return item
        })
        this.indexDialogTable.page = {
          total: res.data.total,
          pageSize: res.data.pageSize,
          currPage: res.data.currPage
        }
      })
    },

    saveIndexTableList(list) {
      this.$set(this.formData, 'referKpiList', list.map(item => ({
        ...item,
        referAssetId: item.assetId,
        referAssetCode: item.assetCode,
        referAssetType: item.assetType,
        referAssetDesc: item.assetDesc,
        referSubtype: item.subtype,
        referVersionStatus: item.referVersionStatus,
        versionStatus: item.versionStatus,
        referVersion: item.version
      })))
      this.formData.referAssetList = list.map(item => ({
        referAssetId: item.assetId,
        referAssetCode: item.assetCode,
        referAssetType: item.assetType,
        referSubtype: item.subtype,
        referVersionStatus: item.referVersionStatus,
        versionStatus: item.versionStatus,
        referAssetDesc: item.assetDesc,
        referVersion: item.version
      }))
      this.indexDialogTable.selectedArr = list
      this.temListData(list)
    },
    saveIndexTableList2(list) {
      this.$set(this.formData, 'referKpiList2', list)
      this.formData.referSubAssetList = list.map(item => ({
        referAssetId: item.assetId,
        referAssetCode: item.assetCode,
        referAssetType: item.assetType,
        referAssetDesc: item.assetDesc,
        referSubtype: item.subtype,
        referVersionStatus: item.referVersionStatus,
        versionStatus: item.versionStatus,
        referVersion: item.version,
        referApiList: item.children.map(_item => ({ ..._item }))

      }))
      this.indexDialogTable2.selectedArr = list
    },
    temListData(list) {
      const CitationTemArr = []
      if (!list && list.length === 0) {
        this.citationKpi = []
        return
      }
      list.map((i) => CitationTemArr.push({ referType: 2, referId: i.id }))
      this.citationKpi = CitationTemArr
      return
    },
    downloadOpen(row) {
      console.log(row)
      if (window.__systemConfig && window.__systemConfig.assetShopUrl) {
        const params = {
          shopCode: row.shopCode,
          packVersion: row.packVersion,
          packVersionId: row.packVersionId,
          assetType: row.subtype || row.assetSubtype
        }
        window.open(`${window.__systemConfig.assetShopUrl}home/snapshoot?${Object.keys(params).map(k => `${k}=${params[k]}`).join('&')}`)
      } else {
        this.$message.warning('没有获取到资源商城平台跳转地址，请刷新页面后重试')
      }
    },
    helpRdDelNull(arr, keyName = 'id') {
      if (!arr || arr.length === 0) return []
      return arr.filter(i => i[keyName] != null)
    },

    initData() {
      // 获取详情
      pageDetail(this.$route.query.id).then(res => {
        this.formData = Object.assign({ referKpiList: [], referKpiList2: [], tagNameList: [] }, res.data)
        this.formData.tagNameList = res.data.tagList ? res.data.tagList.map(d => d.groupName) : []
        const referKpiList = this.helpRdDelNull([].concat(res.data.referAssetList && res.data.referAssetList.map(item => ({ ...item, groupType: 1 })) || [], res.data.referPrivateAssetList && res.data.referPrivateAssetList.map(item => ({ ...item, groupType: 2 })) || [], res.data.referShareAssetList && res.data.referShareAssetList.map(item => ({ ...item, groupType: 3 })) || []), 'referAssetId');
        this.formData.referAssetList = referKpiList
        const referKpiList2 = this.helpRdDelNull(res.data.referSubAssetList, 'referAssetId');
        console.log(referKpiList, referKpiList2, 'referKpiList', res.data.referAssetList)
        if (this.pageStatus === 'detail' && this.formData.status === 5) {
          this.getReferList()
        }
        this.formData.referKpiList = referKpiList.map(item => ({
          ...item,
          assetId: item.referAssetId,
          assetName: item.referAssetName,
          assetDesc: item.referAssetDesc,
          groupType: item.groupType,
          assetCode: item.referAssetCode,
          assetType: item.referAssetType,
          assetTypeLabel: getAssetTypeLabel(item.referAssetType, item.referSubtype),
          subtype: item.referSubtype,
          referVersionStatus: item.referVersionStatus,
          versionStatus: item.versionStatus,
          version: item.referVersion
        }))
        this.formData.referKpiList2 = referKpiList2.map(item => ({
          ...item,
          assetId: item.referAssetId,
          assetName: item.referAssetName,
          assetCode: item.referAssetCode,
          assetDesc: item.referAssetDesc,
          bizCode: item.bizCode,
          assetType: item.referAssetType,
          assetTypeLabel: getAssetTypeLabel(item.referAssetType, item.referSubtype),
          subtype: item.referSubtype,
          referVersionStatus: item.referVersionStatus,
          versionStatus: item.versionStatus,
          version: item.referVersion,
          children: item.referApiList && item.referApiList.map(item => item) || []

        }))
        console.log(this.formData.referKpiList2, 'this.formData.referKpiList2')
        if (this.pageStatus === 'detail') {
          this.rules = {}
          Object.keys(this.formData).forEach(key => {
            if (!this.formData[key] && key !== 'version' && key !== 'processLog') this.formData[key] = this.defaultValue
          })
        }

        if (referKpiList && referKpiList.length) {
          this.temListData(referKpiList)
        }
      })
    },
    handleOperate(item) {
      if (item.label === '更多') {
        this.$router.go(-1)
        openAssetEditorUrl({ ...this.formData, assetType: 2, subtype: '23', readonly: this.pageStatus === 'detail' ? 1 : '' }, this.$message)
      } else if (item.label === '提交') {
        this.saveForm()
      } else if (item.label === '重置') {
        this.citationModel = [];
        this.citationData = [];
        this.citationKpi = [];
        this.formData = Object.assign({}, this.formData, {
          kpiUnit: '',
          scale: '',
          tagNameList: [],
          referKpiList: [],
          referKpiList2: [],
          referAssetList: [],
          referSubAssetList: [],
          algorithmType: '',
          assetDesc: '',

          kpiSeq: '',
          kpiReferList: []
        }, this.pageStatus === 'add' ? { assetCode: '', assetName: '' } : {})
      }
    },

    saveForm() {
      this.$refs.dataForm.validate((valid) => {
        if (!valid) return;
        const referAssetList = this.formData.referKpiList.filter(item => item.groupType + '' === '1')
        const referPrivateAssetList = this.formData.referKpiList.filter(item => item.groupType + '' === '2')
        const referShareAssetList = this.formData.referKpiList.filter(item => item.groupType + '' === '3')
        if (this.pageStatus === 'add') {
          addPage({ ...this.formData, referAssetList, referPrivateAssetList, referShareAssetList, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }).then(res => {
            if (res.code * 1 === 0) {
              this.$message.success(res.msg)
              this.$router.go(-1)
              openAssetEditorUrl({ ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode, assetType: 2, subtype: '23' }, this.$message)
            }
          })
        } else {
          editPage({ ...this.formData, referAssetList, referPrivateAssetList, referShareAssetList, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }).then(res => {
            if (res.code * 1 === 0) {
              this.$message.success(res.msg)
              this.$router.go(-1)
              openAssetEditorUrl({ ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode, assetType: 2, subtype: '23' }, this.$message)
            }
          })
        }
      })
    },

    getAssetLabels() {
      tagTree().then((res) => {
        this.topicTreeData = res.data
      })
    }
  }
};
</script>
<style scoped lang="scss">
@import '@/styles/variables.scss';

.form-line{
  width: 100px;
  height: 1px;
  background: #EDEDED;
  margin: 4px 0 20px;
}
.table-name {
  margin-top: 16px;
  height: 48px;
  // background: #fafafa;
  border-radius: 2px 2px 0px 0px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 300;
  color: #404040;
  // padding-left: 24px;
  line-height: 48px;
  // border-top: 1px solid #D9D9D9;
  // border-left: 1px solid #D9D9D9;
  // border-right: 1px solid #D9D9D9;
}
.icon-operate {
  cursor: pointer;
  margin-right: 8px;
  padding-right: 8px;
}

.disabled-new{
  .cls-item-wrapper{
    max-width: 1084px !important;
  }
  .form-input-item.c-textarea{
    max-width: 900px !important;
  }
}
span.form-input-item{
  color:#4b4b4b
}
.cls-model-form {
  padding: 0 20px 0px 20px ;
  margin-left: -4px;
  .cls-item-wrapper {
    max-width: 1268px;
  }

  .upload__tip {
    position: absolute;
    top: 0;
    left: 90px;
    font-size: 12px;
    font-weight: normal;
    color: #acacac;
  }
}
.form-input-item {
  width: 100%;
  max-width: 600px;
}
.has-split{
  position: relative;
  &::before {
    position: absolute;
    content: '';
    top: 50%;
    transform: translate(0, -50%);
    right: 0;
    width: 0.5px;
    height: 14px;
    background: #EDEDED;
  }
}
.line{
  width: 100%;
  height:20px;
  background: #f3f4fb;
}
.box{
  padding-top:20px;
}
.alert-update{
  width: 58px;
  height: 24px;
}
</style>
