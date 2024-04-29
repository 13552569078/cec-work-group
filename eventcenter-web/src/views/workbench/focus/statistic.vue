<template>
  <div class="focus-statistic">
    <div class="top-st">
      <div class="tst-box tst-box-zong">
        <img src="@/assets/workbench/focus/zong.png">
        <div class="st-info">
          <div class="st-label">事件汇聚总数</div>
          <div class="st-val">{{ pageData.allCount || 0 }}</div>
        </div>
      </div>
      <div :class="['tst-box',convergeStateList.indexOf('processing') > -1 ? 'tst-box-active' : '']" @click="convergeStateClick('processing')">
        <img src="@/assets/workbench/focus/jinxing.png">
        <div class="stn-info">
          <div class="stn-val">{{ pageData.processingCount || 0 }}</div>
          <div class="stn-label">进行中</div>
        </div>
      </div>
      <div :class="['tst-box',convergeStateList.indexOf('done') > -1 ? 'tst-box-active' : '']" @click="convergeStateClick('done')">
        <img src="@/assets/workbench/focus/banjie.png">
        <div class="stn-info">
          <div class="stn-val">{{ pageData.doneCount || 0 }}</div>
          <div class="stn-label">已办结</div>
        </div>
      </div>
      <div :class="['tst-box',convergeStateList.indexOf('cancelled') > -1 ? 'tst-box-active' : '']" @click="convergeStateClick('cancelled')">
        <img src="@/assets/workbench/focus/zuofei.png">
        <div class="stn-info">
          <div class="stn-val">{{ pageData.cancelledCount || 0 }}</div>
          <div class="stn-label">已作废</div>
        </div>
      </div>
    </div>
    <div class="bottom-st">
      <div :class="['bst-box',reportSourceList.indexOf('third') > -1 ? 'bst-box-active' : '']" @click="reportSourceClick('third')">
        <div class="bb-left">
          <img src="@/assets/workbench/focus/sanfang.png">
          <span class="bb-label">三方上报</span>
        </div>
        <div class="bb-right">
          <span class="bb-val bb-val-blue">{{ pageData.thirdCount || 0 }}</span>
          <span class="bb-unit">条</span>
        </div>
      </div>
      <div :class="['bst-box',reportSourceList.indexOf('thirdSelf') > -1 ? 'bst-box-active' : '']" @click="reportSourceClick('thirdSelf')">
        <div class="bb-left">
          <img src="@/assets/workbench/focus/sanfangzi.png">
          <span class="bb-label">三方自处置</span>
        </div>
        <div class="bb-right">
          <span class="bb-val bb-val-green">{{ pageData.thirdSelfCount || 0 }}</span>
          <span class="bb-unit">条</span>
        </div>
      </div>
      <div :class="['bst-box',reportSourceList.indexOf('gridReport') > -1 ? 'bst-box-active' : '']" @click="reportSourceClick('gridReport')">
        <div class="bb-left">
          <img src="@/assets/workbench/focus/sanfang.png">
          <span class="bb-label">网格员上报</span>
        </div>
        <div class="bb-right">
          <span class="bb-val bb-val-orange">{{ pageData.gridReportCount || 0 }}</span>
          <span class="bb-unit">条</span>
        </div>
      </div>
      <div :class="['bst-box',reportSourceList.indexOf('systemInput') > -1 ? 'bst-box-active' : '']" @click="reportSourceClick('systemInput')">
        <div class="bb-left">
          <img src="@/assets/workbench/focus/sanfang.png">
          <span class="bb-label">系统录入</span>
        </div>
        <div class="bb-right">
          <span class="bb-val bb-val-purple">{{ pageData.systemInputCount || 0 }}</span>
          <span class="bb-unit">条</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/api/dispatch'

export default {
  name: 'EventcenterWebStatistic',

  data() {
    return {
      convergeStateList: [],
      reportSourceList: [],
      pageData: {}
    }
  },

  created() {
    this.getData()
  },

  methods: {
    getData() {
      service.getEventFocusSummaryCount().then(res => {
        this.pageData = res.data || {}
      })
    },
    reportSourceClick(rsrc) {
      const idx = this.reportSourceList.findIndex(rs => rs === rsrc)
      if (idx === -1) {
        this.reportSourceList.push(rsrc)
      } else if (idx > -1) {
        this.reportSourceList.splice(idx, 1)
      }
      service.getSummaryCount4Process({ convergeStateList: this.convergeStateList, reportSourceList: this.reportSourceList }).then(res => {
        const resData = res.data || {}
        this.pageData = {
          ...this.pageData,
          ...resData
        }
      })
      this.$emit('search', { reportSourceList: this.reportSourceList, convergeStateList: this.convergeStateList })
    },
    convergeStateClick(cstate) {
      const idx = this.convergeStateList.findIndex(st => st === cstate)
      if (idx === -1) {
        this.convergeStateList.push(cstate)
      } else if (idx > -1) {
        this.convergeStateList.splice(idx, 1)
      }
      service.getSummaryCount4Source({ convergeStateList: this.convergeStateList, reportSourceList: this.reportSourceList }).then(res => {
        const resData = res.data || {}
        this.pageData = {
          ...this.pageData,
          ...resData
        }
      })
      this.$emit('search', { convergeStateList: this.convergeStateList, reportSourceList: this.reportSourceList })
    }
  }
}
</script>

<style lang="scss" scoped>
.focus-statistic {
    height: 220px;
    background: #FFFFFF;
    padding: 20px;
    .top-st{
        display: flex;
        .tst-box {
            margin-right: 20px;
            height: 104px;
            background-color: rgba(0,164,255,0.03);
            width: calc(25% - 15px);
            cursor: pointer;
            display: flex;
            align-items: center;
            padding-left: 24px;
            img{
                width: 64px;
                height: 64px;
            }
            &:last-child{
                margin-right: 0;
            }
            &-zong {
                background-image: url('~@/assets/workbench/focus/zongbg.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                cursor: default;
            }
            .st-info {
                color: #fff;
                margin-left: 16px;
                .st-label{
                    line-height: 20px;
                }
                .st-val {
                    font-size: 24px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                    line-height: 33px;
                }
            }
            .stn-info {
                margin-left: 16px;
                .stn-val {
                    font-size: 16px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    color: #4B4B4B;
                    line-height: 22px;
                }
                .stn-label{
                    margin-top: 7px;
                    color: #8A8A8A;
                    line-height: 20px;
                }
            }
            &-active{
                background: #F7FCFF;
                border: 1px solid #36A4FF;
                .stn-info .stn-val {
                    color: #36A4FF;
                }
            }
        }
    }
    .bottom-st {
        display: flex;
        margin-top: 20px;
        .bst-box {
            margin-right: 20px;
            width: calc(25% - 15px);
            height: 56px;
            background: rgba(0,164,255,0.03);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            cursor: pointer;
            &:last-child{
                margin-right: 0;
            }
            .bb-left {
                display: flex;
                align-items: center;
                img{
                    width: 24px;
                    height: 24px;
                }
                .bb-label{
                    font-weight: 500;
                    margin-left: 20px;
                }
            }
            .bb-right {
                display: flex;
                align-items: center;
                .bb-val {
                    font-size: 20px;
                    font-family: PingFangSC, PingFang SC;
                    font-weight: 500;
                    &-blue{
                        color: #36A3FF;
                    }
                    &-green{
                        color: #4CC09E;
                    }
                    &-orange{
                        color: #FA8B16;
                    }
                    &-purple{
                        color: #4A72E5;
                    }
                }
                .bb-unit{
                   color: #BDBDBD;
                   margin-left: 4px;
                }
            }
            &-active{
                background: #F7FCFF;
                border: 1px solid #36A4FF;
            }
        }
    }
}
</style>
