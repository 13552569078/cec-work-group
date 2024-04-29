<!--
 * @description 视频播放-弹窗
 * @date 2022-01-11
 * @author lism
-->
<template>
  <cestc-dialog
    v-bind="$attrs"
    :title="title"
    width="466px"
    top="20vh"
    v-on="$listeners"
  >
    <!-- 视频文件 -->
    <cestc-video v-if="type.indexOf('video' > -1)" :src="src" />
    <!-- 音频文件 -->
    <audio v-else controls="controls" class="audio">
      <source :src="src" type="audio/mp3">
      <source :src="src" type="audio/ogg">
      Your browser does not support this audio format.
    </audio>
    <div slot="footer" />
  </cestc-dialog>
</template>
<script>
export default {
  name: 'VideoDialog',
  props: {
    src: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'video/mp4'
    }
  },
  computed: {
    title() {
      return this.type.includes('video') ? '视频播放' : '音频播放'
    }
  }
}
</script>
