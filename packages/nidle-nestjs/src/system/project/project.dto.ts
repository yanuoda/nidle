import { PartialType, OmitType, ApiHideProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { Environment, FormatResponse, PageQuery } from 'src/common/base.dto';
import { Changelog } from '../changelog/changelog.entity';
import { Project } from './entities/project.entity';
import { ProjectServer } from './entities/project_server.entity';
import { FindOptionsOrder } from 'typeorm';

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
  readonly order?: FindOptionsOrder<Project>;
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
  readonly description?: string;
  readonly status?: number;
  readonly environment?: string;
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
  readonly memberList: Record<string, any>[];
}
export class QueryProjectResponseDto extends FormatResponse {
  readonly data: ProjectData;
}

export class UpdateContactsDto {
  @IsNotEmpty()
  readonly id: number;
  @IsNotEmpty()
  readonly postEmails: string;
}

export class CreateProjectServerDto {
  @IsNotEmpty()
  readonly environment: Environment;
  @IsNotEmpty()
  readonly output: string;
  @IsNotEmpty()
  readonly project: number;
  @IsNotEmpty()
  readonly server: number;
  readonly description?: string;
}
export class CreateProjectServerResponseDto extends FormatResponse {
  data: RelatedProjectServer;
}

export class UpdateProjectServerDto extends PartialType(
  CreateProjectServerDto,
) {
  @IsNotEmpty()
  readonly id: number;
  @ApiHideProperty()
  readonly changelog?: number;
}
export class UpdateProjectServerResponseDto extends FormatResponse {
  data: RelatedProjectServer;
}

export class FetchProjectServerDto {
  /**
   * 项目id
   */
  @IsNotEmpty()
  readonly id: number;
  /**
   * 所属环境environment
   */
  readonly mode?: string;
}

export class FetchProjectServerResponseDto extends FormatResponse {
  data: ServerList | RelatedProjectServer[];
}

export class AssembleChangelog extends OmitType(Changelog, ['developer']) {
  developer?: string;
  commitUrl?: string;
  isChild?: boolean;
  children?: AssembleChangelog[];
  nextPublish?: any;
}

export class PublishEnvListMap implements Record<Environment, unknown> {
  development: AssembleChangelog[] = [];
  pre: AssembleChangelog[] = [];
  production: AssembleChangelog[] = [];
}

export class PublishListResponseDto extends FormatResponse {
  data: PublishEnvListMap;
}
