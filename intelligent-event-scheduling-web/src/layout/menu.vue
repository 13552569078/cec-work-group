<template>
  <hl-aside :class="collapse">
    <hl-group block dir="vertical" class="h-full">
      <div class="aside-logo">
        <!-- <img :src="logoUrl" alt="hongluan.ui" /> -->
        <h1>智能事件调度平台</h1>
        <!-- <span class="sub-title">{{ version }}</span> -->
      </div>
      <hl-group
        @click="goHome"
        class="index-button p-l-xxl p-r-md cursor-pointer"
        align="items-middle items-between"
        gap="var(--sm)"
      >
        <hl-icon v-show="isCollapse" size="md" class="text-link">
          <svg viewBox="0 0 20 20">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <path
                d="M19.3333333,0.66653161 L19.3333333,15.3240894 L0.66666666,15.3240894 L0.66666666,0.66653161 L19.3333333,0.66653161 Z M13.75,7.5 L6.25,7.5 L6.25,9.5 L13.75,9.5 L13.75,7.5 Z"
                fill="#36A4FF"
                fill-rule="nonzero"
              />
              <path
                d="M0.66666666,15.3240894 L0.66666666,0.66653161 L19.3333333,0.66653161 L19.3333333,15.3240894 L0.66666666,15.3240894 Z M2.66666666,2.66653161 L2.66666666,13.3240894 L17.3333333,13.3240894 L17.3333333,2.66653161 L2.66666666,2.66653161 Z"
                fill="#D5E2FB"
                fill-rule="nonzero"
              />
              <polygon
                fill="#D5E2FB"
                fill-rule="nonzero"
                points="2.66666666 17.3240894 2.66666666 19.3240894 17.3333333 19.3240894 17.3333333 17.3240894"
              />
            </g>
          </svg>
        </hl-icon>
        <span class="font-bold font-xl text-regular w-full">智能事件调度平台</span>
        <hl-icon
          size="xs"
          class="cursor-pointer text-link static"
          @click="isCollapse = !isCollapse"
          style="color: var(--menu-icon-color)"
        >
          <fill-signin v-show="isCollapse" />
          <fill-signout v-show="!isCollapse" />
        </hl-icon>
      </hl-group>
      <div class="scrollable no-thumb">
        <hl-menu
          :default-active="defaultActive"
          :router="true"
          :unique-opened="true"
          :collapse="isCollapse"
        >
          <template v-for="menu in onlyOneChildren" :key="menu.path">
            <hl-menu-item :index="secondMenuIndex(menu)">
              <hl-icon class="item-icon">
                <component :is="menu.meta.icon"></component>
              </hl-icon>
              <template #title>{{ menu.meta.title }}</template>
            </hl-menu-item>
          </template>
          <hl-menu-item-group class="second-menu-item">
            <template #title>业务系统</template>
            <template v-for="menu in moreChildren" :key="menu.path">
              <hl-sub-menu
                :index="secondMenuIndex(menu)"
                :popper-append-to-body="true"
                :fallback-placements="['right-start']"
              >
                <template #title>
                  <hl-group gap="var(--sm)" align="items-middle">
                    <hl-icon class="second-item-icon">
                      <component :is="menu.meta.icon"></component>
                    </hl-icon>
                    <span>{{ menu.meta.title }}</span>
                  </hl-group>
                </template>
                <hl-menu-item
                  v-for="sonMenu in menu.children"
                  :index="menu.path + '/' + sonMenu.path"
                  :key="sonMenu.name"
                >
                  {{ sonMenu?.meta?.title }}
                </hl-menu-item>
              </hl-sub-menu>
            </template>
          </hl-menu-item-group>
        </hl-menu>
      </div>
    </hl-group>
  </hl-aside>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch, getCurrentInstance, computed } from 'vue';
import { RouteRecordNormalized, RouteRecordRaw, useRoute, useRouter } from 'vue-router';
import InlineSvg from 'vue-inline-svg';
import {
  FillSet,
  FillChartDoughnut,
  FillAirplay,
  FillSliders,
  FillWarning,
  FillServer,
  FillAlert,
  FillArrowLineCurve,
  FillShapeAnnular,
  FillNews,
  FillReport,
  FillMap,
  FillPage,
  FillBook2,
  FillBookOpen,
  FillConference,
  FillMapDistance,
  FillAssemblyArea,
  FillBell,
  FillDashboard,
} from '@hongluan-ui/icons';

export default defineComponent({
  name: 'LayoutMenu',
  components: {
    InlineSvg,
    FillSet,
    FillChartDoughnut,
    FillAirplay,
    FillServer,
    FillAlert,
    FillWarning,
    FillArrowLineCurve,
    FillShapeAnnular,
    FillSliders,
    FillNews,
    FillReport,
    FillMap,
    FillPage,
    FillBook2,
    FillBookOpen,
    FillConference,
    FillMapDistance,
    FillAssemblyArea,
    FillBell,
    FillDashboard,
  },
  props: {
    collapse: String,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isCollapse = ref(false);

    // 处理左边菜单
    const menuList = ref<Array<RouteRecordNormalized>>([]);
    const { proxy } = getCurrentInstance()!;
    const routeList = proxy?.$router.getRoutes() || [];
    routeList.forEach(item => {
      if (item.meta?.menu && item.children && item.children.length > 0) {
        item.children = item.children.filter(sonItem => !sonItem.meta?.hiddenMenu);
        menuList.value.push(item);
      }
    });
    menuList.value.sort(
      (m1, m2) => ((m1.meta?.sort ?? 0) as number) - ((m2.meta?.sort ?? 0) as number)
    );

    const defaultActive = ref<string>('');

    const onlyOneChildren = computed(() => menuList.value.filter(m => m?.meta?.onlyOne));
    const moreChildren = computed(() => menuList.value.filter(m => !m?.meta?.onlyOne));

    const setDefaultActive = () => {
      const { path, meta } = route;
      if (meta.defaultActive) {
        defaultActive.value = meta.defaultActive as string;
      } else {
        defaultActive.value = path;
      }
    };
    const goHome = () => {
      router.push('/home-page/index');
    };

    onMounted(() => {
      setDefaultActive();
    });

    watch(
      () => route.path,
      () => {
        setDefaultActive();
      }
    );

    const secondMenuIndex = (menu: {
      meta: { onlyOne: any };
      path: string;
      children: { path: string }[];
    }) => {
      if (menu.meta.onlyOne) {
        return menu.path + '/' + menu.children[0].path;
      } else {
        return menu.path;
      }
    };

    return {
      defaultActive,
      menuList,
      onlyOneChildren,
      moreChildren,
      isCollapse,
      secondMenuIndex,
      open,
      goHome,
    };
  },
});
</script>
<style lang="scss" scoped>
:deep(.hl-menu) {
  .second-menu-item {
    .second-item-icon {
      color: var(--menu-icon-color);
      margin-right: var(--xxs);
    }
    .hl-menu-item.is-active:not(.is-opened) {
      .second-item-icon {
        color: var(--menu-icon-color--active);
      }
    }
  }
}

:deep(.hl-menu-item-group) {
  .group-title {
    display: none !important;
  }
}
</style>

<style lang="scss" scoped>
:deep(.hl-menu-item-group) {
  .group-title {
    display: none !important;
  }
}
</style>
