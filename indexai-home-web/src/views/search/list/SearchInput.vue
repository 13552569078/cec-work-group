<template>
  <div class="search-input">
    <el-form-item label=""
      ><el-input
        v-model="text"
        placeholder="请输入内容查询"
        style="width: 482px; height: 40px"
        @keyup.enter="searchFn"
        class="input-box"
      />
      <div class="clear" @click="text = ''">
        <svg-icon icon-class="close" />
      </div>
      <div class="speach" @click="handelClick">
        <svg-icon icon-class="speach-icon" style="width: 14px; height: 20px" />
      </div>
      <el-button type="primary" class="serach-btn" @click="searchFn"
        >智搜一下</el-button
      ></el-form-item
    >
  </div>
  <div class="types-container">
    <div
      v-for="item in types"
      :key="item.id"
      :class="['item', activeIndex == item.id ? 'active' : '']"
      @click="clickType(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['search'])
const text = ref('')

const types = ref([
  { id: -1, label: '全部' },
  { id: 5, label: '指标' },
  { id: 3, label: '专题' },
  { id: 14, label: '报告' },
  { id: 15, label: '舆情' },
  { id: 16, label: '视频' }
])
const activeIndex = ref(-1)
// 类型
const clickType = (item: any) => {
  activeIndex.value = item.id
  emit('search')
}
const searchFn = () => {
  emit('search')
}
const getParams = () => {
  return { text: text.value, type: activeIndex.value }
}
defineExpose({ text, getParams })

// 语音相关内容
let mediaRecorder: any = null
let ws: any = null

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
  ws = new WebSocket(defaultSettings.wss)

  ws.onmessage = function (event: any) {
    // Assume the server returns the transcribed text as a string
    let message = event.data
    if (message.startsWith('[CONTINUE]')) {
      // Append the text to the transcript
      text.value = message.replace('[CONTINUE]', '')
    } else if (message.startsWith('[END]')) {
      // Replace the transcript with the final text, and close the WebSocket connection
      ws.close()
      console.log('WebSocket connection closed by server')
    }
  }

  ws.onopen = function () {
    let audioContext = new AudioContext()
    let sampleRate = audioContext.sampleRate
    ws.send('START##' + sampleRate)
    mediaRecorder.ondataavailable = function (e: any) {
      // Send this chunk of audio to the server via WebSocket
      ws.send(e.data)
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
  ws.send('STOP')
}

onBeforeUnmount(() => {
  if (ws) {
    console.log('ws closed')
    //离开页面后关闭WebSocket连接
    ws.close()
    ws = null
  }
  if (timer) clearInterval(timer)
})
</script>
<style lang="scss" scoped>
.search-input {
  .input-box {
    position: relative;
    :deep() {
      --el-border-color: #638bee;
      --el-border-color-hover: #638bee;
      --el-input-focus-color: #638bee;

      .el-input__wrapper {
        height: 40px;
        justify-content: center;
        padding: 8px 170px 8px 20px;
        background: #06124f;
        box-shadow: inset 0px 0px 20px 0px #044f7c;
        border-radius: 4px;
        border: 1px solid #044f7c;
      }

      .el-input__inner {
        color: #ffffff;
        &::-webkit-input-placeholder {
          color: #ffffff;
        }
        &:-moz-placeholder {
          @extend %input_placeholder;
        }
        &:-ms-input-placeholder {
          @extend %input_placeholder;
        }
      }
    }
  }
  :deep() {
    .el-form-item {
      width: 100%;
      padding-left: 0;
      margin-bottom: 0;
    }
  }
  .clear {
    width: 40px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    right: 136px;
    padding: 0 13px;
    cursor: pointer;
  }
  .speach {
    width: 40px;
    height: 20px;
    line-height: 20px;
    position: absolute;
    right: 96px;
    border-left: 1px solid rgba(255, 255, 255, 0.32);
    padding: 0 13px;
    cursor: pointer;
  }
  .serach-btn {
    margin-left: -96px;
    z-index: 1;
    width: 96px;
    height: 40px;
    font-size: 16px;
    background: linear-gradient(90deg, #8dacfa 0%, #638bee 100%) !important;
  }
}
.types-container {
  display: flex;
  align-items: center;
  margin-top: 24px;
  .item {
    cursor: pointer;
    margin-right: 16px;
    width: 84px;
    height: 36px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(156, 187, 219, 0.12) 100%);
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 36px;
    text-align: center;
  }
  .active {
    border: 1px solid;
    border-image: linear-gradient(360deg, rgba(248, 233, 111, 1), rgba(247, 166, 111, 0)) 1 1;
    font-weight: 600;
    color: #fff8b4;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 44px;
      left: 31px;
      width: 22px;
      height: 22px;
      background: url('/@/assets/images/search/type-active.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
