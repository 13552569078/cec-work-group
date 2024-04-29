<!--
 * @description 去重事件详情
 * @date 2020-09-08
 * @author lism
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="isShowDig"
    width="830px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="dialog-wrapper">
      <div class="width100 digwtitle">
        <div class="l">事件基本信息</div>
      </div>
      <div class="demo-ruleForm">
        <div class="width50 digwechone">
          <div class="tl">事件编号：</div>
          <div class="dtks">{{ ruleForm.eventCode || '--' }}</div>
        </div>
        <div class="width50 digwechone">
          <div class="tl">事件标题：</div>
          <div class="dtks">{{ ruleForm.title || '--' }}</div>
        </div>
      </div>

      <div class="demo-ruleForm">
        <div class="width50 digwechone">
          <div class="tl">平台系统：</div>
          <div class="dtks">{{ ruleForm.platformSrcName || '--' }}</div>
        </div>
        <div class="width50 digwechone">
          <div class="tl">事件来源：</div>
          <div class="dtks">{{ ruleForm.eventSourceName || '--' }}</div>
        </div>
      </div>

      <div class="demo-ruleForm">
        <div class="width50 digwechone">
          <div class="tl">事件类型：</div>
          <div class="dtks">{{ ruleForm.eventTypeName || '--' }}</div>
        </div>
        <div class="width50 digwechone">
          <div class="tl">紧急程度：</div>
          <div class="dtks">{{ ruleForm.eventUrgentName || '--' }}</div>
        </div>
      </div>

      <div class="demo-ruleForm">
        <div class="width50 digwechone">
          <div class="tl">上报人：</div>
          <div class="dtks">{{ ruleForm.reporterName || '--' }}</div>
        </div>
        <div class="width50 digwechone">
          <div class="tl">联系方式：</div>
          <div class="dtks">{{ ruleForm.reporterMobile || '--' }}</div>
        </div>
      </div>

      <div class="demo-ruleForm">
        <div class="width50 digwechone">
          <div class="tl">上报时间：</div>
          <div class="dtks">{{ ruleForm.happenTime || '--' }}</div>
        </div>
        <div class="width50 digwechone">
          <div class="tl">事件描述：</div>
          <div class="dtks">{{ ruleForm.eventDesc || '--' }}</div>
        </div>
      </div>

      <div class="demo-ruleForm">
        <div class="width50 digwechone">
          <div class="tl">去重策略编码：</div>
          <div class="dtks">{{ ruleForm.strategyCode || '--' }}</div>
        </div>
        <div class="width50 digwechone">
          <div class="tl">去重策略名称：</div>
          <div class="dtks">{{ ruleForm.strategyName || '--' }}</div>
        </div>
      </div>

      <div class="demo-ruleForm">
        <div class="width100 digwechone">
          <div class="tl">发生地址：</div>
          <div class="dtks">{{ ruleForm.eventAddress || '--' }}</div>
        </div>
      </div>

      <div v-if="ruleForm.eventMediaList.length > 0" class="width100 digwtitle">
        <div class="l">事件多媒体信息</div>
      </div>

      <div v-if="ruleForm.eventMediaList.length > 0" class="demo-ruleForm">
        <event-media :event-media="ruleForm.eventMediaList" />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import eventMedia from '@/components/EventInfo/eventMedia.vue'

export default {
  name: 'CmDialog',
  components: {
    eventMedia
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
      ruleForm: {}
    }
  },
  computed: {
    // 把字典转换为字典方式存储，方便获取对应中文
    selectEventPlatformOptions() {
      return this.$store.getters.getBsDictsByType('event_platform')
    },
    selectEventUrgentOptions() {
      return this.$store.getters.getBsDictsByType('event_urgent_level')
    },
    timeUnitOptions() {
      return this.$store.getters.getBsDictsByType('time_unit')
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
          this.title = '新增去重事件详情'
        } else if (nval === 'view') {
          this.title = '查看去重事件详情'
        } else {
          this.title = '编辑去重事件详情'
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
        console.log('this.nval', nval)
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
      const useNvalObj2 = JSON.parse(JSON.stringify(useNvalObj))
      useNvalObj2.eventMediaList = useNvalObj2.eventMediaList || []
      this.ruleForm = Object.assign(
        JSON.parse(JSON.stringify(this.ruleForm)),
        useNvalObj2
      )
    },
    handleClose(done) {
      this.isShowDig = false
      this.$parent.dialogVisible = false
    }

  }
}
</script>
<style scoped lang="scss">
.dialog-wrapper {
  max-height: 546px;
  overflow-y: auto;
}
.demo-ruleForm {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 25px;
}
.width50 {
  width: 48%;
}
.width100 {
  width: 100%;
}

.digwtitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  .l {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #313131;
    border-left: 4px solid #36a4ff;
    line-height: 14px;
    padding-left: 8px;
  }
  .r {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4d4d4d;
    }
  }
}
.digwechone {
  .tl {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #8a8a8a;
  }
  .dtks {
    font-size: 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4b4b4b;
    line-height: 20px;
    word-break: break-all;
    margin-top: 10px;
  }
}
::v-deep {
  .el-dialog__footer {
    box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
  }
}
</style>
