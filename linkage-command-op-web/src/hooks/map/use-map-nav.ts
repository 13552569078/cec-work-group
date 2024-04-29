import { computed, ref } from 'vue';
import { IgetAreaTreeSpace, IpostAreaTreeAreaSpace } from '@/apis/modules/user-center/model';

const mapNavs = ref<IgetAreaTreeSpace.Data[]>([]);
const subDistricts = ref({} as Record<string, IpostAreaTreeAreaSpace.Data[]>);
const mapNavTreeData = ref<IgetAreaTreeSpace.Data[]>([]);
function useMapNav() {
  return {
    mapNavs,
    subDistricts,
    mapNavTreeData,
  };
}

export {
  useMapNav
};
