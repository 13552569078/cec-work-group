<template>
  <div class="external-pgae-container">
    <iframe v-if="showFrame" :src="externalPath" class="frame" frameborder="0"></iframe>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { getToken } from '/@/utils/storage/auth'

const externalPath = ref('')
const showFrame = ref(false)

const route = useRoute()
onBeforeMount(() => {
  const path = (route?.meta?.externalPath as string) || ''
  showFrame.value = !!path
  if (path.includes('?')) {
    externalPath.value = `${path}&token=${getToken()}`
  } else {
    externalPath.value = `${path}?token=${getToken()}`
  }
})
</script>

<style scoped lang="scss">
.external-pgae-container {
  height: 100%;
  width: 100%;
  .frame {
    height: 100%;
    width: 100%;
  }
}
</style>
