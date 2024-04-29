<template>
  <!-- <hl-layout :class="[boxed, header, fullHeader, aside, subHeader, fullSubHeader, footer, fullFooter]">
    <layout-header />
    <hl-sub-header v-if="!meta.hiddenSubHeader" class="border-top items-between">
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
    <hl-container style="background: #eaf1f7">
      <layout-menu />
      <hl-main>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </hl-main>
    </hl-container>
  </hl-layout> -->
  <hl-layout>
    <hl-container style="background: #eaf1f7">
      <hl-main>
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </hl-main>
    </hl-container>
  </hl-layout>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs, reactive } from 'vue';
import { template } from 'lodash-es';
import LayoutHeader from './header.vue';
import LayoutMenu from './menu.vue';
import { useRoute, useRouter } from 'vue-router'; // /*RouteRecordRaw*/

export default defineComponent({
  components: {
    LayoutHeader,
    LayoutMenu
  },
  setup() {
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

    const route = useRoute();
    const router = useRouter();
    const meta = computed(() => route.meta);
    const pageTitle = computed(() => template((route?.meta?.title as string) || '')(Object.assign({}, route.params, route.query)));
    const pageSubTitle = computed(() => template((route?.meta?.subTitle as string) || '')(Object.assign({}, route.params, route.query)));

    return {
      meta,
      pageTitle,
      pageSubTitle,
      router,
      ...toRefs(layoutConfig)
    };
  }
});
</script>
