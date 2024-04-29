<!--
 * @description 全局统一图片上传
 * @date 2020-08-19
 * @author lism
-->
<template>
  <el-upload
    ref="upload"
    :auto-upload="false"
    v-bind="$attrs"
    :action="uploadUrl"
    multiple
    :on-change="imageUploadChange"
    :on-remove="imageUploadChange"
    :before-upload="beforeUpload"
    class="cestc-upload"
    :file-list="fileList"
    v-on="$listeners"
  >
    <div slot="trigger" class="upload-trigger">
      <el-button class="mr8" type="primary">
        <!-- <i class="el-icon-upload" /> -->
        选择文件</el-button>
      <div class="upload_tips">
        <slot name="tips">图片文件不超过20Mb</slot>
      </div>
    </div>
  </el-upload>
</template>

<script>
import moduleSrv from '@/api/user'
export default {
  props: {
    mediaList: {
      type: Array,
      default: () => []
    },
    limitSize: {
      // 传值表示要限制大小，默认不限制
      type: [String, Number],
      default: ''
    },
    // 是否只是图片
    onlyImg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      uploadUrl: moduleSrv.uploadUrl,
      fileList: []
    }
  },
  watch: {
    fileList: {
      deep: true,
      handler(val, old) {
        if (val && val.length) {
          this.tranform()
        } else {
          // 情况列表
          this.$emit('eventMedia', [])
        }
      }
    }
  },
  created() {
    // 如果mediaList不为空, 则进行文件列表回显, 添加一个 name 属性
    if (this.mediaList.length) {
      this.$nextTick(() => {
        this.fileList = this.mediaList.map((item) => {
          item.name = item.mediaName
          return item
        })
      })
    }
  },
  updated() {
    // 如果 fileList 为空，且回显 medialist 不为空, 则重新赋值
    if (this.fileList.length === 0 && this.mediaList.length > 0) {
      this.$nextTick(() => {
        this.fileList = this.mediaList.map((item) => {
          item.name = item.mediaName
          return item
        })
      })
    }
  },
  methods: {
    // 清空文件列表
    clearFile() {
      this.fileList = []
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
    // 重组数据
    tranform() {
      const fileList = this.fileList
      const eventMedia = []
      fileList.forEach((item) => {
        // 又返回，且返回成功
        if (item.response && item.response.code === 0) {
          eventMedia.push({
            mediaType: item.raw.type.includes('image')
              ? 'image'
              : item.raw.type,
            mediaPath: item.response.data.url,
            mediaName: item.raw.name
          })
        } else if (Object.prototype.hasOwnProperty.call(item, 'mediaPath')) {
          // 表示该文件是回显的，不是自己上传的
          eventMedia.push(item)
        }
      })
      this.$emit('eventMedia', eventMedia)
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

<style lang="scss" scoped>
.cestc-upload {
  .upload-trigger {
    display: flex;
    flex-direction: column;
    ::v-deep {
      span{
        color: #fff;
      }
    }
  }
  .upload_tips {
    cursor: initial;
    color: #bdbdbd;
  }
  .el-upload-list {
    display: flex;
  }
}
</style>
