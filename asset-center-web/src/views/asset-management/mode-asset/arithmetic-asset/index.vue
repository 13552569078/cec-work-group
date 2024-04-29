<!--
 * @Description: 模型注册，编辑，查看
 * @Author: zhangsen
 * @Date: 2020-11-12
-->
<template>
  <detail-layout :page-title="'基本信息'" :btns="pageStatus === 'detail'?[]:pageTopBtns"
                 @handleOperate="handleOperate">
    <template v-slot:content>
      <div class="box ">
        <div ref="base-info" class="form-temp-wrapper">
          <c-form ref="ruleForm" :model="formData" :class="pageStatus === 'detail'?'disabled-new':''"
                  :rules="pageStatus === 'detail'?{}:rules" label-width="105px" class="form-temp"
                  label-position="top" @submit.native.prevent>
            <div class="item-wrapper">
              <c-row :gutter="0" class="search-box">
                <c-col :span="span">
                  <c-form-item label="资源名称" prop="assetName">
                    <c-input v-model.trim="formData.assetName" :disabled="pageStatus === 'detail'"
                             class="form-input-item" maxlength="20" size="small"
                             :placeholder="pageStatus === 'detail'?'':'请输入资源名称'" />
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
                    <c-input v-model.trim="formData.assetCode" :disabled="pageStatus !== 'add'"
                             class="form-input-item" size="small" maxlength="20"
                             :placeholder="pageStatus === 'detail'?'':'请输入资源编码'"
                             @input="formData.assetCode = formData.assetCode.replace(/[^\w]/ig,'')" />
                  </c-form-item>
                </c-col>
                <c-col v-if="formData.status&&formData.status != 1" :span="span">
                  <c-form-item label="版本号" prop="version">
                    <c-input v-model.trim="formData.version" :disabled="pageStatus === 'detail'"
                             class="form-input-item" maxlength="20" size="small"
                             :placeholder="pageStatus === 'detail'?'':'请输入'" />
                  </c-form-item>
                </c-col>
                <c-col v-if="pageStatus === 'detail'" :span="span">
                  <c-form-item label="资源状态" prop="status">
                    <span slot="label">
                      <span class="lable">资源状态</span>
                      <span v-if="formData.status!=1||formData.processLog" class="log-btn"
                            @click="showLog">查看日志</span>
                    </span>
                    <span class="form-input-item">{{ formData.status|assetStatusFilter }}</span>
                  </c-form-item>
                </c-col>

                <c-col :span="span">
                  <c-form-item label="模型分类" prop="algoType">
                    <c-select v-model="formData.algoType" :specific-suffix="true" size="small"
                              :disabled="pageStatus === 'detail'" class="form-input-item"
                              :placeholder="pageStatus === 'detail'?'':'请选择'">
                      <c-option v-for="item in algoTypeOption" :key="item.label" :label="item.label"
                                :value="item.id" />
                    </c-select>
                  </c-form-item>
                </c-col>
                <c-col :span="span">
                  <c-form-item label="输入参数组数量" prop="inputCount" label-width="125px">
                    <c-select v-model="formData.inputCount" :specific-suffix="true" size="small"
                              :disabled="pageStatus === 'detail'" class="form-input-item"
                              :placeholder="pageStatus === 'detail'?'':'请选择'">
                      <c-option v-for="item in dsmNum" :key="item.label" :label="item.label"
                                :value="item.id" />
                    </c-select>
                  </c-form-item>
                </c-col>
              </c-row>
              <div v-if="pageStatus === 'detail'" ref="form-line" class="form-line"
                   :style="'width:'+lineWidth+'px'"></div>
              <c-row :gutter="0" class="search-box">
                <c-col :span="pageStatus === 'detail'?span*2:span ">

                  <c-form-item label="资源标签" prop="tagIdList">
                    <div v-if="pageStatus === 'detail'">
                      <div v-if="!formData.tagList||!formData.tagList.length">{{ defaultValue }}</div>
                      <ctag v-for="(tag,index) in formData.tagList" :key="index"
                            class="item-tag-content" :tag="tag.groupName">
                      </ctag>
                    </div>
                    <c-cascader v-else v-model="formData.tagIdList" class="form-input-item"
                                size="small" :specific-suffix="true"
                                :disabled="pageStatus === 'detail'" :show-all-levels="false"
                                :options="tagTree" :props="tagTreeProps" clearable>
                    </c-cascader>
                  </c-form-item>
                </c-col>
              </c-row>
              <c-row :gutter="0" class="search-box">
                <c-col :span="pageStatus === 'detail'?span*2:span ">

                  <c-form-item label="" prop="apiAddress">
                    <template slot="label">
                      <span>调用路径
                        <c-tooltip placement="top" popper-class="cls-form-label-tip">
                          <div slot="content">
                            请输入调用路径的绝对地址<br>例如：http://172.15.33.39/test/api
                          </div>
                          <i class="cls-icon-info"></i>
                        </c-tooltip>
                      </span>
                    </template>
                    <c-input v-model="formData.apiAddress" size="small"
                             :disabled="pageStatus === 'detail'" class="form-input-item"
                             placeholder="请输入调用路径" type="textarea" show-word-limit maxlength="150"
                             :autosize="pageStatus === 'detail'?true:false" resize="none" />
                  </c-form-item>
                </c-col>
              </c-row>
              <c-row :gutter="0" class="search-box">
                <c-col :span="pageStatus === 'detail'?span*2:span ">
                  <c-form-item label="资源描述" prop="assetDesc">
                    <c-input v-model="formData.assetDesc" size="small"
                             :disabled="pageStatus === 'detail'" class="form-input-item"
                             show-word-limit type="textarea" maxlength="200"
                             :autosize="pageStatus === 'detail'?true:false"
                             :placeholder="pageStatus === 'detail'?'':'请输入资源描述'" resize="none" />
                  </c-form-item>
                </c-col>
              </c-row>
              <c-row v-if="pageStatus === 'detail'&& formData.status !== 1" :gutter="0"
                     class="search-box">
                <c-col :span="pageStatus === 'detail'?span*2:span ">
                  <c-form-item label="版本说明" prop="versionDesc">
                    <c-input v-model="formData.versionDesc" size="small"
                             :disabled="pageStatus === 'detail'" class="form-input-item"
                             show-word-limit type="textarea" maxlength="200"
                             :autosize="pageStatus === 'detail'?true:false"
                             :placeholder="pageStatus === 'detail'?'':'请输入资源描述'" resize="none" />
                  </c-form-item>
                </c-col>
              </c-row>
              <c-row :gutter="0" class="search-box">
                <c-col :span="pageStatus === 'detail'?span*2:span ">

                  <c-form-item label="调用说明" prop="apiDescription">
                    <c-input v-model="formData.apiDescription" size="small"
                             :disabled="pageStatus === 'detail'" class="form-input-item"
                             show-word-limit type="textarea" maxlength="200"
                             :autosize="pageStatus === 'detail'?true:false"
                             :placeholder="pageStatus === 'detail'?'':'请输入调用说明'" resize="none" />
                  </c-form-item>
                </c-col>
              </c-row>
            </div>

            <c-row :gutter="0" class="search-box">
              <c-col :span="span*2">
                <c-form-item label="" class="input-output-setting">
                  <div class="parameters-setting">
                    <div class="setting-box setting-box-1">
                      <div class="box-top">
                        <div class="title">
                          输入参数设置
                        </div>
                      </div>
                      <template v-for="(val,k) in (+formData.inputCount)">
                        <input-part v-if="inputPartShow" :ref="`inputref${k}`"
                                    :key="`_inputpart_${k}`" :allparams="formData.input"
                                    :paramindex="k" :is-view="pageStatus === 'detail'"
                                    :inputcount="formData.inputCount" />
                      </template>
                    </div>
                    <output-part ref="outputref" :params="formData.output"
                                 :is-view="pageStatus === 'detail'"
                                 :inputcount="formData.inputCount" />
                  </div>
                </c-form-item>
              </c-col>
            </c-row>
          </c-form>
        </div>
      </div>
      <div v-if="pageStatus === 'detail'&& formData.status===5" class="box ">
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
      <div v-if="pageStatus === 'detail'" class="box ">
        <creator-info :form-data="formData" style="padding-top:20px"></creator-info>

        <log-dialog :log-dialog-flag="logDialogFlag" :process-log="processLog||defaultValue"
                    @close="logDialogFlag=false;processLog=''"></log-dialog>
      </div>
    </template>

  </detail-layout>
</template>
<script>
import ctag from '@/components/tags-popover/tag'
import logDialog from '@/views/asset-management/components/log-dialog.vue'
import detailLayout from '@/components/detail-layout/page-index'
import creatorInfo from '@/components/creator-info'
import $bus from '@/utils/bus'
import {
  fetchAlgoDetail,
  addAlgo,
  updateAlgo,
  existAlgoCode
} from '@/api/arithmetic-model';
import { assetCodeExist, assetNameExist, tagTree, assetReferenced } from '@/api/index'
import { DSM_NUM, ALGO_TYPE_OPTION } from './config'
import InputPart from './input-part'
import OutputPart from './output-part'
import { getAssetTypeLabel, goDetail, getCodePrefix, getRandomCode } from '@/utils'
import { mapGetters } from 'vuex'
import { checkAssetCode, checkAssetName, checkVersion } from '@/utils/validate'
import { AssetCodeToolTipText, DefaultValue } from '@/config/index'
export default {
  components: {
    InputPart,
    creatorInfo,
    OutputPart,
    detailLayout,
    ctag,
    logDialog
  },
  data() {
    return {
      AssetCodeToolTipText,
      logDialogFlag: false,
      processLog: '',
      span: 12,
      defaultValue: DefaultValue,
      lineWidth: 1000,
      pageStatus: this.$route.query.flag,
      arithmeticId: this.$route.query.id,
      tagDetailNameList: this.$route.query.flag === 'detail' && this.$route.query.tagNameList ? decodeURIComponent(this.$route.query.tagNameList).split(',') : [],
      pageTopBtns: [{
        type: 'primary',
        disabled: false,
        label: '提交'
      }, {
        type: 'default',
        disabled: false,
        label: '重置'
      }],
      formData: {
        assetName: '',
        assetCode: '',
        assetCodePrefix: '',
        subtype: 71,
        referList: [],
        tagIdList: [],
        version: '',
        algoCode: '',
        algoType: 'prediction',
        apiAddress: '',
        assetDesc: '',
        apiDescription: '',
        inputCount: '1',
        input: '',
        output: ''
      },
      rules: {
        assetCode: {
          required: true,
          // 22个数字
          validator: (rule, val, cb) => {
            if (!val) {
              cb('请输入资源编码');
            } else {
              // 不能重名
              this.validatorCode(val, cb)
            }
          },
          trigger: 'blur'
        },
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
        algoCode: {
          required: true,
          validator: (rule, val, cb) => {
            if (val.length > 20) {
              cb('最多输入20个字符');
            } else if (!val) {
              cb('请输入模型编码');
            } else if (!/^\w+$/.test(val)) {
              cb('只支持英文、数字、下划线')
            } else {
              // 不能重名
              this.validatorAlgoCode(cb)
            }
          },
          trigger: 'blur'
        },
        assetName: [
          {
            required: true,
            message: '请输入模型名称',
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
        algoType: {
          required: true,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('请选择模型分类');
            } else {
              cb()
            }
          },
          trigger: 'change'
        },
        inputCount: {
          required: true,
          validator: (rule, val, cb) => {
            if (!val) {
              cb('请选择数据源数量');
            } else {
              cb()
            }
          },
          trigger: 'change'
        },
        apiAddress: {
          required: true,
          validator: (rule, val, cb) => {
            if (val.length > 150) {
              cb('最多输入150个字符');
            } else if (!val) {
              cb('请输入调用路径');
            } else if (!/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(val)) {
              cb('只支持http(https)开头的绝对地址')
            } else {
              cb()
            }
          },
          trigger: 'blur'
        },
        assetDesc: {
          required: false,
          validator: (rule, val, cb) => {
            if (val.length > 200) {
              cb('最多输入200个字符');
            } else {
              cb()
            }
          },
          trigger: 'blur'
        },
        apiDescription: {
          required: false,
          validator: (rule, val, cb) => {
            if (val.length > 200) {
              cb('最多输入200个字符');
            } else {
              cb()
            }
          },
          trigger: 'blur'
        }
      },
      isSending: false,
      algoTypeOption: ALGO_TYPE_OPTION,
      inputAndOutpuParams: {},
      sendParams: {},
      sendFlag: {
        'true': 0,
        'false': 0
      },
      tagTree: [],
      tagTreeProps: {
        multiple: true,
        value: 'groupId',
        label: 'groupName',
        children: 'childList',
        emitPath: false
      }
    };
  },
  computed: {
    ...mapGetters(['assetsDict', 'sidebar']),
    inputPartShow() {
      if (this.pageStatus === 'add') return true;
      if (this.formData.input) return true;
      return false
    },
    pageInfo() {
      if (this.pageStatus === 'add') {
        return '新增模型'
      } else if (this.pageStatus === 'edit') {
        return '编辑模型'
      } else {
        return '查看模型'
      }
    },
    dsmNum() {
      // 计算可选多个
      if (this.formData.algoType === 'formula') {
        return DSM_NUM
      }
      this.$set(this.formData, 'inputCount', '1')
      return [DSM_NUM[0]]
    },
    validateCount() {
      const count = this.sendFlag.true + this.sendFlag.false
      return count
    }
  },
  watch: {
    'sidebar.opened'() {
      this.setLineWidth()
    }
  },
  created() {
    tagTree().then(res => {
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
      // 获取标签树
      this.tagTree = res.data
    })
    if (this.pageStatus !== 'add') {
      // 编辑状态
      this.initformData();
      if (this.pageStatus === 'detail') {
        this.rules = {}
        this.pageTopBtns = [{
          type: 'primary',
          disabled: true,
          label: '提交'
        }]
      }
    } else {
      this.formData.assetCode = getRandomCode(this.formData.subtype)
      this.formData.assetCodePrefix = getCodePrefix(this.formData.subtype)
    }
    if (this.pageStatus !== 'detail') {
      $bus.$on('parameters-setting-validate', (msg) => {
        // 监听参数设置的校验
        if (msg.flag && msg.input) {
          this.inputAndOutpuParams[msg.input.index] = msg.input
        }
        if (msg.flag && msg.output) {
          this.inputAndOutpuParams.output = msg.output
        }
        this.sendFlag[`${msg.flag}`]++;
        if (this.validateCount - this.formData.inputCount === 1) {
          // 表单校验
          this.$refs.ruleForm.validate((valid) => {
            if (!this.sendFlag.false) {
              this.sendFlag.false = 0;
              this.sendFlag.true = 0;
            } else {
              return;
            }
            if (!valid) return;
            this.sendForm()
          })
        }
      })
    }
  },
  mounted() {
    window.onresize = () => {
      this.setLineWidth()
    }
    this.setLineWidth()
  },
  beforeDestroy() {
    $bus.$off(['parameters-setting-validate'])
  },
  methods: {
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
    showLog() {
      this.processLog = this.formData.processLog
      this.logDialogFlag = true
    },
    setLineWidth() {
      if (this.$refs['base-info'] && this.$refs['base-info'].offsetWidth) {
        this.lineWidth = this.$refs['base-info'].offsetWidth - 40
      }
    },
    sendForm() {
      const input = {};
      const data = {
        assetCode: this.formData.assetCode,
        tagIdList: this.formData.tagIdList,
        version: this.formData.version,
        algoCode: this.formData.algoCode,
        assetName: this.formData.assetName,
        algoType: this.formData.algoType,
        apiAddress: this.formData.apiAddress,
        assetDesc: this.formData.assetDesc,
        apiDescription: this.formData.apiDescription,
        inputCount: this.formData.inputCount
      }
      for (let i = 0; i < +this.formData.inputCount; i++) {
        if (!this.inputAndOutpuParams[i]) return;
        input[this.inputAndOutpuParams[i].name] = this.inputAndOutpuParams[i].parmas;
      }
      if (Object.keys(input).length) {
        data.input = JSON.stringify(input);
      }
      if (this.inputAndOutpuParams.output) {
        data.output = JSON.stringify(this.inputAndOutpuParams.output)
      }
      this.sendParams = Object.assign(this.sendParams, data)
      if (!(this.sendParams.input && this.sendParams.output)) return;
      this.isSending = true
      if (this.pageStatus === 'edit') {
        // 修改
        this.sendParams.algoId = this.arithmeticId
        updateAlgo(this.sendParams).then(() => {
          this.$message.success('提交成功！');
          this.isSending = false
          // 返回上一级
          this.$router.go(-1);
        }).catch(() => {
          this.isSending = false
        })
      } else {
        // 新建
        addAlgo(this.sendParams).then(() => {
          this.$message.success('提交成功！');
          this.isSending = false
          // 返回上一级
          this.$router.go(-1);
        }).catch(() => {
          this.isSending = false
        })
      }
    },
    handleOperate(item) {
      if (this.isSending) return
      if (item.label === '提交') {
        // 执行提交, 初始化sendFlag
        this.sendFlag = {
          'true': 0,
          'false': 0
        }
        $bus.$emit('do-parameters-setting-validate')
      }
      if (item.label === '重置') {
        this.formData = Object.assign({}, this.formData, {
          tagIdList: [],
          version: '',
          algoCode: '',
          apiAddress: '',
          assetDesc: '',
          algoType: 'prediction',
          inputCount: '1',
          apiDescription: ''
        }, this.pageStatus === 'add' ? { assetCode: '', assetName: '' } : {})
        this.$nextTick(() => {
          if (this.$refs) {
            if (this.$refs.inputref0) {
              this.$refs.inputref0[0].clearContent()
            }
            if (this.$refs.outputref) {
              this.$refs.outputref.clearContent();
            }
          }
        })
      }
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
    validatorAlgoCode(cb) {
      const data = { algoCode: this.formData.algoCode }
      if (this.pageStatus === 'edit') {
        data.id = this.arithmeticId
      }
      existAlgoCode(data).then((res) => {
        if (res.data.result) {
          cb('模型编码已经存在！')
        } else {
          cb()
        }
      });
    },
    initformData() {
      // 获取详情
      fetchAlgoDetail(this.arithmeticId).then((res) => {
        const arr = []
        res.data.tagList.forEach(item => {
          arr.push(item.groupId)
        })
        res.data.tagIdList = arr
        this.formData = res.data
        if (this.pageStatus === 'detail' && this.formData.status === 5) {
          this.getReferList()
        }
        if (this.pageStatus === 'detail') {
          this.rules = {}
          Object.keys(this.formData).forEach(key => {
            if (!this.formData[key] && key !== 'version' && key !== 'processLog') this.formData[key] = this.defaultValue
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
@import '@/styles/variables.scss';

.detail-box {
  height: calc(100% - 63px);
}

.detail-box-view {
  height: 100%;
}

.form-line {
  width: 100px;
  height: 1px;
  background: #ededed;
  margin: 4px 0 20px;
}
.form-input-item {
  width: 100%;
  max-width: 600px;
}
span.form-input-item {
  color: #4b4b4b;
}
.form-temp-wrapper {
  padding: 0 20px 10px 20px;
}

.form-temp ::v-deep .c-form-item__label {
  color: #404040;
}

.item-wrapper {
  max-width: 1268px;
}
.disabled-new {
  .item-wrapper {
    max-width: 1084px;
  }
  .form-input-item.c-textarea {
    max-width: 900px !important;
  }
}

.parameters-setting {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 970px;
  border-radius: 2px;
  border: 1px solid #ededed;
  .setting-box {
    box-sizing: border-box;
    flex: 1;
    .box-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      background: #f9fafe;
      padding: 24px;
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #404040;
      }
    }
    .title-required:before {
      content: '*';
      color: #ed4931;
      margin-right: 4px;
    }
  }
  .setting-box-1 {
    border-right: 1px solid #ededed;
  }
}
.box {
  background: #fff;
  border-bottom: 20px solid #f3f4fb;
  &:last-child {
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
.input-output-setting{
  margin-bottom: 10px !important;
}
</style>
