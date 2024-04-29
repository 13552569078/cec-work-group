<template>
  <hv-panel title="主体介绍">
    <hl-scrollbar style="height: calc(var(--lg) * 10)">
      <hl-row layout="grid" class="m-t-md" count="count-4">
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">名称</span>
            <span class="font-bold group-item">{{formData.regionName}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">监测主体分类</span>
            <span class="font-bold group-item">{{formData.regionTypeName}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">位置</span>
            <span class="font-bold group-item">{{formData.address?formData.address:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">所在街道</span>
            <span class="font-bold group-item">{{formData.streetAreaName?formData.streetAreaName:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">负责人</span>
            <span>{{formData.principalName?formData.principalName:'-'}} {{formData.principalMobile?formData.principalMobile:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">联系人</span>
            <span>{{formData.responsibleName?formData.responsibleName:'-'}} {{formData.responsibleMobile?formData.responsibleMobile:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">权属单位/物业</span>
            <span class="font-bold group-item">{{formData.belongOrgName?formData.belongOrgName:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">负责人及电话</span>
            <span class="font-bold group-item">{{formData.belongName?formData.belongName:'-'}} {{formData.belongMobile?formData.belongMobile:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">主管部门</span>
            <span class="font-bold group-item">{{formData.chargeOrgName?formData.chargeOrgName:'-'}}</span>
          </hl-group>
        </hl-col>
        <hl-col span="col col-span-2">
          <hl-group dir="vertical" class="info-description auto-height">
            <span class="text-secondary group-item">负责人及电话</span>
            <span class="font-bold group-item">{{formData.chargeName?formData.chargeName:'-'}} {{formData.chargeMobile?formData.chargeMobile:'-'}}</span>
          </hl-group>
        </hl-col>
      </hl-row>
    </hl-scrollbar>
  </hv-panel>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRoute } from 'vue-router';
import { apiMonitorRegionObj } from '@/apis/modules/monitorRegion';
import { IgetMonitorRegionSpace } from '@/apis/modules/monitorRegion/model';

export default defineComponent({
  setup() {
    const route = useRoute();
    const formData = ref<IgetMonitorRegionSpace.Data>({
      'id': 0,
      'regionName': '',
      'regionTypeCode': '',
      'regionTypeName': '',
      'principalName': '',
      'principalMobile': '',
      'responsibleName': '',
      'responsibleMobile': '',
      'address': '',
      'longitude': '',
      'latitude': '',
      'streetAreaCode': '',
      'streetAreaName': '',
      'belongOrgId': '',
      'belongOrgName': '',
      'belongName': '',
      'belongMobile': '',
      'chargeOrgId': '',
      'chargeOrgName': '',
      'chargeName': '',
      'chargeMobile': '',
      'description': '',
    });

    const initData = async() => {
      const result = await apiMonitorRegionObj.getMonitorRegion(route.query.monitorRegionId as string);
      formData.value = result.data;
    };

    initData();
    return {
      formData
    };
  },
});
</script>
<style lang="scss" scoped></style>
