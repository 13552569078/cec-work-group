<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 200)"
    :append-to-body="true"
    title="资源调度"
    class="resources-schedule-dlg"
    @closed="$emit('cancel')"
  >
    <hl-form
      :model="formData"
      ref="formRef"
      :rules="rules"
    >
      <hl-form-item label="任务标题" prop="taskTitle">
        <hl-input v-model="formData.taskTitle" placeholder="请输入任务标题" block clearable />
      </hl-form-item>
      <hl-form-item label="任务类型" prop="taskTypeId">
        <hl-cascader
          v-model="formData.taskTypeId"
          placeholder="请选择任务类型"
          :options="taskTypeOptions"
          :show-all-levels="false"
          :props="{ emitPath: false, checkStrictly: true, label: 'taskTypeName', value: 'id' }"
          block
          disabled
        />
      </hl-form-item>
      <hl-form-item label="执行人" prop="taskUserInfoAddParams">
        <hl-select v-model="formData.taskUserInfoAddParams" placeholder="请选择执行人" multiple block>
          <hl-option
            v-for="item in taskUsers"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="截止时间" prop="endAt">
        <hl-date-picker
          v-model="formData.endAt"
          type="datetime"
          placeholder="选择截止时间"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm"
          block
          @change="datePickerChange"
        />
      </hl-form-item>
      <hl-form-item label="任务描述" prop="taskDesc">
        <hl-input
          v-model="formData.taskDesc"
          placeholder="请输入任务描述"
          block
          native-type="textarea"
          maxlength="2000"
          :rows="5"
          resize="none"
          show-word-limit
        />
      </hl-form-item>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button class="m-r-lg" @click="$emit('cancel')">取消</hl-button>
        <hl-button type="primary" class="hover-style normal-width" @click="handleOK">确定</hl-button>
      </div>
    </template>
  </hl-dialog>
</template>

<script setup lang="ts">
import { onMounted, PropType, reactive, ref } from 'vue';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { useCurrentEvent } from '@/hooks';
import { apiTaskObj } from '@/apis/modules/task';
import { apiResourceObj } from '@/apis/modules/resource';
import { IpostTaskTypeTreeSpace } from '@/apis/modules/task/model';
import { IpostListResourceManagerSpace } from '@/apis/modules/resource/model';
import { useTaskUpdater } from '../task-track/use-task-updater';

const ResourceTaskTypeName = '资源调度';

const props = defineProps({
  resources: Array as PropType<Record<string, any>[]>
});
const emit = defineEmits(['ok']);

const { currentEvent } = useCurrentEvent();
const { updateTaskTimeStamp } = useTaskUpdater();

const formRef = ref<FormInstance>();
const formData = reactive({
  taskTitle: '',
  taskTypeId: '',
  taskDesc: '',
  endAt: '',
  taskUserInfoAddParams: [] as any[],
  taskOrganInfoAddParams: [],
  taskGroupOrgAndUserAddParams: [],
});
const rules = {
  taskTitle: [
    { required: true, message: '请输入任务标题', trigger: 'change' },
    {
      min: 1,
      max: 50,
      message: '长度在 1 到 50 个字符',
      trigger: ['change', 'blur'],
    },
  ],
  taskUserInfoAddParams: [{ required: true, message: '请选择执行人', trigger: 'change' }],
  taskDesc: [
    { required: true, message: '请输入任务描述', trigger: 'change' },
    {
      min: 1,
      max: 2000,
      message: '所选资源较多，通知内容超出系统最大长度，请酌情删减所选资源',
      trigger: ['change', 'blur'],
    },
  ],
  taskTypeId: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
};
const taskTypeOptions = ref<IpostTaskTypeTreeSpace.List[]>([]);
const taskUsers = ref<IpostListResourceManagerSpace.Data[]>([]);

// 获取任务类型
const getSelectorTaskType = async() => {
  const res = await apiTaskObj.postTaskTypeTree();
  taskTypeOptions.value = res.data;
  searchFixedTaskType(res.data);
};

const searchFixedTaskType = (list: IpostTaskTypeTreeSpace.List[]) => {
  list.forEach(type => {
    if (type.taskTypeName === ResourceTaskTypeName) {
      formData.taskTypeId = type.id;
    }
    if (type.children.length) {
      searchFixedTaskType(type.children);
    }
  });
};

const getTaskUsers = async() => {
  const res = await apiResourceObj.postListResourceManager(props.resources?.map(r => r.id));
  taskUsers.value = res.data;
  formData.taskUserInfoAddParams = taskUsers.value.map(t => t.userId);
};

const handleOK = () => {
  formRef.value?.validate(async isValid => {
    if (isValid) {
      const params = {
        ...formData,
        correlatedEvents: {
          eventName: currentEvent.name,
          eventCode: currentEvent.id,
        },
        taskUserInfoAddParams: formData.taskUserInfoAddParams.map(t => taskUsers.value.find(u => u.userId === t))
      };
      await apiTaskObj.postAddTaskInfo(params);
      HlMessage.success('资源调度成功');
      updateTaskTimeStamp.value = Date.now();
      emit('ok');
    }
  });
};

onMounted(async() => {
  getSelectorTaskType();
  await getTaskUsers();

  formData.taskDesc = `事件：${currentEvent.name}
地点：${currentEvent.mainAddress}` + (props.resources?.map(r => `
资源名称：${r.resName}，联系人：${r.personName}`).join(''));
});
</script>
