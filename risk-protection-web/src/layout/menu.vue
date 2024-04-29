<template>
  <hl-aside :class="collapse">
    <hl-group block dir="vertical" class="h-full">
      <hl-group class="index-button p-l-xxl p-r-md" align="items-middle items-between" gap="var(--sm)">
        <hl-icon v-show="isCollapse" size="md">
        </hl-icon>
        <div v-show="!isCollapse"  class="text-regular font-xl font-bold">基础信息综合平台</div>
        <hl-icon size="xs" type="primary"  class="cursor-pointer" @click="isCollapse=!isCollapse">
          <FillSignin v-show="!isCollapse"/>
          <FillSignout v-show="isCollapse"/>
        </hl-icon>
      </hl-group>
      <div class="scrollable no-thumb">
          <hl-menu :default-active="defaultActive" :router="true" :unique-opened="true" :collapse="isCollapse">
            <template v-for="menu in menuList" :key="menu.path">
              <hl-sub-menu v-if="!menu?.meta?.onlyOne" :index="secondMenuIndex(menu)" :teleported="true" :fallback-placements="['right-start']">
                <template #title>
                  <hl-group gap="var(--sm)" align="items-middle">
                    <hl-icon class="menu-icon">
                      <InlineSvg v-if="menu.meta.icon" :src="require(`@/assets/images/menu/${menu.meta.icon}.svg`)"/>
                      <component v-else :is="menu.meta.systemIcon"></component>
                    </hl-icon>
                    <span>{{ menu.meta.title }}</span>
                  </hl-group>
                </template>
                <template v-for="sonMenu in menu.children" :key="sonMenu.name">
                  <template v-if="sonMenu.meta?.hidden !== true">
                    <hl-menu-item v-if="sonMenu.meta?.link" @click="openLinkMenu(sonMenu)">{{ sonMenu.meta.title }}</hl-menu-item>
                    <hl-menu-item v-else :index="menu.path + '/' + sonMenu.path" @click="changeMenu">
                      {{ sonMenu.meta!.title }}
                    </hl-menu-item>
                  </template>
                </template>
              </hl-sub-menu>
              <hl-menu-item v-else :index="secondMenuIndex(menu)" @click="changeMenu">
                <hl-icon class="menu-icon">
                  <InlineSvg v-if="menu.meta.icon" :src="require(`@/assets/images/menu/${menu.meta.icon}.svg`)"/>
                  <component v-else :is="menu.meta.systemIcon"></component>
                </hl-icon>
                &nbsp;
                <template #title>{{ menu.meta.title }}</template>
              </hl-menu-item>
            </template>
          </hl-menu>
      </div>
    </hl-group>
  </hl-aside>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch, getCurrentInstance, computed } from 'vue';
import { RouteRecordNormalized, RouteRecordRaw, useRoute } from 'vue-router';
import InlineSvg from 'vue-inline-svg';
import { FillSet, FillChartDoughnut, FillAirplay, FillSliders, FillWarning, FillServer, FillAlert, FillArrowLineCurve, FillShapeAnnular, FillNews, FillSignin, FillMap } from '@hongluan-ui/icons';
import { useUser, User } from 'fx-front-ucenter';

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
    FillMap,
  },
  props: {
    collapse: String
  },
  emits: ['change', 'toggle-menu'],
  setup(props, { emit }) {
    const route = useRoute();
    const { getUserInfo } = useUser();

    const userInfo = ref<User>();
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
    menuList.value.sort((m1, m2) => ((m1.meta?.sort ?? 0) as number) - ((m2.meta?.sort ?? 0) as number));

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

    const changeMenu = (menuItem:any) => {
      emit('change', menuItem);
    };
    const openLinkMenu = (menuItem:any) => {
      window.open(menuItem.path, '_blank');
    };
    const handleUserRole = async() => {
      userInfo.value = await getUserInfo();
      for (let i = menuList.value.length - 1; i >= 0; i--) {
        const item = menuList.value[i];
        item.children = item.children.filter(sonItem =>
          !sonItem.meta?.roles ||
          userInfo.value?.roleBrief.some(r => (sonItem.meta?.roles as any).includes(r.roleCode))
        );
        if (!item.children.length) {
          menuList.value.splice(i, 1);
        }
      }
      // menuList.value.forEach(item => {
      //   item.children = item.children.filter(sonItem =>
      //     !sonItem.meta?.roles ||
      //     userInfo.value?.roleBrief.some(r => (sonItem.meta?.roles as any).includes(r.roleCode))
      //   );
      // });
    };

    onMounted(async() => {
      await handleUserRole();
      setDefaultActive();
    });

    watch(
      () => route.path,
      () => {
        setDefaultActive();
      }
    );

    const secondMenuIndex = (menu: { meta: { onlyOne: any }; path: string; children: { path: string }[] }) => {
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
      changeMenu,
      openLinkMenu,
    };
  }
});
</script>
<style scoped lang="scss">
:deep(.hl-menu) {
  .hl-menu-item {
    .menu-icon {
      color: #5281E9;
    }
    &.is-active:not(.is-opened) {
      .menu-icon {
        color: #fff;
      }
    }
  }
}
</style>
