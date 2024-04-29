<!--
 * @description 待办任务-任务处理
 * @date 2020-11-18
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    title="任务处理"
    width="682px"
    top="20vh"
    v-on="$listeners"
  >
    <!-- 任务详情 -->
    <title-tip title="任务详情" />
    <el-form inline label-position="top" class="info">
      <el-form-item label="起止时间" class="form-item-two">
        <span>{{ `${info.createTime}-${info.endTime}` }}</span>
      </el-form-item>
      <el-form-item label="任务标题" class="form-item-two">
        <span>{{ info.taskTitle || '-' }}</span>
      </el-form-item>
      <el-form-item label="任务内容">
        <span>{{ info.taskDesc || '-' }}</span>
      </el-form-item>
      <el-form-item label="任务附件">
        <ul class="media-list">
          <li v-for="(item, index) in info.planTaskMediaList" :key="index">
            <div class="name">{{ item.mediaName }}</div>
            <div class="down">
              <i class="el-icon-download" @click.stop="_down(item)" />
            </div>
          </li>
        </ul>
      </el-form-item>
    </el-form>
    <!-- 处理说明 -->
    <title-tip title="处理说明" />
    <el-form
      ref="form"
      :model="form"
      inline
      label-position="top"
      class="type-in-class"
      :rules="rules"
    >
      <el-form-item label="处理说明" prop="handleDesc">
        <el-input
          v-model="form.handleDesc"
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
    <div slot="footer">
      <el-button @click.stop="_cancle">取消</el-button>
      <el-button type="primary" @click.stop="_confirm">处理</el-button>
    </div>
  </cestc-dialog>
</template>
<script>
import moduleSrv from '@/api/dispatch'
import { SUCCESS_CODE } from '@/constants'
export default {
  name: 'TaskHandle',
  props: {
    id: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      form: {},
      info: {},
      rules: {
        handleDesc: [{ required: true, message: '必填', trigger: 'blur' }],
        planTaskMediaList: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      moduleSrv.getTaskInfoById(this.id).then((res) => {
        if (res.code === SUCCESS_CODE) {
          this.info = res.data
        } else {
          console.warn('getTaskInfoById 报错')
        }
      })
    },
    // 资源下载
    _down(item) {
      console.log('item===', item)
    },
    updateEventMedia(fileList = []) {
      this.$set(this.form, 'planTaskMediaList', fileList)
    },
    // 提交
    _confirm() {
      const params = {
        id: this.id,
        ...this.form
      }
      this.$refs.form.validate((valid) => {
        if (!valid) return
        moduleSrv.handleTask(params).then((res) => {
          if (res.code === SUCCESS_CODE) {
            this.$message({
              type: 'success',
              message: '处理成功!'
            })
            this._cancle()
          } else {
            this.$message({
              type: 'error',
              message: res.message || '处理失败!'
            })
          }
        })
      })
    },
    // 取消关闭弹窗
    _cancle() {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  padding: 16px 10px;
  .el-form-item {
    &:not(.form-item-two) {
      width: 100%;
    }
    width: calc(50% - 20px);
  }
  .media-list {
    li {
      display: flex;
      width: 50%;
      padding: 10px;
      .down {
        flex: 0 0 10px;
        margin-left: auto;
        cursor: pointer;
      }
    }
  }
}
.type-in-class {
  .el-form-item {
    width: 100%;
  }
}
</style>
