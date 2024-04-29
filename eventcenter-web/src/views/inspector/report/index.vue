<template>
  <div class="inspector-report">督查报告</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Report',
  computed: {
    ...mapGetters(['username'])
  }
}
</script>

<style lang="scss" scoped>
.inspector {
  &-report {
    margin: 10px;
  }
}
</style>
