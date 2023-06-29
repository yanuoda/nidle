import { PageQuery } from 'src/common/base.dto';

enum Environment {
  development = 'development',
  pre = 'pre',
  production = 'production',
}

export class QeuryServerListDTO extends PageQuery {
  /**
   * 服务器所属环境
   * @example development
   */
  readonly environment?: Environment;
  readonly name?: string;
  readonly ip?: string;
}

export class CreateServerDTO {
  /**
   * 服务器所属环境
   * @example development
   */
  readonly environment?: Environment;
  readonly name?: string;
  readonly ip?: string;
  readonly username?: string;
  readonly password?: string;
}

export class UpdateServerDTO extends CreateServerDTO {
  id: number;
}

export class RemoveServerDTO {
  id: number;
}
