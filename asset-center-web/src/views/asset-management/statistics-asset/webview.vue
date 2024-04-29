<!--
 * @Description:
 * @Author: lianpeng
 * @Date: 2021-12-17
-->
<template>
  <div class="webview-main">
    <web-page :url="url" />
  </div>
</template>

<script>
import {
  addParamToUrl,
  getToken
} from '@/utils'
export default {
  data() {
    return {
      url: addParamToUrl(decodeURI(this.$route.query.url), { key: 'token', value: getToken() })
    }
  }
}
</script>

<style lang="scss" scoped>
.webview-main{
  width: 100%;
  height: 100%;
}
</style>
