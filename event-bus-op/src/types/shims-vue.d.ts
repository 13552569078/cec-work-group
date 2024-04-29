/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.png'
declare module '*.svg' {
  const value: string;
  export default value;
}
declare let DHWs: any;
declare module '*.json' {
  const value: any;
  export default value;
}
declare module 'vue3-video-play';

declare module 'vue-seamless-scroll/src';

declare module 'turf-featurecollection';
declare module 'turf-point';

declare module '@/assets/styles/mapDraw/style.js';
