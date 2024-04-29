<template>
  <div :class="{ 'hidden-top': hiddenTop }">
    <div class="top-set">
      <div class="title"><span>事件属性</span></div>
      <ul class="view-wrapper">
        <li class="view-item">
          <span class="label">编码总位数</span>
          <span class="value">{{ standardForm.value01 || "-" }}</span>
        </li>
        <li class="view-item">
          <span class="label">编码规则
            <el-tooltip
              class="item"
              effect="light"
              content="前4位大写字母表示事件来源，中间8位为事件收录的日期，最后6位按收录时间顺序编号，例如2023年10月30日接入监测预警上报的第一个事件编号为：JCYJ 20231030 000001"
              placement="right"
            >
              <span class="info-tips" />
            </el-tooltip>
          </span>
          <span class="value">{{ standardForm.value02 || "-" }}</span>
        </li>
        <li class="view-item row">
          <span class="label">系统坐标系</span>
          <span class="value">{{ standardForm.value03 || "-" }}</span>
        </li>
      </ul>
    </div>
    <div class="area">
      <div class="title title-shadow"><span>行政区划</span></div>
      <div class="area-container">
        <div class="tree-box" :style="'height: calc(100% - 45px);'">
          <area-content />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import areaContent from './areaContent.vue'
import moduleSrvUser from '@/api/user'
import { SUCCESS_CODE } from '@/constants'

export default {
  name: 'StrategyConfigStandardized',
  components: {
    areaContent
  },
  data() {
    return {
      standardForm: {
        value01: '',
        value02: '',
        value03: ''
      }
    }
  },
  computed: {
    hiddenTop() {
      return this.$route.query.hiddenTop === 'true'
    }
  },
  mounted() {
    this.getDictsDateTypeBs()
  },
  methods: {
    getDictsDateTypeBs() {
      moduleSrvUser
        .getDictsDateTypeBs({
          dictName: 'event_standard_manage'
        })
        .then((res) => {
          if (res.code === SUCCESS_CODE) {
            res.data.forEach((e) => {
              this.standardForm[`value${e.dictValue}`] = e.dictDesc
            })
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.hidden-top {
  .top-set {
    display: none;
  }
  .area {
    height: 100%;
    margin-top: 0;
  }
}
.top-set {
  background-color: #fff;
  @include info(2);
  .view-wrapper {
    padding: 0 20px;
    .view-item {
      width: 600px;
      margin-right: 20px;
      .value {
        line-height: 20px;
      }
    }
  }
  .info-tips {
    vertical-align: middle;
  }
}
.area {
  margin-top: 20px;
  height: calc(100% - 246px);
  background: #fff;
}
.title {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  span {
    border-left: 4px solid #36a4ff;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #4b4b4b;
    line-height: 14px;
    padding-left: 8px;
  }
}
.title-shadow {
  box-shadow: inset 0px -1px 0px 0px #ededed;
}

.area-container {
  height: calc(100% - 16px);
  width: 100%;
  .tree-box {
    flex: 1;
  }
  .empty-box {
    height: calc(100% - 16px);
    width: 100%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
