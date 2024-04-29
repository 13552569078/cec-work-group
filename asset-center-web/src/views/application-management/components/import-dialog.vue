<template>
  <c-dialog
    :class="'dialog-center'"
    :title="'导入资源'"
    width="666px"
    :visible.sync="dialogFlag"
    append-to-body
    :before-close="cancel"
  >
    <div class="header">
      <div class="border"></div>
      <div class="title">导入资源</div>
    </div>
    <c-form
      ref="formData"
      :model="formData"
      class="cls-model-form"
      label-position="top"
      :class="isView?'disabled-new':''"
      :rules="isView?{}:rules"
      label-width="100px"
      @submit.native.prevent
    >
      <c-form-item
        label="资源包"
        prop="packFile"
      >
        <c-upload
          ref="upload-btn"
          class="upload normal-cancel-btn"
          :action="packParse"
          :name="'packFile'"
          :headers="headers"
          :on-success="(res,file)=>{return handleAvatarSuccess(res,file)}"
          :on-remove="(file)=>{return handleRemove(file)}"
          :before-upload="beforeAvatarUpload"
          :on-exceed="exLimit"
          :accept="uploadSetting.accept"
          :limit="1"
        >
          <c-button
            size="small"
            type="gradual"
          >点击上传</c-button>
          <div
            slot="tip"
            class="c-upload__tip"
          >请上传ZIP格式文件，文件大小不超过50M</div>
        </c-upload>
      </c-form-item>
      <div class="header">
        <div class="border"></div>
        <div class="title">补充基本信息</div>
      </div>

      <c-form-item
        label="资源名称"
        prop="assetName"
        class="half-form-item"
      >
        <c-input
          v-model="formData.assetName"
          size="small"
          :placeholder="isView ? '' : '请输入资源名称'"
          type="text"
          maxlength="20"
        ></c-input>
      </c-form-item>
      <c-form-item
        label=""
        prop="assetCode"
        class="half-form-item"
        style="margin-left:14px"
      >
        <template slot="label">
          <span>资源编码
            <c-tooltip
              placement="top"
              popper-class="cls-form-label-tip"
            >
              <div
                slot="content"
                v-html="AssetCodeToolTipText"
              >
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
      <c-form-item
        v-if="parseRes.subtype+''==='13'"
        label="存储名称"
        prop="storeName"
        class="half-form-item"
        style="margin-right:14px"
      >
        <template slot="label">
          <span>存储名称
            <c-tooltip
              placement="top"
              popper-class="cls-form-label-tip"
            >
              <div
                slot="content"
                v-html="'实际表名为“存储名称_版本号”'"
              >

              </div>
              <i class="cls-icon-info"></i>
            </c-tooltip>
          </span>
        </template>
        <c-input
          v-model="formData.storeName"
          size="small"
          class="form-input-item"
          maxlength="20"
          :disabled="isView || isEidt"
          placeholder="请输入存储名称"
        >
        </c-input>
      </c-form-item>
      <c-form-item
        v-if="parseRes.subtype+''==='51' ||parseRes.subtype+''==='13' "
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
          placeholder="请选择"
          clearable
        />
      </c-form-item>
      <c-form-item label="资源标签" prop="tagNameList">
        <div v-if="isView">
          <div v-if="!formData.tagNameList||!formData.tagNameList.length">{{ defaultValue }}</div>
          <ctag
            v-for="(tag,index) in formData.tagNameList"
            :key="index"
            class=" item-tag-content"
            :tag="tag.groupName"
          ></ctag>
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

      <c-form-item
        label="资源描述"
        prop="assetDesc"
        class="no-margin"
      >
        <c-input
          v-model="formData.assetDesc"
          type="textarea"
          :placeholder="isView ? '' : '请输入资源描述'"
          :disabled="isView"
          maxlength="200"
          :autosize="isView?true:false"
          show-word-limit
        >
        </c-input>
      </c-form-item>

    </c-form>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <c-button
        size="small"
        type="ordinary"
        @click="cancel"
      >取消</c-button>

      <c-button
        type="gradual"
        size="small"
        @click="confirmBtnClick"
      >确定</c-button>
    </div>
  </c-dialog>

</template>
<script>
import ctag from '@/components/tags-popover/tag'
import { tagTree } from '@/api';
import {
  assetCodeExist,
  assetNameExist,
  packImport,
  apiAssetDataCheckStoreName,
  packParse,
  getTree
} from '@/api/index';
import { checkAssetCode, checkAssetName, checkVersion, checkStoreName } from '@/utils/validate'
import { DefaultValue } from '@/config/index'
import { getToken } from '@/utils/auth'
import { getCodePrefix, getRandomCode } from '@/utils'
import { AssetCodeToolTipText } from '@/config/index'
export default {
  name: 'AssetImport',
  components: {
    ctag
  },
  props: {
    flag: [String],
    dialogFlag: {
      type: Boolean,
      default: false
    },
    appId: {
      type: [String, Number],
      default: ''
    },
    groupId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      parseRes: {
        subtype: ''
      }, // 解析包内容
      subAssNameList: [], // 关联的资源
      subAssNameList2: [], // 关联的资源
      headers: {
        token: getToken()
      },
      uploadSetting: {
        accept: '.ZIP,.zip',
        limit: 1
      },
      fileData: null, // 文件流数据
      packParse: packParse,
      defaultValue: DefaultValue,
      AssetCodeToolTipText,
      pageTopBtns: [
        {
          type: 'primary',
          disabled: false,
          label: '保存'
        }
      ],
      treeData: [],
      formData: {
        appId: this.appId,
        groupId: this.groupId,
        assetName: '',
        version: '',
        assetCode: '',
        assetCodePrefix: '',
        assetDesc: '',
        assetAliasName: '',
        tagNameList: [],
        assetType: '',
        packFile: null,
        attributeList: [],
        id: ''
      },
      span: 24,
      options: [
      ],
      rules: {
        packFile: [
          {
            required: true,
            message: '请选择资源包',
            trigger: 'blur'
          }
        ],
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
        groupId: [
          { required: true, message: '请选择场景分类', trigger: 'change' }

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
      if (this.parseRes.assetType + '' === '3') {
        this.formData.assetCode = this.formData.assetCode.replace(/[^\w]/ig, '').replace(/\b(\w)(\w*)/g, function ($0, $1, $2) { return $1.toUpperCase() + $2; })
      } else {
        this.formData.assetCode = this.formData.assetCode.replace(/[^\w]/ig, '')
      }
    },
    handleRemove(file) {
      console.log('remove')
      this.formData.packFile = null
    },
    handleAvatarSuccess(res, file) {
      if (!res.data) {
        return this.$message.warning('请导入正确的资源包')
      }
      res = res.data || {}

      this.parseRes = res
      console.log(res, '----解析包')
      this.subAssNameList = res.referAssetList && res.referAssetList.map(item => item.assetName) || []
      this.subAssNameList2 = res.referSubAssetList && res.referSubAssetList.map(item => item.assetName) || []

      this.formData.packFile = file.raw
      this.formData.assetName = res.assetName
      this.formData.assetCode = getRandomCode(res.subtype)
      this.formData.assetCodePrefix = getCodePrefix(res.subtype)
      if (this.formData.packFile) {
        this.$refs.formData.clearValidate('packFile')
      }
      this.$set(
        this.formData,
        'tagNameList',
        res.data.tagList.map((d) => d.groupName)
      );
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 50
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (!this.uploadSetting.accept.includes(testmsg)) {
        this.$message.error('请上传zip格式图片!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!')
      }
      return isLt2M
    },
    exLimit(files, fileList) {
      this.$message.warning('只能上传一个文件')
    },
    cancel() {
      this.close()
    },
    validatorStoreName(val, cb) {
      if (this.isEidt) {
        return cb()
      }
      if (!checkStoreName(val)) {
        return cb('字母开头，支持小写字母、数字和下划线，长度20')
      }
      apiAssetDataCheckStoreName({ storeName: val, id: this.$route.query.id }).then(res => {
        if (res.data) {
          cb('存储名称已经存在！')
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
    close(flag = false) {
      console.log('====', flag)
      this.$emit('close', flag)
    },
    confirmBtnClick() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          if (this.subAssNameList.length || this.subAssNameList2.length) {
            let str = ''
            if (this.subAssNameList2.length) {
              str = `<strong class="confirm-title">请确认是否导入该资源？</strong><br><p class="confirm-subtitle">${this.subAssNameList.length ? '该资源引用的<span class="num">' + this.subAssNameList.length + '</span>个资源（' + this.subAssNameList.join('、') + '）、' : ''}订阅的<span class="num">${this.subAssNameList2.length}</span>个资源（${this.subAssNameList2.join(',')}）将同步导入，使用订阅资源需在资源商城中完成资源订阅，获取授权信息`
            } else {
              str = '<strong class="confirm-title">请确认是否导入该资源？</strong><br><p class="confirm-subtitle">该资源引用的<span class="num">' + this.subAssNameList.length + '</span>个资源（' + this.subAssNameList.join('、') + '）将同步导入</p>'
            }
            this.$confirm(
              str,
              '提示',
              {
                cancelButtonText: '取消',
                confirmButtonText: '确定',
                dangerouslyUseHTMLString: true,
                type: 'warning'
              }
            )
              .then((res) => {
                this.onSave()
              })
              .catch(() => {

              })
          } else {
            this.onSave()
          }
        } else {
          console.log('check invalid');
        }
      });
    },
    onSave() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const addData = { ...this.formData, assetCode: (this.formData.assetCodePrefix || '') + this.formData.assetCode }

          const loading = this.$loading({
            lock: true,
            text: '资源导入中...',
            fullscreen: false,
            background: 'rgba(0, 0, 0, 0)'
          });
          packImport(addData)
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
  width: 48.8%;
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
.no-margin {
  margin: 0;
}
</style>
