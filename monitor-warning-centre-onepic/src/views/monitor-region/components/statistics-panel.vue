<template>
  <hl-group gap="var(--sm)" class="today-condition" dir="vertical" style="width: calc(var(--xxs) * 200)">
    <hl-group class="border-bottom p-b-sm" @click="dialogVisible = true">
      <h4>监测主体：{{ detail.regionName || '--' }}</h4>
    </hl-group>
    <hl-group gap="var(--md)" full>
      <hl-group class="ststic card-flag bg-light" gap="var(--sm)" align="items-middle" style="--card-padding: var(--sm)">
        <hl-icon class="static" size="xxl" type="primary"><fill-user /></hl-icon>
        <hl-group dir="vertical">
          <h4>{{ detail.principalName || '--' }}</h4>
          <span class="text-secondary">负责人</span>
        </hl-group>
      </hl-group>

      <hl-group class="ststic card-flag bg-light" gap="var(--sm)" align="items-middle" style="--card-padding: var(--sm)">
        <hl-icon class="static" size="xxl" type="primary"><fill-tel /></hl-icon>
        <hl-group dir="vertical">
          <h4>{{ detail.principalMobile || '--' }}</h4>
          <span class="text-secondary">负责人电话</span>
        </hl-group>
      </hl-group>

      <hl-group class="ststic card-flag bg-light" gap="var(--sm)" align="items-middle" style="--card-padding: var(--sm)">
        <hl-icon class="static" size="xxl" type="primary"><fill-user /></hl-icon>
        <hl-group dir="vertical">
          <h4>{{ detail.responsibleName || '--' }}</h4>
          <span class="text-secondary">联系人</span>
        </hl-group>
      </hl-group>

      <hl-group class="ststic card-flag bg-light" gap="var(--sm)" align="items-middle" style="--card-padding: var(--sm)">
        <hl-icon class="static" size="xxl" type="primary"><fill-tel /></hl-icon>
        <hl-group dir="vertical">
          <h4>{{ detail.responsibleMobile || '--' }}</h4>
          <span class="text-secondary">联系人电话</span>
        </hl-group>
      </hl-group>
    </hl-group>
  </hl-group>
  <hl-dialog v-model="dialogVisible" width="calc(var(--xxl) * 30)" :show-close="true">
    <template #header>
      <h4>主体名称: {{ detail.regionName }}</h4>
    </template>
    <hl-row layout="grid" class="m-t-lg" count="count-3" gap-x="var(--xxl)" gap-y="var(--lg)">
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">监测主体分类</span>
          <span class="font-bold group-item">{{ detail.regionTypeName }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">位置</span>
          <span class="font-bold group-item">{{ detail.address }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">负责人及电话</span>
          <span class="font-bold group-item">{{ detail.principalName }} ：{{ detail.principalMobile }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">责任人及电话</span>
          <span class="font-bold group-item">{{ detail.responsibleName }} ：{{ detail.responsibleMobile }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">权属单位/物业</span>
          <span class="font-bold group-item">{{ detail.belongOrgName || '--' }}</span>
        </hl-group>
      </hl-col>

      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">权属单位/物业联系人及电话</span>
          <span class="font-bold group-item">{{ detail.belongName }} ：{{ detail.belongMobile }}</span>
        </hl-group>
      </hl-col>
      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">主管部门</span>
          <span class="font-bold group-item">{{ detail.chargeOrgName || '--' }}</span>
        </hl-group>
      </hl-col>

      <hl-col span="col">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">主管部门联系人及电话</span>
          <span class="font-bold group-item">{{ detail.chargeName }} ：{{ detail.chargeMobile }}</span>
        </hl-group>
      </hl-col>

      <hl-col span="col col-span-3">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">描述</span>
          <span class="font-bold group-item">{{ detail.description }}</span>
        </hl-group>
      </hl-col>

      <hl-col span="col col-span-3">
        <hl-group dir="vertical" class="info-description auto-height">
          <span class="text-secondary group-item">现场照片</span>
          <hl-group gap="var(--md)" wrap v-if="detail.photoFile?.length">
            <hl-thumb v-for="item in detail.photoFile" :key="item" style="width: 100px; height: 100px" :src="item.url" fit="cover" :preview-src-list="srcList" />
          </hl-group>
        </hl-group>
      </hl-col>
    </hl-row>

    <template #footer>
      <span class="dialog-footer">
        <hl-button @click="dialogVisible = false">取 消</hl-button>
        <hl-button type="primary" class="m-l-md" @click="dialogVisible = false">确 定</hl-button>
      </span>
    </template>
  </hl-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiSubjectObj } from '@/apis/modules/subjectDetail';
import { IgetMonitorRegionSpace } from '@/apis/modules/subjectDetail/model';
import user from '@/assets/images/region/user.png';
import tel from '@/assets/images/region/tel.png';

const props = defineProps({
  regionId: {
    type: String,
    default: '1'
  }
});

const detail = ref({} as IgetMonitorRegionSpace.Data);
const dialogVisible = ref(false);
const srcList = ref<string[]>([]);

const getDetail = async() => {
  // props.regionId
  // const id = '1526838068103598082';
  const { data } = await apiSubjectObj.getMonitorRegion(props.regionId);
  detail.value = data;
  srcList.value = data.photoFile.map((item: any) => {
    return item.url;
  });
};

getDetail();
</script>
<style lang="scss" scoped>
  .today-condition{
    background-color: var(--bg-body);
    padding:var(--md);
    opacity: 0.92;
  }
</style>
