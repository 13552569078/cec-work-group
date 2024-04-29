export interface ScrollingBarChartData {
  value: number;
  label: string;
  precent?: string;
}

export interface IPieType2 { platform: string; emergencyNum: number; overTimeNum?: number }

export interface GraphChartItem {
  color: string;
}

export interface GraphChartLabel {
  position: string;
  color: string;
  formatter?: string;
}

export interface GraphChartData {
  id?: string|number;
  name: string;
  category?: string;
  symbolSize?: string|number;
  draggable?: string;
  value: string|number;
  label?: GraphChartLabel;
  itemStyle?: GraphChartItem;
  eventId?: string;
}

export interface GraphChartLink {
  source?: string|number;
  target?: string|number;
  value?: string|number;
}

export interface GraphChartCategories {
  name: string;
}
