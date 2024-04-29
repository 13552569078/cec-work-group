<template>
  <hl-layout :class="[boxed, header, fullHeader, aside, subHeader, fullSubHeader, fullFooter]"
    :style="{ '--layout-header-height': isIframe ? '0' : '72px', 'height': '100%' }" style="transition:none !important">
    <div style="height: 100%; overflow-y: auto;">
    <layout-header v-if="!isIframe" />
    <hl-sub-header v-if="!meta.hiddenSubHeader" class="border-top items-between" style="top:0 !important;">
      <hl-group dir="horizontal" align="items-middle" indent="var(--xl)">
        <div :class="['page-title', meta.hiddenSubTitle ? 'display-none' : 'page-main']">
          <hl-button class="go-back" equal no-fill v-if="meta.showBack" @click="router.go(-1)">
            <template #icon>
              <hl-icon><fill-circle-left /></hl-icon>
            </template>
          </hl-button>
          <h5>{{ pageTitle }}</h5>
          <h6 class="text-secondary m-l-sm">{{ pageSubTitle }}</h6>
        </div>
        <div class="sub-header-left" id="pageBreadcrumb"></div>
      </hl-group>
      <div class="sub-header-right" id="pageAction"></div>
    </hl-sub-header>
    <hl-container style="background: #eaf1f7" :class="isIframe ? 'iframe-container' : null">
      <layout-menu />
      <hl-main>
        <router-view v-slot="{ Component, route }">
          <component v-if="route.name === 'HomePageIndex'" :is="Component" />
          <hl-group v-else class="w-full h-full" align="items-middle items-center">
            <!-- <hl-spinner v-if="isLoading" class="xxxl" color="#36A4FF" /> -->
            <!-- <iframe v-else ref="iframeRef" :src="iframeUrl" class="w-full h-full"></iframe> -->
            <WujieVue v-if="route.meta.appName" width="100%" height="100%" :name="route.meta.appName"
              :url="(base + route.meta.iframeUrl + '&token=' + getToken())" :sync="true" :plugins="plugins">
            </WujieVue>
          </hl-group>
        </router-view>
      </hl-main>
    </hl-container>
    </div>
  </hl-layout>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, reactive, ref, watch } from 'vue';
import { template } from 'lodash-es';
import LayoutHeader from './header.vue';
import LayoutMenu from './menu.vue';
import { useIframe } from '@/hooks';

import { User, useUser } from 'fx-front-ucenter';
import { useRoute, useRouter } from 'vue-router'; // /*RouteRecordRaw*/
import WujieVue from 'wujie-vue3';

export default defineComponent({
  components: {
    LayoutHeader,
    LayoutMenu,
  },
  setup() {
    const { isIframe } = useIframe();
    const { getToken } = useUser();
    const { preloadApp } = WujieVue;

    const token = getToken();
    const layoutConfig = reactive({
      boxed: ['boxed1'],
      header: ['fixed-header'],
      fullHeader: ['full-header'],
      aside: ['fixed-aside'],
      subHeader: ['fixed-sub-header'],
      fullSubHeader: ['full-sub-header1'],
      footer: ['fixed-footer1'],
      fullFooter: ['full-footer1'],
    });
    const iframeRef = ref();
    const iframeUrl = ref('');
    const isLoading = ref(true);
    const base = document.location.origin; // 'https://www.jczhtest.etcc.group';

    const route = useRoute();
    const router = useRouter();
    const meta = computed(() => route.meta);
    const pageTitle = computed(() =>
      template((route?.meta?.title as string) || '')(Object.assign({}, route.params, route.query))
    );
    const pageSubTitle = computed(() =>
      template((route?.meta?.subTitle as string) || '')(
        Object.assign({}, route.params, route.query)
      )
    );
    const plugins = [
      {
        cssAfterLoaders: [
          { content: 'body {position: relative !important;}' },
        ],
      },
    ];

    watch(route, val => {
      isLoading.value = true;
      if (val.name === 'OnePictureIndex' || val.name === 'PlottingIndex') {
        iframeUrl.value = '';
        window.open(`${base}${route.meta.iframeUrl}?token=${token}`, val.name);
        router.push('/home-page/index');
      } else {
        iframeUrl.value = route.meta.iframeUrl ? `${base}${route.meta.iframeUrl}&token=${token}` : '';
      }

      setTimeout(() => {
        isLoading.value = !iframeUrl.value.length;
      }, 100);
    }, { immediate: true });
    return {
      iframeRef,
      meta,
      pageTitle,
      pageSubTitle,
      router,
      isIframe,
      iframeUrl,
      isLoading,
      base,
      plugins,
      getToken,
      ...toRefs(layoutConfig),
    };
  },
});
</script>
<style lang="scss" scoped>
.iframe-container {
  // min-height: 100vh !important;
  min-height: calc(100vh - var(--layout-sub-header-height) - var(--xs));
}

#pageAction {
  :deep(.hl-button) {
    width: 80px;
  }
}
</style>
