<template>
  <div class="persons-tab self-grow display-flex flex-col">
    <hl-group v-if="!$route.query.hideInvitation && isBelongMe && canEdit" class="add-button" @click="showCooperateDlg = true">
      <span>邀请协作人员</span>
      <hl-icon color="#BDBDBD"><svg viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" class="icon-system" name="SystemAdd" iconId="icon_8494"><!----><g stroke="currentColor"><path d="M4,11 L18,11 M11,4 L11,18"></path></g></svg></hl-icon>
    </hl-group>
    <button-tabs :tabs="tabs" class="w-full" @click="v => tab = v"/>
    <hl-scrollbar class="persons-list">
      <hl-group
        v-for="item in (tab === 'first' ? cooperate : unCooperate)" :key="item.id"
        class="p-y-sm radius-sm" full align="items-middle"
      >
        <hl-group align="items-middle" :class="['edit-info-group', item.hasEdit ? '' : 'not-edit']">
          <hl-thumb round size="sm" type="primary" class="person-icon">
            <span class="static">{{ item.userName.slice(0, 1) }}</span>
          </hl-thumb>
          <span class="font-md m-l-xs ellipsis p-r-sm user-name">{{ item.userName }}</span>
          <span class="edit-tag font-sm" v-if="item.hasEdit && tab === 'first'">编辑者</span>
        </hl-group>
        <hl-group v-if="item.userId !== userInfo?.empid && isBelongMe && canEdit" align="items-right items-middle" class="static">
          <hl-switch
            v-model="item.hasEdit"
            :active-value="1" :inactive-value="0"
            active-color="#4CC09E" inactive-color="#BDBDBD"
            type="success" size="md"
            @change="flag => changeCooperate(flag, item)"
          />
          <hl-icon size="md" class="m-l-sm cursor-pointer" type="primary" @click="deleteCooperate(item)">
            <two-delete />
          </hl-icon>
        </hl-group>
      </hl-group>
    </hl-scrollbar>
    <org-user-selector-dlg
      v-if="showCooperateDlg"
      class="add-plotting-users-dlg"
      title="邀请人员"
      :show-org-tab="false"
      :show-group-tab="false"
      :disabled="disabledUsers"
      is-required
      @submit="addUsers"
      @cancel="showCooperateDlg=false"
    >
    </org-user-selector-dlg>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { User, useUser } from 'fx-front-ucenter';
import { ButtonTabs, OrgUserSelectorDlg } from '@/components';
import { apiUserRelationListObj } from '@/apis/modules/user-relation-list';
import { IpostFindUserListPlottingSpace } from '@/apis/modules/user-relation-list/model';
import { useMapPlotting } from '@/hooks';

const route = useRoute();
const { getUserInfo } = useUser();
const { canEdit, currentPlottingInfo } = useMapPlotting();

const userInfo = ref<User>();

const tab = ref('first');
const showCooperateDlg = ref(false);
const list = ref<IpostFindUserListPlottingSpace.Data[]>([]);

const cooperate = computed(() => list.value.filter(l => l.hasPainting === 1));
const unCooperate = computed(() => list.value.filter(l => l.hasPainting !== 1));
const isBelongMe = computed(() => !!list.value.find(l => l.myCreated === 1));
const tabs = computed(() => [
  { label: `已加入${cooperate.value.length ? '(' + cooperate.value.length + ')' : ''}`, value: 'first' },
  { label: `未加入${unCooperate.value.length ? '(' + unCooperate.value.length + ')' : ''}`, value: 'second' }
]);
const disabledUsers = computed(() => list.value.map(u => ({ ...u, type: 'user' })));

const deleteCooperate = async(item: IpostFindUserListPlottingSpace.Data) => {
  await HlMessageBox.confirm('确定删除当前协作人吗?', '提示', {
    confirmButtonText: '确定',
    confirmButtonType: 'danger',
    cancelButtonText: '取消',
  });
  const payload = {
    layerId: item.layerId,
    userIdList: [item.userId],
    userNameList: [item.userName],
  };
  const res = await apiUserRelationListObj.postRemoveByUserIdsPlotting(payload);
  HlMessage(res.desc);
  getList();
};
const changeCooperate = async(flag: boolean, item: IpostFindUserListPlottingSpace.Data) => {
  const payload = {
    hasEdit: Number(flag),
    layerId: item.layerId,
    userIdList: [item.userId],
    userNameList: [item.userName],
  };
  try {
    const res = await apiUserRelationListObj.postChangeStatusListPlotting(payload);
    HlMessage(res.desc);
  } finally {
    getList();
  }
};
const addUsers = async({ organization: { user: ouser }, commandSystem: { user: cuser } }: Record<string, any>) => {
  const payload = [...ouser, ...cuser].map(t => ({ ...t, layerId: route.query.layerId, hasEdit: 1 }));
  const res = await apiUserRelationListObj.postSaveListPlotting(payload);
  HlMessage(res.desc);
  showCooperateDlg.value = false;
  getList();
};

const getList = async() => {
  const res = await apiUserRelationListObj.postFindUserListPlotting('', route.query.layerId as string);
  list.value = res.data;
};

watch(() => route.query.layerId, layerId => {
  layerId && getList();
}, {
  immediate: true,
});

watch(() => currentPlottingInfo.needRefresh, val => {
  val && getList();
});

onMounted(async() => {
  userInfo.value = await getUserInfo();
});
</script>

<style lang="scss" scoped>
.persons-tab {
  .add-button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #2F5787;;
    padding: 0 var(--xs) var(--xs);
    cursor: pointer;
    margin-bottom: var(--lg);
    span {
      font-size: var(--font-md);
      font-weight: var(--font-weight);
    }
    .hl-icon {
      border: 1px solid #BDBDBD;
      border-radius: 50%;
    }
  }
  :deep(.button-tabs) {
    display: flex;
    column-gap: var(--px20);
    margin-bottom: var(--px20);
    .hl-button {
      width: auto;
      flex: 1;
      margin-right: 0 !important;
    }
  }
  .persons-list {
    flex: 1 0 0;
    .person-icon.primary {
      --thumb-bg-color: #36A4FF;
      --thumb-font-color: white;
    }
    .edit-tag {
      background: rgba(62,125,255,0.16);
      border-radius: 2px;
      color: #36A4FF;
      padding: calc(var(--xxs) * 0.5) var(--xxs);
    }
  }
}
</style>
