<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 220)"
    append-to-body
    :title="personDetail.userName"
    @closed="$emit('cancel')"
  >
    <hl-row layout="grid" class="m-t-lg font-16" count="count-2" gap-x="var(--xxl)" gap-y="var(--lg)">
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">所属机构</span>
          <span class="font-bold group-item">{{ personDetail.orgName || '-' }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">联系方式</span>
          <span class="font-bold group-item display-flex items-middle" v-for="(item, index) in personDetail.communications" :key="index">
            <span>{{ COMMUNICATION_MODE_MAP[item.mode].label }}: {{ item.value }}</span>
            <img
              v-if="CALLABLE_COMMUNICATION_MODES.includes[item.mode] && item.value"
              class="icon m-l-sm"
              style="width: var(--sm); height: var(--sm);"
              :src="mobileIcon"
              @click="currentCallingUser = { ...personDetail, mobile: item.value}"
            >
          </span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">所属工作组</span>
          <span class="font-bold group-item" v-for="(item, index) in personDetail.groups" :key="index">
            {{ item }}
          </span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">组内岗位职责</span>
          <template v-if="personDetail.roles?.length">
            <span  class="font-bold group-item" v-for="(item, index) in personDetail.roles" :key="index">
              {{item.groupName }}: {{ formatRole(item.role) }}
            </span>
          </template>
          <span v-else>-</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">职责描述</span>
          <template v-if="personDetail.jobDescs?.length && personDetail.roles?.length">
            <span class="font-bold group-item" v-for="(item, index) in personDetail.jobDescs" :key="index">
            {{item.groupName }}: {{ item.jobDesc }}
          </span>
          </template>
          <span v-else>-</span>
        </hl-group>
      </hl-col>

      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">当前位置</span>
          <span class="font-bold group-item">{{ personDetail.position }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">集结状态</span>
          <template v-if="personDetail.assembles?.length">
          <span class="font-bold group-item" v-for="(item, index) in personDetail.assembles" :key="index">
            {{ item.assembleStatus }}
          </span>
          </template>
          <span v-else>-</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">集结目的地</span>
          <template v-if="personDetail.assembles?.length">
            <span class="font-bold group-item" v-for="(item, index) in personDetail.assembles" :key="index">
              {{ item.assembleTarget }}
            </span>
          </template>
          <span v-else>-</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">位置更新时间</span>
          <span class="font-bold group-item">{{ personDetail.positionUpdateTime }}</span>
        </hl-group>
      </hl-col>
    </hl-row>
  </hl-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Constants } from 'fx-front-utils';
import { COMMUNICATION_MODE_MAP, CALLABLE_COMMUNICATION_MODES } from '@/common';
import { useCalling, useIcons } from '@/hooks';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';
import { IpostGetEventPersonDetailSpace } from '@/apis/modules/site-personnel/model';

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
});

const route = useRoute();
const { currentCallingUser } = useCalling();
const { mobileIcon } = useIcons();

const personDetail = ref(({} as IpostGetEventPersonDetailSpace.Data));

const formatRole = (role: IpostGetEventPersonDetailSpace.Role[]) => {
  return role.join(',');
};
const formatJob = (jobs: IpostGetEventPersonDetailSpace.JobDesc[]) => {
  const result = jobs?.reduce((prev, cur) => {
    if (cur.jobDesc && cur.groupName) {
      prev.push(cur);
    }
    return prev;
  }, [] as IpostGetEventPersonDetailSpace.JobDesc[]);
  return result;
};

const getUserInfo = async(userId: string) => {
  if (userId) {
    const { data } = await apiSitePersonnelObj.postGetEventPersonDetail(userId, route.query.id as string);
    personDetail.value = { ...data, jobDescs: formatJob(data.jobDescs) };
  }
};

onMounted(async() => {
  await getUserInfo(props.id);
});
</script>

<style lang="scss" scoped>
</style>
