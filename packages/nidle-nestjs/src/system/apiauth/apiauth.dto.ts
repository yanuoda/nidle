import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { FormatResponse, PageQuery } from 'src/common/base.dto';
import { Apiauth } from './apiauth.entity';

export class CreateApiauthDto {
  @IsNotEmpty()
  readonly name: string;
  readonly status?: number;
  readonly description?: string;
}
export class UpdateApiauthDto extends PartialType(CreateApiauthDto) {
  @IsNotEmpty()
  readonly id: number;
  readonly lastInvokeTime?: Date;
}
export class QeuryApiauthListDTO extends PageQuery {
  readonly name?: string;
}
export class QueryApiauthListResponseDTO extends FormatResponse {
  readonly data: Apiauth[];
  readonly total: number;
}
