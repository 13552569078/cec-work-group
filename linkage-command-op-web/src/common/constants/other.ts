import { FillPhone, FillPhone2, FillIntercom, FillMeeting } from '@hongluan-ui/icons';

const tableDefaultProps = { width: 'calc(var(--xxs) * 52)' };

const REMINDERDICT = [
  {
    value: '1',
    label: '短信'
  },
  {
    value: '2',
    label: '语音'
  },
  {
    value: '3',
    label: '应用通知'
  }
];

const SYSTEM_USER_SENDWAYS = [{ label: '站内信', value: 'letter', disabled: true }, { label: '短信', value: 'note', disabled: false }];
const TEMP_USER_SENDWAYS = [{ label: '短信', value: 'note', disabled: true }];

export { REMINDERDICT, SYSTEM_USER_SENDWAYS, TEMP_USER_SENDWAYS };

export const COMMUNICATION_MODE_MAP = {
  mobile: {
    icon: FillPhone,
    label: '移动电话',
  },
  phone: {
    icon: FillPhone2,
    label: '固定电话',
  },
  single: {
    icon: FillIntercom,
    label: '单兵设备',
  },
  system: {
    icon: FillMeeting,
    label: '系统账号',
  },
  meeting: {
    icon: FillMeeting,
    label: '视频会议',
  },
};
export const CALLABLE_COMMUNICATION_MODES = ['mobile', 'phone', 'telephone'];

export { tableDefaultProps };

// 缓存前缀
export const DOMAIN = 'linkage-command-op-web';

export const MAX_PAGE_SIZE = 9999999;

export const CLUSTER_MIN_POINTS = 5;
