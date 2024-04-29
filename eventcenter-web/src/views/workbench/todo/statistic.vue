<template>
  <div class="et-statistic">
    <div class="ets-item ets-item-db" :class="{'ets-item-active': eventUrgent === 0}" @click="urgentClick(0)">
      <img src="@/assets/workbench/dbsj.png">
      <div class="ets-val">{{ pageData.todoCount || 0 }}</div>
      <div class="ets-label">待办事件</div>
    </div>
    <div class="ets-item ets-item-yb" :class="{'ets-item-active': eventUrgent === 1}" @click="urgentClick(1)">
      <img src="@/assets/workbench/ybsj.png">
      <div class="ets-val">{{ pageData.generalCount || 0 }}</div>
      <div class="ets-label">一般事件</div>
    </div>
    <div class="ets-item ets-item-zd" :class="{'ets-item-active': eventUrgent === 2}" @click="urgentClick(2)">
      <img src="@/assets/workbench/zdsj.png">
      <div class="ets-val">{{ pageData.importantCount || 0 }}</div>
      <div class="ets-label">重大</div>
    </div>
    <div class="ets-item ets-item-tzd" :class="{'ets-item-active': eventUrgent === 3}" @click="urgentClick(3)">
      <img src="@/assets/workbench/tzdsj.png">
      <div class="ets-val">{{ pageData.supImportantCount || 0 }}</div>
      <div class="ets-label">特重大</div>
    </div>
  </div>
</template>

<script>
import service from '@/api/dispatch'

export default {
  name: 'EventcenterWebStatistic',
  data() {
    return {
      pageData: {},
      eventUrgent: ''
    }
  },

  methods: {
    getCount(params) {
      service.todoCountByUrgent(params).then(res => {
        this.pageData = res?.data || {}
      })
    },
    urgentClick(type) {
      if (type === this.eventUrgent) {
        this.eventUrgent = ''
        this.$emit('search', {})
      } else {
        this.eventUrgent = type
        this.$emit('search', type === 0 ? {} : { eventUrgent: this.eventUrgent })
      }
    },
    resetEventUrgent() {
      this.eventUrgent = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.et-statistic {
    position: absolute;
    z-index: 2;
    left: 360px;
    top: 20px;
    width: 82px;
    height: 416px;
    background-image: url('~@/assets/workbench/etsbg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding-top: 20px;
    padding-left: 9px;
    .ets-item {
        height: 88px;
        width: 64px;
        background: rgba(255,255,255,0.9);
        border-radius: 2px;
        margin-bottom: 8px;
        text-align: center;
        cursor: pointer;
        &:last-child{
            margin-bottom: 0px;
        }
        img{
            width: 16px;
            height: 16px;
            margin: 8px 0;
        }
        .ets-val {
            font-size: 20px;
            font-family: PingFangSC, PingFang SC;
            font-weight: 500;
        }
        .ets-label{
            line-height: 20px;
        }
        &-db{
            .ets-val {
                color: #6D87F2;
            }
        }
        &-yb{
            .ets-val {
                color: #FECC55;
            }
        }
        &-zd{
            .ets-val {
                color: #FA8B16;
            }
        }
        &-tzd{
            .ets-val {
                color: #FF4D4F;
            }
        }
        &-active{
          background: #f2f6ff;
          border: 1px solid #36a4ff;
          .ets-label {
            color: #36a4ff;
          }
        }
    }
}
</style>
