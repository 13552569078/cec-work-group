<template>
  <c-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <c-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="!item.redirect==='noRedirect' || levelList.length === 1 || item.meta.isTop"
              :class="[levelList.length === 1 ? 'title-bold': '']">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item, index)">{{ item.meta.title }}</a>
      </c-breadcrumb-item>
    </transition-group>
  </c-breadcrumb>
</template>

<script>
// 第一个，最后一个不能点击
import pathToRegexp from 'path-to-regexp'
import { bus } from '@/utils'
import { getWindowParentRef } from '../../utils'
export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this._setgoindex()
    this.getBreadcrumb()
    if (window.embed) {
      // 获取当前系统的上层应用的路由广播
      window.addEventListener('message', this.fetchParentMessage)
    } else {
      window.addEventListener('message', this.fetchChildMessage)
    }
  },
  beforeDestroy() {
    if (window.embed) {
      window.removeEventListener('message', this.fetchParentMessage)
    } else {
      window.removeEventListener('message', this.fetchChildMessage)
    }
  },
  methods: {
    fetchParentMessage(event) {
      // console.log('收听到父系统的广播事件', event.data)
      if (event.data && event.data.type === 'breadcrumb' && event.data.msg && event.data.msg.item) {
        this.levelList.map((item, index) => {
          if (item.path === event.data.msg.item.path) {
            this.handleSelfLink(item, index)
          }
        })
      }
    },
    fetchChildMessage(event) {
      // console.log('收听到子系统的广播事件', event.data)
      if (event.data && event.data.type === 'breadcrumb' && event.data.msg) {
        if (event.data.msg.levelList) {
          const arr = []
          this.levelList.map(item => {
            if (!item.isChildSys) {
              arr.push(item)
            }
          })
          event.data.msg.levelList.map(item => {
            arr.push(item)
          })
          this.levelList = arr
          if (this.levelList.length > 1 && this.levelList[0].meta) {
            this.levelList[0].meta.isTop = true
          }
        }
      }
    },
    _setgoindex() {
      // 对第一页进行标识
      if (location.href.indexOf('?') === -1) {
        window.location.href = location.href + '?goindex=true'
      } else if (location.href.indexOf('?') !== -1 && location.href.indexOf('goindex') === -1) {
        window.location.href = location.href + '&goindex=true'
      }
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]
      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: '' }}].concat(matched)
      }

      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )

      if (window.embed) {
        // 对父系统进行路由层级广播
        const arr = []
        this.levelList.map(item => {
          arr.push({
            meta: item.meta,
            path: item.path,
            isChildSys: true
          })
        })
        window.parent.postMessage({ type: 'breadcrumb', msg: { levelList: arr }}, getWindowParentRef())
      }
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item, index) {
      if (item.isChildSys) {
        if (index !== this.levelList.length - 1) {
          this.handleChildLink(item)
        }
      } else {
        this.handleSelfLink(item, index)
      }
    },
    handleChildLink(item) {
      // 处理子系统的路由点击
      bus.$emit('breadcrumb-iframe', { item })
    },
    handleSelfLink(item, index) {
      // 处理自己系统的路由点击
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }

      if (this.$route.query.goindex === 'true') {
        this.$router.push(this.pathCompile(path))
        return
      }

      const num = this.levelList.length - (index + 1)

      if (num > 0) {
        // this.$router.back(-num)
        this.$router.go(-num)
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
.app-breadcrumb.c-breadcrumb {
  display: inline-block;
  font-size: 16px;
  width: 100%;
  height: 64px;
  line-height: 64px;
  padding-left: 20px;
  background: #F9FAFE;
}
.title-bold {
  font-weight: 600;
}
</style>
