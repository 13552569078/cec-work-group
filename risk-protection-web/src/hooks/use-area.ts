import { ref } from 'vue';
import { GlobalAPI } from '@/common';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { apiAreaCodeObj } from '@/apis/modules/area';
import type {IlistSpace} from '@/apis/modules/area/model';

const areaTreeData: any = ref([]);
const areaCodeList = ref([] as IlistSpace.Data[]);
const allAreaCodeList = ref([] as IlistSpace.Data[]);

function useAreaTree() {
  const { areaCode: initAreaCode, areaName } = GlobalAPI.config.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC;
  const areaProps = {
    emitPath: false,
    value: 'id',
    label: 'name',
    checkStrictly: true,
  };

  const getAreaTree = async() => {
    const res = await apiUserCenterObj.postAreaTreeByCode(3, initAreaCode);
    areaTreeData.value = [{
      id: initAreaCode,
      name: areaName,
      children: res.data
    }];
  };

  // 行政区划下拉列表
  const getAreaCodeList = async() => {
    const res = await apiAreaCodeObj.list();
    areaCodeList.value = res.data;
  }
  // 行政区划包括县级
  const getAllAreaCodeList = async() => {
    const res = await apiAreaCodeObj.allList();
    allAreaCodeList.value = res.data;
  }
  //

  return {
    areaTreeData,
    areaProps,
    areaCodeList,
    allAreaCodeList,

    getAreaTree,
    getAreaCodeList,
    getAllAreaCodeList
  };
}

export { useAreaTree };
