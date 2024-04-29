<template>
  <c-dialog :class="'dialog-center'" :title="'复制资源'" width="666px" :visible.sync="dialogFlag"
            append-to-body :before-close="cancel">
    <div class="header">
      <div class="border"></div>
      <div class="title">补充基本信息</div>
    </div>
    <c-form ref="formData" :model="formData" class="cls-model-form" label-position="top"
            :class="isView?'disabled-new':''" :rules="isView?{}:rules" label-width="100px"
            @submit.native.prevent>
      <c-form-item label="资源名称" prop="assetName" class="half-form-item">
        <c-input v-model="formData.assetName" size="small" :placeholder="isView ? '' : '请输入资源名称'"
                 type="text" maxlength="20"></c-input>
      </c-form-item>
      <c-form-item label="" prop="assetCode" class="half-form-item" style="margin-left:14px">
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
          :maxlength="17"
          @input="formData.assetCode = formData.assetCode.replace(/[^\w]/ig,'')"
        >
          <template slot="prepend">{{ formData.assetCodePrefix }}</template>
        </c-input>
      </c-form-item>

      <c-form-item v-if="formData.subtype+''==='13'" label="存储名称" prop="storeName"
                   class="half-form-item">
        <template slot="label">
          <span>存储名称
            <c-tooltip placement="top" popper-class="cls-form-label-tip">
              <div slot="content" v-html="'实际表名为“存储名称_版本号”'">

              </div>
              <i class="cls-icon-info"></i>
            </c-tooltip>
          </span>
        </template>
        <c-input v-model="formData.storeName" size="small" class="form-input-item" maxlength="20"
                 :disabled="isView || isEidt" placeholder="请输入存储名称">
        </c-input>
      </c-form-item>
      <c-form-item
        v-if="formData.subtype+''==='51' ||formData.subtype+''==='13' "
        label="场景分类"
        prop="groupId"
        class="half-form-item"
      >
        <c-cascader
          v-model="formData.groupId"
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
          clearable
        />
      </c-form-item>
      <c-form-item label="资源标签" prop="tagNameList">
        <div v-if="isView">
          <div v-if="!formData.tagNameList||!formData.tagNameList.length">{{ defaultValue }}</div>
          <ctag v-for="(tag,index) in formData.tagNameList" :key="index" class=" item-tag-content"
                :tag="tag.groupName"></ctag>
        </div>
        <c-select
          v-else
          v-model="formData.tagNameList"
          multiple
          filterable
          allow-create
          default-first-option
          :specific-suffix="true"
          style="width:100%"
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

      <c-form-item label="资源描述" prop="assetDesc" class="no-margin">
        <c-input v-model="formData.assetDesc" type="textarea" :placeholder="isView ? '' : '请输入资源描述'"
                 :disabled="isView" maxlength="200" :autosize="isView?true:false" show-word-limit>
        </c-input>
      </c-form-item>

    </c-form>
    <div slot="footer" class="dialog-footer">

      <c-button size="small" type="ordinary" @click="cancel">取消</c-button>

      <c-button type="gradual" size="small" @click="confirmBtnClick">确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import ctag from '@/components/tags-popover/tag'
import { tagTree } from '@/api';
import {
  assetCodeExist,
  assetNameExist,
  assetCopy,
  apiAssetDataCheckStoreName,
  assetBase,
  commonAssetCopy,
  getTree
} from '@/api/index';
import { checkAssetCode, checkAssetName, checkVersion, checkStoreName } from '@/utils/validate'
import { getCodePrefix, getRandomCode } from '@/utils'
import { DefaultValue } from '@/config/index'
import { AssetCodeToolTipText } from '@/config/index'
export default {
  name: 'AssetCopy',
  components: {
    ctag
  },
  props: {
    currId: {
      type: [String, Number],
      default: ''
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    groupId: {
      type: [String, Number],
      default: ''
    },
    appId: [String, Number],
    iscommon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flag: '',
      defaultValue: DefaultValue,
      AssetCodeToolTipText,
      pageTopBtns: [
        {
          type: 'primary',
          disabled: false,
          label: '保存'
        }
      ],
      formData: {
        groupId: '',
        assetName: '',
        version: '',
        assetCode: '',
        assetCodePrefix: '',
        assetDesc: '',
        assetAliasName: '',
        tagNameList: [],
        assetType: 3,
        attributeList: [],
        id: ''
      },
      span: 24,
      options: [
      ],
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
        assetDesc: [
          { max: 200, message: '最多输入200个字符', trigger: 'blur' }
        ],
        assetCode: [
          { required: true, message: '请输入资源编码', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorCode(val, cb)
            },
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
        assetAliasName: [
          { required: true, message: '请输入英文别名', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              if (!/^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/.test(val)) {
                return cb('请输入6-20位英文别名');
              }
              cb();
            },
            trigger: 'blur'
          }
        ],
        groupId: [
          { required: true, message: '请选择场景分类', trigger: 'change' }
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
      },
      attributeTypedata: '请输入正整数',
      topicTreeData: [],
      treeData: [],
      processLog: ''
    };
  },
  computed: {
    isView() {
      if (this.flag === 'view') {
        return true;
      }
      return false;
    },
    isEidt() {
      if (this.flag === 'edit') {
        return true;
      }
      return false;
    }
  },
  created() {
    this.getAssetLabels();
    this.getTreeList()
  },
  mounted() {
    this.seeDetails();
  },
  methods: {
    // 获取专题树
    getTreeList() {
      getTree().then(rs => {
        this.treeData = rs.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
      })
    },
    codeFirstLetterUp() {
      if (this.formData.assetType + '' === '3') {
        this.formData.assetCode = this.formData.assetCode.replace(/[^\w]/ig, '').replace(/\b(\w)(\w*)/g, function ($0, $1, $2) { return $1.toUpperCase() + $2; })
      } else {
        this.formData.assetCode = this.formData.assetCode.replace(/[^\w]/ig, '')
      }
    },
    cancel() {
      this.close()
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
    confirmBtnClick() {
      this.onSave()
    },
    showLog() {
      this.processLog = this.formData.processLog
    },
    validatorCode(val, cb) {
      if (this.isView) {
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
      if (this.isView) {
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
    close(flag = false) {
      console.log('====', flag)
      this.$emit('close', flag)
    },
    onSave() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const addData = { ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }
          console.log(addData)
          addData.groupId = addData.groupId || this.groupId
          addData.appId = this.appId
          addData.assetId = addData.id
          const loading = this.$loading({
            lock: true,
            text: '资源复制中...',
            fullscreen: false,
            background: 'rgba(0, 0, 0, 0)'
          });
          const sendFn = this.iscommon ? commonAssetCopy : assetCopy
          sendFn(addData)
            .then((res) => {
              if (res.code === 0) {
                loading.close()
                this.close(true)
              }
            })
            .catch((e) => {
              loading.close()
              console.error(e);
            });
        } else {
          console.log('check invalid');
        }
      });
    },

    // 查看详情
    seeDetails() {
      assetBase(this.currId).then((rs) => {
        if (rs.code === 0) {
          rs.data.assetCode = ''
          rs.data.storeName = ''
          this.formData = rs.data;
          this.formData.attributeList = rs.data.attributeList;

          this.$set(this.formData, 'assetCode', getRandomCode(rs.data.subtype));
          this.$set(this.formData, 'assetCodePrefix', getCodePrefix(rs.data.subtype));
          // this.$set(
          //   this.formData,
          //   'tagNameList',
          //   rs.data.tagList.map((d) => d.groupName)
          // );
        }
      });
    },
    // 标签
    getAssetLabels() {
      tagTree().then((res) => {
        // res.data.forEach((element) => {
        //   if (element.childList.length) {
        //     element.childList.forEach((item) => {
        //       item.childList = null;
        //     });
        //   } else {
        //     element.childList = null
        //     element.disabled = true
        //   }
        // });
        this.topicTreeData = res.data
      });
    }

  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.cls-model-form {
  max-height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dialog-footer {
  text-align: right;
}
.half-form-item {
  width: 48.85%;
  display: inline-block;
}
.header {
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  .border {
    width: 4px;
    height: 14px;
    background: $primaryColor;
    margin: 0 8px 0 0px;
  }
  .title {
    font-size: 14px;
    font-weight: 600;
    color: $textColor;
  }
}
.no-margin{
  margin: 0;
}
</style>
