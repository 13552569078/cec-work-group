<template>
  <div>
    <hl-form :model="formData" ref="formRef" :rules="rules">
      <hl-form-item v-for="(value, key) in showFieldsMap" :key="key" :prop="key">
        <template #label>
          {{value.label}}<span v-if="key==='file'" class="tips">(提示：只能上传png,jpg,docx,xlsx格式，大小不超过10MB）</span>
        </template>
        <hl-input clearable v-if="['name', 'orgName'].includes(key)" v-model="formData[key]" block placeholder="请输入" :maxlength="maxLengthMap[key]" show-word-limit></hl-input>
        <hl-input clearable v-if="key==='content'" v-model="formData[key]" block placeholder="请输入" :maxlength="maxLengthMap[key]" show-word-limit native-type="textarea" :input-style="{height: 'calc(var(--xxs) * 23)'}"></hl-input>
        <hl-date-picker v-if="key==='time'" v-model="formData[key]" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" :disabled-date="disabledDate" placeholder="请选择" block>
          <template #icon>
            <hl-icon><TwoCalendar/></hl-icon>
          </template>
        </hl-date-picker>
        <hl-upload
          v-if="key==='file'"
          :action="uploadUrl"
          list-type="card"
          :file-list="fileList"
          :on-change="handleChangeUpload"
          :limit="1"
          :on-preview="handlePreview"
          :before-upload="beforeUpload"
          :class="{'hide-upload': fileList.length > 0}"
          accept=".png,.jpg,.jpeg,.docx,.xlsx"
        >
          <div class="text-center upload-content">
            <img src="@/assets/images/common/upload-icon.png" alt="" style="width:var(--xl);">
            <div class="m-t-xs">点击上传附件</div>
          </div>
          <template #file-preview="{ file }">
            <FileCard :url="file.url" size="100%" />
          </template>
        </hl-upload>
      </hl-form-item>
    </hl-form>
    <div class="text-center m-t-lg">
      <hl-button class="m-r-md normal-width normal-height" @click="$emit('handleCancel')">取消</hl-button>
      <hl-button type="primary" class="normal-width normal-height" @click="handleOK">确定</hl-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { HlMessage, FormInstance, UploadFile } from 'hongluan-ui';
import { Constants } from 'fx-front-utils';
import { usePreviewer } from 'fx-front-framework';
import { getRemoteFilePath, GlobalAPI, isImage, isVideo } from '@/common';
import { FileCard } from '@/components';

const props = defineProps({
  title: String,
  fieldsMap: Object,
  editForm: {
    type: Object,
    default: () => ({})
  },
});
const emit = defineEmits(['handleSave']);

const { openPreviewer } = usePreviewer();

const maxLengthMap = {
  name: 10,
  orgName: 30,
  content: 500
};
const uploadUrl = GlobalAPI.config.BASE_URL + '/swan-file/files';

const showFieldsMap = computed(() => {
  const fieldsMap = { ...props.fieldsMap };
  delete fieldsMap.fileName;
  return fieldsMap;
});

const formRef = ref<FormInstance>();
const formData = reactive({
  name: '',
  orgName: '',
  time: '',
  content: '',
  file: '',
  fileName: '',
});
const fileList = ref<Array<{name: string; url: string;}>>([]);
const rules = ref({
  name: [{ required: true, message: '请输入', trigger: 'blur' }],
  orgName: [{ required: true, message: '请输入', trigger: 'blur' }],
  time: [{ required: true, message: '请选择', trigger: 'blur' }],
  content: [{ required: true, message: '请输入', trigger: 'blur' }],
});
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now();
};

const initFormData = () => {
  Object.assign(formData, props.editForm);
  if (formData.file) {
    fileList.value = [{
      url: formData.file,
      name: formData.fileName
    }];
  }
};

const handlePreview = (file: UploadFile) => {
  const url = getRemoteFilePath(file.url!);
  if (isImage(url) || isVideo(url)) {
    openPreviewer({
      sourceType: isImage(url) ? 1 : 2,
      id: Math.random() * 100 + '',
      name: '文件预览',
      url: url,
      showCollapse: false,
    });
  } else {
    window.open(url, '_blank');
  }
};
const beforeUpload = (file: UploadFile) => {
  const maxsizefile = file.size! / 1024 / 1024;
  if (maxsizefile > 10) {
    HlMessage.error('上传大小不超过10MB！');
    return false;
  }
};
const handleChangeUpload = (file: UploadFile) => {
  if (file.status === 'success') {
    const { dirUrl, originalName } = (file.response! as Record<string, any>).data;
    fileList.value = [{
      name: originalName,
      url: `/${dirUrl}`
    }];
  }
};

const handleOK = async() => {
  await formRef.value?.validate();
  if (fileList.value.length > 0) {
    formData.file = fileList.value[0].url;
    formData.fileName = fileList.value[0].name;
  } else {
    formData.file = '';
    formData.fileName = '';
  }
  emit('handleSave', formData);
};

initFormData();
</script>
<style lang="scss" scoped>
.tips {
  margin-left: var(--xs);
  color: #B5CEE3;
  font-size: var(--font-md);
}
:deep(.hl-upload) {
  --upload-handle-bg-color: rgba(0,158,247,0.12);
  --upload-handle-bg-color-hover: var(--upload-handle-bg-color);
  --upload-handle-border-color: rgba(0,158,247,0.24);
  --upload-font-color-hover: #fff;
  --upload-item-gap: var(--sm);
  --upload-radius: var(--xxs);
  --upload-thumb-size: calc(var(--xxs) * 30);
  .handle-card {
    border-style: solid;
  }
  &.hide-upload {
    .handle-card {
      display: none;
    }
  }
  .upload-list.list-card .item {
    background-color: var(--upload-handle-bg-color);
    border: 1px solid var(--upload-handle-border-color);
    position: relative;
    justify-content: center;
    .file-outer-box{
      border: none;
      background-color: transparent;
    }
    .item-content {
      display: none;
    }
  }
}
</style>
