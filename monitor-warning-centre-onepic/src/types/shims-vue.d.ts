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
