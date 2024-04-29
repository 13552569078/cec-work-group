<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 276)"
    title="切换处置策略"
    class="execute-strategy-dlg"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <hl-group full class="items-between items-middle font-16 top-wrap">
      <div class="display-flex items-middle">
        <hl-icon class="m-r-xs"><fill-search /></hl-icon> 查询结果<span class="color-light m-x-xxs">{{ total }}</span>条数据
      </div>
      <hl-input
        v-model="query"
        clearable
        class="self-no-full"
        style="width: calc(var(--xxs) * 50)"
        @change="queryStrategyList"
      >
        <template #prefix>
          <hl-icon><fill-search /></hl-icon>
        </template>
      </hl-input>
    </hl-group>
    <hl-scrollbar height="calc(var(--xxs) * 142)">
      <hl-row layout="grid" count="count-3" gap="var(--sm)">
        <hl-col
          v-for="s in strategies"
          :key="s.strategyInfoId"
          span="col"
          class="card-item p-md common-card-bg"
          >
          <div class="font-16 display-flex items-middle font-bold title">
            <img style="width:var(--lg);" class="m-r-xs" src="@/assets/images/event-handling/left-2/strategy-icon1.png" alt="">
            {{ s.name }}
          </div>
          <div v-if="s.selected" class="selected-tag display-flex items-middle items-center">
            <span class="font-14">使用中</span>
          </div>
          <div v-else class="btn-use font-14 color-light cursor-pointer" @click="useStrategy(s)">使用</div>
          <hl-scrollbar height="calc(var(--xxs) * 34)">
            <span v-for="(tag,index) in s.eventTypeName" :key="tag+index" class="font-14 p-x-xs p-y-xxs display-inline-block m-r-xs m-b-xs common-card-bg">{{ tag }}</span>
          </hl-scrollbar>
        </hl-col>
        <hl-col class="col col-span-3">
          <hb-empty description="暂无搜索结果" :image="empty" v-if="strategies.length===0"></hb-empty>
        </hl-col>
      </hl-row>
    </hl-scrollbar>
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, PropType } from 'vue';
import { HlMessageBox, HlMessage } from 'hongluan-ui';
import { apiEventResponseObj } from '@/apis/modules/event-response';
import { IpostFindEventInfoStrategyListSpace, IpostFindEventResponseByIdSpace } from '@/apis/modules/event-response/model';
import empty from '@/assets/images/empty/no-search-data.png';

const props = defineProps({
  eventResponse: {
    type: Object as PropType<IpostFindEventResponseByIdSpace.Data>,
    default: () => ({})
  }
});
const emit = defineEmits(['cancel', 'refresh']);

const total = ref(0);
const query = ref('');
const strategies = ref<IpostFindEventInfoStrategyListSpace.Data[]>([]);

const queryStrategyList = async() => {
  const result = await apiEventResponseObj.postFindEventInfoStrategyList(props.eventResponse?.eventId, query.value);
  strategies.value = result.data;
  total.value = result.data.length;
};

const useStrategy = async(s:IpostFindEventInfoStrategyListSpace.Data) => {
  const { responseStatus, responseLevel } = props.eventResponse;
  // if (responseStatus === 'running') {
  //   await HlMessageBox.confirm(`目前已启动${responseLevel}应急响应，如果切换新的处置策略，需要重新启动响应，请问是否确认切换策略？`, '提示信息', {
  //     confirmButtonText: '确定',
  //     confirmButtonType: 'danger',
  //     cancelButtonText: '取消',
  //   });
  // }
  await apiEventResponseObj.postChangeEventInfoStrategy(props.eventResponse?.eventId, s.strategyInfoId);
  HlMessage.success(`处置策略已成功切换为【${s.name}】`);
  emit('cancel');
  emit('refresh', true);
};

queryStrategyList();

</script>
<style scoped lang="scss">
.color-light {
  color: #71F8FC;
}
.top-wrap {
  margin-bottom: calc(var(--xxs) * 5);
}
.card-item {
  position: relative;
  overflow: hidden;
  .title {
    margin-bottom: calc(var(--xxs) * 2.5);
  }
  .selected-tag {
    width: calc(var(--xxs) * 15);
    height: calc(var(--xxs) * 15);
    background-image: url(@/assets/images/event-handling/left-2/ribbon-bg.png);
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 0;
    span {
      color: #75e7ef;
      display: inline-block;
      transform: rotate(45deg) translateY(-57%);
    }
  }
  .btn-use {
    position: absolute;
    right: var(--md);
    top: calc(var(--xxs) * 4.5);
  }
}
</style>
