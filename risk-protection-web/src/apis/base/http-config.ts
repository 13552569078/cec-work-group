export const noLoadingUrls = [];

export const easyExcelUrls = [
  '/disater/public/download',
  '/disater/hotel/download',
  '/disater/largeMarket/download',
  '/disater/welfare/download',
  '/disater/stadium/download',
  '/disater/township/download',
  '/disater/community/download',
  '/disater/history/download',
  '/disater/river/download',
  '/disater/gateStation/download',
  '/disasterIndicatorStatistics/download',
  '/disasterGovernmentManagement/download',
  '/disasterSocietyReduction/download',
  '/disasterChemicalIndustrialPark/download',
  '/disasterTownsIndicatorStatistics/download'
]

export const arrayBufferUrls = [
  '/gateway/etcc-api/fileServer/file',
  '/download',
  ...easyExcelUrls
];

export const formDataUrls = [];

/** 接口提示msg，一般为新增/保存 */
export const showMsgUrls = [];

// 列表接口 不需要转为'--'
export const notTranslateEmpty = ['/strategy/findStrategyCommandUserPage', '/commandsystem/findCommandSysGroupMemberPage'];
