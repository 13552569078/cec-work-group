<!--/*
* @Author: dingli
* @Desc: 抽屉式组件
* @Date: 20210415
*/-->
<template>
  <transition
    name="fade"
    mode="out-in"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-if="visible"
      class="cls-drawer-dialog-wrapper"
      @click.prevent.self="afterLeave"
    >
      <div class="cls-drawer-dialog">
        <div class="cls-drawer-dialog-haeder">
          <slot name="title">
            <span class="c-dialog__title">{{ title }}</span>
          </slot>
        </div>
        <div class="cls-drawer-dialog-body" :style="style">
          <slot />
        </div>
        <div
          v-if="$slots.footer"
          class="cls-drawer-dialog-footer"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: '',
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: ''
    },
    width: String
  },
  data() {
    return {};
  },
  computed: {
    style() {
      const style = {};
      if (this.width) {
        style.width = this.width;
      }
      if (!this.$slots.footer) {
        style.height = 'calc(100% - 56px)'
      }
      console.log(style)
      return style;
    }
  },
  methods: {
    afterEnter() {
      this.$emit('opened');
    },
    afterLeave() {
      this.$emit('close');
    }
  }
};
</script>
<style scoped lang="scss">
.cls-drawer-dialog-wrapper {
  box-sizing: border-box;
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  z-index: 2001;
  .cls-drawer-dialog {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    background: white;
    box-shadow: 0px 3px 10px 0px rgba(121, 126, 137, 0.28);
    .cls-drawer-dialog-haeder {
      height: 56px;
      line-height: 56px;
      padding-left: 24px;
      border-bottom: 1px solid rgba(237, 237, 237, 1);
      font-size: 18px;
    }
    .cls-drawer-dialog-body {
      height: calc(100% - 128px);
      padding-top: 24px;
      overflow: auto;
    }
    .cls-drawer-dialog-footer {
      height: 72px;
    }
  }
}
</style>
