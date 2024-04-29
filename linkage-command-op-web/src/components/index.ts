import { defineAsyncComponent } from 'vue';
import ButtonGroup from './button/button-group.vue';
import ButtonTabs from './button/button-tabs.vue';
import CardPanel from './card/card-panel.vue';
import CardPopper from './card/card-popper.vue';
import CardPopover from './card/card-popover.vue';
import ExpandableButton from './button/expandable-button.vue';
import RankList from './rank-list.vue';
import VideoPlayer from './video-player.vue';
import MeetingContainer from './meeting/meeting-container.vue';
import OrgUserItem from './org-user-item.vue';
import OrgUserSelectorDlg from './org-user-selector-dlg/index.vue';
import FileCard from './file-card.vue';
import DigitalPlanDlg from './digital-reserve-plan/digital-plan-dlg.vue';
import SendMsgDlg from './send-msg/send-msg-dlg.vue';
import SendMsgForm from './send-msg/send-msg-form.vue';
import FileCarousel from './file-carousel.vue';
import AreaCascader from './area-cascader.vue';
import PdfPreviewerDlg from './pdf-previewer-dlg.vue';
import VirtualTextOverflow from './virtual-text-overflow.vue';

const CallingDlg = defineAsyncComponent(() => import('./meeting/calling-dlg.vue'));
const StartMeetingDlg = defineAsyncComponent(() => import('./meeting/start-meeting-dlg.vue'));

export * from './org-user-selector-dlg/types';

export {
  CardPanel,
  CardPopper,
  CardPopover,
  ButtonGroup,
  ButtonTabs,
  ExpandableButton,
  RankList,
  VideoPlayer,
  StartMeetingDlg,
  MeetingContainer,
  OrgUserItem,
  OrgUserSelectorDlg,
  FileCard,
  DigitalPlanDlg,
  SendMsgDlg,
  SendMsgForm,
  FileCarousel,
  AreaCascader,
  CallingDlg,
  PdfPreviewerDlg,
  VirtualTextOverflow,
};

export type AreaChangeEvent = { id: string; name: string; }
export type MultiAreaChangeEvent = { idList: string[]; nameList: string[]; }
