import { defineAsyncComponent } from 'vue';
import Plan1 from './plan1.vue';
import Plan2 from './plan2.vue';
import Plan3 from './plan3.vue';
import Plan4 from './plan4.vue';
import Plan5 from './plan5.vue';
import Plan6 from './plan6.vue';
import Plan7 from './plan7.vue';
import PlanRisk from './plan3-1.vue';
import PlanProject from './plan3-2.vue';
// import PreviewFileDlg from './preview-file-dlg.vue';
// 异步加载，vue-office文件大，这个对话框不经常打开
const PreviewFileDlg = defineAsyncComponent(() => import('./preview-file-dlg.vue'));

export {
  Plan1,
  Plan2,
  Plan3,
  Plan4,
  Plan5,
  Plan6,
  Plan7,
  PlanRisk,
  PlanProject,
  PreviewFileDlg,
};
