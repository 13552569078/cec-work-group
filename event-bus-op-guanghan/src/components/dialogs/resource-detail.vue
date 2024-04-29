<template>
  <common-dialog title="资源详情" width="calc(var(--xl) * 18)">
    <hl-group dir="vertical" gap="0" full style="background-color: rgba(7, 41, 71, 1);">
      <hl-group class="box-styled p-sm" dir="vertical" gap="var(--xxs)">
        <hl-popover
          tooltip
          trigger="hover"
          :content="form.name"
          placement="bottom"
          :disabled="form.name?.length<20"
        >
          <template #reference>
             <h4 class="gradient-text resource-name">{{ form.name }}</h4>
          </template>
        </hl-popover>
      </hl-group>
      <hl-group class="bg-cell p-sm" align="items-between">
        <span class="label font-lg font-bold">{{ form.type?resourcesList.filter(item => {return item.type=== form.type})[0].name:handleEmptyStr(form.type) }}</span>
        <span class="font-lg font-bold">{{ handleEmptyStr(form.address) }}</span>
      </hl-group>
      <!-- <hl-group class="bg-cell p-sm" align="items-between">
        <span class="label">地址</span>
        <span class="font-lg">{{ handleEmptyStr(form.address) }}</span>
      </hl-group> -->
      <hl-group class="bg-cell p-sm" align="items-between">
        <!-- <span class="label">资源描述</span> -->
        <span class="font-lg font-bold">{{ handleEmptyStr(form.resourceDesc) }}</span>
      </hl-group>
      <hl-group class="bg-cell p-sm" align="items-between">
        <span class="label">联系人<span class="m-l-xs font-lg font-bold">{{ handleEmptyStr(form.contactName) }}</span></span>
        <span class="label">联系方式<span class="m-l-xs font-bold">{{ handleEmptyStr(form.contactPhone) }}</span></span>

      </hl-group>
     <!--  <hl-group class="bg-cell p-sm" align="items-between">
        <span class="label">联系方式</span>
        <span class="font-lg">{{ handleEmptyStr(form.contactPhone) }}</span>
      </hl-group> -->
    </hl-group>
  </common-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { handleEmptyStr } from '@/common';
import { useGlobalState } from '@/hooks';
import { apiEventResourcesObj } from '@/apis';

const { resourcesList } = useGlobalState();

const props = defineProps({
  formData: {
    type: Object,
    default: () => {
      return {
        'address': '',
        'contactName': '',
        'contactPhone': '',
        'id': 0,
        'latitude': '',
        'longitude': '',
        'name': '',
        'resourceDesc': '',
        'type': 0
      };
    }
  }
});
const form = ref({
  'address': '',
  'contactName': '',
  'contactPhone': '',
  'id': 0,
  'latitude': '',
  'longitude': '',
  'name': '',
  'resourceDesc': '',
  'type': 0
});
watch(() => props.formData, async val => {
  if (val.id) {
    const { data } = await apiEventResourcesObj.postResourceDetail(val.id);
    form.value = data;
  }
}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped></style>
