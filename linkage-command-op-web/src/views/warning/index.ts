import { defineAsyncComponent } from 'vue';

const WarningCard = defineAsyncComponent(() => import('./index.vue'));

export {
  WarningCard,
};
