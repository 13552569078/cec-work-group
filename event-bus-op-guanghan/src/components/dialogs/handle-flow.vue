<template>
  <common-dialog title="手动流转" width="calc(var(--xl) * 25)" @close="$emit('close')">
    <hl-scrollbar :style="`height: calc(var(--xl) * 22);`" class="m-t-lg p-md">
      <hl-row class="show-col" gap-y="var(--xl)" v-if="eventInfo">
        <hl-col span="col-12">
          <hl-group class="bg-cell" align="items-between" dir="vertical">
            <span class="label">发起系统</span>
            <span class="font-lg">{{ platText || '--' }}</span>
          </hl-group></hl-col
        >
        <hl-col span="col-12">
          <hl-group class="bg-cell" align="items-between" dir="vertical">
            <span class="label">事件类型-编码</span>
            <span class="font-lg">{{
              `${eventInfo?.eventTypeLName}/${eventInfo?.eventTypeMNAME}/${eventInfo?.eventTypeName} -
                                  ${eventInfo?.eventTypeId}`
            }}</span>
          </hl-group></hl-col
        >
        <hl-col span="col-12">
          <hl-group class="bg-cell" align="items-between" dir="vertical">
            <span class="label">事件描述</span>
            <span class="font-lg">{{ eventInfo?.eventDesc || '--' }}</span>
          </hl-group></hl-col
        >
        <hl-col span="col-12">
          <hl-group class="bg-cell" align="items-between" dir="vertical">
            <span class="label">处置时限</span>
            <span class="font-lg">{{ eventInfo?.hanleTimeLimit || '--' }}</span>
          </hl-group></hl-col
        >
      </hl-row>
      <!-- <hl-group v-if="eventInfo" gap="var(--xxs)" class="w-full">
        <hl-group class="bg-cell " align="items-between">
          <span class="label">发起系统</span>
          <span class="font-lg">{{ platText || '--' }}</span>
        </hl-group>
        <hl-group class="bg-cell " align="items-between">
          <span class="label">事件类型-编码</span>
          <span class="font-lg">{{
            `${eventInfo?.eventTypeLName}/${eventInfo?.eventTypeMNAME}/${eventInfo?.eventTypeName} -
                                  ${eventInfo?.eventTypeId}`
          }}</span>
        </hl-group>
        <hl-group class="bg-cell " align="items-between">
          <span class="label">事件描述</span>
          <span class="font-lg">{{ eventInfo?.eventDesc || '--' }}</span>
        </hl-group>
        <hl-group class="bg-cell " align="items-between">
          <span class="label">处置时限</span>
          <span class="font-lg">{{ eventInfo?.hanleTimeLimit || '--' }}</span>
        </hl-group>
      </hl-group> -->
      <hl-group class="m-t-lg m-b-lg w-full" align="items-right">
        <hl-button type="primary" size="sm" @click="addNewReceiverFn">+ 接收方</hl-button>
      </hl-group>

      <hl-form ref="formRef" :model="ruleForm" :rules="receiverRules" labhl-position="top" labhl-width="100px" class="width100 form-handle p-md p-l-xl p-r-xl" style="--form-label-color: #d0deee">
        <hl-group v-for="(val, index) in ruleForm.receiverList" :key="`${index}2`" class="w-full" gap="var(--lg)" align="items-bottom">
          <hl-group class="w-full">
            <hl-form-item label="接收方系统" :prop="`receiverList.${index}.originalSysCode`" :rules="receiverRules.originalSysCode" class="w-full">
              <hl-select class="w-full" v-model="val.originalSysCode" placeholder="请选择" filterable @change="changeReplaceSysFn($event, index)">
                <hl-option v-for="item in noswzxSysCodeOptions" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" :disabled="item.disabled || item.dictValue == eventInfo.platformSrc" />
              </hl-select>
            </hl-form-item>
          </hl-group>
          <hl-group class="w-full" align="items-center">
            <hl-form-item label="接收方事件类型（名称-编码）" :prop="`receiverList.${index}.originalValue`" :rules="receiverRules.originalValue" class="w-full">
              <hl-select class="w-full" v-model="val.originalValue" filterable placeholder="请选择" @change="changeOriginalValue(val)">
                <hl-option v-for="item in val.originalOptions" :key="item.eventTypeCode" :label="item.eventTypeNameCode" :value="item.eventTypeCode" />
              </hl-select>
            </hl-form-item>
          </hl-group>
          <hl-button v-if="ruleForm.receiverList.length > 1" @click="deleteCurLineFn(index)">删除</hl-button>
        </hl-group>
      </hl-form>
    </hl-scrollbar>
    <hl-group class="m-t-lg m-b-lg w-full" align="items-right" gap="var(--lg)">
      <hl-button @click="$emit('close')">取消</hl-button>
      <hl-button type="primary" @click="confirm">确认</hl-button>
    </hl-group>
  </common-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';
import { apiManualHanleObj as api } from '@/apis/modules/manual-handle';
import { identity } from 'lodash-es';

const emits = defineEmits(['close', 'confirmHandle']);

const props = defineProps({
  id: String,
  platText: String
});

const eventInfo = ref();

const formRef = ref();
const ruleForm = ref({
  receiverList: [
    {
      originalSysCode: '',
      originalOptions: [] as any[],
      originalValue: '',
      originalName: ''
    }
  ]
});
const receiverRules = {
  originalSysCode: [{ required: true, message: '请选择接收方系统', trigger: 'change' }],
  originalValue: [{ required: true, message: '请选择接收方事件类型（名称-编码）', trigger: 'change' }]
};
const noswzxSysCodeOptions = ref<any[]>([]);

// 新增接收方
const addNewReceiverFn = () => {
  ruleForm.value.receiverList.push({
    originalSysCode: '',
    originalOptions: [],
    originalValue: '',
    originalName: ''
  });
};
// 删除当前接收方
const deleteCurLineFn = (index: number) => {
  ruleForm.value.receiverList.splice(index, 1);
  // 处理系统下拉菜单
  dealnoswzxSysCodeOptionsFn();
};
// 处理系统下拉菜单禁用
const dealnoswzxSysCodeOptionsFn = () => {
  const curSelectedSysCodes: any[] = [];
  ruleForm.value.receiverList.forEach(val => {
    curSelectedSysCodes.push(+val.originalSysCode);
  });
  noswzxSysCodeOptions.value.forEach(val => {
    if (curSelectedSysCodes.includes(+val.dictValue)) {
      val.disabled = true;
    } else {
      val.disabled = false;
    }
  });
};
// 接收方系统改变，接收方的事件类型下拉也要改变
const changeReplaceSysFn = async (val: string, index: number) => {
  const res = await api.selectMinByPlatFrom({ platformSrc: val, sysFlag: eventInfo.value.platformSrc, type: '2' });
  let useSwzxEventsOptions = res.data || [];
  useSwzxEventsOptions = useSwzxEventsOptions.map(vk => {
    vk.eventTypeNameCode = `${vk.eventTypeName}-${vk.eventTypeCode}`;
    return vk;
  });
  ruleForm.value.receiverList.forEach((vm, idx) => {
    if (idx === index) {
      vm.originalOptions = useSwzxEventsOptions;
    }
  });
  ruleForm.value.receiverList[index].originalValue = '';
  ruleForm.value.receiverList[index].originalName = '';
  dealnoswzxSysCodeOptionsFn();
};
const changeOriginalValue = data => {
  const filterdata = data.originalOptions.filter(item => {
    return item.eventTypeCode === data.originalValue;
  });
  if (filterdata.length) {
    data.originalName = filterdata[0].eventTypeName;
  }
};

const getDispatchDetail = async () => {
  const { data } = await api.detail(props.id as string);
  eventInfo.value = data.event;

  const params1 = {
    dictType: 'event_platform'
  };
  const res = await api.getTcDictDataZiDian(params1);
  if (res.code === 200) {
    const useSysCodeOptions = res.data || [];
    noswzxSysCodeOptions.value = useSysCodeOptions.filter(val => val.dictValue !== '100');
  }
};
// 提交
const confirm = async () => {
  await formRef.value.validate();
  const list = ruleForm.value.receiverList.map(item => {
    return {
      sysFlag: eventInfo.value.platformSrc,
      originalSysCode: item.originalSysCode,
      originalValue: item.originalValue,
      originalName: item.originalName,
      replaceSysCode: '100',
      replaceValue: '100010001'
    };
  });
  const params = {
    id: props.id,
    list
  };
  await api.postManualHandleSubmit(params);
  emits('confirmHandle');
  emits('close');
};

getDispatchDetail();
</script>

<style lang="scss" scoped>
.label {
  color: rgba(208, 222, 238, 1);
  font-size: calc(var(--xl) * 0.58);
}
.font-lg {
  color: #ffffff;
  font-size: calc(var(--xl) * 0.58);
}
.form-handle {
  background-image: url('@/assets/images/eventCenter/handle-bg.png');
  background-size: cover;
}
</style>
