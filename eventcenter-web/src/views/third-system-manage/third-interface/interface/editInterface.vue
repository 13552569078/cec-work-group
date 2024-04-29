<template>
  <div class="page-wrapper">
    <div class="content">
      <common-title :title="title" />

      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width600p count-after" label="接口编码" prop="apiCode">
          <el-input v-model="ruleForm.apiCode" class="width100" :disabled="digType === 'edit'" maxlength="20" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width600p count-after" label="接口名称" prop="apiName">
          <el-input v-model="ruleForm.apiName" class="width100" :disabled="digType === 'edit'" maxlength="20" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width600p" label="对接系统名称" prop="sysCode">
          <el-select v-model="ruleForm.sysCode" class="width100" :disabled="digType === 'edit'" placeholder="请选择">
            <el-option
              v-for="item in eventPlatformOptions"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="width600p count-after" label="接口地址" prop="url">
          <el-input v-model="ruleForm.url" class="width100" maxlength="200" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width600p count-after" label="请求方式" prop="requestMethod">
          <el-input v-model="ruleForm.requestMethod" class="width100" maxlength="10" placeholder="请输入内容" />
        </el-form-item>
        <el-row class="width100" type="flex" justify="">
          <!-- <el-col :span=""></el-col> -->
          <el-form-item class="width600p defaultTextarea" label="备注" prop="comment">
            <el-input v-model="ruleForm.comment" class="width100" type="textarea" maxlength="200" show-word-limit placeholder="请输入内容" />
          </el-form-item>
          <el-form-item class="width600p defaultTextarea" label="请求报文（样例报文）" prop="requestData">
            <el-input v-model="ruleForm.requestData" class="width100" type="textarea" placeholder="请输入内容" />
          </el-form-item>
        </el-row>
        <el-form-item class="width600p defaultTextarea" label="响应报文（样例报文）" prop="responeData">
          <el-input v-model="ruleForm.responeData" class="width100" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
    </div>
    <div class="footer">
      <el-button
        v-if="['add', 'edit'].includes(digType)"
        v-loading="loading"
        type="primary"
        @click.stop="_confirm"
      >保存</el-button>
      <el-button v-if="['add', 'edit'].includes(digType)" class="extra-handle" @click.stop="_goback">取消</el-button>
      <el-button v-if="['view'].includes(digType)" class="extra-handle" @click.stop="_goback">关闭</el-button>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'PreAcceptedInfo',
  data() {
    return {
      mode: 'view', // 默认是详情模式，只查看
      loading: false, // 按钮是否可点击
      digType: '',
      digData: {},
      title: '',
      ruleForm: {
        apiCode: '',
        apiName: '',
        sysCode: '',
        url: '',
        requestMethod: '',
        comment: '',
        requestData: '',
        responeData: ''
      },
      curSysCode: '',
      rules: {
        apiCode: [
          { required: true, message: '请输入接口编码', trigger: 'blur' }
        ],
        apiName: [
          { required: true, message: '请输入接口名称', trigger: 'blur' }
        ],
        sysCode: [
          { required: true, message: '请选择对接系统名称', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        requestMethod: [
          { required: true, message: '请输入请求方式', trigger: 'blur' }
        ],
        comment: [
          { required: true, message: '请输入备注', trigger: 'blur' }
        ],
        requestData: [
          { required: true, message: '请输入请求报文（样例报文）', trigger: 'blur' }
        ],
        responeData: [
          { required: true, message: '请输入响应报文（样例报文）', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getThirdSystemList
    }
  },
  watch: {
    digType: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (nval === 'add') {
          this.title = '新增接口配置'
        } else if (nval === 'view') {
          this.title = '查看接口配置'
        } else {
          this.title = '编辑接口配置'
        }
      }
    },
    digData: {
      deep: true,
      immediate: true,
      async handler(nval) {
        if (this.digType === 'view' || this.digType === 'edit') {
          const res = await moduleSrv.getBusApiById({ id: nval.id })
          await this.dealruleFormFn(res.data)
        } else {
          await this.dealruleFormFn(this.ruleForm)
          this.ruleForm.sysCode = nval.platformCode?.toString() === '-999' ? '' : nval.platformCode
        }
        this.curSysCode = this.ruleForm.sysCode
        console.log('this.ruleForm', this.ruleForm)
      }
    }
  },
  created() {
    this.digType = this.$route.query.digType
    this.digData = {
      id: this.$route.query.id,
      platformCode: this.$route.query.platformCode
    }
  },
  mounted() {
    moduleSrv.getSelectEvaluateList().then((res) => {
      const list = res.data
      if (res.code === 0) {
        this.selectEvaluateList = list
      }
    })
  },
  methods: {
    // 返回列表或上一级
    _goback() {
      this.$router.push({
        path: '/third-system-manage/third-interface',
        query: { platformCode: this.curSysCode }
      })
    },
    comActionAdd() {
      this.ruleForm.indexes.push({
        id: '',
        indexName: '',
        weight: 1
      })
    },
    async dealruleFormFn(form) {
      this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), { ...form })
    },
    // 提交
    _confirm() {
      let serverUrl, tipsuccess, tiperror
      if (this.digType === 'add') {
        serverUrl = moduleSrv.busApiAdd
        tipsuccess = '添加成功'
        tiperror = '添加失败'
      } else if (this.digType === 'edit') {
        serverUrl = moduleSrv.busApiUpdate
        tipsuccess = '更新成功'
        tiperror = '更新失败'
      }
      try {
        this.$refs['ruleForm'].validate(async(valid) => {
          if (valid) {
            const params = {
              ...this.ruleForm
            }
            const res = await serverUrl(params)
            if (res.code === SUCCESS_CODE) {
              this.loading = false
              this.curSysCode = this.ruleForm.sysCode
              this.$message.success(tipsuccess)
              this._goback()
            } else {
              this.loading = false
              this.$message.error(tiperror)
            }
          } else {
            return false
          }
        })
      } catch (e) {
        console.log(e)
        this.$message.error(tiperror)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  height: 100%;
  background-color: #fff;
  position: relative;
  .content {
    padding: 20px 20px 0;
    overflow-y: auto;
    height: calc(100% - 80px);
    .demo-ruleForm {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 20px;
      }
      .auto-switch {
        height: 48px;
        background: #F9FAFE;
        border-radius: 2px;
        padding-left: 20px;
        display: flex;
        align-items: center;
        .swith-tip {
          margin-left: 24px;
          font-size: 14px;
          font-weight: 400;
          color: #4B4B4B;
        }
      }
      .common-action-btn {
        position: absolute;
        right: 0;
        top: -40px;
      }
      .width30 {
        width: 35%;
        margin-right: 20px;
      }
      .width600p {
        width: 600px;
        margin-right: 20px;
      }

      .minheight96p {
        min-height: 96px;
      }
      .width50 {
        width: 48%;
      }
      .width100 {
        width: 100%;
      }
      .width80 {
        width: 80%;
      }
      .width20 {
        width: 20%;
      }

  }
  .footer {
    position: absolute;
    bottom:0;
    left: 0;
    width: 100%;
    height: 64px;
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
    padding: 0 20px;
    display: flex;
    align-items: center;
    .extra-handle {
      margin-left: 16px;
    }
  }
}
::v-deep {
  .defaultTextarea {
    textarea {
      height: 96px;
    }
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
}
</style>
