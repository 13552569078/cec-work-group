<!--
 * @Description: tinymce 富文本编辑器
 * @Author: zhangsen
 * @Date: 2020-10-27
-->

<template>
  <div class="tinymce-box" :class="{'tinymce-box-disabled': disabled}">
    <div v-if="status===1" class="tinymce-detail-box" v-html="content"></div>
    <vue-tinymce v-else-if="showIt" v-model="content" :disabled="disabled" :setting="setting" @editorBlur="editorBlur" @tinymceEditorClick="tinymceEditorClick" />
  </div>
</template>
<script>
import serviceSuffix, { getProxyUrl } from '@/api/service-suffix.js'
const UPLOAD_FILE_URL = getProxyUrl(serviceSuffix.file_upload)
export default {
  name: 'Tinymce',
  props: {
    status: {
      type: Number,
      default: 0 // 0 编辑功能  1 展示功能
    },
    height: {
      type: Number,
      default: 0
    },
    editorContent: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      content: '',
      setting: {
        menubar: false,
        branding: false,
        statusbar: false,
        toolbar: false, // 禁用工具栏
        base_url: this.getPageUrlHost('static/tinymce'),
        skin_url: this.getPageUrlHost('static/tinymce/skins/ui/oxide'),
        // paste_word_valid_elements: 'b,strong,i,em,h1,h2', // 指定复制word的内容
        // paste_convert_word_fake_lists: false,
        paste_data_images: true, // 不能粘贴图片
        paste_as_text: true, // 外部粘贴全按文本处理
        language: 'zh_CN',
        plugins: 'link table anchor indent2em lineheight paste image',
        min_height: 200,
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
      },
      showIt: false
    }
  },
  watch: {
    editorContent(val) {
      if (val) {
        this.content = this.editorContent
      }
    },
    status(nv) {
      this.showIt = false
      this.content = this.editorContent
      this.$nextTick(() => {
        this.init()
      })
    }
  },
  created() {
    this.content = this.editorContent
  },
  mounted() {
    this.init()
  },
  methods: {
    getPageUrlHost(path) {
      if (location.host.includes('localhost')) {
        return '/' + path
      } else {
        return location.pathname ? location.pathname + path : '/' + path
      }
    },
    init() {
      if (this.status === 0) {
        this.setting.toolbar = 'restoredraft undo redo | image | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist table | indent2em lineheight'
        this.setting.images_upload_handler = (blobInfo, succFun, failFun) => {
          const file = blobInfo.blob()// 转化为易于理解的file对象
          const xhr = new XMLHttpRequest()
          xhr.withCredentials = false
          xhr.open('POST', `${UPLOAD_FILE_URL}/fdfs/upload`)
          xhr.onload = function() {
            if (xhr.status !== 200) {
              failFun('HTTP Error: ' + xhr.status)
              return
            }
            const data = JSON.parse(xhr.responseText)
            if (data.code !== 0) return
            const json = {
              location: data.data.absolutePath
            }
            // alert(xhr.responseText)
            if (!json || typeof json.location !== 'string') {
              failFun('Invalid JSON: ' + xhr.responseText)
              return
            }
            succFun(json.location)
          }
          const formData = new FormData()
          formData.append('file', file, file.name)// 此处与源文档不一样
          xhr.send(formData)
        }
      } else {
        this.setting.toolbar = false
      }
      if (this.height) this.setting.height = this.height
      this.showIt = true
    },
    editorBlur() {
      this.$emit('editorBlur', this.content)
    },
    tinymceEditorClick() {
      this.$emit('tinymceEditorClick')
    }
  }
}
</script>
<style lang='scss' scoped>
.tinymce-box {
  position: relative;
}
.tinymce-detail-box{
  max-height: 300px;
  overflow: auto;
}
</style>
