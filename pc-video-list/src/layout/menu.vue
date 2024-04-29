<template>
  <hl-aside :class="collapse">
    <hl-group block dir="vertical" class="h-full">
      <div class="aside-logo">
        <!-- <img :src="logoUrl" alt="hongluan.ui" /> -->
        <h1>监测预警中枢配置</h1>
        <!-- <span class="sub-title">{{ version }}</span> -->
      </div>
      <div class="scrollable no-thumb">
          <hl-menu :default-active="defaultActive" :router="true" :unique-opened="true">
            <template v-for="menu in onlyOneChildren" :key="menu.path">
              <hl-menu-item :index="secondMenuIndex(menu)">
                <template #title>
                  <hl-group gap="var(--sm)" align="items-middle">
                    <hl-icon>
                      <component :is="menu.meta.icon"></component>
                    </hl-icon>
                    <span>{{ menu.meta.title }}</span>
                  </hl-group>
                </template>
              </hl-menu-item>
            </template>
            <hl-menu-item-group>
              <template #title>业务系统</template>
              <template v-for="menu in moreChildren" :key="menu.path">
                <hl-sub-menu :index="secondMenuIndex(menu)">
                  <template #title>
                    <hl-group gap="var(--sm)" align="items-middle">
                      <hl-icon>
                        <component :is="menu.meta.icon"></component>
                      </hl-icon>
                      <span>{{ menu.meta.title }}</span>
                    </hl-group>
                  </template>
                  <hl-menu-item v-for="sonMenu in menu.children" :index="menu.path + '/' + sonMenu.path" :key="sonMenu.name">
                    {{ sonMenu.meta.title }}
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
import { RouteRecordNormalized, RouteRecordRaw, useRoute } from 'vue-router';
import InlineSvg from 'vue-inline-svg';
import { FillSet, FillAirplay, FillServer, FillAlert, FillArrowLineCurve, FillShapeAnnular, FillNews } from '@hongluan-ui/icons';

export default defineComponent({
  name: 'LayoutMenu',
  components: {
    InlineSvg,
    FillSet,
    FillAirplay,
    FillServer,
    FillAlert,
    FillArrowLineCurve,
    FillShapeAnnular,
    FillNews
  },
  props: {
    collapse: String
  },
  setup() {
    const route = useRoute();

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

    onMounted(() => {
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
      secondMenuIndex
    };
  }
});
</script>
