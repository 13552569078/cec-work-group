<template>
  <hl-dialog
    :model-value="true"
    :modal="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 351)"
    height="calc(var(--xxs)*241.5)"
    body-padding="var(--md)"
    title="事件处置方案"
    append-to-body
    @close="$emit('cancel')"
  >
    <div class="content-wrap">
      <div class="top-wrap">
        <hl-button type="primary" class="hover-style normal-width" :loading="loading" @click="createAssistPlan">发布</hl-button>
      </div>
      <div class="bottom-wrap">
        <div class="left">
          <div class="anchor-list">
            <hl-anchor :change-hash="false" scroll-container="#anchorContent" class="anchor-box">
              <hl-anchor-link
                class="left-link-box"
                v-for="item in planComponentList"
                :href="`#${item.id}`"
                :key="item.id"
              >{{ item.sectionContent }}
              </hl-anchor-link>
            </hl-anchor>
          </div>
        </div>
        <div class="right">
          <hl-scrollbar class="content-list">
            <div class="h-full row-overflow-auto" id="anchorContent">
              <div style="margin-bottom: calc(var(--xxs) * 4)" v-for="(item, index) in planComponentList" :key="item.id+index">
                <div class="title-box" :id="item.id">
                  <div class="title">{{ item.sectionContent }}</div>
                </div>
                <div class="text-box indent" v-show="item.showFlag">
                  <component :is="item.component" :defaultParams="item.defaultParams" @updateInfo="updatePlanInfo"></component>
                </div>
              </div>
            </div>
          </hl-scrollbar>
        </div>
      </div>
    </div>
  </hl-dialog>

</template>
<script setup lang="ts">
import { ref, reactive, onMounted, markRaw } from 'vue';
import { Plan1, Plan2, Plan3, Plan4, Plan5, Plan6, Plan7 } from './plan-sub';
import { useCurrentEvent } from '@/hooks';
import { useAssistPlan } from './use-assist-plan';
import { apiDisposeSuggestObj } from '@/apis/modules/dispose-suggest';
import { IpostAddEventPolicyDecisionSpace } from '@/apis/modules/dispose-suggest/model';
import { HlMessage } from 'hongluan-ui';
const { isChemicalEvent, currentEvent } = useCurrentEvent();

const emit = defineEmits(['cancel', 'ok']);

const { updateAssistPlanListDateStamp, getResourceType } = useAssistPlan();
const planComponentList = ref([
  {
    id: 'planSection1',
    sectionContent: '事故基本情况',
    component: markRaw(Plan1),
    showFlag: true,
    defaultParams: {}
  },
  {
    id: 'planSection2',
    sectionContent: '危化品处置措施',
    component: markRaw(Plan2),
    showFlag: true,
    defaultParams: {}
  },
  {
    id: 'planSection3',
    sectionContent: '事故影响分析',
    component: markRaw(Plan3),
    showFlag: true,
    defaultParams: {}
  },
  {
    id: 'planSection4',
    sectionContent: '周边资源情况',
    component: markRaw(Plan4),
    showFlag: true,
    defaultParams: {}
  },
  {
    id: 'planSection5',
    sectionContent: '事故周边影像图',
    component: markRaw(Plan5),
    showFlag: true,
    defaultParams: {}
  },
  {
    id: 'planSection6',
    sectionContent: '专家建议',
    component: markRaw(Plan6),
    showFlag: true,
    defaultParams: {}
  },
  {
    id: 'planSection7',
    sectionContent: '部门建议',
    component: markRaw(Plan7),
    showFlag: true,
    defaultParams: {}
  }
]);
const planAllInfo = reactive({
  eventInfoId: currentEvent.id,
  desc: '',
  msdsParams: [],
  risk: [],
  protect: [],
  resource: [],
  image: '',
  expertAdvise: [],
  orgAdvise: [],
}) as IpostAddEventPolicyDecisionSpace.RequestParams;
const loading = ref(false);

const updatePlanInfo = (res: {key: keyof typeof planAllInfo, value: any}) => {
  planAllInfo[res.key] = res.value;
  console.log(planAllInfo, 202);
};

const createAssistPlan = async() => {
  if (!planAllInfo.desc) {
    HlMessage.warning('请填写事故描述');
    return;
  }
  try {
    loading.value = true;
    await apiDisposeSuggestObj.postAddEventPolicyDecision(planAllInfo);
    HlMessage.success('发布成功');
  } catch {
    HlMessage.error('发布失败');
  } finally {
    loading.value = false;
    updateAssistPlanListDateStamp.value = Date.now();
    emit('ok');
  }
};

const initComponentList = () => {
  if (!isChemicalEvent.value) {
    planComponentList.value = planComponentList.value.filter(v => v.id !== 'planSection2');
  }
};

onMounted(() => {
  initComponentList();
});

getResourceType();
</script>
<style lang="scss" scoped>
.content-wrap {
  display: flex;
  flex-direction: column;
  height: calc(var(--xxs) * 220);
  overflow: hidden;
  padding: calc(var(--xxs) * 5) calc(var(--xxs) * 2);
  box-sizing: border-box;
  .top-wrap {
    text-align: right;
    padding-bottom: calc(var(--xxs) * 5);
  }
  .bottom-wrap {
    display: flex;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    .left {
      width: 25%;
      margin: 0;
      height: 100%;
      overflow: hidden;
      .anchor-list {
        height: 100%;
        overflow-y: auto;
        .anchor-box {
          :deep(.anchor-list::before) {
            width: 0;
          }
          :deep(.slider-bar) {
            width: 0;
          }
        }
        .left-link-box {
          height: calc(var(--xxs) * 11);
          word-break: break-all;
          background: url('@/assets/images/event-handling/left-2/plan-name-bg.png') no-repeat center;
          background-size: 100%;
          cursor: pointer;
          font-weight: var(--font-weight-bold);
          color: #FFFFFF;
          margin-bottom: calc(var(--xxs) * 1.5);
          padding: 0;
          :deep(a) {
            color: #ffffff;
            height: 100%;
            font-size: var(--font-lg);
            padding: calc(var(--xxs) * 2.5) 0 calc(var(--xxs) * 2.5) calc(var(--xxs) * 4);
          }
        }
        .is-active {
          font-weight: 600;
          font-size: var(--font-lg);
          background: url('@/assets/images/event-handling/left-2/plan-name-active-bg.png') no-repeat center;
          background-size: 100%;
        }
      }
    }
    .right {
      width: 75%;
      height: 100%;
      overflow: hidden;
      margin-left: calc(var(--xxs) * 5);
      .content-list {
        height: 100%;
        overflow-y: auto;
        .title-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: calc(var(--xxs) * 10.5);
          background: url('@/assets/images/event-handling/left-2/title-bg2.png') no-repeat center;
          background-size: 100%;
          margin-bottom: calc(var(--xxs) * -0.5);
          .title {
            position: relative;
            font-size: var(--font-lg);
            font-weight: var(--font-weight-bold);
            color: #fff;
            line-height: 1.375;
            padding-left: calc(var(--xxs) * 11);
            &:before {
              position: absolute;
              content: '';
              width: calc(var(--xxs) * 4.5);
              height: calc(var(--xxs) * 4.5);
              background: url('@/assets/images/event-handling/left-2/icon1.png') no-repeat center;
              background-size: 100%;
              left: calc(var(--xxs) * 4);
              top: calc(var(--xxs) * 0.5);
            }
          }
        }
        :deep(.hl-input) {
          background-color: rgba(6, 44, 79, 1);
          ::placeholder {
            font-family: PingFangSC-Regular;
            letter-spacing: 0;
            color: #6F8EA8;
          }
        }
      }
    }
  }
}
</style>
