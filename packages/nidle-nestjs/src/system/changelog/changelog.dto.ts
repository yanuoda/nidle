import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { Changelog } from './changelog.entity';

export class CreateChangelogDto {
  /** 所属项目id */
  @IsNotEmpty()
  readonly projectId: number;
  /** 发布类型 normal webhook */
  @IsNotEmpty()
  readonly type: string;
  /** 发布分支 */
  @IsNotEmpty()
  readonly branch: string;
  /** 发布环境 */
  @IsNotEmpty()
  readonly mode: string;
  readonly source?: string;
  /** 描述 */
  readonly description?: string;
  /** 当前阶段id（创建下一阶段时判断状态） */
  readonly id?: number;
}
export class CreateChangelogData {
  readonly repositoryType: string;
  readonly repositoryUrl: string;
  readonly projectName: string;
  readonly gitlabId: number;
  readonly changelog: Changelog | null;
}

export class StartChangelogDto {
  @IsNotEmpty()
  readonly id: number;
  @IsNotEmpty()
  readonly configPath: string;
  @IsNotEmpty()
  readonly options: any;
  readonly inputs?: any[];
  readonly notTransform?: boolean;
}
export interface StartParams {
  environment: string;
  changelogDesc: string;
  projectId: number;
  projectName: string;
}

export class GetLogDto {
  @IsNotEmpty()
  readonly id: number;
  readonly logPath?: string;
  readonly type?: string;
}

export class MergeHookDto {
  readonly project: Record<string, any>;
  readonly object_attributes: Record<string, any>;
  readonly user: Record<string, any>;
}

export class CodeReviewDto {
  readonly projectIds: number[];
  readonly mrProjectName: string;
  readonly mrUserName: string;
  readonly lastCommit: Record<string, any>;
  readonly isMerged: boolean;
}

export class UpdateOneDto extends PartialType(Changelog) {
  @IsNotEmpty()
  readonly id: number;
}

export class DeleteByIdsDto {
  @IsNotEmpty()
  readonly ids: number[];
}

export class CallJobMethodDto {
  ids: number[];
  method: string;
  params: any[];
}
