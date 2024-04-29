<template>
  <div class="event-process-list-whh">
    <span style="display: inline-block; margin-bottom: 12px; color: #313131;">流程截止时间：{{ eventInfo.procDeadTime || '-' }}</span>
    <event-title title="事件流程" />
    <div class="content mb24 mt22">
      <div class="fangkuai" />
      <div class="flowboxwp">
        <div v-for="(item, index) in useProcessList" :key="index" class="fbw_e">
          <div :class="{'quan': true, 'lanse': index === 0}" />
          <div class="qatitle">
            <em>{{ item.activityName }}</em>
            <span>{{ item.activityId === 'handle'||item.activityId === 'dispatch' ? item.endTime : item.startTime }}</span>
          </div>
          <div class="qdetl">
            <div class="shang">
              <div class="zz"><i />
                <!-- 处置的节点内容需要单独处理 -->
                <template v-if="item.activityId === 'handle' && item.busThirdProcess && item.busThirdProcess.length">
                  <span>{{ item.busThirdProcess[0].dealStatus? handleStatus(Number(item.busThirdProcess[0].dealStatus)): '接收' }}</span>
                </template>
                <span v-else>{{ item.action }}</span>
              </div>
              <div class="mm">
                <template v-if="item.roleAnduser&&item.roleAnduser.length>40">
                  <el-tooltip class="item" effect="light" :content="item.roleAnduser" placement="top">
                    <span>{{ item.roleAnduser.substr(0, 40) + '...' }}</span>
                  </el-tooltip>
                </template>
                <span v-else>{{ item.roleAnduser }}</span>
              </div>
              <div class="rr" @click="opendetail(item)">
                <span />
                <i :class="{'el-icon-arrow-down': item.isHidden, 'el-icon-arrow-up': !item.isHidden}" />
              </div>
            </div>
            <div v-if="!item.isHidden" class="xia">
              <el-table v-if="(formatRowTable(item)).length > 0" :data="formatRowTable(item)" style="width: 100%">
                <el-table-column prop="schedulType" label="调度类型" />
                <el-table-column prop="deptName" label="调度组织" />
                <el-table-column prop="roleName" label="调度角色" />
              </el-table>
              <div class="xia_e">
                <div class="xetitle">处理意见</div>
                <div class="xecnt">
                  <template v-if="item.activityId === 'report'">
                    <span style="font-weight: 600;">调度截止时间：</span>
                    <span style="font-weight: 600;">{{ item.dispatchDeadTime || '-' }}</span>
                  </template>
                  <template v-else-if="item.activityId === 'dispatch'">
                    <span style="font-weight: 600;">调度超时：</span>
                    <span style="font-weight: 600;">{{ item.dispatchOverTimeFlagName || '-' }}</span>；
                    <span style="font-weight: 600;">处置截止时间：</span>
                    <span style="font-weight: 600;">{{ item.handleDeadTime || '-' }}</span>
                  </template>
                  <template v-else-if="item.activityId === 'handle'">
                    <span style="font-weight: 600;">处置超时：</span>
                    <span style="font-weight: 600;">{{ item.handleOverTimeFlagName || '-' }}</span>
                  </template>
                  <template v-else>
                    <span>{{ item.comment || '-' }}</span>
                  </template>
                </div>
              </div>
              <div v-if="item.media && item.media.length > 0" class="xia_e xia_e_media">
                <div class="xetitle">事件多媒体</div>
                <event-media :event-media="item.media" />
              </div>

              <div v-if="item.busThirdProcess && item.busThirdProcess.length > 0" class="ziliuchengbox">
                <div class="xetitless">{{ item.roleAnduser }}处理流程</div>
                <div class="content">
                  <div class="flowboxwp">
                    <div v-for="(item2, index2) in item.busThirdProcess" :key="index2" class="fbw_e">
                      <div :class="{'quan': true, 'lanse': index2 === 0}" />
                      <div class="qatitle">
                        <em>{{ handleStatus(Number(item2.dealStatus)) }}</em>
                        <span>{{ item2.dealTime }}</span>
                      </div>
                      <div class="qdetl">
                        <div class="shang">
                          <div class="zz"><i /><span>{{ item2.dealOption }}</span></div>
                          <div class="rr" @click="opendetail(item2)">
                            <span>详情</span>
                            <i :class="{'el-icon-arrow-down': item2.isHidden, 'el-icon-arrow-up': !item2.isHidden}" />
                          </div>
                        </div>
                        <div v-if="!item2.isHidden" class="xia">
                          <div class="xia_e">
                            <div class="xetitle">处理人</div>
                            <div class="xecnt">{{ item2.dealUserName || '-' }}</div>
                          </div>
                          <div class="xia_e">
                            <div class="xetitle">处理人电话</div>
                            <div class="xecnt">{{ item2.dealUserPhone || '-' }}</div>
                          </div>
                          <!-- 处置状态 1：待处理2：处理中3：完成4：驳回 5:异常 -->
                          <!-- <div class="xia_e">
                            <div class="xetitle">处理状态</div>
                            <div class="xecnt">{{ item2.dealStatus == 1 ? '待处理' : (item2.dealStatus == 2 ? '处理中' : (item2.dealStatus == 3 ? '完成' : (item2.dealStatus == 4 ? '驳回' : (item2.dealStatus == 5 ? '异常' : '未知')))) }}</div>
                          </div> -->
                          <div class="xia_e" style="width: 100%;">
                            <div class="xetitle">处理意见</div>
                            <div class="xecnt">{{ item2.dealComment || '-' }}</div>
                          </div>
                          <div v-if="item2.busMediaList && item2.busMediaList.length > 0" class="xia_e xia_e_media" style="width: 100%; margin-top: 0px; margin-bottom: 0px;">
                            <div class="xetitle">事件多媒体</div>
                            <event-media :event-media="item2.busMediaList" event-typeuse="thirdParty" />
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import eventTitle from './eventTitle'
import eventMedia from './eventMedia'

export default {
  name: 'ProcessListWhh',
  components: {
    eventTitle,
    eventMedia
  },
  props: {
    processList: {
      type: Array,
      default: () => []
    },
    eventInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
    useProcessList() {
      return this.processList.map((val, idx) => {
        const roleAnduserArr = []
        if (val.roleName) roleAnduserArr.push(val.roleName)
        if (val.userName) roleAnduserArr.push(val.userName)
        this.$set(val, 'roleAnduser', roleAnduserArr.join('-'))
        if (idx === 0) {
          this.$set(val, 'isHidden', false)
        } else {
          this.$set(val, 'isHidden', true)
        }
        if (val.busThirdProcess && val.busThirdProcess.length > 0) {
          val.busThirdProcess.forEach((val2, idx2) => {
            if (idx2 === 0 && 0) {
              this.$set(val2, 'isHidden', false)
            } else {
              this.$set(val2, 'isHidden', true)
            }
          })
        }
        val.activityName = val.activityName === '处理' ? '处置' : val.activityName
        return val
      })
    }
  },
  watch: {
    processList: {
      handler(nval) {
        console.log('processList', nval)
      },
      deep: true
    }
  },
  methods: {
    // 处理处置状态
    handleStatus(dealStatus) {
      return dealStatus === 1 ? '待处理' : (dealStatus === 2 ? '处理中' : (dealStatus === 3 ? '完成' : (dealStatus === 4 ? '驳回' : (dealStatus === 5 ? '异常' : '未知'))))
    },
    opendetail(item) {
      if (item.isHidden === true) {
        this.$set(item, 'isHidden', false)
      } else {
        this.$set(item, 'isHidden', true)
      }
    },
    // 格式化面板数据
    formatRowTable(item) {
      const flowsList = item.flowsList?.map((item) => {
        return {
          ...item,
          schedulType: '协办'
        }
      }) || []
      const notifyList = item.notifyList?.map((item) => {
        return {
          ...item,
          schedulType: '知会'
        }
      }) || []
      const list = [...flowsList, ...notifyList]
      // const list = [{
      //   schedulType: '协办',
      //   deptName: '白水桥调解所',
      //   roleName: '调解员'
      // }, {
      //   schedulType: '知会',
      //   deptName: '白水桥派出所',
      //   roleName: '公安'
      // }]
      return list
    }
  }
}
</script>
<style lang="scss" scoped>
.event-process-list-whh {
  .content {
    border-left: 2px solid #EDEDED;
    position: relative;
    padding-left: 15px;
    .fangkuai {
      width: 10px;
      height: 10px;
      background: #FFFFFF;
      border: 2px solid #EDEDED;
      position: absolute;
      left: -6px;
      top: -9px;
      z-index: 2;
    }
    .flowboxwp {
      .fbw_e {
        position: relative;
        padding-top: 20px;
        .quan {
          position: absolute;
          width: 14px;
          height: 14px;
          background: #FFFFFF;
          border: 3px solid #8A8A8A;
          border-radius: 50%;
          left: -23px;
          top: 23px;
          z-index: 4;
        }
        .lanse {
          border-color: #36A4FF;
        }
        .qatitle {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          em {
            height: 20px;
            background: rgba(54,164,255,0.1);
            border-radius: 11px 2px 11px 2px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #36A4FF;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 11px;
            font-style: normal;
          }
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4B4B4B;
            margin-left: 8px;
          }
        }
        .qdetl {
          background: #F5F7FA;
          box-shadow: inset 0px 0px 30px 0px #DCE9F5;
          margin-top: 15px;
          .shang {
            height: 43px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 16px;
            .zz {
              height: 20px;
              background: #EAF5FF;
              border-radius: 10px;
              padding: 0 10px;
              display: flex;
              justify-content: center;
              align-items: center;
              i {
                width: 4px;
                height: 4px;
                background: #8DA5B8;
                border-radius: 4px;
              }
              span {
                font-size: 12px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #8DA5B8;
                margin-left: 5px;
              }
            }
            .mm {
              flex-grow: 1;
              margin-left: 16px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #4B4B4B;
            }
            .rr {
              cursor: pointer;
              span {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B4B4B;
              }
              i {
                color: #999999;
                margin-left: 5px;
                font-weight: bold;
              }
              i.el-icon-arrow-up {
                color: #36A4FF;
              }
            }
          }
          .xia {
            margin: 0 16px;
            border-top: 1px solid #EDEDED;
            padding: 16px 0;
            ::v-deep {
              .el-table {
                background: #F1F3F8;
                margin-bottom: 15px;
              }
              .el-table tr {
                background: #F1F3F8;
              }
              .el-table th {
                background: #F1F3F8;
                border-bottom: 2px solid #EDEDED;
              }
              .el-table td {
                background: #F1F3F8;
                border-bottom: 2px solid #EDEDED;
              }
              .el-table th .cell {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8A8A8A;
              }
              .el-table td .cell {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B4B4B;
              }
              .el-table--small td, .el-table--small th {
                padding: 4px;
              }
            }
            .xia_e {
              .xetitle {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #8A8A8A;
              }
              .xecnt {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #4B4B4B;
                line-height: 20px;
                word-break: break-all;
                margin-top: 10px;
              }
            }
            .xia_e_media {
              margin-top: 15px;
              .xetitle {
                margin-bottom: 10px;
              }
            }
          }
        }
      }
    }
  }
  .ziliuchengbox {
    margin-top: 15px;
    .xetitless {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #36A4FF;
    }
    .content {
      // background: rgb(252, 252, 252, 0.5);
      // padding-right: 14px;
      padding-bottom: 15px;
      border-left: 2px solid #e6e5e4;
      margin-top: 10px;
      .flowboxwp {
        .fbw_e {
          .qdetl {
            background: #F1F3F8;
            box-shadow: none;
            margin-top: 15px;
            .xia {
              display: flex;
              flex-wrap: wrap;
              .xia_e {
                width: 33.33%;
                margin-bottom: 15px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
