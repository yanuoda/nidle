import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

export class PageQuery {
  readonly current?: number;
  readonly pageSize?: number;
}

export class IdQueryRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id: number;
}

export class IdBodyRequestDto {
  @IsNumberString()
  @IsNotEmpty()
  readonly id: number;
}

export class FormatResponse {
  readonly success?: boolean;
  /**
   * 错误信息
   */
  readonly message?: string;
  /**
   * 错误状态码
   * @example 500
   */
  readonly statusCode?: number;
}

export class IdResponseDto extends FormatResponse {
  readonly id: number;
}

export enum Environment {
  development = 'development',
  pre = 'pre',
  production = 'production',
}

export class SessionUser {
  id: number;
  name: string;
  gitlabUserId: number;
  githubUserId: number;
}
export class SessionDto {
  user?: SessionUser;
}
