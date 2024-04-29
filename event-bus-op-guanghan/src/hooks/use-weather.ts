import { ref } from "vue"
import { apiHefengWeatherObj } from "@/apis/modules/weather";
import { IgetLatestSpace } from "@/apis/modules/weather/model";
import { GlobalAPI } from "@/common";
const { areaCode } = JSON.parse(GlobalAPI.config.MAP_CONFIG);

const latestWeather = ref<IgetLatestSpace.Data>()
function useWeather() {
  const getLatestWeather = async () => {
    const res = await apiHefengWeatherObj.getLatest(areaCode)
    latestWeather.value = res?.data
  }
  return { latestWeather, getLatestWeather }
}
export { useWeather }