<!--
 * @Description:搜索头
 * @Author: liugeng
 * @Date: 2021-05-06
-->
<template>
  <c-form class="search-header">
    <c-form-item label="" style="margin-right: 16px;">
      <c-input
        v-model="name"
        :placeholder="`请输入${title}名称`"
        clearable
        @change="()=>{}" />
      <c-button type="primary" class="search-btn" @click="submit">查询</c-button>
    </c-form-item>
  </c-form>
</template>
<script>
export default {
  name: 'SearchHeader',
  props: {
    groupType: {
      type: Number,
      require: true
    },
    title: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      name: ''
    }
  },
  methods: {
    submit() {
      this.$emit('search', this.name)
    },
    reset() {
      this.name = ''
      this.$emit('reset', this.name)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-btn {
  width: 80px;
  margin-left: 20px;
}
  .search-header {
    height: 72px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-right: 16px;
    background: #FFFFFF;
    ::v-deep .c-form-item {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 0;
      .c-input {
        width: 258px;
      }
    }
  }
</style>
