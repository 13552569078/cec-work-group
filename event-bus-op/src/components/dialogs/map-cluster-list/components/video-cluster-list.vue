<template>
  <hl-group v-if="list.length !== 0" dir="vertical" full>
    <hl-scrollbar :style="`height: ${height};`">
      <result-cluster-list
        v-for="(item, index) in list"
        :key="item.id"
        :data="item"
        :index="index"
      />
    </hl-scrollbar>
  </hl-group>
  <hl-group v-else :style="`height: ${height};`" full>
    <hb-empty image-size="0" description="暂无数据" />
  </hl-group>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { apiEventResourcesObj as api } from '@/apis';
import { IlistPageSpace } from '@/apis/modules/event-resources/model';

const props = defineProps({
  clusterInfo: {
    type: Object,
    default: () => ({}),
  },
  height: {
    type: String,
    default: 'calc(var(--xl) * 17.3)',
  },
});

const searchParams = reactive({
  name: '',
  type: '',
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
});

const list = ref<IlistPageSpace.List[]>([]);

const getList = async () => {
  const resList = props.clusterInfo.data.map((e: any) => e.properties);
  list.value = resList?.length ? resList : [];
};
getList();

defineExpose({ getList });
</script>
