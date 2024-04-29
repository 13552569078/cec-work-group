<!--
 * @description 分页组件，实现吸底效果
 * @date 2020-08-17
 * @author lism
 -->
<template>
  <div class="cestc-paginaton-wrapper">
    <div class="content">
      <div>
        <el-button v-if="delFlag" @click="patchRemove">删除</el-button>
      </div>
      <el-pagination v-bind="$attrs" background btn-border v-on="$listeners" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CestcPagination',
  props: {
    delFlag: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    patchRemove() {
      this.$emit('patchRemove', 'patch')
    }
  }
}
</script>

<style lang="scss" scoped>
.cestc-paginaton {
  &-wrapper {
    background-color: $white;
    width: 100%;
    .content {
      display: flex;
      align-items: center;
      .el-pagination {
        margin-left: auto;
      }
    }
  }
}
</style>
