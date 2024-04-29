import { shallowRef } from 'vue';
import {
  TwoBellOff, TwoCircleCheck, TwoWrite2, TwoClock, TwoCircleDisabled,
  FileCsv, FileFolder, FileDoc, FileGif, FileFile, FileJpg
  , FileMov, FileMp3, FilePdf, FileTxt, FileXls, FileMp4, FilePpt, FilePng,
  FileSql, FileRar, FileXml, FileSvg, FileZip,
} from '@hongluan-ui/icons';

import mobileIcon from '@/assets/images/event-handling/right-3/task-statistics/mobile.png';
import userStateIcon1 from '@/assets/images/event-handling/right-3/task-statistics/user-state1.png';
import userStateIcon2 from '@/assets/images/event-handling/right-3/task-statistics/user-state2.png';
import userStateIcon3 from '@/assets/images/event-handling/right-3/task-statistics/user-state3.png';
import userStateIcon4 from '@/assets/images/event-handling/right-3/task-statistics/user-state4.png';

const FileIconsTypeArray = [
  'csv', 'folder', 'doc', 'gif', 'file', 'jpg', 'mov', 'mp3', 'pdf', 'txt',
  'xls', 'mp4', 'ppt', 'png', 'sql', 'rar', 'xml', 'svg', 'zip'
];

const useIcons = () => {
  const taskStatusIcons = shallowRef({
    '0': {
      icon: TwoBellOff,
      color: '#FFEA44'
    },
    '2': {
      icon: TwoCircleCheck,
      color: '#72F5AC'
    },
    '1': {
      icon: TwoWrite2,
      color: '#00A3FF'
    },
    '3': {
      icon: TwoClock,
      color: '#FD6161'
    },
    '4': {
      icon: TwoCircleDisabled,
      color: '#FD6161'
    }
  });
  const userStateIcons = shallowRef({
    '0': {
      icon: TwoBellOff,
      color: '#FFEA44',
      url: userStateIcon2,
      text: '未响应'
    },
    '1': {
      icon: TwoWrite2,
      color: '#00A3FF',
      url: userStateIcon1,
      text: '执行中'
    },
    '2': {
      icon: TwoCircleCheck,
      color: '#72F5AC',
      url: userStateIcon4,
      text: '已完成'
    },
    '3': {
      icon: TwoClock,
      color: '#FD6161',
      url: userStateIcon3,
      text: '已退回'
    },
  });
  const fileIcons = shallowRef({
    FileCsv,
    FileFolder,
    FileDoc,
    FileGif,
    FileFile,
    FileJpg,
    FileMov,
    FileMp3,
    FilePdf,
    FileTxt,
    FileXls,
    FileMp4,
    FilePpt,
    FilePng,
    FileSql,
    FileRar,
    FileXml,
    FileSvg,
    FileZip
  });

  const convertFileType = (type: string) => {
    switch (type) {
      case 'docx':
        return 'doc';
      case 'pptx':
        return 'ppt';
      case 'xlsx':
        return 'xls';
      default:
        return type;
    }
  };
  const getFileIconName = (fileType: string) => {
    let name = convertFileType(fileType).toLowerCase();
    name = FileIconsTypeArray.includes(name) ? name : 'file';
    name = name.charAt(0).toUpperCase() + name.slice(1);
    return `File${name}`;
  };

  return {
    taskStatusIcons,
    fileIcons,
    mobileIcon,
    userStateIcons,
    getFileIconName,
  };
};
export { useIcons };
