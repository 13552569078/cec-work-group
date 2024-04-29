import { ref } from 'vue';
import { useCurrentArea } from '@/hooks';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { IgetAreaTreeSpace } from '@/apis/modules/user-center/model';
import { GlobalAPI } from '@/common';

const areaTreeData = ref<IgetAreaTreeSpace.Data[]>([]);
function useAreaList(defaultVal?: string) {
  const { areaCode: defaultAreaCode } = useCurrentArea();
  // const { areaCode: defaultAreaCode } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
  const areaCode = ref(defaultVal ?? '-1');

  const getAreaTree = async() => {
    if (areaTreeData.value.length) return;
    const res = await apiUserCenterObj.getAreaTree(defaultAreaCode.value);
    areaTreeData.value = [res.data];
  };

  const getAreaValue = () => areaCode.value === '-1' ? '' : areaCode.value;

  const getAreaName = (_areaCode: string) => {
    function deepFind(data: IgetAreaTreeSpace.Data[], code: string) {
      let name = '';
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.code === code) {
          name = item.name;
          break;
        } else if (item.children?.length) {
          const res = deepFind(item.children, code);
          if (res) {
            name = res;
            break;
          }
        }
      }
      return name;
    }
    return deepFind(areaTreeData.value, _areaCode) || '--';
  };

  return {
    areaCode,
    areaTreeData,
    getAreaValue,
    getAreaTree,
    getAreaName,
  };
}

export { useAreaList };
