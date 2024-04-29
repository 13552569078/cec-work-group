import { EnvUtils } from 'fx-front-utils';
import type { GlobalEnvs } from '@/types';

const GlobalAPI = {
  config: {
    ...EnvUtils.getEnvVars(import.meta.env.PROD ? {} : process.env),
  } as GlobalEnvs['config']
};
export { GlobalAPI };
