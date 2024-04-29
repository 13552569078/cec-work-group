import type { Ref } from 'vue';

export * from './env';
export * from './area';
export * from './types';
export * from './task';

export type IdFiled = {
  [x: string]: any;
  id: string;
};

export type ResourceDetailParams = {
  show: boolean
  title: string
  key: string
  [key: string]: any
}
export interface AssemblePointData {
  id: string;
  assembleTitle: string;
  assembleAddress: string;
  longitude: string;
  latitude: string;
}
export type CreateAssemblePointParams = {
  show: boolean
  title: string
  type: string,
  data: AssemblePointData
}
export type ExpandableCardParams = Record<string, Ref<boolean>>

export type BasicResourceItem = {
  id: string;
  resName: string;
  address: string;
  longitude: string;
  latitude: string;
  resourceType?: string;
  checked?: boolean;
}

export type ResourceTree = {
  id: string;
  label: string;
  value: string;
  sum?: string;
  system: number;
  isLeaf?: boolean;
  checked?: boolean;
  children: ResourceTree[]
}
export type ButtonItem = { label : string; value: string; disabled?: boolean, layerSelected?: boolean; hideLayer?: boolean; }
export type ButtonTabItem = { label : string; value: string; layerSelected?: boolean; hideLayer?: boolean; }
export type LayerTreeItem = { id?: string; layerCode: string; name: string; belong?: string; }
