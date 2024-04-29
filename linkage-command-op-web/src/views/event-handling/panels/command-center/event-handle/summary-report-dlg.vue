<template>
  <hl-dialog
    :model-value="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="calc(var(--xxs) * 351)"
    height="calc(var(--xxs)*241.5)"
    body-padding="var(--md)"
    title="总结报告"
    append-to-body
    @close="$emit('cancel')"
  >
    <div class="content-wrap">
      <div class="top-wrap">
        <hl-button type="primary" class="hover-style normal-width m-r-xs" @click="save">保存</hl-button>
        <hl-button type="primary" class="hover-style normal-width m-r-xs" @click="download">下载报告</hl-button>
        <hl-button type="primary" class="hover-style normal-width" @click="send">发送通知</hl-button>
      </div>
      <div class="bottom-wrap">
        <div class="left">
          <div class="anchor-list">
            <hl-anchor :change-hash="false" scroll-container="#anchorContent" class="anchor-box">
              <hl-anchor-link
                class="left-link-box"
                v-for="item in summaryList"
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
              <div style="margin-bottom: calc(var(--xxs) * 4)" v-for="(item, index) in summaryList" :key="item.id+index">
                <div class="title-box" :id="item.id">
                  <div class="title">{{ item.sectionContent }}</div>
                </div>
                <div class="text-box indent" :style="[item.id === 'responseAndTask' ? 'padding: 0' : '']">
                  <template v-if="item.id === 'responseAndTask'">
                    <div class="task-list">
                      <hl-input
                        v-model="reportInfo.responseHandle"
                        native-type="textarea"
                        maxlength="2000"
                        :rows="5"
                        show-word-limit
                        block
                      />
                      <div class="title m-t-lg">任务执行情况表</div>
                      <div class="sub-title m-b-sm">{{ reportInfo.taskInfo.summary }}</div>
                      <hl-scrollbar min-height="calc(var(--xxs) * 50)" max-height="calc(var(--xxs) * 100)">
                        <hl-simple-table :cols="cols" stripe :data="reportInfo.taskInfo.tasks" hover class="normal-stripe-table" list gap-y="var(--xxs)" fixed-header :header-cell-style="{background: '#044474'}">
                          <template #tableIndex="{ row }">
                            <span class="table-index">{{ row.rowIndex }}</span>
                          </template>
                          <template #remark="{ row }">
                            <hl-input v-model="row.remark" :maxlength="200" block/>
                          </template>
                          <template #empty>
                            <hb-empty description="暂无数据" :image="NoDataImg" />
                          </template>
                        </hl-simple-table>
                      </hl-scrollbar>
                    </div>
                  </template>
                  <hl-input
                    v-else
                    v-model="reportInfo[item.id]"
                    native-type="textarea"
                    maxlength="2000"
                    :rows="5"
                    show-word-limit
                    block
                  />
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
import { HlMessage } from 'hongluan-ui';
import dayjs from 'dayjs';
import { CommonUtils, Constants, DateUtils } from 'fx-front-utils';
import { useUser } from 'fx-front-ucenter';
import { useCurrentEvent } from '@/hooks';
import { apiEventResponseObj } from '@/apis/modules/event-response';
import NoDataImg from '@/assets/images/event-handling/left-2/empty.png';

const { currentEvent } = useCurrentEvent();
const { getToken } = useUser();

const emit = defineEmits(['cancel', 'send']);

const summaryList = ref([
  {
    id: 'basicInfo',
    sectionContent: '事故基本情况',
  },
  {
    id: 'surroundingResources',
    sectionContent: '事故周边资源',
  },
  {
    id: 'responseAndTask',
    sectionContent: '事故响应和处置',
  },
  {
    id: 'directReason',
    sectionContent: '事故直接原因',
  },
  {
    id: 'indirectReason',
    sectionContent: '事故其他原因',
  },
  {
    id: 'features',
    sectionContent: '事故特点及救援难点',
  },
  {
    id: 'handleAdvice',
    sectionContent: '事故责任分析及处理建议',
  },
  {
    id: 'improveAdvice',
    sectionContent: '事故防范和整改措施建议',
  }
]);
const reportInfo = reactive({
  eventInfoId: currentEvent.id,
  name: currentEvent.name,
  basicInfo: '',
  surroundingResources: '',
  responseHandle: '',
  taskInfo: {
    summary: '',
    tasks: [] as Array<Record<string, any>>
  },
  directReason: '',
  indirectReason: '',
  features: '',
  handleAdvice: '',
  improveAdvice: '',
});
const cols = [
  {
    title: '#',
    prop: '',
    slotName: 'tableIndex',
    width: '3em',
  },
  {
    prop: 'name',
    title: '任务名称',
  },
  {
    prop: 'type',
    title: '任务类型',
  },
  {
    prop: 'executors',
    title: '执行人',
  },
  {
    prop: 'status',
    title: '完成情况',
  },
  {
    prop: 'remark',
    title: '备注',
    slotName: 'remark',
  },
];

const save = async() => {
  const res = await apiEventResponseObj.postModifySummaryReport(reportInfo);
  if (res.code === '0') {
    HlMessage.success('保存成功');
  }
};
const download = () => {
  const fileName = currentEvent.name.split('').map(c => Constants.INVALID_FILE_CHARS.includes(c) ? '_' : c).join('');
  CommonUtils.downloadFile(
    `${fileName}-总结报告（${dayjs().format('YYYYMMDDHHmmss')}）`,
    apiEventResponseObj.getSummaryDownloadUrl(currentEvent.id),
    { 'Authorization': getToken() }
  );
};
const send = () => {
  const title = '总结报告通知';
  const content = `总结报告：【${currentEvent.name}-总结报告（${DateUtils.formatDate()}）】已生成，请下载报告进行查看！`;
  emit('send', { title, content });
};

onMounted(async() => {
  const result = await apiEventResponseObj.postFindSummaryReportById(currentEvent.id);
  Object.assign(reportInfo, result.data);
});
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
        .text-box {
          padding: calc(var(--xxs) * 5) calc(var(--xxs) * 7.5) calc(var(--xxs) * 6);
          overflow: hidden;
          background: rgba(0, 158, 247, 0.10);
          :deep(.hl-input) {
            background: rgba(0,158,247,0.12)!important;
          }
        }
        .task-list {
          border: none;
          box-sizing: border-box;
          padding: calc(var(--xxs) * 5);
          overflow: hidden;
          background: rgba(0, 158, 247, 0.10);
          .title {
            height: calc(var(--xxs) * 5.5);
            font-size: var(--font-lg);
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            line-height: 1;
            padding-bottom: calc(var(--xxs) * 8);
            border-bottom: calc(var(--xxs) * 0.25) dashed #0E3D6C;
            margin-bottom: calc(var(--xxs) * 4);
          }
          :deep(.hl-simple-table) {
            .fixed-top {
              top: calc(var(--xxs) * -0.75);
            }
          }
          :deep(.empty-content) {
            .hb-empty {
              .empty-image {
                width: calc(var(--xxs) * 28);
              }
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
