<template>
  <org-user-selector-dlg
    ref="orgDlgRef"
    class="create-plotting-dlg"
    title="新建标绘"
    empty-tip="请选择协作者"
    :show-org-tab="false"
    :show-group-tab="false"
    :disabled="currentUser"
    is-required
    @submit="addUsers"
    @cancel="$emit('cancel')"
  >
    <template #top>
      <div class="top-content">
        <div class="title">
          <h5>标绘设置</h5>
        </div>
        <hl-form ref="formRef" :model="formData">
          <hl-form-item label="专题图名称" prop="layerName" :rules="[{ required: true, message: '请输入名称' }]">
            <hl-input v-model="formData.layerName" placeholder="请输入" block :maxlength="50" clearable />
          </hl-form-item>
        </hl-form>
        <div class="title people">
          <h5>协作人员</h5>
        </div>
      </div>
    </template>
  </org-user-selector-dlg>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { FormInstance, HlMessage } from 'hongluan-ui';
import { User, useUser } from 'fx-front-ucenter';
import { OrgUserSelectorDlg } from '@/components';
import SendMsgForm from './send-msg-form.vue';
import { apiLayerListObj } from '@/apis/modules/layer-list';

const emit = defineEmits(['ok', 'cancel']);

const route = useRoute();
const { getUserInfo } = useUser();

const orgDlgRef = ref();
const formRef = ref<FormInstance>();
const formData = reactive({ layerName: '', layerType: 'map', userList: [] as Record<string, any>[] });
const currentUser = ref<Record<string, any>[]>([]);

const addUsers = async({ organization: { user: ouser }, commandSystem: { user: cuser } }: Record<string, any>) => {
  formData.userList = [...ouser, ...cuser];
  await formRef.value?.validate();
  const res = await apiLayerListObj.postAddCertPlottingLayerOnePic({
    ...formData,
    resourceId: route.query.id,
  });
  HlMessage.success('新增成功');
  emit('ok', { layerId: res.data, layerName: formData.layerName });
};

onMounted(async() => {
  const user = await getUserInfo();
  currentUser.value = [{ ...user, userName: user.empname, userId: user.empid, type: 'user' }];
});
</script>
<style lang="scss">
.create-plotting-dlg {
  --top-height: calc(var(--xxs) * 39);
  .top-content {
    width: 50%;
    height: var(--top-height);
    .title {
      display: flex;
      align-items: center;
      padding-bottom: var(--xxs);
      margin-bottom: calc(var(--xxs) * 1.5);
      background-image: url('@/assets/images/map/plotting/title-bottom.png');
      background-position: bottom left;
      background-size: calc(var(--xxs) * 23) calc(var(--xxs) * 2.25);
      background-repeat: no-repeat;
      h5 {
        padding-left: calc(var(--xxs) * 6);
        background-image: url('@/assets/images/map/plotting/title-icon.png');
        background-size: calc(var(--xxs) * 4) calc(var(--xxs) * 4);
        background-repeat: no-repeat;
        background-position: center left;
      }
      &.people {
        margin-top: calc(var(--xxs) * 5);
      }
    }
  }
}
</style>
