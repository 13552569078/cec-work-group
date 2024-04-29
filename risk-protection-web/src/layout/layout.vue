<template>
  <hl-layout
    :class="!isIframe ? [boxed, header, fullHeader, aside, subHeader, fullSubHeader, footer, fullFooter] : [boxed]"
    :style="{ '--layout-header-height': isIframe ? '0' : '56px', 'height': '100%', '--layout-main-bg-color': '#F3F4FB' }"
    style="transition:none !important">
    <layout-header v-if="!isIframe" />
    <hl-sub-header v-if="!meta.hiddenSubHeader && !isIframe" class="border-top items-between">
      <hl-group dir="horizontal" align="items-middle" indent="var(--xl)">
        <div :class="['page-title', meta.hiddenSubTitle ? 'display-none' : 'page-main']">
          <hl-button class="go-back" equal no-fill v-if="meta.showBack || showBack" @click="router.go(-1)">
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
      <layout-menu v-if="!isIframe" @change="menuChange" @toggle-menu="tryPreloadApp" />
      <hl-main v-if="!isIframe">
        <router-view v-slot="{ Component, route }">
          <component v-if="!route.meta.appName" :is="Component" />
          <hl-group v-else class="w-full h-full wujie-container" align="items-middle items-center">
            <WujieVue
              v-if="route.meta.appName"
              width="100%"
              height="100%"
              :name="route.meta.appName"
              :url="iframeUrl"
              :sync="true"
              alive
              :plugins="plugins"
              :beforeLoad="beforeLoadApp"
              :activated="activatedApp"
            >
            </WujieVue>
          </hl-group>
        </router-view>
      </hl-main>
      <!-- iframe 无间距 -->
      <hl-main style="--layout-out-padding: 0;min-height: auto;" v-else>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </hl-main>
    </hl-container>
  </hl-layout>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, reactive, onMounted, ref, watch } from 'vue';
import { template } from 'lodash-es';
import LayoutHeader from './header.vue';
import LayoutMenu from './menu.vue';
import { useIframe } from 'fx-front-framework';
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from 'vue-router'; // /*RouteRecordRaw*/
import { useIframeUrl } from '@/hooks';
import { User, useUser, UserApi } from 'fx-front-ucenter';
import WujieVue from 'wujie-vue3';
import { GlobalAPI, DETAIL_PAGE_URLS } from '@/common';

const WUJIE_MAX_ALIVE = GlobalAPI.config.WUJIE_MAX_ALIVE || 2;
const WUJIE_PRELOAD_ENABLED = GlobalAPI.config.WUJIE_PRELOAD_ENABLED;

export default defineComponent({
  components: {
    LayoutHeader,
    LayoutMenu
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { isIframe } = useIframe();
    const { getToken } = useUser();
    const { setIframeUrl: resetIframeUrl } = useIframeUrl();
    const { preloadApp, destroyApp } = WujieVue;
    const token = getToken();

    const layoutConfig = reactive({
      boxed: ['boxed1'],
      header: ['fixed-header'],
      fullHeader: ['full-header'],
      aside: ['fixed-aside'],
      subHeader: ['fixed-sub-header'],
      fullSubHeader: ['full-sub-header1'],
      footer: ['fixed-footer1'],
      fullFooter: ['full-footer1']
    });

    const iframeUrl = ref('');
    const currentUrl = ref('');
    const existedApps: string[] = [];
    let preloadAppName = '';
    let lastAppName = '';
    const base = process.env.NODE_ENV === 'production' ? document.location.origin : ''; // 'https://www.jczhtest.etcc.group';
    const plugins = [
      {
        cssAfterLoaders: [
          { content: 'body {position: relative !important;}' },
        ],
      },
    ];

    const meta = computed(() => route.meta);
    const pageTitle = computed(() => template((route?.meta?.title as string) || '')(Object.assign({}, route.params, route.query)));
    const pageSubTitle = computed(() => template((route?.meta?.subTitle as string) || '')(Object.assign({}, route.params, route.query)));

    const showBack = computed(() => DETAIL_PAGE_URLS.some(u => currentUrl.value.indexOf(u) > -1));

    const setIframeUrl = (t: any) => {
      iframeUrl.value = base + route.meta.iframeUrl;
      if (iframeUrl.value.indexOf('?') > -1) {
        iframeUrl.value += `&token=${getToken()}`;
      } else {
        iframeUrl.value += `?token=${getToken()}`;
      }
      if (!route.meta.appName) return;
      console.error('-----', t, route.meta.appName, lastAppName, existedApps, route.meta.iframeUrl);

      // 如果是同一个app内不同页面需要手工路由
      // 如果是打开保活的app，第一次也需要手工路由
      // 如果预加载app和正要加载app一样，需要手工路由
      if (route.meta.appName === lastAppName ||
        (route.meta.appName !== lastAppName && existedApps.includes(String(route.meta.appName))) ||
        preloadAppName === route.meta.appName
      ) {
        console.error('emit==>redirect-router', route);
        WujieVue.bus.$emit('redirect-router', route.meta.routeParams);
      }

      lastAppName = `${route.meta.appName}`;
      if (!existedApps.includes(lastAppName)) {
        if (existedApps.length >= WUJIE_MAX_ALIVE) {
          destroyApp(existedApps.pop()!);
        }
        existedApps.unshift(lastAppName);
      } else {
        existedApps.splice(existedApps.indexOf(lastAppName), 1);
        existedApps.unshift(lastAppName);
      }

      preloadAppName = '';
    };

    const menuChange = () => {
      console.log('menuChange', route);
      // setIframeUrl(1);
    };

    const beforeLoadApp = () => {
      currentUrl.value = window.decodeURIComponent(document.location.href);
    };
    const activatedApp = () => {
      currentUrl.value = window.decodeURIComponent(document.location.href);
    };

    const tryPreloadApp = (menu: RouteLocationNormalizedLoaded) => {
      if (WUJIE_PRELOAD_ENABLED !== 'true' || preloadAppName === menu.name) return;

      if (preloadAppName) {
        destroyApp(preloadAppName);
      }
      preloadAppName = menu.name as string;
      preloadApp({
        name: preloadAppName,
        url: base + resetIframeUrl(menu.path + '/mocked-empty-page') + '?token=' + getToken(),
        alive: true,
        plugins,
        beforeLoad: beforeLoadApp,
        activated: activatedApp
      });
    };

    const goBack = () => {
      currentUrl.value = '';
      history.back();
    };

    watch(route, (val:{[key:string]:any} ) => {
      if (['RiskOnePictureIndex', 'NaturalDisastersOnePictureIndex'].includes(val.name)) {
        iframeUrl.value = '';
        window.open(`${base}${route.meta.iframeUrl}?token=${token}`, val.name);
        router.go(-1);
      } else {
        setIframeUrl(2);
      }
    }, { immediate: true });

    window.addEventListener('message', (msg: any) => {
      const { method } = msg.data;
      if (method === 'logout') {
        const loginUrl = encodeURIComponent(`${window.location.origin}/${GlobalAPI.config.PROD_PREFIX}`);
        const url = UserApi.getUserCenterUrl(loginUrl);
        window.setTimeout(() => {
          // 退出到总集登录页
          window.location.href = url;
        }, 10);
      } else if (method === 'routerChanged') {
        console.error('message--routerChanged', msg.data);
        currentUrl.value = window.decodeURIComponent(document.location.href);
      }
    });


    return {
      meta,
      pageTitle,
      pageSubTitle,
      router,
      isIframe,
      iframeUrl,
      plugins,
      showBack,
      goBack,
      beforeLoadApp,
      activatedApp,
      menuChange,
      tryPreloadApp,
      ...toRefs(layoutConfig)
    };
  }
});
</script>
<style lang="scss" scoped>
#pageAction {
  :deep(.hl-button) {
    width: 80px;
  }
}
</style>
