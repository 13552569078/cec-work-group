/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "@hongtu/amap-next/dist" {
  const VueMap: any;
  export const initAMapApiLoader: any;
  export const initGeocoder: any;
  export const initPlaceSearch: any;
  export const initDistrictSearch: any;
  export default VueMap;
}
