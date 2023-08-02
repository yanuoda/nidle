import { ApiHideProperty } from '@nestjs/swagger';

import { Project } from '../project/entities/project.entity';

class CommonParams {
  mode: string;
  type: string;
  branch: string;
  isNew: boolean;
}
export class AppConfigParam extends CommonParams {
  /** project id */
  id?: number;
  @ApiHideProperty()
  projectObj?: Partial<Project>;
}
export class AppPublishConfigParam extends CommonParams {
  /** project id */
  project?: number;
  @ApiHideProperty()
  projectObj?: Partial<Project>;
  fileName: string;
}
