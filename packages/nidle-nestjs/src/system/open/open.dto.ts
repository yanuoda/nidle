import { IsNotEmpty } from 'class-validator';

import { Environment } from 'src/common/base.dto';

export class AirlineConfigPublishDto {
  /**
   * API KEY 调用权限凭证
   */
  @IsNotEmpty()
  readonly apiKey: string;
  /**
   * 航司
   */
  @IsNotEmpty()
  readonly airline: string;
  /**
   * 所属环境
   * - development
   * - pre
   * - production
   */
  @IsNotEmpty()
  readonly environment: Environment;
  /**
   * 文件数据
   */
  @IsNotEmpty()
  readonly fileData: string;
  /**
   * 文件名
   */
  @IsNotEmpty()
  readonly fileName: string;
}
