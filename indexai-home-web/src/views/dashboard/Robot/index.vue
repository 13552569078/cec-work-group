<template>
  <div class="robot-container">
    <div class="chart-container">
      <div class="chart-content" id="contentRef">
        <div :class="['chart-item', item.class]" v-for="item in chatList" :key="item">
          <div class="content-container">
            <div class="user" v-if="item.class === 'question'"></div>
            <div class="text">
              <template v-for="itx in item.data" :key="itx.text">
                <div v-if="itx.type === 'text'" v-html="itx.text"></div>
                <chart v-if="itx.type === 'chart'" :option="itx.text" />
                <table-chat v-if="itx.type === 'table'" :table-data="itx.text" />
                <card-chat v-if="itx.type === 'card'" :card-data="itx.text" />
                <report-chat v-if="itx.type === 'report'" :report-data="itx.text" />
              </template>
            </div>

            <!-- <div class="text" v-html="item.text"></div> -->
          </div>
        </div>
        <div class="loading" v-if="loading || echartLoading">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>

      <div class="bottom">
        <el-form-item label=""
          ><el-input
            type="textarea"
            rows="3"
            v-model="question"
            placeholder="希望我能帮你做什么"
            style="width: 100%; height: 100px"
            @keyup.enter="searchFn('ws')"
          />
          <el-button
            type="primary"
            class="serach-btn top"
            @click="searchFn('api')"
            :disabled="loading || loading2"
            v-if="hasApi"
            >提交
          </el-button>
          <el-button
            type="primary"
            class="serach-btn"
            @click="searchFn('ws')"
            :disabled="loading || loading2"
            >提交</el-button
          >
          <!-- <el-button
            type="primary"
            class="serach-btn"
            @click="searchFn('zhuiwen')"
            :disabled="loading || loading2"
            >追问</el-button
          > -->
        </el-form-item>
        <div :class="['speach', loading2 ? 'speaching' : '']" @click="handelClick">
          <span v-if="loading2">{{ secend }}s</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isObject, isNumber } from 'lodash'
import moduleSrv from '/@/api/index'
import chart from './chart.vue'
import TableChat from './table-chat.vue'
import CardChat from './card.vue'
// import testData from './test'
import ReportChat from './report.vue'

// import echarts from '/@/utils/lib/echarts'

const route = useRoute()
const api = computed(() => route.meta.api || {})

//是否开启API按钮
const hasApi = computed(() => defaultSettings.hasApi)
const chatList = ref<Array<any>>([])
const loading = ref(false)
const echartLoading = ref(false)

// setInterval(() => {
//   console.log('chatList', chatList)
// }, 10000)

// const tableDataTest = {
//   type: 'table',
//   tHead: [
//     {
//       prop: 'name',
//       label: '名称'
//     },
//     {
//       prop: 'date',
//       label: '日期'
//     },
//     {
//       prop: 'address',
//       label: '地址'
//     }
//   ],
//   tBody: [
//     {
//       date: '2016-05-03',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles'
//     },
//     {
//       date: '2016-05-03',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles'
//     },
//     {
//       date: '2016-05-03',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles'
//     },
//     {
//       date: '2016-05-03',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles'
//     },
//     {
//       date: '2016-05-03',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles'
//     },
//     {
//       date: '2016-05-02',
//       name: 'Tom',
//       address: 'No. 189, Grove St, Los Angeles'
//     }
//   ]
// }

// const cradDataTest = {
//   type: 'card',
//   cardList: [
//     {
//       name: '氢能源产业指数',
//       value: '21.45'
//     },
//     {
//       name: '氢能源产业指数',
//       value: '21.45'
//     },
//     {
//       name: '氢能源产业指数',
//       value: '21.45'
//     },
//     {
//       name: '氢能源产业指数',
//       value: '21.45'
//     },
//     {
//       name: '氢能源产业指数',
//       value: '21.45'
//     }
//   ]
// }

// 欢迎语句
function init() {
  chatList.value.push({
    data: [{ text: '你好，我是智能数字人，很高兴为您服务！', type: 'text' }],
    class: 'robot'
  })
  // chatList.value.push({
  //   data: [{ text: testData.data[0], type: 'chart' }],
  //   class: 'robot'
  // })
  // chatList.value.push({
  //   data: [{ text: tableDataTest, type: 'table' }],
  //   class: 'robot'
  // })
  // chatList.value.push({
  //   data: [{ text: cradDataTest, type: 'card' }],
  //   class: 'robot'
  // })
  // chatList.value.push({
  //   data: [{ text: cradDataTest, type: 'report' }],
  //   class: 'robot'
  // })
}

const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time))
}
let ws: any = null
const len = computed(() => chatList.value.length)
// const token =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNjg3NTk5MTg0fQ.RZdx8GgESfFd4PZFSrmlFWZ9WIVDteWj70fcMZCDhkU'
const token = defaultSettings.wsToken
const initSocket = async (params: any) => {
  console.log('defaultSettings.wsUrl ', defaultSettings.wsUrl)
  ws = new WebSocket(defaultSettings.wsUrl + '?token=' + token)
  // ws = new WebSocket(defaultSettings.wsUrl)
  //接听服务器发回的信息并处理展示
  ws.onmessage = async function (data: any) {
    // console.log(data)
    if (ws.readyState === WebSocket.CLOSED) {
      loading.value = false
    }

    if (data) {
      console.log('data111 =>  ', data.data)
      try {
        const res = JSON.parse(data.data)
        if (res?.code == -1) {
          // store.logout(true)
          console.log('大模型WS token错误!')
        }
        if (!isObject(res)) {
          chatList.value[len.value - 1].text += data.data.replace('\n', '<br>')
          goBotton()
        }
        if (isNumber(res)) {
          const cur = chatList.value[len.value - 1].data
          cur[cur.length - 1].text += '' + data.data
          goBotton()
          //todo  这里增加一个标志位,处理图表
        }
        if (res.flag === 'chart') {
          echartLoading.value = true
          const chartData = res.data
          // 测试数据
          // const chartData = testData.data
          // console.log('chartData =>  ', chartData)

          for (let i = 0; i < chartData.length; i++) {
            const cur = chatList.value[len.value - 1].data
            const item = chartData[i]
            if (item.type === 'text') {
              for (let j = 0; j < (item.text as string).length; j++) {
                // cur.push({ text: item.data[j], type: 'text' })
                cur[cur.length - 1].text += (item.text as string)[j]
                goBotton()
                await sleep(50)
              }
            }
            if (item.type.includes('Chart')) {
              await sleep(2000)
              cur.push({
                type: 'chart',
                text: item
              })
              cur.push({ text: '', type: 'text' })
              goBotton()
            }
            if (item.type === 'card' || item.type === 'table' || item.type === 'report') {
              await sleep(2000)
              cur.push({
                type: item.type,
                text: item
              })
              cur.push({ text: '', type: 'text' })
              goBotton()
            }
          }
          echartLoading.value = false
          goBotton()
        }
        if (res.flag === 'end') {
          uid.value = res?.uid || ''
          loading.value = false
        }
      } catch (error) {
        const cur = chatList.value[len.value - 1].data
        cur[cur.length - 1].text += '' + data.data
        // chatList.value[len.value - 1].text += data.data
        goBotton()
      }
    }
  }

  ws.onerror = function () {
    loading.value = false
    if (len.value > 0 && chatList.value[len.value - 1].text === '') {
      chatList.value[len.value - 1].text += '抱歉，服务开小差啦！'
      goBotton()
    }
  }
  ws.onclose = function () {
    loading.value = false
    console.log('ws closed2')
  }
  ws.onopen = function () {
    // 重连之后传递信息
    params?.question && getDataByWebsocket(params)
  }
  // }
}

const question = ref('')
const uid = ref('')

const searchFn = (type = 'ws') => {
  if (loading.value) {
    return
  }
  if (loading2.value) {
    return
  }
  if (question.value == '') {
    return
  }

  loading.value = true
  // 显示提问，处理入参

  chatList.value.push({ data: [{ text: question.value, type: 'text' }], class: 'question' })
  const params = {
    question: question.value.trim(),
    uid: type === 'zhuiwen' ? uid.value : '',
    ...api.value
  }
  console.log('params', params)
  // 清除对话框
  question.value = ''
  // 定位到底端
  goBotton()

  if (type === 'ws' || type === 'zhuiwen') {
    getDataByWebsocket(params)
  } else if (type === 'api') {
    getDataByAPI(params)
  }
}

const getDataByAPI = (params: any) => {
  moduleSrv
    .chat(params)
    .then((res: any) => {
      uid.value = res.data?.uid || ''
      chatList.value.push({ text: res.data.response, class: 'robot' })
      // 定位到底端
      goBotton()
    })
    .finally(() => {
      loading.value = false
    })
}

let timer_1: any = 0
let reconnect_num = 0 // 允许重次数
const getDataByWebsocket = (params: any) => {
  if (reconnect_num >= 10) return
  timer_1 = setTimeout(() => {
    // if (token.value && ws.readyState === WebSocket.OPEN) {
    if (ws.readyState === WebSocket.OPEN) {
      reconnect_num = 0
      ws.send(JSON.stringify(params))
      chatList.value.push({ data: [{ text: '', type: 'text' }], class: 'robot' })
      timer_1 && clearTimeout(timer_1)
    } else {
      console.log('断开连接，尝试重连')
      reconnect_num++
      initSocket(params)
    }
  }, 1000)
}

const goBotton = () => {
  // 定位到底端
  nextTick(() => {
    var div = document.getElementById('contentRef') as any
    div.scrollTop = div.scrollHeight
    div = null
  })
}
let mediaRecorder: any = null
let ws2: any = null

const loading2 = ref(false)
const secend = ref(30)
const isAsk = ref(false)
const handelClick = () => {
  isAsk.value = !isAsk.value
  if (isAsk.value) {
    startRecording()
  } else {
    stopRecording()
  }
}

let timer: any = null
const startRecording = async () => {
  loading2.value = true
  secend.value = 30
  timer = setInterval(function () {
    secend.value--
    if (secend.value == 0) {
      isAsk.value = false
      stopRecording()
    }
  }, 1000)
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  let options = { mimeType: 'audio/webm;codecs=opus' }
  if (MediaRecorder.isTypeSupported(options.mimeType)) {
    mediaRecorder = new MediaRecorder(stream, options)
  } else {
    console.error(`${options.mimeType} is not Supported`)
    return
  }
  // Create a WebSocket connection to the server
  ws2 = new WebSocket(defaultSettings.wss)

  ws2.onmessage = function (event: any) {
    // Assume the server returns the transcribed text as a string
    let message = event.data
    if (message.startsWith('[CONTINUE]')) {
      // Append the text to the transcript
      if (loading2.value) question.value = message.replace('[CONTINUE]', '')
      console.log('question =>  ', question)
    } else if (message.startsWith('[END]')) {
      loading2.value = false
      // Replace the transcript with the final text, and close the WebSocket connection
      ws.close()
      console.log('WebSocket connection closed by server')
    }
  }

  ws2.onopen = function () {
    let audioContext = new AudioContext()
    let sampleRate = audioContext.sampleRate
    ws2.send('START##' + sampleRate)
    mediaRecorder.ondataavailable = function (e: any) {
      // Send this chunk of audio to the server via WebSocket
      ws2.send(e.data)
    }
    mediaRecorder.start(1000) // Start recording, and generate a dataavailable event every 1 second
    // Inform the server that recording has started, and send the sample rate
    console.log('start connection ' + sampleRate)
  }
}

const stopRecording = () => {
  if (timer) clearInterval(timer)
  loading2.value = false
  mediaRecorder.stop()

  // Inform the server that recording has ended
  ws2.send('STOP')
}

onBeforeMount(() => {
  initSocket({})
  setTimeout(function () {
    init()
  }, 1000)
})

onBeforeUnmount(() => {
  if (ws) {
    console.log('ws closed')
    //离开页面后关闭WebSocket连接
    ws.close()
    ws = null
  }
  if (ws2) {
    console.log('ws2 closed')
    //离开页面后关闭WebSocket连接
    ws2.close()
    ws2 = null
  }
  if (timer) clearInterval(timer)
})
</script>
<style lang="scss" scoped>
::v-deep .serach-btn {
  background: #2ca9df;
}
.robot-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: row;
  position: relative;

  overflow: hidden;
  font-size: 16px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 24px;

  .chart-container {
    width: 100%;
    position: relative;
    overflow: hidden;
    padding-bottom: 24px;

    .chart-content {
      width: 100%;
      height: calc(100% - 100px - 24px);
      min-height: 100px;
      overflow: hidden;
      overflow-y: auto;
      padding: 20px 8px;
      // background: rgba(255, 255, 255, 0.06);
      border-radius: 4px 4px 4px 4px;

      .chart-item {
        width: 100%;

        .content-container {
          width: 100%;
          display: inline-block;
          padding: 12px;
          line-height: 22px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          .user {
            width: 40px;
            height: 40px;
            background: url('/@/assets/images/face.png') no-repeat;
            background-size: 100% 100%;
            margin-right: 12px;
          }
          .text {
            width: calc(100% - 10px - 12px);
            white-space: pre-line;
            :deep() {
              img {
                width: 150px;
              }
              a {
                color: #36a4ff;
              }
            }
          }
        }
      }
      .robot .content-container {
        background: rgba(88, 157, 255, 0.16);
        border-radius: 0px 0px 0px 0px;
        border-left: 4px solid #0388fb;
      }
      .question .content-container {
        background: #0388fb;
        border-radius: 2px 2px 2px 2px;
      }
    }
    .bottom {
      margin-top: 24px;
      width: 100%;
      position: relative;
      .speach {
        cursor: pointer;
        width: 30px;
        height: 30px;
        background: url('/@/assets/images/speach.svg') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        bottom: -15px;
        left: 50%;
        margin-left: -15px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
      }
      .speaching {
        animation: myBreath 1s linear infinite;
      }
      @keyframes myBreath {
        0% {
          transform: scale(0.88);
        }
        50% {
          transform: scale(100%);
        }
        100% {
          transform: scale(0.88);
        }
      }
      :deep() {
        .el-form-item {
          padding-left: 0;
          height: 100px;
          background: rgba(88, 157, 255, 0.12);
          border-radius: 6px;
          border: 1px solid #446b9e;
        }
        .el-textarea {
          padding: 12px;
          height: 100%;
          .el-textarea__inner {
            padding: 0;
            background-color: transparent;
            box-shadow: none;
            border: none;
            &:hover {
              box-shadow: none;
              border: none;
            }
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #ffffff;
            line-height: 22px;
          }
        }
        .el-input {
          --el-input-text-color: 1px solid rgba(255, 255, 255, 0.18);
          --el-input-border: 1px solid rgba(255, 255, 255, 0.18);
          --el-input-hover-border: 1px solid rgba(255, 255, 255, 0.18);
          --el-input-focus-border: 1px solid rgba(255, 255, 255, 0.18);
        }
        .el-input__wrapper {
          height: 56px;
          background: rgba(189, 199, 255, 0.06);
          border-radius: 6px 0 0 6px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-right: none;
          backdrop-filter: blur(10px);
          box-shadow: none;
        }
        .el-input__inner {
          font-size: 18px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 25px;
        }
        .el-button {
          min-width: 54px !important;
          // width: 54px !important;
          height: 28px;
          background: #0388fb !important;
          border-radius: 2px;
          backdrop-filter: blur(18px);
          padding: 0;
          text-align: center;
          position: absolute;
          right: 12px;
          bottom: 12px;
          font-size: 16px;
        }
        .top {
          background: red !important;
          position: absolute;
          right: 12px;
          top: 12px;
        }
        .right {
          position: absolute;
          right: 74px;
          bottom: 12px;
          color: #ffffff !important;
          background: #336193 !important;
        }
      }
    }
    .loading {
      height: 20px;
      width: 100%;
      display: flex;
      animation: dot 3s infinite step-start both;
      @keyframes dot {
        33% {
          transform: translateX(-32px);
        }
        66% {
          transform: translateX(-16px);
        }
      }
      > div {
        margin-right: 8px;
      }
      > div:nth-child(1) {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2670ff;
      }
      > div:nth-child(2) {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #c25fff;
      }
      > div:nth-child(3) {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff51cf;
      }
    }
  }
}
</style>
