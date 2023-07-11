import { PartialType, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { Environment, FormatResponse, PageQuery } from 'src/common/base.dto';
import { Project } from './entities/project.entity';
import { ProjectServer } from './entities/project_server.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  readonly name: string;
  readonly description?: string;
  @IsNotEmpty()
  readonly repositoryType: string;
  @IsNotEmpty()
  readonly repositoryUrl: string;
}
export class CreateOrUpdateProjectDto extends CreateProjectDto {
  readonly id?: number;
}

export class QueryProjectListDto extends PageQuery {
  readonly name?: string;
  readonly owner?: string;
  readonly repositoryType?: string;
}
class ProjectPicked {
  readonly id: number;
  readonly name: string;
  readonly owner?: string;
  readonly repositoryType: string;
}
export class QueryProjectListResponseDto extends FormatResponse {
  readonly data: ProjectPicked[];
  readonly total: number;
}

class PickedServerData {
  readonly id: number;
  readonly name?: string;
  readonly ip: string;
}
class RelatedProjectServer extends PartialType(
  OmitType(ProjectServer, ['project', 'server']),
) {
  readonly Server?: PickedServerData;
}
export class ServerList implements Record<Environment, unknown> {
  development: RelatedProjectServer[] = [];
  pre: RelatedProjectServer[] = [];
  production: RelatedProjectServer[] = [];
}
export class ProjectData extends PartialType(
  OmitType(Project, ['projectServers']),
) {
  readonly serverList: ServerList;
  /** @todo */
  // readonly memberList;
}
export class QueryProjectResponseDto extends FormatResponse {
  readonly data: ProjectData;
}

export class CreateProjectServerDto {
  @IsNotEmpty()
  readonly environment: Environment;
  @IsNotEmpty()
  readonly output: string;
  @IsNumber()
  @IsNotEmpty()
  readonly project: number;
  @IsNumber()
  @IsNotEmpty()
  readonly server: number;
}

export class UpdateProjectServerDto extends CreateProjectServerDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}
