<template>
  <hl-row layout="grid" class="p-lg" count="count-5" gap-x="var(--xxl)" gap-y="var(--lg)">
    <hl-col span="col">
      <hl-group dir="vertical" class="info-description auto-height">
        <span class="text-secondary group-item">事件标题</span>
        <span class="font-bold group-item">{{ formData.eventTitle ? formData.eventTitle : '-' }}</span>
      </hl-group>
    </hl-col>
    <hl-col span="col">
      <hl-group dir="vertical" class="info-description auto-height">
        <span class="text-secondary group-item">{{ systemName }}类型</span>
        <span class="font-bold group-item">{{ formData.eventTypeName ? formData.eventTypeName : '-' }}</span>
      </hl-group>
    </hl-col>
    <hl-col span="col">
      <hl-group dir="vertical" class="info-description auto-height">
        <span class="text-secondary group-item">监测主体</span>
        <span class="font-bold group-item">{{ formData.regionName ? formData.regionName : '-' }}</span>
      </hl-group>
    </hl-col>
    <hl-col span="col">
      <hl-group dir="vertical" align="items-top" class="info-description auto-height">
        <span class="text-secondary group-item">{{ systemName }}等级</span>
        <hl-tag :type="EVENT_LEVELCODE_TRANS.get(formData.eventLevelCode)" size="sm">{{ formData.eventLevelName ? formData.eventLevelName : '-' }}</hl-tag>
      </hl-group>
    </hl-col>
    <hl-col span="col col-span-1">
      <hl-group dir="vertical" class="info-description auto-height">
        <span class="text-secondary group-item">{{ systemName }}时间</span>
        <span class="font-bold group-item">{{ formData.startTime ? formData.startTime : '-' }}</span>
      </hl-group>
    </hl-col>

    <hl-col span="col col-span-2">
      <hl-group dir="vertical" class="info-description auto-height">
        <span class="text-secondary group-item">行政区划</span>
        <span class="font-bold group-item">{{ formData.streetAreaName ? formData.streetAreaName : '-' }}</span>
      </hl-group>
    </hl-col>

    <hl-col span="col col-span-3">
      <hl-group dir="vertical" class="info-description auto-height">
        <span class="text-secondary group-item">事件描述</span>
        <span class="font-bold group-item">{{ formData.eventDesc ? formData.eventDesc : '-' }}</span>
      </hl-group>
    </hl-col>

    <hl-col span="col col-span-3">
      <hl-group dir="vertical" class="w-full info-description auto-height">
        <span class="text-secondary group-item">现场照片 / 视频</span>
        <hl-scrollbar class="w-full" style="--scrollbar-offset: var(--xs)">
          <hl-group gap="var(--md)">
            <hl-thumb
              v-for="item in picData"
              :key="item"
              style="width: calc(var(--xs) * 25); height: calc(var(--xs) * 19)"
              :src="item.thumb"
              fit="cover"
              :preview-src-list="
                picData.map(item => {
                  return item.thumb;
                })
              "
              :append-to-body="true"
            />
          </hl-group>
        </hl-scrollbar>
      </hl-group>
    </hl-col>
  </hl-row>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { apiMonitorCenterObj } from '@/apis/modules/monitorCenter';
import { EVENT_LEVELCODE_TRANS } from '@/common/constant';

export default defineComponent({
  components: {},
  props: {
    eventId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const systemName = ref(inject('systemName'));
    const goJudgeCenter = () => {
      router.go(-1);
    };

    const picData = ref([
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site1.png')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site2.png')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site3.jpg')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site4.jpg')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site5.jpg')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site6.jpg')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site7.jpg')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site8.jpg')
      },
      {
        title: '',
        thumb: require('@/assets/images/SitePhotos/site9.jpg')
      }
    ]);
    const srcList = ref(['/images/SitePhotos/site9.jpg', 'https://i0.hippopx.com/photos/738/1016/11/children-fishing-the-activity-asia-thumb.jpg', 'https://i0.hippopx.com/photos/264/421/89/child-children-girl-happy-thumb.jpg']);

    const formData = ref({
      eventId: '',
      eventTitle: '',
      regionName: '',
      eventTypeCode: '',
      eventTypeName: '',
      eventLevelCode: '',
      eventLevelName: '',
      streetAreaCode: '',
      streetAreaName: '',
      pointAddress: '',
      startTime: '',
      eventDesc: '',
      videoUrl: ''
    });
    const initData = async() => {
      const result = await apiMonitorCenterObj.getFindMonitorEventDetail(props.eventId as string);
      console.log(result);
      formData.value = result.data;
      // formData.value.eventLevelCode = EVENT_LEVELCODE_TRANS.get(route.query.eventLevelCode as string) as string;
    };

    initData();

    return {
      picData,
      srcList,
      goJudgeCenter,
      formData,
      EVENT_LEVELCODE_TRANS,
      systemName
    };
  }
});
</script>
