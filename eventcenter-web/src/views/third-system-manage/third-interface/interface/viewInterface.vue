<template>
  <div class="page-wrapper">
    <div class="content">
      <common-title :title="title" />
      <div class="log-base">
        <ul class="form-content">
          <li class="base-item two-column top-item">
            <label class="label">接口编码</label>
            <div class="value">{{ ruleForm.apiCode || '-' }}</div>
          </li>
          <li class="base-item two-column top-item">
            <label class="label">接口名称</label>
            <div class="value">{{ ruleForm.apiName || '-' }}</div>
          </li>
          <li class="base-item two-column">
            <label class="label">对接系统名称</label>
            <div class="value">{{ ruleForm.sysName || '-' }}</div>
          </li>
          <li class="base-item two-column">
            <label class="label">接口地址</label>
            <div class="value">{{ ruleForm.url || '-' }}</div>
          </li>
          <li class="base-item two-column">
            <label class="label">请求方式</label>
            <div class="value">{{ ruleForm.requestMethod || '-' }}</div>
          </li>
          <li class="base-item two-column">
            <label class="label">备注</label>
            <div class="value">{{ ruleForm.comment || '-' }}</div>
          </li>
          <li class="base-item two-column">
            <label class="label">请求报文（样例报文）</label>
            <div class="value">{{ ruleForm.requestData || '-' }}</div>
          </li>
          <li class="base-item two-column">
            <label class="label">响应报文（样例报文）</label>
            <div class="value">{{ ruleForm.responeData || '-' }}</div>
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
// import JsonViewer from 'vue-json-viewer'

export default {
  name: 'PreAcceptedInfo',
  // components: {
  //   JsonViewer
  // },
  data() {
    return {
      title: '查看接口配置',
      ruleForm: {
        apiCode: '',
        apiName: '',
        sysCode: '',
        sysName: '',
        url: '',
        requestMethod: '',
        comment: '',
        requestData: '',
        responeData: ''
      }
    }
  },
  computed: {
    eventPlatformOptions() {
      // getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果
      return this.$store.getters.getThirdSystemList
    }
  },
  created() {
    moduleSrv.getBusApiById({ id: this.$route.query.id })
      .then(res => {
        if (res.code === 0) {
          this.ruleForm = res.data
          this.$nextTick(() => {
            this.ruleForm.sysName = this.eventPlatformOptions.find(item => item.dictValue === res.data.sysCode)?.dictLabel
          }, 1000)
        }
      })
  },
  mounted() {},
  methods: {
    // 返回列表或上一级
    _goback() {
      this.$router.push({
        path: '/third-system-manage/third-interface',
        query: { platformCode: this.$route.query.platformCode }
      })
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
      width: 600px;
      margin-top: 20px;
      margin-right: 20px;
      .label {
        text-align: left;
        display: inline-block;
        margin-bottom: 10px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #8A8A8A;
        height: 20px;
        line-height: 20px;
      }
      .value {
        padding-right: 20px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #4B4B4B;
        height: 20px;
        line-height: 20px;
        word-wrap: break-word;
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
