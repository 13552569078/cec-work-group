import { defineAsyncComponent } from 'vue';

const PlottingList = defineAsyncComponent(() => import('./plotting-list.vue'));
const PlottingToolboxPanel = defineAsyncComponent(() => import('./toolbox-panel.vue'));

export {
  PlottingList,
  PlottingToolboxPanel,
};
