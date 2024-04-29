<template>
  <detail-layout :page-title="'基本信息'" :btns="pageTopBtns" @handleOperate="handOperate">
    <template #content>
      <div class="box">
        <div ref="base-info" class="base-info">
          <c-form ref="ruleForm" label-position="top" :disabled="isView"
                  :class="isView?'disabled-new':''" class="submit-form base-info-form"
                  :model="formData" :rules="rules" label-width="120px" @submit.native.prevent>
            <c-row :gutter="0" class="search-box">
              <c-col :span="span">
                <c-form-item label="资源名称" prop="assetName">
                  <c-input v-model="formData.assetName" class="form-input-item" maxlength="20"
                           size="small" :disabled="isView || isEidt" placeholder="请输入资源名称">
                  </c-input>
                </c-form-item>
              </c-col>
              <c-col :span="span">
                <c-form-item label="" prop="assetCode">
                  <template slot="label">
                    <span>资源编码
                      <c-tooltip placement="top" popper-class="cls-form-label-tip">
                        <div slot="content" v-html="AssetCodeToolTipText">

                        </div>
                        <i class="cls-icon-info"></i>
                      </c-tooltip>
                    </span>
                  </template>
                  <c-input
                    v-model="formData.assetCode"
                    :placeholder="flag === 'detail'?'':'请输入资源编码'"
                    size="small"
                    clearable
                    class="form-input-item "
                    :maxlength="flag === 'add'?17:20"
                    :disabled="flag !== 'add'"
                    @input="formData.assetCode = formData.assetCode.replace(/[^\w]/ig,'')"
                  >
                    <template v-if="flag === 'add'" slot="prepend">{{ formData.assetCodePrefix }}</template>
                  </c-input>
                </c-form-item>
              </c-col>

              <c-col v-if="isView&&formData.status !== 1||formData.status>1" :span="span">
                <c-form-item label="版本号" prop="version">
                  <c-input v-model="formData.version" :disabled="isView" class="form-input-item"
                           size="small" maxlength="20" :placeholder="isView ? '' : '请输入版本号'">
                  </c-input>
                </c-form-item>
              </c-col>
              <c-col v-if="isView" :span="span">
                <c-form-item label="资源状态" prop="version">
                  <span slot="label">
                    <span class="lable">资源状态</span>
                    <span v-if="formData.status!=1||formData.processLog" class="log-btn"
                          @click="showLog">查看日志</span>
                  </span>
                  <span class="form-input-item">{{ formData.status|assetStatusFilter }}</span>
                </c-form-item>
              </c-col>
              <c-col v-if="isView" :span="span">
                <c-form-item label="场景分类" prop="sceneName">
                  <c-input v-model="formData.sceneName" class="form-input-item" :disabled="isView"
                           size="small" :placeholder="isView ? '' : ''"></c-input>
                </c-form-item>
              </c-col>
              <c-col :span="span">
                <c-form-item label="存储名称" prop="storeName">
                  <template slot="label">
                    <span>存储名称
                      <c-tooltip placement="top" popper-class="cls-form-label-tip">
                        <div slot="content" v-html="'实际表名为“存储名称_版本号”'">

                        </div>
                        <i class="cls-icon-info"></i>
                      </c-tooltip>
                    </span>
                  </template>
                  <c-input v-model="formData.storeName" size="small" class="form-input-item"
                           maxlength="20" :disabled="isView || isEidt" placeholder="请输入存储名称">
                  </c-input>
                </c-form-item>
              </c-col>
              <c-col :span="span">
                <c-form-item label="存储类型" prop="storeType">
                  <c-select v-model="formData.storeType" :specific-suffix="true"
                            class="form-input-item" size="small" :disabled="isView || isEidt"
                            placeholder="请选择">
                    <c-option label="表(table)" value="table"></c-option>
                  </c-select>
                </c-form-item>
              </c-col>
              <c-col v-if="formData.status === 5" :span="span">
                <c-form-item label="表名" prop="storeType">
                  <span class="form-input-item">{{ formData.storeName+'_'+formData.version }}</span>
                </c-form-item>
              </c-col>
            </c-row>
            <c-row :gutter="0" class="search-box">
              <c-col :span="span ">
                <c-form-item label="引用指标资源" prop="referKpiFlag">
                  <div v-if="isView">
                    {{ formData.referKpiFlag?'是':'否' }}
                  </div>
                  <c-radio-group v-else v-model="formData.referKpiFlag">
                    <c-radio :label="true">是</c-radio>
                    <c-radio :label="false">否</c-radio>
                  </c-radio-group>
                </c-form-item>
              </c-col>
              <c-col v-if="formData.referKpiFlag" :span="span ">
                <c-form-item label="指标资源" prop="referKpi">
                  <div @click="addReferKpi">
                    <c-input v-model="formData.referKpi" class="form-input-item" size="small"
                             placeholder="点击添加" />
                  </div>
                </c-form-item>
              </c-col>
              <c-col :span="span">
                <c-form-item
                  label="场景分类"
                  prop="sceneId"
                >

                  <c-cascader
                    v-model="formData.sceneId"
                    style="width:100%"
                    size="small"
                    :specific-suffix="true"
                    :show-all-levels="false"
                    :options="treeData"
                    class="form-input-item"
                    :props="{
                      multiple: false,
                      value: 'groupId',
                      label: 'groupName',
                      children: 'childList',
                      emitPath: false,
                      checkStrictly: true
                    }"
                    :placeholder="isView ? '' : '请选择'"
                    clearable
                  />
                </c-form-item>
              </c-col>
            </c-row>
            <div v-if="isView" ref="form-line" class="form-line" :style="'width:'+lineWidth+'px'">
            </div>

            <c-row :gutter="0" class="search-box">
              <c-col :span="isView?span*2:span ">
                <c-form-item label="资源标签" prop="tag">
                  <div v-if="isView">
                    <div v-if="!assetData.tagList||!assetData.tagList.length">{{ defaultValue }}
                    </div>
                    <ctag v-for="(tag,index) in assetData.tagList" :key="index"
                          class=" item-tag-content" :tag="tag.groupName"></ctag>
                  </div>
                  <c-cascader v-else v-model="tagList" class="form-input-item" size="small"
                              :specific-suffix="true" :disabled="isView"
                              :placeholder="isView ? '' : '请选择'" :show-all-levels="false"
                              :options="tagTreeData" :props="tagTreeProps" clearable>
                  </c-cascader>
                </c-form-item>
              </c-col>
            </c-row>

            <c-row :gutter="0" class="search-box">
              <c-col :span="isView?span*2:span ">
                <c-form-item label="资源描述" prop="assetDesc">
                  <c-input v-model="formData.assetDesc" type="textarea" :rows="3" resize="none"
                           class="form-input-item c-textarea" :autosize="isView?true:false"
                           :disabled="isView" maxlength="200" show-word-limit
                           :placeholder="isView ? '' : '请输入资源描述'">
                  </c-input>
                </c-form-item>
              </c-col>
            </c-row>
            <c-row v-if="isView&&formData.status !== 1" :gutter="0" class="search-box">
              <c-col :span="isView?span*2:span ">
                <c-form-item label="版本说明" prop="versionDesc">
                  <c-input v-model="formData.versionDesc" type="textarea" :rows="3" resize="none"
                           class="form-input-item c-textarea" :autosize="isView?true:false"
                           :disabled="isView" maxlength="200" show-word-limit
                           :placeholder="isView ? '' : '请输入资源描述'">
                  </c-input>
                </c-form-item>
              </c-col>
            </c-row>

          </c-form>
        </div>
      </div>
      <div v-if="isView&& formData.status===5" class="box">
        <div class="body property-info">
          <div class="header">
            <div class="border"></div>
            <div class="title">引用管理</div>
          </div>
          <div class="property-table">
            <div class="data-asset-tbl">
              <c-form ref="ruleForm" label-position="top" :disabled="isView"
                      :class="isView?'disabled-new':''" class="submit-form base-info-form"
                      :model="formData" :rules="rules" label-width="120px" @submit.native.prevent>
                <c-row :gutter="0" class="search-box">
                  <c-col v-if="isView" :span="span*2">
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
                                :class="isView?'has-split':''"
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
      <div class="box">

        <div class="body property-info">
          <div class="header">
            <div class="border"></div>
            <div class="title">属性信息</div>
          </div>
          <div class="property-table">
            <div class="data-asset-tbl">
              <div class="property-table-header ">
                <div class="float-left">
                  <c-tabs v-model="activeTab" type="box">
                    <c-tab-pane label="结构" name="attr"></c-tab-pane>
                    <c-tab-pane label="索引" name="index"></c-tab-pane>
                  </c-tabs>
                </div>
                <div v-if="!formData.referKpiFlag||activeTab==='index'"
                     class="header-tools float-right">
                  <span v-if="!isView" class="create-btn" @click="onAdd">新建<i
                    class="cls-icon-add"></i></span>
                </div>
              </div>
              <div v-show="activeTab=='attr'">
                <c-table ref="attrTableListRef" :class="isView?'disabled-new':''"
                         :data="attributeList">
                  <c-table-column type="index" label="" width="120"></c-table-column>
                  <c-table-column label="属性" prop="attributeCode" min-width="200">
                    <template slot="header">
                      <div :class="{ 'title-required': !isView }"><label>属性</label></div>
                    </template>
                    <template slot-scope="scope">
                      <c-input v-model="scope.row.attributeCode" size="small" auto-focus
                               class="required-input"
                               :disabled="isView || !!scope.row.linkedObId||!!formData.referKpiFlag"
                               maxlength="20" @blur="onInputBlur(scope, 'attrCode')" />
                      <div v-if="scope.row.hasErrorCode" class="c-form-item__error">
                        {{ scope.row.hasErrorCode }}
                      </div>
                    </template>
                  </c-table-column>
                  <c-table-column label="属性名称" prop="attributeName" min-width="200">
                    <template slot="header">
                      <div :class="{ 'title-required': !isView }"><label>属性名称</label></div>
                    </template>
                    <template slot-scope="scope">
                      <c-input v-model="scope.row.attributeName" size="small" class="required-input"
                               maxlength="20"
                               :disabled="isView || !!scope.row.linkedObId||!!formData.referKpiFlag"
                               @blur="onInputBlur(scope, 'attrName')" />
                      <div v-if="scope.row.hasErrorName" class="c-form-item__error">
                        {{ scope.row.hasErrorName }}
                      </div>
                    </template>
                  </c-table-column>
                  <c-table-column label="属性类型" prop="attributeType" min-width="200">
                    <template slot="header">
                      <div :class="{ 'title-required': !isView }"><label>属性类型</label></div>
                    </template>
                    <template slot-scope="scope">
                      <c-select v-model="scope.row.attributeType" :specific-suffix="true"
                                size="small" class="required-input"
                                :disabled="isView || !!scope.row.linkedObId||!!formData.referKpiFlag"
                                :placeholder="isView ? '' : '请选择'"
                                @change="attrTypeSelectChange(scope, 'dataType')">
                        <c-option v-for="(item,index) in dataTypeOption" :key="index"
                                  :label="item.label" :value="item.value">
                        </c-option>
                      </c-select>
                      <div v-if="scope.row.hasErrorType" class="c-form-item__error">
                        {{ scope.row.hasErrorType }}
                      </div>
                    </template>
                  </c-table-column>
                  <c-table-column label="长度" prop="attributeLength" min-width="200">
                    <template slot="header">
                      <div :class="{ 'title-required': !isView }"><label>长度</label></div>
                    </template>
                    <template slot-scope="scope">
                      <c-input v-model="scope.row.attributeLength" size="small"
                               class="required-input" :placeholder="placeholder(scope)"
                               :disabled="isView || !!scope.row.linkedObId||!!formData.referKpiFlag"
                               @blur="onInputBlur(scope, 'length')">
                      </c-input>
                      <div v-if="scope.row.hasErrorLen" class="c-form-item__error">
                        {{ scope.row.hasErrorLen }}
                      </div>
                    </template>
                  </c-table-column>
                  <c-table-column label="允许为空" prop="fillInFlag" min-width="200">
                    <template slot-scope="scope">
                      <span v-if="isView">{{ scope.row.fillInFlag }}</span>
                      <c-checkbox v-else v-model="scope.row.fillInFlag"
                                  :disabled="isView||!!scope.row.pkFlag">
                      </c-checkbox>
                    </template>
                  </c-table-column>
                  <c-table-column label="是否主键" prop="pkFlag" min-width="200">
                    <template slot-scope="scope">
                      <span v-if="isView">{{ scope.row.pkFlag }}</span>
                      <c-checkbox v-else v-model="scope.row.pkFlag"
                                  :disabled="isView||!!scope.row.fillInFlag"
                                  @change="onCheckPK(scope.$index)">
                      </c-checkbox>
                    </template>
                  </c-table-column>
                  <c-table-column v-if="!isView&&!formData.referKpiFlag" label="操作" width="70"
                                  fixed="right">
                    <template slot-scope="scope">
                      <c-button type="text" size="small"
                                :disabled="isView || !!scope.row.linkedObId||attributeList.length<2"
                                @click="onDelProp(scope.row, scope.$index)">删除</c-button>
                    </template>
                  </c-table-column>
                </c-table>
              </div>
              <div v-show="activeTab=='index'">
                <data-asset-index :is-view="isView" :data-source="getIndexDataSource()"
                                  :index-list="indexList" :show-btn="false">
                </data-asset-index>
              </div>
            </div>
          </div>
        </div>
        <log-dialog :log-dialog-flag="logDialogFlag" :process-log="processLog||defaultValue"
                    @close="logDialogFlag=false;processLog=''"></log-dialog>
        <referkpi-dialog v-if="kpiDialogVisible" title="引用指标" checked-name="assetId"
                         tag-real-name="tagNameList" :page-data="indexDialogTable.page"
                         :table-cloumn-data="columns()" :show-list="indexDialogTable.list"
                         :init-select-arrs="indexDialogTable.selectedArr"
                         @getTableList="getDialogTableList" @saveTableList="saveIndexTableList"
                         @close="kpiDialogVisible=false" />
      </div>
      <div v-if="isView" class="box">
        <creator-info :form-data="formData" style="padding-top:20px"></creator-info>
      </div>
    </template>
  </detail-layout>
</template>
<script>
import detailLayout from '@/components/detail-layout/page-index'
import ctag from '@/components/tags-popover/tag'
import { mapGetters } from 'vuex'
import referkpiDialog from '@/components/checkbox-notree/referkpi.vue'
import creatorInfo from '@/components/creator-info'
import {
  tagTree,
  getTree,
  statsObjectDetails,
  obAsssetListApi,
  dataAssetAddApi,
  dataAssetUpdateApi,
  dataAssetViewApi,
  assetCodeExist,
  assetNameExist,
  apiAssetDataCheckStoreName,
  detailByCode,
  assetReferenced
} from '@/api/index'
import DataAssetIndex from './dataAssetIndex.vue'

import { getAssetTypeLabel, goDetail, getCodePrefix, getRandomCode } from '@/utils'
import { AssetCodeToolTipText, DefaultValue } from '@/config/index'
import { getIndexTableList } from '@/api/statistics-asset'
import { checkAssetCode, checkAssetName, checkVersion, checkStoreName, checkAttrCode } from '@/utils/validate'
import logDialog from '@/views/asset-management/components/log-dialog.vue'
export default {
  name: 'DataAssetAdd',
  components: {
    detailLayout,
    DataAssetIndex,
    ctag,
    logDialog,
    referkpiDialog,
    creatorInfo
  },
  data() {
    return {
      kpiDialogVisible: false,
      AssetCodeToolTipText,
      processLog: '',
      logDialogFlag: false,
      defaultValue: DefaultValue,
      lineWidth: 1000,
      activeTab: 'attr',
      createUserName: '',
      createTime: '',
      updateUserName: '',
      updateTime: '',
      treeData: [],
      pageTitle: '',
      indexDialogTable: {
        page: { total: 0, pageSize: 10, currPage: 1 },
        list: [],
        selectedArr: []
      },
      pageTopBtns: [{
        type: 'primary',
        label: '提交'
      },
      {
        type: 'default',
        label: '重置'
      }
      ],
      tagTreeProps: {
        multiple: true,
        value: 'groupId',
        label: 'groupName',
        children: 'childList',
        emitPath: false
      },
      obAssets: [],
      tagTreeData: [],
      tagList: [], // 选中的标签id集合
      formData: {
        assetName: '',
        referKpiFlag: true,
        // type: '',
        appId: this.$route.query.appId,
        referList: [],
        version: '',
        subtype: 13,
        assetCode: '',
        assetCodePrefix: '',
        createWay: 1,
        storeName: '',
        storeType: '',
        sceneId: '',
        sceneName: '',
        sqlInfo: '',
        isLinkObAsset: false,
        assetObjectId: '', // 关联对象资源id
        assetObjectName: '',
        assetDesc: ''
      },
      assetData: {},
      attributeList: [
        // {
        //   attributeCode: '',
        //   attributeName: '',
        //   attributeType: '',
        //   attributeLength: '',
        //   linkedObId: '',
        //   assetObjectAttributeId: '',
        //   fillInFlag: 0, // 是否必填
        //   defaultValue: '',
        //   pkFlag: 0 // 是否主键标识
        // }
      ],
      span: 12,
      indexList: [],
      linkedObAttrData: [],
      linkedObAssetData: null,
      rules: {
        assetName: [
          {
            required: true,
            message: '请输入资源名称',
            trigger: 'blur'
          },
          { max: 20, message: '最多20个字符', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorName(val, cb)
            },
            trigger: 'blur'
          }
        ],
        sceneId: [
          { required: true, message: '请选择场景分类', trigger: 'change' }

        ],
        assetDesc: [
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        assetCode: [
          {
            required: true,
            message: '请输入资源编码',
            trigger: 'blur'
          },
          {
            validator: (rule, val, cb) => {
              this.validatorCode(val, cb)
            },
            trigger: 'blur'
          }
        ],
        referKpiFlag: [
          {
            required: true,
            message: '请选择是否引用指标',
            trigger: 'blur'
          }
        ],
        referKpi: [
          {
            required: true,
            message: '请选择指标资源',
            trigger: 'blur'
          },
          {
            required: true,
            message: '请选择指标资源',
            trigger: 'change'
          }
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
        sqlInfo: [
          {
            required: true,
            message: '请输入sql语句',
            trigger: 'blur'
          }
        ],
        storeName: [
          {
            required: true,
            message: '请输入存储名称',
            trigger: 'blur'
          },
          {
            validator: (rule, val, cb) => {
              this.validatorStoreName(val, cb)
            },
            trigger: 'blur'
          },
          { max: 20, message: '最多20个字符', trigger: 'blur' }
        ],
        storeType: [
          {
            required: true,
            message: '请选择存储类型',
            trigger: 'change'
          }
        ],
        assetObjectId: [
          {
            required: true,
            message: '请选择对象资源',
            trigger: 'change'
          }
        ]
      },

      dataTypeOption: [
        {
          label: 'varchar',
          value: 'varchar'
        },
        {
          label: 'int',
          value: 'int'
        },
        {
          label: 'bigint',
          value: 'bigint'
        },
        {
          label: 'tinyint',
          value: 'tinyint'
        },
        {
          label: 'smallint',
          value: 'smallint'
        },
        {
          label: 'mediumint',
          value: 'mediumint'
        },
        {
          label: 'float',
          value: 'float'
        },
        {
          label: 'double',
          value: 'double'
        },
        {
          label: 'decimal',
          value: 'decimal'
        },
        {
          label: 'date',
          value: 'date'
        },
        {
          label: 'datetime',
          value: 'datetime'
        }
      ],
      tableTitle: [
        {
          label: '',
          prop: 'index'
        },
        {
          label: '属性',
          prop: 'attributeCode'
        },
        {
          label: '属性名称',
          prop: 'attributeName'
        },
        {
          label: '属性类型',
          prop: 'attributeType'
        },
        {
          label: '长度',
          prop: 'attributeLength'
        },
        {
          label: '允许为空',
          prop: 'fillInFlag'
        },
        {
          label: '是否主键',
          prop: 'pkFlag'
        }
      ]
    }
  },
  computed: {
    isView() {
      return this.$route.query.flag === 'detail'
    },
    isEidt() {
      return this.$route.query.flag === 'edit'
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
          },
          {
            lable: '资源描述',
            prop: 'assetDesc'
          }
        ]
      }
    }

  },
  watch: {
    attributeList(val) {
      this.handleIndexData()
    },
    'sidebar.opened'() {
      this.setLineWidth()
    },
    'formData.referKpiFlag'() {
      console.log('==--=')
      this.attributeList = [{
        assetObjectAttributeId: '',
        linkedObId: '',
        attributeCode: '',
        attributeName: '',
        attributeType: '',
        attributeLength: '',
        fillInFlag: false,
        pkFlag: false,
        hasErrorName: false,
        hasErrorCode: false
      }]
      this.formData.referKpiId = ''
      this.formData.referKpiCode = ''
      this.formData.referKpiName = ''
      this.formData.referKpiVersion = ''
      this.formData.referKpi = ''
    }
  },
  created() {
    this.getTagTree()
    this.getObAssetList()
    this.getTreeList()

    if (this.isView || this.isEidt) {
      dataAssetViewApi(this.$route.query.id).then(res => {
        if (res.code === 0) {
          res.data.referKpiFlag = !!res.data.referKpiCode

          this.assetData = res.data
          if (this.isView) {
            this.rules = {}
            Object.keys(this.assetData).forEach(key => {
              if (!this.assetData[key] && key !== 'referKpiFlag' && key !== 'version' && key !== 'processLog') this.assetData[key] = this.defaultValue
            })
          }
          // 数据填充
          this.handleDetail()
        }
      }).catch(e => {
        console.error(e)
      })
    } else {
      this.formData.assetCode = getRandomCode(this.formData.subtype)
      this.formData.assetCodePrefix = getCodePrefix(this.formData.subtype)
    }
    if (this.isView) {
      this.pageTopBtns = []
      this.pageTitle = '查看数据资源'
    } else if (this.isEidt) {
      this.pageTitle = '编辑数据资源'
    } else {
      this.pageTitle = '新增数据资源'
      this.attributeList.push({
        assetObjectAttributeId: '',
        linkedObId: '',
        attributeCode: '',
        attributeName: '',
        attributeType: '',
        attributeLength: '',
        fillInFlag: false,
        pkFlag: false,
        hasErrorName: false,
        hasErrorCode: false
      })
    }
  },
  mounted() {
    window.onresize = () => {
      this.setLineWidth()
    }
    this.setLineWidth()
  },
  methods: {
    getTreeList() {
      getTree().then(rs => {
        this.treeData = rs.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
      })
    },
    goDetail(row) {
      goDetail(row)
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
    saveIndexTableList(list) {
      const referKpi = list[0] || {}
      this.$set(this.formData, 'referKpi', referKpi.assetName ? referKpi.assetName + referKpi.version : '')
      this.formData.referKpiId = referKpi.assetId
      this.formData.referKpiCode = referKpi.assetCode
      this.formData.referKpiName = referKpi.assetName
      this.formData.referKpiVersion = referKpi.version
      this.indexDialogTable.selectedArr = list
      if (referKpi.assetCode) { this.getKpiInfo(referKpi.assetCode, referKpi.version) }
    },
    getKpiInfo(code, version) {
      detailByCode({ code, version }).then(res => {
        // [{\"name\":\"区域名称\",\"code\":\"regionName\",\"type\":\"varchar\",\"unit\":\"--\",\"length\":\"20\"},{\"name\":\"用户ID\",\"code\":\"userId\",\"type\":\"int\",\"unit\":\"--\",\"length\":11},{\"name\":\"事件数\",\"code\":\"eventCount\",\"type\":\"bigint\",\"unit\":\"--\",\"length\":20},{\"name\":\"最近上报时间\",\"code\":\"lastReportTime\",\"type\":\"datetime\",\"unit\":\"--\",\"length\":\"\"}]
        const outputParam = res.data.outputParam ? JSON.parse(res.data.outputParam) : [{
          name: 'kpi_collect_value',
          code: 'kpi_collect_value',
          length: '40',
          type: 'varchar'
        }]
        this.attributeList = outputParam.map(item => {
          return {
            assetObjectAttributeId: '',
            linkedObId: '',
            attributeCode: item.code && item.code.toLowerCase(),
            attributeName: item.name && item.name.toLowerCase(),
            attributeType: item.type,
            attributeLength: item.length,
            fillInFlag: false,
            pkFlag: false,
            hasErrorName: false,
            hasErrorCode: false
          }
        })
      })
    },
    getDialogTableList(params) {
      const realParams = Object.assign({}, params, this.$route.query.flag === 'add' ? {} : { assetId: this.$route.query.id * 1, filterAssetCode: this.formData.assetCode }, { flag: 1 })
      getIndexTableList(realParams).then(res => {
        this.indexDialogTable.list = res.data.list.map(item => {
          return item
        })
        this.indexDialogTable.page = {
          total: res.data.total,
          pageSize: res.data.pageSize,
          currPage: res.data.currPage
        }
      })
    },
    addReferKpi() {
      if (this.isView) return
      this.indexDialogTable.selectedArr = this.formData.referKpiId ? [{
        assetId: this.formData.referKpiId,
        assetCode: this.formData.referKpiCode,
        assetName: this.formData.referKpiName,
        version: this.formData.referKpiVersion
      }] : []
      this.kpiDialogVisible = true
    },
    showLog() {
      this.processLog = this.formData.processLog
      this.logDialogFlag = true
    },
    setLineWidth() {
      this.lineWidth = this.$refs['base-info'].offsetWidth - 40
    },
    validatorStoreName(val, cb) {
      if (this.isEidt) {
        return cb()
      }
      if (!checkStoreName(val)) {
        return cb('以字母开头，支持数字、小写字母和下划线，禁止两下划线中间只出现数字，最大长度20')
      }
      apiAssetDataCheckStoreName({ storeName: val, id: this.$route.query.id }).then(res => {
        if (res.data) {
          cb('存储名称已经存在！')
        } else {
          cb()
        }
      })
    },
    validatorCode(val, cb) {
      if (this.pageTitle !== '新增数据') {
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
      if (this.pageTitle !== '新增数据') {
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
    getTagTree() {
      tagTree().then(res => {
        if (res.code === 0) {
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
          this.tagTreeData = res.data
        }
      })
    },
    getObAssetList(assetName) {
      obAsssetListApi({
        assetName: assetName
      }).then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            this.obAssets.push({
              label: item.assetName,
              value: item.id
            })
          })
        }
      }).catch(e => {
        console.error('get obAsset failed')
      })
    },
    // 新增页面数据场景
    handleObAssetData() {
      let i = this.attributeList.length
      while (i--) {
        const attr = this.attributeList[i]
        if (attr.linkedObId && attr.linkedObId !== this.linkedObAssetData.id) {
          this.attributeList.splice(i, 1)
        }
      }
    },
    // 编辑页面场景
    handleEidtCase() {

    },
    // 组装数据
    assembleData() {
      for (let i = this.linkedObAttrData.length - 1; i >= 0; i--) {
        this.attributeList.unshift({
          linkedObId: this.linkedObAssetData.id,
          ...this.linkedObAttrData[i],
          assetObjectAttributeId: this.linkedObAttrData[i].attributeId
        })
      }
    },
    // 准备数据
    prepareData(data) {
      data.attributeList.forEach(ob => {
        ob.fillInFlag = false
        ob.pkFlag = false
      })
      this.linkedObAssetData = data
      this.linkedObAttrData = data.attributeList
    },
    onObAssetChange(id) {
      statsObjectDetails(id).then(res => {
        if (res.code === 0) {
          this.prepareData(res.data)
          this.handleObAssetData()
          this.assembleData()
        }
      }).catch(e => {
        console.error(e)
      })
    },
    getIndexDataSource() {
      return this.attributeList.filter(field => {
        return field.attributeCode && field.attributeName
      })
    },
    isLinkAssetChange(isLink) {
      if (!isLink) {
        this.formData.assetObjectId = ''
        if (this.linkedObAssetData && this.linkedObAssetData.id) {
          this.linkedObAssetData.id = ''
          this.handleObAssetData()
          this.linkedObAssetData = null
        }
      }
    },
    handleIndexData() {
      if (this.attributeList.length > 0 && this.indexList.length > 0) {
        let i = this.indexList.length
        while (i--) {
          const item = this.indexList[i]
          if (item.indexFields.length === 1) {
            // 单选场景
            const isExist = this.attributeList.some(attr => {
              return attr.attributeCode === item.indexFields[0]
            })
            if (!isExist) {
              this.indexList.splice(i, 1)
            }
          } else {
            // 多选场景
            let count = 0
            item.indexFields.forEach(field => {
              const isInclude = this.attributeList.some(attr => {
                return attr.attributeCode === field
              })
              if (isInclude) {
                count++
              }
            })
            console.log('count: ', count)
            if (count === 0) {
              if (!item.indexName && !item.indexType) { this.indexList.splice(i, 1) }
            } else {
              let j = item.indexFields.length
              while (j--) {
                const field = item.indexFields[j]
                const isExist = this.attributeList.some(attr => {
                  return attr.attributeCode === field
                })
                if (!isExist) {
                  item.indexFields.splice(j, 1)
                }
              }
            }
          }
        }
      } else {
        this.indexList = []
      }
    },
    addAttrData() {
      this.attributeList.push({
        assetObjectAttributeId: '',
        linkedObId: '',
        attributeCode: '',
        attributeName: '',
        attributeType: '',
        attributeLength: '',
        fillInFlag: false,
        pkFlag: false,
        hasErrorName: false,
        hasErrorCode: false
      })
    },
    addIndexData() {
      this.indexList.push({
        indexType: '',
        indexName: '',
        // indexField: '',
        indexFields: []
      })
    },
    onAdd() {
      if (this.activeTab === 'attr') {
        this.addAttrData()
      } else {
        this.addIndexData()
      }
    },
    getAttributeList() {
      this.attributeList.forEach(item => {
        if (item.fillInFlag) {
          item.fillInFlag = 1
        } else {
          item.fillInFlag = 0
        }
        if (item.pkFlag) {
          item.pkFlag = 1
        } else {
          item.pkFlag = 0
        }
        // item.attributeLength = Number(item.attributeLength)
      })
      return this.attributeList
    },
    getParams() {
      const params = {
        ...this.formData,
        attributeList: this.getAttributeList(),
        indexList: this.indexList,
        tagIdList: this.tagList
      }
      if (this.isEidt) {
        params.id = this.assetData.id
      }
      return params
    },
    handOperate(msg) {
      if (msg.label === '重置') {
        this.formData = Object.assign({}, this.formData, {
          assetName: '',
          version: '',
          createWay: 1,
          sceneName: '',
          sqlInfo: '',
          isLinkObAsset: false,
          assetObjectId: '', // 关联对象资源id
          assetObjectName: '',
          referKpi: '',
          referKpiFlag: true,
          assetDesc: ''
        }, this.isEidt ? {} : { assetCode: '', storeName: '', storeType: '' })
        this.formData.referKpiId = ''
        this.formData.referKpiCode = ''
        this.formData.referKpiName = ''
        this.formData.referKpiVersion = ''
        this.assetData.tagIdList = []
        this.tagList = []
        this.attributeList = [{
          assetObjectAttributeId: '',
          linkedObId: '',
          attributeCode: '',
          attributeName: '',
          attributeType: '',
          attributeLength: '',
          fillInFlag: false,
          pkFlag: false,
          hasErrorName: false,
          hasErrorCode: false
        }]
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate()
        })
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.checkTableValid()
          this.checkIndexValid()
          if (this.isTableDataValid() && this.isIndexDataValid()) {
            if (this.isEidt) {
              dataAssetUpdateApi(this.getParams()).then(res => {
                if (res.code === 0) {
                  this.$message.success('更新成功');
                  this.$router.back()
                }
              }).catch(e => {
                console.error(e)
              })
            } else {
              dataAssetAddApi(this.getParams()).then(res => {
                if (res.code === 0) {
                  this.$message.success('保存成功');
                  // this.$router.push('/asset-management/data-asset')
                  this.$router.back()
                }
              }).catch(e => {
                console.error(e)
              })
            }
          }
        }
      })
    },
    onDelProp(row, index) {
      this.attributeList.splice(index, 1)
    },
    attrTypeSelectChange(scope, colName) {
      this.checkDataType(scope.row)
    },
    placeholder(scope) {
      const type = scope.row.attributeType
      if (type) {
        return this.getTextByType(type)
      } else {
        return '请输入长度'
      }
    },
    getTextByType(type) {
      const map = {
        float: '例:6,2',
        double: '例:6,2',
        decimal: '例:6,2',
        varchar: '请输入1~5000整数',
        int: '请输入不能大于11的正整数',
        bigint: '请输入不能大于20的正整数',
        tinyint: '请输入不能大于4的正整数',
        smallint: '请输入不能大于6的正整数',
        mediumint: '请输入不能大于9的正整数',
        date: '不需要填写长度',
        datetime: '不需要填写长度'
      }
      return map[type]
    },
    onCheckPK(index) {
      const checked = this.attributeList.filter(a => a.pkFlag)
      if (checked.length >= 2) {
        this.$message.error('最多有一个主键')
        this.attributeList[index].pkFlag = false
      }
    },
    checkName(row, flag) {
      console.log(row, 'dddd')
      if (!row.attributeName || row.attributeName.trim() === '') {
        this.$set(row, 'hasErrorName', '请输入属性名称')
      } else if (row.attributeName.length > 20) {
        this.$set(row, 'hasErrorName', '最多输入20个字符')
      } else {
        if (!flag) { this.$set(row, 'hasErrorName', false) }
      }
    },
    checkCode(row, row_index, flag) {
      if (!row.attributeCode || row.attributeCode.trim() === '') {
        this.$set(row, 'hasErrorCode', '请输入属性')
      } else if (!checkAttrCode(row.attributeCode)) {
        this.$set(row, 'hasErrorCode', '最多20字符，小写字母（开头）、数字及下划线')
      } else if (row.attributeCode.length > 20) {
        this.$set(row, 'hasErrorCode', '最多输入20个字符')
      } else if (this.attributeList.some((item, index) => {
        console.log(index !== row_index && !!item.attributeCode && item.attributeCode === row.attributeCode, 'ddd')
        return (index !== row_index && !!item.attributeCode && item.attributeCode === row.attributeCode)
      })) {
        this.$set(row, 'hasErrorCode', '属性不能重复')
      } else {
        if (!flag) { this.$set(row, 'hasErrorCode', false) }
      }
    },

    checkDataType(row, flag) {
      if (!row.attributeType || row.attributeType.trim() === '') {
        this.$set(row, 'hasErrorType', '请选择属性类型')
      } else {
        if (!flag) { this.$set(row, 'hasErrorType', '') }
      }
    },
    // 校验长度
    validateLength(type, lengthVal) {
      let errmsg
      // 时间类型 长度不需要填写
      if (!(type === 'date' || type === 'datetime') && !lengthVal) {
        return `${type}类型长度必填`
      }
      switch (type) {
        // 字符串类型
        case 'varchar':
          errmsg = lengthVal > 5000 ? '请输入1~5000整数' : errmsg
          errmsg = !/^[1-9]\d*$/.test(lengthVal) ? '请输入1~5000整数' : errmsg
          break
        // 整数类型
        case 'int':
          errmsg = !/^[1-9]\d*$/.test(lengthVal) ? 'int类型长度必须为正整数' : ''
          errmsg = lengthVal > 11 ? 'int类型长度不能大于11！' : errmsg
          break
        case 'bigint':
          errmsg = !/^[1-9]\d*$/.test(lengthVal) ? 'bigint类型长度必须为正整数' : ''
          errmsg = lengthVal > 20 ? 'bigint类型长度不能大于20！' : errmsg
          break
        case 'tinyint':
          errmsg = !/^[1-9]\d*$/.test(lengthVal) ? 'tinyint类型长度必须为正整数' : ''
          errmsg = lengthVal > 4 ? 'tinyint类型长度不能大于4！' : errmsg
          break
        case 'smallint':
          errmsg = !/^[1-9]\d*$/.test(lengthVal) ? 'smallint类型长度必须为正整数' : ''
          errmsg = lengthVal > 6 ? 'smallint类型长度不能大于6！' : errmsg
          break
        case 'mediumint':
          errmsg = !/^[1-9]\d*$/.test(lengthVal) ? 'mediumint类型长度必须为正整数' : ''
          errmsg = lengthVal > 9 ? 'mediumint类型长度不能大于9！' : errmsg
          break
        // 浮点数类型
        case 'float':
        case 'double':
        case 'decimal':
          // eslint-disable-next-line no-case-declarations
          const [num1, num2] = lengthVal.split(',')
          if (
            lengthVal.indexOf(',') < 0 ||
            lengthVal.indexOf(',') !== lengthVal.lastIndexOf(',') ||
            lengthVal.length < 3 ||
            isNaN(+num1) ||
            isNaN(+num2) ||
            +num1 === 0 ||
            +num2 === 0 ||
            +num2 > +num1 ||
            Number(num1) < 1 ||
            Number(num1) <= Number(num2) ||
            !/^[1-9]\d*$/.test(lengthVal.replace(',', ''))
          ) {
            return '格式如6,2，最大长度65，最大小数位30'
          }
          if (Number(num1) > 65) {
            return '长度格式逗号前1-65的整数'
          }
          if (Number(num2) > 30) {
            return '长度格式逗号后0-30的整数'
          }
          break
        default: break
      }
      return errmsg
    },
    checkLen(row, flag) {
      const res = this.validateLength(row.attributeType, row.attributeLength)
      if (res) {
        return this.$set(row, 'hasErrorLen', res)
      } else {
        if (!flag) { return this.$set(row, 'hasErrorLen', false) }
      }
    },
    checkTableValid() {
      console.log('dddds')
      this.attributeList.forEach((row, index) => {
        this.checkName(row, true)
        this.checkCode(row, index, true)
        this.checkDataType(row, true)
        this.checkLen(row, true)
      })
    },
    checkIndexValid() {
      this.indexList.forEach((row, row_index) => {
        if (!row.indexType) {
          this.$set(row, 'hasErrorType', '请选择索引类型')
        } else {
          this.$set(row, 'hasErrorType', '')
        }

        if (!row.indexFields || row.indexFields.length === 0) {
          this.$set(row, 'hasErrorFields', '请选择索引字段')
        } else {
          this.$set(row, 'hasErrorFields', '')
        }

        if (!row.indexName) {
          this.$set(row, 'hasErrorName', '请输入索引名称')
        } else if (this.indexList.some((item, index) => {
          return (index !== row_index && !!item.indexName && item.indexName === row.indexName)
        })) {
          this.$set(row, 'hasErrorName', '索引名称不能重复')
        } else {
          this.$set(row, 'hasErrorName', '')
        }
      })
    },
    isTableDataValid() {
      const valid = !this.attributeList.some(item => item.hasErrorCode || item.hasErrorName || item.hasErrorLen || item.hasErrorType || item.hasErrorIntFormat || item.hasErrorFloatFormat)
      return valid
    },
    isIndexDataValid() {
      const valid = !this.indexList.some(item => item.hasErrorType || item.hasErrorFields || item.hasErrorName)
      return valid
    },

    handleDetail() {
      if (this.isView) {
        this.createUserName = this.assetData.createUserName
        this.createTime = this.assetData.createTime
        this.updateUserName = this.assetData.updateUserName
        this.updateTime = this.assetData.updateTime
      }
      this.formData.referKpiFlag = this.assetData.referKpiFlag
      this.$nextTick(() => {
        this.formData = { ...this.assetData }
        if (this.isView && this.formData.status === 5) {
          this.getReferList()
        }
        this.formData.isLinkObAsset = !!this.assetData.assetObjectId
        this.$set(this.formData, 'referKpi', this.assetData.referKpiName + (this.assetData.referKpiVersion || ''))

        this.tagList = this.assetData.tagList.map(tag => tag.groupId)
        this.indexList = this.assetData.indexList
        this.attributeList = this.assetData.attributeList
        this.attributeList.forEach(item => {
          item.fillInFlag = !!item.fillInFlag
          item.pkFlag = !!item.pkFlag
          item.linkedObId = item.assetObjectAttributeId ? this.formData.assetObjectId : ''
        })
      })

      if (this.assetData.assetObjectId) {
        const arr = this.obAssets.filter(ob => ob.value === this.assetData.assetObjectId)
        if (arr && arr.length > 0) {
          this.formData.assetObjectName = arr[0].label
        }
        this.linkedObAssetData = {
          id: this.assetData.assetObjectId,
          attributeList: this.assetData.objectAttributeList
        }
        this.linkedObAttrData = this.linkedObAssetData.attributeList
      }
    },
    isFloat(type) {
      return type === 'float' || type === 'double' || type === 'decimal'
    },
    onInputBlur(scope, colName) {
      console.log(scope, colName, 'dddddd')
      if (colName === 'attrCode') {
        this.checkCode(scope.row, scope.$index)
      } else if (colName === 'attrName') {
        this.checkName(scope.row)
      } else if (colName === 'length') {
        this.checkLen(scope.row)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.form-line {
  width: 100px;
  height: 1px;
  background: #ededed;
  margin: 4px 0 20px;
}
.disabled-new {
  .form-input-item.c-textarea {
    max-width: 900px !important;
  }
}
span.form-input-item {
  color: $textColor;
}
.form-input-item {
  max-width: 600px;
}
.box {
  background: #fff;
  border-bottom: 24px solid #f3f4fb;
  &:last-child {
    border-bottom: 0px;
  }
}

.base-info {
  padding: 0 20px;
  &::v-deep .c-input,
  .c-select,
  .c-cascader {
    width: 100%;
  }
  .base-info-form {
    max-width: 1268px;
  }
  .disabled-new {
    max-width: 1084px !important;
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
.property-table-header {
  padding: 0px 20px 8px 0;
  .float-left {
    float: left;
    width: 400px;
  }
  .float-right {
    float: right;
  }
  &::after {
    display: block;
    content: ' ';
    clear: both;
  }
}
.header-text {
  height: 42px;
  line-height: 42px;
  margin-right: 16px;
}
.header-tools {
  margin-left: auto;
  i {
    margin-right: 4px;
  }
  .header-btn {
    margin-right: 20px;
  }
}
.title-required:before {
  content: '*';
  color: #ed4931;
  margin-right: 4px;
}
.create-btn {
  padding-top: 18px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  color: $textColor;
  .cls-icon-add {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin-left: 6px;
    background-image: url('~@/assets/imgs/icon-add.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    vertical-align: middle;
  }
  &:hover {
    color: $primaryColor;
    .cls-icon-add {
      background-image: url('~@/assets/imgs/icon-add-hover.png');
    }
  }
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
</style>
