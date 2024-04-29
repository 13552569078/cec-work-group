import { ref  } from 'vue';
const userInfo = ref({});
function useUserInfo() {
  const setUserInfo = (val: any) => {
    userInfo.value = val;
  }
  return {
    userInfo,
    setUserInfo,
    // empid: userInfo.value?.empid
  }
}
export { useUserInfo }