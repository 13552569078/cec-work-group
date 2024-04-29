<template>
  <van-nav-bar title="附件依据项查看" style="--van-nav-bar-icon-color: var(--van-text-regular)" >
    <template #left>
      <van-icon name="arrow-left" size="18" color="var(--van-text-regular)"
        @click="$router.go(-1)" />
    </template>
  </van-nav-bar>
  <div class="grid-wrap" v-if="attachmentList&&attachmentList.length">
    <div v-for="k in attachmentList" :key="k.fileId" class="item" @click="showFile(k)">
      <img class="icon" :src="k.iconUrl">
      <span class="title van-ellipsis">{{k.originalName}}</span>
      <img class="end" :src="ArrowRight" alt="">
    </div>
  </div>
   <div class="grid-wrap" v-else>
      暂无数据
    </div>
  <div v-if="showVideo" class="video-box">
    <video class="video-sup" id="myvideo" controls>
      <source :src="videoUrl" type="video/mp4">
    </video>
     <van-icon class="close" name="close" size="28" color="var(--van-text-regular)"
        @click="closeVideo" />
  </div>
  <div v-show="showPdf" class="pdf-box">
     <van-icon class="close-pdf" name="close" size="18" color="var(--van-text-regular)"
        @click="closePdf" />
    <div id="pdf-view" style="width: 100%">
      <div id="pdf">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
import { ref, onBeforeUnmount } from "vue";
import FileIMAGE from "@/assets/images/attachment/FileIMAGE.png";
import FileVIDEO from "@/assets/images/attachment/FileVIDEO.png";
import FilePDF from "@/assets/images/attachment/FilePDF.png";
import ArrowRight from "@/assets/images/attachment/arrow-right.png";
import { useRouter, useRoute } from "vue-router";
import { ImagePreview } from "vant";
import { apiWarningObj } from "@/apis/modules/warning";
import { IgetListAlarmAttachmentsSpace } from "@/apis/modules/warning/model";

const router = useRouter();
const route = useRoute();

const showVideo = ref(false);
const showPdf = ref(false);
const videoUrl = ref('');
const basicFormate = { FileIMAGE, FileVIDEO, FilePDF };
const state = ref({
  pdfh5: null
});

const showFile = (k: IgetListAlarmAttachmentsSpace.Data) => {
  switch (k.attachmentType) {
    case 'IMAGE':
      ImagePreview({
        images: [k.url], // 需要预览的图片 URL 数组
        loop: false, // 是否开启循环播放
      });
      break;
    case 'VIDEO':
      showVideo.value = true;
      videoUrl.value = k.url;
      break;
    case 'PDF':
      showPdf.value = true;
      state.value.pdfh5 = new Pdfh5('#pdf', {
        pdfurl: k.url,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.2.228/cmaps/'
      });
      break;
    default:
      break;
  }
};

const closeVideo = () => {
  videoUrl.value = '';
  showVideo.value = false;
};
const closePdf = () => {
  state.value.pdfh5 = null;
  showPdf.value = false;
};

const attachmentList = ref();
const getAttachmentList = async() => {
  const res = await apiWarningObj.getListAlarmAttachments(route.query.id as string);
  attachmentList.value = res.data;
  if (attachmentList.value.length) {
    attachmentList.value.forEach((e: IgetListAlarmAttachmentsSpace.Data) => {
      e.iconUrl = basicFormate[`File${e.attachmentType}` as keyof typeof basicFormate];
    });
  }
};
getAttachmentList();

onBeforeUnmount(() => {
  closeVideo();
  closePdf();
});
</script>
<style lang="scss" scoped>
.grid-wrap {
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 16px 16px 8px;
  margin: 16px;
  gap: 24px;
  background: #ffffff;
  .item {
    width: 100%;
    height: 36px;
    display: flex;
    justify-content: space-between;
    text-align: left;
    .icon {
      width: 24px;
      height: 24px;
      margin-right: 6px;
    }
    .title {
      width: 100%;
      font-size: 12px;
      color: #8A8A8A;
      border-width: 0px 0px 0.5px 0px;
      border-style: solid;
      border-color: #EDEDED;
    }
    .end {
      width: 18px;
      height: 14px;
    }
  }
}
.video-box {
  position: absolute;
  display: flex;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2001;
  background: rgba(0, 0, 0);
  flex-direction: column;
  align-items: center;
  .video-sup {
    width: 100%;
    height: 80%;
  }
  .close {
    margin-top: 30px;
  }
}
.pdf-box {
  position: absolute;
  display: flex;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 2001;
  background: rgba(0, 0, 0);
  .close-pdf {
    position: absolute;
    right: 30px;
    top: 20px;
    z-index: 2002;
  }
}
</style>
