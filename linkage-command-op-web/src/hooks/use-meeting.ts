import { ref } from 'vue';
import { HlMessageBox } from 'hongluan-ui';
import { apiCommandCenterObj } from '@/apis/modules/command-center';
import { apiUserCenterObj } from '@/apis/modules/user-center';
import { IpostCreateMeetingVerificationSpace } from '@/apis/modules/command-center/model';
import { IgetFindUserListByOrgIdsSpace } from '@/apis/modules/user-center/model';

const showMeetingDlg = ref(false);
const meetingPassedPerson = ref<IpostCreateMeetingVerificationSpace.UserDetailDTOList[] | IgetFindUserListByOrgIdsSpace.Data[]>([]);

function useMeeting() {
  const addMeeting = async(params: { orgIds?: string[], personIds?: string[], strategyId: string }) => {
    const res = await apiCommandCenterObj.postCreateMeetingVerification(params);
    meetingPassedPerson.value = res.data.userDetailDTOList;
    if (res.data.notInformationNum) {
      await HlMessageBox.confirm(res.data.description, '提示', {
        customClass: 'custom-message-box-width',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      });
    }
    showMeetingDlg.value = true;
  };

  const addMeetingOrg = async(orgIds: Array<string>) => {
    const res = await apiUserCenterObj.getFindUserListByOrgIds(orgIds.join(','));
    meetingPassedPerson.value = res.data;
    showMeetingDlg.value = true;
  };

  return {
    showMeetingDlg,
    meetingPassedPerson,
    addMeeting,
    addMeetingOrg,
  };
}

export { useMeeting };
