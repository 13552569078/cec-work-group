<!--
 * @Description:搜索头
 * @Author: liugeng
 * @Date: 2021-05-06
-->
<template>
  <c-form class="search-header" @submit.native.prevent>
    <c-form-item label="" style="margin-right: 16px;">
      <c-input-search
        v-model="name"
        style="width:296px"
        placeholder="请输入标签名称"
        @search="submit"></c-input-search>
      <!-- <c-input v-model="name" size="small" style="width:300px" placeholder="请输入标签名称">
        <c-button slot="append" icon="c-icon-search" @click="submit"></c-button>
      </c-input> -->
    </c-form-item>
  </c-form>
</template>
<script>
export default {
  name: 'SearchHeader',
  data() {
    return {
      name: ''
    }
  },
  methods: {
    submit() {
      this.$nextTick(() => {
        this.$emit('search', this.name)
      })
    },
    reset() {
      this.name = ''
      this.$emit('reset', this.name)
    }
  }
}
</script>
<style lang="scss" scoped>
  .search-header {
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 16px;
    ::v-deep .c-form-item {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 0;
     .c-input-group__append .c-button {
        width: 32px;
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
