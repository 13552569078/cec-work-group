<!--
 * @description 待办任务-新增任务
 * @date 2020-11-18
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="新增任务"
    width="682px"
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
      class="type-in-class"
      :rules="rules"
    >
      <el-form-item label="计划名称" prop="taskName">
        <el-input v-model="form.taskName" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="发布范围" prop="range">
        <!-- 父子不关联-checkStrictly， -->
        <cestc-cascader
          v-model="selectedMap"
          :options="rangeMap"
          :show-all-levels="false"
          collapse-tags
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'name',
            multiple: true,
          }"
        />
      </el-form-item>
      <el-form-item label="执行人类型" prop="userType" class="form-item-two">
        <el-select v-model="form.userType" placeholder="请选择">
          <el-option
            v-for="(item, index) in eventPlatformOptions"
            :key="item.id || index"
            :label="item.dictDesc"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="起止时间" prop="dateRange" class="form-item-two">
        <cestc-date-picker v-model="dateRange" type="daterange" clearable />
      </el-form-item>
      <el-form-item label="任务描述" prop="taskDesc">
        <el-input
          v-model="form.taskDesc"
          type="textarea"
          maxlength="1000"
          :rows="5"
          placeholder="请输入内容"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="附件" prop="planTaskMediaList">
        <cestc-upload accept=".doc,.xlsx, .xls" @eventMedia="updateEventMedia">
          <span slot="tips">请上传word或excel格式文档，大小不能超过500M</span>
        </cestc-upload>
      </el-form-item>
    </el-form>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'TaskAdd',
  props: {
    buttonCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      rangeMap: [],
      selectedMap: '',
      dateRange: null,
      form: {},
      rules: {
        taskName: [{ required: true, message: '必填', trigger: 'blur' }],
        range: [{ required: true, message: '必填', trigger: 'blur' }],
        userType: [{ required: true, message: '必填', trigger: 'blur' }],
        time: [{ required: true, message: '必填', trigger: 'blur' }],
        taskDesc: [{ required: true, message: '必填', trigger: 'blur' }],
        planTaskMediaList: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getBsDictsByType('event_platform')
    }
  },
  async created() {
    await this.initSelectMap()
  },
  methods: {
    // 发布范围字典数据
    initSelectMap() {
      moduleSrv.getNotifyMap().then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.rangeMap = res.data || []
        } else {
          this.rangeMap = []
          console.warn('发布范围字典数据获取报错')
        }
      })
    },
    updateEventMedia(fileList = []) {
      this.form.eventMedia = fileList
    },
    // 提交
    _confirm() {
      this.$emit('confirm', { ...this.form, action: this.matchTitle.action })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.type-in-class {
  .el-form-item {
    &.form-item-two {
      width: calc(50% - 48px);
      .el-date-editor {
        width: 100%;
      }
    }
    width: 100%;
    .el-select,
    .el-cascader {
      width: 100%;
    }
  }
}
</style>
