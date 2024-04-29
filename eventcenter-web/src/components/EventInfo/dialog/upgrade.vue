
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="事件升级"
    width="466px"
    top="20vh"
    v-on="$listeners"
    @confirm="_confirm"
    @cancle="_cancle"
  >
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="handle-dialog-class"
      :rules="rules"
    >
      <el-form-item label="事件编码" required>
        <el-input v-model="eventInfo.eventCode" disabled />
      </el-form-item>
      <el-form-item label="事件标题" required>
        <el-input v-model="eventInfo.title" disabled />
      </el-form-item>
      <el-form-item label="选择升级的事件类型" prop="eventIds">
        <el-cascader v-model="form.eventIds" :props="{value:'id',label:'name'}" :options="etoptions" :show-all-levels="true" />
      </el-form-item>
      <el-form-item label="事件严重程度" prop="eventUrgent">
        <el-select v-model="form.eventUrgent" placeholder="请选择">
          <el-option
            v-for="(item, index) in eventUrgentOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="事件描述" prop="eventDesc">
        <el-input
          v-model="form.eventDesc"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
      <el-form-item
        label="事件多媒体文件"
      >
        <cestc-upload-card
          accept="video/*,image/*,audio/*"
          :media-list="form.eventMedia"
          :limit="9"
          limit-size="100"
          @fileList="_eventMedia"
        />
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import service from '@/api/eventType'
export default {
  props: {
    eventInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const checkMedia = (rule, value, callback) => {
      if (!this.form.eventMedia.length) {
        return callback(new Error('请上传多媒体'))
      } else {
        callback()
      }
    }
    return {
      form: {
        eventMedia: [],
        eventDesc: '',
        eventUrgent: '',
        eventIds: []
      },
      rules: {
        eventIds: [
          { required: true, message: '请选选择升级的事件类型', trigger: 'blur' }
        ],
        eventUrgent: [
          { required: true, message: '事件严重程度不能为空', trigger: 'blur' }
        ],
        eventDesc: [
          { required: true, message: '事件描述不能为空', trigger: 'blur' }
        ],
        eventMedia: [
          { required: true, message: '请上传处置后多媒体', trigger: 'blur' },
          { validator: checkMedia }
        ]
      },
      etoptions: []
    }
  },
  computed: {
    eventUrgentOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    }
  },
  created() {
    this.getLdzhEventTypes()
    this.form.eventUrgent = this.eventInfo?.eventUrgent || ''
    this.form.eventDesc = this.eventInfo?.eventDesc || ''
  },
  methods: {
    getLdzhEventTypes() {
      const params = { dispatchDeal: 1, busiType: 1, sourceSystemCode: 100 }
      if (this.$route.query.speType) {
        params.speType = this.$route.query.speType
      }
      service.getEventTypeselectAllTree(params).then(res => {
        this.etoptions = res.data || []
      })
    },
    // 图片上传列表
    _eventMedia(fileList) {
      // 每次修改都对 form 表单进行更新
      this.form.eventMedia = fileList
    },
    // 提交的时候，需要重组数据结构向上返回
    _confirm() {
      this.$refs.form.validate((valid) => {
        if (!valid) return
        const eventTypeObj = {}
        const eventTypeIds = this.form.eventIds
        if (eventTypeIds.length > 0) {
          eventTypeObj.eventTypeLId = eventTypeIds[0]
        }
        if (eventTypeIds.length > 1) {
          eventTypeObj.eventTypeMId = eventTypeIds[1]
        }
        if (eventTypeIds.length > 2) {
          eventTypeObj.eventTypeId = eventTypeIds[2]
        }
        if (eventTypeIds.length > 3) {
          eventTypeObj.eventTypeIdFour = eventTypeIds[3]
        }
        if (eventTypeIds.length > 4) {
          eventTypeObj.eveeventTypeIdFiventTypeId = eventTypeIds[4]
        }
        const params = {
          eventId: this.eventInfo.id,
          eventMediaList: this.form.eventMedia || [],
          eventDesc: this.form.eventDesc,
          eventUrgent: this.form.eventUrgent,
          ...eventTypeObj
        }
        this.$emit('upgrade', params)
      })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
  <style lang="scss">
  .handle-dialog-class {
    .el-form-item {
      width: 100%;
      .el-select,
      .el-date-editor {
        width: 100%;
      }
      .el-cascader{
        width: 100%;
      }
    }
  }
  </style>

