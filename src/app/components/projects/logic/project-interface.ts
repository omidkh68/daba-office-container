export interface ProjectInterface {
  projectID: number;
  projectName: string;
  projectTime?: number;
  startAt?: string;
  stopAt?: string;
  actualStart?: string;
  actualStop?: string;
  description?: string;
  projectStatus?: string;
  projectActiveStatus?: number;
}
