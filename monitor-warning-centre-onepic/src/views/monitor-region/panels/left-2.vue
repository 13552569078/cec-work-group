<template>
  <hv-panel :title="`${systemName}列表`">
    <hl-scrollbar style="height: calc(var(--xl) * 5)">
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <template v-if="warningList.length>0">
          <hl-group v-for="(item, index) in warningList" :key="index" dir="vertical" class="bg-light p-sm">
            <hl-group align="items-middle" full gap="var(--xxs)">
              <hl-tag :type="EVENT_LEVELCODE_TRANS.get(item.eventLevelCode)"
                      class="static"
                      size="sm"
                      @click="handleShowWarningList('eventLevel', item.eventLevelCode)">
                {{ item.eventLevelCodeName }}
              </hl-tag>
              <span class="w-full ellipsis font-md cursor-pointer" @click="goInfo(item.eventId, item.startTime)">{{ item.regionName }}</span>
              <span class="font-sm text-secondary cursor-pointer static" @click="handleShowWarningList">{{ item.eventTypeName }}</span>
            </hl-group>

            <span class="m-t-xs font-sm text-secondary cursor-pointer">{{ item.streetName || '暂无地址信息' }}</span>

            <hl-group align="items-between items-middle">
              <div class="text-secondary font-sm">{{ item.startTime }}</div>
              <hl-tag size="sm"
                    @click="handleGoJudge(item)"
                    :type="item.eventShowCode === 'EVENT_STATE_TO_BE_JUDGED'?'level1':'leve2'">
              {{ item.eventShowName }}
              </hl-tag>
            </hl-group>
          </hl-group>
        </template>
        <hb-empty v-else image-size="10vh" :image="require('@/assets/images/no-data.svg')" />
      </hl-group>
    </hl-scrollbar>
  </hv-panel>
  <warning-list-dialog v-if="visible" v-model="visible" :onlyRegion="true" />
</template>

<script lang="ts" setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { Emitter } from 'mitt';
import { useLoop } from '@/hooks';
import { getUrlPrefix } from '@/common/utils';
import { apiRegionAlarmObj } from '@/apis/modules/regionAlarm';
import { IgetListCurrentWarningInfoListVOsSpace } from '@/apis/modules/regionAlarm/model';
import { IgetListWarningInfoListVOsSpace } from '@/apis/modules/monitorCenter/model';
import { EVENT_LEVELCODE_TRANS } from '@/common/constant';
import WarningListDialog from '../../monitor-center/components/warning-list-dialog.vue';

const props = defineProps({
  regionId: {
    type: Number,
    default: 0
  }
});
const $mitter = inject('$mitter') as Emitter;
const visible = ref(false);
const router = useRouter();
const handleShowWarningList = (valueName?: string, value?: string) => {
  visible.value = !visible.value;
};

const { setLoop } = useLoop();

const warningList = ref<IgetListCurrentWarningInfoListVOsSpace.Data[]>([]);
const systemName = ref(inject('systemName'));

const initData = async() => {
  // 报警列表
  const { data } = await apiRegionAlarmObj.getListCurrentWarningInfoListVOs(props.regionId);
  warningList.value = data;
};
initData();
const goInfo = (eventId: string, startTime: string) => {
  $mitter.emit('OPEN_DIALOG:eventInfo', { eventId: eventId, activeName: 'data', startTime: startTime });
};

const handleGoJudge = (item: IgetListWarningInfoListVOsSpace.Data) => {
  if (item.eventShowCode === 'EVENT_STATE_TO_BE_JUDGED') {
    const prefix = getUrlPrefix();
    router.push({
      path: `${prefix}/judge`,
      query: {
        eventId: item.eventId,
        eventTypeCode: item.eventTypeCode,
        eventTypeCodeName: item.eventTypeName,
        eventLevelCode: item.eventLevelCode,
        eventLevelCodeName: item.eventLevelCodeName,
        monitorRegionId: item.monitorRegionId
      }
    });
  }
};

// 定时刷新
setLoop(initData, 60);
</script>
