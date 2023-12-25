import { IsNotEmpty } from 'class-validator';

import { FormatResponse, PageQuery } from 'src/common/base.dto';
import { Apiauth } from './apiauth.entity';

export class CreateApiauthDto {
  @IsNotEmpty()
  readonly name: string;
  readonly status?: number;
  readonly description?: string;
}
export class UpdateApiauthDto extends CreateApiauthDto {
  @IsNotEmpty()
  readonly id: number;
}
export class QeuryApiauthListDTO extends PageQuery {
  readonly name?: string;
}
export class QueryApiauthListResponseDTO extends FormatResponse {
  readonly data: Apiauth[];
  readonly total: number;
}
