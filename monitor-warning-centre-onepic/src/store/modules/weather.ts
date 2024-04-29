import { MutationTree } from 'vuex';

interface InfoItem {
  weatherLocation: {
    adcode: string | number,
    x: string | number,
    y: string | number,
    province: string,
    city: string,
    district: string,
    formattedAddress: string
  }
}
const weatherState = {
  weatherLocation: {
    adcode: '510603',
    x: '104.400903',
    y: '31.128056',
    province: '',
    city: '',
    district: '',
    formattedAddress: ''
  }
};

// mutations
const mutations: MutationTree<InfoItem> = {
  setWeatherLocation(state, payload) {
    state.weatherLocation = Object.assign(state.weatherLocation, payload);
  }
};

export default {
  namespaced: true,
  state: weatherState,
  mutations
};
