<template>
  <div class="assemble-instruct-wrap">
    <div class="list">
      <div class="list-item" v-for="(item, index) in assemblePointList" :key="item.id">
        <div class="title-and-button">
          <hl-icon size="xxxs" class="m-r-xs cursor-pointer" @click="clickExpandBtn(item, index)">
            <fill-start :style="`transform: rotateZ(${item.expand ? 90: 0}deg)`"/>
          </hl-icon>
          <div class="title font-16 text-ellipsis" @mouseover="showTooltip">
            {{ item.assembleTitle }}：{{ item.assembleAddress }}
          </div>
        </div>
        <div v-if="item.expand" class="content">
          <template v-if="item?.instructList.length">
            <div v-for="instruct in item?.instructList" :key="instruct" class="item-box">
            <div class="createTime-and-status">
              <div class="create-time">发布时间：{{ instruct.pubdate }}</div>
              <div class="status">
                <span v-if="instruct.status === 1" class="revoked">已撤销</span>
                <hl-button v-else size="md" type="primary" @click="handleRevokeInstruct(instruct.id)">撤销指令</hl-button>
              </div>
            </div>
            <div class="item">
              <span class="label">发布人</span>
              <span class="value">{{ instruct.createdUserName }}</span>
            </div>
            <div class="item">
              <span class="label">时限要求</span>
              <span class="value">{{ instruct.assembleTimeLimit }}</span>
            </div>
            <div class="item">
              <span class="label">集结要求</span>
              <span class="value">{{ instruct.assembleRequire }}</span>
            </div>
            <div class="item">
              <span class="label">集结人员</span>
              <span v-if="instruct.status === 1" class="value">{{ instruct.userNameStr }}</span>
              <div v-else class="user-box">
                <div class="assembled">
                  <div class="status-label">已集结({{ instruct.assembled.length || 0 }}人)</div>
                  <span v-for="user in instruct.assembled" :key="user" class="user-name-tag">{{ user.userName }}</span>
                </div>
                <div class="wait-assemble">
                  <div class="status-label">待集结({{ instruct.waitAssemble.length || 0 }}人)</div>
                  <span v-for="user in instruct.waitAssemble" :key="user" class="user-name-tag">{{ user.userName }}</span>
                </div>
                <div class="unEffective">
                  <div class="status-label">无需集结({{ instruct.unEffective.length || 0 }}人)</div>
                  <span v-for="user in instruct.unEffective" :key="user" class="user-name-tag">{{ user.userName }}</span>
                </div>
              </div>
            </div>
          </div>
          </template>
          <hb-empty v-else description="暂无集结指令" :image="NoDataImg" style="padding: 0" />
        </div>
      </div>
      <hb-empty v-if="!assemblePointList.length" description="暂无集结指令" :image="NoDataImg" style="padding: 0" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { HlMessage, HlMessageBox } from 'hongluan-ui';
import { useCurrentEvent, useMapLayer, useTextOverflow } from '@/hooks';
import { MAX_PAGE_SIZE } from '@/common';
import { apiSitePersonnelObj } from '@/apis/modules/site-personnel';
import { IpostFindCommandCenterAssemblePointListSpace, IpostFindCommandCenterAssemblePageSpace } from '@/apis/modules/site-personnel/model';
import NoDataImg from '@/assets/images/empty/no-data.png';
import { IpostFindEventDetailByIdSpace } from '@/apis/modules/event-condition/model';

const emit = defineEmits(['update']);

const { waitingRefreshLayerMarkers } = useMapLayer();
const { showTooltip } = useTextOverflow();

const assemblePointList = ref<Array<IpostFindCommandCenterAssemblePointListSpace.Data & { instructList: any }>>([]);
const activeIndex = ref(0);

const handleRevokeInstruct = async(id: string) => {
  if (eventIsFinished.value) return;
  await HlMessageBox.confirm('您确认撤销指令吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  });
  try {
    const res = await apiSitePersonnelObj.postCancelCommandCenterAssemble(id);
    if (res.data === true) {
      HlMessage.success('撤销成功');
      await getAssembleInstructList();
      emit('update');
    } else {
      HlMessage.error('撤销失败');
    }
  } catch {
    HlMessage.error('撤销失败');
  }
};

const clickExpandBtn = async(item: IpostFindCommandCenterAssemblePointListSpace.Data, index: number) => {
  assemblePointList.value[index].expand = !assemblePointList.value[index].expand;
  activeIndex.value = index;
  if (assemblePointList.value[index].expand) {
    await getAssembleInstructList();
  }
};

const getAssemblePointList = async(event: IpostFindEventDetailByIdSpace.Data) => {
  apiSitePersonnelObj.postFindCommandCenterAssemblePointList(event.id as string).then(res => {
    assemblePointList.value = res.data.map((item, index) => {
      const resItem = {
        ...item,
        assembleUserCount: item.assembleUserCount || 0,
        userCount: item.userCount || 0,
        instructList: []
      };
      if (index === 0) resItem.expand = true;
      return resItem;
    });
    if (assemblePointList.value.length) {
      activeIndex.value = activeIndex.value || 0;
      getAssembleInstructList();
    }
  });
};

const getAssembleInstructList = async() => {
  // assembleStatus, 1-不出现场, 0-待集结, 4-已集结
  // status, 0-已发布, 1-已撤销
  if (!assemblePointList.value.length) return;
  const params = {
    'currentPage': -1,
    'pageSize': MAX_PAGE_SIZE,
    'eventInfoId': currentEvent.id,
    'assemblePointId': assemblePointList.value[activeIndex.value].id,
    'timeLimitSort': true
  };

  apiSitePersonnelObj.postFindCommandCenterAssemblePage(params).then(res => {
    const instructList = res.data?.list.map(item => {
      const assembled: IpostFindCommandCenterAssemblePageSpace.OrgPsersonParam[] = [];
      const waitAssemble: IpostFindCommandCenterAssemblePageSpace.OrgPsersonParam[] = [];
      const unEffective: IpostFindCommandCenterAssemblePageSpace.OrgPsersonParam[] = [];
      let userNameStr = '';
      let effective = 0;
      item.orgPsersonParams.forEach(el => {
        if (el.effective) {
          effective++;
          if (el.assembleStatus === 4) {
            assembled.push(el);
          } else if (el.assembleStatus === 0) {
            waitAssemble.push(el);
          }
        } else {
          unEffective.push(el);
        }
      });
      userNameStr = item.orgPsersonParams.map(el => el.userName).join('、');
      return {
        ...item,
        waitAssemble,
        assembled,
        unEffective,
        userNameStr,
        effective
      };
    });
    assemblePointList.value[activeIndex.value].instructList = instructList;
  });
};

watch(waitingRefreshLayerMarkers, val => { // 地图更新，删除集结点
  if (val.includes('EventAssemblePoints')) {
    getAssemblePointList(currentEvent);
  }
});

const { currentEvent, eventIsFinished } = useCurrentEvent(getAssemblePointList);
</script>
<style lang="scss" scoped>
.assemble-instruct-wrap {
  .list {
    .list-item {
      background: rgba(0,158,247,0.12);
      margin-bottom: calc(var(--xxs) * 2);
      .title-and-button {
        display: flex;
        align-items: center;
        height: calc(var(--xxs) * 10);
        background: url("@/assets/images/event-handling/right-2/site-personnel/list-item-title-bg.png") no-repeat center;
        background-size: 100%;
        padding: calc(var(--xxs) * 2) calc(var(--xxs) * 4);
        .title {
          font-weight: 600;
          color: #FFFFFF;
          width: 80%;
        }
        .button {
          flex-shrink: 0;
          font-size: var(--font-md);
          font-weight: 400;
          color: #71F8FC;
          line-height: 1.85;
          cursor: pointer;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        padding: calc(var(--xxs) * 4);
        .item-box {
          &:not(:last-child) {
            margin-bottom: calc(var(--xxs) * 2);
          }
          .createTime-and-status {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: calc(var(--xxs) * 2) 0 calc(var(--xxs) * 2) calc(var(--xxs) * 2);
            margin-bottom: calc(var(--xxs) * 4);
            background: url("@/assets/images/event-handling/right-2/site-personnel/assemble-instruct-time-bg.png") no-repeat center;
            background-size: 100%;
            height: calc(var(--xxs) * 10);
            &:before {
              position: absolute;
              content: '';
              width: calc(var(--xxs) * 6);
              height: calc(var(--xxs) * 6);
              left: calc(var(--xxs) * 2);
              background: url("@/assets/images/event-handling/right-2/site-personnel/summary-icon.png") no-repeat center;
              background-size: 100%;
            }
            .create-time {
              margin-left: calc(var(--xxs) * 8);
              font-size: var(--font-lg);
              font-weight: 600;
              color: #FFFFFF;
            }
            .status {
              .revoked {
                padding: calc(var(--xxs) * 1.5) calc(var(--xxs) * 3);
                background: rgba(0,158,247,0.08);
                border-radius: var(--xxs);
                border: calc(var(--xxs) * 0.25) solid #014371;
                font-size: var(--font-md);
                font-weight: 400;
                color: #6F8EA8;
              }
            }
          }
          .item {
            display: flex;
            align-items: flex-start;
            &:not(:last-child) {
              margin-bottom: calc(var(--xxs) * 2);
            }
            .label {
              width: calc(var(--xxs) * 16);
              font-size: var(--font-lg);
              font-weight: 400;
              color: #B5CEE3;
              flex-shrink: 0;
            }
            .value {
              margin-left: calc(var(--xxs) * 4);
              font-size: var(--font-lg);
              font-weight: 400;
              color: #FFFFFF;
              word-break: break-all;
            }
            .user-box {
              margin-left: calc(var(--xxs) * 4);
              div {
                margin-bottom: calc(var(--xxs) * 2);
                .status-label {
                  font-size: var(--font-lg);
                  font-weight: 400;
                  color: #FFFFFF;
                  margin-bottom: 0;
                }
                .user-name-tag {
                  display: inline-block;
                  font-size: var(--font-md);
                  font-weight: 400;
                  padding: var(--xxs) calc(var(--xxs) * 2);
                  border: calc(var(--xxs) * 0.25) dashed rgba(0, 158, 247, 0.12);
                  background-color: rgba(0, 158, 247, 0.12);
                  margin-top: calc(var(--xxs) * 2);
                  margin-right: calc(var(--xxs) * 2);
                  word-break: break-all;
                }
              }
              div.wait-assemble {
                .user-name-tag {
                  border: calc(var(--xxs) * 0.25) dashed rgba(255, 234, 68, 0.16);
                  background-color: rgba(255, 234, 68, 0.16);
                  color: #FFEA44;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
