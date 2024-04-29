<!--/*
* @Author: lianpeng
* @Desc: 视图资源
* @Date: 2021-5-10
*/-->
<template>
  <div style="width:100%;height:100%">
    <detail-layout
      :page-title="'基本信息'"
      :btns="pageStatus === 'detail'?pageTopBtnsDetail:pageTopBtns"
      @handleOperate="handleOperate"
    >
      <template v-slot:content>
        <div class="box">

          <div ref="base-info">
            <c-form
              ref="dataForm"
              :model="formData"
              label-width="108px"
              class="cls-model-form"
              :class="pageStatus === 'detail'?'disabled-new':''"
              :rules="pageStatus === 'detail'?{}:rules"
              :disabled="pageStatus === 'detail'"
              label-position="top"
              @submit.native.prevent
            >
              <div class="cls-item-wrapper">
                <!-- :style="pageStatus === 'detail'?{ padding: '24px 24px 24px 0'}:{ padding: '24px 24px 24px 24px'}" -->
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
                  <c-col :span="span">
                    <c-form-item
                      class="half-form-item"
                      prop="businessType"
                      label="指标类型"
                    >
                      <c-select
                        v-model="formData.businessType"
                        style="width:100%"
                        :specific-suffix="true"
                        class="form-input-item"
                        size="small"
                        :placeholder="$route.query.flag === 'detail'?'':'请选择'"
                      >
                        <c-option
                          v-for="item in kpiTypeOption"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </c-select>
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
                      prop="tagIdList"
                    >
                      <div v-if="pageStatus === 'detail'"
                      >
                        <div v-if="!formData.tagList||!formData.tagList.length">{{ defaultValue }}</div>
                        <ctag v-for="(tag,index) in formData.tagList" :key="index" class="item-tag-content" :tag="tag.groupName">
                        </ctag>
                      </div>
                      <c-cascader
                        v-else
                        v-model="formData.tagIdList"
                        size="small"
                        class="form-input-item"
                        :specific-suffix="true"
                        :show-all-levels="false"
                        :options="topicTreeData"
                        :props="{
                          multiple: true,
                          value: 'groupId',
                          label: 'groupName',
                          children: 'childList',
                          emitPath: false,
                        }"
                        :placeholder="pageStatus === 'detail'?'':'请选择'"
                        clearable
                      />
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
        </div>

        <div v-if="pageStatus === 'detail'&& formData.status===5" class="box">
          <div class="body property-info">
            <div class="header">
              <div class="border"></div>
              <div class="title">引用管理</div>
            </div>
            <div class="property-table">
              <div class="data-asset-tbl">
                <c-form ref="ruleForm" label-position="top" :disabled="pageStatus === 'detail'"
                        :class="pageStatus === 'detail'?'disabled-new':''" class="submit-form base-info-form"
                        :model="formData" :rules="rules" label-width="120px" @submit.native.prevent>
                  <c-row :gutter="0" class="search-box">
                    <c-col v-if="pageStatus === 'detail'" :span="span*2">
                      <c-form-item label="被引用关系">
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
                </c-form>
              </div>
            </div>
          </div>

        </div>
        <div v-if="pageStatus === 'detail'" class="box">
          <creator-info :form-data="formData" style="padding-top:20px"></creator-info>
        </div>
      </template>
    </detail-layout>

    <log-dialog :log-dialog-flag="logDialogFlag" :process-log="processLog" @close="logDialogFlag=false;processLog=''"></log-dialog>
  </div>

</template>
<script>
import detailLayout from '@/components/detail-layout/page-index'
import { tagTree, assetCodeExist, assetNameExist, apiAssetListPage, kpiDetail, assetReferenced } from '@/api/index'
import qs from 'qs'
import { mapGetters } from 'vuex'
import logDialog from '@/views/asset-management/components/log-dialog.vue'
import { getAssetTypeLabel, goDetail, openWindow, getCodePrefix, getRandomCode } from '@/utils'
import ctag from '@/components/tags-popover/tag'
import { checkAssetCode, checkAssetName, checkVersion } from '@/utils/validate'
import { AssetCodeToolTipText, DefaultValue } from '@/config/index'
import { kpiAdd, kpiUpdate } from '@/api/statistics-asset'
import creatorInfo from '@/components/creator-info'
export default {
  name: 'IndexManagement',
  components: { detailLayout, creatorInfo, logDialog, ctag },
  data() {
    return {
      logDialogFlag: false,
      processLog: '',
      AssetCodeToolTipText,
      kpiTypeOption: [{
        value: '1',
        label: '基础指标'
      }, {
        value: '3',
        label: '指标簇'
      }],
      span: 12,
      defaultValue: DefaultValue,
      lineWidth: 1000,
      formData: {
        groupId: this.$route.query.groupId,
        appId: this.$route.query.appId,
        assetCode: '',
        assetCodePrefix: '',
        subtype: 11,
        referList: [],
        assetObjectList: [],
        assetTechList: [],
        tagIdList: [],
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
      pageStatus: this.$route.query.flag,
      topicTreeData: [],
      indexDialogVisible: false,
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
        businessType: [
          { required: true, message: '请选择指标类型', trigger: 'blur' },
          { required: true, message: '请选择指标类型', trigger: 'change' }
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
        ]

      }
    };
  },
  computed: {

    ...mapGetters(['sidebar'])

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
      const realParams = Object.assign({ neAssetId: this.$route.query.id, appId: this.$route.query.appId }, params, this.pageStatus === 'add' ? {} : { assetId: this.$route.query.id * 1, filterAssetCode: this.formData.assetCode })
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
    helpRdDelNull(arr, keyName = 'id') {
      if (!arr || arr.length === 0) return []
      return arr.filter(i => i[keyName] != null)
    },

    initData() {
      // 获取详情
      kpiDetail(this.$route.query.id).then(res => {
        this.formData = Object.assign({ referKpiList: [] }, res.data)
        const referKpiList = this.helpRdDelNull([].concat(res.data.referAssetList && res.data.referAssetList.map(item => ({ ...item, groupType: 1 })) || [], res.data.referPrivateAssetList && res.data.referPrivateAssetList.map(item => ({ ...item, groupType: 2 })) || [], res.data.referShareAssetList && res.data.referShareAssetList.map(item => ({ ...item, groupType: 3 })) || []), 'referAssetId');
        this.formData.referAssetList = referKpiList
        console.log(referKpiList, 'referKpiList', res.data.referAssetList)
        this.formData.tagIdList = this.formData.tagList.map(item => item.groupId)
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
        setTimeout(() => {
          this.gotoKpiEdit(this.formData)
        }, 200);
      } else if (item.label === '提交') {
        this.saveForm()
      } else if (item.label === '重置') {
        this.citationModel = [];
        this.citationData = [];
        this.citationKpi = [];
        this.formData = Object.assign({}, this.formData, {
          kpiUnit: '',
          scale: '',
          tagIdList: [],
          tagNameList: [],
          referKpiList: [],
          referAssetList: [],
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
          kpiAdd({ ...this.formData, referAssetList, referPrivateAssetList, referShareAssetList, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }).then(res => {
            if (res.code * 1 === 0) {
              this.$message.success(res.msg)
              this.gotoKpiEdit({ ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode })
            }
          })
        } else {
          kpiUpdate({ ...this.formData, referAssetList, referPrivateAssetList, referShareAssetList, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }).then(res => {
            if (res.code * 1 === 0) {
              this.$message.success(res.msg)
              this.gotoKpiEdit({ ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode })
            }
          })
        }
      })
    },
    gotoKpiEdit({ assetCode, version }) {
      if (window.__systemConfig && window.__systemConfig.kpiEditorUrl) {
        this.$router.replace({
          path: '/asset-management/statistics-asset/kpi-asset/edit',
          query: {
            cache: true,
            url: encodeURI(window.__systemConfig.kpiEditorUrl + '?' + qs.stringify({
              embed: 1,
              state: this.$route.query.flag === 'detail' ? 3 : 2, // 1,新建 2,编辑 3,详情
              system: window.__systemConfig.sysCode,
              code: assetCode,
              version
            }))
          }
        })
      } else {
        this.$message.warning('没有获取到指标平台跳转地址，请刷新页面后重试')
      }
    },
    getAssetLabels() {
      tagTree().then((res) => {
        // 标签树
        res.data.forEach((element) => {
          if (element.childList.length) {
            element.childList.forEach((item) => {
              item.childList = null;
            });
          } else {
            element.childList = null
            element.disabled = true
          }
        });
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
.box {
  background: #fff;
  border-bottom: 24px solid #f3f4fb;
  &:last-child{
  border-bottom: 0px solid #f3f4fb;

  }
}
.header {
  display: flex;
  align-items: center;
  margin: 20px 0;
  .title {
    font-size: 14px;
    font-weight: 600;
    color: $textColor;
  }
}
.property-info {
  padding: 0 24px;
  width: 100%;
  margin-bottom: 20px;
}
.border {
  width: 4px;
  height: 14px;
  background: $primaryColor;
  margin: 0 8px 0 0px;
}
.property-table {
  margin-top: 15px;
  border-radius: 2px;
  display: flex;
  .ob-asset-tbl {
    flex: 1;
    width: 50%;
  }
  .data-asset-tbl {
    flex: 1;
    width: 50%;
    &::v-deep .c-form-item__error {
      position: absolute;
      left: 10px;
      top: 44px;
    }
  }
  .border-b-1 {
    border-bottom: 1px solid;
    border-color: #d9d9d9;
  }
  .border-r-1 {
    border-right: 1px solid;
    border-color: #d9d9d9;
  }
}
</style>
