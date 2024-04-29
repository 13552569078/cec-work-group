const LineTooltip = {
  backgroundColor: '#0f182ae6',
  borderColor: '#0f182ae6',
  textStyle: {
    color: 'white',
  },
  formatter(params: any) {
    if (params === null || params.length === 0) return;
    params.sort((a: { value: number }, b: { value: number }) => {
      return b.value - a.value;
    }); // 降序
    let tip = '';
    tip += `<div style='margin-bottom: var(--xxs)' class='font-lg'>${params[0].name}</div>`;
    params.forEach((item: any, index: number) => {
      tip += `<div style='margin-bottom: var(--xxs)'>${item.marker}${item.seriesName}：${
        item.value === undefined ? '-' : item.value
      }</div>`;
    });
    return tip;
  },
};

const Legend = {
  type: 'scroll',
  icon: 'roundReact',
  itemHeight: 14,
  itemWidth: 14,
  pageIconColor: '#fff',
  textStyle: {
    color: '#CBE9FF',
    fontSize: 14,
    fontFamily: 'SourceHanSansCN-Regular',
  },
  pageTextStyle: {
    color: '#fff',
    fontFamily: 'SourceHanSansCN-Regular',
  },
  bottom: '-2%'
};

const Grid = {
  top: '13%',
  left: '0',
  right: '0',
  bottom: '15%',
  containLabel: true,
};

const XAxis = {
  type: 'category',
  boundaryGap: false,
  axisLabel: {
    color: '#CBE9FF',
    fontSize: 14,
    showMinLabel: false,
    showMaxLabel: false,
    hideOverlap: true,
    interval: 1,
  },

};

const YAxis = {
  axisLabel: {
    color: '#CBE9FF',
    fontSize: 14,
  },
  // name: '单位：件',
  nameTextStyle: {
    color: '#CBE9FF',
  },
  minInterval: 1
};

export {
  LineTooltip,
  Legend,
  Grid,
  XAxis,
  YAxis
};
