<template>
  <div class="report-wrap">
    <div class="report-card">
      <div class="top">
        <img
          class="report-icon"
          :src="reportData.url.includes('.pdf') ? reportPdfIcon : reportWpsIcon"
          alt="icon"
        />
        <span class="title">{{ reportData.title }}</span>
      </div>
      <img src="../../../assets/images/line.png" class="line" alt="" />
      <div class="bottom">
        <el-button type="text" @click="openExtract">提炼核心</el-button>
        <el-button type="text" @click="donwnloadFile(reportData.url)">下载</el-button>
        <el-button type="text" :disabled="true">推送手机</el-button>
        <el-button type="text" :disabled="true">播报</el-button>
      </div>
    </div>
    <p class="text-tip" v-if="reportData.recommendations.length">
      您可以让我“浏览”、”提炼核心”,同时我还帮您找到了下列内容， 您是否需要
    </p>
    <ul class="recommendations">
      <li class="item" v-for="item in reportData.recommendations" :key="item">
        <img class="arrow" src="../../../assets/images/arrow.png" alt="" />
        <p class="text">{{ item }}</p>
      </li>
    </ul>
    <el-dialog :title="reportData.title" v-model="dialogVisible" width="50%">
      <div id="display"></div>
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">Cancel</el-button> -->
          <el-button type="primary" @click="dialogVisible = false"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { defineProps, ref } from 'vue'

import reportWpsIcon from '/@/assets/images/report-icon.png'
import reportPdfIcon from '/@/assets/images/report-icon-pdf.png'

const dialogVisible = ref(false)
const props = defineProps(['reportData'])

// const showExtract = ref('')

const openExtract = () => {
  dialogVisible.value = true
}

watch(dialogVisible, (newValue) => {
  if (newValue) {
    nextTick(() => {
      document.getElementById('display')!.innerHTML = ''
      displayTextWithInterval(props.reportData.extract, 20)
    })
  }
})

const displayTextWithInterval = (text: string, interval: number) => {
  let index = 0
  const display = document.getElementById('display')

  const timer = setInterval(() => {
    display!.innerHTML += text[index]
    index++
    if (index === text.length) {
      clearInterval(timer)
    }
  }, interval)
}

const donwnloadFile = (url: string) => {
  let a = document.createElement('a')
  document.body.appendChild(a)
  let fileName = props.reportData.title
  a.href = location.origin + '/' + import.meta.env.VITE_PUBLIC_PATH + url
  console.log(a.href)
  a.download = fileName
  a.click()
  // window.URL.revokeObjectURL(url);
  document.body.removeChild(a) // 兼容火狐必须使用这种写法
}
</script>

<style lang="scss" scoped>
.report-wrap {
  .content {
    width: 100%;
    height: 500px;
    overflow-y: auto;
  }
  .report-card {
    display: flex;
    flex-direction: column;
    background: #0a2f62;
  }

  .recommendations {
    margin-top: 20px;

    .item {
      display: flex;
      align-items: center;

      .arrow {
        width: 13px !important;
        height: 13px !important;
        margin-right: 12px;
      }

      .text {
        font-size: 14px;
        color: #ffffff;
      }
    }
  }

  .text-tip {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
  }

  .top {
    padding: 20px 24px;
    display: flex;
    align-items: center;

    .report-icon {
      width: 32px !important;
      height: 34px !important;
      margin-right: 12px;
    }

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
    }
  }

  .line {
    width: 100% !important;
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 52px;
  }
}
</style>
