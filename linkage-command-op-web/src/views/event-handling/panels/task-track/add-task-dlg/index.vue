<template>
  <hl-dialog
    class="add-task-dlg"
    :model-value="true"
    width="calc(var(--xxs) * 194)"
    height="calc(var(--xxs) * 200)"
    placement="center"
    title="新建任务"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    @close="$emit('cancel')"
    :append-to-body="true"
  >
    <hl-scrollbar height="calc(var(--xxs) * 160)">
      <hl-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :width="['col-24', 'col-24']"
        :label-position="['items-left', 'items-middle']"
        item-gap="var(--xxs)"
        gap="var(--md)"
        class="h-full add-task-form"
      >
        <hl-form-item label="任务标题" prop="taskTitle">
          <hl-input v-model="form.taskTitle" placeholder="请输入任务标题" clearable block maxlength="50" />
        </hl-form-item>

        <hl-form-item label="执行人" prop="taskUserInfoAddParams">
          <org-user-item
            :users="form.taskUserInfoAddParams"
            :orgs="form.taskOrganInfoAddParams"
            :groups="form.taskGroupOrgAndUserAddParams"
            :org-user-selector-props="{
            showOrgTab: false,
            showGroupTab: false,
            isRequired: true,
          }"
            @change="performerChange"
          />
        </hl-form-item>

        <hl-row gap="var(--lg)" class="w-full">
          <hl-col span="col-12">
            <hl-form-item label="截止时间" prop="endAt">
              <hl-group class="w-full" align="items-middle">
                <hl-date-picker
                  v-model="form.endAt"
                  type="datetime"
                  popper-class="end-at-date-picker"
                  placeholder="选择截止时间"
                  format="YYYY-MM-DD HH:mm"
                  value-format="YYYY-MM-DD HH:mm"
                  block
                  @change="datePickerChange"
                />
              </hl-group>
            </hl-form-item>
          </hl-col>
          <hl-col span="col-12" v-if="+taskConfig.extendedInformationConfig.taskReminder === 1 && form.endAt !== ''">
            <hl-form-item label="任务提醒时间" prop="reminderTime">
              <task-reminder-form-item
                :endAtTime="form.endAt"
                :taskRemindList="form.taskRemind"
                @change="taskRemindChange"
              />
            </hl-form-item>
          </hl-col>
        </hl-row>

        <hl-form-item label="任务描述" prop="taskDesc">
          <hl-input
            v-model="form.taskDesc"
            placeholder="请输入任务描述"
            block
            native-type="textarea"
            maxlength="500"
            :rows="5"
            resize="none"
            show-word-limit
          />
        </hl-form-item>

        <hl-row v-if="+taskConfig.extendedInformationConfig.degreeUrgency === 1 || +taskConfig.isRepeat === 1" gap="var(--lg)" class="w-full">
          <hl-col span="col-12" v-if="+taskConfig.extendedInformationConfig.degreeUrgency === 1">
            <hl-form-item label="紧急程度" prop="urgencyDegree">
              <hl-select v-model="form.urgencyDegree" placeholder="请选择紧急程度" block>
                <hl-option
                  v-for="item in DEGREEDICT"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </hl-select>
            </hl-form-item>
          </hl-col>
          <hl-col span="col-12" v-if="+taskConfig.isRepeat === 1">
            <hl-form-item label="重复任务" prop>
              <repeat-task-form-item
                :params="{
                isRepeat: form.isRepeat,
                repeatNum: form.repeatNum,
                repeatSeondary: form.repeatSeondary,
                repeatType: form.repeatType,
                isRepeatTaskCustom: form.isRepeatTaskCustom,
              }"
                @change="repeatTaskChange"
              />
            </hl-form-item>
          </hl-col>
        </hl-row>

        <hl-row v-if="+taskConfig.extendedInformationConfig.taskAttachment === 1" gap="var(--lg)" class="w-full">
          <hl-col span="col-24">
            <hl-form-item label="图片视频文档" prop="taskAttachmentAddParams">
              <task-file-form-item
                :attachment-list="form.taskAttachmentAddParams"
                @change="taskAttachmentAddParamsChange"
              />
            </hl-form-item>
          </hl-col>
        </hl-row>

        <hl-form-item v-if="+taskConfig.extendedInformationConfig.taskTag === 1" label="任务标签" prop="taskLabel">
          <hl-group class="w-full" dir="vertical" gap="var(--md)">
            <task-tag-form-item
              :tags="form.taskLabel"
              @change="val => (form.taskLabel = val)"
            />
          </hl-group>
        </hl-form-item>

        <hl-form-item v-if="+taskConfig.taskFallback === 1" label="" prop="taskFallback">
          <hl-checkbox
            v-model="form.taskFallback"
            true-label="0"
            false-label="1"
          >不可退回</hl-checkbox>
        </hl-form-item>
      </hl-form>
    </hl-scrollbar>

    <template #footer>
      <hl-group class="dialog-footer" gap="var(--md)">
        <hl-button @click="$emit('cancel')">取 消</hl-button>
        <hl-button type="primary" :loading="isLoading" @click="submit">完成创建</hl-button>
      </hl-group>
    </template>
  </hl-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { HlMessage } from 'hongluan-ui';
import { useCurrentEvent } from '@/hooks';
import { DEGREEDICT } from '@/common';
import { OrgUserItem } from '@/components';
import { apiTaskObj } from '@/apis/modules/task';
import { useTaskUpdater } from '../use-task-updater';
import { useTask } from './use-task';
import { TaskTagFormItem, TaskReminderFormItem, RepeatTaskFormItem, TaskFileFormItem } from './';
import type { PropType } from 'vue';
import type { Performer, TaskRemind, TaskAttachmentParams } from '@/types';

const props = defineProps({
  selectedPerson: {
    type: Array as PropType<{id:string, userId:string, userName:string}[]>,
    default: () => []
  },
  performer: {
    type: Object as PropType<{
      taskOrganInfoAddParams: Performer[],
      taskGroupOrgAndUserAddParams: Performer[]
    }>,
    default: () => ({
      taskOrganInfoAddParams: [],
      taskGroupOrgAndUserAddParams: [],
    })
  }
});
const emit = defineEmits(['cancel', 'submit']);

const { currentEvent } = useCurrentEvent();
const { updateTaskTimeStamp } = useTaskUpdater();
const { taskConfig } = useTask();

const isLoading = ref(false);
const formRef = ref();
const form = reactive({
  taskTitle: '',
  taskUserInfoAddParams: props.selectedPerson as Performer[],
  taskOrganInfoAddParams: props.performer.taskOrganInfoAddParams as Performer[],
  taskGroupOrgAndUserAddParams: props.performer.taskGroupOrgAndUserAddParams as Performer[],
  taskAttachmentAddParams: [] as TaskAttachmentParams[],
  endAt: '',
  taskRemind: [] as TaskRemind[],
  taskDesc: '',
  taskTypeId: '',
  urgencyDegree: '',
  correlatedEvents: {
    eventName: currentEvent.name,
    eventCode: currentEvent.id,
  },
  taskLabel: [] as {
    label: string;
    addUserName: string;
  }[],
  taskFallback: '1',
  isRepeat: '0',
  repeatNum: '',
  repeatType: '0',
  repeatSeondary: [] as string[],
  isRepeatTaskCustom: '',
});
const rules = {
  taskTitle: [
    { required: true, message: '请输入任务标题', trigger: 'change' },
    {
      min: 1,
      max: 50,
      message: '长度在 1 到 50 个字符',
      trigger: ['change', 'blur'],
    }
  ],
  taskDesc: [
    { required: true, message: '请输入任务描述', trigger: 'change' },
    {
      min: 1,
      max: 500,
      message: '长度在 1 到 500 个字符',
      trigger: ['change', 'blur'],
    }
  ],
  taskUserInfoAddParams: [{ required: true,
    trigger: 'change',
    validator: (_: any, value: any, callback: (err?: Error) => void) => {
      if (form.taskUserInfoAddParams.length === 0 &&
      form.taskOrganInfoAddParams.length === 0 &&
      form.taskGroupOrgAndUserAddParams.length === 0) {
        callback(new Error('请添加人员'));
      } else {
        callback();
      }
    }
  }]
};

const datePickerChange = (val: string) => {
  form.endAt = val ?? '';
  if (form.endAt === '') {
    form.taskRemind = [];
  }
};

const taskRemindChange = (selectedList: { reminderTime: string }[]) => {
  form.taskRemind = selectedList;
};

const repeatTaskChange = (val: { [key: string]: string | string[] }) => {
  const { isRepeat, repeatNum, repeatType, repeatSeondary, isRepeatTaskCustom } = val;
  form.isRepeat = `${isRepeat}`;
  form.repeatNum = `${repeatNum}`;
  form.repeatType = `${repeatType}`;
  form.repeatSeondary = repeatSeondary as string[];
  form.isRepeatTaskCustom = `${isRepeatTaskCustom}`;
};

const taskAttachmentAddParamsChange = (fileList: TaskAttachmentParams[]) => {
  form.taskAttachmentAddParams = fileList;
};

const performerChange = ({ users, orgs, groups }:{[key:string]:Performer[]}) => {
  form.taskUserInfoAddParams = users;
  form.taskOrganInfoAddParams = orgs;
  form.taskGroupOrgAndUserAddParams = groups;
  formRef.value.validateField(['taskUserInfoAddParams']);
};

const submit = () => {
  formRef.value.validate(async(valid: boolean) => {
    if (valid) {
      isLoading.value = true;
      await apiTaskObj.postAddTaskInfo(form); // 创建任务/子任务
      HlMessage.success({ message: '创建任务成功！' });
      isLoading.value = false;
      emit('cancel');
      updateTaskTimeStamp.value = Date.now();
    }
  });
};
</script>
<style lang="scss">
.add-task-dlg {
  --panel-border-color: none;
  .panel-body {
    padding: var(--lg) 0 0;
  }
  .add-task-form {
    padding: 0 var(--lg);
  }
}
</style>
