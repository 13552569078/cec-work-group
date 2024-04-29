import { EnvUtils } from 'fx-front-utils';
import { GlobalEnvs } from '@/types';

const GlobalAPI = {
  config: {
    ...EnvUtils.getEnvVars(process.env),
    MAP_CONFIG_LINKAGE_COMMAND_ONEPIC: JSON.parse(String(process.env.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC)),
    JINGXIANDICT: JSON.parse(String(process.env.JINGXIANDICT)),
  } as GlobalEnvs['config'],
  areaCode: '3207',
  userInfo: {
    name: '',
    mobile: '',
  },
};
export { GlobalAPI };
