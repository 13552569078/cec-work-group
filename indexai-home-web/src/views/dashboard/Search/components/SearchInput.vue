<template>
  <div class="search-input">
    <el-form-item label=""
      ><el-input
        v-model.trim="keyword"
        placeholder="请输入内容查询"
        style="height: 40px; width: 388px"
        clearable
        @keyup.enter="searchFn"
        class="input-box" /><el-button :icon="Search" class="serach-btn" @click="searchFn"
    /></el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['search', 'update:value'])
const keyword = computed({
  get: () => {
    return props.value
  },
  set: (val) => {
    emit('update:value', val)
  }
})

const searchFn = () => {
  emit('search')
}
</script>
<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;

  .input-box {
    :deep() {
      --el-border-color: #638bee;
      --el-border-color-hover: #638bee;
      --el-input-focus-color: #638bee;

      .el-input__wrapper {
        height: 40px;
        justify-content: center;
        height: 40px;
        background: #06124f;
        box-shadow: inset 0px 0px 20px 0px #044f7c;
        border-radius: 4px 4px 4px 0px;
        border: 1px solid #044f7c;
      }

      .el-input__inner {
        font-size: 16px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        &::-webkit-input-placeholder {
          color: #ffffff;
        }
        &:-moz-placeholder {
          color: #ffffff;
        }
        &:-ms-input-placeholder {
          color: #ffffff;
        }
      }
    }
  }
  :deep() {
    .el-form-item {
      width: 100%;
      padding-left: 0;
      margin-bottom: 0;
    }
    .el-form-item__content {
      flex-wrap: nowrap;
    }
  }

  .serach-btn {
    min-width: 40px !important;
    height: 40px;
    background: #659bf0;
    border-radius: 0px 4px 4px 0px;
    font-size: 20px;
    color: #ffffff;
    border: none !important;
  }
}
</style>
