<template>
  <template v-if="!item.hidden">
    <!-- 只有一级菜单 -->
    <template v-if="!item.children || (item.children && item.children.length < 1)">
      <app-link v-if="item.url.indexOf('http') == -1" :to="resolvePath(item.url)">
        <el-menu-item
          :index="resolvePath(item.url)"
          :class="{
            'submenu-title-noDropdown': !isNest,
            'submenu-title-noDropdown-collapse': isCollapse
          }"
        >
          <svg-icon class-name="normal" :icon-class="item.icon" v-if="item.icon" />
          <svg-icon class-name="active" :icon-class="item.iconActive" v-if="item.iconActive" />
          <svg-icon class="blank" v-if="!item.icon" />
          <template #title>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </app-link>
      <el-menu-item
        v-else
        :class="{
          'submenu-title-noDropdown': !isNest,
          'submenu-title-noDropdown-collapse': isCollapse
        }"
        @click="toOutPage(item.url)"
      >
        <svg-icon class-name="normal" :icon-class="item.icon" v-if="item.icon" />
        <svg-icon class-name="active" :icon-class="item.iconActive" v-if="item.iconActive" />
        <svg-icon class="blank" v-if="!item.icon" />
        <template #title>
          <span>{{ item.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有二级菜单 -->
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.url)">
      <template #title>
        <svg-icon class-name="normal" :icon-class="item.icon" v-if="item.icon" />
        <svg-icon class-name="active" :icon-class="item.iconActive" v-if="item.iconActive" />
        <svg-icon
          :class="item.url == '/place/place-patrol' ? 'blank' : 'blank2'"
          v-if="!item.icon"
        />
        <span>{{ item.title }}</span>
      </template>
      <el-menu-item-group>
        <template #title>
          <span>{{ item.title }}</span>
        </template>
        <sidebar-item
          v-for="child in item.children"
          :key="child.url"
          :is-nest="true"
          :item="child"
          :base-path="child.url"
        />
      </el-menu-item-group>
    </el-sub-menu>
  </template>
</template>

<script lang="ts">
import { computed } from 'vue'
import AppLink from './Link.vue'
import { useAppStore } from '/@/store/modules/app'
import { useRouter } from 'vue-router'
import { getToken } from '/@/utils/storage/auth'
import { isExternal } from '/@/utils/validate'
import path from 'path-browserify'
export default {
  name: 'SidebarItem',
  components: { AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props: any) {
    const router = useRouter()

    const meta = computed(() => {
      const route = router.currentRoute
      const { meta } = route.value
      return {
        icon: meta.icon || '',
        title: meta.title || ''
      }
    })

    const isCollapse = () => {
      // 目前默认的菜单都是展开状态
      return useAppStore().sidebar.opened
    }

    const toOutPage = (url: string) => {
      window.open(`${url}?token=` + getToken(), '_blank')
    }

    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }

    return { meta, isCollapse, toOutPage, resolvePath }
  }
}
</script>
