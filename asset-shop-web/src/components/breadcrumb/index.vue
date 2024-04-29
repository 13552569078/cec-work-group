<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <div class="breadcrumb">
    <c-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <c-breadcrumb-item v-for="(item,index) in list" :key="item.path+index">
          <span v-if="!item.path || item.disabled" :class="[list.length === 1 ? 'title-bold': '']">{{ item.title }}</span>
          <a v-else @click.prevent="handleLink(item, index)">{{ item.title }}</a>
        </c-breadcrumb-item>
      </transition-group>
    </c-breadcrumb>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    handleLink(item, index) {
      if (item.path) {
        return this.$router.push(item.path)
      }
    }
  }
}
</script>
<style scoped lang="scss">
.breadcrumb{
    align-items: center;
    height: 64px;
    background: #fff;
    display: flex;
    padding-left: 20px;
}
</style>
