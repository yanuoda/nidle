import { IsNotEmpty } from 'class-validator';

import { Environment, FormatResponse, PageQuery } from 'src/common/base.dto';
import { Server } from 'src/system/server/server.entity';
import { AirlinePublish } from './airline_publish.entity';

export class CreateAirlinePublishDto {
  @IsNotEmpty()
  readonly airline: string;
  @IsNotEmpty()
  readonly environment: Environment;
  @IsNotEmpty()
  readonly projectServer: number;
  readonly relativePath?: string;
  readonly status?: number;
  readonly description?: string;
}
export class UpdateAirlinePublishDto extends CreateAirlinePublishDto {
  @IsNotEmpty()
  readonly id: number;
}
export class QeuryAirlinePublishListDTO extends PageQuery {
  readonly airline?: string;
  readonly environment?: Environment;
}
export class QueryAirlinePublishListResponseDTO extends FormatResponse {
  readonly data: AirlinePublish[];
  readonly total: number;
}

export class PublishServer extends AirlinePublish {
  Server: Server;
  projectServerOutput: string;
}
