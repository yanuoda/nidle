import { OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { Environment, FormatResponse, PageQuery } from 'src/common/base.dto';
import { Server } from './server.entity';

export class CreateServerDTO {
  /**
   * 服务器所属环境
   * @example development
   */
  @IsNotEmpty()
  readonly environment: Environment;
  readonly name?: string;
  @IsNotEmpty()
  readonly ip: string;
  readonly username?: string;
  readonly password?: string;
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
class ServerPicked {
  readonly id: number;
  readonly name?: string;
  readonly ip?: string;
}
export class QueryServerListResponseDTO extends FormatResponse {
  readonly data: ServerPicked[];
  readonly total: number;
}

class ServerData extends PartialType(OmitType(Server, ['projectServers'])) {}
export class QueryServerResponseDTO extends FormatResponse {
  readonly data: { dataValues: ServerData };
}

export class UpdateServerDTO extends CreateServerDTO {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}
