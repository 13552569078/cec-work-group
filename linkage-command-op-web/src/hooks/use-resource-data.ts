import { ref, computed } from 'vue';
import { PROTECT_NAME, RESOURCE_NAME, RISK_NAME, RESOURCE_EQUIP, MAX_PAGE_SIZE } from '@/common';
import { ResourceTree } from '@/types';
import { apiResourceObj } from '@/apis/modules/resource';
import { IpostFindResourceTypeAttrPageSpace } from '@/apis/modules/resource/model';

const ALL_RESOURCES_TREE_NEW = ref<ResourceTree[]>([]);
const ALL_RESOURCES_DICT_NEW = ref<Record<string, {label: string; [x: string]: any; }>>({});
function useResourceData() {
  const EXPERT_COMMON_COLS = [
    { title: '#', slotName: 'tableSelect', headerSlotName: 'allRowsSelector', width: '3em' },
    { title: '名称', prop: 'name', showTooltip: true, width: '200px', tooltipProps: { width: '200px', popperClass: 'test-tip', placement: 'bottom', effect: 'light', },
    },
    { title: '行政区划', prop: 'administrative', slotName: 'administrative', width: '120px' },
    { title: '联系人', prop: 'contacts', width: '120px', showTooltip: true, tooltipProps: { effect: 'light' },
    },
    { title: '联系电话', prop: 'telephone', width: '120px', showTooltip: true, tooltipProps: { effect: 'light' },
    },
  ];
  const RESOURCE_COMMON_LABELS = [
    { label: '名称', key: 'name' },
    { label: '行政区划', key: 'administrative' },
    { label: '详细地址', key: 'address' },
    { label: '经纬度', key: ['longitude', 'latitude'] },
    { label: '联系人', key: 'contacts' },
    { label: '联系电话', key: 'telephone' },
  ];
  const resourceApiObj = {
    [RISK_NAME]: 'postFindEventSurroundingRisk',
    [RESOURCE_NAME]: 'postFindEventSurroundingResources',
    [PROTECT_NAME]: 'postFindEventSurroundingProtectionTarget'
  };
  const baseEquipCols = [
    { title: '序号', slotName: 'tableIndex', width: '4em', align: 'center' },
    { title: '物资名称', prop: 'name', align: 'left', showTooltip: true },
  ];

  const resourceCustomLabels = ref<{ label: string; key: any; }[]>([]);
  const resourceEquipLabels = ref<{ label: string; key: any; }[]>([]);
  const resourceTypeAttrs = ref<IpostFindResourceTypeAttrPageSpace.List[]>([]);

  const resourceLabels = computed(() => [...RESOURCE_COMMON_LABELS, ...resourceCustomLabels.value]);
  const equipTableCols = computed(() => {
    const customCols = resourceEquipLabels.value.map(el => ({
      title: el.label, prop: el.key, align: 'center', width: 'calc(var(--xxs) * 30)', showTooltip: true
    }));
    return [...baseEquipCols, ...customCols];
  });
  const resourceTypeAttrCols = computed(() => resourceTypeAttrs.value.map(el => ({
    title: el.name,
    prop: el.code,
    showTooltip: true,
    width: '150px',
    tooltipProps: { effect: 'light' },
  })));
  const resourceTypeLoaded = computed(() => !!ALL_RESOURCES_TREE_NEW.value.length && !!Object.keys(ALL_RESOURCES_DICT_NEW.value).length);

  const getResourceTypeTree = async() => {
    if (ALL_RESOURCES_TREE_NEW.value.length) return;
    const res = await apiResourceObj.postTypeTree(true);
    ALL_RESOURCES_TREE_NEW.value = res.data.map(el => {
      const children = el.children.map(c => ({
        id: c.code, value: c.code, label: c.name, children: c.children, system: c.system
      }));
      const apiStr = resourceApiObj[el.code as keyof typeof resourceApiObj];
      return { id: el.code, value: apiStr, label: el.name, children, system: el.system } as ResourceTree;
    });
  };

  const getResourceDict = async() => {
    return new Promise((resolve, reject) => {
      if (Object.keys(ALL_RESOURCES_DICT_NEW.value).length) {
        resolve(true);
        return;
      }
      apiResourceObj.postTypeTree(false).then(res => {
        res.data.forEach(el => {
          ALL_RESOURCES_DICT_NEW.value[el.code] = { label: el.name, code: el.code, system: el.system, belong: el.code };
          if (el.children?.length) {
            el.children.forEach(c => {
              ALL_RESOURCES_DICT_NEW.value[c.code] = { label: c.name, code: c.code, system: c.system, belong: el.code };
            });
          }
        });
      }).finally(() => {
        resolve(true);
      });
    });
  };

  const getAllResourceType = () => {
    return Promise.all([getResourceTypeTree(), getResourceDict()]);
  };

  const getResourceCustomLabels = async(typeCode: string) => {
    const params = {
      currentPage: 1,
      pageSize: MAX_PAGE_SIZE,
      typeCode,
      display: 1,
    };
    const { data } = await apiResourceObj.postFindResourceTypeAttrPage(params);

    resourceTypeAttrs.value = [];
    const labels: { label: string; key: any; }[] = [];
    data.list.forEach(el => {
      const obj = {
        label: el.name,
        key: el.code
      };
      el.system === 1 ? labels.unshift(obj) : labels.push(obj);
      el.system === 1 ? resourceTypeAttrs.value.unshift(el) : resourceTypeAttrs.value.push(el);
    });
    typeCode === RESOURCE_EQUIP ? resourceEquipLabels.value = labels : resourceCustomLabels.value = labels;
  };

  const getResourceInfo = (resourceCode: string, key: string) => {
    const item = ALL_RESOURCES_DICT_NEW.value[resourceCode];
    return item?.system === 1 ? item[key] : 'custom';
  };

  const isResource = (code: string) => {
    return !!ALL_RESOURCES_DICT_NEW.value[code];
  };

  return {
    ALL_RESOURCES_DICT_NEW,
    ALL_RESOURCES_TREE_NEW,
    EXPERT_COMMON_COLS,
    resourceTypeLoaded,
    resourceLabels,
    equipTableCols,
    resourceTypeAttrs,
    resourceTypeAttrCols,
    getAllResourceType,
    getResourceCustomLabels,
    getResourceInfo,
    isResource,
  };
}
export {
  useResourceData
};
