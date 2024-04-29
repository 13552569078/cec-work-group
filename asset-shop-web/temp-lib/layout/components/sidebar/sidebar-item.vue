<template>
  <div v-if="!item.hidden" class="c-menu-item-router">
    <template
      v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren || childFilter()) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <c-menu-item :index="resolvePath(onlyOneChild.path)"
                     :class="{'submenu-title-noDropdown':!isNest}"
                     :style="collapseStyle"
        >
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)"
                :title="onlyOneChild.meta.title" />
        </c-menu-item>
      </app-link>
    </template>

    <c-submenu v-else ref="subMenu" popper-class="popper-submenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
        <svg-icon class="icon-menu-drop" icon-class="menu-router-icon-arrow" />
      </template>
      <div v-show="collapse" class="title-submenu"><i class="c-icon-caret-left"></i>{{ item.meta.title }}</div>
      <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                    :base-path="resolvePath(child.path)" class="nest-menu" />
    </c-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '../../../utils/validate'
import Item from './menu-item'
import AppLink from './link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
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
    },
    isPackUp: {
      type: Boolean,
      default: true
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  computed: {
    collapseStyle() {
      return this.collapse ? { 'padding-left': '0px', 'text-align': 'center' } : null
    }
  },
  created() { },
  methods: {
    childFilter() {
      if (!this.onlyOneChild.children) {
        return true
      }
      let flag = true
      for (let i = 0; i < this.onlyOneChild.children.length; i++) {
        if (!this.onlyOneChild.children[i].hidden) {
          flag = false
          break
        }
      }
      return flag
    },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss">
.c-menu-item-router {
  user-select: none;
  padding: 10px 0 10px 8px;
  .c-submenu__title {
    .icon-menu-drop {
      position: absolute;
      right: 8px;
      top: 16px;
      transform: rotateZ(180deg);
      transition: transform 0.3s;
    }
  }
  .c-submenu.is-opened > .c-submenu__title {
    .icon-menu-drop {
      transform: rotateZ(360deg);
    }
  }
}
.c-menu-item-router .c-menu-item-router {
  padding: 2px 0;
}

.c-menu-item-router .c-submenu .c-submenu__title .c-submenu__icon-arrow {
  display: none;
}

.popper-submenu {
  .c-menu-item-router {
    padding: 0 8px;
  }
  .title-submenu {
    padding: 0 8px;
    height: 48px;
    line-height: 48px;
    color: #BDBDBD;
    font-size: 14px;
    border-bottom: 1px solid #E7E7E7;
    margin-bottom: 8px;
    .c-icon-caret-left {
      margin-right: 8px;
    }
  }
}
</style>
