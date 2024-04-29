<template>
  <!-- 此页面为设置sso 跳转回来后 设置 cookie 的页面, 既然需要前端捕获, 就需要有页面承载 -->
  <div>
    logining...
  </div>
</template>

<script>
import { getAccessTokenFromHash, setSSOCookie } from '@/utils/sso'
export default {
  mounted() {
    const ssoToken = getAccessTokenFromHash(this.$route.hash)
    setSSOCookie(ssoToken)
    this.$router.push({ path: '/' })
  }

}
</script>
