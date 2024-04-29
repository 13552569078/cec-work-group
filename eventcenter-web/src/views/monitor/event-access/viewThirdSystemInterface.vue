<template>
  <div class="page-wrapper">
    <div class="content">
      <common-title :title="title" />
      <div class="log-base">
        <ul class="form-content">
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
            <div class="value">{{ ruleForm.responeStatus === 0 ? "失败" : "成功" }}</div>
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
              <json-viewer :value="handleJson(ruleForm.requestBody)" copyable theme="my-awesome-json-theme" />
            </div>
          </li>
          <li class="base-item two-column">
            <label class="label">响应报文</label>
            <div class="value json-view">
              <json-viewer :value="handleJson(ruleForm.responeBody)" copyable theme="my-awesome-json-theme" />
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer">
      <el-button @click.stop="_goback">返回</el-button>
    </div>
  </div>
</template>

<script>
import moduleSrv from '@/api/dispatchWhh'
import JsonViewer from 'vue-json-viewer'

export default {
  name: 'PreAcceptedInfo',
  components: {
    JsonViewer
  },
  data() {
    return {
      title: '查看接口监控',
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
  created() {
    moduleSrv.getBusLogById({ id: this.$route.query.id })
      .then(res => {
        if (res.code === 0) {
          this.ruleForm = res.data
        }
      })
  },
  mounted() {},
  methods: {
    // 返回列表或上一级
    _goback() {
      // this.$router.push({
      //   path: '/monitor/event-access'
      // })
      this.$router.go(-1)
    },
    handleJson(data) {
      if (data) {
        try {
          const json = JSON.parse(data)
          return json
        } catch (e) {
          return {}
        }
      } else {
        return {}
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
  }
}
.log-base {
  padding: 20px 0;
  color: #4b4b4b;
  background-color: #fff;
  .form-content {
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
  overflow-y: auto;
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
