interface RegionDataProperties {
  id: number;
  name: string;
  emit: string;
  regionType: string;
}

export interface RegionDataLineProperties extends RegionDataProperties {
  color: string;
  textColor: string;
}

export interface RegionDataPolygenProperties extends RegionDataProperties {
  borderColor: string;
  fillColor: string;
}

export interface RegionDataFeatures {
  item: any;
  type: string;
  properties: RegionDataProperties | RegionDataProperties;
}
export interface RegionDataLineOrPolygon {
  type: string;
  features: RegionDataFeatures[];
  regionType: string;
}
