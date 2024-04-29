import { Ref } from 'vue';

export type PlottingContext = {
  collapse: Ref<boolean>;
  markShapeVisibleMap: Record<string, boolean>;
  stopPlotting: () => void;
}
