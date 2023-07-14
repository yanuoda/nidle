import { Project } from '../project/entities/project.entity';

export class CommonParams {
  project: Partial<Project>;
  mode: string;
  type: string;
  branch: string;
  isNew: boolean;
}

export class AppPublishConfigParam extends CommonParams {
  projectPublishFileKey: string;
}
