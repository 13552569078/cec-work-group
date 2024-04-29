type timeScope = {
  dateEnd: string;
  dateStart: string;
  timeEnd: string
  timeStart: string;
}

const getTimeScopesArr = (timeScopeArr: timeScope[]) => {
  if (!Array.isArray(timeScopeArr)) return [];
  return timeScopeArr.map(timeScope => {
    return `${timeScope.dateStart} 至 ${timeScope.dateEnd} ${timeScope.timeStart} 至 ${timeScope.timeEnd}`;
  });
};

export { getTimeScopesArr };
