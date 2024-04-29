/* eslint-disable import/no-dynamic-require */
const useNaturePageImg = function NaturePageImg() {
  const useGetImgSrc = (name: string) => {
    return require(`@/assets/images/natureDisaster/${name}.png`);
  };
  const useGetWaringWeaterImgSrc = (name: string) => {
    const path = `/src/assets/images/natureDisaster/weather/warning-icon/${name}.png`;
    const otherPath = `/src/assets/images/natureDisaster/weather/warning-icon/${name.substr(-2)}预警.png`;
    const arrList = [
      '暴雪橙色',
      '暴雪红色',
      '暴雪黄色',
      '暴雪蓝色',
      '暴雨橙色',
      '暴雨红色',
      '暴雨黄色',
      '暴雨蓝色',
      '冰雹橙色',
      '冰雹红色',
      '冰雹黄色',
      '持续低温黄色',
      '持续低温蓝色',
      '大风橙色',
      '大风红色',
      '大风黄色',
      '大风蓝色',
      '大雾橙色',
      '大雾红色',
      '大雾黄色',
      '道路结冰橙色',
      '道路结冰红色',
      '道路结冰黄色',
      '电线积冰橙色',
      '电线积冰黄色',
      '干旱橙色',
      '干旱红色',
      '高温橙色',
      '高温红色',
      '高温黄色',
      '高温蓝色',
      '寒潮橙色',
      '寒潮红色',
      '寒潮黄色',
      '寒潮蓝色',
      '雷电橙色',
      '雷电红色',
      '雷电黄色',
      '雷电蓝色',
      '霾橙色',
      '霾黄色',
      '沙尘暴橙色',
      '沙尘暴红色',
      '沙尘暴黄色',
      '沙尘暴蓝色',
      '台风橙色',
      '台风红色',
      '台风黄色',
      '台风蓝色',
      '霜冻橙色',
      '霜冻黄色',
      '霜冻蓝色',
    ];
    if (arrList.indexOf(name) !== -1) {
      // eslint-disable-next-line global-require
      return require(`@/assets/images/natureDisaster/weather/warning-icon/${name}.png`);
    }
    // eslint-disable-next-line global-require
    return require(`@/assets/images/natureDisaster/weather/warning-icon/${name.substr(-2)}预警.png`);
  };
  const useGetDtaListImgSrc = (name: string) => {
    let path = `/src/assets/images/dataList/${name}.png`;
    if (name.indexOf('monitor_') !== -1) {
      path = '/src/assets/images/dataList/n_monitor_resource.png';
    }
    return require(`@/assets/images/dataList/${name}.png`);
  };
  return {
    useGetImgSrc,
    useGetWaringWeaterImgSrc,
    useGetDtaListImgSrc
  };
};
export default useNaturePageImg;
