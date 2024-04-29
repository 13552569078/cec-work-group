import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear'

dayjs.extend(quarterOfYear)
function useTimeSelect (timeDimension: number) {
  const startTimePadStr = "00:00:00";
  const endTimePadStr = "23:59:59";
  let startTime, endTime;
  switch (timeDimension) {
    case 1:
      startTime = `${dayjs().format("YYYY-MM-DD")} ${startTimePadStr}`;
      endTime = `${dayjs().format("YYYY-MM-DD")} ${endTimePadStr}`;
      break;
    case 2:
      startTime = `${dayjs().startOf("week").format("YYYY-MM-DD")} ${startTimePadStr}`;
      endTime = `${dayjs().endOf("week").format("YYYY-MM-DD")} ${endTimePadStr}`;
      break;
    case 3:
      startTime = `${dayjs().startOf("month").format("YYYY-MM-DD")} ${startTimePadStr}`;
      endTime = `${dayjs().endOf("month").format("YYYY-MM-DD")} ${endTimePadStr}`;
      break;
    case 4:
      startTime = `${dayjs().startOf("year").format("YYYY-MM-DD")} ${startTimePadStr}`;
      endTime = `${dayjs().endOf("year").format("YYYY-MM-DD")} ${endTimePadStr}`;
      break;
    case 5:
      startTime = `${dayjs().startOf("quarter").format("YYYY-MM-DD")} ${startTimePadStr}`;
      endTime = `${dayjs().endOf("quarter").format("YYYY-MM-DD")} ${endTimePadStr}`;
      break;
    default:
      break;
  }

  return {
    startTime, endTime
  }
}

export { useTimeSelect };