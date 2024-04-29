<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}历史灾情`"
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
      <hl-form-item label="灾情主题" prop="title">
        <hl-input
          v-model="formData.title"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item></hl-form-item>
      <hl-form-item label="灾情类型" prop="disasterType">
        <hl-select
          v-model="formData.disasterType"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
          @change="disasterTypeChange"
        >
          <hl-option
            v-for="item in DICT.DISASTER_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="灾情小类" prop="disasterSmallType">
        <hl-select
          v-model="formData.disasterSmallType"
          :disabled="pageDisabled || ![10,11].includes(+formData.disasterType)"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.DISASTER_SMALL_TYPE"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="灾情开始日期" prop="startDate">
        <hl-date-picker
          v-model="formData.startDate"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          block
          @change="dateChange('startDate')"
        />
      </hl-form-item>
      <hl-form-item label="灾情结束日期" prop="endDate">
        <hl-date-picker
          v-model="formData.endDate"
          :disabled="pageDisabled"
          placeholder="请选择"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          block
          @change="dateChange('endDate')"
        />
      </hl-form-item>
      <hl-form-item label="受灾人口" prop="disasterNum">
        <hl-input
          v-model="formData.disasterNum"
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
      <hl-form-item label="转移人口(万人)" prop="transferNum">
        <hl-input
          v-model="formData.transferNum"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="直接经济损失(万元)" prop="economicLoss">
        <hl-input
          v-model="formData.economicLoss"
          :disabled="pageDisabled"
          :maxlength="20"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="是否重大灾情" prop="isMajorDisaster">
        <hl-select
          v-model="formData.isMajorDisaster"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.OPTION"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="是否受灾" prop="hasDisaster">
        <hl-select
          v-model="formData.hasDisaster"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.OPTION"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
      </hl-form-item>
      <hl-form-item label="所属区域" prop="areaCode">
        <hl-cascader
          v-model="formData.areaCode"
          :disabled="pageDisabled"
          :props="areaProps"
          :options="areaTreeData"
          placeholder="请选择"
          block
          :show-all-levels="false"
        />
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
import { ref, computed,onMounted } from "vue";
import { HlMessage } from "hongluan-ui";
import { ACTION_TYPE_DES_MAP,validatorFloat,validatorInt} from "@/common";
import { useAreaTree } from '@/hooks';
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import { DICT } from "../generic-methods";
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { IpostFindDisasterHistoryByIdSpace } from '@/apis/modules/basic-information/model';
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

const { getAreaTree, areaProps, areaTreeData } = useAreaTree();

const Int = [{ message: "请输入整数", validator: validatorInt }];

const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindDisasterHistoryByIdSpace.Data);
const rules = ref({
  title: [{ required: true, message: "请输入灾情主题", trigger: "blur" }],
  disasterType: [{ required: true, message: "请选择灾情类型", trigger: "blur" }],
  disasterNum: Int,
  deathNum: Int,
  transferNum: Int,
  economicLoss:[{ decimalLen: 20, message: '请输入数值类型', validator: validatorFloat }],
});

const pageDisabled = computed(() => props.params.type === "detail");

const disasterTypeChange = () => {
  if (! [10,11].includes(+formData.value.disasterType)) {
    formData.value.disasterSmallType = '';
  }
}
const dateChange = (type:string) => {
  if (new Date(Date.parse(formData.value.endDate))  < new Date(Date.parse(formData.value.startDate))) {
    HlMessage.warning( type === 'startDate' ? '灾情开始日期应小于等于灾情结束日期': '灾情结束日期应大于等于灾情开始日期');
    type === 'startDate' ?  formData.value.startDate = '' : formData.value.endDate = ''
  }
}
const handleOK = async () => {
  await formRef.value?.validate();
  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    props.params.type === "add" ? "" : "";
    await apiBasicInformationObj[props.params.type === "add"? 'postAddDisasterHistory':'postModifyDisasterHistory'](formData.value);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};
const initFormData = async () => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj.postFindDisasterHistoryById(props.params.id);
    data.disasterType = `${data.disasterType}`;
    formData.value = data;
  }
};

onMounted(async() => {
  await getAreaTree();
  await initFormData();
})

</script>
