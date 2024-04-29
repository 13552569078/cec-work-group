import { ref, watch } from "vue";

const startDayTime = "00:00:00";
const endDayTime = "23:59:59";
// 时间范围规则：
// 1. 选择年： 年第一天 --- 年最后一天
// 2. 选择季度： 年-季度第一天 --- 年-季度最后一天
// 3. 选择月： 年-月第一天 --- 年-月最后一天
function useQuarterMonth() {
  const quarterAndMonthTimeObj = ref({
    year: "2023",
    quarter: "",
    month: "",
  });
  const quarterAndMonthTimeValue = ref<string[]>([]);
  const monthRef = ref();
  
  const changeQuarterAndMonthTime = () => {
    const currentTime = getTimeStr();
    // 只选择了年 YYYY
    if (currentTime.length === 4) {
      quarterAndMonthTimeValue.value = [
        `${currentTime}-01-01 ${startDayTime}`,
        `${currentTime}-12-31 ${endDayTime}`,
      ];
    } else if (currentTime.length === 10 && quarterAndMonthTimeObj.value.month === "") {
      // 只选择了年-季度 YYYY-MM-MM => 年-开始月-结束月
      let [year, monthStart, monthEnd] = currentTime.split("-");
      quarterAndMonthTimeValue.value = [
        getMonthStart(`${year}-${monthStart}`),
        getMonthEnd(`${year}-${monthEnd}`),
      ];
    } else if (currentTime.length === 13 || currentTime.length === 7) {
      // 选择了年-季度-月 YYYY-MM-MM-MM 或 选择了年-月 YYYY-MM
      let yearMonth = currentTime.split("-");
      quarterAndMonthTimeValue.value = [
        getMonthStart(`${yearMonth[0]}-${yearMonth[yearMonth.length - 1]}`),
        getMonthEnd(`${yearMonth[0]}-${yearMonth[yearMonth.length - 1]}`),
      ];
    }
    // console.log(quarterAndMonthTimeValue.value, quarterAndMonthTimeObj.value, "-------28888888");
  };

  const getTimeStr = () => {
    let res = quarterAndMonthTimeObj.value.year;
    for (let k in quarterAndMonthTimeObj.value) {
      if (
        k !== "year" &&
        quarterAndMonthTimeObj.value[k as keyof typeof quarterAndMonthTimeObj.value]
      ) {
        res += `-${quarterAndMonthTimeObj.value[k as keyof typeof quarterAndMonthTimeObj.value]}`;
      }
    }
    return res;
  };
  
  // 选择季度，重置月份
  watch(
    () => quarterAndMonthTimeObj.value.quarter,
    (newVal, oldVal) => {
      if (newVal !== oldVal && newVal !== "") {
        // quarterAndMonthTimeObj.value.month = ''
        monthRef.value?.clearMonth();
        changeQuarterAndMonthTime();
      }
    }
  );

  return {
    quarterAndMonthTimeObj,
    changeQuarterAndMonthTime,
    quarterAndMonthTimeValue,
    monthRef,
  };
}


const getMonthStart = (date: string): string => {
  const [year, month] = date.split("-");
  const firstDay = new Date(Number(year), Number(month) - 1, 1);
  const formattedFirstDay = formatDay(firstDay);

  return `${year}-${month}-${formattedFirstDay} ${startDayTime}`;
};

const getMonthEnd = (date: string): string => {
  const [year, month] = date.split("-");
  const lastDay = new Date(Number(year), Number(month), 0);
  const formattedLastDay = formatDay(lastDay);

  return `${year}-${month}-${formattedLastDay} ${endDayTime}`;
};

const formatDay = (date: Date): string => {
  const day = date.getDate();
  return day < 10 ? `0${day}` : `${day}`;
};

export { useQuarterMonth };
