export type GlobalEnvs = {
  areaCode: string;
  userInfo: {
    name: string;
    mobile: string;
  };
  config: {
    OP_DATA_REFRESH_INTERVAL: string
    MAP_BUFFER_DEFAULT_RADIUS: string
    MAP_CONFIG_LINKAGE_COMMAND_ONEPIC: Record<string, any>
    NORMAL_MAP_CONFIG: Record<string, any>
    WARTIME_MAP_CONFIG: Record<string, any>
    HIDE_TOOLS: string[]
    FIXED_VIDEOS: string[]
    NODE_ENV: string
    PROD_PREFIX: string
    PROD_TITLE: string
    BASE_URL: string
    HONGLING_BASE_URL: string
    MESSAGE_CENTER_URL: string
    NOTIFICATION_BASE_URL: string
    RTZ_SDK_CONFIG: string
    MEETING_EMBED_MODE: string

    API_PREFIX_ONEPIC_LINKAGE_COMMAND: string
    API_PREFIX_WEATHER: string
    API_PREFIX_NOTICE_CENTRE: string
    API_PREFIX_TASK_CENTER: string
    API_PREFIX_SWAN_UCENTER: string
    API_PREFIX_SWAN_COMMAND_SYSTEM: string
    API_PREFIX_OP_SERVER: string
    API_PREFIX_KNOWLEDGE_MANAGEMENT: string
    API_PREFIX_PRODUCT_MEETING: string
    API_PREFIX_PLOTTING: string

    FILE_SERVICE_HTTP: string
    VIDEO_SERVICE_VIEW: string
    FILE_VIEW: string
    FILE_PREVIEW_URL: string

    PDF_CMAP_URL: string
    MAP_IMAGES_URL: string
    MAPBOX_SRV_URL: string
    MAPBOX_SRV_VERSION: string

    LOGIN_URL_USER_CENTER: string
    API_PREFIX_USER_CENTER: string
    CLIENT_ID_COMMAND_OP: string
    CALLBACK_URL_CENTRE_CONFIG: string
    FIXED_VIDEO_URL: string
    UAV_VIDEO_UR: string
    BKQ_VIDEO_UR: string
  }
};
