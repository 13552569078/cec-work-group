<!--
 * @Description: 音视频通话组件
 * @Author: qiyongguo
 * @Date: 2023-05-05
-->
<template>
  <div ref="communicaitonWrapper" :style="{width,height}" class="reltime-communication">
    <div v-if="cType" class="c-head">{{ cType === 2 ? '视频呼叫' : '语音呼叫' }}</div>
    <div v-if="cType" class="c-close" @click.stop="hangup"><i class="el-icon-close" /></div>
    <div v-if="cType" class="c-progress">
      <div class="c-status">{{ realTimeStatus }}</div>
      <div class="c-content">
        <audio v-if="cType === 1" id="voiceTag" ref="voiceTag" class="voice-tag" autoplay />
        <video
          v-if="cType === 2"
          v-show="cBtnText === '挂断'"
          id="localVideoTag"
          ref="localVideoTag"
          class="l-video"
          autoplay
        />
        <video
          v-if="cType === 2"
          v-show="cBtnText === '挂断'"
          id="remoteVideoTag"
          ref="remoteVideoTag"
          class="r-video"
          autoplay
        />
        <div v-if="cType === 1 || (cType === 2 && cBtnText === '取消')" class="callee-info">
          <el-avatar :size="180" :src="calleeInfo.avatar || require('@/assets/nan.png')" fit="fill" />
          <div class="callee-name">{{ calleeInfo.name }}</div>
          <div class="callee-name callee-org">{{ calleeInfo.orgName || '-' }}</div>
        </div>
      </div>
      <div class="c-btn" @click.stop="hangup">
        <div class="hang-icon" />
        <span class="hangup-text">{{ cBtnText }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import RZTTool from '@/utils/RZTTool'
// import service from '@/api/dispatch'
export default {
  name: 'ShzlAllElementsIndex',

  data() {
    return {
      loginFlag: false, // 登录标志
      width: '0px',
      height: '0px',
      realTimeStatus: '',
      calleeInfo: null, // 被叫用户信息
      cBtnText: '',
      cType: '', // 通话类型  1语音 2视频
      countTimeInterval: null,
      communicationTime: 0, // 通话时长--秒
      establishFlag: true,
      loginAgainInfo: null,
      loginAgainType: ''
    }
  },
  beforeDestroy() {
    RZTTool.quit()
    this.countTimeInterval && clearInterval(this.countTimeInterval)
    this.$bus.$off('rtCommunication', this.rtCommunicationFn)
  },
  created() {
    this.$bus.$on('rtCommunication', this.rtCommunicationFn)
  },
  // 登录融合通信平台
  mounted() {
    console.log(this.$store.getters.profile)
    const loginPhone = this.$store.getters.profile?.username || ''
    const defaultPwd = window.GLOBAL_CONFIG.rzt.defaultPwd

    if (loginPhone) {
      try {
        RZTTool.login(loginPhone, defaultPwd, this.realtimeCommunication)
      } catch (e) {
        console.log(1111, e)
      }
      this.loginFlag = true
    }
  },
  methods: {
    async rtCommunicationFn(cType, info) {
      // if (!this.establishFlag) {
      //   this.$message.error('通信通道建立失败，请联系管理员检查通信网络！')
      //   return
      // }
      this.loginAgainInfo = null
      this.loginAgainType = ''
      if (!this.loginFlag) {
        this.loginAgainInfo = info
        this.loginAgainType = cType

        const loginPhone = this.$store.getters.profile?.username || ''
        const defaultPwd = window.GLOBAL_CONFIG.rzt.defaultPwd
        if (loginPhone) {
          RZTTool.login(loginPhone, defaultPwd, this.realtimeCommunication)
          // this.loginFlag = true
        } else {
          this.$message.info('当前登录用户无融合通信号码信息，请联系管理员配置！')
          return
        }
      } else {
        this.getNumCall(cType, info)
      }
    },
    async getNumCall(cType, info) {
      this.calleeInfo = {
        ...info
        // jobNum: '1002'
      }
      if (info?.jobNum) {
        this.$nextTick(() => {
          this.cType = cType
          this.callOut()
        })
      } else {
        this.$message.warning(`被叫人[${info.name}]通信号码为空！`)
      }
    },
    realtimeCommunication(cbType, cbData) {
      switch (cbType) {
        case 'registered':
          this.loginFlag = true
          if (this.loginAgainType) {
            this.getNumCall(this.loginAgainType, this.loginAgainInfo)
          }
          break
        case 'accountFail':
          this.loginFlag = false
          this.hangup()
          break
        case 'remoteAnswerCall':
          this.cBtnText = '挂断'
          this.countCommunicationTime()
          break
        case 'remoteHangupCall':
          this.$message.info('对方已挂断！')
          this.hideCallWindow()
          break
        case 'callEstablishFailed':
          this.hideCallWindow()
          break
        case 'onClose':
          console.log('通信通道建立失败，请联系管理员检查通信网络！可能是主动关闭')
          this.establishFlag = false
          break
      }
    },
    // pc呼出
    callOut() {
      this.width = '960px'
      this.height = '600px'
      this.realTimeStatus = '等待对方接受通话...'
      this.cBtnText = '取消'
      this.$nextTick(() => {
        if (this.cType === 1) {
          RZTTool.callAudio(this.$refs.voiceTag, this.calleeInfo.jobNum)
        } else if (this.cType === 2) {
          RZTTool.callVideo(this.$refs.remoteVideoTag, this.$refs.localVideoTag, this.calleeInfo.jobNum)
        }
      })
    },
    // 取消 挂断
    hangup() {
      this.cType = ''
      this.hideCallWindow()
      RZTTool.hangupCall()
    },
    // 计算通话时长
    countCommunicationTime() {
      this.countTimeInterval = setInterval(() => {
        this.communicationTime++
        const second = this.communicationTime % 60
        const min = Math.floor(this.communicationTime / 60)
        this.realTimeStatus = `${min > 10 ? min : '0' + min}:${second > 10 ? second : '0' + second}`
      }, 1000)
    },
    // 隐藏通话窗口 所有值置空
    hideCallWindow() {
      this.width = '0px'
      this.height = '0px'
      // 还原默认值
      this.$refs.communicaitonWrapper.style.left = 'calc(50% - 541px)'
      this.$refs.communicaitonWrapper.style.top = 'calc(50% - 338px)'
      this.realTimeStatus = ''
      this.calleeInfo = null
      this.cType = ''
      this.cBtnText = ''
      this.countTimeInterval && clearInterval(this.countTimeInterval)
      this.communicationTime = 0
      this.countTimeInterval = null
    }
  }
}
</script>

<style lang="scss" scoped>
.reltime-communication {
  position: fixed;
  z-index: 99999;
  left: calc(50% - 541px);
  top: calc(50% - 338px);
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 18px;
  background: #FFFFFF;
  box-shadow: 0px 12px 24px 0px rgba(41,48,64,0.2);
  border-radius: 2px;
  .c-head {
    position: absolute;
    left: 28px;
    top: 20px;
    font-weight: 500;
    color: #202020;
  }
  .c-close {
    position: absolute;
    right: 30px;
    top: 20px;
    cursor: pointer;
    color: #4B4B4B;
  }
  .c-progress {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 120px 0 74px 0;
    .c-status {
      font-size: 18px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 500;
      color: #4B4B4B;
    }
    .c-btn {
      z-index: 10;
      cursor: pointer;
      text-align: center;
      .hang-icon {
        width: 40px;
        height: 40px;
        background-image: url('~@/assets/挂断.png');
        background-repeat: no-repeat;
        background-size: 100%;
        margin-bottom: 6px;
      }
      .hangup-text {
        font-size: 14px;
        margin-top: 10px;
      }
    }
    .c-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 60px;
      width: 100%;
      .callee-info {
        ::v-deep{
          .el-avatar{
            background: #D7D6D4;
          }
        }
        .callee-name {
          text-align: center;
          margin-top: 20px;
          font-size: 18px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 500;
          color: #4B4B4B;
        }
        .callee-org {
          font-size: 14px;
        }
      }
      video {
        // background: rgba(1, 117, 213, 0.19);
        // box-shadow: inset 0px 0px 29px 0px rgba(78, 187, 255, 0.17);
        // border: 1px solid rgba(51, 187, 255, 0.2);
        width: calc(50% - 20px);
        height: 270px;
        margin: 0 0 20px 0;
        vertical-align: top;
        &:first-child{
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
