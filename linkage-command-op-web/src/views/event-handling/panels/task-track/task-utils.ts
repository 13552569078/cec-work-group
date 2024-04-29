export const getFeedbackData = (data: string) => {
  const body = data.split('增加了动态反馈。反馈内容：');
  const title = `${body[0]}增加了任务反馈`;
  const desc = JSON.parse(body[1]).feedbackDesc;
  const fileList = JSON.parse(body[1]).fileList || [];
  return { title, desc, fileList };
};

export const getReturnTaskData = (data: string) => {
  const body = data.split('退回了任务。退回原因:');
  const title = `${body[0]}退回了任务`;
  const reason = JSON.parse(body[1].substring(6, body[1].length - 7)).reason;
  return { title, reason };
};

export const getCompleteExecutorData = (data: string) => {
  const body = data.split('已完成任务。提交说明：');
  const title = `${body[0]}已完成任务`;
  const reason = JSON.parse(body[1].split('<span>')[0]).reason;
  return { title, reason };
};
