import { loadRemoteComponents, loadRemoteOthers } from 'fx-front-framework';
import { GlobalAPI } from './global-api';

export function loadMapboxComponents(names: string[]) {
  return loadRemoteComponents({
    libName: 'mapbox-component-srv',
    libUrl: GlobalAPI.config.MAPBOX_SRV_URL,
    libVersion: GlobalAPI.config.MAPBOX_SRV_VERSION,
    componentNames: names,
  });
}

export function loadMapboxOthers(names: string[]) {
  return loadRemoteOthers({
    libName: 'mapbox-component-srv',
    libUrl: GlobalAPI.config.MAPBOX_SRV_URL,
    libVersion: GlobalAPI.config.MAPBOX_SRV_VERSION,
    names,
  });
}
