<template>
  <hl-dialog
    :model-value="true"
    width="calc(var(--xxs) * 300)"
    :title="getDlgTitle()"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
  >
    <hl-group v-if="!editDlgVisible" full gap-x="calc(var(--xxs) * 4.75)" style="height:calc(var(--xxs) * 163);">
      <hl-group class="left h-100" dir="vertical" gap-y="calc(var(--xxs) * 2.75)">
        <div class="head-box">
          <div class="title">{{ type === 'leader'? '批示列表': '建议列表' }}</div>
          <hl-button v-if="!eventIsFinished" type="primary" @click="handleEdit('add')">新建{{ type === 'leader'? '批示': '建议' }}</hl-button>
        </div>
        <hl-scrollbar class="self-full">
          <div class="list-item p-x-md display-flex m-b-xxs items-middle items-between"
            :class="{'is-active': activeId === item.id}" v-for="item in list" :key="item.id"
            @click="changeActiveItem(item.id)">
            <span class="name self-full ellipsis">{{ item[getFieldInfo('name').field]}}</span>
            <span class="time self-no-full">{{ item[getFieldInfo('time').field] }}</span>
          </div>
        </hl-scrollbar>
      </hl-group>
      <hl-scrollbar class="right h-100" v-if="list.length > 0">
        <div class="opt-box" v-if="!eventIsFinished">
          <img @click="handleMsg" src="@/assets/images/event-handling/left-2/comment-advice-notice-icon.png" alt="发送通知" title="发送通知">
          <img @click="handleEdit('edit')" src="@/assets/images/event-handling/left-2/comment-advice-edit-icon.png" alt="编辑" title="编辑">
          <img @click="handleDel(detailData.id)" src="@/assets/images/event-handling/left-2/comment-advice-del-icon.png" alt="删除" title="删除">
        </div>
        <div class="base-info">
          <img src="@/assets/images/event-handling/left-2/comment-advice-leader.png" alt="">
          <div class="name">{{ detailData[getFieldInfo('name').field] }}</div>
          <div style="margin-bottom:calc(var(--xxs) * 1.5);"><span class="tips m-r-sm">{{ getFieldInfo('time').label }}</span><span>{{ detailData[getFieldInfo('time').field] }}</span></div>
          <div class="m-b-sm"><span class="tips m-r-sm">{{ getFieldInfo('orgName').label }}</span><span>{{ detailData[getFieldInfo('orgName').field] }}</span></div>
        </div>
        <div class="p-sm m-b-sm common-card-bg">
          <span class="tips">{{ getFieldInfo('content').label }}</span>
          <div class="m-t-xxs">{{ detailData[getFieldInfo('content').field] }}</div>
        </div>
        <div class="p-sm common-card-bg">
          <span class="tips">{{ getFieldInfo('file').label }}</span>
          <file-card
            v-if="detailData[getFieldInfo('file').field]"
            class="m-t-xxs"
            :url="detailData[getFieldInfo('file').field]"
          />
          <div v-else>--</div>
        </div>
      </hl-scrollbar>
      <hb-empty class="empty-box" v-if="list.length===0" :image="NoDataImg"/>
    </hl-group>
    <edit
      v-if="editDlgVisible"
      :fieldsMap="typeMap[type].fieldsMap"
      :editForm="editForm"
      @handleCancel="handleClose"
      @handleSave="handleSave"
    />
    <send-msg-dlg v-if="msgDlgVisible" :messageTitle="typeMap[type].title + '通知'" :content="msgContent" @cancel="msgDlgVisible=false" />
  </hl-dialog>
</template>
<script setup lang="ts">
import { ref, PropType } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { MAX_PAGE_SIZE } from '@/common';
import { useCurrentEvent } from '@/hooks';
import { SendMsgDlg, FileCard } from '@/components';
import { IdFiled } from '@/types';
import NoDataImg from '@/assets/images/empty/no-data.png';
import { apiCommentAdviceStatisticsObj } from '@/apis/modules/comment-advice-statistics';
import Edit from './edit.vue';

const typeMap: Record<string, any> = {
  'leader': {
    title: '领导批示',
    api: {
      list: 'postFindLeaderInstructionPage',
      add: 'postAddLeaderInstruction',
      edit: 'postModifyLeaderInstruction',
      del: 'postDeleteLeaderInstruction',
      query: 'postFindLeaderInstructionById',
    },
    fieldsMap: {
      name: {
        field: 'leaderName',
        label: '领导姓名',
      },
      orgName: {
        field: 'orgName',
        label: '所属组织机构',
      },
      time: {
        field: 'instructionTime',
        label: '批示时间',
      },
      content: {
        field: 'instructionContent',
        label: '批示内容',
      },
      file: {
        field: 'instructionFile',
        label: '批示附件',
      },
      fileName: {
        field: 'instructionFileName',
        label: '批示附件',
        hide: true
      }
    },
  },
  'department': {
    title: '部门建议',
    api: {
      list: 'postFindDepartmentAdvicePage',
      add: 'postAddDepartmentAdvice',
      edit: 'postModifyDepartmentAdvice',
      del: 'postDeleteDepartmentAdvice',
      query: 'postFindDepartmentAdviceById',
    },
    fieldsMap: {
      name: {
        field: 'departmentName',
        label: '姓名',
      },
      orgName: {
        field: 'orgName',
        label: '所属组织机构',
      },
      time: {
        field: 'adviceTime',
        label: '建议时间',
      },
      content: {
        field: 'adviceContent',
        label: '建议内容',
      },
      file: {
        field: 'adviceFile',
        label: '建议附件',
      },
      fileName: {
        field: 'adviceFileName',
        label: '建议附件',
        hide: true
      }
    },
  },
  'expert': {
    title: '专家建议',
    api: {
      list: 'postFindExpertAdvicePage',
      add: 'postAddExpertAdvice',
      edit: 'postModifyExpertAdvice',
      del: 'postDeleteExpertAdvice',
      query: 'postFindExpertAdviceById',
    },
    fieldsMap: {
      name: {
        field: 'expertName',
        label: '专家姓名',
      },
      orgName: {
        field: 'orgName',
        label: '所属单位',
      },
      time: {
        field: 'adviceTime',
        label: '建议时间',
      },
      content: {
        field: 'adviceContent',
        label: '建议内容',
      },
      file: {
        field: 'adviceFile',
        label: '建议附件',
      },
      fileName: {
        field: 'adviceFileName',
        label: '建议附件',
        hide: true
      }
    },
  },
};

const props = defineProps({
  type: {
    type: String as PropType<keyof typeof typeMap>,
    default: 'leader'
  },
});

const emit = defineEmits(['cancel']);

const { currentEvent, eventIsFinished } = useCurrentEvent();

const list = ref<IdFiled[]>([]);
const activeId = ref('');
const detailData = ref({} as Record<string, any>);
const editDlgVisible = ref(false);
const editForm = ref({} as Record<string, any>);
const msgDlgVisible = ref(false);
const msgContent = ref('');

const getFieldInfo = (key: string) => {
  return typeMap[props.type].fieldsMap[key];
};
const getApiMethod = (type: string) => {
  return typeMap[props.type].api[type];
};

const getList = async() => {
  const params = {
    currentPage: 1,
    pageSize: MAX_PAGE_SIZE,
    eventId: currentEvent.id,
  };
  const res = await apiCommentAdviceStatisticsObj[getApiMethod('list')](params);
  list.value = res.data.list as IdFiled[];
  if (list.value.length > 0 && !activeId.value) {
    activeId.value = list.value[0].id;
  }
  queryDetail();
};
const changeActiveItem = (id: string) => {
  if (id === activeId.value) {
    return;
  }
  activeId.value = id;
  queryDetail();
};
const queryDetail = async() => {
  if (!activeId.value) {
    detailData.value = {};
    return;
  }
  detailData.value = list.value.find(item => {
    return item.id === activeId.value;
  })!;
};

const handleMsg = () => {
  if (props.type === 'leader') {
    msgContent.value = `【${detailData.value.orgName}】的【${detailData.value.leaderName}】领导批示：【${detailData.value.instructionContent}】，【${detailData.value.instructionTime}】`;
  } else if (props.type === 'department') {
    msgContent.value = `【${detailData.value.orgName}】的【${detailData.value.departmentName}】建议：【${detailData.value.adviceContent}】，【${detailData.value.adviceTime}】`;
  } else if (props.type === 'expert') {
    msgContent.value = `【${detailData.value.orgName}】的【${detailData.value.expertName}】专家建议：【${detailData.value.adviceContent}】，【${detailData.value.adviceTime}】`;
  }
  msgDlgVisible.value = true;
};
const handleEdit = (type: string) => {
  if (type === 'add') {
    editForm.value = {};
  } else {
    const data: Record<string, any> = {
      id: detailData.value.id
    };
    const { fieldsMap } = typeMap[props.type];
    // 转为标准格式数据
    Object.keys(fieldsMap).forEach(standardField => {
      const { field: realField } = fieldsMap[standardField] || {};
      data[standardField] = detailData.value[realField] || '';
    });
    editForm.value = { ...data };
  }
  editDlgVisible.value = true;
};
const handleDel = async(id: string) => {
  await HlMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  await apiCommentAdviceStatisticsObj[getApiMethod('del')](id);
  HlMessage.success('删除成功');
  activeId.value = '';
  getList();
};
const handleSave = async(formData: any) => {
  const params:any = {
    eventId: currentEvent.id,
  };
  const { fieldsMap } = typeMap[props.type];
  Object.keys(formData).forEach(standardField => {
    const { field: realField } = fieldsMap[standardField] || {};
    if (realField) {
      params[realField] = formData[standardField];
    }
  });
  if (editForm.value.id) {
    params.id = editForm.value.id;
    await apiCommentAdviceStatisticsObj[getApiMethod('edit')](params);
    editDlgVisible.value = false;
    editForm.value = {};
    HlMessage.success('编辑成功');
    getList();
    return;
  }
  await apiCommentAdviceStatisticsObj[getApiMethod('add')](params);
  editDlgVisible.value = false;
  HlMessage.success('新建成功');
  getList();
};

const getDlgTitle = () => {
  let prefix = '';
  if (editDlgVisible.value) {
    prefix = `${editForm.value.id ? '编辑' : '新建'}`;
  }
  return `${prefix}${typeMap[props.type].title}`;
};
const handleClose = (done: ()=>void) => {
  if (editDlgVisible.value) {
    editDlgVisible.value = false;
  } else {
    done();
    emit('cancel');
  }
};

getList();
</script>
<style lang="scss" scoped>
.left {
  flex: none !important;
  width: calc(var(--xxs) * 65);
  .head-box {
    height: calc(var(--xxs) * 10.25);
    flex: none !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url('@/assets/images/event-handling/left-2/title-bg.png') no-repeat center;
    background-size: 100%;
    .title {
      position: relative;
      font-size: var(--font-lg);
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #fff;
      line-height: 1.375;
      padding-left: calc(var(--xxs) * 10);
      &:before {
        position: absolute;
        content: '';
        width: calc(var(--xxs) * 4.25);
        height: calc(var(--xxs) * 4.25);
        background: url('@/assets/images/event-handling/left-2/icon1.png') no-repeat center;
        background-size: 100%;
        left: var(--md);
        top: calc(var(--xxs) * 0.5);
      }
    }
  }
  .list-item {
    cursor: pointer;
    height: calc(var(--xxs) * 11);
    background: url('@/assets/images/event-handling/left-2/plan-name-bg.png') no-repeat center;
    background-size: 100%;
    .name {
      font-size: var(--font-lg);
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
    }
    .time {
      font-size: var(--font-md);
    }
    &.is-active {
      font-weight: 600;
      font-size: var(--font-lg);
      background: url('@/assets/images/event-handling/left-2/plan-name-active-bg.png') no-repeat center;
      background-size: 100%;
    }
  }
}
.right {
  background-image: url(@/assets/images/event-handling/left-2/comment-advice-right-bg.png);
  background-size: 100% 100%;
  padding: calc(var(--xxs) * 3.25) calc(var(--xxs) * 4.25) calc(var(--xxs) * 4.25);
  position: relative;
  font-size: var(--font-lg);
  line-height: 1.375;
  .tips {
    color: #B5CEE3;
    font-size: var(--font-lg);
    line-height: 1.375;
  }
  .opt-box {
    position: absolute;
    right: calc(var(--xxs) * 2.25);
    top: calc(var(--xxs) * 3.25);
    img {
      cursor: pointer;
      width: calc(var(--xxs) * 7);
      margin-right: var(--xs);
    }
  }
  .base-info {
    text-align: center;
    padding-top: var(--lg);
    img {
      width: calc(var(--xxs) * 25.25);
      height: calc(var(--xxs) * 25.25);
      margin-bottom: calc(var(--xxs) * 3.5);
    }
    .name {
      font-size: calc(var(--font-lg) * 1.75);
      line-height: 1.4285714285714286;
      margin-bottom: calc(var(--xxs) * 1.5);
    }
  }
  .file-outer-box {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    width: calc(var(--xxs) * 22.5);
    height:  calc(var(--xxs) * 22.5);
    border: 1px solid rgba(0,158,247,0.24);
    border-radius: var(--xxs);
    background-color: rgba(0,158,247,0.12);
  }
}
.empty-box {
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
}
</style>
