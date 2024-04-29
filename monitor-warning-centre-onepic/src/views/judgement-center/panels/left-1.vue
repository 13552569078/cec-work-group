<template>
  <hv-panel panel-class="h-full" :title="`待研判${systemName}信息`">
    <template #action> </template>
    <hl-date-picker v-model="params.time" type="datetimerange" range-separator="至" :start-placeholder="`${systemName}开始日期`" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" :end-placeholder="`${systemName}结束日期`" @change="getList" clearable class="m-t-md static" block />
    <hl-group class="m-t-md static" full="full-x" gap="var(--md)">
      <hl-select v-model="params.eventTypeCode" :placeholder="`${systemName}类型`" @change="getList" clearable>
        <hl-option v-for="item in options1" :key="item.eventTypeCode" :label="item.eventTypeName" :value="item.eventTypeCode" />
      </hl-select>
      <hl-select v-model="params.eventLevelCode" :placeholder="`${systemName}等级`" @change="getList" clearable>
        <hl-option v-for="item in options2" :key="item.dictCode" :label="item.dictName" :value="item.dictCode" />
      </hl-select>
    </hl-group>
    <hl-select v-model="params.monitorRegionId" filterable remote placeholder="请输入监测主体" :remote-method="remoteMethod" :loading="loading" class="m-t-md static" block clearable @change="getList">
      <hl-option v-for="item in regionSimpleList" :key="item.id" :label="item.regionName" :value="item.id" />
    </hl-select>

    <hl-scrollbar class="m-t-md" style="height: calc(var(--xxs) * 160)">
      <template v-if="data.length > 0">
        <hl-group full="full-x" dir="vertical" gap="var(--xxs)">
          <hl-group v-for="item in data" :key="item.eventId" dir="vertical" class="bg-light p-sm">
            <hl-group align="items-middle" full gap="var(--xxs)">
              <hl-tag :type="EVENT_LEVELCODE_TRANS.get(item.eventLevelCode)" class="static" size="sm">{{ item.eventLevelCodeName }}</hl-tag>
              <span class="w-full ellipsis font-md cursor-pointer" @click="goInfo(item.eventId, item.eventTime)">{{ item.eventTitle }}</span>
              <span class="font-sm text-secondary cursor-pointer static">{{ item.eventTypeCodeName }}</span>
            </hl-group>
            <span class="m-t-xs font-sm text-secondary cursor-pointer">{{ item.regionName }}</span>
            <hl-group align="items-between items-middle">
              <div class="text-secondary font-sm">{{ item.eventTime }}</div>
              <hl-button size="sm" @click="goJudge(item)">研判</hl-button>
            </hl-group>
          </hl-group>
        </hl-group>
      </template>
      <hb-empty v-else :image="require('@/assets/images/no-data.svg')" />
    </hl-scrollbar>
    <hl-pagination v-if="data.length > 0" :current-page="params.currentPage" :page-size="params.pageSize" @current-change="handleCurrentChange" layout="prev, pager, next" :total="params.total" class="m-t-lg" line block align="items-center" />
  </hv-panel>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, inject, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMonitorCenter, useLoop, useMap } from '@/hooks';
import { apiJudgeCenterObj } from '@/apis/modules/judgeCenter';
import { getUrlPrefix } from '@/common/utils';
import { IgetFindManualUnJudgeEventPageSpace, IgetRegionSimpleListSpace } from '@/apis/modules/judgeCenter/model';
import { apiDictCenterObj } from '@/apis/modules/dictCenter';
import { IgetListEventTypeListVOsSpace, IgetListDictCustomVOsSpace } from '@/apis/modules/dictCenter/model';
import { Emitter } from 'mitt';
import { EVENT_LEVELCODE_TRANS } from '@/common/constant';

export default defineComponent({
  components: {},
  props: {
    useFor: {
      type: Number,
      defaut: 1
    }
  },
  setup(props) {
    const $mitter = inject('$mitter') as Emitter;
    const systemName = ref(inject('systemName'));
    const router = useRouter();
    const { setLoop } = useLoop();

    const { mapEvents, mapMonitorPoints, getMapEvent, getMapMonitorPoints } = useMonitorCenter();

    const { updatePointData, resetMapPoint } = useMap();

    const params = reactive({
      total: 0,
      currentPage: 1,
      pageSize: 6,
      eventTypeCode: '',
      eventLevelCode: '',
      monitorRegionId: '',
      startTime: '',
      endTime: '',
      time: []
    });
    const options1 = ref<IgetListEventTypeListVOsSpace.Data[]>([]);
    const options2 = ref<IgetListDictCustomVOsSpace.Data[]>([]);
    const data = ref<IgetFindManualUnJudgeEventPageSpace.List[]>([]);
    const getList = async() => {
      const result = await apiJudgeCenterObj.getFindManualUnJudgeEventPage({
        ...params,
        startTime: params.time ? params.time[0] : '',
        endTime: params.time ? params.time[1] : ''
      });
      console.log('待研判' + result);
      data.value = result.data.list;
      params.total = result.data.totalRow;
      fetchMapData();
      updatePointData(data.value);
    };
    const eventFilterData = computed(() => {
      return {
        eventTypeCodeList: params.eventTypeCode,
        monitorRegionId: params.monitorRegionId,
        regionTypeCodeList: ''
      };
    });
    const fetchMapData = () => {
      resetMapPoint();
      // getMapEvent(eventFilterData.value);
      getMapMonitorPoints(eventFilterData.value);
    };
    const initData = async() => {
      // 两个下拉框字典值
      const dict1 = await apiDictCenterObj.getListEventTypeListVOs();
      options1.value = dict1.data;
      const dict2 = await apiDictCenterObj.getListDictCustomVOs(systemName.value === '报警' ? 'ALARM_LEVEL_CODE' : 'WARNING_LEVEL_CODE');
      options2.value = dict2.data;
      getList();
    };

    initData();

    setLoop(initData, 60);

    const loading = ref(false);
    const regionSimpleList = ref<IgetRegionSimpleListSpace.Data[]>([]);
    const remoteMethod = async(query: string) => {
      if (query !== '') {
        loading.value = true;
        const result = await apiJudgeCenterObj.getRegionSimpleList(query);
        loading.value = false;
        regionSimpleList.value = result.data;
      } else {
        regionSimpleList.value = [];
      }
    };

    const handleCurrentChange = (val: number) => {
      // console.log(`当前页: ${val}`);
      params.currentPage = val;
      getList();
    };

    const goJudge = (item: IgetFindManualUnJudgeEventPageSpace.List) => {
      const prefix = getUrlPrefix();
      router.push({
        path: `${prefix}/judge`,
        query: {
          eventId: item.eventId,
          eventTypeCode: item.eventTypeCode,
          eventTypeCodeName: item.eventTypeCodeName,
          eventLevelCode: item.eventLevelCode,
          eventLevelCodeName: item.eventLevelCodeName,
          monitorRegionId: item.monitorRegionId
        }
      });
    };
    const goInfo = (eventId: string, startTime: string) => {
      console.log(eventId);
      $mitter.emit('OPEN_DIALOG:eventInfo', { eventId: eventId, startTime: startTime });
    };

    // watch(() => mapEvents.value, () => {
    //   updatePointData(mapEvents.value);
    // });

    watch(
      () => mapMonitorPoints.value,
      () => {
        updatePointData(mapMonitorPoints.value);
      }
    );

    return {
      data,
      params,
      options1,
      options2,
      handleCurrentChange,
      getList,
      loading,
      regionSimpleList,
      remoteMethod,
      goJudge,
      goInfo,
      systemName,
      EVENT_LEVELCODE_TRANS
    };
  }
});
</script>
