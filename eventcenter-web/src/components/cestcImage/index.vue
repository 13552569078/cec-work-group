<template>
  <el-image style="width: 100%; height: 100%" :src="url" lazy />
</template>

<script>
export default {
  name: 'CestcImage',
  props: {
    preview: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      default: '../../assets/404_images/404.png'
    }
  },
  computed: {
    srcList() {
      return this.preview ? [this.url] : ''
    }
  }
}
</script>

<style scoped>
</style>
