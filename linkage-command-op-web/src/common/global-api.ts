import { EnvUtils } from 'fx-front-utils';
import { User } from 'fx-front-ucenter';
import type { GlobalEnvs } from '@/types';

const GlobalAPI = {
  config: {
    ...EnvUtils.getEnvVars(import.meta.env.PROD
      ? {
          PROD_PREFIX: process.env.PROD_PREFIX
        }
      : process.env),
    MAP_CONFIG_LINKAGE_COMMAND_ONEPIC: JSON.parse(String(process.env.MAP_CONFIG_LINKAGE_COMMAND_ONEPIC)),
    NORMAL_MAP_CONFIG: JSON.parse(String(process.env.NORMAL_MAP_CONFIG)),
    WARTIME_MAP_CONFIG: JSON.parse(String(process.env.WARTIME_MAP_CONFIG)),
    HIDE_TOOLS: JSON.parse(String(process.env.HIDE_TOOLS)),
    FIXED_VIDEOS: JSON.parse(String(process.env.FIXED_VIDEOS)),
  } as GlobalEnvs['config'],
  userInfo: {
  } as User,
};
export { GlobalAPI };
