<template>
  <hv-panel :title="`当前${systemName}`">
    <template #action>
      <h3 class="font-din text-danger" @click="handleShowWarningList()">{{ currentWarningNumber }}</h3>
    </template>
    <hl-scrollbar style="height: calc(var(--xl) * 6.5)">
      <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
        <template v-if="currentWarningList.length>0">
          <hl-group v-for="item in currentWarningList" :key="item.eventId" dir="vertical" class="bg-light p-sm">

            <hl-group align="items-middle" full gap="var(--xxs)">
              <hl-tag :type="EVENT_LEVELCODE_TRANS.get(item.eventLevelCode)"
                      class="static"
                      size="sm"
                      @click="handleShowWarningList('eventLevel', item.eventLevelCode)">
                {{ item.eventLevelCodeName }}
              </hl-tag>
              <span class="w-full ellipsis font-md cursor-pointer" @click="handleShowEventInfo(item.eventId, item.startTime)">{{ item.eventTitle }}</span>
              <span class="font-sm text-secondary cursor-pointer static" @click="handleShowWarningList('eventType', item.eventTypeCode)">{{ item.eventTypeName }}</span>
            </hl-group>

            <span class="m-t-xs font-sm text-secondary cursor-pointer" @click="handleShowWarningList('region', item.monitorRegionId)">{{ item.regionName }}</span>

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

  <warning-list-dialog v-if="visible" v-model="visible" :currentFilter="currentFilter" />
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { Emitter } from 'mitt';
import { useMonitorCenter } from '@/hooks';
import { getUrlPrefix } from '@/common/utils';
import { IgetFindManualUnJudgeEventPageSpace } from '@/apis/modules/judgeCenter/model';
import WarningListDialog from '../components/warning-list-dialog.vue';
import { EVENT_LEVELCODE_TRANS } from '@/common/constant';
import { IgetListWarningInfoListVOsSpace } from '@/apis/modules/monitorCenter/model';

const $mitter = inject('$mitter') as Emitter;

const visible = ref(false);
const router = useRouter();

const systemName = ref(inject('systemName'));
const currentFilter = ref();

const { currentWarningList, currentWarningNumber, getTopXWarningList, getWarningNumber } = useMonitorCenter();

const fetchCurrentWarning = () => {
  getTopXWarningList();
  getWarningNumber();
};

const init = () => {
  fetchCurrentWarning();
};

init();

const handleShowEventInfo = (eventId: string, startTime: string) => {
  $mitter.emit('OPEN_DIALOG:eventInfo', { eventId: eventId, startTime: startTime });
};

const handleShowWarningList = (valueName?: string, value?: string) => {
  visible.value = !visible.value;
  currentFilter.value = {};
  currentFilter.value = {
    valueName,
    value
  };
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
</script>
