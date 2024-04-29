export interface symbolData {
  position: any[];
  properties?: {
    [key: string]: any;
  };
}
export interface symbolDataListObj {
  textField?: string;
  textColor?: string;
  textOffset?: number[];
  symbolData?: symbolData[];
  pictureSource?: string;
  showFlag?: boolean;
  layerType?: string;
  pictureWidth?: number;
  pictureHeight?: number;
  pictureOffset?: number[];
  pictureScale?: number;
  clusterPictureSource?: string;
  clusterPictureWidth?: number;
  clusterPictureHeight?: number;
  clusterPictureScale?: number;
  clusterPictureOffset?: number[];
}
