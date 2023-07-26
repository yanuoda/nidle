// import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChangelogDto {
  /** 所属项目id */
  @IsNumber()
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
  /** 当前阶段id（创建下一阶段时判断状态） */
  readonly id?: number;
}

export class StartChangelogDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
  @IsNotEmpty()
  readonly configPath: string;
  @IsNotEmpty()
  readonly options: any;
  readonly inputs?: any[];
  readonly notTransform?: boolean;
}

export class GetLogDto {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
  readonly logPath?: string;
  readonly type?: string;
}

export class MergeHookDto {
  project: Record<string, any>;
  object_attributes: Record<string, any>;
}