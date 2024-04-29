import { h } from 'vue';
import { ModelessDialogManager } from 'hongluan-business-ui';
import { VideoPlayer } from '@/components';

export const playFixedVideos = (items: Record<string, any>[], options: Record<string, any> = {}) => {
  ModelessDialogManager.show({
    title: '视频播放',
    useDock: false,
    snapshot: false,
    body: h(VideoPlayer, { items }),
    resize: true,
    showCollapse: false,
    customClass: 'multi-video-player-dialog',
    onResize: (dlg: HTMLDivElement) => {
      const videoNode = dlg.querySelector('.multi-video-player');
      videoNode?.setAttribute('style', 'width:100%;height:100%');
    },
    ...options
  });
};

export const videoStateDict = new Map([
  ['0', { name: '离线', type: 'info', textColor: '#7799cc' }],
  ['1', { name: '在线', type: 'success', textColor: '#4cc09e' }],
  ['', { name: '故障', type: 'danger', textColor: '#7799cc' }]
]);
