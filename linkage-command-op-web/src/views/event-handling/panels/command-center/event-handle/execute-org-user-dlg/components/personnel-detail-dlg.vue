<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxl) * 19)"
    teleported
    append-to-body
    borderless
    title="人员详情"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="$emit('cancel')"
  >
    <hl-row layout="grid" class="m-t-lg font-16" count="count-2" gap-x="var(--xxl)" gap-y="var(--lg)">
      <hl-col span="col col-span-2">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">头像</span>
          <hl-group class="icon-size" align="items-middle items-center">
            <hl-thumb
              v-if="personDetail?.profilePicture"
              class="profile-picture"
              :src="getRemoteFilePath(personDetail?.profilePicture)"
            />
            <hl-thumb
              v-else
              class="profile-picture"
              :src="defaultIcon"
            />
          </hl-group>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">姓名</span>
          <span class="font-bold group-item">{{ personDetail?.userName }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">性别</span>
          <span class="font-bold group-item">{{ dictMap.get(personDetail?.gender) || '未知' }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">人员类型</span>
          <span class="font-bold group-item">{{ personDetail?.temporaryPersonnel?'非系统用户':'系统用户'}}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">所属机构</span>
          <span class="font-bold group-item">{{  personDetail?.orgName || '--' }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">组内岗位职责</span>
          <span class="font-bold group-item">{{ personDetail?.poolRoles?.map(ele => (ele.poolRoleName)).join('，') || '--' }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">工作职责</span>
          <span class="font-bold group-item">{{  personDetail?.jobDescription || '--'}}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">联系方式</span>
          <span class="font-bold group-item">{{ personDetail?.communicationMode?.map(ele => (ele.value)).join('，') || '--' }}</span>
        </hl-group>
      </hl-col>

    </hl-row>
  </hl-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, } from 'vue';
import { getRemoteFilePath } from '@/common';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import defaultIcon from '@/assets/images/layout/operate2.png';
import { IpostFindStrategyCommandUserByIdSpace } from '@/apis/modules/command-center/model';

const props = defineProps({
  personId: {
    type: String,
  },
});
const emit = defineEmits(['cancel']);

const dictMap = new Map([
  ['0', '女'],
  ['1', '男'],
]);
const personDetail = ref({} as IpostFindStrategyCommandUserByIdSpace.Data);

const getDetail = async() => {
  if (!props.personId) return;
  const res = await apiCommandCenterObj.postFindStrategyCommandUserById(props.personId);
  personDetail.value = res.data;
};

onMounted(async() => {
  await getDetail();
});
</script>

<style lang="scss" scoped>
.icon-size {
  width: calc(var(--xxs) * 18) ;
  height: calc(var(--xxs) * 18) ;
  box-shadow: 0px 9px 19px 0px rgba(134, 175, 238, 0.36);
  border-radius: 100%;
}
</style>
