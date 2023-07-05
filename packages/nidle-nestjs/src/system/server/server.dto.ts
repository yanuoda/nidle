import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';

import { PageQuery, FormatResponse } from 'src/common/base.dto';
import { Server } from './server.entity';

enum Environment {
  development = 'development',
  pre = 'pre',
  production = 'production',
}

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
export class CreateServerResponseDTO extends FormatResponse {
  id: number;
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
export class QueryServerListResponseDTO extends FormatResponse {
  @ApiProperty({ type: [ServerPickedList] })
  readonly data: Array<ServerPickedList>;
  readonly total: number;
}

export class QueryServerDTO {
  @IsNumberString()
  @IsNotEmpty()
  id: number;
}
export class QueryServerResponseDTO extends FormatResponse {
  readonly data: { dataValues: Server };
}

export class UpdateServerDTO extends CreateServerDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class RemoveServerDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
