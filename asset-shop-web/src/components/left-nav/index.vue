<!--/*
* @Author: dingli
* @Desc:
* @Date:
*/-->
<template>
  <ul class="cls-leftnav">
    <li class="title ftm500" :class="{'pointer':hasback}" @click="clickBack"><i v-if="hasback" class="c-icon-arrow-left" />{{ title }}</li>
    <div class="cls-items">
      <li
        v-for="d in list"
        :key="d.path"
        class="pointer f16 h64"
        :class="{active:activeTab(d.path) || active==d.path}"
        @click="goto(d)">{{ d.title || (d.meta && d.meta.title) }}</li>
    </div>
  </ul>
</template>
<script>

export default {
  name: 'Leftnav',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    },
    notroute: {
      type: Boolean,
      default: false
    },
    hasback: {
      type: Boolean,
      default: false
    },
    active: [String]
  },
  data() {
    return {}
  },
  methods: {
    goto(d) {
      if (this.notroute) {
        this.$emit('clickTab', d)
        return
      }
      this.$router.push(d.path)
      // this.$emit('goto', flag)
    },
    activeTab(path) {
      return this.$route.path.indexOf(path) !== -1
    },
    clickBack() {
      if (!this.hasback) return
      this.$emit('clickBack')
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/styles/variables.scss';

.f16 {
  font-size: 14px;
}
.cls-leftnav {
  padding: 0;
  li {
    padding-left: 16px;
    height: 44px;
    line-height: 44px;
  }
  .cls-items {
    padding: 0px 8px;
    margin-top: 12px;
  }
  .version-text {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .pl16 {
    padding-left: 16px;
  }
  .pr20 {
    padding-right: 20px;
  }
  .pointer {
    cursor: pointer;
  }
  .title {
    border: 1px solid white;
    width: 220px;
    height: 64px;
    line-height: 64px;
    background: url(~@/assets/imgs/left-nav-header.png) no-repeat center;
    background-size: 100%;
    font-size: 18px;
    .c-icon-arrow-left {
      font-weight: bold;
    }
    &.pointer {
      cursor: pointer;
      &:hover {
        color: $primaryColor;
      }
    }
  }
  .h64{
    height: 44px;
    line-height: 44px;
  }
  .active {
    background: #F8FAFF;
    border-radius: 2px;
    // .version-text {
    //   font-family: PingFangSC-Medium, PingFang SC;
    //   font-weight: 500;
    // }
  }
}
</style>
