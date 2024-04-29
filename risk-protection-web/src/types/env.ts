export type GlobalEnvs = {
  areaCode: string;
  userInfo: {
    name: string;
    mobile: string;
  };
  config: {
    WUJIE_MAX_ALIVE: number
    WUJIE_PRELOAD_ENABLED: string

    API_RISK_PROTECTION_SERVER: string
    API_PREFIX_OP_SERVER: string
    JINGXIANDICT: Record<string, any>
    MAP_CONFIG_LINKAGE_COMMAND_ONEPIC: Record<string, any>

    PROD_PREFIX_PORJECT: string
    NODE_ENV: string
    PROD_PREFIX: string
    PROD_TITLE: string
    BASE_URL: string

    MAPBOX_SRV_URL: string
    MAPBOX_SRV_VERSION: string

    LOGIN_URL_USER_CENTER: string
    API_PREFIX_USER_CENTER: string
    CLIENT_ID_EVENT_HANDLE: string
    CALLBACK_URL_CENTRE_CONFIG: string
  }
};
