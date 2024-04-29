<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="660px"
    :before-close="handleClose"
    :close-on-click-modal="false"
    top="6vh"
  >
    <div class="log-base">
      <ul class="content">
        <li class="base-item two-column top-item">
          <label class="label">请求ID</label>
          <div class="value">{{ ruleForm.id || '-' }}</div>
        </li>
        <li class="base-item two-column top-item">
          <label class="label">接口编码</label>
          <div class="value">{{ ruleForm.apiCode || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">接口名称</label>
          <div class="value">{{ ruleForm.apiName || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">事件编号</label>
          <div class="value">{{ ruleForm.eventCode || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">请求系统</label>
          <div class="value">{{ ruleForm.requestSysCode || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">被请求系统</label>
          <div class="value">{{ ruleForm.responeSysCode || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">响应状态</label>
          <div class="value">{{ ruleForm.responeStatus || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">请求时间</label>
          <div class="value">{{ ruleForm.requestTime || '-' }}</div>
        </li>
        <li class="base-item two-column">
          <label class="label">响应时间</label>
          <div class="value">{{ ruleForm.responeTime || '-' }}</div>
        </li>
        <li class="base-item two-column" />
        <li class="base-item two-column">
          <label class="label">请求报文</label>
          <div class="value json-view">
            <json-viewer :value="JSON.parse(ruleForm.requestBody || '{}')" copyable theme="my-awesome-json-theme" />
          </div>
        </li>
        <li class="base-item two-column">
          <label class="label">响应报文</label>
          <div class="value json-view">
            <json-viewer :value="JSON.parse(ruleForm.responeBody || '{}')" copyable theme="my-awesome-json-theme" />
          </div>
        </li>
      </ul>
    </div>
    <!-- <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :disabled="digType === 'view'" label-position="top" label-width="100px" class="demo-ruleForm">
        <el-form-item class="width100" label="请求ID" prop="id">
          <el-input v-model="ruleForm.id" class="width100" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="事件编号" prop="eventCode">
          <el-input v-model="ruleForm.eventCode" class="width100" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item class="width100" label="请求报文" prop="requestBody">
          <json-viewer :value="JSON.parse(ruleForm.requestBody || '{}')" copyable theme="my-awesome-json-theme" />
        </el-form-item>
        <el-form-item class="width100" label="响应报文" prop="responeBody">
          <json-viewer :value="JSON.parse(ruleForm.responeBody || '{}')" copyable theme="my-awesome-json-theme" />
        </el-form-item>
      </el-form> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import JsonViewer from 'vue-json-viewer'
// import moduleSrv from '@/api/dispatchWhh'

export default {
  name: 'CmDialog',
  components: {
    JsonViewer
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    digType: {
      type: String,
      default: ''
    },
    digData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShowDig: false,
      title: '',
      ruleForm: {
        'apiCode': '',
        'apiName': '',
        'eventCode': '',
        'id': 0,
        'requestBody': '',
        'requestSysCode': '',
        'requestTime': '',
        'responeBody': '',
        'responeStatus': '',
        'responeSysCode': '',
        'responeTime': ''
      }
    }
  },
  watch: {
    dialogVisible: {
      deep: true,
      immediate: true,
      handler(nval) {
        this.$nextTick(() => {
          this.isShowDig = nval
        })
      }
    },
    digType: {
      deep: true,
      immediate: true,
      handler(nval) {
        if (nval === 'add') {
          this.title = '新增接入监控'
        } else if (nval === 'view') {
          this.title = '查看接入监控'
        } else {
          this.title = '编辑接入监控'
        }
      }
    },
    digData: {
      deep: true,
      immediate: true,
      async handler(nval) {
        // 遍历对象，将null 改成 ''
        for (const val in nval) {
          nval[val] = nval[val] === null ? '' : nval[val]
        }
        if (this.digType === 'view' || this.digType === 'edit') {
          await this.dealruleFormFn(nval)
        } else {
          await this.dealruleFormFn(this.ruleForm)
        }
        console.log('this.ruleForm', this.ruleForm)
      }
    }
  },

  methods: {
    async dealruleFormFn(useNvalObj) {
      this.ruleForm = Object.assign(JSON.parse(JSON.stringify(this.ruleForm)), useNvalObj)
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    }
  }
}
</script>
<style scoped lang="scss">
.log-base {
  padding: 20px;
  color: #4b4b4b;
  background-color: #fff;
  .content {
    display: flex;
    flex-wrap: wrap;
    .base-item {
      width: 100%;
      margin-top: 20px;
      &.two-column {
        width: 50%;
      }
      .label {
        text-align: left;
        display: inline-block;
        margin-bottom: 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #8A8A8A;
      }
      .value {
        padding-right: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #4B4B4B;
      }
    }
    .top-item {
      margin-top: 0;
    }
  }

}
.json-view {
  // display: flex;
  // justify-content: space-between;
  // align-items: flex-start;
  // flex-wrap: wrap;
  ::v-deep {
    .jv-container {
      cursor: not-allowed;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #4B4B4B;
      background: #F1F3F8;
      border-radius: 2px;
      border: 1px solid #E7E7E7;
      line-height: 20px;
      min-height: 460px;
    }
  }
}
.width100 {
  width: 100%;
}
</style>
