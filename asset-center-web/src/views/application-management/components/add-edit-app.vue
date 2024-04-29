<!--
 * @Description:添加应用
 * @Author: pancj
 * @Date: 2021-09-13
-->

<template>
  <div class="add-app-wrap">
    <c-form ref="dataForm" :model="formData" label-width="100px" class="cls-model-form"
            label-position="top" :rules="rules" :disabled="flag === 'detail'"
            @submit.native.prevent>
      <c-form-item v-if="flag == 'import'" label="应用包" prop="packFile">
        <c-upload ref="upload-btn" :action="packParseApp" :name="'packFile'" :headers="headers"
                  :on-success="(res, file) => handleAvatarSuccess(res, file)"
                  :on-remove="(file) => handleRemove(file)" :before-upload="beforeFileUpload"
                  :on-exceed="exLimit" :accept="uploadSetting.fileAccept" :limit="1">
          <c-button size="small" type="gradual">点击上传</c-button>
          <div slot="tip" class="c-upload__tip">
            请上传ZIP格式文件，文件大小不超过50M
          </div>
        </c-upload>
      </c-form-item>
      <div class="header">
        <div class="border"></div>
        <div class="title">{{ flag == 'add'?'基本信息':'补充基本信息' }}</div>
      </div>
      <!-- deployType=1仅部署开发中心不显示 -->
      <c-form-item v-if="deployType!=1&&flag!== 'download'&&flag !== 'detail'&&flag !== 'edit'"
                   class="half-form-item w600" label="是否关联注册应用" prop="appLinke">
        <template slot="label">
          <span>
            是否关联注册应用
            <c-tooltip placement="right" popper-class="cls-form-label-tip">
              <div slot="content" class="hahah" v-html="'关联注册应用后，此应用可在资源门户中申请使用其他资源'">
              </div>
              <i class="cls-icon-info"></i>
            </c-tooltip>
          </span>
        </template>
        <c-radio-group v-model="formData.appLinke" @change="appLinkeChange">
          <c-radio :label="1">是</c-radio>
          <c-radio :label="2">否</c-radio>
        </c-radio-group>
      </c-form-item>
      <c-form-item v-if="formData.appLinke == 1" class="half-form-item w600" label="关联注册应用"
                   prop="shopCode">
        <c-select v-model="formData.shopCode" :specific-suffix="true" size="small" filterable
                  placeholder="请选择" @change="setAppData">
          <c-option v-for="(item, index) in shopDataList" :key="index" :label="item.packName"
                    :value="item.shopCode">
          </c-option>
        </c-select>
      </c-form-item>
      <c-form-item class="half-form-item w600" label="应用名称" prop="appName">
        <c-input v-model="formData.appName" size="small" maxlength="20" placeholder="请输入"
                 clearable />
      </c-form-item>
      <c-form-item :disabled="formData.appLinke == 1 || flag=='download' " class="half-form-item"
                   label="发布端" prop="appType">
        <c-checkbox-group v-model="formData.appType">
          <c-checkbox label="3">PC</c-checkbox>
          <c-checkbox label="4">H5</c-checkbox>
        </c-checkbox-group>
      </c-form-item>

      <c-form-item class="half-form-item w600" label="应用编码" prop="appCode">
        <c-input v-model="formData.appCode" size="small" maxlength="17" clearable
                 placeholder="允许字母、数字、下划线，最大长度20"
                 @input="formData.appCode = formData.appCode.replace(/[^\w]/gi, '')">
          <template slot="prepend">{{ formData.appCodePrefix }}</template>
        </c-input>

      </c-form-item>
      <c-form-item class="half-form-item" label="场景分类" prop="sceneId">
        <!-- :disabled="formData.appLinke == 1 || flag=='download' " ↓↓↓↓↓↓开发中心和商城的场景不一样了↓↓↓↓↓↓↓↓ -->
        <c-cascader v-model="formData.sceneId" style="width:296px" size="small"
                    :specific-suffix="true" :show-all-levels="false" :options="treeData"
                    class="form-input-item"
                    :props="{
                      multiple: false,
                      value: 'groupId',
                      label: 'groupName',
                      children: 'childList',
                      emitPath: false,
                      checkStrictly: true
                    }" :placeholder="flag === 'detail' ? '' : '请选择'" clearable />
      </c-form-item>
      <c-form-item label="应用标签" prop="tagNameList" class="half-form-item w600">
        <c-select
          v-model="formData.tagNameList"
          multiple
          filterable
          allow-create
          default-first-option
          :specific-suffix="true"
          placeholder="请选择">
          <c-option
            v-for="item in tagTreeData"
            :key="item.groupName"
            :label="item.groupName"
            :value="item.groupName">
          </c-option>
        </c-select>
      </c-form-item>
      <c-form-item label="应用介绍" prop="appDesc" class="w600">
        <c-input v-model="formData.appDesc" size="small"
                 :disabled="formData.appLinke == 1 || flag=='download' " resize="none"
                 type="textarea" maxlength="200" placeholder="请输入" show-word-limit :rows="3"
                 clearable />
      </c-form-item>
      <c-form-item label="应用封面" prop="appIcon">
        <div v-if="formData.appLinke!=1&&flag!='download'" class="avatar-wrap-box">
          <div v-for="(path, i) in initImgList" :key="`initImg-${i}`" class="avatar-wrap avatar"
               @click.stop="''">
            <img :src="previewUrl + path" style="object-fit: cover" class="avatar avatar-img"
                 :class="{ active: i === selectImgIndex }" />
            <c-checkbox :value="i == selectImgIndex" @change="(v)=>handlePictureSelect(i, v)" />
            <span class="cover">
              <i class="c-icon-zoom-in" @click.stop="previewAvatar(previewUrl + path)" />
            </span>
          </div>
          <div v-if="appIcon" class="avatar-wrap avatar" @click.stop="''">
            <img :src="previewUrl + appIcon" style="object-fit: cover" class="avatar avatar-img"
                 :class="{ active: 999 === selectImgIndex }"
                 @click.stop="handlePictureSelect(999)" />
            <c-checkbox :value="999 == selectImgIndex" @change="(v)=>handlePictureSelect(999, v)" />
            <span class="cover">
              <i class="c-icon-zoom-in" @click.stop="previewAvatar(previewUrl + appIcon)" />
              <i class="c-icon-delete" @click.stop="deleteAvatar" />
            </span>
          </div>
          <c-upload v-if="!appIcon" class="upload avatar-wrap normal-cancel-btn" :action="uploadUrl"
                    :on-success="handleImgSuccess" :accept="uploadSetting.accept"
                    :show-file-list="false" :before-upload="beforeAvatarUpload">
            <div class="avatar-uploader-icon">
              <i class="c-ioc-icon-upload" />
              <div class="c-upload-text">点击上传</div>
            </div>
          </c-upload>
          <div class="c-upload__tip">
            注意:图片尺寸为像素，大小不超过200KB，支持PNG、JPG、JPEG格式
          </div>
        </div>
        <div v-else class="avatar-wrap-box">
          <img v-if="appIcon" :src="previewUrl + appIcon" style="object-fit: cover"
               class="avatar avatar-img" />
        </div>
      </c-form-item>
      <c-form-item label="预览设置" class="no-margin">
        <div class="avatar-wrap-box-preview">
          <AppCord :data="demoData"></AppCord>
          <div class="right-box">
            <div class="label">封面主题色</div>
            <div class="color-box">
              <div class="color1" :class="{'active':formData.coverConfigJson.color==='#0F205A'}"
                   @click="colorChange('#0F205A')"></div>
              <div class="color2" :class="{'active':formData.coverConfigJson.color==='#4289F7'}"
                   @click="colorChange('#4289F7')"></div>
              <div class="color3" :class="{'active':formData.coverConfigJson.color==='#5C71FD'}"
                   @click="colorChange('#5C71FD')"></div>
              <div class="color4" :class="{'active':formData.coverConfigJson.color==='#FFA200'}"
                   @click="colorChange('#FFA200')"></div>
            </div>
            <div class="label">透明度</div>
            <div class="app-add">
              <c-slider v-model="formData.coverConfigJson.opacity"></c-slider>
              <div class="color-show">
                <div class="color-div"
                     :style="'background: linear-gradient(90deg, '+formData.coverConfigJson.color+' 0%, rgba(15,32,89,0) 100%);opacity:'+formData.coverConfigJson.opacity/100">
                </div>
                <div class="color-opacity">{{ formData.coverConfigJson.opacity }}%</div>
              </div>
            </div>
          </div>
        </div>

      </c-form-item>
    </c-form>
    <div slot="footer" class="dialog-footer">
      <c-button size="small" type="ordinary" @click="close">取消</c-button>
      <c-button v-if="flag == 'download'" type="ordinary" size="small" @click="lastStep">上一步
      </c-button>
      <c-button type="gradual" size="small" @click="save">确定</c-button>
    </div>
    <c-dialog :visible="!!dialogVisible" top="15vh" :before-close="handleClose">
      <img width="100%" :src="dialogVisible" alt="" />
    </c-dialog>
  </div>
</template>

<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js';
import { appTypeList } from './config.js';
import AppCord from '../components/assets-show-card.vue'
import { checkAssetCode, checkVersion, checkAssetName } from '@/utils/validate';
import {
  addAppItem,
  checkAppName,
  packAppDetail,
  checkAppCode,
  tagTree,
  packParseApp,
  importAppItem,
  getTree,
  appDetail,
  copyAppItem,
  registList
} from '@/api/index';
import { getToken } from '@/utils/auth';
import { getCodePrefix, getRandomCode } from '@/utils'
export default {
  name: 'AddEditApp',
  components: { AppCord },
  props: {
    flag: {
      type: String,
      default: 'add'
    },
    groupId: {
      type: [String, Number],
      default: ''
    },
    groupName: {
      type: String,
      default: ''
    },
    selectdata: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      deployType: window.__systemConfig && +window.__systemConfig.deployType,
      dialogVisible: '',
      tagTreeProps: {
        multiple: true,
        value: 'groupId',
        label: 'groupName',
        children: 'childList',
        emitPath: false
      },
      shopDataList: [],
      treeData: [],
      uploadUrl: getProxyUrl(serviceSuffix.file_upload) + '/fdfs/upload/',
      previewUrl: getProxyUrl(serviceSuffix.fdfs_preview_prefix) + '/',
      appTypeList,
      uploadSetting: {
        accept: '.jpeg,.jpg,.png',
        fileAccept: '.ZIP,.zip'
      },
      tagTreeData: [],
      appIcon: '',
      formData: {
        packFile: null,
        appName: '',
        appCode: getRandomCode(99),
        appCodePrefix: getCodePrefix(99),
        appType: [],
        version: '',
        sceneId: this.groupId,
        sceneName: this.groupName,
        appIcon: '',
        tagNameList: [],
        appDesc: '',
        coverConfigJson: {
          color: '#0F205A',
          opacity: 100
        }
      },

      rules: {
        packFile: [
          {
            required: true,
            message: '请选择应用包',
            trigger: 'blur'
          }
        ],
        appLinke: [
          { required: true, message: '请选择是否关联注册应用', trigger: ['blur', 'change'] }
        ],
        shopCode: [
          { required: true, message: '请选择关联注册应用', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '请输入应用名称', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              this.validatorCode(cb, 'appName');
            },
            trigger: 'blur'
          }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              if (!checkVersion(val, cb)) {
                return cb(
                  '长度不超过20字符，支持输入英文字母(含大小写)、数字、下划线、句点'
                );
              }
              cb();
              // TODO: 后期需要根据最新接口校验
              // this.validatorCode(cb, 'version')
            },
            trigger: 'blur'
          }
        ],
        appCode: [
          { required: true, message: '请输入应用编码', trigger: 'blur' },
          {
            validator: (rule, val, cb) => {
              // if (!/[A-Za-z0-9]{1,20}/.test(val)) {
              //   return cb('请输入不超过20位数字和字母的组合')
              // }
              // 不能重名
              this.validatorCode(cb, 'appCode');
            },
            trigger: 'blur'
          }
        ],
        sceneId: [
          { required: true, message: '请选择场景分类', trigger: 'change' }

        ],
        appType: [
          { required: true, message: '请选择发布端', trigger: 'change' }
        ],
        appIcon: [
          { required: true, message: '请选择应用封面', trigger: 'blur' }
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
      packParseApp,
      headers: {
        token: getToken()
      },
      selectImgIndex: 999,
      initImgList: (window.__systemConfig &&
        window.__systemConfig.appDefaultIconPath) || [],
      parseRes: null // 解析包内容
    };
  },
  computed: {
    showSupplementaryInformation() {
      return this.flag === 'import' || this.flag === 'copy';
    },
    demoData() {
      return {
        appDesc: '面向政府单位项目申报及实施管理系统…',
        appIcon: this.formData.appIcon,
        appName: '应用标题文字',
        sceneName: '生态美城',
        version: 'v3.8.2',
        coverConfigJson: JSON.stringify(this.formData.coverConfigJson)
      }
    }

  },
  watch: {
    selectImgIndex: {
      handler(nv) {
        if (nv === 999) {
          this.formData.appIcon = this.appIcon
        } else {
          this.formData.appIcon = this.initImgList[this.selectImgIndex]
        }
      },
      immediate: true
    }
  },
  created() {
    this.getTagTree();
    this.getTreeList()
    this.getShopDataList()
    console.log(this.flag, this.selectdata)
    if (this.flag === 'copy' && this.selectdata) {
      this.initData(this.selectdata.id);
    } else if (this.flag === 'download' && this.selectdata) {
      this.initDataApp(this.selectdata.referPackVersionId);
    }
  },
  methods: {
    appLinkeChange() {
      this.appIcon = ''
      this.formData.appIcon = ''
      this.selectImgIndex = undefined
      if (+this.formData.appLinke === 1 && this.formData.appName) {
        this.setAppData()
      }
    },
    setAppData() {
      // 关联注册应用
      const findOne = this.shopDataList.find(item => item.shopCode === this.formData.shopCode) || { assetSubtypeList: '', tagList: [] }
      // this.formData.appType = findOne.subtype && findOne.subtype.split(',') || []
      this.formData.appDesc = findOne.packDesc
      this.formData.appName = findOne.packName
      this.formData.shopName = findOne.packName
      this.formData.appIcon = findOne.coverImagePath
      this.appIcon = findOne.coverImagePath

      this.$nextTick(() => {
        this.$refs.dataForm.clearValidate()
      })
    },
    colorChange(color) {
      this.formData.coverConfigJson.color = color
    },
    getShopDataList() {
      // 待开发
      registList({ appStatus: 1 }).then(res => {
        this.shopDataList = res.data
      })
    },
    getTreeList() {
      getTree().then(rs => {
        this.treeData = rs.data.map((d) => ({
          ...d,
          childList: d.childList.length ? d.childList.map((dd) => ({ ...dd, childList: null, leaf: true })) : null
        }));
      })
    },
    lastStep() {
      this.$emit('laststep');
    },
    initData(id) {
      appDetail(id).then((res) => {
        const data = res.data;
        if (!data) return;
        this.setFormData(data)
      });
    },
    initDataApp(id) {
      console.log(id, '---')
      packAppDetail(id).then((res) => {
        const data = res.data;
        if (!data) return;
        this.setFormDataApp(data)
      });
    },
    setFormDataApp(data) {
      // 从下载中恢复
      this.formData.appId = data.id;
      this.formData.appName = data.packName;

      this.formData.shopCode = this.selectdata.shopCode;
      this.formData.packVersion = this.selectdata.packVersion;
      this.formData.referShopCode = data.shopCode;
      this.formData.referPackName = data.packName;
      this.formData.referPackVersionId = data.packVersionId

      // this.formData.appType = data.assetSubtype && data.assetSubtype.split(',') || []
      this.formData.sceneName = data.packSceneName;
      this.formData.appDesc = data.packDesc;
      this.formData.appIcon = data.imageList.filter(item => item.fileMark === 'cover')[0] && data.imageList.filter(item => item.fileMark === 'cover')[0].filePath;
      this.appIcon = this.formData.appIcon;
      this.formData.coverConfigJson = Object.assign({}, this.formData.coverConfigJson, JSON.parse(data.coverConfigJson))
    },
    setFormData(data) {
      // 复制中恢复
      this.formData.appId = data.id;
      this.formData.appName = data.appName;
      this.formData.appType = data.appType.map(item => item + '');
      this.formData.sceneName = data.sceneName;
      this.formData.appDesc = data.appDesc;
      this.formData.appIcon = data.appIcon;
      // this.appIcon = data.appIcon;
      this.formData.coverConfigJson = Object.assign({}, this.formData.coverConfigJson, JSON.parse(data.coverConfigJson))

      const imgIsInit = this.initImgList.findIndex(
        (d) => d === this.selectdata.appIcon
      );
      if (imgIsInit === -1) {
        this.selectImgIndex = 999;
        this.appIcon = this.selectdata.appIcon;
        this.formData.appIcon = this.selectdata.appIcon;
      } else {
        this.handlePictureSelect(imgIsInit, true)
      }
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file, '----handleAvatarSuccess');
      // 从导入恢复
      res = res.data || {};
      this.parseRes = res;
      this.formData.packFile = file.raw;
      this.formData.appName = res.appName;
      this.formData.appType = res.appType.map(item => item + '');
      if (this.formData.packFile) {
        this.$refs.dataForm.clearValidate('packFile');
      }
    },
    handleRemove(file) {
      console.log('remove');
      this.formData.packFile = null;
    },
    beforeFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 50;
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (!this.uploadSetting.fileAccept.includes(testmsg)) {
        this.$message.error('请上传zip格式文件!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 50MB!');
      }
      return isLt2M;
    },
    exLimit(files, fileList) {
      this.$message.warning('只能上传一个文件');
    },
    handleClose() {
      this.dialogVisible = false;
    },
    deleteAvatar() {
      this.selectImgIndex = this.selectImgIndex === 999 ? -1 : this.selectImgIndex;
      this.appIcon = '';
    },
    previewAvatar(path) {
      this.dialogVisible = path;
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      const isLt200K = file.size / 1024 < 201;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt200K) {
        this.$message.error('上传图片大小不能超过 200KB!');
      }
      return isLt200K;
    },
    getTagTree() {
      tagTree().then((res) => {
        if (res.code === 0) {
          this.tagTreeData = res.data;
        }
      });
    },
    validatorCode(cb, type) {
      switch (type) {
        case 'appName':
          if (!checkAssetName(this.formData.appName)) {
            return cb('允许中英文、数字、下划线及中横线，最大长度20');
          }
          checkAppName(this.formData.appName).then((res) => {
            if (res.data) {
              cb('应用名称已经存在！');
            } else {
              cb();
            }
          });
          break;
        case 'appCode':
          if (!checkAssetCode(this.formData.appCode)) {
            return cb('允许字母、数字、下划线，最大长度20');
          }
          checkAppCode(this.formData.appCode).then((res) => {
            if (res.data) {
              cb('应用编码已经存在！');
            } else {
              cb();
            }
          });
          break;
        default:
          break;
      }
    },
    save() {
      setTimeout(
        () =>
          this.$refs.dataForm.validate((valid) => {
            if (!valid) {
              return;
            }
            if (this.flag === 'import') {
              this.saveAndImport();
              return;
            }
            const sendFn = this.flag === 'copy' ? copyAppItem : addAppItem;
            if (this.flag === 'download') {
              return this.saveDownload()
            }
            const params = { ...this.formData, appType: this.formData.appType.map(item => (+item)), coverConfigJson: JSON.stringify(this.formData.coverConfigJson), appCode: this.formData.appCodePrefix + this.formData.appCode }
            sendFn(params).then((res) => {
              if (res.code * 1 === 0) {
                this.$message.success(res.msg || '操作成功');
                this.close(res.data.id || true);
              }
            });
          }),
        300
      );
    },
    saveAndImport() {
      const h = this.$createElement;
      let str = [];
      const referAssetList = this.parseRes && this.parseRes.referAssetList || []
      const referSubAssetList = this.parseRes && this.parseRes.referSubAssetList || []
      if (referAssetList.length) {
        str.push(`绑定的${referAssetList.length}个资源（${referAssetList.map((d) => d.assetName).join('、')}）`)
      }
      if (referSubAssetList.length) {
        str.push(`${referAssetList.length ? '、' : ''}订阅的${referSubAssetList.length}个资源（${referSubAssetList.map((d) => d.assetName).join('、')}）`)
      }
      if (str.length) {
        str.unshift('该应用')
        str.push('将同步导入')
      }
      if (str.length === 4) {
        str.push('，使用订阅资源需在资源商城中完成资源订阅，获取授权信息')
      }
      str = str.join('')
      const style = str
        ? 'font-size:12px;line-height:16px;margin-top:10px;'
        : '';
      this.$confirm(
        h('p', null, [
          h('p', null, '请确认是否导入该应用？'),
          h('p', { style: style }, str)
        ]),
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          confirmButtonIsLeft: false,
          iconClass: 'c-ioc-icon-warning',
          type: 'warning'
        }
      )
        .then(() => {
          const loading = this.$loading({
            lock: true,
            text: '导入中...',
            fullscreen: false,
            background: 'rgba(0, 0, 0, 0)'
          });

          importAppItem({ ...this.formData, appCode: this.formData.appCodePrefix + this.formData.appCode }).then((res) => {
            if (res.code * 1 === 0) {
              this.$message.success(res.msg || '导入成功');
              loading.close()
              this.close(res.data.id || true);
            }
          }).catch(() => {
            loading.close()
          });
        })
        .catch(() => {

        });
    },
    saveDownload() {
      this.$emit('downloadok', { ...this.formData, appCode: this.formData.appCodePrefix + this.formData.appCode });
    },
    close(needUpdate = false) {
      if (typeof needUpdate === 'object') needUpdate = false
      this.$emit('close', { id: needUpdate, appCode: this.formData.appCodePrefix + this.formData.appCode });
    },
    handleImgSuccess(res, file) {
      this.appIcon = res.data.relativePath;
      this.formData.appIcon = this.appIcon
      this.selectImgIndex = 999;
    },
    // 资源图片-选择为封面
    handlePictureSelect(index, v) {
      if (v) {
        this.selectImgIndex = index;
      } else {
        this.selectImgIndex = undefined
      }
      this.$refs.dataForm.clearValidate('appIcon')
      // this.$message.success('设置封面成功！')
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.avatar-uploader .c-upload {
  border: 1px dashed #e7e7e7;
  border-radius: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .c-upload:hover {
  border-color: #36a4ff;
}
.avatar-uploader-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 118px;
  height: 118px;
}
.avatar-uploader-icon .c-upload-text {
  color: #8a8a8a;
  font-size: 12px;
}
.avatar-uploader-icon .c-ioc-icon-upload {
  font-size: 32px;
  color: #e7e7e7;
}
.avatar-wrap {
  position: relative;
}

.avatar-wrap .cover {
  position: absolute;
  width: 118px;
  height: 118px;
  display: block;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
  z-index: 2;
  line-height: 118px;
}

.avatar-wrap .cover .c-icon-delete {
  cursor: pointer;
  margin-left: 10px;
}

.avatar-wrap .cover .c-icon-zoom-in {
  cursor: pointer;
  margin-right: 0;
}

.avatar-wrap:hover .cover {
  opacity: 1;
}

.avatar {
  width: 118px;
  height: 118px;
  display: block;
}
.add-app-wrap {
  ::v-deep .c-select {
    width: 100%;
  }
  ::v-deep .c-cascader {
    width: 100%;
  }
  .dialog-footer {
    text-align: right;
    padding-top: 32px;
  }
  .cls-model-form {
    max-height: 500px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .avatar-uploader .c-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .c-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 118px;
    height: 118px;
    border: 1px dashed #cccccc;
    text-align: center;
  }
}
.half-form-item {
  // width: 50%;
  display: inline-block;
}
.w600 {
  width: 576px !important;
  margin-right: 14px;
}
.no-margin {
  margin-bottom: 0px;
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
.icon-cover {
  margin-left: 10px;
  padding: 0 10px;
  position: relative;
  cursor: pointer;
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(~@/assets/imgs/cover1.png) no-repeat center;
    background-size: contain;
  }
}
.icon-cover.active::before {
  background: url(~@/assets/imgs/cover2.png) no-repeat center;
  background-size: contain;
}
.avatar-wrap-box {
  width: 850px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  .avatar-wrap {
    margin: 0 16px 16px 0;
  }
  // & > div {
  //   margin-right: 16px;
  //   overflow: hidden;
  //   &:nth-child(n + 5) {
  //     margin-top: 16px;
  //   }
  // }
  .normal-cancel-btn {
    height: 118px;
  }
  .avatar-img {
    border: 1px solid #e7e7e7;
    border-radius: 4px;
  }
  .c-upload__tip {
    width: 100%;
    margin-top: -12px;
  }
  ::v-deep.c-checkbox {
    line-height: 16px;
    position: absolute;
    top: 7px;
    right: 7px;
    z-index: 100;
  }
}
.avatar-wrap-box-preview {
  width: 540px;
  height: 288px;
  background: #f3f4fb;
  padding: 24px;
  display: flex;
  align-items: center;
  .right-box {
    width: 176px;
    margin-left: 20px;
    .label{
        margin-bottom: 8px;
        margin-top: 20px;
      }
    .color-box {
      display: flex;
      justify-content: space-between;

      div {
        width: 32px;
        height: 32px;
        cursor: pointer;
        border: 2px solid #ffffff;
      }
      .active{
        border-color:#36a4ff ;
      }
      .color1 {
        background: linear-gradient(
          90deg,
          #0f205a 0%,
          rgba(15, 32, 90, 0.05) 99%
        );
        position: relative;
        &::after {
          content: '';
          display: block;
          width: 20px;
          height: 20px;
          background: url(~@/assets/imgs/jian.svg);
          position: absolute;
          top: -10px;
          right: -10px;
        }
      }
      .color2 {
        background: linear-gradient(
          270deg,
          rgba(66, 137, 247, 0.14) 0%,
          rgba(66, 137, 247, 0.95) 100%
        );
      }
      .color3 {
        background: linear-gradient(
          270deg,
          rgba(16, 43, 121, 0.02) 4%,
          #5c71fd 99%
        );
      }
      .color4 {
        background: linear-gradient(
          270deg,
          rgba(227, 156, 31, 0.06) 0%,
          #ffa200 99%
        );
      }
    }
    .color-show{
      width: 71px;
      height: 30px;
      border-radius: 2px;
      opacity: 1;
      background: #FFFFFF;
      display: flex;
      justify-content: center;
      align-items: center;
      .color-div{
        width: 12px;
        height: 12px;
      }
      .color-opacity{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        font-weight: normal;
        margin-left: 8px;
        width: 32px;
      }
    }
  }
}
.app-add{
  &::v-deep{
    .c-slider__runway{
      background-color: #FFF;
    }
    .c-slider__button{
      background-color:#36A4FF;
      position: relative;
      box-shadow: 0px 0px 0px 4px rgba(0, 178, 255, 0.1);
    }
  }
}
</style>
