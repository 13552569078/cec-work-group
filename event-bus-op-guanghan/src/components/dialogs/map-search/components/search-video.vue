<template>
  <!-- <hl-group class="w-full">
    <hl-group dir="horizontal" merge block class="m-t-md w-full">
      <hl-input v-model="searchParams.name" placeholder="请输入内容" clearable style="width: 100%" @clear="handleSearch"/>
      <hl-button type="primary" style="width: calc(var(--md) * 8)" @click="handleSearch">搜索</hl-button>
    </hl-group>
  </hl-group> -->
  <c-label style="margin: calc(var(--xl) * 0.6) 0">搜索结果</c-label>

  <hl-group  v-if="list.length !== 0" dir="vertical" full>
    <hl-scrollbar :style="`height: ${height};`">
      <result-list v-for="(item, index) in list" :key="item.id" :data="item" :index="index" />
    </hl-scrollbar>
    <hl-group dir="horizontal" class="items-middle m-t-lg items-between page-container">
      <div>视频数/<span class="page-count">{{ pagination.total }}</span>个</div>
      <hl-pagination size="sm" :current-page="pagination.currentPage" :page-size="pagination.pageSize" layout="prev, pager, next" :total="pagination.total" align="items-left"  @current-change="handleCurrentChange"> </hl-pagination>
    </hl-group>
    <!-- <hl-pagination class="m-t-lg" size="sm" :current-page="pagination.currentPage" :page-size="pagination.pageSize" layout="total, prev, pager, next" :total="pagination.total" align="items-left"  @current-change="handleCurrentChange"> </hl-pagination> -->
  </hl-group>

  <hl-group v-else :style="`height: ${height};`" full>
    <hb-empty image-size="0" description="暂无数据" />
  </hl-group>

</template>

<script lang='ts' setup>
import { ref, reactive } from 'vue';
import { apiEventResourcesObj as api } from '@/apis';
import { IlistPageSpace } from '@/apis/modules/event-resources/model';

const props = defineProps({
  height: {
    type: String,
    default: 'calc(var(--xl) * 15.7)'
  },
  keyword: {
    type: String,
    default: ''
  }
});

const searchParams = reactive({
  name: '',
  type: ''
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
});

const list = ref<IlistPageSpace.List[]>([]);

const resetPage = () => {
  pagination.currentPage = 1;
};

const fetchData = async () => {
  const res = await api.listPage({
    name: props.keyword,
    pageSize: pagination.pageSize,
    pageNum: pagination.currentPage });
  list.value = res.data.list;
  pagination.total = res.data.totalRow;
};

const handleCurrentChange = (val: number) => {
  pagination.currentPage = val;
  fetchData();
};

const handleSearch = () => {
  console.log('搜索资源');
  resetPage();
  fetchData();
};

fetchData();

const getList = () => {
  resetPage();
  fetchData();
};

defineExpose({ getList });
</script>
