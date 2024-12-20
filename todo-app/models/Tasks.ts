export type TasksData = {
  idTasks?: number;
  titleName: string;
  description: string;
  status: string;
  createdAt?: Date;
  startDate: Date | string;
  endDate: Date | string;
};
