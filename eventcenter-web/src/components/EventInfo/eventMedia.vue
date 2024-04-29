<!--
 * @description 全局事件详情--事件详情--多媒体 布局重构
 * @date 2022-02-28
 * @author lism
-->
<template>
  <div class="event-media-list">
    <div v-for="type in mediaType" :key="type.id" class="media-type">
      <div v-if="(type.id===1 && reportMedias.length>0) || (type.id===2 && handleMedias.length>0)" :class="['title', {'map-title' : showMapTitle}]">
        <span>{{ type.name }}</span>
      </div>
      <ul class="content">
        <!-- 区分事件上报、事件处置 -->
        <li v-for="item in (type.id === 1) ? reportMedias : handleMedias" :key="item.id" class="media-item">
          <video
            v-if="
              item &&
                (item.mediaType.includes('video') ||
                  item.mediaType.includes('audio') || item.mediaType.includes('avi') || item.mediaType.includes('voice'))
            "
            controls="true"
            :src="item.mediaPath"
            :poster="getPoster(item.mediaType)"
            class="video"
          />
          <img v-else class="video" :src="item.mediaPath" alt="">
          <!-- hover 操作 -->
          <div class="hover">
            <div class="hover-wrapper">
              <span v-if="item.mediaType.includes('audio')" class="icon-radio icon" title="音频播放" @click.stop="_openDialog(item)" />
              <span v-if="item.mediaType.includes('video') || item.mediaType.includes('avi')" class="icon-video icon" title="视频播放" @click.stop="_openDialog(item)" />
              <span v-if="item.mediaType.includes('image')" class="icon-search icon" title="查看" @click.stop="_openDialog(item, type.id)" />
              <!-- 因现场存在其他网络的图片，无法进行下载，所以隐藏 -->
              <span v-show="true" class="icon-download icon" title="下载" @click.stop="_download(item)" />
            </div>
          </div>
        </li>
      </ul>
    </div>
    <el-image-viewer
      v-if="showPreview"
      :url-list="imgList"
      :on-close="() => showPreview = false"
    />
    <!-- 视频播放弹窗 -->
    <video-dialog
      :visible.sync="videoDialog"
      :src="videoSrc"
      :type="videoType"
    />
  </div>
</template>

<script>
import videoDialog from './dialog/video'
import ElImageViewer from 'ccxd-ux/packages/image/src/image-viewer'

import audioPoster from '@/assets/poster/audio.png'
import videoPoster from '@/assets/poster/video.png'

export default {
  name: 'EventMedia',
  filters: {
    filtersPath(val) {
      if (val) {
        return val.split('?')[0]
      }
    }
  },
  components: {
    videoDialog,
    ElImageViewer
  },
  props: {
    eventMedia: {
      type: Array,
      default: () => []
    },
    showMapTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mediaType: [
        {
          id: 1,
          name: '事件上报多媒体'
        },
        {
          id: 2,
          name: '事件处置多媒体'
        }
      ],
      showPreview: false,
      videoDialog: false,
      videoSrc: '',
      videoType: 'video/mp4',
      imgList: []
    }
  },
  computed: {
    // 把多媒体分类，区分为事件上报多媒体、事件处置多媒体
    reportMedias() {
      return this.eventMedia.filter(item => item.mediaUsage === 'report')
    },
    handleMedias() {
      return this.eventMedia.filter(item => item.mediaUsage !== 'report')
    },
    // 事件上报多媒体图片预览集合
    reportMediasImgList() {
      const arr = []
      this.reportMedias.forEach((md) => {
        let path = md.mediaPath
        !path.includes('http') && (path = `${window.location.origin}/${path}`)
        if (md.mediaType.includes('image')) {
          // 对 path 进行处理
          // if (path) path = path.split('?')[0]
          arr.push(path)
        }
      })
      return arr
    },
    // 事件处置多媒体图片预览集合
    handleMediasImgList() {
      const arr = []
      this.handleMedias.forEach((md) => {
        let path = md.mediaPath
        !path.includes('http') && (path = `${window.location.origin}/${path}`)
        if (md.mediaType.includes('image')) {
          // 对 path 进行处理
          // if (path) path = path.split('?')[0]
          arr.push(path)
        }
      })
      return arr
    }
  },
  methods: {
    getPoster(mediaType) {
      try {
        const audio = /^audio/g
        const video = /^video|^avi/g
        if (audio.exec(mediaType)) {
          console.log('mediaType', mediaType)
          return audioPoster
        }
        if (video.exec(mediaType)) {
          if (mediaType === 'video/mp4' || mediaType === 'video/quicktime') {
            return ''
          }
          return videoPoster
        }
      } catch (e) {
        return videoPoster
      }
    },
    // 多媒体显示时间
    _mediaTime(type) {
      const datas = type.id === 1 ? this.reportMedias : this.handleMedias
      return datas.length ? datas[0].createTime : ''
    },
    // 视频弹窗: type 区分处置前、处置后
    _openDialog(item, type) {
      if (item.mediaType.includes('video') || item.mediaType.includes('audio') || item.mediaType.includes('avi')) {
        const reg = /^video\/(\w+)/g
        const res = reg.exec(item.mediaType)
        if (res) {
          const type = res[1]
          if (!['mp4', 'quicktime', 'avi'].includes(type)) {
            this.$message('浏览器不支持该格式视频播放,请下载后播放!')
            return
          }
        }
        this.videoSrc = item.mediaPath
        this.videoType = item.mediaType
        this.videoDialog = true
      } else {
        if (type === 1) {
          this.imgList = this.reportMediasImgList
        } else {
          this.imgList = this.handleMediasImgList
        }
        this.showPreview = true
      }
    },
    _download(item) {
      const url = item.mediaPath

      const downloadRes = async() => {
        const response = await fetch(url)
        const blob = await response.blob()
        const objectUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = item.mediaName
        a.click()
        a.remove()
      }
      downloadRes()
    }
    // _download(item) {
    //   let url = item.mediaPath
    //   if (url) {
    //     const arr = url.split('?filename=')
    //     if (arr.length >= 1) {
    //       const filename = arr[1]
    //       if (/&amp;|fm=/g.test(filename)) {
    //         const str = 'img_dowm'
    //         url = arr[0] + '?filename=' + str
    //       }
    //     }
    //   }
    //   let a = document.createElement('a')
    //   let event = new MouseEvent('click')
    //   a.download = item.mediaName
    //   a.href = url
    //   a.dispatchEvent(event)
    //   a = null
    //   event = null
    // }
  }
}
</script>

<style lang="scss" scoped>

.event-media-list {
  // background-color: brown;
  .media-type{
    margin-top: 20px;
    color: #8A8A8A;
    // background-color: aqua;
    .title {
      display: flex;
      .time {
        margin-left: auto;
      }
      border-bottom: 1px solid #EDEDED;
      padding-bottom: 15px;
      margin-bottom: 15px;
    }
    .map-title {
      padding-bottom: 0;
      margin-bottom: 10px;
      border: 0 none;
    }
    .content {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      // background-color: blue;
      .media-item {
        position: relative;
        width: 120px;
        height: 120px;
        // margin-right: 16px;
        .video,
        .audio {
          border: 1px solid #e7e7e7;
          width: 100%;
          height: 100%;
        }
        &:hover {
          .hover {
            background: rgba(0, 0, 0, 0.5);
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
          }
          .hover-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            .icon {
              width: 24px;
              height: 24px;
              background-repeat: no-repeat;
              cursor: pointer;
              margin-right: 4px;
            }
            .icon-radio {
              background-image: url(~@/assets/icon-radio-play-hover.png);
            }
            .icon-video {
              background-image: url(~@/assets/icon-video-play-hover.png);
            }
            .icon-search {
              background-image: url(~@/assets/icon-search.png);
            }
            .icon-download {
              background-image: url(~@/assets/icon-download.png);
            }
          }
        }
      }
    }
  }
}
</style>
