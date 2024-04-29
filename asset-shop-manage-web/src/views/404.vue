<template>
  <div class="empty-404-wrapper">
    <empty class="empty-404" width="600px" text="404,请尝试其他链接" />
  </div>
</template>

<script>
import Empty from '@l/components/empty'
export default {
  name: 'Page404',
  components: {
    Empty
  }
}
</script>

<style lang="scss" scoped>
.empty-404-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.empty-404 {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
