<template>
  <hl-dialog
    :title="`${ACTION_TYPE_DES_MAP[params.type]}${title}`"
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
      <hl-form-item label="名称" prop="resName">
        <hl-input
          v-model="formData.resName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="统一社会信用代码" prop="socialCreditCode">
        <hl-input
          v-model="formData.socialCreditCode"
          :disabled="pageDisabled || params.type === 'edit'"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
          @blur="check"
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="所属区域" prop="areaCode">
        <hl-cascader
            v-model="formData.areaCode"
            :disabled="pageDisabled"
            :props="areaProps"
            :options="areaCodeList"
            placeholder="请选择"
            block
            :show-all-levels="false"
        />
      </hl-form-item>
      <hl-form-item label="主管单位" prop="manageUnit">
        <hl-input
          v-model="formData.manageUnit"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="联系人" prop="personName">
        <hl-input
          v-model="formData.personName"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="联系电话" prop="personMobile">
        <hl-input
          v-model="formData.personMobile"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="详细地址" prop="address" class="col-span-2">
        <hl-group class="w-full">
          <hl-input
            v-model="formData.address"
            :disabled="pageDisabled"
            placeholder="请输入"
            :maxlength="100"
            block
            show-word-limit
          />
          <hl-button type="primary" :disabled="pageDisabled" @click="locMapDlgShow = true" equal>
            <hl-icon>
              <TwoPoint />
            </hl-icon>
          </hl-button>
        </hl-group>
      </hl-form-item>
      <hl-form-item label="经纬度" prop="lnglat">
        <hl-group gap="var(--lg)" align="items-middle" full>
          <hl-input
            v-model="formData.longitude"
            :disabled="pageDisabled"
          ></hl-input>
          <span>一</span>
          <hl-input
            v-model="formData.latitude"
            :disabled="pageDisabled"
          ></hl-input>
        </hl-group>
      </hl-form-item>
      <hl-form-item />
      <hl-form-item label="占地总面积(平方米)" prop="coverArea">
        <hl-input
          v-model="formData.coverArea"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="建筑面积(平方米)" prop="floorSpace">
        <hl-input
          v-model="formData.floorSpace"
          :disabled="pageDisabled"
          :maxlength="50"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="最大瞬时承载量(人次)" prop="maxMomentCapacity">
        <hl-input
          v-model="formData.maxMomentCapacity"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item label="日最大承载量(人次)" prop="maxDayCapacity">
        <hl-input
          v-model="formData.maxDayCapacity"
          :disabled="pageDisabled"
          :maxlength="10"
          placeholder="请输入"
          block
          show-word-limit
        ></hl-input>
      </hl-form-item>
      <hl-form-item v-if="code === 'DisasterStarHotel'" label="酒店星级" prop="starLevel">
        <hl-select
          v-model="formData.starLevel"
          :disabled="pageDisabled"
          clearable
          filterable
          placeholder="请选择"
          block
        >
          <hl-option
            v-for="item in DICT.STAR_RATED"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </hl-select>
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
    <location-map
      v-if="locMapDlgShow"
      :longitude="formData.longitude"
      :latitude="formData.latitude"
      @cancel="locMapDlgShow = false"
      @ok="selectMapPoint"
    />
  </hl-dialog>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { HlMessage } from "hongluan-ui";
import {
  ACTION_TYPE_DES_MAP,
  validatorMobile,
  validatorFloat,
  validatorLongitude,
  validatorLatitude,
  validatorInt,
} from "@/common";
import { LocationMap } from "@/components";
import { useAreaTree } from '@/hooks';
import { apiBasicInformationObj } from '@/apis/modules/basic-information';
import { DICT } from "./generic-methods";
import type { PropType } from "vue";
import type { FormInstance } from "hongluan-ui";
import type { ActionType } from '@/types';
import type { IlistSpace } from '@/apis/modules/area/model';
import type { IpostFindDisasterStarHotelPageSpace } from '@/apis/modules/basic-information/model';


const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  code: {
    type: String,
    default: "",
  },
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
  areaCodeList:{
    type: Array as PropType<IlistSpace.Data[]>,
    default:() => {return []}
  }
});
const emit = defineEmits(["cancel", "refresh"]);

const { areaProps } = useAreaTree();

const locMapDlgShow = ref(false);
const formRef = ref<FormInstance>();
const formData = ref({} as IpostFindDisasterStarHotelPageSpace.List);
const rules = ref({
  resName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  socialCreditCode: [{ required: true, message: "请输入统一社会信用代码", trigger: "blur" }],
  areaCode: [{ required: true, message: "请选择所属区域", trigger: "blur" }],
  personMobile: [{ message: "请输入11位手机号码", validator: validatorMobile }],
  lnglat: [
    {
      message: "请输入正确经纬度",
      validator: (_: any, value: string, callback: (err?: Error) => void) => {
        validatorLongitude(_, formData.value.longitude, callback);
        validatorLatitude(_, formData.value.latitude, callback);
      },
    },
  ],
  coverArea: [{ decimalLen: 50, message: "请输入数值类型", validator: validatorFloat }],
  floorSpace: [{ decimalLen: 50, message: "请输入数值类型", validator: validatorFloat }],
  maxMomentCapacity: [{ message: "请输入整数", validator: validatorInt }],
  maxDayCapacity: [{ message: "请输入整数", validator: validatorInt }],
});

const pageDisabled = computed(() => props.params.type === "detail");

const check = async () => {
  const res = await apiBasicInformationObj[`getCheck${props.code}` as 'getCheckDisasterPublicPlace'](formData.value.socialCreditCode);
  if (!res.data) {
    HlMessage.warning('统一社会信用代码重复');
    formData.value.socialCreditCode = '';
  }
};
const selectMapPoint = (info: Record<string, any>) => {
  const { address, latitude, longitude, citycode  } = info;
  locMapDlgShow.value = false;
  formData.value.longitude = longitude;
  formData.value.latitude = latitude;
  formData.value.address = address;
  // formData.value.areaCode = `${citycode}`;
};

const handleOK = async () => {
  await formRef.value?.validate();

  if (["add", "edit"].includes(props.params.type)) {
    const text = props.params.type === "add" ? "新增成功" : "编辑成功";
    await (apiBasicInformationObj as any)[props.params.type === "add"? `postAdd${props.code}` : `postModify${props.code}`](formData.value);
    HlMessage.success(text);
    emit("cancel");
    emit("refresh");
  }
};

const initFormData = async () => {
  if (props.params.type !== 'add') {
    const { data } = await apiBasicInformationObj[`postFind${props.code}ById` as 'postFindDisasterStarHotelById'](props.params.id);
    formData.value = data;
  }
};

onMounted(async () => {
  await initFormData();
});
</script>
