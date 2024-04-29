<!--/*
* @Author: dingli
* @Desc: layout 头部
* @Date: 2021-8-20
*/-->
<template>
  <div class="navbar">
    <div class="navbar-left">
      <logo v-if="showLogo" class="logo" />
      <c-tabs
        v-model="tabActive"
        type="nav"
        class="page-top-tab"
        @tab-click="clickTab"
      >
        <c-tab-pane
          v-for="tab in tabList"
          :key="tab.path"
          :name="tab.path"
        >
          <template slot="label">
            <span>{{ tab.meta.title }}</span>
            <!-- <span v-if="!(tab.children && tab.children.length)">{{ tab.meta.title }}</span>
            <c-tooltip
              v-else
              effect="dark"
              placement="bottom"
              :visible-arrow="false"
              popper-class="page-top-dropdown"
            >
              <span>{{ tab.meta.title }}<i class="c-icon-arrow-down" /></span>
              <template slot="content">
                <div
                  v-for="subTab in tab.children"
                  :key="tab.path+subTab.path"
                  class="page-top-dropdown-item"
                  @click="clickSubTab(subTab, tab)"
                >
                  {{ subTab.meta.title }}
                </div>
              </template>
            </c-tooltip> -->
          </template>
        </c-tab-pane>
      </c-tabs>
    </div>
    <tools :user-name="userName" :avatar="avatar" style="padding:0" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Tools from './tools.vue'
import Logo from './logo.vue'
import avatar from '@/assets/user.png'

export default {
  components: {
    Tools,
    Logo
  },
  props: {
    showLogo: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      tabActive: '',
      avatar,
      oldTab: ''
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'userName']),
    ...mapState({
      route: (state) => state.route
    }),
    tabList() {
      if (this.route && this.route.routes) {
        const tabList = this.route.routes.filter(r => {
          if (!r.hidden) {
            if (r.children) {
              r.children = r.children.filter(sr => !sr.hidden)
            }
            return true
          }
          return false
        })
        return tabList
      }
      return []
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const r = this.tabList.find(r => route.path.startsWith(r.path))
        this.tabActive = r.path
        this.oldTab = r.path
      },
      immediate: true
    }
  },
  created() {
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout', this.$route.fullPath)
    },
    clickTab(tab) {
      const current = this.tabList.find(
        (d) => d.redirect === tab.name || d.path === tab.name
      )
      // if (current.children && current.children.length) {
      //   this.$nextTick(() => {
      //     if (this.tabActive !== this.oldTab) {
      //       this.tabActive = this.oldTab
      //     }
      //   })
      //   return
      // }
      if (current.meta.base) {
        // 跳转页面的tab的active效果保留当前的
        this.$nextTick(() => {
          this.tabActive = this.oldTab
        })
        if (!(window.__systemConfig && window.__systemConfig[current.meta.base])) {
          return this.$message.warning('路径获取有误！')
        }
        window.open(window.__systemConfig[current.meta.base] + current.path)
        return
      }
      if (this.$route.path === current.path) {
        this.$router.go(0)
      } else {
        this.$router.push(current.path)
      }
    },
    clickSubTab(val, pval) {
      if (pval.meta.base) {
        if (!(window.__systemConfig && window.__systemConfig[pval.meta.base])) {
          return this.$message.warning('路径获取有误！')
        }
        window.open(window.__systemConfig[pval.meta.base] + val.path)
        return
      }
      let path = val.path.startsWith('/') ? val.path : `${pval.path}/${val.path}`
      if (val.redirect) {
        path = val.redirect
      }
      console.log('clickSubTab----', val, path)
      if (this.$route.path === path) {
        this.$router.go(0)
      } else {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.navbar {
  height: $navbarHeight;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-bottom: 1px solid #f4f4f4;
}
.navbar-left {
  flex: 1;
  display: flex;
  align-items: center;
}
::v-deep.page-top-tab.c-tabs {
  height: $navbarHeight;
  margin-left: 35%;
  transform: translate(-50%, 0);
  .c-tabs__nav-item {
    height: 56px;
    line-height: 56px;
    // padding: 0 34px !important;
    width: 140px;
    text-align: center;
    padding: 0 !important;
  }
  .c-tabs__item {
    color: #ffffff;
    font-size: 16px;
    font-weight: 400;
  }
  .c-tabs__item.is-active {
    background: rgba(255,255,255,0.1);
  }
  // .c-tabs__item.is-active,
  // .c-tabs__item:hover {
  //   font-family: PingFangSC-Medium, PingFang SC;
  //   font-weight: 500;
  //   color: #ffffff;
  // }
  .c-tabs__active-bar {
    width: 40px !important;
    margin-left: 50px !important;
    background: #ffffff;
  }
  .c-icon-arrow-down {
    margin-left: 8px;
  }
}
::v-deep.sidebar-logo-container .sidebar-logo-link .sidebar-logo {
  margin-left: 0;
}
::v-deep.navbar .user-name {
  font-size: 16px !important;
}
</style>

