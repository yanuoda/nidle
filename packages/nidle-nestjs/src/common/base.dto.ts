export class PageQuery {
  readonly current?: number;
  readonly pageSize?: number;
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

export enum Environment {
  development = 'development',
  pre = 'pre',
  production = 'production',
}
