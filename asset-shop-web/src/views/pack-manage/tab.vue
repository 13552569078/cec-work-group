<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="pack-tab-wrap">
    <c-tabs v-model="activeTab" type="nav" class="tab-wrap width" @tab-click="clickTab">
      <c-tab-pane v-for="tab in routes" :key="tab.navCode" :label="tab.meta.title" :name="tab.path" />
    </c-tabs>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    active: [String, Number]
  },
  data() {
    const routes = this.$store.getters.routes.find(r => r.path === '/packManage').children.filter(r => !r.hidden)
    return {
      routes: routes,
      activeTab: ''
    }
  },
  created() {
    this.activeTab = this.active || ''
  },
  methods: {
    clickTab() {
      const path = this.activeTab || '/packManage'
      this.$router.push(path)
    }
  }
}
</script>
<style scoped lang="scss">
.pack-tab-wrap {
  height: 64px;
  padding-left: 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  ::v-deep.c-tabs {
    .c-tabs__nav-item {
      height: 64px;
      line-height: 64px;
      font-size: 16px;
    }
    .c-tabs__header {
      margin: 0;
    }
    .c-tabs__content {
      display: none;
    }
    .c-tabs__active-bar {
      display: none;
    }
  }
}
</style>
