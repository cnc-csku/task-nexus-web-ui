export interface Sprint {
  id: string;
  projectId: string;
  title: string;
  sprintGoal: string | null;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
