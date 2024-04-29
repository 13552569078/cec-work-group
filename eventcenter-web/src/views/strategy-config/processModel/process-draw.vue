<template>
  <div class="process-draw">
    <iframe
      :src="`${
        getConfig && getConfig.activitiUrl
      }/modeler.html?modelId=${modelId}`"
      height="100%"
      width="100%"
      title="流程绘制"
      frameborder="0"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProcessDraw',
  computed: {
    ...mapGetters(['getConfig']),
    modelId() {
      return this.$route.query.id
    }
  }
}
</script>
