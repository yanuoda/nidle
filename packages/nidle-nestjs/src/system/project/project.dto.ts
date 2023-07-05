import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

import { FormatResponse, PageQuery } from 'src/common/base.dto';
import { Project } from './project.entity';

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
export class CreateOrUpdateProjectResponseDto extends FormatResponse {
  readonly id: number;
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
  @ApiProperty({ type: [ProjectPicked] })
  readonly data: ProjectPicked[];
  readonly total: number;
}

export class QueryProjectDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id: number;
}
export class QueryProjectResponseDto extends FormatResponse {
  readonly data: Project;
}

export class RemoveProjectDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}
