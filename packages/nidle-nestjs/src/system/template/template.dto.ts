import { IsNotEmpty } from 'class-validator';

import { PageQuery, FormatResponse } from 'src/common/base.dto';
import { Template } from './template.entity';

export class CreateTemplateDto {
  @IsNotEmpty()
  readonly name: string;
  readonly description?: string;
  @IsNotEmpty()
  readonly config: string;
}
export class CreateTemplateResponseDto extends FormatResponse {
  readonly id: number;
  readonly name: string;
}

export class QueryTemplateListDTO extends PageQuery {
  readonly name?: string;
  readonly description?: string;
}
class TemplatePicked {
  readonly id: number;
  readonly name?: string;
  readonly description?: string;
}
export class QueryTemplateListResponseDTO extends FormatResponse {
  readonly data: TemplatePicked[];
  readonly total: number;
}

export class QueryTemplateResponseDTO extends FormatResponse {
  readonly data: Template;
}

export class UpdateTemplateDto extends CreateTemplateDto {
  @IsNotEmpty()
  readonly id: number;
}
