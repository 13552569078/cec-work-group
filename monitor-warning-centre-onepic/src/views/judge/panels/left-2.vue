<template>
  <hv-panel title="研判操作">
    <hl-group full="full-x" dir="vertical" class="m-t-md" gap="var(--sm)">
      <hl-group full="full-x">
        <span class="text-secondary w-sm static">事件真实性:</span>
        <hl-radio-group v-model="formData.judgeStateCode" gap="var(--md)" type="primary" size="md">
          <hl-radio label="JUDGED_PASS">真实</hl-radio>
          <hl-radio label="JUDGED_REJECT">误报</hl-radio>
        </hl-radio-group>
      </hl-group>
      <hl-group full="full-x" align="items-middle items-left">
        <span class="text-secondary w-sm static">研判{{ systemName }}等级:</span>
        <hl-select v-model="formData.eventLevelCode" :placeholder="`研判${systemName}等级`">
          <hl-option v-for="item in options2" :key="item.code" :label="item.name" :value="item.code" />
        </hl-select>
      </hl-group>
      <hl-group full="full-x">
        <span class="text-secondary w-sm static">原{{ systemName }}等级:</span>
        <hl-tag size="sm" class="static" :type="formData.originalEventLevelCode">{{ getLevelName(formData.originalEventLevelCode) }}</hl-tag>
      </hl-group>
      <!--      <hl-group full="full-x" align="items-middle">
        <span class="text-secondary w-sm static">研判报警类型:</span>
        <hl-select v-model="formData.eventTypeCode" placeholder="研判报警类型">
          <hl-option v-for="item in options1" :key="item.eventTypeCode" :label="item.eventTypeName" :value="item.eventTypeCode" />
        </hl-select>
      </hl-group>-->
      <hl-group full="full-x">
        <span class="text-secondary w-sm static">原{{ systemName }}类型:</span>
        <span class="font-md font-bold">{{ formData.originalEventTypeCodeName }}</span>
      </hl-group>
      <hl-group full="full-x" v-if="formData.judgeStateCode === 'JUDGED_PASS'">
        <span class="text-secondary w-sm static">自动办结:</span>
        <hl-radio-group v-model="formData.autoFinish" gap="var(--md)" type="primary" size="md">
          <hl-radio :label="true">是</hl-radio>
          <hl-radio :label="false">否</hl-radio>
        </hl-radio-group>
      </hl-group>
      <hl-group full="full-x">
        <span class="text-secondary w-sm static">描述:</span>
        <hl-input v-model="formData.judgeDesc" native-type="textarea" :rows="3" placeholder="请输入描述" block :maxlength="200" />
      </hl-group>
      <hl-group full="full-x">
        <span class="text-secondary w-sm static"></span>
        <hl-group align="items-right" gap="var(--md)">
          <hl-button type="primary" @click="endJudge">结束研判</hl-button>
        </hl-group>
      </hl-group>
    </hl-group>
  </hv-panel>
</template>
<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HlMessage, HlIcon } from 'hongluan-ui';
import { apiDictCenterObj } from '@/apis/modules/dictCenter';
import {
  IgetListEventTypeListVOsSpace,
  IgetListDictCustomVOsSpace,
  IgetListEventLevelVOsSpace
} from '@/apis/modules/dictCenter/model';
import { apiJudgeCenterObj } from '@/apis/modules/judgeCenter';
import { EVENT_LEVELCODE_TRANS } from '@/common/constant';

export default defineComponent({
  name: 'MonitorEventIndex',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const systemName = ref(inject('systemName'));
    const formData = ref({
      eventId: '',
      originalEventLevelCode: '',
      originalEventLevelCodeName: '',
      originalEventTypeCode: '',
      originalEventTypeCodeName: '',
      eventLevelCode: '',
      eventTypeCode: '',
      judgeDesc: '',
      autoFinish: true,
      judgeStateCode: ''
    });

    const getLevelName = (key: string) => {
      const obj = {
        level1: 'I级',
        level2: 'II级',
        level3: 'III级',
        level4: 'IV级'
      };
      return obj[key as 'level1' | 'level2' | 'level3' | 'level4'];
    };

    const options1 = ref<IgetListEventTypeListVOsSpace.Data[]>([]);
    const options2 = ref<IgetListEventLevelVOsSpace.Data[]>([]);
    const initData = async() => {
      // 两个下拉框字典值
      const dict1 = await apiDictCenterObj.getListEventTypeListVOs();
      options1.value = dict1.data;
      const dict2 = await apiDictCenterObj.getListEventLevelVOs(route.query.eventTypeCode as string);
      options2.value = dict2.data;

      // 初始化表单
      formData.value.eventId = route.query.eventId as string;
      formData.value.originalEventTypeCode = route.query.eventTypeCode as string;
      formData.value.originalEventTypeCodeName = route.query.eventTypeCodeName as string;
      formData.value.originalEventLevelCode = EVENT_LEVELCODE_TRANS.get(route.query.eventLevelCode as string) as string;
      formData.value.originalEventLevelCodeName = route.query.eventLevelCodeName as string;
    };

    initData();

    const endJudge = async() => {
      if (!formData.value.judgeStateCode) {
        HlMessage.warning({
          message: '请选择事件真实性'
        });
        return;
      }
      if (!formData.value.eventLevelCode) {
        HlMessage.warning({
          message: '请选择研判等级'
        });
        return;
      }
      const result = await apiJudgeCenterObj.postAddJudgeInfo(formData.value);
      if (result.data) {
        HlMessage.success({
          message: '研判成功！'
        });
        router.go(-1);
      }
    };

    return {
      formData,
      getLevelName,
      systemName,
      options1,
      options2,
      endJudge
    };
  }
});
</script>
<style lang="scss" scoped></style>
