<template>
  <c-dialog title="升级日志" :visible.sync="dialogFlag" width="666px" :before-close="handleClose"
            class="timeline">
    <c-timeline>
      <c-timeline-item v-for="(item,index) in logList" :key="item.packTime+item.packVersion"
      >
        <div v-if="index==0" slot="dot" class="dot-ring first-dot">
        </div>
        <div v-else slot="dot" class="dot-ring">
        </div>
        <div class="card-wrap">
          <div class="card-header">
            <div class="left-box">
              <div class="version">{{ item.packVersion }}</div>
              <div class="time">{{ item.packTime }}</div>
            </div>

            <div class="btn" @click="openDetail(item)">查看详情</div>
          </div>
          <div class="card-content">
            <div class="title">版本说明</div>
            <div class="content">{{ item.packDesc||'--' }}</div>
          </div>
        </div>
      </c-timeline-item>
    </c-timeline>
  </c-dialog>

</template>
<script>
import { DefaultValue } from '@/config/index'
export default {
  name: 'ApplogInfo',

  props: {
    data: {
      type: Object,
      default: () => {
        return {
          shopCode: '',
          packVersion: '',
          appName: ''
        }
      }
    },
    dialogFlag: {
      type: Boolean,
      default: false
    },
    logList: { // 日志数据
      type: Array,
      default: () => {
        return []
      }
    },
    flag: {
      type: [String],
      default: ''
    },
    groupId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      defaultValue: DefaultValue

    };
  },
  computed: {

  },
  created() {
  },
  mounted() {

  },
  methods: {

    handleClose() {
      this.$emit('close')
    },
    openDetail(item) {
      this.$emit('downloadOpen', item)
    }

  }
};
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.card-header{
  /* 矩形备份 11 */

  height: 48px;
  border-radius: 2px;
  opacity: 1;
  background: #F9FAFE;
  display: flex;
  align-items: center;
    border-bottom: 1px solid  #EDEDED;;
  padding: 0 16px;
  justify-content: space-between;
  .left-box{
    display: flex;
  align-items: center;
  }
  .version{
    display: flex;
    align-items: center;
    font-weight: 400;
    color: #8A8A8A;
    line-height: 20px;
    margin-right: 24px;
    &::before{
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      background: url(~@/assets/imgs/version.svg) no-repeat;
      background-size: 100%;
    margin-right: 8px;
    }
  }

  .time{
    color: #8A8A8A;
  }
  .btn{
    color: #36A4FF;
    cursor: pointer;
  }
}
.card-content{
  padding: 16px;
  .title{
    color: #8A8A8A;
    margin-bottom:8px ;
  }
  .content{
    color: #4B4B4B;
    line-height: 1.2;
  }
}
.timeline {
  .dot-ring {
    width: 14px;
    height: 14px;
    border-radius: 100%;
    position: relative;
    border: 3px solid #8a8a8a;
    background: #fff;
    margin-left: -2px;
    &.first-dot {
      border: 3px solid #36A4FF;
    }

    // .start-line{

    // }

    .start-dot {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #fff;
      border: 2px solid #ededed;
      left: -1px;
      top: -35px;

      &::after {
        content: '';
        position: absolute;
        width: 0;
        height: 22px;
        top: 8px;
        border-left: 2px solid #ededed;
        left: 2px;
      }
    }
  }
  .card-wrap {
    background: #f9fafe;
    border-radius: 2px;
  }
}
</style>
