const line1 = {
  flag: 'chart',
  data: [
    {
      type: 'lineChart',
      title: '图标标题', // 标题
      legend: [],
      xAxis: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      yName: '辆',
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320], // 数据
          type: 'line',
          smooth: true
        }
      ]
    }
  ]
}
export default line1
