<template>
  <div class="event-desc-part">
    <hl-form
      ref="formRef"
      :label-position="['items-right']"
      :model="formData"
      :rules="rules"
      :width="['col-2','col-22']"
    >
      <hl-form-item label="事故描述" prop="content" gap="var(--md)">
        <hl-input
          v-model="formData.content"
          @change="changeValue"
          :maxlength="500"
          placeholder="请填写事故描述"
          native-type="textarea"
          block
          :rows="6"
          show-word-limit
        />
      </hl-form-item>
    </hl-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { DefaultParams } from './plan-model';

const props = defineProps<{
  defaultParams: DefaultParams;
}>();
const emit = defineEmits(['updateInfo']);

const rules = {
  content: [{ required: true, message: '请填写事故描述', trigger: 'blur' }],
};
const formData = reactive({
  content: ''
});

const changeValue = () => {
  emit('updateInfo', {
    key: 'desc',
    value: formData.content
  });
};
</script>
<style lang="scss" scoped>
.event-desc-part {
  border: none;
  box-sizing: border-box;
  padding: calc(var(--xxs) * 5) calc(var(--xxs) * 7.5) calc(var(--xxs) * 6);
  overflow: hidden;
  background: rgba(0, 158, 247, 0.10);
  :deep(.hl-input) {
    background: rgba(0,158,247,0.12)!important;
  }
}
</style>
