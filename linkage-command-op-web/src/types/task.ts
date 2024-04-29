interface TaskRemind {
  addUserId?: string,
  addUserName?: string,
  canDel?: number|string,
  reminderId?: string;
  reminderTime: string;
  reminderType?: []
}

interface TaskTag {
  label: string;
  labelId?: string;
  addUserName?: string;
  addUserId?: string;
  createdAt?: string;
  canDel?: number|string;
  type?: number|string;
}
interface TaskAttachmentParams {
  taskInfoId: string;
  id?: string;
  taskAttachmentName: string; // 任务附件名称
  taskFileName: string; // 任务文件名称
  taskAttachmentUrl: string; // 任务附件URL
  createdUserName?: string;
}

export {
  TaskRemind,
  TaskTag,
  TaskAttachmentParams,
};
