<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="apply-history">
    <c-steps :active="-1" :space="250" align-center>
      <c-step v-for="(item,index) in list" :key="item.handleTime + index"
              icon="c-icon-edit">
        <template slot="icon">
          <div class="icon-box">
            <i :class="getClassByStatus(item.applyStatus,index)"></i>
            <span>{{ getTitle(item.applyStatus,index) }}</span>
          </div>
        </template>
        <template slot="description">
          <div class="description-info">
            <c-tooltip :content="`${item.handleRole} ${item.handleUserName||''}`"
                       placement="top-start">
              <p class="u-name">{{ item.handleRole }} {{ item.handleUserName }}</p>
            </c-tooltip>
            <p class="u-time">{{ item.handleTime |timeFiler }}</p>
            <c-tooltip v-if="item.applyStatus || item.applyStatus===0" class="item"
                       :content="getAuditMsg(item)" placement="top-start">
              <p class="u-desc green" :class="{red:item.applyStatus ===2}">{{ getAuditMsg(item) }}</p>
            </c-tooltip>
          </div>
        </template>
      </c-step>
    </c-steps>
  </div>
</template>
<script>
import moment from 'moment-cn'
export default {
  name: '',
  filters: {
    timeFiler(val) {
      if (!val) return ''
      return moment(val).format('YYYY.MM.DD HH:mm:ss')
    }
  },
  props: {
    list: Array
  },
  data() {
    return {}
  },
  computed: {
    activeStep() {
      return this.list.filter(item => item.applyStatus || item.handleTime).length ? this.list.filter(item => item.applyStatus || item.handleTime).length - 1 : 0
    }
  },
  methods: {
    getClassByStatus(status, index) {
      console.log(status, 'status')
      let res = ''
      switch (status) {
        case 0:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }
          break
        case 1:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }
          break
        case 2:
          res = 'icon-fail'
          if (index === this.activeStep) { res = 'icon-fail-big' }
          break
        case 3:
          res = 'icon-success'
          if (index === this.activeStep) { res = 'icon-success-big' }
          break
        default:
          break
      }
      return res || 'icon-pendding'
    },
    getTitle(status, index) {
      console.log(status, 'status')
      let res = ''
      switch (status) {
        case 0:
          res = '提交'
          break
        case 1:
          res = '审核'
          break
        case 2:
          res = '审核'
          break
        case 3:
          res = '撤销'
          break
        default:
          break
      }
      if (index === this.list.length - 1) res = '终审'
      return res || '审核'
    },
    getAuditMsg(row) {
      return `【${this.getStatus(row.applyStatus)}】${row.auditMsg || ''}`
    },
    getStatus(val) {
      let res = ''
      switch (val) {
        case 0:
          res = '提交成功'
          break
        case 1:
          res = '通过'
          break
        case 2:
          res = '驳回'
          break
        case 3:
          res = '撤销'
          break
        case 4:
          res = '驳回'
          break

        default:
          break
      }
      return res || ''
    }
  }
}
</script>
<style scoped lang="scss">
.apply-history {
  height: 180px;
  background: #fff;
  border-top: solid 1px #ededed;
  overflow-x: auto;
  padding: 40px 20px 0;
  .is-finish {
    border-color: #bdbdbd;
  }
  .c-step {
    flex-shrink: 0;
    &:last-child {
      max-width: auto;
    }
  }
}
.icon-success-big {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: url(~@/assets/imgs/icon-success-big.png);
}
.icon-fail-big {
  display: inline-block;
  width: 48px;
  height: 48px;
  background: url(~@/assets/imgs/icon-fail-big.png);
}
.icon-success {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-success.png);
}
.icon-fail {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-fail.png);
}
.icon-pendding {
  display: inline-block;
  width: 40px;
  height: 40px;
  background: url(~@/assets/imgs/icon-pendding.png);
}
.description-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  width: 150px;
  .u-name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #8a8a8a;
  }
  .u-time {
    color: #8a8a8a;
  }
  .u-desc {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 5px;
  }
  .red {
    color: #ff4d4f !important;
  }
  .green {
    color: #4cc09e;
  }
}
.icon-box {
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4b4b4b;
  display: flex;
  align-items: center;
}
</style>
