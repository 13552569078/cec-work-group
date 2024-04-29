<!--
 * @description 草稿箱编辑弹窗
 * @date 2020-08-24
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="matchTitle"
    width="684px"
    top="10vh"
    v-on="$listeners"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      inline
      label-position="top"
      class="type-in-class"
      :disabled="dialogMode === 'view'"
    >
      <el-form-item label="事件来源" prop="eventSrcId">
        <el-select
          v-model="form.eventSrcId"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in eventSourceOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="事件类型"
        prop="eventTypeId"
      >
        <event-type-cascader
          :child-type.sync="form.eventTypeId"
          :parent-type.sync="eventTypeLId"
          :middle-type.sync="eventTypeMId"
        />
      </el-form-item>
      <el-form-item
        label="紧急程度"
        prop="eventUrgent"
      >
        <el-select
          v-model="form.eventUrgent"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in eventUrgentOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发生地址" prop="deptId" class="item-row">
        <address-cascader
          show-all-levels
          :check-strictly="false"
          :dept-id.sync="form.deptId"
        />
      </el-form-item>
      <el-form-item class="item-row" prop="eventAddress">
        <el-input
          v-model="form.eventAddress"
          placeholder="请输入详细地址"
        />
      </el-form-item>
      <el-form-item label="上报人" prop="reporterName">
        <el-input
          v-model="form.reporterName"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="reporterMobile">
        <el-input
          v-model="form.reporterMobile"
          placeholder="请输入内容"
        />
      </el-form-item>
      <el-form-item label="事件描述" prop="eventDesc" class="item-row">
        <el-input
          v-model="form.eventDesc"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="事件多媒体文件" class="item-row">
        <el-upload
          ref="imageUpload"
          :auto-upload="false"
          multiple
          accept="image/*"
          :action="uploadUrl"
          :file-list="uploadFileList"
          :on-success="imageUploadSuccess"
          :on-change="imageUploadChange"
          :on-remove="imageUploadChange"
          :on-preview="imagePreivew"
        >
          <div slot="trigger" class="upload-trigger">
            <el-button :disabled="dialogMode === 'info'" class="mr8 width-auto">
              <i class="el-icon-upload" />
              点击上传</el-button>
            <div :style="{ cursor: 'initial' }" class="upload_tips">
              图片文件不超过5Mb
            </div>
          </div>
        </el-upload>
        <el-image-viewer
          v-if="showPreview"
          class="img-view"
          :on-close="closePreview"
          :url-list="imagePreivewList"
        />
      </el-form-item>
    </el-form>
    <!-- 自定义操作按钮 -->
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button type="primary" @click.stop="_confirm('save')">保存</el-button>
      <el-button
        v-if="dialogMode === 'edit'"
        type="primary"
        @click.stop="_confirm('submit')"
      >提交</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
import eventTypeCascader from '../components/EventTypeCascader'
import addressCascader from '../components/EventAddressTypeIn'
import moduleSrv from '@/api/dispatch'
import { validPhone } from '@/utils/validate'
import ElImageViewer from 'ccxd-ux/packages/image/src/image-viewer'
import blobToDataURL from '@/utils/blobToDataURL'
import { SUCCESS_CODE } from '@/constants'
const _validPhone = (rule, value, callback) => {
  if (validPhone(value)) {
    callback()
  } else {
    callback(new Error('手机号码格式错误'))
  }
}

export default {
  name: 'TypeInDialog',
  components: {
    eventTypeCascader,
    addressCascader,
    ElImageViewer
  },
  data() {
    const valiDeptId = (rule, value, callback) => {
      if (this.form.deptId) {
        callback()
      } else {
        callback(new Error('发生地址不能为空'))
      }
    }
    return {
      form: {
        eventMediaList: [] // 必须有
      },
      eventTypeLId: '',
      eventTypeMId: '',
      rules: {
        eventSrcId: [
          { required: true, message: '事件来源不能为空', trigger: 'blur' }
        ],
        eventTypeId: [
          { required: true, message: '事件类型不能为空', trigger: 'blur' }
        ],
        eventUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '发生地址不能为空', trigger: 'blur' },
          { validator: valiDeptId, trigger: 'blur' }
        ],
        eventAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        reporterName: [
          { required: true, message: '上报人不能为空', trigger: 'blur' }
        ],
        reporterMobile: [
          { required: true, message: '联系方式不能为空', trigger: 'blur' },
          { validator: _validPhone, trigger: 'blur' }
        ],
        eventDesc: [
          { required: true, message: '事件描述不能为空', trigger: 'blur' }
        ]
      },
      deptTree: [], // 发生地点树形结构
      uploadUrl: moduleSrv.uploadUrl,
      uploadFileList: [],
      imageAdded: 0,
      btnActions: 'save', // 保存， submit--提交
      showPreview: false,
      imagePreivewList: []
    }
  },
  computed: {
    dialogMode() {
      return this.$attrs.mode || 'add'
    },
    matchTitle() {
      const key = this.dialogMode
      const obj = {
        add: '事件草稿',
        edit: '信息补充'
      }
      return obj[key]
    },

    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    eventSourceOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_origin')
    },
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    }
  },
  watch: {
    // 监听弹窗开启关闭动作，每当开启后，需要更新级联绑定数据
    '$attrs.visible': function(val) {
      if (!val) {
        this.$refs['form'].resetFields()
        this.form = {}
        this.eventTypeLId = ''
        this.eventTypeMId = ''
        this.cityId = ''
        this.areaId = ''
        this.streetId = ''
        this.communityId = ''
        this.uploadFileList = []
      } else {
        this.updateForm()
      }
    }
  },
  methods: {
    // 确认按钮触发
    _confirm(flag) {
      // 区分是保存、还是提交
      this.$refs['form'].validate((valid) => {
        const mode = this.dialogMode
        // 如果是编辑状态，把 id 添加
        if (mode === 'edit') {
          this.form.id = this.$attrs.echoData.id
        }
        if (valid) {
          this.btnActions = flag // 记录点击的动作
          // 对上传的文件进行校验
          if (
            mode !== 'add' &&
            !this.uploadFileList.find((item) => !!item.raw)
          ) {
            this.form.eventMediaList = []
            this.uploadFileList.forEach((item) => {
              this.form.eventMediaList.push({
                mediaType: item.type.includes('image') ? 'image' : item.type,
                mediaPath: item.url,
                mediaName: item.name
              })
            })
          }
          if (
            this.form.eventMediaList &&
            this.form.eventMediaList.length !== this.uploadFileList.length
          ) {
            this.uploading = true
            this.$refs.imageUpload.submit()
          } else {
            const params = { ...this.form }
            let _handle
            console.log('flag----', flag)
            if (flag === 'submit') {
              // 提交
              _handle = moduleSrv.submitDraft
            } else {
              // 保存
              _handle = moduleSrv.saveEventTraft
            }
            _handle(params).then((res) => {
              if (res.code === SUCCESS_CODE) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$emit('refresh')
              } else {
                this.$message({
                  message: res.message || '操作失败！',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    },
    // 更新级联选择数据，修复回显问题
    updateForm() {
      const editData = this.$attrs.echoData
      const mode = this.$attrs.mode
      if (mode !== 'add') {
        // 如果是编辑，需要调用详情接口，获取媒体列表
        moduleSrv.getDraftDetail(editData.id).then((res) => {
          if (res.code === SUCCESS_CODE) {
            const { tcEventMediaList = [], tcEventDraft = {}} = res.data
            // 先把之前的文件列表清除
            this.uploadFileList = []
            tcEventMediaList.forEach((item) => {
              this.uploadFileList.push({
                name: item.mediaName,
                url: item.mediaPath,
                type: item.mediaType
              })
            })
            // 把对象深拷贝到 form
            this.form = JSON.parse(JSON.stringify(tcEventDraft))
            const {
              platformSrc = '',
              eventSrcId = '',
              eventTypeId = '',
              eventUrgent = '',
              reporterName = '',
              reporterMobile = '',
              eventDesc = '',
              eventAddress = '',
              eventTypeLId,
              eventTypeMId
            } = tcEventDraft
            // cityId, // 一级 // areaId, // 二级
            // streetId, // 三级 // communityId, // 四级 / deptId, // 五级
            this.eventTypeLId = eventTypeLId
            this.eventTypeMId = eventTypeMId
            // 如果 deptId为空，则把最后一级给其赋值
            if (!this.form.deptId) {
              this.form.deptId =
                this.form.communityId ||
                this.form.streetId ||
                this.form.areaId ||
                this.cityId
            }
            this.$set(this.form, 'platformSrc', platformSrc)
            this.$set(this.form, 'eventSrcId', eventSrcId)
            this.$set(this.form, 'eventTypeId', eventTypeId)
            this.$set(this.form, 'eventAddress', eventAddress)
            this.$set(this.form, 'eventUrgent', eventUrgent)
            this.$set(this.form, 'reporterName', reporterName)
            this.$set(this.form, 'reporterMobile', reporterMobile)
            this.$set(this.form, 'eventDesc', eventDesc)
          } else {
            console.warn('getEventDetail 接口报错')
          }
        })
      }
    },
    imageUploadSuccess(response, file) {
      if (response.code !== 0 || !response.data) {
        this.$message.error(response.message || '上传失败，请稍后重试！')
        this.uploading = false
        this.$refs.imageUpload.clearFiles()
        this.form.eventMediaList = []
      } else {
        this.form.eventMediaList.push({
          mediaType: file.raw.type.includes('image') ? 'image' : file.raw.type,
          mediaPath: response.data.absolutePath,
          mediaName: file.raw.name
        })
        this._confirm(this.btnActions)
      }
    },

    imageUploadChange(file, fileList) {
      this.imageAdded = fileList.length
      if (this.dialogMode === 'edit' && !this.uploading) {
        this.form.eventMediaList = []
        fileList.forEach((item) => {
          console.log('item===', item)
          if (!item.raw) {
            this.form.eventMediaList.push({
              mediaType: item.type.includes('image') ? 'image' : item.type,
              mediaPath: item.url,
              mediaName: item.name
            })
          }
        })
      }
      this.uploadFileList = fileList
    },

    // 取消、关闭弹窗
    _cancle() {
      this.$emit('update:cancle', false)
    },
    async imagePreivew(file) {
      this.imagePreivewList = file.url
        ? [file.url]
        : [await blobToDataURL(file.raw)]
      const others = this.uploadFileList.filter(
        (item) => item.uid !== file.uid
      )
      for (let i = 0; i < others.length; i++) {
        this.imagePreivewList.push(
          others[i].url || (await blobToDataURL(others[i].raw))
        )
      }
      this.showPreview = true
    },
    closePreview() {
      this.showPreview = false
    }
  }
}
</script>
<style lang="scss" scoped>
.type-in-class {
  .el-form-item {
    width: calc(50% - 25px);
    margin-right: 24px;
    .el-cascader,
    .el-select {
      // 修复上级事件类型样式问题
      width: 100%;
    }
    &.item-row {
      width: 100%;
    }
    .upload-trigger {
      display: flex;
    }
    .upload_tips {
      cursor: initial;
      color: #bdbdbd;
    }
    .el-upload-list {
      display: flex;
    }
    ::v-deep .el-image-viewer__wrapper {
      .el-icon-circle-close {
        color: #ffffff;
      }
    }
  }
}
</style>
