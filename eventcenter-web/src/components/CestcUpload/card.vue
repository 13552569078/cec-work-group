<!--
 * @description 图片上传-卡片类型
 * @date 2020-08-19
 * @author lism
-->
<template>
  <div class="picture-card-wrapper">
    <template v-if="successList.length">
      <div v-for="(item, index) in successList" :key="index" class="el-upload-list--picture-card media-item">

        <video
          v-if="item && (item.mediaType.includes('video') || item.mediaType.includes('audio') || item.mediaType.includes('avi') || item.mediaType.includes('voice'))"
          :src="item.mediaPath"
          class="video"
          controls="true"
          :poster="getPoster(item.mediaType)"
          @click.stop="_openDialog(item,'video')"
        />
        <img v-else-if="item && item.mediaType.includes('image')" class="img" :src="item.mediaPath" alt="">
        <div class="hover">
          <div class="hover-wrapper">
            <span v-if="item.mediaType.includes('audio')" class="icon-radio icon" title="音频播放" @click.stop="handlePreview(item)" />
            <span v-if="item.mediaType.includes('video')" class="icon-video icon" title="视频播放" @click.stop="handlePreview(item)" />
            <span v-if="item.mediaType.includes('image')" class="icon-search icon" title="查看" @click.stop="handlePreview(item)" />
            <span class="icon-download icon" title="下载" @click.stop="handleDownload(index)" />
            <span class="icon-delete icon" title="删除" @click.stop="handleRemove(index)" />
          </div>
        </div>
      </div>
    </template>
    <el-upload
      ref="upload"
      :auto-upload="false"
      list-type="picture-card"
      v-bind="$attrs"
      :action="uploadUrl"
      :before-upload="beforeUpload"
      :show-file-list="false"
      :multiple="false"
      :on-exceed="_onExceed"
      drag
      :data="{ bucketName: 'govern', longterm: true }"
      :on-change="imageUploadChange"
      class="cestc-upload-card"
      v-on="$listeners"
    >
      <div slot="trigger" class="upload-trigger">
        <!-- 默认 -->
        <div class="default">
          <span class="tips">点击上传</span>
        </div>
      </div>
      <div slot="tip" class="upload_tips">
        <slot name="tips">图片、视频文件不超过100M</slot>
      </div>
    </el-upload>
    <MediaDialog
      :visible.sync="dialog"
      :src="previewSrc"
      :type="previewType"
    />
    <el-image-viewer
      v-if="showPreview"
      style="z-index: 3000"
      :url-list="imgList"
      :on-close="() => showPreview = false"
    />
  </div>
</template>

<script>
import moduleSrv from '@/api/user'
import ElImageViewer from 'ccxd-ux/packages/image/src/image-viewer'
import { singleArray } from '@/utils'
import MediaDialog from './media-dialog'
export default {
  name: 'UploadCardOld',
  components: {
    MediaDialog,
    ElImageViewer
  },
  props: {
    mediaList: {
      type: Array,
      default: () => []
    },
    limitSize: {
      // 传值表示要限制大小，默认不限制
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      dialog: false,
      showPreview: false,
      imgList: [],
      previewSrc: '',
      previewType: '',
      uploadUrl: moduleSrv.uploadUrl,
      fileList: [],
      successList: [] // 有回显地址的文件列表
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler(val, old) {
        if (val && val.length) {
          this.tranform(val)
        }
      }
    }
  },
  created() {
    this.timeInterval && clearInterval(this.timeInterval)
    this.timeInterval = setInterval(() => {
      if (this.mediaList.length) {
        clearInterval(this.timeInterval)
        this.successList = this.mediaList.map((item) => {
          item.name = item.mediaName
          item.url = item.mediaPath
          return item
        })
      }
    }, 500)
  },
  methods: {
    getPoster(mediaType) {
      try {
        const audio = /^audio/g
        const video = /^video|^avi/g
        if (audio.exec(mediaType)) {
          console.log('mediaType', mediaType)
          return require(`@/assets/poster/audio.png`)
        }
        if (video.exec(mediaType)) {
          if (mediaType === 'video/mp4' || mediaType === 'video/quicktime') {
            return ''
          }
          return require(`@/assets/poster/video.png`)
        }
      } catch (e) {
        return ''
      }
    },
    handleDownload(item) {
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
    },
    handleRemove(index) {
      this.successList.splice(index, 1)
      this.$emit('fileList', this.successList)
    },
    handlePreview(item) {
      if (item.mediaType.includes('video') || item.mediaType.includes('audio')) {
        const reg = /^video\/(\w+)/g
        const res = reg.exec(item.mediaType)
        if (res) {
          const type = res[1]
          if (!['mp4', 'quicktime'].includes(type)) {
            this.$message('浏览器不支持该格式视频播放,请下载后播放!')
            return
          }
        }
        this.previewSrc = item.mediaPath
        this.previewType = item.mediaType
        this.dialog = true
      } else {
        this.imgList = [item.mediaPath]
        this.showPreview = true
      }
    },
    // 图片上传文件大小限制
    beforeUpload(file) {
      const size = this.limitSize || ''
      if (this.onlyImg) {
        console.log('file', file)
        const isImg = file.type.indexOf('image') > -1
        if (!isImg) {
          this.$message.error('只支持图片上传')
          return
        }
      }
      if (size) {
        const isLtSize = file.size / 1024 / 1024 < size
        if (!isLtSize) {
          this.$message.error(`上传图片大小不能超过 ${size} MB!`)
        }
        return isLtSize
      }

      return true
    },
    // 文件超出个数限制时的钩子
    _onExceed(files, fileList) {
      this.$message.warning(`只能选择 ${this.$attrs.limit} 个文件，当前共选择了 ${files.length + fileList.length} 个`)
    },
    // 重组数据
    tranform(fileList = []) {
      const files = []
      fileList.forEach((item) => {
        // 又返回，且返回成功
        if (item.response && item.response.code === 0) {
          files.push({
            mediaType: item.raw.type.includes('image') ? 'image' : item.raw.type,
            mediaPath: item.response.data.download,
            mediaName: item.raw.name
          })
        }
      })
      // 去重操作
      singleArray
      this.successList = singleArray(this.successList.concat(files), 'mediaPath')
      this.$emit('fileList', this.successList)
    },
    imageUploadChange(file, fileList) {
      // 如果上传了文件
      if (file.raw) {
        // 如果是文件，则进行接口提交
        this.$refs.upload.submit()
      }
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss">
.picture-card-wrapper {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .el-upload-list--picture-card {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 120px;
    height: 120px;
    position: relative;
    .img, .video {
    border: 1px solid #e7e7e7;
    width: 100%;
    height: 100%;
  }
  }
}
.cestc-upload-card {
  .el-upload-dragger,
  .el-upload--picture-card {
    width: 120px;
    height: 120px;
  }
  .el-upload--picture-card  {
    border: none;
  }
  .el-upload-dragger:hover {
    border-color: #36A4FF;
  }
  .upload-trigger {
    width: inherit;
    height: inherit;
    .default {
      background-image: url("~@/assets/upload.png");
      background-repeat: no-repeat;
      background-size: 32px;
      background-position: 44px 32px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .tips {
        font-size: 12px;
        line-height: 16px;
        color: #bdbdbd;
        margin-top: 25px;
      }
    }
    .img ,.video {
      width: 100%;
      height: 100%;
    }
  }
  .upload_tips {
    font-size: 12px;
    line-height: 16px;
    cursor: initial;
    color: #bdbdbd;
    margin-top: 4px;
    position: absolute;
    left: 0;
  }
}

.media-item {
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
      .icon-delete {
        background-image: url(~@/assets/icon-delete.png);
      }
    }
  }
}
</style>
