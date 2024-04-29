<template>
  <div class="search-page">
    <SearchInput ref="searchRef" @search="searchFn" />
    <div class="search-result">
      <div class="search-tips mt20">
        <svg-icon icon-class="right-arrow" :size="18" /> 为您找到相关结果<span>{{
          pagination.total
        }}</span
        >个
      </div>
      <div class="list-container" v-loading.lock="loading">
        <div class="result-list" v-if="pagination.total">
          <Card
            v-for="item in tableData"
            :key="item"
            :item="item"
            @init-data="searchFn"
            class="item"
          />
        </div>
        <Empty v-else />
        <el-pagination
          class="mt24"
          background
          layout="prev, pager, next"
          v-model:current-page="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'ISearch'
}
</script>
<script lang="ts" setup>
import SearchInput from './SearchInput.vue'
import Card from './Card.vue'
import moduleSrv from '/@/api'
import { useTable } from '/@/hooks/web/useTable'
import qs from 'qs'

const { handleCurrentChange, initData, initFn, pagination, tableData, loading, updateParams } =
  useTable({ hasForm: false })

initFn(moduleSrv.getSearchList)
const searchRef = ref()

const searchFn = () => {
  const params = searchRef.value.getParams()
  if (params.text !== '') {
    updateParams(params)
    initData(true)
  }
}

onMounted(() => {
  const url = window.location.href
  const params = qs.parse(url.split('?')[1])
  if (params.keyword) {
    searchRef.value.text = params.keyword
    searchFn()
  }
})
</script>

<style lang="scss" scoped>
.search-page {
  left: 50%;
  margin: 0 auto;
  padding: 20px;
  width: 1420px;
  background: rgba(6, 18, 79, 0.93);
  box-shadow: inset 0px 0px 20px 0px #044f7c;
  border: 1px solid #044f7c;
  display: flex;
  flex-direction: column;
  align-items: center;
  .search-result {
    width: 100%;
    .search-tips {
      width: 231px;
      height: 32px;
      line-height: 32px;
      background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(95, 181, 255, 0.45) 100%);
      padding: 0 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      margin-bottom: 20px;
      span {
        color: rgba(245, 230, 111, 1);
      }
    }
    .list-container {
      height: 466px;
      overflow: hidden;
      .el-empty,
      .result-list {
        height: calc(100% - 30px - 24px);
        overflow: hidden;
        overflow-y: auto;
      }
      .result-list {
        display: flex;
        flex-wrap: wrap;
        .item {
          cursor: pointer;
          width: calc(50% - 12px);
          height: 194px;
          margin-right: 24px;
          margin-bottom: 24px;
          &:nth-child(2n) {
            margin-right: 0;
          }
        }
      }
    }
    :deep() {
      .el-pagination {
        justify-content: center;
      }
    }
  }
}
</style>
