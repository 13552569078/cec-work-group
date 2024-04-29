const legendMap = new Map([
  ['特别重大', 'bg-danger'],
  ['重大', 'bg-warning'],
  ['较大', 'bg-yellow'],
  ['一般', 'bg-primary'],
  ['其他', 'bg-grey'],
  ['执行中', 'bg-primary'],
  ['未响应', 'bg-warning'],
  ['已终止', 'bg-danger'],
  ['已完成', 'bg-success'],
]);

function useHome() {
  const setLegend = (name: string) => {
    return legendMap.get(name);
  };

  return {
    setLegend
  };
}

export { useHome };
