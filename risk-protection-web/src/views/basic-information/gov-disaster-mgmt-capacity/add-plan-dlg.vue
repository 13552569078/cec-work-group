<template>
  <hl-dialog
    title="新增政府灾害相关预案"
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 100)"
    append-to-body
    @close="$emit('cancel')"
  >
    <hl-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      :width="['col-24', 'col-24']"
      class="m-l-sm count-1 grid grid-direction-vertical hl-row"
      style="--row-gap-x: calc(var(--xxs) * 5); --row-gap-y: calc(var(--xxs) * 5)"
    >
      <hl-form-item label="预案名称" prop="resName">
        <hl-input
          v-model="formData.resName"
          :maxlength="100"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="预案制定或最新修订的时间" prop="planDate">
        <hl-date-picker
          v-model="formData.planDate"
          placeholder="请选择"
          type="date"
          value-format="YYYY-MM-DD"
          block
        />
      </hl-form-item>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button class="m-l-lg" type="primary" @click="handleOK">确定</hl-button>
      </div>
    </template>
  </hl-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import type { FormInstance } from "hongluan-ui";

const emit = defineEmits(["cancel", "ok"]);

const formRef = ref<FormInstance>();
const formData = ref({
  resName: '',
  planDate: new Date()
});
const rules = ref({
  resName: [{ required: true, message: "请输入预案名称", trigger: "blur" }],
});

const handleOK = async() => {
  await formRef.value?.validate();
  emit('ok', { ...formData.value });
};
</script>
