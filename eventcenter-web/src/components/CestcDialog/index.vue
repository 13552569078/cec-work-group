<!--
 * @description 全局统一弹窗外壳, 内容区高度超过给定高度默认： 444px，则 footer 显示阴影
 * @date 2020-08-19
 * @author lism
-->
<template>
  <el-dialog
    v-bind="$attrs"
    :title="title"
    :class="['cestc-dialog', { 'show-shadow': contentHeight > maxHeight }]"
    :modal="true"
    append-to-body
    :close-on-click-modal="false"
    :show-close="showClose"
    :style="cssVar"
    v-on="$listeners"
  >
    <template v-if="$slots.title" slot="title">
      <slot name="title" />
    </template>
    <slot />
    <div v-if="$slots.footer" slot="footer" class="footer">
      <slot name="footer" />
    </div>
    <div v-else slot="footer" class="footer">
      <el-button v-if="showClose" @click.stop="_cancle">取消</el-button>
      <el-button type="primary" @click.stop="_confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    // 解决cestc-dialog title作为自定义属性添加
    title: {
      type: String,
      default: ''
    },
    showClose: {
      type: Boolean,
      default: true
    },
    maxHeight: {
      type: [String, Number],
      default: 444
    },
    contentHeight: {
      type: [String, Number],
      default: 100
    }
  },
  computed: {
    cssVar() {
      return {
        '--maxHeight': String(this.maxHeight).replace('px', '') + 'px'
      }
    }
  },
  methods: {
    _cancle() {
      this.$emit('cancle')
    },
    _confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
  .cestc-dialog {
    ::v-deep {
    .el-dialog__body {
      max-height: var(--maxHeight);
      overflow-y: auto;
      overflow-x: hidden;
    }
    .diy-popover {
      .el-input__suffix {
        right: 0;
        border: none;
      }
    }
    .main-title, .default-title, span, .el-form-item__label {
      color: $fontColor !important;
    }
    .el-button--primary span {
      color: $white !important;
    }
    .el-form--label-top .el-form-item__label {
      padding: 0;
    }
  }
  &.show-shadow {
    ::v-deep {
      .el-dialog__footer {
        box-shadow: 0px -2px 7px 0px rgba(0, 0, 0, 0.06);
      }
    }
  }
  .footer {
    text-align: right;
    .el-button {
      margin-left: 16px;
      line-height: 15px;
    }
  }
}
</style>
