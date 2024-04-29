<!--
 * @Description: tinymce 富文本编辑器
 * @Author: zhangsen
 * @Date: 2020-10-27
-->

<template>
  <div
    class="tinymce-box"
    :class="{'tinymce-box-disabled': disabled}"
  >
    <div v-if="status===1" class="tinymce-detail-box" v-html="content"></div>
    <vue-tinymce
      v-else-if="showIt"
      v-model="content"
      :disabled="disabled"
      :setting="setting"
      @editorBlur="editorBlur"
      @tinymceEditorClick="tinymceEditorClick"
    />
  </div>
</template>
<script>

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
    }
  },
  data() {
    return {
      content: '',
      setting: {
        inline: false, // 开启内联模式
        menubar: false,
        branding: false,
        statusbar: false,
        toolbar: false, // 禁用工具栏
        base_url: this.getPageUrlHost('static/tinymce'), // 指定编辑器的css样式的加载路径
        skin_url: this.getPageUrlHost('static/tinymce/skins/ui/oxide'),
        paste_word_valid_elements: 'b,strong,i,em,h1,h2', // 指定复制word的内容
        paste_convert_word_fake_lists: false,
        paste_data_images: false, // 不能粘贴图片
        paste_as_text: true, // 外部粘贴全按文本处理
        language: 'zh_CN',
        min_height: 215,
        fontsize_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
        font_formats: '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;'
      },
      disabled: false,
      showIt: false
    }
  },
  watch: {
    editorContent(val) {
      if (val) {
        this.content = this.editorContent
      }
    }
  },
  created() {
    setTimeout(() => {
      this.disabled = this.status === 1
    }, 500)
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
        this.setting.toolbar = 'restoredraft undo redo | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | styleselect formatselect fontselect fontsizeselect | bullist numlist table | indent2em lineheight'
      } else {
        // 查看模式
        // this.setting = Object.assign(this.setting, {
        //   plugins: 'link table anchor indent2em lineheight paste autoresize',
        //   autoresize_bottom_margin: 20,
        //   autoresize_max_height: 500,
        //   autoresize_min_height: 215,
        //   autoresize_on_init: true,
        //   autoresize_overflow_padding: 50
        // })
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
  min-height: 20px;
  overflow: auto;
}
</style>
