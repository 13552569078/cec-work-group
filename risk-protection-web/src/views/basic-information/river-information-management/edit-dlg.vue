<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}河流`"
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 260)"
    @close="$emit('cancel')"
  >
    <hl-form
      :model="formData"
      ref="formRef"
      :rules="rules"
      :width="['col-24', 'col-24']"
      class="m-l-sm count-2 grid grid-direction-vertical hl-row"
      style="--row-gap-x: calc(var(--xxs) * 5); --row-gap-y: calc(var(--xxs) * 5)"
    >
      <hl-form-item label="河流名称" prop="name">
        <hl-input
          v-model="formData.name"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河流部级系统代码" prop="riverCode">
        <hl-input
          v-model="formData.riverCode"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河流所属行政区名称" prop="areaCode">
        <hl-select
          v-model="formData.areaCode"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.RIVER_REGION"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="河流长度(km)" prop="riverLength">
        <hl-input
          v-model="formData.riverLength"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河流流域面积(k㎡)" prop="riverArea">
        <hl-input
          v-model="formData.riverArea"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="死亡失踪人口" prop="deathNum">
        <hl-input
          v-model="formData.deathNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一级河流名称" prop="parentName">
        <hl-input
          v-model="formData.parentName"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="上一级河流部级系统代码" prop="parentRiverCode">
        <hl-input
          v-model="formData.parentRiverCode"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="所属水系" prop="waterSystem">
        <hl-input
          v-model="formData.waterSystem"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="跨界类型" prop="transboundaryType">
        <hl-select
          v-model="formData.transboundaryType"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.RIVER_CROSS_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="流经地" prop="followAddress">
        <hl-input
          v-model="formData.followAddress"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河源位置描述" prop="riverSourceDesc">
        <hl-input
          v-model="formData.riverSourceDesc"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河流类型" prop="riverType">
        <hl-input
          v-model="formData.riverType"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河源经度" prop="riverSourceLongitude">
        <hl-input
          v-model="formData.riverSourceLongitude"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河流功能" prop="riverFunction">
        <hl-input
          v-model="formData.riverFunction"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河源纬度" prop="riverSourceLatitude">
        <hl-input
          v-model="formData.riverSourceLatitude"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河口位置描述" prop="riverMouthDesc">
        <hl-input
          v-model="formData.riverMouthDesc"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河口经度" prop="riverMouthLongitude">
        <hl-input
          v-model="formData.riverMouthLongitude"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="河口纬度" prop="riverMouthLatitude">
        <hl-input
          v-model="formData.riverMouthLatitude"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
    </hl-form>
    <template #footer>
      <div class="dlg-footer">
        <hl-button @click="$emit('cancel')">取消</hl-button>
        <hl-button v-if="params.type !== 'detail'" class="m-l-lg" type="primary" @click="handleOK"
          >确定</hl-button
        >
      </div>
    </template>
  </hl-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { HlMessage } from "hongluan-ui";
import { ACTION_TYPE_DES_MAP, validatorInt, validatorLongitude, validatorLatitude } from "@/common";
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import { DICT } from "../generic-methods";
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { IpostFindDisasterRiverByIdSpace } from '@/apis/modules/basic-information/model';
import type { ActionType } from '@/types';

const props = defineProps({
  params: {
    type: Object as PropType<{
      id: string;
      type: ActionType;
    }>,
    default: () => {
      return {
        id: "",
        type: "",
      };
    },
  },
});
const emit = defineEmits(["cancel", "refresh"]);

const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindDisasterRiverByIdSpace.Data);
const rules = ref({
  name: [{ required: true, message: "请输入河流名称", trigger: "blur" }],
  riverArea: [{ message: "请输入整数", validator: validatorInt }],
  deathNum: [{ message: "请输入整数", validator: validatorInt }],
  riverSourceLongitude: [{ message: "请输入正确经度", validator: validatorLongitude }],
  riverSourceLatitude: [{ message: "请输入正确纬度", validator: validatorLatitude }],
  riverMouthLongitude: [{ message: "请输入正确经度", validator: validatorLongitude }],
  riverMouthLatitude: [{ message: "请输入正确纬度", validator: validatorLatitude }],
});

const pageDisabled = computed(() => props.params.type === "detail");

const handleOK = async () => {
  await formRef.value?.validate();
  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    props.params.type === "add" ? "" : "";
    await apiBasicInformationObj[props.params.type === "add"? 'postAddDisasterRiver':'postModifyDisasterRiver'](formData.value);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};
const initFormData = async () => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj.postFindDisasterRiverById(props.params.id);
    formData.value = data;
  }
};

onMounted(async () => {
  await initFormData();
});
</script>
