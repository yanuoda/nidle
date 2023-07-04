import { ApiProperty } from '@nestjs/swagger';

import { PageQuery, FormatResponse } from 'src/common/base.dto';
import { Server } from './server.entity';

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
class ServerPickedList {
  readonly id: number;
  readonly name?: string;
  readonly ip?: string;
}
export class ResServerListDTO extends FormatResponse {
  @ApiProperty({ type: [ServerPickedList] })
  readonly data: Array<ServerPickedList>;
  readonly total: number;
}

export class ResServerDTO extends FormatResponse {
  readonly data: { dataValues: Server };
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
