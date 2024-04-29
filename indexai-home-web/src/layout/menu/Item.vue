<template>
  <i :class="[icon, 'sub-el-icon']" v-if="icon && icon.includes('el-icon')"></i>
  <i :class="[icon, 'el-menu-item-icon']" v-if="icon && icon.indexOf('menu-icon') > -1"></i>
  <svg-icon :icon-class="icon" v-if="!icon" />
  <span>{{ title }}</span>
</template>
<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
