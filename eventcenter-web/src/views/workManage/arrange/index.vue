<template>
  <!-- 排班-->
  <div class="page-container">
    <!-- 列表 -->
    <list v-if="showFlag" />
    <!-- 子级 -->
    <router-view v-else />
  </div>

</template>

<script>
import list from './list.vue'
export default {
  components: {
    list
  },
  data() {
    return {

    }
  },
  computed: {
    showFlag() {
      const { path } = this.$route
      if (path === '/workManage/arrange') {
        return true
      }
      return false
    }
  },
  mounted() {

  },
  methods: {

  }

}
</script>

<style scoped lang="scss">
.page-container{
  height: 100%;
}
</style>
